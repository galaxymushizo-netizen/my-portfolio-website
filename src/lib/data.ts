import { asc, desc, eq } from "drizzle-orm";
import { cache } from "react";
import { db, isDbConfigured } from "@/db";
import { links, profile, projects, siteSettings, skills, thoughts, timeline } from "@/db/schema";
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
  DEFAULT_LINKS,
  DEFAULT_PROFILE,
  DEFAULT_PROJECTS,
  DEFAULT_SETTINGS,
  DEFAULT_SKILLS,
  DEFAULT_THOUGHTS,
  DEFAULT_TIMELINE,
} from "@/lib/defaults";
import { hashPassword } from "@/lib/auth";
import type {
  LinkItem,
  Profile,
  Project,
  SiteData,
  SiteSettings,
  Skill,
  Thought,
  TimelineItem,
} from "@/lib/types";
import { users } from "@/db/schema";

let seedChain: Promise<void> = Promise.resolve();
let seeded = false;

function getDefaultSiteData(): SiteData {
  const settings: SiteSettings = {
    id: 0,
    ...DEFAULT_SETTINGS,
  };
  const profileData: Profile = {
    id: 0,
    ...DEFAULT_PROFILE,
  };
  return {
    settings,
    profile: profileData,
    projects: DEFAULT_PROJECTS.map((p, index) => ({
      id: index + 1,
      slug: p.slug,
      name: p.name,
      shortDescription: p.shortDescription,
      fullDescription: p.fullDescription,
      imageUrl: null,
      gallery: [],
      technologies: p.technologies,
      status: p.status,
      githubUrl: p.githubUrl,
      liveUrl: p.liveUrl,
      projectDate: p.projectDate,
      featured: p.featured,
      category: p.category,
      position: index,
    })),
    thoughts: DEFAULT_THOUGHTS.map((t, index) => ({
      id: index + 1,
      slug: t.slug,
      title: t.title,
      excerpt: t.excerpt,
      content: t.content,
      coverImage: t.coverImage,
      category: t.category,
      published: t.published,
      publishedAt: t.published ? new Date().toISOString() : null,
      position: index,
    })),
    timeline: DEFAULT_TIMELINE.map((t, index) => ({
      id: index + 1,
      year: t.year,
      title: t.title,
      body: t.body,
      position: index,
    })),
    skills: DEFAULT_SKILLS.map((s, index) => ({
      id: index + 1,
      name: s.name,
      category: s.category,
      level: s.level,
      position: index,
    })),
    links: DEFAULT_LINKS.map((l, index) => ({
      id: index + 1,
      label: l.label,
      url: l.url,
      kind: l.kind,
      position: index,
    })),
  };
}

async function seedAll(): Promise<void> {
  if (!db) return;
  const [existing] = await db.select({ id: siteSettings.id }).from(siteSettings).limit(1);
      if (!existing) {
        await db.insert(siteSettings).values({
          ...DEFAULT_SETTINGS,
          siteDescription: DEFAULT_SETTINGS.siteDescription,
        });
      }

      const [existingProfile] = await db.select({ id: profile.id }).from(profile).limit(1);
      if (!existingProfile) {
        await db.insert(profile).values(DEFAULT_PROFILE);
      }

      const existingUsers = await db.select({ id: users.id }).from(users).limit(1);
      if (!existingUsers.length) {
        await db
          .insert(users)
          .values({
            email: ADMIN_EMAIL,
            username: ADMIN_USERNAME,
            passwordHash: await hashPassword(ADMIN_PASSWORD),
          })
          .onConflictDoNothing();
      }

      const existingProjects = await db.select({ id: projects.id }).from(projects).limit(1);
      if (!existingProjects.length) {
        await db.insert(projects).values(
          DEFAULT_PROJECTS.map((p, index) => ({ ...p, position: index, gallery: [], imageUrl: null })),
        );
      }

      const existingTimeline = await db.select({ id: timeline.id }).from(timeline).limit(1);
      if (!existingTimeline.length) {
        await db.insert(timeline).values(DEFAULT_TIMELINE.map((t, index) => ({ ...t, position: index })));
      }

      const existingSkills = await db.select({ id: skills.id }).from(skills).limit(1);
      if (!existingSkills.length) {
        await db.insert(skills).values(DEFAULT_SKILLS.map((s, index) => ({ ...s, position: index })));
      }

      const existingLinks = await db.select({ id: links.id }).from(links).limit(1);
      if (!existingLinks.length) {
        await db.insert(links).values(DEFAULT_LINKS.map((l, index) => ({ ...l, position: index })));
      }

      const existingThoughts = await db.select({ id: thoughts.id }).from(thoughts).limit(1);
      if (!existingThoughts.length) {
        await db.insert(thoughts).values(
          DEFAULT_THOUGHTS.map((t, index) => ({
            ...t,
            position: index,
            publishedAt: t.published ? new Date() : null,
          })),
        );
  }
}

function runSeed(): Promise<void> {
  if (!isDbConfigured || !db) return Promise.resolve();
  const run = seedChain.then(seedAll, seedAll);
  seedChain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

export async function ensureSeeded(): Promise<void> {
  if (seeded) return;
  if (!isDbConfigured || !db) {
    seeded = true;
    return;
  }
  await runSeed();
  seeded = true;
}

async function reseed(): Promise<void> {
  await runSeed();
  seeded = true;
}

function mapProject(row: typeof projects.$inferSelect): Project {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortDescription: row.shortDescription,
    fullDescription: row.fullDescription,
    imageUrl: row.imageUrl,
    gallery: row.gallery ?? [],
    technologies: row.technologies ?? [],
    status: row.status,
    githubUrl: row.githubUrl,
    liveUrl: row.liveUrl,
    projectDate: row.projectDate,
    featured: row.featured,
    category: row.category,
    position: row.position,
  };
}

function mapThought(row: typeof thoughts.$inferSelect): Thought {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: row.coverImage,
    category: row.category,
    published: row.published,
    publishedAt: row.publishedAt ? row.publishedAt.toISOString() : null,
    position: row.position,
  };
}

async function loadSettings(): Promise<typeof siteSettings.$inferSelect> {
  if (!db) throw new Error("Database not configured");
  let [row] = await db.select().from(siteSettings).limit(1);
  if (!row) {
    await reseed();
    [row] = await db.select().from(siteSettings).limit(1);
  }
  if (!row) throw new Error("Failed to load site settings");
  return row;
}

async function loadProfile(): Promise<typeof profile.$inferSelect> {
  if (!db) throw new Error("Database not configured");
  let [row] = await db.select().from(profile).limit(1);
  if (!row) {
    await reseed();
    [row] = await db.select().from(profile).limit(1);
  }
  if (!row) throw new Error("Failed to load profile");
  return row;
}

export const getSiteData = cache(async (): Promise<SiteData> => {
  if (!isDbConfigured || !db) return getDefaultSiteData();
  try {
    await ensureSeeded();
    const settingsRow = await loadSettings();
    const profileRow = await loadProfile();
    const projectRows = await db.select().from(projects).orderBy(asc(projects.position), asc(projects.id));
    const thoughtRows = await db
      .select()
      .from(thoughts)
      .orderBy(desc(thoughts.publishedAt), desc(thoughts.id));
    const timelineRows = await db.select().from(timeline).orderBy(asc(timeline.position), asc(timeline.id));
    const skillRows = await db.select().from(skills).orderBy(asc(skills.position), asc(skills.id));
    const linkRows = await db.select().from(links).orderBy(asc(links.position), asc(links.id));

    const settings: SiteSettings = {
      id: settingsRow.id,
      siteTitle: settingsRow.siteTitle,
      siteDescription: settingsRow.siteDescription,
      heroKicker: settingsRow.heroKicker,
      heroTitle: settingsRow.heroTitle,
      heroSubtitle: settingsRow.heroSubtitle,
      landingQuestion: settingsRow.landingQuestion,
      landingHint: settingsRow.landingHint,
      pathWork: settingsRow.pathWork,
      pathWorkHint: settingsRow.pathWorkHint,
      pathMe: settingsRow.pathMe,
      pathMeHint: settingsRow.pathMeHint,
      pathConnect: settingsRow.pathConnect,
      pathConnectHint: settingsRow.pathConnectHint,
      philosophy: settingsRow.philosophy,
      symbols: settingsRow.symbols,
      metaImage: settingsRow.metaImage,
    };

    const profileData: Profile = {
      id: profileRow.id,
      name: profileRow.name,
      tagline: profileRow.tagline,
      shortBio: profileRow.shortBio,
      bio: profileRow.bio,
      photoUrl: profileRow.photoUrl,
      learning: profileRow.learning,
      building: profileRow.building,
      goals: profileRow.goals,
      location: profileRow.location,
      email: profileRow.email,
      whatsapp: profileRow.whatsapp,
      resumeUrl: profileRow.resumeUrl,
    };

    return {
      settings,
      profile: profileData,
      projects: projectRows.map(mapProject),
      thoughts: thoughtRows.map(mapThought),
      timeline: timelineRows.map<TimelineItem>((row) => ({
        id: row.id,
        year: row.year,
        title: row.title,
        body: row.body,
        position: row.position,
      })),
      skills: skillRows.map<Skill>((row) => ({
        id: row.id,
        name: row.name,
        category: row.category,
        level: row.level,
        position: row.position,
      })),
      links: linkRows.map<LinkItem>((row) => ({
        id: row.id,
        label: row.label,
        url: row.url,
        kind: row.kind,
        position: row.position,
      })),
    };
  } catch {
    return getDefaultSiteData();
  }
});

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!isDbConfigured || !db) {
    const data = getDefaultSiteData();
    return data.projects.find((p) => p.slug === slug) ?? null;
  }
  try {
    await ensureSeeded();
    const [row] = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
    return row ? mapProject(row) : null;
  } catch {
    const data = getDefaultSiteData();
    return data.projects.find((p) => p.slug === slug) ?? null;
  }
}

export async function getThoughtBySlug(slug: string): Promise<Thought | null> {
  if (!isDbConfigured || !db) {
    const data = getDefaultSiteData();
    return data.thoughts.find((t) => t.slug === slug) ?? null;
  }
  try {
    await ensureSeeded();
    const [row] = await db.select().from(thoughts).where(eq(thoughts.slug, slug)).limit(1);
    return row ? mapThought(row) : null;
  } catch {
    const data = getDefaultSiteData();
    return data.thoughts.find((t) => t.slug === slug) ?? null;
  }
}

export { getDefaultSiteData, isDbConfigured };
