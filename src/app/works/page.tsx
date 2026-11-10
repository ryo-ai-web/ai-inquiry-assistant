import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  IconBadge,
  IconCheck,
  IconChecklist,
  IconClock,
  IconCode,
  IconCopy,
  IconFlag,
  IconInbox,
  IconPen,
  IconPlay,
  IconShield,
  IconSummary,
  IconTag,
  IconTone,
  IconUserCheck,
} from "@/components/Icons";
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
  TECH,
  USERS,
} from "@/content/portfolio";

export const metadata: Metadata = {
  title: "制作実績",
  description: "生成AIを活用した問い合わせ対応支援ツール（自主制作）の制作実績紹介です。",
};

const FEATURE_ICONS = [IconTag, IconSummary, IconFlag, IconChecklist, IconPen, IconTone, IconCopy, IconPlay];
const FLOW_ICONS = [IconInbox, IconClock, IconPen, IconCopy];

export default function WorksPage() {
  return (
    <>
      <SiteHeader current="/works" />
      <main className="flex-1">
        {/* ヒーロー */}
        <section className="bg-hero">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:pb-20">
            <div>
              <SelfMadeBadge>制作実績｜個人で企画・開発した自主制作デモ</SelfMadeBadge>
              <h1 className="mt-6 text-[28px] font-black leading-[1.45] tracking-wide sm:text-[38px]">
                問い合わせ対応を、
                <br />
                <span className="text-brand">AIで仕分けて下書きまで。</span>
              </h1>
              <p className="mt-4 text-[17px] font-bold text-ink-soft">{PROJECT.name}</p>
              <p className="mt-3 text-[15px] leading-[1.9] text-ink-soft">
                届いた問い合わせの分類・要約・重要度・対応事項の整理と、返信文の下書きを生成AIで行うWebアプリです。返信は自動送信せず、人が確認してから使う設計にしています。
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/?sample=question&run=1&mode=demo#try"
                  className="inline-flex items-center justify-center rounded-xl bg-accent px-8 py-4 text-[15px] font-bold text-ink shadow-[var(--shadow-cta)] hover:bg-accent-dark"
                >
                  デモを試してみる
                </Link>
                {PROFILE.sourceUrl && (
                  <a
                    href={PROFILE.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-brand/40 bg-white px-6 py-3.5 text-[15px] font-bold text-brand-dark hover:bg-brand-soft"
                  >
                    <IconCode className="h-5 w-5" />
                    ソースコードを見る
                  </a>
                )}
              </div>
              <p className="mt-5 text-xs leading-relaxed text-muted">{PROJECT.selfMadeNote}</p>
            </div>
            <BrowserFrame>
              <Image
                src="/screenshots/desktop-result.png"
                alt="問い合わせ対応アシスタントの結果画面。分類・重要度・要約・対応事項が表示されている"
                width={1440}
                height={1100}
                className="h-auto w-full"
                priority
              />
            </BrowserFrame>
          </div>
        </section>

        {/* 課題 */}
        <Section id="problem" title="こんなお悩みはありませんか？" lead="問い合わせ対応を兼務している少人数のチームを想定しました。">
          <div className="grid gap-4 sm:grid-cols-2">
            {PROBLEMS.map((p) => (
              <div key={p} className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-[var(--shadow-card)] sm:p-6">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-high-soft text-lg font-black text-high">!</span>
                <p className="text-[15px] font-medium leading-[1.8]">{p}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-[var(--shadow-card)]">
            <p className="text-center text-sm font-bold text-brand">想定している利用者</p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">
              {USERS.map((u) => (
                <li key={u} className="flex items-start gap-3 rounded-xl bg-paper p-4 text-sm leading-relaxed">
                  <IconBadge size="sm">
                    <IconUserCheck />
                  </IconBadge>
                  <span className="pt-1.5">{u}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* 解決方法 */}
        <Section id="solution" title="AIと人で、役割を分けました" lead="AIは「読む・整理する・下書きする」まで。「判断する・送信する」は人が行います。" tone="white">
          <div className="grid gap-5 md:grid-cols-2">
            <RoleCard
              label="AIが担当"
              color="brand"
              items={["問い合わせの分類（5種類）", "内容の要約", "重要度の判定と理由", "対応事項・確認事項の抽出", "3つのトーンで返信案を作成"]}
            />
            <RoleCard label="人が担当" color="accent" items={["分類・重要度が妥当か確認", "【要確認】の箇所を埋める", "返信案を修正する", "コピーして送信する（自動送信はしません）"]} />
          </div>

          <h3 className="mt-14 text-center text-[20px] font-black">ご利用の流れ</h3>
          <ol className="mt-6 grid gap-4 md:grid-cols-4">
            {FLOW.map((f, i) => {
              const Icon = FLOW_ICONS[i];
              return (
                <li key={f.title} className="relative rounded-2xl bg-paper p-5 text-center">
                  <span className="text-xs font-black tracking-widest text-brand">STEP {i + 1}</span>
                  <div className="mt-3 flex justify-center">
                    <IconBadge size="lg">
                      <Icon />
                    </IconBadge>
                  </div>
                  <p className="mt-3 text-[17px] font-black">{f.title}</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">{f.body}</p>
                  {i < FLOW.length - 1 && (
                    <span aria-hidden="true" className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-xs text-white md:flex">
                      ▶
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </Section>

        {/* 機能 */}
        <Section id="features" title="主な機能" lead="問い合わせ1件につき、必要な情報をひとつの画面にまとめます。">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => {
              const Icon = FEATURE_ICONS[i];
              return (
                <div key={f.title} className="rounded-2xl bg-white p-6 text-center shadow-[var(--shadow-card)]">
                  <div className="flex justify-center">
                    <IconBadge size="lg">
                      <Icon />
                    </IconBadge>
                  </div>
                  <p className="mt-4 text-[16px] font-black">{f.title}</p>
                  <p className="mt-2 text-left text-[13px] leading-[1.8] text-ink-soft">{f.body}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 grid items-start gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <figure>
              <BrowserFrame>
                <Image src="/screenshots/desktop-reply.png" alt="返信案の画面。トーンの切り替えと要確認箇所の表示" width={1440} height={1100} className="h-auto w-full" />
              </BrowserFrame>
              <figcaption className="mt-3 text-center text-sm text-muted">PC：返信案のトーン切り替えと【要確認】の表示</figcaption>
            </figure>
            <figure className="mx-auto w-full max-w-[280px]">
              <div className="overflow-hidden rounded-[28px] border-[7px] border-ink bg-white shadow-[var(--shadow-card)]">
                <Image src="/screenshots/mobile-result.png" alt="スマートフォンでの結果表示" width={390} height={844} className="h-auto w-full" />
              </div>
              <figcaption className="mt-3 text-center text-sm text-muted">スマートフォンにも対応</figcaption>
            </figure>
          </div>
        </Section>

        {/* 工夫 */}
        <Section id="ideas" title="開発で工夫した点" tone="white">
          <div className="grid gap-4 md:grid-cols-2">
            {IDEAS.map((idea, i) => (
              <div key={idea.title} className={`rounded-2xl bg-paper p-6 ${i === IDEAS.length - 1 ? "md:col-span-2" : ""}`}>
                <p className="flex items-start gap-3 text-[16px] font-black leading-snug">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-sm text-ink">{i + 1}</span>
                  <span className="pt-0.5">{idea.title}</span>
                </p>
                <p className="mt-3 text-[14px] leading-[1.9] text-ink-soft">{idea.body}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 安全性 */}
        <Section id="safety" title="安心して使っていただくための配慮">
          <div className="grid gap-5 lg:grid-cols-2">
            <CheckCard icon={<IconShield />} title="セキュリティ・個人情報" items={SECURITY} />
            <CheckCard icon={<IconUserCheck />} title="AIの誤回答への対策" items={ACCURACY} />
          </div>
          <div className="mt-6 rounded-2xl border-2 border-dashed border-accent bg-[#fffbea] p-6">
            <p className="text-[15px] font-black">想定される効果（検証前の仮説です）</p>
            <ul className="mt-3 space-y-1.5 text-sm leading-relaxed">
              {HYPOTHESES.map((h) => (
                <li key={h} className="flex gap-2">
                  <span className="text-accent-dark">●</span>
                  {h}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs leading-relaxed text-ink-soft">
              自主制作のため、実際の業務での削減時間や精度は測定していません。導入する場合は、過去の問い合わせで分類の正確さや修正の手間を確かめる検証期間を設けることをおすすめします。
            </p>
          </div>
        </Section>

        {/* 技術・担当 */}
        <Section id="scope" title="使用技術と担当範囲" tone="white">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl bg-paper p-6">
              <p className="text-[16px] font-black">使用技術</p>
              <dl className="mt-4 divide-y divide-line">
                {TECH.map((t) => (
                  <div key={t.name} className="grid gap-0.5 py-2.5 sm:grid-cols-[170px_1fr] sm:gap-4">
                    <dt className="text-sm font-bold">{t.name}</dt>
                    <dd className="text-sm text-ink-soft">{t.role}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="flex flex-col gap-5">
              <div className="rounded-2xl bg-paper p-6">
                <p className="text-[16px] font-black">私の担当範囲</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {SCOPE.map((s) => (
                    <li key={s} className="rounded-full bg-white px-3.5 py-1.5 text-[13px] font-bold text-brand-dark ring-1 ring-brand/25">
                      {s}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm leading-relaxed text-ink-soft">{SCOPE_NOTE}</p>
              </div>
              <div className="rounded-2xl bg-paper p-6">
                <p className="text-[16px] font-black">制作者</p>
                <p className="mt-3 text-[18px] font-black">
                  {PROFILE.displayName}
                  <span className="ml-2 text-sm font-bold text-ink-soft">{PROFILE.role}</span>
                </p>
                <dl className="mt-4 grid grid-cols-3 gap-2">
                  {PROFILE.experience.map((e) => (
                    <div key={e.label} className="rounded-xl bg-white px-3 py-3 text-center">
                      <dt className="text-[11px] leading-tight text-muted">{e.label}</dt>
                      <dd className="mt-1 text-[18px] font-black text-brand">{e.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 text-[13px] text-ink-soft">対応技術：{PROFILE.skills.join(" / ")}</p>
              </div>
            </div>
          </div>

          <h3 className="mt-14 text-center text-[20px] font-black">今後追加できる機能</h3>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {FUTURE.map((f) => (
              <li key={f} className="flex items-center gap-2.5 rounded-xl bg-paper px-4 py-3 text-sm font-medium">
                <span className="text-brand">＋</span>
                {f}
              </li>
            ))}
          </ul>
        </Section>

        {/* リンク */}
        <Section id="links" title="デモ・ソースコード">
          <div className="grid gap-4 sm:grid-cols-2">
            <LinkCard label="デモURL" url={PROFILE.demoUrl} fallbackHref="/" fallbackText="このサイトのデモページ" />
            <LinkCard label="ソースコード（GitHub）" url={PROFILE.sourceUrl} fallbackText="公開準備中" />
          </div>
        </Section>

        {/* 相談 */}
        <section id="contact" className="bg-brand px-4 py-16 text-white sm:px-6 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-[24px] font-black leading-snug sm:text-[30px]">
              生成AIを使った業務効率化・
              <br className="sm:hidden" />
              小規模なWebアプリ開発の
              <br />
              ご相談を受け付けています
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-[15px] leading-[1.9] text-white/85">
              「この作業をAIで楽にできないか」という段階からご相談いただけます。まずは小さく試作し、実際の業務で使えるかを確かめながら進めます。
            </p>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {SIMILAR_WORKS.map((w) => (
                <li key={w.title} className="rounded-2xl bg-white p-5 text-ink">
                  <p className="flex items-start gap-2 text-[15px] font-black leading-snug">
                    <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                    {w.title}
                  </p>
                  <p className="mt-1.5 pl-7 text-[13px] leading-relaxed text-ink-soft">{w.body}</p>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-col items-center gap-3">
              {PROFILE.contactUrl ? (
                <a
                  href={PROFILE.contactUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-w-[280px] items-center justify-center rounded-xl bg-accent px-8 py-4 text-[16px] font-black text-ink shadow-[var(--shadow-cta)] hover:bg-accent-dark"
                >
                  {PROFILE.contactLabel}
                </a>
              ) : (
                <p className="rounded-xl bg-white/15 px-6 py-4 text-center text-[15px] font-bold">ご相談は、ご覧いただいている募集サイトのメッセージからお送りください</p>
              )}
              <p className="text-xs text-white/70">対応範囲や進め方は、ヒアリングのうえでご提案します。</p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function Section({
  id,
  title,
  lead,
  tone = "paper",
  children,
}: {
  id: string;
  title: string;
  lead?: string;
  tone?: "paper" | "white";
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`scroll-mt-16 px-4 py-16 sm:px-6 sm:py-20 ${tone === "white" ? "bg-white" : ""}`}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h2 id={`${id}-title`} className="text-[24px] font-black leading-snug tracking-wide sm:text-[32px]">
            {title}
          </h2>
          {lead && <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-soft">{lead}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

function BrowserFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_20px_50px_rgba(32,60,45,0.15)] ring-1 ring-line">
      <div className="flex items-center gap-1.5 border-b border-line bg-paper px-4 py-2.5" aria-hidden="true">
        <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
        <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
        <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
      </div>
      {children}
    </div>
  );
}

function RoleCard({ label, color, items }: { label: string; color: "brand" | "accent"; items: string[] }) {
  const head = color === "brand" ? "bg-brand text-white" : "bg-accent text-ink";
  const mark = color === "brand" ? "text-brand" : "text-accent-dark";
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)] ring-1 ring-line">
      <p className={`px-6 py-3.5 text-center text-[17px] font-black ${head}`}>{label}</p>
      <ul className="space-y-3 p-6">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-3 text-[15px] font-medium">
            <IconCheck className={`mt-0.5 h-5 w-5 shrink-0 ${mark}`} />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CheckCard({ icon, title, items }: { icon: React.ReactNode; title: string; items: readonly string[] }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-[var(--shadow-card)]">
      <p className="flex items-center gap-3 text-[17px] font-black">
        <IconBadge>{icon}</IconBadge>
        {title}
      </p>
      <ul className="mt-5 space-y-3">
        {items.map((s) => (
          <li key={s} className="flex gap-3 text-[14px] leading-[1.8] text-ink-soft">
            <IconCheck className="mt-1 h-4 w-4 shrink-0 text-brand" />
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

function LinkCard({ label, url, fallbackHref, fallbackText }: { label: string; url: string; fallbackHref?: string; fallbackText: string }) {
  const inner = (
    <>
      <p className="text-xs font-bold text-muted">{label}</p>
      <p className="mt-1 break-all text-[15px] font-bold text-brand-dark">{url ? url.replace(/^https?:\/\//, "") : fallbackText}</p>
    </>
  );
  const cls = "block rounded-2xl bg-white p-6 shadow-[var(--shadow-card)] transition-colors hover:ring-2 hover:ring-brand/30";
  if (url)
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    );
  if (fallbackHref)
    return (
      <Link href={fallbackHref} className={cls}>
        {inner}
      </Link>
    );
  return <div className={cls}>{inner}</div>;
}
