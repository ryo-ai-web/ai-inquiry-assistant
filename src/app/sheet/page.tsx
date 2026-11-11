import type { Metadata } from "next";
import Image from "next/image";
import { Logo, SiteHeader } from "@/components/SiteHeader";
import { PrintButton } from "@/components/PrintButton";
import { PROFILE } from "@/config/profile";
import {
  BACKGROUND_SHORT,
  EVAL,
  FEATURES,
  IDEAS,
  LIMITS,
  PROJECT,
  ROLES,
  SCOPE_NOTE,
  SIMILAR_WORKS,
  TECH,
} from "@/content/portfolio";

export const metadata: Metadata = {
  title: "営業用実績資料",
  description: "問い合わせ対応アシスタント（自主制作）の営業用実績資料（A4・2ページ）",
};

/**
 * A4 縦 2ページの営業用資料。
 * 画面では用紙イメージで表示し、印刷（PDF保存）時は1ページずつ改ページする。
 * 1ページ = 794 x 1123 px（96dpi換算の A4）
 */
export default function SheetPage() {
  return (
    <>
      <SiteHeader current="/sheet" />
      <div className="no-print mx-auto flex w-full max-w-[794px] flex-wrap items-center justify-between gap-3 px-4 pt-6">
        <p className="text-sm text-ink-soft">A4・2ページの営業用資料です。ブラウザの印刷から「PDFに保存」を選ぶとPDFにできます。</p>
        <PrintButton />
      </div>
      <main className="sheet-root flex flex-col items-center gap-8 overflow-x-auto px-4 py-8 print:gap-0 print:p-0">
        <Page1 />
        <Page2 />
      </main>
    </>
  );
}

function Paper({ children, n }: { children: React.ReactNode; n: number }) {
  return (
    <article
      className="sheet-page relative flex h-[1123px] w-[794px] shrink-0 flex-col overflow-hidden bg-white text-ink ring-1 ring-line-strong print:ring-0"
      style={{ breakAfter: n === 1 ? "page" : "auto" }}
    >
      {children}
      <footer className="mt-auto flex items-center justify-between border-t border-line px-12 py-3 text-[10px] text-muted">
        <span>{PROJECT.name}｜自主制作デモ・実績資料</span>
        <span>{n} / 2</span>
      </footer>
    </article>
  );
}

function H({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 text-[15px] font-black leading-tight">
      <span className="text-[12px] font-black text-brand tabular-nums">{Number(n)}.</span>
      {children}
      <span className="ml-1 h-px flex-1 bg-line-strong" aria-hidden="true" />
    </h2>
  );
}

function Page1() {
  return (
    <Paper n={1}>
      <header className="border-b-2 border-ink px-12 pb-5 pt-9 text-ink">
        <div className="flex items-center justify-between text-[11px] font-bold text-muted">
          <div className="flex items-center gap-2.5">
            <Logo size={22} />
            <span>制作実績 ・ {PROJECT.made}</span>
          </div>
          <span>自主制作デモ</span>
        </div>
        <h1 className="mt-4 text-[28px] font-black leading-tight tracking-wide">{PROJECT.name}</h1>
        <p className="mt-1.5 text-[13.5px] font-bold leading-relaxed text-ink-soft">{PROJECT.tagline}</p>
        <p className="mt-1.5 text-[10.5px] leading-relaxed text-muted">{PROJECT.selfMadeNote}</p>
      </header>

      <div className="flex flex-col gap-5 px-12 pt-6">
        <div className="grid grid-cols-[1fr_1.1fr] gap-7">
          <section>
            <H n="01">作った理由</H>
            <p className="mt-2.5 text-[11.5px] leading-[1.85] text-ink-soft">{BACKGROUND_SHORT}</p>
          </section>
          <section>
            <H n="02">AIと人の分担</H>
            <div className="mt-2.5 grid grid-cols-2 gap-3 text-[10.5px] leading-[1.6]">
              <SheetList title="AIがやること" items={ROLES.ai} />
              <SheetList title="人がやること" items={ROLES.human} />
            </div>
          </section>
        </div>

        <section>
          <H n="03">画面</H>
          <div className="mt-3 h-[260px] overflow-hidden rounded border border-line-strong">
            <Image
              src="/screenshots/desktop-result.png"
              alt="PCでの結果画面"
              width={1440}
              height={1100}
              className="block h-full w-full object-cover object-[50%_12%]"
              priority
            />
          </div>
          <p className="mt-1.5 text-[10px] text-muted">サンプルの問い合わせを入れたところ（デモモードで撮影）。</p>
        </section>

        <section>
          <H n="04">できること</H>
          <dl className="mt-2 grid grid-cols-2 gap-x-7">
            {FEATURES.map((f) => (
              <div key={f.title} className="border-b border-line py-1">
                <dt className="text-[11.5px] font-bold">{f.title}</dt>
                <dd className="text-[10px] leading-[1.6] text-ink-soft">{f.body}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </Paper>
  );
}

function Page2() {
  return (
    <Paper n={2}>
      <div className="flex flex-col gap-4 px-12 pt-7">
        <section>
          <H n="05">試してみて分かったこと</H>
          <p className="mt-2.5 text-[11px] leading-[1.75] text-ink-soft">{EVAL.lead}</p>
          <p className="mt-1.5 text-[11.5px] font-bold">
            キーワード判定の正解数：分類 <span className="text-[15px] text-high">{EVAL.categoryCorrect}/{EVAL.total}</span>件、重要度{" "}
            <span className="text-[15px] text-high">{EVAL.priorityCorrect}/{EVAL.total}</span>件
          </p>
          <table className="mt-1.5 w-full border-collapse text-[10px] leading-[1.5]">
            <tbody>
              {EVAL.misses.slice(0, 4).map((m) => (
                <tr key={m.text} className="border-b border-line align-top">
                  <td className="py-1 pr-3">「{m.text}」</td>
                  <td className="whitespace-nowrap py-1 pr-3 text-ink-soft">正解 {m.expected}</td>
                  <td className="whitespace-nowrap py-1 font-bold text-high">→ {m.got}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-[11px] leading-[1.75] text-ink-soft">{EVAL.conclusion}</p>
          <p className="mt-1 text-[10px] leading-[1.6] text-muted">{EVAL.pending}</p>
        </section>

        <div className="grid grid-cols-[1fr_150px] gap-6">
          <section>
            <H n="06">作りながら決めたこと</H>
            <ol className="mt-2 space-y-1.5">
              {IDEAS.map((idea, i) => (
                <li key={idea.title} className="text-[11px] leading-[1.55]">
                  <p className="font-bold">
                    <span className="mr-1 text-brand tabular-nums">{i + 1}.</span>
                    {idea.title}
                  </p>
                  <p className="text-[10px] text-ink-soft">{idea.body}</p>
                </li>
              ))}
            </ol>
          </section>
          <figure>
            <div className="h-[270px] overflow-hidden rounded-[14px] border-[4px] border-ink">
              <Image src="/screenshots/mobile-result.png" alt="スマートフォンでの結果画面" width={390} height={844} className="block h-full w-full object-cover object-top" />
            </div>
            <figcaption className="mt-1 text-center text-[9.5px] text-muted">スマホ表示</figcaption>
          </figure>
        </div>

        <div className="grid grid-cols-2 gap-7">
          <section>
            <H n="07">まだできないこと</H>
            <ul className="mt-2 list-disc space-y-0.5 pl-4 text-[10px] leading-[1.6] text-ink-soft">
              {LIMITS.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </section>
          <section>
            <H n="08">技術と担当</H>
            <p className="mt-2 text-[10px] leading-[1.6] text-ink-soft">{TECH.map((t) => t.name).join(" / ")}</p>
            <p className="mt-1 text-[10px] leading-[1.6] text-ink-soft">{SCOPE_NOTE}</p>
          </section>
        </div>

        <section className="rounded-lg border border-line-strong bg-paper px-5 py-3.5">
          <div className="grid grid-cols-[1fr_250px] items-start gap-6">
            <div>
              <p className="text-[13px] font-black">似たものを作りたい方へ</p>
              <ul className="mt-1 list-disc pl-4 text-[10px] leading-[1.6] text-ink-soft">
                {SIMILAR_WORKS.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
              <p className="mt-1.5 text-[10px] leading-[1.6] text-ink-soft">
                {PROFILE.displayName}｜{PROFILE.experience.map((e) => `${e.label} ${e.value}`).join("・")}
              </p>
            </div>
            <dl className="space-y-1 text-[10.5px] leading-snug">
              <SheetLink label="デモ" value={PROFILE.demoUrl} />
              <SheetLink label="ソースコード" value={PROFILE.sourceUrl} />
              <SheetLink label="ご相談" value={PROFILE.contactUrl} fallback="ご覧の募集サイトのメッセージから" />
            </dl>
          </div>
        </section>
      </div>
    </Paper>
  );
}

function SheetList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="font-bold">{title}</p>
      <ul className="mt-0.5 list-disc pl-3.5 text-ink-soft">
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

function SheetLink({ label, value, fallback = "公開準備中" }: { label: string; value: string; fallback?: string }) {
  return (
    <div className="rounded bg-white px-2.5 py-1 text-ink ring-1 ring-line">
      <dt className="text-[9px] font-bold tracking-wider text-muted">{label}</dt>
      <dd className="font-semibold">
        {value ? (
          <a href={value} className="break-all text-brand-dark">
            {value.replace(/^https?:\/\//, "")}
          </a>
        ) : (
          fallback
        )}
      </dd>
    </div>
  );
}
