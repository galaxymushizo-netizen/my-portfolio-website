import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { bool, guard, int } from "@/lib/api";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Ctx) {
  if (!(await guard())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = int((await params).id, 0);
  if (!id) return NextResponse.json({ error: "Bad id" }, { status: 400 });
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  await db.update(messages).set({ read: bool(body.read, false) }).where(eq(messages.id, id));
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: Ctx) {
  if (!(await guard())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = int((await params).id, 0);
  if (!id) return NextResponse.json({ error: "Bad id" }, { status: 400 });
  await db.delete(messages).where(eq(messages.id, id));
  return NextResponse.json({ ok: true });
}
