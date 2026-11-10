import Link from "next/link";
import { HeroVisual } from "@/components/HeroVisual";
import { InquiryAssistant } from "@/components/InquiryAssistant";
import { SelfMadeBadge, SiteFooter, SiteHeader } from "@/components/SiteHeader";

export default function Home() {
  return (
    <>
      <SiteHeader current="/" />
      <main className="flex-1">
        <section className="bg-hero">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-14 pt-10 sm:px-6 sm:pt-14 lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] lg:pb-20">
            <div>
              <SelfMadeBadge>自主制作デモ｜APIキーがなくても動作を確認できます</SelfMadeBadge>
              <h1 className="mt-6 text-[30px] font-black leading-[1.45] tracking-wide text-ink sm:text-[40px]">
                問い合わせの仕分けと
                <br />
                返信の下書きを、
                <br />
                <span className="text-brand">AIがお手伝い。</span>
              </h1>
              <p className="mt-5 max-w-[34em] text-[15px] leading-[1.9] text-ink-soft sm:text-base">
                届いた問い合わせを貼り付けるだけで、内容の分類・要約・重要度・やるべきことを整理し、トーン別の返信案を作ります。
                返信は自動で送らず、担当者が確認してから使う設計です。
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#try"
                  className="inline-flex items-center justify-center rounded-xl bg-accent px-8 py-4 text-[15px] font-bold text-ink shadow-[var(--shadow-cta)] transition-transform hover:translate-y-px hover:bg-accent-dark"
                >
                  さっそく試してみる
                </a>
                <Link href="/works" className="inline-flex items-center justify-center px-2 py-2 text-sm font-bold text-brand underline-offset-4 hover:underline">
                  制作の背景・工夫を見る →
                </Link>
              </div>
            </div>
            <HeroVisual />
          </div>
        </section>

        <section id="try" className="scroll-mt-16 px-4 pb-20 pt-14 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <h2 className="text-[24px] font-black leading-snug tracking-wide sm:text-[32px]">実際に試してみる</h2>
              <p className="mt-3 text-[15px] text-ink-soft">サンプルをワンクリックで入力できます。ご自身の文章を貼り付けても動きます。</p>
            </div>
            <InquiryAssistant />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
