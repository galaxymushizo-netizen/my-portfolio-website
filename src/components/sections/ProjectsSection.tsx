"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLang } from "@/components/LanguageProvider";
import { CoverArt, Reveal, StatusBadge, SectionHeading } from "@/components/primitives";
import { pick } from "@/lib/types";
import type { Project } from "@/lib/types";

function ProjectCard({
  project,
  featured = false,
}: {
  project: Project;
  featured?: boolean;
}) {
  const { t, lang } = useLang();
  const [hover, setHover] = useState(false);

  return (
    <Reveal className={featured ? "lg:col-span-2" : ""}>
      <Link
        href={`/projects/${project.slug}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="hover-lift group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.012]"
      >
        <div
          className={`relative w-full overflow-hidden ${
            featured ? "aspect-[16/9]" : "aspect-[4/3]"
          }`}
        >
          <div
            className="h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: hover ? "scale(1.05)" : "scale(1)" }}
          >
            {project.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.imageUrl}
                alt={project.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <CoverArt seed={project.slug} label={project.name} />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/10 to-transparent" />
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <StatusBadge status={project.status} />
            {project.featured ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-signal-400/40 bg-ink-950/60 px-2.5 py-1 font-display text-[0.62rem] uppercase tracking-[0.16em] text-signal-300">
                ✦ {t("projects.featured")}
              </span>
            ) : null}
          </div>
          <div className="absolute right-4 top-4 font-display text-xs text-mist-400">
            {project.projectDate}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <h3 className="display text-xl text-mist-50 transition-colors group-hover:text-signal-300 sm:text-2xl">
              {project.name}
            </h3>
            <span
              className="shrink-0 font-display text-lg text-mist-500 transition-all duration-500 group-hover:translate-x-0.5 group-hover:text-signal-400"
              aria-hidden
            >
              ↗
            </span>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-mist-400">
            {pick(project.shortDescription, lang)}
          </p>

          {project.technologies.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {project.technologies.slice(0, featured ? 8 : 4).map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-white/[0.07] px-2.5 py-1 font-display text-[0.65rem] uppercase tracking-[0.1em] text-mist-400"
                >
                  {tech}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-6 flex flex-1 items-end gap-4">
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="font-display text-xs uppercase tracking-[0.14em] text-mist-400 underline-offset-4 transition-colors hover:text-mist-50 hover:underline"
              >
                {t("projects.code")} ↗
              </a>
            ) : null}
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="font-display text-xs uppercase tracking-[0.14em] text-signal-300 underline-offset-4 transition-colors hover:underline"
              >
                {t("projects.demo")} ↗
              </a>
            ) : null}
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

export function ProjectsSection({
  projects,
  symbols,
}: {
  projects: Project[];
  symbols: string;
}) {
  const { t, lang } = useLang();
  const [filter, setFilter] = useState("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => set.add(p.category));
    return ["all", ...Array.from(set)];
  }, [projects]);

  const ordered = useMemo(() => {
    const sorted = [...projects].sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return a.position - b.position;
    });
    return filter === "all" ? sorted : sorted.filter((p) => p.category === filter);
  }, [projects, filter]);

  const featured = filter === "all" ? ordered.filter((p) => p.featured) : [];
  const rest = filter === "all" ? ordered.filter((p) => !p.featured) : ordered;

  return (
    <section id="projects" className="relative scroll-mt-20 border-t border-white/[0.06] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={t("projects.eyebrow")}
          title={t("projects.title")}
          subtitle={t("projects.subtitle")}
        />

        <Reveal delay={120}>
          <div className="no-scrollbar mt-10 flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => {
              const label = cat === "all" ? t("projects.all") : t(`category.${cat}`);
              const isActive = filter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  className={`shrink-0 rounded-full border px-4 py-2 font-display text-[0.7rem] uppercase tracking-[0.14em] transition-all duration-400 ${
                    isActive
                      ? "border-signal-400/50 bg-signal-400/10 text-signal-300"
                      : "border-white/[0.08] text-mist-400 hover:border-white/20 hover:text-mist-100"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </Reveal>

        {ordered.length === 0 ? (
          <p className="mt-16 text-center text-sm text-mist-500">{t("projects.empty")}</p>
        ) : (
          <>
            {featured.length > 0 ? (
              <div className="mt-10 grid gap-6 lg:grid-cols-2">
                {featured.map((project) => (
                  <ProjectCard key={project.id} project={project} featured />
                ))}
              </div>
            ) : null}
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
