/**
 * 簡易レート制限（メモリ内）。
 * サーバーレス環境ではインスタンスごとに独立するため「目安」の制限です。
 * 本番で厳密に制限する場合は Upstash Redis などの外部ストアを使ってください。
 */
const WINDOW_MS = 60 * 60 * 1000; // 1時間

const hits = new Map<string, number[]>();

export function getRateLimit(): number {
  const n = Number(process.env.AI_RATE_LIMIT_PER_HOUR);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 20;
}

export function checkRateLimit(key: string, now = Date.now(), limit = getRateLimit()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  // メモリが増え続けないよう、古いキーを時々掃除する
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return true;
}

export function resetRateLimit() {
  hits.clear();
}
