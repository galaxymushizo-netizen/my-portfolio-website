import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword, requireAdmin, verifyPassword } from "@/lib/auth";
import { str } from "@/lib/api";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await requireAdmin();
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const current = str(body.currentPassword);
  const next = str(body.newPassword);
  const email = str(body.email);
  const username = str(body.username);
  if (next && next.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const [row] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (next) {
    if (!(await verifyPassword(current, row.passwordHash))) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }
    await db
      .update(users)
      .set({ passwordHash: await hashPassword(next) })
      .where(eq(users.id, user.id));
  }

  if (email.trim() || username.trim()) {
    await db
      .update(users)
      .set({
        email: email.trim() ? email.trim() : row.email,
        username: username.trim() ? username.trim() : row.username,
      })
      .where(eq(users.id, user.id));
  }

  return NextResponse.json({ ok: true });
}
