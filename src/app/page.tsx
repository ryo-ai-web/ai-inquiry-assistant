import Link from "next/link";
import { InquiryAssistant } from "@/components/InquiryAssistant";
import { SelfMadeBadge, SiteFooter, SiteHeader } from "@/components/SiteHeader";

export default function Home() {
  return (
    <>
      <SiteHeader current="/" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-8 sm:px-6 sm:pt-10">
        <div className="mb-8 max-w-3xl">
          <SelfMadeBadge />
          <h1 className="mt-3 text-[26px] font-bold leading-snug tracking-wide text-ink sm:text-[30px]">
            問い合わせの一次対応を、AIが下書きします。
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
            問い合わせ文を入力すると、分類・要約・重要度・対応事項を整理し、トーン別の返信案を作成します。
            返信は自動送信せず、担当者が確認・修正してから使う設計です。
          </p>
          <p className="mt-2 text-sm">
            <Link href="/works" className="font-semibold text-brand underline underline-offset-4 hover:text-brand-dark">
              制作の背景と工夫した点を見る →
            </Link>
          </p>
        </div>
        <InquiryAssistant />
      </main>
      <SiteFooter />
    </>
  );
}
