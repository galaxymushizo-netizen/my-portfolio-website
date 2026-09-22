"use client";

import Link from "next/link";
import { useLang } from "@/components/LanguageProvider";
import { CoverArt, Reveal, SectionHeading } from "@/components/primitives";
import { pick } from "@/lib/types";
import type { Thought } from "@/lib/types";

function readingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function formatDate(iso: string | null, lang: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(lang === "sw" ? "sw-TZ" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ThoughtsSection({
  thoughts,
  symbols,
}: {
  thoughts: Thought[];
  symbols: string;
}) {
  const { t, lang } = useLang();
  const published = thoughts.filter((thought) => thought.published);

  return (
    <section id="thoughts" className="relative scroll-mt-20 border-t border-white/[0.06] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={t("thoughts.eyebrow")}
          title={t("thoughts.title")}
          subtitle={t("thoughts.subtitle")}
        />

        {published.length === 0 ? (
          <Reveal delay={120}>
            <div className="card-surface mt-14 rounded-2xl px-6 py-16 text-center">
              <span className="glyph text-2xl">⊹</span>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-mist-400">
                {t("thoughts.empty")}
              </p>
            </div>
          </Reveal>
        ) : (
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {published.map((thought, index) => (
              <Reveal key={thought.id} delay={index * 90}>
                <Link
                  href={`/thoughts/${thought.slug}`}
                  className="hover-lift group flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.012]"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    {thought.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thought.coverImage}
                        alt={pick(thought.title, lang)}
                        className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
                      />
                    ) : (
                      <CoverArt seed={thought.slug} label={pick(thought.title, lang)} glyphs={symbols} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 to-transparent" />
                    <span className="absolute bottom-4 left-5 rounded-full border border-white/10 bg-ink-950/60 px-2.5 py-1 font-display text-[0.62rem] uppercase tracking-[0.16em] text-mist-200">
                      {t(`cat.${thought.category}`)}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.16em] text-mist-500">
                      <span>{formatDate(thought.publishedAt, lang)}</span>
                      <span className="h-1 w-1 rounded-full bg-mist-500" />
                      <span>
                        {readingTime(pick(thought.content, lang))} {t("thoughts.min")}
                      </span>
                    </div>
                    <h3 className="display mt-4 text-xl leading-snug text-mist-50 transition-colors group-hover:text-signal-300 sm:text-2xl">
                      {pick(thought.title, lang)}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-mist-400">
                      {pick(thought.excerpt, lang)}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 font-display text-xs uppercase tracking-[0.16em] text-mist-300 transition-all duration-500 group-hover:gap-3 group-hover:text-signal-300">
                      {t("thoughts.read")} <span>→</span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
