import { describe, expect, it } from "vitest";
import { normalizeAnalysis, validateInput, INPUT_LIMITS } from "@/lib/schema";
import { SAMPLES } from "@/lib/samples";

const valid = {
  category: "quote_request",
  categoryReason: " 見積もり依頼のため。 ",
  summary: "要約です。",
  priority: "high",
  priorityReason: "期限があるため。",
  actionItems: ["見積もりを作成する", "  ", "期限を確認する"],
  pointsToConfirm: [],
  replies: { polite: "丁寧な返信", concise: "簡潔な返信", friendly: "親しみやすい返信" },
};

describe("validateInput", () => {
  it("空欄・空白のみはエラー", () => {
    expect(validateInput("")?.code).toBe("EMPTY_INPUT");
    expect(validateInput("   \n\t ")?.code).toBe("EMPTY_INPUT");
  });
  it("短すぎる入力はエラー", () => {
    expect(validateInput("こんにちは")?.code).toBe("TOO_SHORT");
  });
  it("長すぎる入力はエラー", () => {
    expect(validateInput("あ".repeat(INPUT_LIMITS.max + 1))?.code).toBe("TOO_LONG");
  });
  it("文字列以外はエラー", () => {
    expect(validateInput(123)?.code).toBe("BAD_REQUEST");
    expect(validateInput(undefined)?.code).toBe("BAD_REQUEST");
  });
  it("適切な長さなら null", () => {
    expect(validateInput("料金プランについて教えてください。")).toBeNull();
  });
});

describe("normalizeAnalysis", () => {
  it("正しい形式は整形して返す（空の項目は除去・前後の空白を削除）", () => {
    const r = normalizeAnalysis(valid);
    expect(r).not.toBeNull();
    expect(r!.categoryReason).toBe("見積もり依頼のため。");
    expect(r!.actionItems).toEqual(["見積もりを作成する", "期限を確認する"]);
  });
  it("想定外の分類値は null", () => {
    expect(normalizeAnalysis({ ...valid, category: "spam" })).toBeNull();
  });
  it("項目の欠けは null", () => {
    const { summary: _omit, ...rest } = valid;
    void _omit;
    expect(normalizeAnalysis(rest)).toBeNull();
  });
  it("要約や返信案が空なら null", () => {
    expect(normalizeAnalysis({ ...valid, summary: "  " })).toBeNull();
    expect(normalizeAnalysis({ ...valid, replies: { ...valid.replies, friendly: "" } })).toBeNull();
  });
  it("null や文字列は null", () => {
    expect(normalizeAnalysis(null)).toBeNull();
    expect(normalizeAnalysis("{}")).toBeNull();
  });
  it("対応事項は最大8件に制限", () => {
    const r = normalizeAnalysis({ ...valid, actionItems: Array.from({ length: 20 }, (_, i) => `項目${i}`) });
    expect(r!.actionItems).toHaveLength(8);
  });
});

describe("サンプルデータ", () => {
  it("すべてのサンプル出力例がスキーマに適合し、入力チェックも通る", () => {
    for (const s of SAMPLES) {
      expect(validateInput(s.text), s.id).toBeNull();
      expect(normalizeAnalysis(s.exampleResult), s.id).not.toBeNull();
    }
  });
  it("5つの分類をすべてカバーしている", () => {
    const cats = new Set(SAMPLES.map((s) => s.exampleResult.category));
    expect(cats.size).toBe(5);
  });
});
