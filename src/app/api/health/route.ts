import { db, isDbConfigured } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isDbConfigured || !db) {
    return Response.json({ ok: true, mode: "simple", db: false });
  }
  try {
    await db.execute(sql`select 1`);
    return Response.json({ ok: true, db: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
