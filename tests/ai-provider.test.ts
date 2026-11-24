import OpenAI from "openai";
import { describe, expect, it } from "vitest";
import { getModel, getProvider, isAiConfigured, openAiJsonSchema, toAiError } from "@/lib/ai";

const env = (v: Record<string, string>) => v as unknown as NodeJS.ProcessEnv;

describe("getProvider（使うAIの選び方）", () => {
  it("キーがなければ使えない", () => {
    expect(getProvider(env({}))).toBeNull();
    expect(isAiConfigured(env({ OPENAI_API_KEY: "  " }))).toBe(false);
  });
  it("OpenAIのキーだけなら OpenAI", () => {
    expect(getProvider(env({ OPENAI_API_KEY: "sk-x" }))).toBe("openai");
  });
  it("両方あれば Claude を優先", () => {
    expect(getProvider(env({ OPENAI_API_KEY: "sk-x", ANTHROPIC_API_KEY: "sk-ant-x" }))).toBe("anthropic");
  });
  it("AI_PROVIDER で明示できる。指定先のキーがなければ使えない", () => {
    expect(getProvider(env({ AI_PROVIDER: "openai", OPENAI_API_KEY: "sk-x", ANTHROPIC_API_KEY: "sk-ant-x" }))).toBe("openai");
    expect(getProvider(env({ AI_PROVIDER: "openai", ANTHROPIC_API_KEY: "sk-ant-x" }))).toBeNull();
  });
});

describe("getModel", () => {
  it("提供元ごとの既定モデルと、上書き", () => {
    expect(getModel(env({ OPENAI_API_KEY: "sk-x" }))).toBe("gpt-5-mini");
    expect(getModel(env({ OPENAI_API_KEY: "sk-x", OPENAI_MODEL: "gpt-x" }))).toBe("gpt-x");
    expect(getModel(env({ ANTHROPIC_API_KEY: "k", ANTHROPIC_MODEL: "claude-x" }))).toBe("claude-x");
  });
});

describe("openAiJsonSchema（strict モード用）", () => {
  it("すべてのオブジェクトで全項目が必須、追加の項目は不可", () => {
    const s = openAiJsonSchema() as {
      $schema?: string;
      additionalProperties: boolean;
      required: string[];
      properties: Record<string, { additionalProperties?: boolean; required?: string[] }>;
    };
    expect(s.$schema).toBeUndefined();
    expect(s.additionalProperties).toBe(false);
    expect(s.required).toEqual(Object.keys(s.properties));
    expect(s.properties.replies.additionalProperties).toBe(false);
    expect(s.properties.replies.required).toEqual(["polite", "concise", "friendly"]);
  });
});

describe("toAiError（OpenAI SDK の例外の変換）", () => {
  it("接続エラー・時間切れを区別する", () => {
    expect(toAiError(new OpenAI.APIConnectionError({ message: "x" })).code).toBe("AI_UNAVAILABLE");
    expect(toAiError(new OpenAI.APIConnectionTimeoutError()).code).toBe("AI_TIMEOUT");
  });
  it("その他の OpenAI のエラーは想定外の応答として扱う", () => {
    expect(toAiError(new OpenAI.OpenAIError("parse failed")).code).toBe("AI_INVALID_RESPONSE");
  });
});
