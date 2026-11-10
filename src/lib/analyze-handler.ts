import { timingSafeEqual } from "node:crypto";
import { AiError, analyzeWithAi, isAiConfigured } from "./ai";
import { checkRateLimit } from "./rate-limit";
import { ruleBasedAnalysis } from "./rule-based";
import { findSample, matchSampleByText } from "./samples";
import { validateInput, type AnalyzeResponse, type ErrorCode } from "./schema";

export type AnalyzeRequestBody = {
  text?: unknown;
  mode?: unknown;
  accessCode?: unknown;
  sampleId?: unknown;
};

const STATUS_BY_CODE: Partial<Record<ErrorCode, number>> = {
  EMPTY_INPUT: 400,
  TOO_SHORT: 400,
  TOO_LONG: 400,
  BAD_REQUEST: 400,
  AI_NOT_CONFIGURED: 503,
  ACCESS_CODE_REQUIRED: 401,
  RATE_LIMITED: 429,
  AI_AUTH_ERROR: 502,
  AI_UNAVAILABLE: 502,
  AI_TIMEOUT: 504,
  AI_REFUSED: 422,
  AI_INVALID_RESPONSE: 502,
  UNKNOWN: 500,
};

function fail(code: ErrorCode, message: string): { status: number; body: AnalyzeResponse } {
  return { status: STATUS_BY_CODE[code] ?? 500, body: { ok: false, error: { code, message } } };
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

/**
 * /api/analyze の本体。テストしやすいよう Request に依存しない形にしている。
 * 入力本文はログに出力しない（個人情報を含む可能性があるため）。
 */
export async function handleAnalyze(
  body: AnalyzeRequestBody,
  clientKey: string,
  deps: { analyze: typeof analyzeWithAi } = { analyze: analyzeWithAi },
): Promise<{ status: number; body: AnalyzeResponse }> {
  const started = Date.now();
  const invalid = validateInput(body.text);
  if (invalid) return fail(invalid.code, invalid.message);
  const text = (body.text as string).trim();

  const mode = body.mode === "ai" ? "ai" : "demo";

  if (mode === "demo") {
    const sample =
      (typeof body.sampleId === "string" ? findSample(body.sampleId) : undefined) ??
      matchSampleByText(text);
    // sampleId が指定されていても、本文が編集されていればサンプル結果は返さない
    if (sample && matchSampleByText(text)?.id === sample.id) {
      return {
        status: 200,
        body: { ok: true, source: "demo-sample", result: sample.exampleResult, elapsedMs: Date.now() - started },
      };
    }
    return {
      status: 200,
      body: { ok: true, source: "demo-rule", result: ruleBasedAnalysis(text), elapsedMs: Date.now() - started },
    };
  }

  if (!isAiConfigured()) {
    return fail("AI_NOT_CONFIGURED", "AI APIが設定されていないため、AIモードは利用できません。デモモードでお試しください。");
  }

  const requiredCode = process.env.AI_ACCESS_CODE?.trim();
  if (requiredCode) {
    const given = typeof body.accessCode === "string" ? body.accessCode.trim() : "";
    if (!given || !safeEqual(given, requiredCode)) {
      return fail("ACCESS_CODE_REQUIRED", "AIモードの利用にはアクセスコードが必要です。正しいコードを入力してください。");
    }
  }

  if (!checkRateLimit(clientKey)) {
    return fail("RATE_LIMITED", "短時間に多くのリクエストがあったため、一時的に制限しています。しばらく待ってからお試しください。");
  }

  try {
    const { result, model } = await deps.analyze(text);
    return { status: 200, body: { ok: true, source: "ai", result, model, elapsedMs: Date.now() - started } };
  } catch (error) {
    const e = error instanceof AiError ? error : new AiError("UNKNOWN", "予期しないエラーが発生しました。");
    // 本文は出さず、エラー種別のみ記録する
    console.error(`[analyze] ${e.code}`);
    return fail(e.code, e.message);
  }
}
