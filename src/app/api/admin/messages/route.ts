import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { guard } from "@/lib/api";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  if (!(await guard())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await db.select().from(messages).orderBy(desc(messages.createdAt)).limit(200);
  return NextResponse.json({
    items: items.map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      subject: m.subject,
      message: m.message,
      read: m.read,
      createdAt: m.createdAt.toISOString(),
    })),
  });
}
