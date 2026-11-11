import Link from "next/link";

const NAV = [
  { href: "/", label: "デモを試す" },
  { href: "/works", label: "制作実績" },
  { href: "/sheet", label: "営業資料" },
] as const;

export function SiteHeader({ current }: { current: "/" | "/works" | "/sheet" }) {
  return (
    <header className="no-print sticky top-0 z-30 border-b border-line/70 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label="問い合わせ対応アシスタント トップへ">
          <Logo />
          <span className="hidden text-[17px] font-black tracking-wide text-ink sm:inline">
            問い合わせ<span className="text-brand">アシスタント</span>
          </span>
        </Link>
        <nav aria-label="メインメニュー" className="flex items-center gap-0.5 text-[13px] font-bold sm:gap-1 sm:text-sm">
          {NAV.map((item) => {
            const active = item.href === current;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 transition-colors sm:px-4 ${
                  active ? "bg-brand-soft text-brand-dark" : "text-ink-soft hover:text-brand"
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

export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#17885a" />
      <path d="M8.5 10.5h15a1.5 1.5 0 0 1 1.5 1.5v7.5a1.5 1.5 0 0 1-1.5 1.5H15l-4.5 3.5V21H8.5A1.5 1.5 0 0 1 7 19.5V12a1.5 1.5 0 0 1 1.5-1.5Z" fill="#fff" />
      <circle cx="12" cy="15.75" r="1.4" fill="#17885a" />
      <circle cx="16" cy="15.75" r="1.4" fill="#17885a" />
      <circle cx="20" cy="15.75" r="1.4" fill="#f6c344" />
    </svg>
  );
}


export function SiteFooter() {
  return (
    <footer className="no-print mt-auto bg-ink text-white/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2.5">
          <Logo size={26} />
          <span className="text-sm font-bold text-white">問い合わせアシスタント</span>
        </div>
        <div className="text-xs leading-relaxed text-white/60 sm:text-right">
          <p>ポートフォリオ用の自主制作デモです。実在の企業・サービスとは関係ありません。</p>
          <p>サンプル問い合わせはすべて架空の内容です。AIの出力は、送信前に必ず人が確認してください。</p>
        </div>
      </div>
    </footer>
  );
}
