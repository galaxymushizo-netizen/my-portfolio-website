"use client";

import { useLang } from "@/components/LanguageProvider";
import { CoverArt, Reveal, SlowGlyph } from "@/components/primitives";
import { pick } from "@/lib/types";
import type { Profile, Skill, TimelineItem } from "@/lib/types";

function Block({
  title,
  body,
  glyph,
  delay,
}: {
  title: string;
  body: string;
  glyph: string;
  delay: number;
}) {
  const lines = body
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  return (
    <Reveal delay={delay} className="card-surface rounded-2xl p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="glyph text-base">{glyph}</span>
        <h3 className="display text-sm uppercase tracking-[0.16em] text-mist-100">{title}</h3>
      </div>
      <ul className="space-y-2.5">
        {lines.map((line, i) => (
          <li key={i} className="flex gap-3 text-sm leading-relaxed text-mist-400">
            <span className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-signal-400/70" />
            <span>{line.replace(/^[•\-]\s*/, "")}</span>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

export function AboutSection({
  profile,
  timeline,
  skills,
  symbols,
  onNavigate,
}: {
  profile: Profile;
  timeline: TimelineItem[];
  skills: Skill[];
  symbols: string;
  onNavigate: (id: string) => void;
}) {
  const { t, lang } = useLang();
  const paragraphs = pick(profile.bio, lang)
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section id="about" className="relative scroll-mt-20 border-t border-white/[0.06] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="eyebrow">{t("about.eyebrow")}</p>
        </Reveal>

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          {/* Portrait */}
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative">
              <div
                aria-hidden
                className="absolute -left-3 -top-3 h-full w-full rounded-3xl border border-signal-400/20"
              />
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/[0.08] bg-ink-900">
                {profile.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.photoUrl}
                    alt={profile.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <CoverArt seed={profile.name} label={profile.name} glyphs={symbols} />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="display text-2xl text-mist-50">{profile.name}</p>
                  <p className="mt-1 text-sm text-mist-300">{pick(profile.tagline, lang)}</p>
                </div>
              </div>
              <div
                aria-hidden
                className="absolute -bottom-5 -right-5 hidden h-20 w-20 items-center justify-center rounded-full border border-white/[0.07] bg-ink-950/80 backdrop-blur sm:flex"
              >
                <SlowGlyph glyph="⊹" className="text-xl" />
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <p className="text-sm leading-relaxed text-mist-300">{pick(profile.shortBio, lang)}</p>
              <div className="rule" />
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-[0.14em] text-mist-500">
                <span>
                  {t("about.based")} · {pick(profile.location, lang)}
                </span>
              </div>
            </div>
          </Reveal>

          {/* Story */}
          <div>
            <h2 className="display text-balance text-3xl leading-tight text-mist-50 sm:text-4xl">
              {t("about.title")}
            </h2>
            <div className="mt-8 space-y-5">
              {paragraphs.map((paragraph, i) => (
                <Reveal key={i} delay={i * 90}>
                  <p
                    className={`leading-relaxed text-mist-300 ${
                      i === 0 ? "text-lg sm:text-xl" : "text-[0.95rem] sm:text-base"
                    }`}
                  >
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={140}>
              <button
                type="button"
                onClick={() => onNavigate("connect")}
                className="mt-9 inline-flex items-center gap-2.5 rounded-full border border-white/[0.12] px-5 py-2.5 font-display text-sm text-mist-100 transition-all duration-500 hover:border-signal-400/50 hover:text-signal-300"
              >
                {t("about.sayHello")}
                <span>→</span>
              </button>
            </Reveal>

            <div className="mt-14 grid gap-4 sm:grid-cols-3">
              <Block title={t("about.learning")} body={pick(profile.learning, lang)} glyph="✦" delay={0} />
              <Block title={t("about.building")} body={pick(profile.building, lang)} glyph="⟁" delay={90} />
              <Block title={t("about.goals")} body={pick(profile.goals, lang)} glyph="◉" delay={180} />
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-28">
          <Reveal>
            <div className="flex items-center gap-4">
              <h3 className="display text-xl text-mist-50 sm:text-2xl">{t("about.story")}</h3>
              <span className="h-px flex-1 bg-white/[0.08]" />
              <span className="glyph text-sm">⌁</span>
            </div>
          </Reveal>

          <ol className="mt-10 space-y-0">
            {timeline.map((item, index) => (
              <Reveal as="li" key={item.id} delay={index * 70} className="relative">
                <div className="group grid gap-4 py-7 sm:grid-cols-[80px_1fr] sm:gap-8">
                  <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-1">
                    <span className="display text-2xl text-signal-400/80 sm:text-3xl">
                      {item.year}
                    </span>
                    <span className="hidden h-6 w-px bg-white/10 sm:block" />
                  </div>
                  <div className="border-l border-white/[0.08] pl-6 sm:border-l-0 sm:pl-0">
                    <h4 className="display text-lg text-mist-50">{pick(item.title, lang)}</h4>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mist-400">
                      {pick(item.body, lang)}
                    </p>
                  </div>
                </div>
                {index < timeline.length - 1 ? <div className="rule" /> : null}
              </Reveal>
            ))}
          </ol>
        </div>

        {/* Skills */}
        {skills.length > 0 ? (
          <div className="mt-24">
            <Reveal>
              <div className="flex items-center gap-4">
                <h3 className="display text-xl text-mist-50 sm:text-2xl">{t("about.skills")}</h3>
                <span className="h-px flex-1 bg-white/[0.08]" />
                <span className="glyph text-sm">⌘</span>
              </div>
            </Reveal>
            <div className="mt-10 grid gap-x-12 gap-y-6 sm:grid-cols-2">
              {skills.map((skill, i) => (
                <Reveal key={skill.id} delay={i * 60}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-display text-sm text-mist-100">{skill.name}</span>
                    <span className="font-display text-[0.68rem] tracking-widest text-mist-500">
                      {skill.level}
                    </span>
                  </div>
                  <div className="mt-2.5 h-[3px] w-full overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-signal-500 to-signal-300 transition-[width] duration-1000 ease-out"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
