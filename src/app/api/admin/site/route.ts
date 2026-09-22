import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { guard, nullableStr, revalidatePublic, str, toBilingual } from "@/lib/api";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function PUT(request: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const [row] = await db.select().from(siteSettings).limit(1);
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db
    .update(siteSettings)
    .set({
      siteTitle: str(body.siteTitle, row.siteTitle),
      siteDescription: toBilingual(body.siteDescription, row.siteDescription),
      heroKicker: toBilingual(body.heroKicker, row.heroKicker),
      heroTitle: toBilingual(body.heroTitle, row.heroTitle),
      heroSubtitle: toBilingual(body.heroSubtitle, row.heroSubtitle),
      landingQuestion: toBilingual(body.landingQuestion, row.landingQuestion),
      landingHint: toBilingual(body.landingHint, row.landingHint),
      pathWork: toBilingual(body.pathWork, row.pathWork),
      pathWorkHint: toBilingual(body.pathWorkHint, row.pathWorkHint),
      pathMe: toBilingual(body.pathMe, row.pathMe),
      pathMeHint: toBilingual(body.pathMeHint, row.pathMeHint),
      pathConnect: toBilingual(body.pathConnect, row.pathConnect),
      pathConnectHint: toBilingual(body.pathConnectHint, row.pathConnectHint),
      philosophy: toBilingual(body.philosophy, row.philosophy),
      symbols: str(body.symbols, row.symbols),
      metaImage: nullableStr(body.metaImage),
      updatedAt: new Date(),
    })
    .where(eq(siteSettings.id, row.id));

  revalidatePublic();
  return NextResponse.json({ ok: true });
}
