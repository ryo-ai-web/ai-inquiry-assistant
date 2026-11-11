/**
 * 架空の問い合わせ30件で、デモモードのキーワード判定を採点するスクリプト。
 * 実行: npx tsx scripts/eval-rule-based.ts
 */
import { EVAL_CASES } from "../tests/fixtures/eval-inquiries";
import { ruleBasedAnalysis } from "../src/lib/rule-based";

let cat = 0, pri = 0;
const misses: string[] = [];
for (const c of EVAL_CASES) {
  const r = ruleBasedAnalysis(c.text);
  const okC = r.category === c.category, okP = r.priority === c.priority;
  if (okC) cat++;
  if (okP) pri++;
  if (!okC || !okP)
    misses.push(`${c.id}\t分類 ${okC ? "○" : `× ${c.category}→${r.category}`}\t重要度 ${okP ? "○" : `× ${c.priority}→${r.priority}`}\t${c.note ?? ""}\t${c.text.slice(0, 30)}`);
}
console.log(`分類: ${cat}/${EVAL_CASES.length}  重要度: ${pri}/${EVAL_CASES.length}`);
console.log(misses.join("\n"));
