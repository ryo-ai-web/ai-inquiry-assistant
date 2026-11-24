/**
 * 架空の問い合わせ30件を、AIモード（アプリと同じ analyzeWithAi）で採点するスクリプト。
 * .env.local の ANTHROPIC_API_KEY または OPENAI_API_KEY を使います。30回APIを呼ぶため、少額ですが料金がかかります。
 *
 * 実行: npm run eval:ai
 * 結果: docs/eval/ai-result.json（APIキーや返信案の本文は含めません）
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { EVAL_CASES } from "../src/content/eval-inquiries";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");
const { analyzeWithAi, getProvider } = await import("../src/lib/ai");
const provider = getProvider();
if (!provider) {
  console.error(".env.local に ANTHROPIC_API_KEY または OPENAI_API_KEY が設定されていません。");
  process.exit(1);
}
console.log(`使用するAI: ${provider === "openai" ? "OpenAI" : "Claude"}`);

type Row = {
  id: string;
  expected: { category: string; priority: string };
  got?: { category: string; priority: string; categoryReason: string; priorityReason: string };
  error?: string;
  ms: number;
};

const CONCURRENCY = 3;
const rows: Row[] = new Array(EVAL_CASES.length);
let next = 0;
let model = "";

async function worker() {
  while (next < EVAL_CASES.length) {
    const i = next++;
    const c = EVAL_CASES[i];
    const t0 = Date.now();
    try {
      const { result, model: m } = await analyzeWithAi(c.text);
      model = m;
      rows[i] = {
        id: c.id,
        expected: { category: c.category, priority: c.priority },
        got: { category: result.category, priority: result.priority, categoryReason: result.categoryReason, priorityReason: result.priorityReason },
        ms: Date.now() - t0,
      };
    } catch (e) {
      rows[i] = { id: c.id, expected: { category: c.category, priority: c.priority }, error: e instanceof Error ? e.message : String(e), ms: Date.now() - t0 };
    }
    const r = rows[i];
    const mark = r.error ? `エラー: ${r.error}` : `${r.got!.category === c.category ? "○" : "×"}${r.got!.priority === c.priority ? "○" : "×"}`;
    console.log(`${c.id}\t${mark}\t${(r.ms / 1000).toFixed(1)}s`);
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker));

const ok = rows.filter((r) => r.got);
const categoryCorrect = ok.filter((r) => r.got!.category === r.expected.category).length;
const priorityCorrect = ok.filter((r) => r.got!.priority === r.expected.priority).length;
const times = ok.map((r) => r.ms).sort((a, b) => a - b);
const median = times.length ? times[Math.floor(times.length / 2)] : 0;

const summary = {
  date: new Date().toISOString().slice(0, 10),
  provider,
  model,
  total: EVAL_CASES.length,
  errors: rows.length - ok.length,
  categoryCorrect,
  priorityCorrect,
  medianSeconds: Math.round(median / 100) / 10,
  rows,
};

mkdirSync("docs/eval", { recursive: true });
writeFileSync("docs/eval/ai-result.json", JSON.stringify(summary, null, 2) + "\n");
console.log(`\nモデル: ${model}`);
console.log(`分類: ${categoryCorrect}/${EVAL_CASES.length}  重要度: ${priorityCorrect}/${EVAL_CASES.length}  エラー: ${summary.errors}  所要時間の中央値: ${summary.medianSeconds}秒`);
