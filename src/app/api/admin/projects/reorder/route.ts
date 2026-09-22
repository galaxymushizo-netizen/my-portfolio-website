import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { guard, int, revalidatePublic } from "@/lib/api";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => ({}))) as { ids?: unknown };
  const ids = Array.isArray(body.ids) ? body.ids.map((v) => int(v, 0)).filter(Boolean) : [];
  await Promise.all(
    ids.map((id, index) => db.update(projects).set({ position: index }).where(eq(projects.id, id))),
  );
  revalidatePublic();
  return NextResponse.json({ ok: true });
}
