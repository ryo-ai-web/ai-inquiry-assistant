import { describe, expect, it } from "vitest";
import { ruleBasedAnalysis } from "@/lib/rule-based";
import { normalizeAnalysis } from "@/lib/schema";

describe("ruleBasedAnalysis（デモモードの簡易判定）", () => {
  it("不具合の文面は「不具合・苦情」かつ重要度「高」", () => {
    const r = ruleBasedAnalysis("ログインしようとするとエラーが出て使えません。至急確認してください。");
    expect(r.category).toBe("complaint");
    expect(r.priority).toBe("high");
  });
  it("見積もりの文面は「見積もり依頼」", () => {
    expect(ruleBasedAnalysis("10名で利用する場合のお見積もりをお願いします。").category).toBe("quote_request");
  });
  it("営業の文面は重要度「低」", () => {
    const r = ruleBasedAnalysis("突然のご連絡失礼いたします。弊社サービスのご提案です。");
    expect(r.category).toBe("sales_pitch");
    expect(r.priority).toBe("low");
  });
  it("キーワードがなければ「その他」", () => {
    expect(ruleBasedAnalysis("先日はありがとうございました。引き続きよろしくお願いします。").category).toBe("other");
  });
  it("AI未使用であることを理由に明記し、スキーマにも適合する", () => {
    const r = ruleBasedAnalysis("機能について教えてください。よろしくお願いします。");
    expect(r.categoryReason).toContain("AI未使用");
    expect(normalizeAnalysis(r)).not.toBeNull();
  });
});
