import { and, desc, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { links, projects, skills, thoughts, timeline } from "@/db/schema";
import { bool, int, nullableStr, slugify, str, toBilingual, toStringList } from "@/lib/api";

type Values = Record<string, unknown>;
type Body = Record<string, unknown>;

async function nextPosition(
  table: typeof projects | typeof thoughts | typeof timeline | typeof skills | typeof links,
): Promise<number> {
  const rows = await db.select({ position: table.position }).from(table).orderBy(desc(table.position)).limit(1);
  return (rows[0]?.position ?? -1) + 1;
}

async function ensureSlug(
  table: typeof projects | typeof thoughts,
  desired: string,
  id: number | null,
): Promise<string> {
  const base = slugify(desired) || `item-${Date.now().toString(36)}`;
  let candidate = base;
  let counter = 2;
  // eslint-disable-next-line no-await-in-loop
  for (;;) {
    const condition = id
      ? and(eq(table.slug, candidate), ne(table.id, id))
      : eq(table.slug, candidate);
    const rows = await db.select({ id: table.id }).from(table).where(condition).limit(1);
    if (!rows.length) return candidate;
    candidate = `${base}-${counter}`;
    counter += 1;
  }
}

export async function buildProjectsValues(body: Body, id: number | null): Promise<Values> {
  const name = str(body.name, "Untitled project");
  const slugInput = str(body.slug) || name;
  return {
    slug: await ensureSlug(projects, slugInput, id),
    name,
    shortDescription: toBilingual(body.shortDescription),
    fullDescription: toBilingual(body.fullDescription),
    imageUrl: nullableStr(body.imageUrl),
    gallery: toStringList(body.gallery),
    technologies: toStringList(body.technologies),
    status: str(body.status, "in-progress"),
    githubUrl: nullableStr(body.githubUrl),
    liveUrl: nullableStr(body.liveUrl),
    projectDate: nullableStr(body.projectDate),
    featured: bool(body.featured, false),
    category: str(body.category, "web"),
    position: body.position === undefined || body.position === null ? await nextPosition(projects) : int(body.position, 0),
    updatedAt: new Date(),
  };
}

export async function buildThoughtsValues(body: Body, id: number | null): Promise<Values> {
  const title = toBilingual(body.title);
  const slugInput = str(body.slug) || title.en || title.sw || "thought";
  const published = bool(body.published, false);
  const values: Values = {
    slug: await ensureSlug(thoughts, slugInput, id),
    title,
    excerpt: toBilingual(body.excerpt),
    content: toBilingual(body.content),
    coverImage: nullableStr(body.coverImage),
    category: str(body.category, "life"),
    published,
    position:
      body.position === undefined || body.position === null ? await nextPosition(thoughts) : int(body.position, 0),
    updatedAt: new Date(),
  };

  if (published) {
    if (id) {
      const [row] = await db.select({ publishedAt: thoughts.publishedAt }).from(thoughts).where(eq(thoughts.id, id)).limit(1);
      if (row && !row.publishedAt) values.publishedAt = new Date();
    } else {
      values.publishedAt = new Date();
    }
  } else {
    values.publishedAt = null;
  }

  return values;
}

export async function buildTimelineValues(body: Body, id: number | null): Promise<Values> {
  return {
    year: str(body.year, "—"),
    title: toBilingual(body.title),
    body: toBilingual(body.body),
    position:
      body.position === undefined || body.position === null ? await nextPosition(timeline) : int(body.position, 0),
  };
}

export async function buildSkillsValues(body: Body, id: number | null): Promise<Values> {
  return {
    name: str(body.name, "Skill"),
    category: str(body.category, "craft"),
    level: Math.min(100, Math.max(0, int(body.level, 50))),
    position:
      body.position === undefined || body.position === null ? await nextPosition(skills) : int(body.position, 0),
  };
}

export async function buildLinksValues(body: Body, id: number | null): Promise<Values> {
  return {
    label: str(body.label, "Link"),
    url: str(body.url, "#"),
    kind: str(body.kind, "social"),
    position:
      body.position === undefined || body.position === null ? await nextPosition(links) : int(body.position, 0),
  };
}
