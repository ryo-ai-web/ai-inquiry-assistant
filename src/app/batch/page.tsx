import type { Metadata } from "next";
import { BatchAssistant } from "@/components/BatchAssistant";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "一括処理",
  description: "CSVの問い合わせをまとめて分類し、重要度の高い順に並べてCSVで保存します。",
};

export default function BatchPage() {
  return (
    <>
      <SiteHeader current="/batch" />
      <main className="flex-1 bg-paper">
        <section className="border-b border-line bg-white">
          <div className="mx-auto max-w-5xl px-4 pb-8 pt-10 sm:px-6 sm:pt-12">
            <p className="text-[13px] font-bold text-muted">一括処理</p>
            <h1 className="mt-2 text-[24px] font-black leading-[1.4] sm:text-[30px]">たまった問い合わせを、まとめて仕分ける</h1>
            <p className="mt-3 max-w-[42em] text-[15px] leading-[1.9] text-ink-soft">
              問い合わせフォームやスプレッドシートからCSVを書き出して貼り付けると、1件ずつ分類と重要度を付け、急ぎのものから並べます。結果はCSVで保存して、元のスプレッドシートに戻せます。
            </p>
          </div>
        </section>
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
          <BatchAssistant />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
