"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SAMPLES } from "@/lib/samples";
import {
  CATEGORY_LABELS,
  INPUT_LIMITS,
  PRIORITY_LABELS,
  TONES,
  TONE_LABELS,
  validateInput,
  type AnalyzeResponse,
  type AnalyzeSuccess,
  type Priority,
  type StatusResponse,
  type Tone,
} from "@/lib/schema";

type Mode = "ai" | "demo";
type Phase =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; message: string; code?: string }
  | { kind: "done"; data: AnalyzeSuccess; runId: number };

export function InquiryAssistant() {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [mode, setMode] = useState<Mode>("demo");
  const [text, setText] = useState("");
  const [sampleId, setSampleId] = useState<string | null>(null);
  const [accessCode, setAccessCode] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const resultRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const run = useCallback(
    async (opts?: { text?: string; sampleId?: string | null; mode?: Mode }) => {
      const body = {
        text: opts?.text ?? text,
        sampleId: opts?.sampleId !== undefined ? opts.sampleId : sampleId,
        mode: opts?.mode ?? mode,
        accessCode: accessCode || undefined,
      };
      const invalid = validateInput(body.text);
      if (invalid) {
        setInputError(invalid.message);
        return;
      }
      setInputError(null);
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setPhase({ kind: "loading" });

      // スマートフォンでは結果エリアへ移動する
      if (window.matchMedia("(max-width: 1023px)").matches) {
        requestAnimationFrame(() => resultRef.current?.scrollIntoView({ block: "start" }));
      }

      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal,
        });
        let data: AnalyzeResponse | null = null;
        try {
          data = (await res.json()) as AnalyzeResponse;
        } catch {
          data = null;
        }
        if (!data || typeof data !== "object" || !("ok" in data)) {
          setPhase({ kind: "error", message: `サーバーから想定外の応答がありました（HTTP ${res.status}）。` });
          return;
        }
        if (!data.ok) {
          setPhase({ kind: "error", message: data.error.message, code: data.error.code });
          return;
        }
        setPhase({ kind: "done", data, runId: Date.now() });
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        setPhase({ kind: "error", message: "通信に失敗しました。ネットワーク接続を確認して、もう一度お試しください。" });
      }
    },
    [text, sampleId, mode, accessCode],
  );

  // AIモードの可否を確認し、URLの ?sample= があれば入力する
  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams(window.location.search);
    const preset = SAMPLES.find((s) => s.id === params.get("sample"));
    const forceDemo = params.get("mode") === "demo";

    fetch("/api/status")
      .then((r) => r.json() as Promise<StatusResponse>)
      .catch(() => ({ aiAvailable: false, accessCodeRequired: false, model: null }) as StatusResponse)
      .then((s) => {
        if (cancelled) return;
        setStatus(s);
        const initialMode: Mode = s.aiAvailable && !forceDemo ? "ai" : "demo";
        setMode(initialMode);
        if (preset) {
          setText(preset.text);
          setSampleId(preset.id);
          if (params.get("run") === "1" && initialMode === "demo") {
            void run({ text: preset.text, sampleId: preset.id, mode: "demo" });
          }
        }
      });
    return () => {
      cancelled = true;
    };
    // 初回のみ実行
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pickSample = (id: string) => {
    const s = SAMPLES.find((x) => x.id === id);
    if (!s) return;
    setText(s.text);
    setSampleId(s.id);
    setInputError(null);
  };

  const clearAll = () => {
    abortRef.current?.abort();
    setText("");
    setSampleId(null);
    setInputError(null);
    setPhase({ kind: "idle" });
  };

  const length = text.trim().length;
  const over = length > INPUT_LIMITS.max;
  const loading = phase.kind === "loading";
  const needsCode = mode === "ai" && status?.accessCodeRequired;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start">
      {/* 入力 */}
      <section aria-labelledby="input-heading" className="rounded-2xl bg-surface p-5 shadow-[var(--shadow-card)] ring-1 ring-line/60 sm:p-8 lg:sticky lg:top-24">
        <StepTitle n={1} id="input-heading">問い合わせ文を入力</StepTitle>

        <ModeSwitch status={status} mode={mode} onChange={setMode} disabled={loading} />

        <div className="mt-5">
          <p className="text-sm font-semibold text-ink-soft">サンプルを入力する（架空の問い合わせ）</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {SAMPLES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => pickSample(s.id)}
                disabled={loading}
                aria-pressed={sampleId === s.id}
                className={`rounded-full border px-3 py-1.5 text-[13px] transition-colors disabled:opacity-50 ${
                  sampleId === s.id
                    ? "border-brand bg-brand-soft font-semibold text-brand-dark"
                    : "border-line-strong bg-surface text-ink-soft hover:border-brand hover:text-brand-dark"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-end justify-between">
            <label htmlFor="inquiry" className="text-sm font-semibold text-ink-soft">
              問い合わせ内容
            </label>
            <span className={`text-xs tabular-nums ${over ? "font-semibold text-high" : "text-muted"}`} aria-live="polite">
              {length.toLocaleString()} / {INPUT_LIMITS.max.toLocaleString()}文字
            </span>
          </div>
          <textarea
            id="inquiry"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (inputError) setInputError(null);
            }}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && !loading) {
                e.preventDefault();
                void run();
              }
            }}
            rows={11}
            placeholder={"例）お世話になっております。貴社サービスの導入を検討しており、料金について教えていただけますか。"}
            aria-invalid={Boolean(inputError) || over}
            aria-describedby="inquiry-help inquiry-error"
            className={`mt-1.5 block w-full resize-y rounded-xl border bg-surface px-3.5 py-3 text-[15px] leading-relaxed text-ink placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-brand/30 ${
              inputError || over ? "border-high" : "border-line-strong focus:border-brand"
            }`}
          />
          <p id="inquiry-error" role="alert" className="min-h-0 text-sm text-high">
            {inputError && <span className="mt-1.5 block">{inputError}</span>}
          </p>
          <p id="inquiry-help" className="mt-1.5 text-xs leading-relaxed text-muted">
            氏名・電話番号・住所などの個人情報や機密情報は入力しないでください。入力内容はサーバーに保存されません。
          </p>
        </div>

        {needsCode && (
          <div className="mt-4">
            <label htmlFor="access-code" className="text-sm font-semibold text-ink-soft">
              アクセスコード
            </label>
            <input
              id="access-code"
              type="password"
              autoComplete="off"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-line-strong px-3.5 py-2 text-[15px] focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
            <p className="mt-1 text-xs text-muted">AIモードは、お渡ししたアクセスコードを入力した場合のみ利用できます。</p>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => void run()}
            disabled={loading}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3.5 text-[15px] font-bold text-ink shadow-[var(--shadow-cta)] transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:shadow-none disabled:opacity-60"
          >
            {loading ? <Spinner /> : null}
            {loading ? "分析しています…" : mode === "ai" ? "AIで分析する" : "デモで結果を見る"}
          </button>
          <button
            type="button"
            onClick={clearAll}
            disabled={loading || (!text && phase.kind === "idle")}
            className="rounded-xl border border-line-strong px-5 py-3.5 text-[15px] font-bold text-ink-soft transition-colors hover:bg-paper disabled:cursor-not-allowed disabled:opacity-50"
          >
            クリア
          </button>
        </div>
        <p className="mt-2 hidden text-xs text-muted sm:block">Ctrl（⌘）+ Enter でも分析できます。</p>
      </section>

      {/* 結果 */}
      <section aria-labelledby="result-heading" ref={resultRef} className="scroll-mt-4">
        <div className="rounded-2xl bg-surface p-5 shadow-[var(--shadow-card)] ring-1 ring-line/60 sm:p-8">
          <StepTitle n={2} id="result-heading">結果を確認・修正して使う</StepTitle>
          <div aria-live="polite" aria-busy={loading}>
            {phase.kind === "idle" && <EmptyState />}
            {phase.kind === "loading" && <LoadingState mode={mode} />}
            {phase.kind === "error" && (
              <ErrorState
                message={phase.message}
                code={phase.code}
                onRetry={() => void run()}
                onDemo={
                  mode === "ai"
                    ? () => {
                        setMode("demo");
                        void run({ mode: "demo" });
                      }
                    : undefined
                }
              />
            )}
            {phase.kind === "done" && <ResultView key={phase.runId} data={phase.data} />}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- 部品 ---------- */

function StepTitle({ n, id, children }: { n: number; id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="flex items-center gap-2.5 text-[17px] font-bold text-ink">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-black text-white">{n}</span>
      {children}
    </h2>
  );
}

function ModeSwitch({
  status,
  mode,
  onChange,
  disabled,
}: {
  status: StatusResponse | null;
  mode: Mode;
  onChange: (m: Mode) => void;
  disabled: boolean;
}) {
  const aiAvailable = status?.aiAvailable ?? false;
  return (
    <div className="mt-4">
      <div role="radiogroup" aria-label="動作モード" className="grid grid-cols-2 gap-1 rounded-full bg-paper p-1 ring-1 ring-line">
        {(
          [
            { value: "ai", label: "AIモード", enabled: aiAvailable },
            { value: "demo", label: "デモモード（AI未使用）", enabled: true },
          ] as const
        ).map((opt) => (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={mode === opt.value}
            disabled={!opt.enabled || disabled}
            onClick={() => onChange(opt.value)}
            className={`rounded-full px-2 py-2 text-[13px] font-bold transition-colors disabled:cursor-not-allowed ${
              mode === opt.value
                ? "bg-brand text-white shadow-sm"
                : "text-muted hover:text-ink disabled:hover:text-muted"
            } ${!opt.enabled ? "opacity-50" : ""}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted">
        {status === null
          ? "利用できるモードを確認しています…"
          : mode === "ai"
            ? `生成AI API（${status.model ?? "Claude"}）で分析します。数秒〜20秒ほどかかります。`
            : aiAvailable
              ? "AIを使わずに動作を確認できます。サンプルは用意した出力例を、それ以外はキーワードによる簡易判定を表示します。"
              : "このデモ環境ではAI APIを設定していないため、AIを使わないデモモードで動作します。サンプルは用意した出力例を、それ以外はキーワードによる簡易判定を表示します。"}
      </p>
    </div>
  );
}

function EmptyState() {
  const steps = [
    "左の欄に問い合わせ文を貼り付けるか、サンプルを選びます",
    "「分析する」を押すと、分類・要約・重要度・対応事項・返信案が表示されます",
    "返信案はトーンを切り替え、内容を確認・修正してからコピーします",
  ];
  return (
    <div className="mt-5 rounded-lg border border-dashed border-line-strong bg-paper/60 p-5 sm:p-6">
      <p className="text-[15px] font-semibold text-ink">まだ結果はありません</p>
      <ol className="mt-3 space-y-2.5">
        {steps.map((s, i) => (
          <li key={s} className="flex gap-3 text-sm text-ink-soft">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface text-[11px] font-bold text-muted">
              {i + 1}
            </span>
            {s}
          </li>
        ))}
      </ol>
      <p className="mt-4 text-xs text-muted">このツールは返信を自動送信しません。最終確認は必ず人が行う設計です。</p>
    </div>
  );
}

function LoadingState({ mode }: { mode: Mode }) {
  return (
    <div className="mt-5" role="status">
      <p className="flex items-center gap-2 text-sm font-semibold text-brand-dark">
        <Spinner className="text-brand" />
        {mode === "ai" ? "AIが問い合わせを読み取っています…" : "結果を準備しています…"}
      </p>
      <div className="mt-4 space-y-3" aria-hidden="true">
        <div className="h-7 w-2/5 rounded bg-paper" />
        <div className="h-16 rounded bg-paper" />
        <div className="h-24 rounded bg-paper" />
        <div className="h-40 rounded bg-paper" />
      </div>
    </div>
  );
}

function ErrorState({
  message,
  code,
  onRetry,
  onDemo,
}: {
  message: string;
  code?: string;
  onRetry: () => void;
  onDemo?: () => void;
}) {
  return (
    <div role="alert" className="mt-5 rounded-lg border border-high/30 bg-high-soft p-5">
      <p className="flex items-center gap-2 font-bold text-high">
        <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="10" cy="10" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M10 5.5v5.5M10 13.8v.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        結果を表示できませんでした
      </p>
      <p className="mt-2 text-sm text-ink">{message}</p>
      {code && <p className="mt-1 text-xs text-muted">エラーコード：{code}</p>}
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={onRetry} className="rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-dark">
          もう一度試す
        </button>
        {onDemo && (
          <button type="button" onClick={onDemo} className="rounded-lg border border-line-strong bg-surface px-4 py-2 text-sm text-ink-soft hover:bg-paper">
            デモモードで表示する
          </button>
        )}
      </div>
    </div>
  );
}

function SourceBanner({ data }: { data: AnalyzeSuccess }) {
  if (data.source === "ai") {
    return (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg bg-brand-soft px-4 py-2.5 text-[13px] text-brand-dark">
        <span className="font-bold">生成AIによる分析結果</span>
        <span className="text-brand-dark/80">
          {data.model} ・ {(data.elapsedMs / 1000).toFixed(1)}秒
        </span>
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-demo/20 bg-demo-soft px-4 py-2.5 text-[13px] leading-relaxed text-demo">
      <span className="font-bold">デモモード（AI未使用）</span>
      <span className="ml-2">
        {data.source === "demo-sample"
          ? "サンプル用にあらかじめ用意した出力例を表示しています。"
          : "キーワードによる簡易判定とテンプレートの返信案です。AIによる分析ではありません。"}
      </span>
    </div>
  );
}

const PRIORITY_STYLE: Record<Priority, string> = {
  high: "bg-high-soft text-high border-high/25",
  medium: "bg-mid-soft text-mid border-mid/25",
  low: "bg-low-soft text-low border-low/25",
};

function ResultView({ data }: { data: AnalyzeSuccess }) {
  const r = data.result;
  const [tone, setTone] = useState<Tone>("polite");
  const [drafts, setDrafts] = useState<Record<Tone, string>>({ ...r.replies });
  const [done, setDone] = useState<boolean[]>(() => r.actionItems.map(() => false));

  const draft = drafts[tone];
  const edited = draft !== r.replies[tone];
  const placeholders = draft.match(/【[^】]*】/g)?.length ?? 0;

  const allText = [
    `【分類】${CATEGORY_LABELS[r.category]}`,
    `【重要度】${PRIORITY_LABELS[r.priority]}（${r.priorityReason}）`,
    `【要約】${r.summary}`,
    `【対応事項】\n${r.actionItems.map((a) => `・${a}`).join("\n")}`,
    r.pointsToConfirm.length ? `【確認が必要な点】\n${r.pointsToConfirm.map((a) => `・${a}`).join("\n")}` : "",
    `【返信案（${TONE_LABELS[tone]}）】\n${draft}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  return (
    <div className="mt-5 space-y-6">
      <SourceBanner data={data} />

      {/* 分類と重要度 */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-paper p-4 ring-1 ring-line">
          <p className="text-xs font-semibold text-muted">分類</p>
          <p className="mt-1 text-[17px] font-bold text-ink">{CATEGORY_LABELS[r.category]}</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">{r.categoryReason}</p>
        </div>
        <div className="rounded-xl bg-paper p-4 ring-1 ring-line">
          <p className="text-xs font-semibold text-muted">重要度</p>
          <p className="mt-1">
            <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-[15px] font-bold ${PRIORITY_STYLE[r.priority]}`}>
              {PRIORITY_LABELS[r.priority]}
            </span>
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">{r.priorityReason}</p>
        </div>
      </div>

      <Block title="要約">
        <p className="text-[15px] leading-relaxed text-ink">{r.summary}</p>
      </Block>

      <div className="grid gap-6">
        <Block title="必要な対応事項">
          {r.actionItems.length === 0 ? (
            <p className="text-sm text-muted">抽出された対応事項はありません。</p>
          ) : (
            <ul className="space-y-2">
              {r.actionItems.map((a, i) => (
                <li key={a}>
                  <label className="flex cursor-pointer gap-2.5 text-sm leading-relaxed text-ink">
                    <input
                      type="checkbox"
                      checked={done[i] ?? false}
                      onChange={(e) => setDone((d) => d.map((v, j) => (j === i ? e.target.checked : v)))}
                      className="mt-1 h-4 w-4 shrink-0 accent-brand"
                    />
                    <span className={done[i] ? "text-muted line-through" : ""}>{a}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </Block>
        <Block title="回答前に確認が必要な点">
          {r.pointsToConfirm.length === 0 ? (
            <p className="text-sm text-muted">特にありません。</p>
          ) : (
            <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-ink marker:text-muted">
              {r.pointsToConfirm.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          )}
        </Block>
      </div>

      {/* 返信案 */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-ink">返信案</h3>
          <div role="tablist" aria-label="返信のトーン" className="flex rounded-full bg-paper p-1 ring-1 ring-line">
            {TONES.map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tone === t}
                onClick={() => setTone(t)}
                className={`rounded-full px-3.5 py-1.5 text-[13px] font-bold transition-colors ${
                  tone === t ? "bg-brand text-white shadow-sm" : "text-muted hover:text-ink"
                }`}
              >
                {TONE_LABELS[t]}
                {drafts[t] !== r.replies[t] && <span className={`ml-1 ${tone === t ? "text-accent" : "text-brand"}`}>●</span>}
              </button>
            ))}
          </div>
        </div>

        <label htmlFor="reply-draft" className="sr-only">
          返信案（{TONE_LABELS[tone]}）
        </label>
        <textarea
          id="reply-draft"
          value={draft}
          onChange={(e) => setDrafts((d) => ({ ...d, [tone]: e.target.value }))}
          rows={14}
          className="mt-3 block w-full resize-y rounded-xl border border-line-strong bg-surface px-4 py-3 text-[15px] leading-relaxed text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        />

        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className={placeholders > 0 ? "font-semibold text-mid" : "text-low"}>
            {placeholders > 0
              ? `【 】で囲まれた要確認・差し込み箇所が ${placeholders} か所あります。送信前に書き換えてください。`
              : "差し込み箇所はありません。内容を確認してから使用してください。"}
          </span>
          {edited && (
            <button
              type="button"
              onClick={() => setDrafts((d) => ({ ...d, [tone]: r.replies[tone] }))}
              className="text-muted underline underline-offset-2 hover:text-ink"
            >
              編集を元に戻す
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <CopyButton text={draft} label="返信案をコピー" primary />
          <CopyButton text={allText} label="分析結果をまとめてコピー" />
        </div>

        <p className="mt-4 rounded-lg bg-paper px-4 py-3 text-xs leading-relaxed text-ink-soft">
          このツールは返信を送信しません。AIの出力には誤りが含まれる可能性があります。事実関係・金額・日付・宛名を確認し、必要に応じて修正してからご利用ください。
        </p>
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-bold text-ink">{title}</h3>
      {children}
    </div>
  );
}

async function writeClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // フォールバックへ
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

function CopyButton({ text, label, primary = false }: { text: string; label: string; primary?: boolean }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  useEffect(() => {
    if (state === "idle") return;
    const t = setTimeout(() => setState("idle"), 2200);
    return () => clearTimeout(t);
  }, [state]);

  return (
    <button
      type="button"
      onClick={async () => setState((await writeClipboard(text)) ? "copied" : "failed")}
      className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${
        primary ? "bg-brand text-white hover:bg-brand-dark" : "border-2 border-brand/40 bg-surface text-brand-dark hover:bg-brand-soft"
      }`}
    >
      <span aria-live="polite">
        {state === "copied" ? "コピーしました" : state === "failed" ? "コピーできませんでした" : label}
      </span>
    </button>
  );
}

function Spinner({ className = "" }: { className?: string }) {
  return (
    <svg className={`h-4 w-4 animate-spin ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
