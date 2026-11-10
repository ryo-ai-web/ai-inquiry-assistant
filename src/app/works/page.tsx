import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SelfMadeBadge, SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { PROFILE } from "@/config/profile";
import {
  ACCURACY,
  FEATURES,
  FLOW,
  FUTURE,
  HYPOTHESES,
  IDEAS,
  PROBLEMS,
  PROJECT,
  SCOPE,
  SCOPE_NOTE,
  SECURITY,
  SIMILAR_WORKS,
  SOLUTION,
  TECH,
  USERS,
} from "@/content/portfolio";

export const metadata: Metadata = {
  title: "実績紹介",
  description: "生成AIを活用した問い合わせ対応支援ツール（自主制作）の制作実績紹介です。",
};

const TOC = [
  ["problem", "課題"],
  ["solution", "解決方法"],
  ["features", "機能"],
  ["tech", "使用技術"],
  ["ideas", "工夫した点"],
  ["safety", "安全性への配慮"],
  ["scope", "担当範囲"],
  ["contact", "ご相談"],
] as const;

export default function WorksPage() {
  return (
    <>
      <SiteHeader current="/works" />
      <main className="flex-1">
        {/* ヒーロー */}
        <section className="border-b border-line bg-surface">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <SelfMadeBadge />
                <span className="text-xs text-muted">制作実績｜生成AI × Webアプリ</span>
              </div>
              <h1 className="mt-4 text-[28px] font-bold leading-snug tracking-wide sm:text-[34px]">{PROJECT.name}</h1>
              <p className="mt-2 text-[17px] font-semibold leading-relaxed text-ink-soft">{PROJECT.tagline}</p>
              <p className="mt-4 rounded-lg border border-line bg-paper px-4 py-3 text-sm leading-relaxed text-ink-soft">
                {PROJECT.selfMadeNote}
              </p>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <Link
                  href="/?sample=question&run=1&mode=demo"
                  className="inline-flex items-center justify-center rounded-lg bg-brand px-5 py-3 text-[15px] font-bold text-white hover:bg-brand-dark"
                >
                  デモを操作してみる
                </Link>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-lg border border-line-strong bg-surface px-5 py-3 text-[15px] font-semibold text-ink-soft hover:bg-paper"
                >
                  開発のご相談について
                </a>
              </div>
            </div>
            <figure className="overflow-hidden rounded-xl border border-line bg-paper shadow-[0_8px_30px_rgba(20,30,40,0.08)]">
              <Image
                src="/screenshots/desktop-result.png"
                alt="問い合わせ対応アシスタントの結果画面。分類・重要度・要約・対応事項が表示されている"
                width={1440}
                height={1100}
                className="h-auto w-full"
                priority
              />
            </figure>
          </div>
        </section>

        <nav aria-label="ページ内リンク" className="no-print sticky top-0 z-10 border-b border-line bg-paper/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 text-[13px] sm:px-6">
            {TOC.map(([id, label]) => (
              <a key={id} href={`#${id}`} className="shrink-0 rounded-md px-3 py-1.5 text-ink-soft hover:bg-surface">
                {label}
              </a>
            ))}
          </div>
        </nav>

        <div className="mx-auto max-w-6xl space-y-16 px-4 py-12 sm:px-6 sm:py-16">
          {/* 課題・利用者 */}
          <Section id="problem" eyebrow="01" title="解決したい業務課題">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
              <ul className="space-y-3">
                {PROBLEMS.map((p) => (
                  <li key={p} className="flex gap-3 rounded-lg border border-line bg-surface p-4 text-[15px] leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-high" aria-hidden="true" />
                    {p}
                  </li>
                ))}
              </ul>
              <div className="rounded-lg border border-line bg-surface p-5">
                <h3 className="text-sm font-bold text-ink">想定利用者</h3>
                <ul className="mt-3 space-y-2.5 text-[15px] leading-relaxed text-ink-soft">
                  {USERS.map((u) => (
                    <li key={u} className="flex gap-2.5">
                      <span className="text-brand" aria-hidden="true">
                        ―
                      </span>
                      {u}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>

          {/* 解決方法・流れ */}
          <Section id="solution" eyebrow="02" title="提案した解決方法">
            <p className="max-w-3xl text-[17px] font-semibold leading-relaxed text-ink">{SOLUTION.lead}</p>
            <ul className="mt-4 max-w-3xl list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-ink-soft marker:text-muted">
              {SOLUTION.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <h3 className="mt-10 text-sm font-bold text-ink">利用の流れ</h3>
            <ol className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {FLOW.map((f, i) => (
                <li key={f.title} className="rounded-lg border border-line bg-surface p-4">
                  <p className="text-xs font-bold text-brand">STEP {i + 1}</p>
                  <p className="mt-1 font-bold text-ink">{f.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{f.body}</p>
                </li>
              ))}
            </ol>
          </Section>

          {/* 機能 */}
          <Section id="features" eyebrow="03" title="主な機能">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((f) => (
                <div key={f.title} className="rounded-lg border border-line bg-surface p-4">
                  <p className="font-bold text-ink">{f.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{f.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-start">
              <figure>
                <div className="overflow-hidden rounded-xl border border-line bg-surface">
                  <Image
                    src="/screenshots/desktop-reply.png"
                    alt="返信案の画面。丁寧・簡潔・親しみやすいのトーン切り替えと、要確認箇所の表示"
                    width={1440}
                    height={1100}
                    className="h-auto w-full"
                  />
                </div>
                <figcaption className="mt-2 text-xs text-muted">PC表示：返信案のトーン切り替えと【要確認】箇所の表示</figcaption>
              </figure>
              <figure className="mx-auto w-full max-w-[300px]">
                <div className="overflow-hidden rounded-[22px] border-[6px] border-ink bg-surface">
                  <Image
                    src="/screenshots/mobile-result.png"
                    alt="スマートフォンでの結果表示"
                    width={390}
                    height={844}
                    className="h-auto w-full"
                  />
                </div>
                <figcaption className="mt-2 text-center text-xs text-muted">スマートフォン表示</figcaption>
              </figure>
            </div>
          </Section>

          {/* 技術 */}
          <Section id="tech" eyebrow="04" title="使用技術">
            <dl className="grid gap-x-8 sm:grid-cols-2">
              {TECH.map((t) => (
                <div key={t.name} className="flex flex-col gap-0.5 border-b border-line py-3">
                  <dt className="font-bold text-ink">{t.name}</dt>
                  <dd className="text-sm text-ink-soft">{t.role}</dd>
                </div>
              ))}
            </dl>
          </Section>

          {/* 工夫 */}
          <Section id="ideas" eyebrow="05" title="開発で工夫した点">
            <div className="grid gap-4 lg:grid-cols-2">
              {IDEAS.map((idea, i) => (
                <div key={idea.title} className="rounded-lg border border-line bg-surface p-5">
                  <p className="flex items-baseline gap-2 font-bold text-ink">
                    <span className="text-sm text-brand tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    {idea.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{idea.body}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* 安全性 */}
          <Section id="safety" eyebrow="06" title="セキュリティ・個人情報と、AIの誤回答への配慮">
            <div className="grid gap-6 lg:grid-cols-2">
              <CheckList title="セキュリティ・個人情報への配慮" items={SECURITY} />
              <CheckList title="AIの誤回答への対策" items={ACCURACY} />
            </div>
            <div className="mt-6 rounded-lg border border-demo/20 bg-demo-soft p-5">
              <h3 className="text-sm font-bold text-demo">想定される効果（未検証の仮説）</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-ink-soft marker:text-demo/60">
                {HYPOTHESES.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              <p className="mt-3 text-xs leading-relaxed text-ink-soft">
                自主制作のため、実際の業務での削減時間や精度は測定していません。導入する場合は、過去の問い合わせを使って分類の正確さや修正の手間を確認する「検証期間」を設けることをおすすめします。
              </p>
            </div>
          </Section>

          {/* 担当範囲 */}
          <Section id="scope" eyebrow="07" title="担当範囲と制作者について">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-lg border border-line bg-surface p-5">
                <h3 className="text-sm font-bold text-ink">私の担当範囲</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {SCOPE.map((s) => (
                    <li key={s} className="rounded-md bg-brand-soft px-2.5 py-1 text-[13px] font-semibold text-brand-dark">
                      {s}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{SCOPE_NOTE}</p>
              </div>
              <div className="rounded-lg border border-line bg-surface p-5">
                <h3 className="text-sm font-bold text-ink">制作者</h3>
                <p className="mt-2 font-bold text-ink">{PROFILE.displayName}</p>
                <p className="text-sm text-ink-soft">{PROFILE.role}</p>
                <dl className="mt-3 grid grid-cols-3 gap-2">
                  {PROFILE.experience.map((e) => (
                    <div key={e.label} className="rounded-md bg-paper px-3 py-2">
                      <dt className="text-[11px] leading-tight text-muted">{e.label}</dt>
                      <dd className="mt-0.5 font-bold text-ink">{e.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 text-[13px] text-ink-soft">対応技術：{PROFILE.skills.join(" / ")}</p>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-sm font-bold text-ink">今後追加できる機能</h3>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {FUTURE.map((f) => (
                  <li key={f} className="rounded-md border border-dashed border-line-strong bg-surface px-3 py-2 text-sm text-ink-soft">
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </Section>

          {/* リンク・相談 */}
          <Section id="contact" eyebrow="08" title="デモ・ソースコード・ご相談">
            <div className="grid gap-3 sm:grid-cols-2">
              <LinkCard label="デモURL" url={PROFILE.demoUrl} fallbackHref="/" fallbackText="このサイトのデモページ（公開URLは準備中）" />
              <LinkCard label="ソースコード" url={PROFILE.sourceUrl} fallbackText="GitHubで公開準備中" />
            </div>

            <div className="mt-8 rounded-xl bg-ink p-6 text-white sm:p-8">
              <h3 className="text-[20px] font-bold leading-snug">生成AIを使った業務効率化・小規模なWebアプリ開発のご相談を受け付けています</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/80">
                「この作業をAIで楽にできないか」という段階からご相談いただけます。まずは小さく試作し、実際の業務で使えるかを確認しながら進めます。
              </p>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {SIMILAR_WORKS.map((w) => (
                  <li key={w.title} className="rounded-lg bg-white/8 px-4 py-3">
                    <p className="text-sm font-bold">{w.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-white/70">{w.body}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                {PROFILE.contactUrl ? (
                  <a
                    href={PROFILE.contactUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-[15px] font-bold text-ink hover:bg-paper"
                  >
                    {PROFILE.contactLabel}
                  </a>
                ) : (
                  <span className="inline-flex items-center justify-center rounded-lg border border-white/30 px-5 py-3 text-sm text-white/80">
                    ご相談は、ご覧いただいている募集サイトのメッセージからお送りください
                  </span>
                )}
                <p className="text-xs text-white/60">対応範囲や進め方は、ヒアリングのうえでご提案します。</p>
              </div>
            </div>
          </Section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-16">
      <p className="text-xs font-bold tracking-[0.2em] text-brand">{eyebrow}</p>
      <h2 id={`${id}-title`} className="mb-6 mt-1 text-[22px] font-bold leading-snug sm:text-[24px]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function CheckList({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-5">
      <h3 className="text-sm font-bold text-ink">{title}</h3>
      <ul className="mt-3 space-y-2.5">
        {items.map((s) => (
          <li key={s} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
            <svg width="16" height="16" viewBox="0 0 16 16" className="mt-1 shrink-0 text-low" aria-hidden="true">
              <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

function LinkCard({ label, url, fallbackHref, fallbackText }: { label: string; url: string; fallbackHref?: string; fallbackText: string }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <p className="text-xs font-semibold text-muted">{label}</p>
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="mt-1 block break-all font-semibold text-brand underline underline-offset-4">
          {url}
        </a>
      ) : fallbackHref ? (
        <Link href={fallbackHref} className="mt-1 block font-semibold text-brand underline underline-offset-4">
          {fallbackText}
        </Link>
      ) : (
        <p className="mt-1 font-semibold text-ink-soft">{fallbackText}</p>
      )}
    </div>
  );
}
