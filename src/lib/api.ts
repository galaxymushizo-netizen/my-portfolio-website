import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/auth";
import type { Bilingual } from "@/lib/types";

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function guard() {
  const user = await assertAdmin();
  if (!user) return null;
  return user;
}

export function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function nullableStr(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

export function int(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(n) ? n : fallback;
}

export function bool(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

export function toBilingual(value: unknown, fallback: Bilingual = { en: "", sw: "" }): Bilingual {
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return {
      en: typeof record.en === "string" ? record.en : fallback.en,
      sw: typeof record.sw === "string" ? record.sw : fallback.sw,
    };
  }
  if (typeof value === "string") return { en: value, sw: value };
  return fallback;
}

export function toStringList(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string");
  if (typeof value === "string") {
    return value
      .split(/[,\n]/)
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
}

export function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return base || `item-${Date.now().toString(36)}`;
}

export async function uniqueSlug(
  input: string,
  exists: (slug: string) => Promise<boolean>,
): Promise<string> {
  const base = slugify(input);
  let candidate = base;
  let counter = 2;
  // eslint-disable-next-line no-await-in-loop
  while (await exists(candidate)) {
    candidate = `${base}-${counter}`;
    counter += 1;
  }
  return candidate;
}

export function revalidatePublic() {
  revalidatePath("/", "layout");
  revalidatePath("/projects/[slug]", "page");
  revalidatePath("/thoughts/[slug]", "page");
}
