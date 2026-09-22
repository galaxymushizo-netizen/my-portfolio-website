import { NextResponse } from "next/server";
import { db } from "@/db";
import { timeline } from "@/db/schema";
import { guard, revalidatePublic } from "@/lib/api";
import { buildTimelineValues } from "@/lib/admin-mutations";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const values = await buildTimelineValues(body, null);
  const [created] = await db.insert(timeline).values(values as never).returning();
  revalidatePublic();
  return NextResponse.json({ ok: true, item: created });
}
