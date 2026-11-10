import Link from "next/link";

const NAV = [
  { href: "/", label: "デモ" },
  { href: "/works", label: "実績紹介" },
  { href: "/sheet", label: "営業資料" },
] as const;

export function SiteHeader({ current }: { current: "/" | "/works" | "/sheet" }) {
  return (
    <header className="no-print border-b border-line bg-surface/90">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Logo />
          <span className="leading-tight">
            <span className="block text-[15px] font-bold tracking-wide text-ink">問い合わせ対応アシスタント</span>
            <span className="block text-[11px] text-muted">生成AIによる一次対応の下書き支援</span>
          </span>
        </Link>
        <nav aria-label="メインメニュー" className="flex items-center gap-1 text-sm">
          {NAV.map((item) => {
            const active = item.href === current;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-md px-3 py-1.5 transition-colors ${
                  active ? "bg-brand-soft font-semibold text-brand-dark" : "text-ink-soft hover:bg-paper"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export function Logo({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" aria-hidden="true">
      <rect width="34" height="34" rx="8" fill="#1d4f7a" />
      <path d="M9 11.5h16a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5h-9l-4.5 3.5v-3.5H9A1.5 1.5 0 0 1 7.5 21v-8A1.5 1.5 0 0 1 9 11.5Z" fill="#fff" />
      <path d="M12 15.5h10M12 18.5h6" stroke="#1d4f7a" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function SelfMadeBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-surface px-2.5 py-0.5 text-xs font-semibold text-ink-soft ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
      自主制作デモ
    </span>
  );
}

export function SiteFooter() {
  return (
    <footer className="no-print mt-auto border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-6 text-xs leading-relaxed text-muted sm:px-6">
        <p>
          本アプリはポートフォリオ用の自主制作デモです。実在の企業・サービスとは関係ありません。サンプル問い合わせはすべて架空の内容です。
        </p>
        <p className="mt-1">AIの出力は下書きです。送信前に必ず人が内容を確認・修正してください。</p>
      </div>
    </footer>
  );
}
