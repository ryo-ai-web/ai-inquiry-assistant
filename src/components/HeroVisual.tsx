import { IconArrowRight, IconInbox, IconPen } from "./Icons";

/**
 * ヒーロー用のイメージ図（HTMLで描いた製品イメージ）。
 * 実際の画面ではなく、機能の流れを表す装飾なので読み上げ対象から外す。
 */
export function HeroVisual() {
  const rows = [
    { title: "予約画面が開けません", tag: "不具合・苦情", level: "高", tone: "bg-high-soft text-high" },
    { title: "年間契約のお見積もり", tag: "見積もり依頼", level: "高", tone: "bg-high-soft text-high" },
    { title: "シフト管理について", tag: "サービスの質問", level: "中", tone: "bg-mid-soft text-mid" },
    { title: "広告運用のご提案", tag: "営業・提案", level: "低", tone: "bg-low-soft text-low" },
  ];
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-[460px] select-none">
      {/* 受信一覧 */}
      <div className="rounded-2xl bg-white p-4 shadow-[var(--shadow-card)] ring-1 ring-line/60">
        <div className="flex items-center gap-2 border-b border-line pb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-soft text-brand [&>svg]:h-4 [&>svg]:w-4">
            <IconInbox />
          </span>
          <span className="text-[13px] font-bold">届いた問い合わせ</span>
          <span className="ml-auto rounded-full bg-brand px-2 py-0.5 text-[11px] font-bold text-white">自動で整理</span>
        </div>
        <ul className="mt-2 divide-y divide-line">
          {rows.map((r) => (
            <li key={r.title} className="flex items-center gap-2 py-2.5">
              <span className="min-w-0 flex-1 truncate text-[13px] font-medium">{r.title}</span>
              <span className="shrink-0 rounded-md border border-brand/30 bg-brand-soft px-1.5 py-0.5 text-[10.5px] font-bold text-brand-dark">{r.tag}</span>
              <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10.5px] font-bold ${r.tone}`}>{r.level}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 返信の下書き */}
      <div className="relative -mt-6 ml-auto w-[78%] rounded-2xl bg-white p-4 shadow-[var(--shadow-card)] ring-1 ring-line/60 sm:-mr-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/30 text-[#8a6300] [&>svg]:h-4 [&>svg]:w-4">
            <IconPen />
          </span>
          <span className="text-[13px] font-bold">返信の下書き</span>
          <span className="ml-auto flex gap-1 text-[10.5px] font-bold">
            <span className="rounded-full bg-ink px-2 py-0.5 text-white">丁寧</span>
            <span className="rounded-full bg-paper px-2 py-0.5 text-muted">簡潔</span>
          </span>
        </div>
        <div className="mt-3 space-y-1.5">
          <div className="h-2 w-11/12 rounded bg-line" />
          <div className="h-2 w-4/5 rounded bg-line" />
          <div className="flex items-center gap-1.5">
            <span className="rounded bg-mid-soft px-1.5 text-[10.5px] font-bold text-mid">【要確認：復旧見込み】</span>
            <div className="h-2 flex-1 rounded bg-line" />
          </div>
          <div className="h-2 w-2/3 rounded bg-line" />
        </div>
        <div className="mt-3 flex items-center justify-end gap-1 text-[11px] font-bold text-brand">
          確認してからコピー <IconArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
}
