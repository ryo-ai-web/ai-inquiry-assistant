/**
 * 一括処理用の小さなCSVユーティリティ（外部ライブラリなし）。
 * Excel・Googleスプレッドシートから書き出したCSV（ダブルクォート・改行入りのセル）を想定。
 */

export function parseCsv(input: string): string[][] {
  const text = input.replace(/^﻿/, "");
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          quoted = false;
        }
      } else {
        field += ch;
      }
      continue;
    }
    if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += ch;
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

const TEXT_HEADERS = ["問い合わせ内容", "問い合わせ", "お問い合わせ内容", "本文", "内容", "メッセージ", "text", "body", "message"];

/**
 * 問い合わせ本文が入っている列を選ぶ。
 * 見出しに「本文」「内容」などがあればその列、なければ平均文字数が最も長い列。
 */
export function pickTextColumn(rows: string[][]): { column: number; hasHeader: boolean } {
  if (rows.length === 0) return { column: 0, hasHeader: false };
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const byName = header.findIndex((h) => TEXT_HEADERS.includes(h));
  if (byName >= 0) return { column: byName, hasHeader: true };

  const width = Math.max(...rows.map((r) => r.length));
  let best = 0;
  let bestLen = -1;
  for (let c = 0; c < width; c++) {
    const avg = rows.reduce((n, r) => n + (r[c]?.length ?? 0), 0) / rows.length;
    if (avg > bestLen) {
      bestLen = avg;
      best = c;
    }
  }
  // 1行目だけ極端に短ければ見出しとみなす
  const first = rows[0][best]?.length ?? 0;
  const hasHeader = rows.length > 1 && first < 15 && bestLen > 20;
  return { column: best, hasHeader };
}

/** 問い合わせ本文の一覧を取り出す（CSVでなければ空行2つ以上で区切ったテキストとして扱う） */
export function extractInquiries(input: string): string[] {
  const trimmed = input.trim();
  if (!trimmed) return [];
  const rows = parseCsv(trimmed);
  const looksLikeCsv = rows.length > 1 && rows.some((r) => r.length > 1);
  if (!looksLikeCsv) {
    return trimmed
      .split(/\n\s*\n\s*\n|\n-{3,}\n/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  const { column, hasHeader } = pickTextColumn(rows);
  return rows
    .slice(hasHeader ? 1 : 0)
    .map((r) => (r[column] ?? "").trim())
    .filter(Boolean);
}

function escapeCell(v: string | number) {
  const s = String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Excelで文字化けしないよう、先頭にBOMを付けたCSVを作る */
export function toCsv(rows: (string | number)[][]): string {
  return "﻿" + rows.map((r) => r.map(escapeCell).join(",")).join("\r\n") + "\r\n";
}
