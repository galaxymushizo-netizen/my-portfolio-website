import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profile } from "@/db/schema";
import { guard, nullableStr, revalidatePublic, str, toBilingual } from "@/lib/api";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function PUT(request: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const [row] = await db.select().from(profile).limit(1);
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db
    .update(profile)
    .set({
      name: str(body.name, row.name),
      tagline: toBilingual(body.tagline, row.tagline),
      shortBio: toBilingual(body.shortBio, row.shortBio),
      bio: toBilingual(body.bio, row.bio),
      photoUrl: nullableStr(body.photoUrl),
      learning: toBilingual(body.learning, row.learning),
      building: toBilingual(body.building, row.building),
      goals: toBilingual(body.goals, row.goals),
      location: toBilingual(body.location, row.location),
      email: str(body.email, row.email),
      whatsapp: str(body.whatsapp, row.whatsapp),
      resumeUrl: nullableStr(body.resumeUrl),
      updatedAt: new Date(),
    })
    .where(eq(profile.id, row.id));

  revalidatePublic();
  return NextResponse.json({ ok: true });
}
