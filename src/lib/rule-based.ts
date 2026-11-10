import type { Analysis, Category, Priority } from "./schema";

/**
 * デモモード用の簡易判定（AIは使用しません）。
 * キーワードの出現で分類・重要度を決め、返信はテンプレートで組み立てます。
 * 「AIを使わない場合にどこまでできるか」の比較対象でもあります。
 */

const RULES: { category: Category; words: string[] }[] = [
  {
    category: "complaint",
    words: ["不具合", "エラー", "できません", "開けません", "動かない", "困って", "至急", "苦情", "返金", "壊れ", "届かない", "遅い", "障害", "改善してほしい"],
  },
  {
    category: "quote_request",
    words: ["見積", "お見積", "費用", "料金", "価格", "予算", "金額", "年間契約", "発注"],
  },
  {
    category: "sales_pitch",
    words: ["ご提案", "突然のご連絡", "弊社サービス", "営業", "無料診断", "お役に立て", "協業", "パートナー"],
  },
  {
    category: "product_question",
    words: ["教えて", "できますか", "可能でしょうか", "機能", "使い方", "導入", "対応していますか", "トライアル", "?", "？"],
  },
];

const URGENT_WORDS = ["至急", "緊急", "今すぐ", "すぐに", "本日中", "今日中", "困って", "できません", "エラー", "障害"];
const DEADLINE_PATTERN = /(\d{1,2}月\d{1,2}日|\d{1,2}日まで|今月|来週|明日|今週)/;

function score(text: string, words: string[]) {
  return words.reduce((n, w) => (text.includes(w) ? n + 1 : n), 0);
}

export function ruleBasedAnalysis(input: string): Analysis {
  const text = input.trim();

  let category: Category = "other";
  let best = 0;
  for (const rule of RULES) {
    const s = score(text, rule.words);
    if (s > best) {
      best = s;
      category = rule.category;
    }
  }

  const urgent = score(text, URGENT_WORDS) > 0;
  const deadline = DEADLINE_PATTERN.test(text);
  let priority: Priority = "medium";
  if (category === "sales_pitch") priority = "low";
  else if (urgent || (deadline && category === "quote_request")) priority = "high";
  else if (category === "other") priority = "low";

  const firstLines = text
    .split(/\n+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !/^(お世話になって|はじめまして|突然の)/.test(l));
  const head = firstLines.slice(0, 2).join(" ");
  const summary = `（簡易判定のため要約は行わず、本文の冒頭を表示しています）${head.slice(0, 120)}${head.length > 120 ? "…" : ""}`;

  const actionsByCategory: Record<Category, string[]> = {
    product_question: ["質問内容を確認し、回答を用意する", "必要に応じて資料やデモの案内を検討する"],
    quote_request: ["見積もりに必要な条件（規模・期間・要件）を確認する", "提出期限を確認し、見積書を作成する"],
    complaint: ["状況を担当部署へ共有する", "まずお詫びと受付の連絡を返す", "原因と対応方針を確認する"],
    sales_pitch: ["提案内容が必要か社内で判断する", "不要であれば丁寧にお断りする"],
    other: ["問い合わせの目的を確認し、担当者を決める"],
  };

  const subject = "お問い合わせの件";
  const replies: Analysis["replies"] = {
    polite: `【お客様名】様

このたびはお問い合わせいただき、誠にありがとうございます。
【会社名】の【担当者名】でございます。

${subject}、確かに承りました。
【要確認：具体的な回答内容】

ご不明な点がございましたら、お気軽にお申し付けください。
何卒よろしくお願い申し上げます。`,
    concise: `【お客様名】様

お問い合わせありがとうございます。【会社名】の【担当者名】です。
${subject}、承知しました。

【要確認：具体的な回答内容】

よろしくお願いいたします。`,
    friendly: `【お客様名】様

お問い合わせありがとうございます！【会社名】の【担当者名】です。
${subject}、確認しました。

【要確認：具体的な回答内容】

ほかにも気になることがあれば、気軽に聞いてくださいね。`,
  };

  if (category === "complaint") {
    replies.polite = replies.polite.replace(
      "このたびはお問い合わせいただき、誠にありがとうございます。",
      "このたびはご不便をおかけしており、誠に申し訳ございません。",
    );
    replies.concise = replies.concise.replace(
      "お問い合わせありがとうございます。",
      "ご迷惑をおかけし申し訳ございません。",
    );
    replies.friendly = replies.friendly.replace(
      "お問い合わせありがとうございます！",
      "ご不便をおかけして申し訳ありません。",
    );
  }

  return {
    category,
    categoryReason:
      best > 0
        ? "本文に含まれるキーワードから簡易的に判定しました（AI未使用）。"
        : "判定に使えるキーワードが見つからなかったため「その他」としました（AI未使用）。",
    summary,
    priority,
    priorityReason: urgent
      ? "緊急性を示す言葉が含まれているため「高」としました（AI未使用）。"
      : deadline
        ? "期限を示す表現が含まれているため判定に反映しました（AI未使用）。"
        : "緊急性を示す言葉が見つからなかったため、分類に応じて判定しました（AI未使用）。",
    actionItems: actionsByCategory[category],
    pointsToConfirm: ["簡易判定のため、文面の意図を必ず人が確認してください"],
    replies,
  };
}
