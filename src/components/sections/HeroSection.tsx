"use client";

import { useLang } from "@/components/LanguageProvider";
import { Reveal, SlowGlyph, SymbolField } from "@/components/primitives";
import { pick } from "@/lib/types";
import type { Profile, SiteSettings } from "@/lib/types";

export function HeroSection({
  settings,
  profile,
  projectCount,
  thoughtCount,
  onNavigate,
}: {
  settings: SiteSettings;
  profile: Profile;
  projectCount: number;
  thoughtCount: number;
  onNavigate: (id: string) => void;
}) {
  const { t, lang } = useLang();
  const title = pick(settings.heroTitle, lang);
  const words = title.split(" ");

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-24 pb-16"
    >
      <SymbolField symbols={settings.symbols} count={6} />

      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/4 hidden lg:block"
      >
        <SlowGlyph glyph="⌘" className="text-[22rem] leading-none text-white/[0.02]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2 items-center justify-center">
              <span className="pulse-ring absolute inline-flex h-full w-full rounded-full" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal-400" />
            </span>
            <p className="eyebrow !tracking-[0.2em]">{pick(settings.heroKicker, lang)}</p>
          </div>
        </Reveal>

        <h1 className="display mt-8 max-w-4xl text-balance text-[2.6rem] leading-[0.98] text-mist-50 sm:text-6xl md:text-7xl lg:text-[5.2rem]">
          {words.map((word, i) => (
            <span
              key={`${word}-${i}`}
              className="animate-rise mr-[0.28em] inline-block"
              style={{ animationDelay: `${140 + i * 90}ms` }}
            >
              {i === words.length - 1 ? (
                <span className="text-signal-400">{word}</span>
              ) : (
                word
              )}
            </span>
          ))}
        </h1>

        <Reveal delay={420}>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-mist-400 sm:text-lg">
            {pick(settings.heroSubtitle, lang)}
          </p>
        </Reveal>

        <Reveal delay={540}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate("projects")}
              className="group inline-flex items-center gap-2.5 rounded-full bg-signal-400 px-6 py-3 font-display text-sm text-ink-950 transition-all duration-500 hover:gap-4 hover:bg-signal-300"
            >
              {pick(settings.pathWork, lang)}
              <span>→</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate("about")}
              className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.12] px-6 py-3 font-display text-sm text-mist-100 transition-all duration-500 hover:border-white/30 hover:bg-white/[0.04]"
            >
              <span className="glyph text-xs">◉</span>
              {pick(settings.pathMe, lang)}
            </button>
            <button
              type="button"
              onClick={() => onNavigate("connect")}
              className="inline-flex items-center gap-2.5 rounded-full px-4 py-3 font-display text-sm text-mist-400 transition-colors duration-500 hover:text-mist-50"
            >
              {pick(settings.pathConnect, lang)}
              <span className="text-signal-400">☍</span>
            </button>
          </div>
        </Reveal>

        <Reveal delay={700}>
          <div className="mt-16 grid max-w-2xl grid-cols-3 gap-4 border-t border-white/[0.07] pt-8">
            {[
              { value: String(projectCount), label: t("hero.projects") },
              { value: String(thoughtCount), label: t("hero.thoughts") },
              { value: "◉", label: t("hero.available") },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="display text-2xl text-mist-50 sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs leading-snug text-mist-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={820}>
          <div className="mt-14 flex items-center gap-4">
            <span className="glyph text-sm">⊹</span>
            <p className="max-w-xl font-display text-sm italic leading-relaxed text-mist-300 sm:text-base">
              “{pick(settings.philosophy, lang)}”
            </p>
          </div>
        </Reveal>

        <div className="mt-16 flex items-center gap-3 text-mist-500">
          <span className="h-px w-10 bg-white/20" />
          <span className="font-display text-[0.66rem] uppercase tracking-[0.24em]">
            {t("hero.scroll")}
          </span>
          <span className="text-mist-400">↓</span>
        </div>
      </div>
    </section>
  );
}
