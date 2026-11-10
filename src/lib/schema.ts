import { z } from "zod";

/** 問い合わせの分類 */
export const CATEGORIES = [
  "product_question",
  "quote_request",
  "complaint",
  "sales_pitch",
  "other",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  product_question: "商品・サービスについての質問",
  quote_request: "見積もり依頼",
  complaint: "不具合・苦情",
  sales_pitch: "営業・提案",
  other: "その他",
};

/** 重要度 */
export const PRIORITIES = ["high", "medium", "low"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const PRIORITY_LABELS: Record<Priority, string> = {
  high: "高",
  medium: "中",
  low: "低",
};

/** 返信トーン */
export const TONES = ["polite", "concise", "friendly"] as const;
export type Tone = (typeof TONES)[number];

export const TONE_LABELS: Record<Tone, string> = {
  polite: "丁寧",
  concise: "簡潔",
  friendly: "親しみやすい",
};

/**
 * AIに出力させる構造。
 * Structured Outputs の JSON Schema に変換されるため、enum / string / array のみで構成する。
 * 文字数や件数の制約は normalizeAnalysis() 側で検証する。
 */
export const AnalysisSchema = z.object({
  category: z.enum(CATEGORIES),
  categoryReason: z.string(),
  summary: z.string(),
  priority: z.enum(PRIORITIES),
  priorityReason: z.string(),
  actionItems: z.array(z.string()),
  pointsToConfirm: z.array(z.string()),
  replies: z.object({
    polite: z.string(),
    concise: z.string(),
    friendly: z.string(),
  }),
});

export type Analysis = z.infer<typeof AnalysisSchema>;

/** 結果の出どころ。画面上で「AIによる結果か」を明示するために使う */
export type ResultSource = "ai" | "demo-sample" | "demo-rule";

export type AnalyzeSuccess = {
  ok: true;
  source: ResultSource;
  result: Analysis;
  model?: string;
  elapsedMs: number;
};

export type ErrorCode =
  | "EMPTY_INPUT"
  | "TOO_SHORT"
  | "TOO_LONG"
  | "BAD_REQUEST"
  | "AI_NOT_CONFIGURED"
  | "ACCESS_CODE_REQUIRED"
  | "RATE_LIMITED"
  | "AI_AUTH_ERROR"
  | "AI_UNAVAILABLE"
  | "AI_TIMEOUT"
  | "AI_REFUSED"
  | "AI_INVALID_RESPONSE"
  | "UNKNOWN";

export type AnalyzeFailure = {
  ok: false;
  error: { code: ErrorCode; message: string };
};

export type AnalyzeResponse = AnalyzeSuccess | AnalyzeFailure;

export type StatusResponse = {
  aiAvailable: boolean;
  accessCodeRequired: boolean;
  model: string | null;
};

/** 入力の制約 */
export const INPUT_LIMITS = {
  min: 10,
  max: 3000,
} as const;

const MAX_ITEMS = 8;
const MAX_FIELD = 2000;

const clean = (s: string) => s.replace(/\r\n/g, "\n").trim();

/**
 * AIの応答を画面表示用に正規化する。
 * スキーマ上は正しくても中身が空・過大などの「想定外の応答」はここで弾く。
 */
export function normalizeAnalysis(raw: unknown): Analysis | null {
  const parsed = AnalysisSchema.safeParse(raw);
  if (!parsed.success) return null;
  const a = parsed.data;

  const list = (xs: string[]) =>
    xs
      .map(clean)
      .filter((x) => x.length > 0)
      .slice(0, MAX_ITEMS)
      .map((x) => x.slice(0, 300));

  const result: Analysis = {
    category: a.category,
    categoryReason: clean(a.categoryReason).slice(0, 300),
    summary: clean(a.summary).slice(0, 600),
    priority: a.priority,
    priorityReason: clean(a.priorityReason).slice(0, 300),
    actionItems: list(a.actionItems),
    pointsToConfirm: list(a.pointsToConfirm),
    replies: {
      polite: clean(a.replies.polite).slice(0, MAX_FIELD),
      concise: clean(a.replies.concise).slice(0, MAX_FIELD),
      friendly: clean(a.replies.friendly).slice(0, MAX_FIELD),
    },
  };

  // 必須の中身が空なら表示できないので失敗扱い
  if (
    !result.summary ||
    !result.replies.polite ||
    !result.replies.concise ||
    !result.replies.friendly
  ) {
    return null;
  }
  return result;
}

/** 入力チェック。問題がなければ null */
export function validateInput(
  text: unknown,
): { code: ErrorCode; message: string } | null {
  if (typeof text !== "string") {
    return { code: "BAD_REQUEST", message: "リクエストの形式が正しくありません。" };
  }
  const t = text.trim();
  if (t.length === 0) {
    return { code: "EMPTY_INPUT", message: "問い合わせ内容を入力してください。" };
  }
  if (t.length < INPUT_LIMITS.min) {
    return {
      code: "TOO_SHORT",
      message: `内容が短すぎるため判定できません。${INPUT_LIMITS.min}文字以上で入力してください。`,
    };
  }
  if (t.length > INPUT_LIMITS.max) {
    return {
      code: "TOO_LONG",
      message: `${INPUT_LIMITS.max.toLocaleString()}文字以内で入力してください（現在 ${t.length.toLocaleString()}文字）。`,
    };
  }
  return null;
}
