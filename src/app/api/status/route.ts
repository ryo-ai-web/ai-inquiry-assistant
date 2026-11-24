import { connection } from "next/server";
import { getModel, isAiConfigured } from "@/lib/ai";
import type { StatusResponse } from "@/lib/schema";

/** AIモードが使えるかどうかだけを返す（キーの値などは返さない） */
export async function GET() {
  await connection();
  const aiAvailable = isAiConfigured();
  const body: StatusResponse = {
    aiAvailable,
    model: aiAvailable ? getModel() : null,
  };
  return Response.json(body, { headers: { "Cache-Control": "no-store" } });
}
