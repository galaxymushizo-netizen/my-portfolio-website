export type Bilingual = { en: string; sw: string };
export type Lang = "en" | "sw";

export const LANGS: Lang[] = ["en", "sw"];

export function pick(value: Bilingual | null | undefined, lang: Lang): string {
  if (!value) return "";
  if (lang === "sw") return value.sw?.trim() ? value.sw : value.en;
  return value.en?.trim() ? value.en : value.sw ?? "";
}

export function bi(en: string, sw = ""): Bilingual {
  return { en, sw: sw || en };
}

export type SiteSettings = {
  id: number;
  siteTitle: string;
  siteDescription: Bilingual;
  heroKicker: Bilingual;
  heroTitle: Bilingual;
  heroSubtitle: Bilingual;
  landingQuestion: Bilingual;
  landingHint: Bilingual;
  pathWork: Bilingual;
  pathWorkHint: Bilingual;
  pathMe: Bilingual;
  pathMeHint: Bilingual;
  pathConnect: Bilingual;
  pathConnectHint: Bilingual;
  symbols: string;
  philosophy: Bilingual;
  metaImage: string | null;
};

export type Profile = {
  id: number;
  name: string;
  tagline: Bilingual;
  shortBio: Bilingual;
  bio: Bilingual;
  photoUrl: string | null;
  learning: Bilingual;
  building: Bilingual;
  goals: Bilingual;
  email: string;
  whatsapp: string;
  location: Bilingual;
  resumeUrl: string | null;
};

export type Project = {
  id: number;
  slug: string;
  name: string;
  shortDescription: Bilingual;
  fullDescription: Bilingual;
  imageUrl: string | null;
  gallery: string[];
  technologies: string[];
  status: string;
  githubUrl: string | null;
  liveUrl: string | null;
  projectDate: string | null;
  featured: boolean;
  category: string;
  position: number;
};

export type Thought = {
  id: number;
  slug: string;
  title: Bilingual;
  excerpt: Bilingual;
  content: Bilingual;
  coverImage: string | null;
  category: string;
  published: boolean;
  publishedAt: string | null;
  position: number;
};

export type TimelineItem = {
  id: number;
  year: string;
  title: Bilingual;
  body: Bilingual;
  position: number;
};

export type Skill = {
  id: number;
  name: string;
  category: string;
  level: number;
  position: number;
};

export type LinkItem = {
  id: number;
  label: string;
  url: string;
  kind: string;
  position: number;
};

export type SiteData = {
  settings: SiteSettings;
  profile: Profile;
  projects: Project[];
  thoughts: Thought[];
  timeline: TimelineItem[];
  skills: Skill[];
  links: LinkItem[];
};

export const PROJECT_STATUSES = [
  "idea",
  "in-progress",
  "live",
  "paused",
  "archived",
] as const;

export const THOUGHT_CATEGORIES = [
  "technology",
  "philosophy",
  "psychology",
  "learning",
  "growth",
  "building",
  "failure",
  "life",
] as const;
