import type { Metadata } from "next";
import Image from "next/image";
import { Logo, SiteHeader } from "@/components/SiteHeader";
import { PrintButton } from "@/components/PrintButton";
import { PROFILE } from "@/config/profile";
import {
  FEATURES,
  HYPOTHESES,
  IDEAS,
  PROBLEMS,
  PROJECT,
  SCOPE,
  SCOPE_NOTE,
  SIMILAR_WORKS,
  SOLUTION,
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
      className="sheet-page relative flex h-[1123px] w-[794px] shrink-0 flex-col overflow-hidden bg-white text-ink shadow-[0_4px_24px_rgba(20,30,40,0.12)] print:shadow-none"
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
      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-black text-white">{Number(n)}</span>
      {children}
      <span className="ml-1 h-px flex-1 bg-line-strong" aria-hidden="true" />
    </h2>
  );
}

function Page1() {
  return (
    <Paper n={1}>
      {/* タイトル帯 */}
      <header className="bg-hero px-12 pb-6 pt-9 text-ink">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo size={26} />
            <span className="text-[11px] font-bold tracking-[0.12em] text-brand-dark">制作実績 ｜ 生成AI × Webアプリ開発</span>
          </div>
          <span className="rounded-full bg-ink/80 px-3 py-0.5 text-[11px] font-bold text-white">自主制作デモ</span>
        </div>
        <h1 className="mt-4 text-[30px] font-black leading-tight tracking-wide">
          問い合わせ対応を、<span className="text-brand">AIで仕分けて下書きまで。</span>
        </h1>
        <p className="mt-2 text-[14px] font-bold leading-relaxed text-ink-soft">
          {PROJECT.name}｜{PROJECT.tagline}
        </p>
        <p className="mt-2 text-[10.5px] leading-relaxed text-muted">{PROJECT.selfMadeNote}</p>
      </header>

      <div className="flex flex-col gap-5 px-12 pt-6">
        <div className="grid grid-cols-2 gap-7">
          <section>
            <H n="01">課題</H>
            <ul className="mt-3 space-y-1.5 text-[12px] leading-[1.7]">
              {PROBLEMS.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-high" />
                  {p}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <H n="02">解決方法</H>
            <p className="mt-3 text-[12.5px] font-bold leading-[1.7]">{SOLUTION.lead}</p>
            <ul className="mt-2 space-y-1.5 text-[12px] leading-[1.7] text-ink-soft">
              {SOLUTION.points.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  {p}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section>
          <H n="03">実際の画面</H>
          <div className="mt-3 h-[300px] overflow-hidden rounded-md border border-line">
            <Image
              src="/screenshots/desktop-result.png"
              alt="PCでの結果画面"
              width={1440}
              height={1100}
              className="block h-full w-full object-cover object-[50%_60%]"
              priority
            />
          </div>
          <p className="mt-1.5 text-[10px] text-muted">
            PC表示。サンプル問い合わせを入力し、分類・重要度・要約・対応事項が表示された状態（デモモードで撮影）。
          </p>
        </section>

        <section>
          <H n="04">主要機能</H>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-lg bg-paper px-2.5 py-2 ring-1 ring-line">
                <p className="text-[11.5px] font-bold leading-snug">{f.title}</p>
                <p className="mt-1 text-[9.5px] leading-[1.6] text-ink-soft">{f.body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Paper>
  );
}

function Page2() {
  return (
    <Paper n={2}>
      <div className="flex flex-col gap-5 px-12 pt-7">
        <div className="grid grid-cols-[1fr_180px] gap-7">
          <section>
            <H n="05">工夫した点</H>
            <ol className="mt-3 space-y-2">
              {IDEAS.map((idea, i) => (
                <li key={idea.title} className="text-[11.5px] leading-[1.6]">
                  <p className="font-bold">
                    <span className="mr-1.5 text-brand tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    {idea.title}
                  </p>
                  <p className="text-[10.5px] text-ink-soft">{idea.body}</p>
                </li>
              ))}
            </ol>
          </section>
          <figure>
            <div className="h-[300px] overflow-hidden rounded-[18px] border-[5px] border-ink">
              <Image
                src="/screenshots/mobile-result.png"
                alt="スマートフォンでの結果画面"
                width={390}
                height={844}
                className="block h-full w-full object-cover object-top"
              />
            </div>
            <figcaption className="mt-1.5 text-center text-[10px] text-muted">スマートフォン表示にも対応</figcaption>
          </figure>
        </div>

        <div className="grid grid-cols-2 gap-7">
          <section>
            <H n="06">使用技術</H>
            <dl className="mt-2 text-[10.5px] leading-[1.5]">
              {TECH.map((t) => (
                <div key={t.name} className="grid grid-cols-[148px_1fr] gap-2 border-b border-line py-1">
                  <dt className="font-bold">{t.name}</dt>
                  <dd className="text-ink-soft">{t.role}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section>
            <H n="07">担当範囲</H>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {SCOPE.map((s) => (
                <li key={s} className="rounded bg-brand-soft px-2 py-0.5 text-[11px] font-bold text-brand-dark">
                  {s}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[10.5px] leading-[1.7] text-ink-soft">{SCOPE_NOTE}</p>
            <div className="mt-3 rounded-md bg-demo-soft px-3 py-2.5">
              <p className="text-[11px] font-bold text-demo">想定される効果（未検証の仮説）</p>
              <ul className="mt-1 list-disc pl-4 text-[10.5px] leading-[1.6] text-ink-soft">
                {HYPOTHESES.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              <p className="mt-1 text-[9.5px] leading-[1.6] text-ink-soft">自主制作のため、削減時間や精度は実測していません。</p>
            </div>
          </section>
        </div>

        <section>
          <H n="08">対応可能な類似案件</H>
          <ul className="mt-2.5 grid grid-cols-2 gap-x-7 gap-y-1.5">
            {SIMILAR_WORKS.map((w) => (
              <li key={w.title} className="flex gap-2 border-b border-line pb-1.5">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                <p className="leading-[1.5]">
                  <span className="block text-[11.5px] font-bold">{w.title}</span>
                  <span className="block text-[10px] text-ink-soft">{w.body}</span>
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl bg-brand px-6 py-4 text-white">
          <div className="grid grid-cols-[1fr_270px] items-start gap-6">
            <div>
              <p className="text-[15px] font-bold leading-snug">生成AIを使った業務効率化・小規模なWebアプリ開発のご相談を受け付けています</p>
              <p className="mt-2 text-[10.5px] leading-[1.7] text-white/75">
                {PROFILE.displayName}｜{PROFILE.experience.map((e) => `${e.label} ${e.value}`).join("・")}
                <br />
                対応技術：{PROFILE.skills.join(" / ")}
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

function SheetLink({ label, value, fallback = "公開準備中" }: { label: string; value: string; fallback?: string }) {
  return (
    <div className="rounded-lg bg-white px-2.5 py-1 text-ink">
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
