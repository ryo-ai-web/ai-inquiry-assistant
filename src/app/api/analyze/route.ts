import { handleAnalyze, type AnalyzeRequestBody } from "@/lib/analyze-handler";

export const maxDuration = 60;

const MAX_BODY_BYTES = 20_000;

export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return Response.json(
      { ok: false, error: { code: "TOO_LONG", message: "入力が長すぎます。" } },
      { status: 413 },
    );
  }

  let body: AnalyzeRequestBody;
  try {
    body = JSON.parse(raw) as AnalyzeRequestBody;
  } catch {
    return Response.json(
      { ok: false, error: { code: "BAD_REQUEST", message: "リクエストの形式が正しくありません。" } },
      { status: 400 },
    );
  }
  if (!body || typeof body !== "object") {
    return Response.json(
      { ok: false, error: { code: "BAD_REQUEST", message: "リクエストの形式が正しくありません。" } },
      { status: 400 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";

  const { status, body: res } = await handleAnalyze(body, ip);
  return Response.json(res, { status, headers: { "Cache-Control": "no-store" } });
}
