import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db, isDbConfigured } from "@/db";
import { messages } from "@/db/schema";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Public guestbook: latest comments for display below the contact form.
// In simple mode (no DATABASE_URL) there is no shared storage, so it returns [].
export async function GET() {
  if (!isDbConfigured || !db) {
    return NextResponse.json({ comments: [], mode: "simple" });
  }
  try {
    const rows = await db
      .select({
        id: messages.id,
        name: messages.name,
        subject: messages.subject,
        message: messages.message,
        createdAt: messages.createdAt,
      })
      .from(messages)
      .orderBy(desc(messages.id))
      .limit(50);
    return NextResponse.json({
      comments: rows.map((r) => ({
        id: r.id,
        name: r.name,
        subject: r.subject,
        message: r.message,
        createdAt: r.createdAt ? r.createdAt.toISOString() : null,
      })),
    });
  } catch {
    return NextResponse.json({ comments: [], mode: "simple" });
  }
}
