/**
 * 制作者情報・公開URL。
 * 公開前に必ずご自身の情報へ書き換えてください（README「公開前チェックリスト」参照）。
 * URL は環境変数でも上書きできます。
 */
export const PROFILE = {
  /** 表示名（本名・ハンドルネームどちらでも可） */
  displayName: process.env.NEXT_PUBLIC_AUTHOR_NAME || "Ryo",
  /** 肩書き */
  role: "AI・Web開発（生成AIによる業務効率化／Webアプリ開発）",
  /** 経歴（会社・チームの実績ではなく、個人の経験のみ記載） */
  experience: [
    { label: "コーディング経験", value: "1年半" },
    { label: "バックエンド開発", value: "1年" },
    { label: "生成AIの業務活用", value: "2年以上" },
  ],
  skills: ["Next.js", "React", "TypeScript", "JavaScript", "HTML", "CSS", "生成AI API"],
  /** 公開デモのURL（Vercelにデプロイ後に設定） */
  demoUrl: process.env.NEXT_PUBLIC_DEMO_URL || "https://ai-inquiry-assistant-xi.vercel.app",
  /** ソースコードのURL（GitHub公開後に設定） */
  sourceUrl: process.env.NEXT_PUBLIC_SOURCE_URL || "https://github.com/ryo-ai-web/ai-inquiry-assistant",
  /** 相談窓口のURL（クラウドワークス／ランサーズのプロフィール、問い合わせフォームなど） */
  contactUrl: process.env.NEXT_PUBLIC_CONTACT_URL || "",
  contactLabel: process.env.NEXT_PUBLIC_CONTACT_LABEL || "お問い合わせ",
} as const;
