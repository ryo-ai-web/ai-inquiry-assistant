import Anthropic from "@anthropic-ai/sdk";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AiError, toAiError } from "@/lib/ai";
import { handleAnalyze } from "@/lib/analyze-handler";
import { resetRateLimit } from "@/lib/rate-limit";
import { SAMPLES } from "@/lib/samples";
import type { Analysis } from "@/lib/schema";

const sample = SAMPLES[0];
const okResult: Analysis = sample.exampleResult;

beforeEach(() => {
  resetRateLimit();
  vi.unstubAllEnvs();
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("デモモード", () => {
  it("サンプルと同じ本文なら、用意した出力例を返す", async () => {
    const r = await handleAnalyze({ text: sample.text, mode: "demo", sampleId: sample.id }, "t");
    expect(r.status).toBe(200);
    expect(r.body.ok && r.body.source).toBe("demo-sample");
  });
  it("サンプルを編集した本文なら、出力例ではなく簡易判定を返す", async () => {
    const r = await handleAnalyze({ text: sample.text + "\n追加の質問です。", mode: "demo", sampleId: sample.id }, "t");
    expect(r.body.ok && r.body.source).toBe("demo-rule");
  });
  it("自由入力は簡易判定を返す", async () => {
    const r = await handleAnalyze({ text: "料金プランの違いを教えてください。", mode: "demo" }, "t");
    expect(r.body.ok && r.body.source).toBe("demo-rule");
  });
});

describe("入力チェック", () => {
  it("空欄は 400", async () => {
    const r = await handleAnalyze({ text: "", mode: "demo" }, "t");
    expect(r.status).toBe(400);
    expect(!r.body.ok && r.body.error.code).toBe("EMPTY_INPUT");
  });
  it("text がない／型が違うリクエストは 400", async () => {
    expect((await handleAnalyze({ mode: "ai" }, "t")).status).toBe(400);
    expect((await handleAnalyze({ text: ["a"], mode: "ai" }, "t")).status).toBe(400);
  });
});

describe("AIモード", () => {
  it("APIキー未設定なら AI_NOT_CONFIGURED", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "");
    const analyze = vi.fn();
    const r = await handleAnalyze({ text: sample.text, mode: "ai" }, "t", { analyze });
    expect(r.status).toBe(503);
    expect(!r.body.ok && r.body.error.code).toBe("AI_NOT_CONFIGURED");
    expect(analyze).not.toHaveBeenCalled();
  });

  it("成功時は source=ai とモデル名を返す", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "test-key");
    const analyze = vi.fn().mockResolvedValue({ result: okResult, model: "claude-test" });
    const r = await handleAnalyze({ text: sample.text, mode: "ai" }, "t", { analyze });
    expect(r.status).toBe(200);
    expect(r.body.ok && r.body.source).toBe("ai");
    expect(r.body.ok && r.body.model).toBe("claude-test");
  });

  it("アクセスコードが設定されていれば、一致しない場合は 401", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "test-key");
    vi.stubEnv("AI_ACCESS_CODE", "secret-code");
    const analyze = vi.fn().mockResolvedValue({ result: okResult, model: "m" });
    expect((await handleAnalyze({ text: sample.text, mode: "ai" }, "t", { analyze })).status).toBe(401);
    expect((await handleAnalyze({ text: sample.text, mode: "ai", accessCode: "wrong" }, "t", { analyze })).status).toBe(401);
    expect((await handleAnalyze({ text: sample.text, mode: "ai", accessCode: "secret-code" }, "t", { analyze })).status).toBe(200);
  });

  it("回数制限を超えると 429", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "test-key");
    vi.stubEnv("AI_RATE_LIMIT_PER_HOUR", "2");
    const analyze = vi.fn().mockResolvedValue({ result: okResult, model: "m" });
    await handleAnalyze({ text: sample.text, mode: "ai" }, "ip1", { analyze });
    await handleAnalyze({ text: sample.text, mode: "ai" }, "ip1", { analyze });
    const third = await handleAnalyze({ text: sample.text, mode: "ai" }, "ip1", { analyze });
    expect(third.status).toBe(429);
    // 別の利用者は制限されない
    expect((await handleAnalyze({ text: sample.text, mode: "ai" }, "ip2", { analyze })).status).toBe(200);
  });

  it("AIのエラーは種類に応じたコードとメッセージを返す", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "test-key");
    const analyze = vi.fn().mockRejectedValue(new AiError("AI_INVALID_RESPONSE", "想定外の形式"));
    const r = await handleAnalyze({ text: sample.text, mode: "ai" }, "t", { analyze });
    expect(r.status).toBe(502);
    expect(!r.body.ok && r.body.error.code).toBe("AI_INVALID_RESPONSE");
  });

  it("予期しない例外でも内部情報を漏らさず UNKNOWN を返す", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "test-key");
    const analyze = vi.fn().mockRejectedValue(new Error("secret stack trace"));
    const r = await handleAnalyze({ text: sample.text, mode: "ai" }, "t", { analyze });
    expect(r.status).toBe(500);
    expect(!r.body.ok && r.body.error.message).not.toContain("secret");
  });

  it("エラーログに問い合わせ本文を出力しない", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "test-key");
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const analyze = vi.fn().mockRejectedValue(new AiError("AI_TIMEOUT", "timeout"));
    await handleAnalyze({ text: sample.text, mode: "ai" }, "t", { analyze });
    const logged = spy.mock.calls.flat().join(" ");
    expect(logged).not.toContain("美容室");
  });
});

describe("toAiError（SDKの例外の変換）", () => {
  it("接続エラーは AI_UNAVAILABLE", () => {
    expect(toAiError(new Anthropic.APIConnectionError({ message: "x" })).code).toBe("AI_UNAVAILABLE");
  });
  it("タイムアウトは AI_TIMEOUT", () => {
    expect(toAiError(new Anthropic.APIConnectionTimeoutError()).code).toBe("AI_TIMEOUT");
  });
  it("SDKが応答を解析できない場合は AI_INVALID_RESPONSE", () => {
    expect(toAiError(new Anthropic.AnthropicError("Failed to parse structured output")).code).toBe("AI_INVALID_RESPONSE");
  });
  it("認証エラーは AI_AUTH_ERROR", () => {
    const e = Anthropic.APIError.generate(401, { error: { message: "invalid x-api-key" } }, undefined, new Headers());
    expect(toAiError(e).code).toBe("AI_AUTH_ERROR");
  });
  it("不明な例外は UNKNOWN", () => {
    expect(toAiError("oops").code).toBe("UNKNOWN");
  });
});
