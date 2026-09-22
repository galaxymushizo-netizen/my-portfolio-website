import { randomBytes, scrypt as nodeScrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { and, eq, gt } from "drizzle-orm";
import { db, isDbConfigured } from "@/db";
import { sessions, users } from "@/db/schema";

const scrypt = promisify(nodeScrypt) as (
  password: string,
  salt: string,
  keylen: number,
) => Promise<Buffer>;

export const SESSION_COOKIE = "galaxy_session";
const SESSION_DAYS = 30;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = await scrypt(password, salt, 64);
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const derived = await scrypt(password, salt, 64);
  const keyBuf = Buffer.from(key, "hex");
  if (keyBuf.length !== derived.length) return false;
  return timingSafeEqual(keyBuf, derived);
}

export async function createSession(userId: number): Promise<void> {
  if (!isDbConfigured || !db) return;
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await db.insert(sessions).values({ token, userId, expiresAt });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token && db) {
    await db.delete(sessions).where(eq(sessions.token, token));
  }
  store.delete(SESSION_COOKIE);
}

export type AdminUser = { id: number; email: string; username: string };

export async function getCurrentUser(): Promise<AdminUser | null> {
  if (!isDbConfigured || !db) return null;
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const rows = await db
    .select({ id: users.id, email: users.email, username: users.username })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.token, token), gt(sessions.expiresAt, new Date())))
    .limit(1);
  return rows[0] ?? null;
}

export async function assertAdmin(): Promise<AdminUser | null> {
  return getCurrentUser();
}

export async function requireAdmin(): Promise<AdminUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}
