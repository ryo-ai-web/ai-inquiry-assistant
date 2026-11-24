"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { EVAL_CASES } from "@/content/eval-inquiries";
import { extractInquiries, toCsv } from "@/lib/csv";
import {
  CATEGORY_LABELS,
  INPUT_LIMITS,
  PRIORITY_LABELS,
  type AnalyzeResponse,
  type AnalyzeSuccess,
  type Priority,
  type StatusResponse,
} from "@/lib/schema";

const MAX_ROWS = 20;
const CONCURRENCY = 2;
const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
const PRIORITY_STYLE: Record<Priority, string> = {
  high: "bg-high-soft text-high",
  medium: "bg-mid-soft text-mid",
  low: "bg-low-soft text-low",
};

type Row = {
  no: number;
  text: string;
  state: "waiting" | "running" | "done" | "error";
  data?: AnalyzeSuccess;
  error?: string;
};

/** サンプル：各分類から2件ずつ、計10件（架空の問い合わせ） */
function sampleCsv() {
  const picked = ["q1", "q4", "e2", "e4", "c2", "c3", "s2", "s5", "o3", "o4"];
  const lines = picked.map((id, i) => {
    const c = EVAL_CASES.find((x) => x.id === id)!;
    return [`11/${String(10 + i)}`, c.text];
  });
  return toCsv([["受付日", "問い合わせ内容"], ...lines]).replace(/^﻿/, "");
}

const countPending = (d?: AnalyzeSuccess) => (d ? (d.result.replies.polite.match(/【要確認/g) ?? []).length : 0);

export function BatchAssistant() {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [useAi, setUseAi] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [input, setInput] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [running, setRunning] = useState(false);
  const [sortByPriority, setSortByPriority] = useState(true);
  const [open, setOpen] = useState<number | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json() as Promise<StatusResponse>)
      .catch(() => ({ aiAvailable: false, accessCodeRequired: false, model: null }) as StatusResponse)
      .then((s) => {
        setStatus(s);
        setUseAi(s.aiAvailable);
      });
  }, []);

  const parsed = useMemo(() => extractInquiries(input), [input]);
  const usable = parsed.filter((t) => t.length >= INPUT_LIMITS.min && t.length <= INPUT_LIMITS.max);
  const skipped = parsed.length - usable.length;

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > 500_000) {
      setNotice("ファイルが大きすぎます（500KBまで）。");
      return;
    }
    setNotice(null);
    setInput(await file.text());
  };

  const start = async () => {
    if (usable.length === 0) {
      setNotice(`問い合わせが見つかりません。1件あたり${INPUT_LIMITS.min}文字以上で入力してください。`);
      return;
    }
    const list = usable.slice(0, MAX_ROWS);
    setNotice(
      usable.length > MAX_ROWS ? `一度に処理できるのは${MAX_ROWS}件までです。最初の${MAX_ROWS}件を処理します。` : null,
    );
    const initial: Row[] = list.map((text, i) => ({ no: i + 1, text, state: "waiting" }));
    setRows(initial);
    setOpen(null);
    setRunning(true);
    const controller = new AbortController();
    abortRef.current = controller;

    const update = (i: number, patch: Partial<Row>) => setRows((prev) => prev.map((r, j) => (j === i ? { ...r, ...patch } : r)));

    let next = 0;
    let stopAll = false;
    const worker = async () => {
      while (next < list.length && !controller.signal.aborted && !stopAll) {
        const i = next++;
        update(i, { state: "running" });
        try {
          const res = await fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: list[i], mode: useAi ? "ai" : "demo", accessCode: accessCode || undefined }),
            signal: controller.signal,
          });
          const data = (await res.json().catch(() => null)) as AnalyzeResponse | null;
          if (!data || !("ok" in data)) update(i, { state: "error", error: `想定外の応答（HTTP ${res.status}）` });
          else if (!data.ok) {
            update(i, { state: "error", error: data.error.message });
            // 認証・回数制限のエラーは残りも同じ結果になるので止める
            if (["ACCESS_CODE_REQUIRED", "RATE_LIMITED", "AI_AUTH_ERROR", "AI_NOT_CONFIGURED"].includes(data.error.code)) stopAll = true;
          } else update(i, { state: "done", data });
        } catch (e) {
          if ((e as Error).name === "AbortError") return;
          update(i, { state: "error", error: "通信に失敗しました。" });
        }
      }
    };
    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    setRows((prev) => prev.map((r) => (r.state === "waiting" || r.state === "running" ? { ...r, state: "error", error: "中止しました" } : r)));
    setRunning(false);
  };

  const stop = () => abortRef.current?.abort();

  const done = rows.filter((r) => r.state === "done");
  const counts = { high: 0, medium: 0, low: 0 } as Record<Priority, number>;
  done.forEach((r) => counts[r.data!.result.priority]++);
  const anyRule = done.some((r) => r.data!.source !== "ai");

  const view = useMemo(() => {
    if (!sortByPriority) return rows;
    return [...rows].sort((a, b) => {
      const pa = a.data ? PRIORITY_ORDER[a.data.result.priority] : 9;
      const pb = b.data ? PRIORITY_ORDER[b.data.result.priority] : 9;
      return pa - pb || a.no - b.no;
    });
  }, [rows, sortByPriority]);

  const download = () => {
    const header = ["番号", "重要度", "分類", "要約", "やること", "重要度の理由", "要確認の数", "判定方法", "問い合わせ内容"];
    const body = [...rows]
      .sort((a, b) => a.no - b.no)
      .map((r) => {
        const a = r.data?.result;
        return [
          r.no,
          a ? PRIORITY_LABELS[a.priority] : "",
          a ? CATEGORY_LABELS[a.category] : r.error ?? "",
          a?.summary ?? "",
          a?.actionItems.join(" / ") ?? "",
          a?.priorityReason ?? "",
          a ? countPending(r.data) : "",
          r.data ? (r.data.source === "ai" ? "AI" : "キーワード判定（AI未使用）") : "",
          r.text,
        ];
      });
    const blob = new Blob([toCsv([header, ...body])], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inquiries-result.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const finished = rows.length > 0 && !running;

  return (
    <div className="space-y-6">
      <section aria-labelledby="batch-input" className="rounded-xl border border-line-strong bg-white p-5 sm:p-7">
        <h2 id="batch-input" className="text-[17px] font-bold">
          1. 問い合わせをまとめて入れる
        </h2>
        <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">
          フォームやスプレッドシートから書き出したCSVをそのまま使えます。本文の列（「問い合わせ内容」「本文」など）は自動で見つけます。CSVでない場合は、1件ごとに「---」だけの行で区切ってください。
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setInput(sampleCsv());
              setNotice(null);
            }}
            disabled={running}
            className="rounded-lg border border-brand bg-brand-soft px-3.5 py-2 text-[13px] font-bold text-brand-dark hover:bg-brand/15 disabled:opacity-50"
          >
            サンプル10件を入れる（架空）
          </button>
          <label className="cursor-pointer rounded-lg border border-line-strong px-3.5 py-2 text-[13px] font-bold text-ink-soft hover:bg-paper">
            CSVファイルを選ぶ
            <input type="file" accept=".csv,.txt,text/csv,text/plain" className="sr-only" disabled={running} onChange={(e) => void onFile(e.target.files?.[0])} />
          </label>
        </div>

        <label htmlFor="batch-text" className="sr-only">
          問い合わせ（CSVまたは「---」区切り）
        </label>
        <textarea
          id="batch-text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={running}
          rows={8}
          placeholder={"受付日,問い合わせ内容\n11/10,予約画面が開けません。至急確認してください。\n11/11,10店舗で使う場合の料金を教えてください。"}
          className="mt-3 w-full rounded-lg border border-line-strong bg-white p-3 font-mono text-[13px] leading-relaxed focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
        <p className="mt-1.5 text-[13px] text-muted" aria-live="polite">
          {parsed.length > 0 ? `${usable.length}件を読み取りました${skipped ? `（文字数が範囲外の${skipped}件は除外）` : ""}。` : "まだ入力されていません。"}
          一度に{MAX_ROWS}件まで。個人情報は入れないでください。
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
          <fieldset className="flex items-center gap-4 text-[14px]">
            <legend className="sr-only">判定方法</legend>
            <label className={`flex items-center gap-1.5 ${status?.aiAvailable ? "" : "text-muted"}`}>
              <input type="radio" name="mode" checked={useAi} disabled={!status?.aiAvailable || running} onChange={() => setUseAi(true)} />
              AIで判定
            </label>
            <label className="flex items-center gap-1.5">
              <input type="radio" name="mode" checked={!useAi} disabled={running} onChange={() => setUseAi(false)} />
              キーワード判定（AI未使用）
            </label>
          </fieldset>
          {useAi && status?.accessCodeRequired && (
            <input
              type="password"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="アクセスコード"
              aria-label="アクセスコード"
              className="w-40 rounded-lg border border-line-strong px-3 py-2 text-[14px]"
            />
          )}
        </div>
        {status && !status.aiAvailable && (
          <p className="mt-2 text-[13px] text-demo">この公開版はAIにつないでいないため、キーワード判定で動きます。精度はAIより大きく下がります。</p>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          {running ? (
            <button type="button" onClick={stop} className="rounded-lg border border-line-strong px-6 py-3 text-[15px] font-bold hover:bg-paper">
              中止する
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void start()}
              disabled={usable.length === 0}
              className="rounded-lg bg-accent px-6 py-3 text-[15px] font-bold text-ink hover:bg-accent-dark disabled:opacity-50"
            >
              {usable.length > 0 ? `${Math.min(usable.length, MAX_ROWS)}件を仕分ける` : "仕分ける"}
            </button>
          )}
        </div>
        {notice && <p className="mt-3 text-[13px] font-bold text-high">{notice}</p>}
      </section>

      {rows.length > 0 && (
        <section aria-labelledby="batch-result" className="rounded-xl border border-line-strong bg-white p-5 sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="batch-result" className="text-[17px] font-bold">
                2. 結果
              </h2>
              <p className="mt-1 text-[14px] text-ink-soft" aria-live="polite">
                {running ? `処理中… ${done.length + rows.filter((r) => r.state === "error").length} / ${rows.length}件` : `${rows.length}件中 ${done.length}件を仕分けました。`}
                {done.length > 0 && (
                  <span className="ml-2">
                    高 <b className="text-high">{counts.high}</b>・中 <b className="text-mid">{counts.medium}</b>・低 <b className="text-low">{counts.low}</b>
                  </span>
                )}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-1.5 text-[13px] text-ink-soft">
                <input type="checkbox" checked={sortByPriority} onChange={(e) => setSortByPriority(e.target.checked)} />
                重要度の高い順
              </label>
              <button
                type="button"
                onClick={download}
                disabled={!finished || done.length === 0}
                className="rounded-lg border border-brand px-4 py-2 text-[13px] font-bold text-brand-dark hover:bg-brand-soft disabled:opacity-50"
              >
                CSVで保存
              </button>
            </div>
          </div>

          {anyRule && (
            <p className="mt-3 rounded-md bg-demo-soft px-3 py-2 text-[13px] text-demo">
              キーワード判定（AI未使用）の結果を含みます。分類・重要度が外れやすく、要約は本文の冒頭をそのまま表示しています。
            </p>
          )}

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left text-[13.5px]">
              <thead>
                <tr className="border-b-2 border-line-strong text-[12px] text-muted">
                  <th className="w-10 py-2 pr-2 font-bold">No.</th>
                  <th className="w-16 py-2 pr-3 font-bold">重要度</th>
                  <th className="w-40 py-2 pr-3 font-bold">分類</th>
                  <th className="py-2 pr-3 font-bold">内容</th>
                  <th className="w-16 py-2 font-bold">要確認</th>
                </tr>
              </thead>
              <tbody>
                {view.map((r) => {
                  const a = r.data?.result;
                  const isOpen = open === r.no;
                  return (
                    <tr key={r.no} className="border-b border-line align-top">
                      <td className="py-2.5 pr-2 tabular-nums text-muted">{r.no}</td>
                      <td className="py-2.5 pr-3">
                        {a ? (
                          <span className={`rounded px-2 py-0.5 text-[12px] font-bold ${PRIORITY_STYLE[a.priority]}`}>{PRIORITY_LABELS[a.priority]}</span>
                        ) : (
                          <span className="text-[12px] text-muted">{r.state === "running" ? "処理中" : r.state === "waiting" ? "待機" : "—"}</span>
                        )}
                      </td>
                      <td className="py-2.5 pr-3 font-bold">{a ? CATEGORY_LABELS[a.category] : ""}</td>
                      <td className="py-2.5 pr-3">
                        {r.state === "error" ? (
                          <span className="text-high">{r.error}</span>
                        ) : a ? (
                          <button type="button" onClick={() => setOpen(isOpen ? null : r.no)} aria-expanded={isOpen} className="text-left hover:text-brand-dark">
                            {r.data!.source === "ai" ? a.summary : r.text.slice(0, 60) + (r.text.length > 60 ? "…" : "")}
                            <span className="ml-1 text-[12px] font-bold text-brand">{isOpen ? "閉じる" : "詳しく"}</span>
                          </button>
                        ) : (
                          <span className="text-ink-soft">{r.text.slice(0, 60)}</span>
                        )}
                        {a && isOpen && (
                          <div className="mt-2 space-y-1.5 rounded-md bg-paper p-3 text-[13px] leading-relaxed text-ink-soft">
                            <p>
                              <b className="text-ink">重要度の理由：</b>
                              {a.priorityReason}
                            </p>
                            <p>
                              <b className="text-ink">やること：</b>
                              {a.actionItems.join(" / ")}
                            </p>
                            <p className="whitespace-pre-wrap">
                              <b className="text-ink">本文：</b>
                              {r.text}
                            </p>
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 tabular-nums">{a ? countPending(r.data) : ""}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[12px] text-muted">返信の下書きは1件ずつの画面で作成・編集できます。AIの判定は誤りを含む可能性があるため、必ず人が確認してください。</p>
        </section>
      )}
    </div>
  );
}
