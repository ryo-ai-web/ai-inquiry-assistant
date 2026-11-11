import Link from "next/link";
import { InquiryAssistant } from "@/components/InquiryAssistant";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export default function Home() {
  return (
    <>
      <SiteHeader current="/" />
      <main className="flex-1">
        <section className="border-b border-line bg-white">
          <div className="mx-auto max-w-6xl px-4 pb-10 pt-10 sm:px-6 sm:pt-14">
            <p className="text-[13px] font-bold text-muted">自主制作のデモ（2026年11月）</p>
            <h1 className="mt-3 text-[24px] font-black leading-[1.4] tracking-wide text-ink sm:text-[36px]">問い合わせ対応アシスタント</h1>
            <p className="mt-4 max-w-[40em] text-[15px] leading-[1.9] text-ink-soft sm:text-base">
              問い合わせの文面を貼り付けると、種類（質問・見積もり・不具合など）と重要度を判定し、返信の下書きを3通りの書き方で作ります。
              送信まではしません。下書きを人が直してから使う前提です。
            </p>
            <p className="mt-3 max-w-[40em] text-[13px] leading-relaxed text-muted">
              この公開版はAIにつないでいないため、用意した出力例とキーワードによる簡易判定で動きます。
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href="#try"
                className="inline-flex items-center justify-center rounded-lg bg-accent px-6 py-3 text-[15px] font-bold text-ink hover:bg-accent-dark"
              >
                デモを動かす ↓
              </a>
              <Link href="/works" className="text-sm font-bold text-brand underline underline-offset-4 hover:no-underline">
                作った理由と、試してみた結果
              </Link>
            </div>
          </div>
        </section>

        <section id="try" className="scroll-mt-16 px-4 pb-20 pt-10 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6">
              <h2 className="text-[20px] font-black leading-snug sm:text-[22px]">デモ</h2>
              <p className="mt-1.5 text-[14px] text-ink-soft">サンプルのボタンを押すと、架空の問い合わせ文が入ります。自分で書いた文章でも動きます。</p>
            </div>
            <InquiryAssistant />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
