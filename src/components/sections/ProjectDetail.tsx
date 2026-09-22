"use client";

import Link from "next/link";
import { useLang } from "@/components/LanguageProvider";
import { CoverArt, Reveal, StatusBadge } from "@/components/primitives";
import { pick } from "@/lib/types";
import type { Project } from "@/lib/types";

export function ProjectDetail({
  project,
  related,
  symbols,
}: {
  project: Project;
  related: Project[];
  symbols: string;
}) {
  const { t, lang } = useLang();
  const paragraphs = pick(project.fullDescription, lang)
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      <article className="mx-auto max-w-4xl px-5 sm:px-8">
        <Reveal>
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 font-display text-xs uppercase tracking-[0.18em] text-mist-500 transition-colors hover:text-signal-300"
          >
            ← {t("projects.back")}
          </Link>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <StatusBadge status={project.status} />
            <span className="rounded-full border border-white/[0.08] px-2.5 py-1 font-display text-[0.62rem] uppercase tracking-[0.16em] text-mist-400">
              {t(`category.${project.category}`)}
            </span>
            {project.projectDate ? (
              <span className="font-display text-xs text-mist-500">{project.projectDate}</span>
            ) : null}
          </div>
          <h1 className="display mt-6 text-balance text-4xl leading-[1.02] text-mist-50 sm:text-5xl md:text-6xl">
            {project.name}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-mist-400 sm:text-lg">
            {pick(project.shortDescription, lang)}
          </p>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-10 overflow-hidden rounded-3xl border border-white/[0.08]">
            <div className="aspect-[16/9] w-full">
              {project.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={project.imageUrl} alt={project.name} className="h-full w-full object-cover" />
              ) : (
                <CoverArt seed={project.slug} label={project.name} glyphs={symbols} />
              )}
            </div>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="space-y-5">
            {paragraphs.map((paragraph, i) => (
              <Reveal key={i} delay={i * 60}>
                <p className="text-[0.98rem] leading-relaxed text-mist-300 sm:text-[1.05rem]">
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120} className="lg:sticky lg:top-28 lg:self-start">
            <div className="card-surface rounded-2xl p-6">
              {project.technologies.length > 0 ? (
                <div className="mb-6">
                  <p className="eyebrow">{t("projects.stack")}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-white/[0.08] px-2.5 py-1 font-display text-[0.65rem] uppercase tracking-[0.1em] text-mist-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="space-y-2">
                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-xl border border-white/[0.08] px-4 py-3 font-display text-xs uppercase tracking-[0.14em] text-mist-200 transition-colors hover:border-signal-400/40 hover:text-signal-300"
                  >
                    {t("projects.code")} <span>↗</span>
                  </a>
                ) : null}
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-xl border border-signal-400/30 bg-signal-400/5 px-4 py-3 font-display text-xs uppercase tracking-[0.14em] text-signal-300 transition-colors hover:bg-signal-400/10"
                  >
                    {t("projects.demo")} <span>↗</span>
                  </a>
                ) : null}
              </div>
            </div>
          </Reveal>
        </div>

        {project.gallery.length > 0 ? (
          <div className="mt-20">
            <Reveal>
              <div className="flex items-center gap-4">
                <h2 className="display text-xl text-mist-50">{t("projects.gallery")}</h2>
                <span className="h-px flex-1 bg-white/[0.08]" />
                <span className="glyph text-sm">◉</span>
              </div>
            </Reveal>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {project.gallery.map((src, i) => (
                <Reveal key={i} delay={i * 70}>
                  <div className="overflow-hidden rounded-2xl border border-white/[0.07]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="aspect-[4/3] w-full object-cover" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        ) : null}

        {related.length > 0 ? (
          <div className="mt-24 mb-24">
            <Reveal>
              <div className="flex items-center gap-4">
                <h2 className="display text-xl text-mist-50">{t("projects.related")}</h2>
                <span className="h-px flex-1 bg-white/[0.08]" />
              </div>
            </Reveal>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {related.map((item, i) => (
                <Reveal key={item.id} delay={i * 70}>
                  <Link
                    href={`/projects/${item.slug}`}
                    className="hover-lift group block overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.012]"
                  >
                    <div className="aspect-[16/10] w-full overflow-hidden">
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <CoverArt seed={item.slug} label={item.name} glyphs={symbols} />
                      )}
                    </div>
                    <div className="p-4">
                      <p className="display text-base text-mist-50 group-hover:text-signal-300">
                        {item.name}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs text-mist-500">
                        {pick(item.shortDescription, lang)}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-24" />
        )}
      </article>
    </>
  );
}
