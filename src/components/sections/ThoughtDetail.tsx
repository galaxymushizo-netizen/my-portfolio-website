"use client";

import Link from "next/link";
import { useLang } from "@/components/LanguageProvider";
import { CoverArt, Reveal } from "@/components/primitives";
import { pick } from "@/lib/types";
import type { Thought } from "@/lib/types";

function formatDate(iso: string | null, lang: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(lang === "sw" ? "sw-TZ" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ThoughtDetail({
  thought,
  name,
  symbols,
}: {
  thought: Thought;
  name: string;
  symbols: string;
}) {
  const { t, lang } = useLang();
  const paragraphs = pick(thought.content, lang)
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <article className="mx-auto max-w-3xl px-5 sm:px-8">
      <Reveal>
        <Link
          href="/#thoughts"
          className="inline-flex items-center gap-2 font-display text-xs uppercase tracking-[0.18em] text-mist-500 transition-colors hover:text-signal-300"
        >
          ← {t("thoughts.back")}
        </Link>
      </Reveal>

      <Reveal delay={80}>
        <div className="mt-8 flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.18em] text-mist-500">
          <span className="text-signal-300">{t(`cat.${thought.category}`)}</span>
          <span className="h-1 w-1 rounded-full bg-mist-500" />
          <span>{formatDate(thought.publishedAt, lang)}</span>
        </div>
        <h1 className="display mt-5 text-balance text-3xl leading-[1.08] text-mist-50 sm:text-4xl md:text-5xl">
          {pick(thought.title, lang)}
        </h1>
      </Reveal>

      {thought.coverImage ? (
        <Reveal delay={140}>
          <div className="mt-10 overflow-hidden rounded-3xl border border-white/[0.08]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thought.coverImage}
              alt={pick(thought.title, lang)}
              className="aspect-[16/9] w-full object-cover"
            />
          </div>
        </Reveal>
      ) : (
        <Reveal delay={140}>
          <div className="mt-10 overflow-hidden rounded-3xl border border-white/[0.08]">
            <div className="aspect-[16/9] w-full">
              <CoverArt seed={thought.slug} label={pick(thought.title, lang)} glyphs={symbols} />
            </div>
          </div>
        </Reveal>
      )}

      <div className="mt-12 space-y-6">
        {paragraphs.map((paragraph, i) => (
          <Reveal key={i} delay={i * 60}>
            <p
              className={`leading-[1.75] text-mist-300 ${
                i === 0 ? "text-lg sm:text-xl" : "text-[1rem] sm:text-[1.05rem]"
              }`}
            >
              {paragraph}
            </p>
          </Reveal>
        ))}
      </div>

      <Reveal delay={140}>
        <div className="mt-16 mb-24 flex items-center gap-4 border-t border-white/[0.07] pt-8">
          <span className="glyph text-lg">⊹</span>
          <p className="text-sm text-mist-400">
            {t("thoughts.by")} {name}
          </p>
        </div>
      </Reveal>
    </article>
  );
}
