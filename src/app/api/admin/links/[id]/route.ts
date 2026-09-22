import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { links } from "@/db/schema";
import { guard, int, revalidatePublic } from "@/lib/api";
import { buildLinksValues } from "@/lib/admin-mutations";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Ctx) {
  if (!(await guard())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = int((await params).id, 0);
  if (!id) return NextResponse.json({ error: "Bad id" }, { status: 400 });
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const values = await buildLinksValues(body, id);
  await db.update(links).set(values as never).where(eq(links.id, id));
  revalidatePublic();
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: Ctx) {
  if (!(await guard())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = int((await params).id, 0);
  if (!id) return NextResponse.json({ error: "Bad id" }, { status: 400 });
  await db.delete(links).where(eq(links.id, id));
  revalidatePublic();
  return NextResponse.json({ ok: true });
}
