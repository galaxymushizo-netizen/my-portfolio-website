import { NextResponse } from "next/server";
import { eq, or } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, verifyPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const attempts = new Map<string, { count: number; until: number }>();

function tooMany(key: string): boolean {
  const entry = attempts.get(key);
  if (!entry) return false;
  if (Date.now() > entry.until) {
    attempts.delete(key);
    return false;
  }
  return entry.count >= 8;
}

function registerFailure(key: string) {
  const entry = attempts.get(key);
  if (!entry) {
    attempts.set(key, { count: 1, until: Date.now() + 10 * 60 * 1000 });
    return;
  }
  entry.count += 1;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    identifier?: string;
    password?: string;
  };
  const identifier = (body.identifier ?? "").trim();
  const password = body.password ?? "";

  if (!identifier || !password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }

  const key = `${identifier}:${request.headers.get("x-forwarded-for") ?? "local"}`;
  if (tooMany(key)) {
    return NextResponse.json({ error: "Too many attempts. Try later." }, { status: 429 });
  }

  const [user] = await db
    .select()
    .from(users)
    .where(or(eq(users.email, identifier), eq(users.username, identifier)))
    .limit(1);

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    registerFailure(key);
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  attempts.delete(key);
  await createSession(user.id);
  return NextResponse.json({ ok: true, username: user.username });
}
