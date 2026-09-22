import { NextResponse } from "next/server";
import { db, isDbConfigured } from "@/db";
import { messages } from "@/db/schema";
import { str } from "@/lib/api";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const name = str(body.name).trim();
  const message = str(body.message).trim();
  if (!name || !message) {
    return NextResponse.json({ error: "Name and message are required" }, { status: 400 });
  }
  if (!isDbConfigured || !db) {
    console.log("[contact-simple-mode]", { name, email: str(body.email), subject: str(body.subject), message });
    return NextResponse.json({ ok: true, mode: "simple" });
  }
  await db.insert(messages).values({
    name: name.slice(0, 120),
    email: str(body.email).slice(0, 200),
    subject: str(body.subject).slice(0, 200),
    message: message.slice(0, 5000),
  });
  return NextResponse.json({ ok: true });
}
