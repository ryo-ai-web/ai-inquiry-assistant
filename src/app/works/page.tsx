import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { IconCode } from "@/components/Icons";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { PROFILE } from "@/config/profile";
import {
  BACKGROUND,
  EVAL,
  FEATURES,
  FUTURE,
  HYPOTHESES,
  IDEAS,
  LIMITS,
  PRICING,
  PRICING_NOTE,
  PROCESS,
  PROJECT,
  ROLES,
  SCOPE_NOTE,
  SECURITY,
  SIMILAR_WORKS,
  TECH,
} from "@/content/portfolio";

export const metadata: Metadata = {
  title: "制作実績",
  description: "問い合わせ対応アシスタント（自主制作）を作った理由、設計で決めたこと、試してみた結果。",
};

const EVAL_FILES = PROFILE.sourceUrl ? `${PROFILE.sourceUrl}/blob/main/src/content/eval-inquiries.ts` : "";

export default function WorksPage() {
  return (
    <>
      <SiteHeader current="/works" />
      <main className="flex-1 bg-white">
        <section className="border-b border-line">
          <div className="mx-auto grid max-w-5xl items-start gap-10 px-4 pb-12 pt-10 sm:px-6 sm:pt-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
            <div>
              <p className="text-[13px] font-bold text-muted">制作実績 ・ {PROJECT.made}</p>
              <h1 className="mt-3 text-[24px] font-black leading-[1.4] tracking-wide sm:text-[30px]">{PROJECT.name}</h1>
              <p className="mt-4 text-[15px] leading-[1.9] text-ink-soft">{PROJECT.tagline}です。返信は自動では送らず、人が下書きを直してから使います。</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/?sample=question&run=1&mode=demo#try"
                  className="inline-flex items-center justify-center rounded-lg bg-accent px-6 py-3 text-[15px] font-bold text-ink hover:bg-accent-dark"
                >
                  デモを動かす
                </Link>
                {PROFILE.sourceUrl && (
                  <a
                    href={PROFILE.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-line-strong px-5 py-3 text-[15px] font-bold text-ink hover:bg-paper"
                  >
                    <IconCode className="h-5 w-5" />
                    GitHub
                  </a>
                )}
              </div>
              <p className="mt-5 rounded-lg bg-brand-soft px-4 py-3 text-[14px] leading-relaxed">
                架空の問い合わせ30件で、AIの正解数は<b className="mx-1 text-brand-dark">分類 {EVAL.runs[EVAL.runs.length - 1].category}/{EVAL.total}・重要度 {EVAL.runs[EVAL.runs.length - 1].priority}/{EVAL.total}</b>
                （AIなしでは {EVAL.runs[0].category}/{EVAL.total}・{EVAL.runs[0].priority}/{EVAL.total}）。
                <a href="#test" className="font-bold text-brand underline underline-offset-2">
                  採点の詳細
                </a>
              </p>
              <p className="mt-4 text-xs leading-relaxed text-muted">{PROJECT.selfMadeNote}</p>
            </div>
            <Shot src="/screenshots/desktop-result.png" alt="AI（gpt-5.4-mini）で分析した結果画面。分類・重要度・要約・やることが表示されている" w={1440} h={1100} priority />
          </div>
        </section>

        <Section id="why" title="作った理由">
          <div className="max-w-[44em] space-y-4 text-[15px] leading-[2] text-ink-soft">
            {BACKGROUND.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="mt-8 grid max-w-3xl gap-6 sm:grid-cols-2">
            <RoleList title="AIがやること" items={ROLES.ai} />
            <RoleList title="人がやること" items={ROLES.human} />
          </div>
        </Section>

        <Section id="test" title="AIでどれだけ正確に仕分けられるか">
          <p className="max-w-[44em] text-[15px] leading-[2] text-ink-soft">{EVAL.lead}</p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[520px] max-w-3xl border-collapse text-left text-[14px]">
              <thead>
                <tr className="border-b-2 border-line-strong text-[12px] text-muted">
                  <th className="py-2 pr-4 font-bold">方法</th>
                  <th className="py-2 pr-4 font-bold">分類の正解数</th>
                  <th className="py-2 font-bold">重要度の正解数</th>
                </tr>
              </thead>
              <tbody>
                {EVAL.runs.map((r, i) => {
                  const best = i === EVAL.runs.length - 1;
                  return (
                    <tr key={r.label} className={`border-b border-line ${best ? "bg-brand-soft/60 font-bold" : ""}`}>
                      <td className="py-2.5 pr-4">
                        {r.label}
                        {r.note && <span className="ml-2 rounded bg-brand px-1.5 py-0.5 text-[11px] text-white">{r.note}</span>}
                      </td>
                      <td className={`py-2.5 pr-4 tabular-nums ${i === 0 ? "text-high" : "text-brand-dark"}`}>
                        <span className="text-[18px] font-black">{r.category}</span> / {EVAL.total}
                      </td>
                      <td className={`py-2.5 tabular-nums ${i === 0 ? "text-high" : "text-brand-dark"}`}>
                        <span className="text-[18px] font-black">{r.priority}</span> / {EVAL.total}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <ul className="mt-4 max-w-[48em] space-y-1 text-[14px] leading-[1.8] text-ink-soft">
            <li>
              <b className="text-ink">速さ：</b>
              {EVAL.speed}
            </li>
            <li>
              <b className="text-ink">費用：</b>
              {EVAL.cost}
            </li>
          </ul>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left text-[13.5px] leading-relaxed">
              <caption className="mb-2 text-left text-[13px] font-bold text-ink-soft">キーワード判定が外れ、AIが正しく分けた例</caption>
              <thead>
                <tr className="border-b-2 border-line-strong text-[12px] text-muted">
                  <th className="py-2 pr-4 font-bold">問い合わせ文</th>
                  <th className="py-2 pr-4 font-bold">正解</th>
                  <th className="py-2 pr-4 font-bold">キーワード判定</th>
                  <th className="py-2 font-bold">AI</th>
                </tr>
              </thead>
              <tbody>
                {EVAL.misses.map((m) => (
                  <tr key={m.text} className="border-b border-line align-top">
                    <td className="py-2.5 pr-4">「{m.text}」</td>
                    <td className="whitespace-nowrap py-2.5 pr-4">{m.expected}</td>
                    <td className="whitespace-nowrap py-2.5 pr-4 text-high">× {m.keyword}</td>
                    <td className="whitespace-nowrap py-2.5 font-bold text-brand-dark">○ {m.ai}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="mt-8 text-[17px] font-bold">分かったこと</h3>
          <ul className="mt-3 max-w-[48em] list-disc space-y-2 pl-5 text-[15px] leading-[1.9] text-ink-soft marker:text-muted">
            {EVAL.findings.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <p className="mt-5 max-w-[48em] border-l-4 border-accent pl-4 text-[13.5px] leading-[1.9] text-ink-soft">
            {EVAL.caveat}
            {EVAL_FILES && (
              <>
                {" "}
                <a href={EVAL_FILES} target="_blank" rel="noopener noreferrer" className="font-bold text-brand underline underline-offset-2">
                  30件の問い合わせ文を見る
                </a>
              </>
            )}
          </p>
        </Section>

        <Section id="features" title="できること">
          <dl className="grid gap-x-10 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div key={f.title} className="border-b border-line py-3">
                <dt className="text-[15px] font-bold">{f.title}</dt>
                <dd className="mt-0.5 text-[14px] leading-[1.8] text-ink-soft">{f.body}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <figure>
              <Shot src="/screenshots/desktop-reply.png" alt="返信の下書き。書き方の切り替えと【要確認】の表示" w={1440} h={1100} />
              <figcaption className="mt-2 text-[13px] text-muted">AIが作った返信の下書き。確定できない内容は【要確認】として残しています。</figcaption>
            </figure>
            <figure className="mx-auto w-full max-w-[260px]">
              <Shot src="/screenshots/mobile-result.png" alt="スマートフォンでの結果表示" w={390} h={844} />
              <figcaption className="mt-2 text-[13px] text-muted">スマートフォンでの表示（AIで分析）。</figcaption>
            </figure>
          </div>
          <figure className="mt-10">
            <Shot src="/screenshots/batch-result.png" alt="一括処理の結果。10件の問い合わせをAIで分類し、重要度の高い順に並べた表" w={1440} h={1100} />
            <figcaption className="mt-2 text-[13px] text-muted">
              一括処理：CSVの問い合わせ10件をAIで仕分け、重要度の高い順に並べたところ。結果はCSVで保存できます。
            </figcaption>
          </figure>
        </Section>

        <Section id="decisions" title="作りながら決めたこと">
          <ol className="max-w-[48em]">
            {IDEAS.map((idea, i) => (
              <li key={idea.title} className="border-b border-line py-4 first:pt-0">
                <p className="text-[16px] font-bold leading-snug">
                  <span className="mr-2 font-black text-brand tabular-nums">{i + 1}.</span>
                  {idea.title}
                </p>
                <p className="mt-1.5 text-[14px] leading-[1.9] text-ink-soft">{idea.body}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="limits" title="まだできないこと">
          <ul className="max-w-[48em] list-disc space-y-2 pl-5 text-[15px] leading-[1.8] text-ink-soft marker:text-muted">
            {LIMITS.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
          <p className="mt-5 max-w-[48em] text-[14px] leading-[1.9] text-ink-soft">
            <span className="font-bold text-ink">次に足すなら：</span>
            {FUTURE.join("、")}。
          </p>
          <p className="mt-3 max-w-[48em] text-[14px] leading-[1.9] text-ink-soft">
            <span className="font-bold text-ink">効果について：</span>
            {HYPOTHESES}
          </p>
        </Section>

        <Section id="safety" title="安全面で気をつけたこと">
          <ul className="max-w-[48em] list-disc space-y-2 pl-5 text-[15px] leading-[1.8] text-ink-soft marker:text-muted">
            {SECURITY.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Section>

        <Section id="scope" title="使った技術と、担当したこと">
          <div className="grid gap-10 lg:grid-cols-2">
            <dl className="text-[14px]">
              {TECH.map((t) => (
                <div key={t.name} className="grid grid-cols-[150px_1fr] gap-3 border-b border-line py-2.5">
                  <dt className="font-bold">{t.name}</dt>
                  <dd className="text-ink-soft">{t.role}</dd>
                </div>
              ))}
            </dl>
            <div className="text-[14px] leading-[1.9] text-ink-soft">
              <p>{SCOPE_NOTE}</p>
              <p className="mt-5 text-[17px] font-black text-ink">{PROFILE.displayName}</p>
              <p className="text-[13px]">{PROFILE.role}</p>
              <p className="mt-2">{PROFILE.experience.map((e) => `${e.label} ${e.value}`).join(" ／ ")}</p>
              <p className="mt-1">{PROFILE.skills.join(" / ")}</p>
              <p className="mt-4">
                デモ：
                <a href={PROFILE.demoUrl} className="break-all font-bold text-brand underline underline-offset-2">
                  {PROFILE.demoUrl.replace(/^https?:\/\//, "")}
                </a>
                {PROFILE.sourceUrl && (
                  <>
                    <br />
                    コード：
                    <a href={PROFILE.sourceUrl} target="_blank" rel="noopener noreferrer" className="break-all font-bold text-brand underline underline-offset-2">
                      {PROFILE.sourceUrl.replace(/^https?:\/\//, "")}
                    </a>
                  </>
                )}
              </p>
            </div>
          </div>
        </Section>

        <Section id="process" title="ご依頼いただく場合の進め方">
          <ol className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
            {PROCESS.map((p, i) => (
              <li key={p.title} className="border-t-2 border-brand pt-3">
                <p className="text-[16px] font-bold">
                  <span className="mr-2 font-black text-brand tabular-nums">{i + 1}.</span>
                  {p.title}
                </p>
                <p className="mt-1.5 text-[14px] leading-[1.9] text-ink-soft">{p.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[560px] max-w-4xl border-collapse text-left text-[14px]">
              <caption className="mb-2 text-left text-[16px] font-bold text-ink">料金と期間の目安</caption>
              <thead>
                <tr className="border-b-2 border-line-strong text-[12px] text-muted">
                  <th className="py-2 pr-4 font-bold">内容</th>
                  <th className="py-2 pr-4 font-bold">料金</th>
                  <th className="py-2 font-bold">期間</th>
                </tr>
              </thead>
              <tbody>
                {PRICING.map((p) => (
                  <tr key={p.item} className="border-b border-line align-top">
                    <td className="py-3 pr-4">
                      <b>{p.item}</b>
                      <span className="block text-[13px] text-ink-soft">{p.detail}</span>
                    </td>
                    <td className="whitespace-nowrap py-3 pr-4 text-[16px] font-black text-brand-dark">{p.price}</td>
                    <td className="whitespace-nowrap py-3 font-bold">{p.period}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 max-w-4xl text-[13px] leading-relaxed text-ink-soft">{PRICING_NOTE}</p>
          </div>
        </Section>

        <section id="contact" className="border-t border-line bg-paper px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-[22px] font-black leading-snug">似たものを作りたい方へ</h2>
            <p className="mt-3 max-w-[44em] text-[15px] leading-[1.9] text-ink-soft">
              「この作業、AIで楽にならないかな」くらいの段階でも大丈夫です。まず小さく作って、実際の文面で試しながら進めます。たとえば次のようなものです。
            </p>
            <ul className="mt-4 max-w-[48em] list-disc space-y-1.5 pl-5 text-[15px] leading-[1.8] marker:text-brand">
              {SIMILAR_WORKS.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
            <div className="mt-8">
              {PROFILE.contactUrl ? (
                <a
                  href={PROFILE.contactUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg bg-brand px-7 py-3.5 text-[15px] font-bold text-white hover:bg-brand-dark"
                >
                  {PROFILE.contactLabel}
                </a>
              ) : (
                <p className="text-[15px] font-bold">ご相談は、ご覧いただいている募集サイトのメッセージからお送りください。</p>
              )}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-16 border-b border-line px-4 py-12 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <h2 id={`${id}-title`} className="mb-6 text-[22px] font-black leading-snug sm:text-[24px]">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}

function Shot({ src, alt, w, h, priority }: { src: string; alt: string; w: number; h: number; priority?: boolean }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line-strong bg-white">
      <Image src={src} alt={alt} width={w} height={h} className="h-auto w-full" priority={priority} />
    </div>
  );
}

function RoleList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="border-l-4 border-brand pl-4">
      <p className="text-[15px] font-bold">{title}</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] leading-[1.8] text-ink-soft marker:text-muted">
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    </div>
  );
}
