import type { Category, Priority } from "@/lib/schema";

/**
 * 判定の確認用に作った架空の問い合わせ30件（実在の人物・企業とは関係ありません）。
 * 正解ラベルは制作者が付けたものです。
 * わざと判定しにくい文面（キーワードを含まない不具合報告、質問の形をした営業メールなど）を混ぜています。
 */
export type EvalCase = { id: string; text: string; category: Category; priority: Priority; note?: string };

export const EVAL_CASES: EvalCase[] = [
  // --- 商品・サービスについての質問 ---
  { id: "q1", category: "product_question", priority: "medium", text: "予約システムはスマホからも予約できますか？お客様の大半がスマホなので気になっています。" },
  { id: "q2", category: "product_question", priority: "medium", text: "お世話になります。\nCSVで顧客データを書き出す機能はありますか。今使っているソフトから乗り換えを考えています。" },
  { id: "q3", category: "product_question", priority: "low", text: "資料請求ページが見当たらなかったので、こちらから失礼します。サービス概要の資料があれば送ってください。" },
  { id: "q4", category: "product_question", priority: "medium", text: "スタッフが10人いるのですが、アカウントは人数分必要でしょうか。", note: "疑問文だが「？」なし" },
  { id: "q5", category: "product_question", priority: "medium", text: "無料トライアル中に登録したデータは、本契約後もそのまま使えますか？" },
  { id: "q6", category: "product_question", priority: "high", text: "来週から新店舗がオープンするので、それまでに複数店舗の設定方法を知りたいです。マニュアルなどありますか。" },

  // --- 見積もり依頼 ---
  { id: "e1", category: "quote_request", priority: "high", text: "5店舗分の年間契約で見積もりをお願いします。今月中に稟議を出したいです。" },
  { id: "e2", category: "quote_request", priority: "medium", text: "10店舗で使う場合、月々いくらくらいになりますか？", note: "「見積」という語なし" },
  { id: "e3", category: "quote_request", priority: "medium", text: "初期設定の代行もお願いできるならその分も含めた金額を知りたいです。" },
  { id: "e4", category: "quote_request", priority: "high", text: "3社で比較検討しています。11月20日までに概算をいただけると助かります。" },
  { id: "e5", category: "quote_request", priority: "medium", text: "NPO法人ですが、団体向けの割引はありますか。あれば条件と金額を教えてください。" },
  { id: "e6", category: "quote_request", priority: "low", text: "来年度の予算取りのため、ざっくりで構わないので費用感を教えてください。急ぎではありません。", note: "「急ぎではありません」" },

  // --- 不具合・苦情 ---
  { id: "c1", category: "complaint", priority: "high", text: "今朝から予約画面が開けません。お客様から電話が来ていて困っています。至急確認してください。" },
  { id: "c2", category: "complaint", priority: "high", text: "管理画面にログインすると真っ白なまま何も表示されません。昨日の夜からずっとです。", note: "定番のキーワードなし" },
  { id: "c3", category: "complaint", priority: "high", text: "先月の請求額が契約プランより高くなっています。説明をお願いします。" },
  { id: "c4", category: "complaint", priority: "medium", text: "予約完了メールがお客様に送られていないようです。迷惑メールにも入っていないとのことでした。" },
  { id: "c5", category: "complaint", priority: "medium", text: "サポートに電話したのですが3日経っても折り返しがありません。どうなっていますか？", note: "「？」あり" },
  { id: "c6", category: "complaint", priority: "high", text: "同じ時間に2件予約が入ってしまいました。ダブルブッキングを防ぐ設定にしていたはずですが。" },

  // --- 営業・提案 ---
  { id: "s1", category: "sales_pitch", priority: "low", text: "突然のご連絡失礼いたします。弊社はWeb広告の運用代行を行っております。貴社の集客について一度ご提案させてください。" },
  { id: "s2", category: "sales_pitch", priority: "low", text: "御社のサイトを拝見しました。SEO対策について、無料でアドバイスできることがあります。15分ほどお時間いただけませんか？", note: "質問の形をした営業" },
  { id: "s3", category: "sales_pitch", priority: "low", text: "人材紹介サービスのご案内です。エンジニア採用でお困りではないでしょうか。" },
  { id: "s4", category: "sales_pitch", priority: "low", text: "貴社サービスと弊社のPOSレジを連携できないかと考えております。協業の可能性についてお話しできれば幸いです。" },
  { id: "s5", category: "sales_pitch", priority: "low", text: "ホームページの表示速度が遅いようです。改善のお手伝いができます。", note: "「遅い」を含む" },
  { id: "s6", category: "sales_pitch", priority: "low", text: "展示会出展のご案内です。来年2月の業界向け展示会に、出展企業を募集しています。" },

  // --- その他 ---
  { id: "o1", category: "other", priority: "low", text: "業界誌の編集部です。中小店舗のDXについて取材させていただけないでしょうか。" },
  { id: "o2", category: "other", priority: "medium", text: "求人ページを見て連絡しました。カスタマーサポート職に応募したいです。" },
  { id: "o3", category: "other", priority: "medium", text: "経理担当です。10月分の請求書を再発行していただけますか。宛名を変更したいです。" },
  { id: "o4", category: "other", priority: "medium", text: "来月で解約したいのですが、手続きの方法を教えてください。" },
  { id: "o5", category: "other", priority: "low", text: "先日はご対応ありがとうございました。おかげさまで無事に運用できています。" },
  { id: "o6", category: "other", priority: "medium", text: "担当の方が変わったと聞きました。今後の連絡先を教えてください。" },
];
