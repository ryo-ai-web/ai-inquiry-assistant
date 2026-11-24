import { describe, expect, it } from "vitest";
import { extractInquiries, parseCsv, pickTextColumn, toCsv } from "@/lib/csv";

describe("parseCsv", () => {
  it("ダブルクォート・カンマ・改行を含むセルを読める", () => {
    const rows = parseCsv('日時,本文\r\n11/1,"予約画面が\n開けません, 至急"\r\n11/2,"""見積""をください"\r\n');
    expect(rows).toEqual([
      ["日時", "本文"],
      ["11/1", "予約画面が\n開けません, 至急"],
      ["11/2", '"見積"をください'],
    ]);
  });

  it("BOMと空行を無視する", () => {
    expect(parseCsv("﻿a,b\n\n1,2")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
  });
});

describe("pickTextColumn", () => {
  it("見出しに「本文」があればその列を使う", () => {
    expect(pickTextColumn([["名前", "本文"], ["山田", "短い"]])).toEqual({ column: 1, hasHeader: true });
  });

  it("見出しがなければ一番長い列を使う", () => {
    const rows = [
      ["A社", "管理画面にログインすると真っ白なまま何も表示されません。"],
      ["B社", "10店舗で使う場合、月々いくらくらいになりますか？"],
    ];
    expect(pickTextColumn(rows)).toEqual({ column: 1, hasHeader: false });
  });
});

describe("extractInquiries", () => {
  it("CSVなら本文の列だけを取り出す", () => {
    expect(extractInquiries("受付日,問い合わせ内容\n11/1,予約画面が開けません\n11/2,見積もりをお願いします")).toEqual([
      "予約画面が開けません",
      "見積もりをお願いします",
    ]);
  });

  it("CSVでなければ「---」の行で区切る", () => {
    expect(extractInquiries("1通目の本文です\n---\n2通目の本文です")).toEqual(["1通目の本文です", "2通目の本文です"]);
  });

  it("1通だけの文章はそのまま1件として扱う", () => {
    expect(extractInquiries("お世話になります。\n料金を教えてください。")).toEqual(["お世話になります。\n料金を教えてください。"]);
  });
});

describe("toCsv", () => {
  it("BOM付きで、必要なセルだけクォートする", () => {
    expect(toCsv([["分類", "本文"], ["質問", 'a,"b"']])).toBe('﻿分類,本文\r\n質問,"a,""b"""\r\n');
  });
});
