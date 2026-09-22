"use client";

import { useCallback, useEffect, useState } from "react";
import { LanguageProvider, useLang } from "@/components/LanguageProvider";
import { LandingGate, type GateChoice } from "@/components/LandingGate";
import { SiteNav } from "@/components/SiteNav";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ThoughtsSection } from "@/components/sections/ThoughtsSection";
import { ConnectSection } from "@/components/sections/ConnectSection";
import { pick } from "@/lib/types";
import type { Lang, SiteData } from "@/lib/types";

const GATE_KEY = "galaxy_gate_v1";

const CHOICE_SECTION: Record<GateChoice, string> = {
  work: "projects",
  me: "about",
  connect: "connect",
  everything: "home",
};

function Footer({ data }: { data: SiteData }) {
  const { t, lang } = useLang();
  return (
    <footer className="border-t border-white/[0.06] py-14">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="overflow-hidden">
          <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
            {[0, 1].map((group) => (
              <div key={group} className="flex items-center gap-10">
                {data.settings.symbols
                  .split(/\s+/)
                  .filter(Boolean)
                  .concat(data.settings.symbols.split(/\s+/).filter(Boolean))
                  .map((glyph, i) => (
                    <span key={`${group}-${i}`} className="glyph text-xl">
                      {glyph}
                    </span>
                  ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="display text-2xl text-mist-50">{data.profile.name}</p>
            <p className="mt-2 max-w-sm text-sm text-mist-500">
              {pick(data.profile.shortBio, lang)}
            </p>
          </div>
          <div className="text-xs leading-relaxed text-mist-500">
            <p>
              {t("footer.made")} {data.profile.name} · © {new Date().getFullYear()}{" "}
              {t("footer.rights")}
            </p>
            <a
              href="/admin"
              className="mt-2 inline-block font-display uppercase tracking-[0.18em] text-mist-600 transition-colors hover:text-signal-300"
            >
              {t("nav.admin")} ⌘
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Experience({ data }: { data: SiteData }) {
  const [gateOpen, setGateOpen] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(GATE_KEY) === "done") setGateOpen(false);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (gateOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [gateOpen]);

  const scrollTo = useCallback((id: string, delay = 0) => {
    window.setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, delay);
  }, []);

  const handleNavigate = useCallback(
    (id: string) => {
      scrollTo(id, 60);
    },
    [scrollTo],
  );

  const handleChoose = useCallback(
    (choice: GateChoice) => {
      try {
        window.sessionStorage.setItem(GATE_KEY, "done");
      } catch {
        /* ignore */
      }
      setGateOpen(false);
      scrollTo(CHOICE_SECTION[choice], 260);
    },
    [scrollTo],
  );

  const pathOptions = [
    { id: "work" as const, glyph: "⟁", label: data.settings.pathWork, sub: data.settings.pathWorkHint },
    { id: "me" as const, glyph: "◉", label: data.settings.pathMe, sub: data.settings.pathMeHint },
    {
      id: "connect" as const,
      glyph: "☍",
      label: data.settings.pathConnect,
      sub: data.settings.pathConnectHint,
    },
  ];

  const publishedCount = data.thoughts.filter((thought) => thought.published).length;

  return (
    <>
      <SiteNav visible={!gateOpen && hydrated} name={data.profile.name} onNavigate={handleNavigate} />

      {gateOpen && hydrated ? (
        <LandingGate
          symbols={data.settings.symbols}
          question={data.settings.landingQuestion}
          hint={data.settings.landingHint}
          options={pathOptions}
          onChoose={handleChoose}
        />
      ) : null}

      <main className={gateOpen ? "max-h-[100svh] overflow-hidden" : ""}>
        <HeroSection
          settings={data.settings}
          profile={data.profile}
          projectCount={data.projects.length}
          thoughtCount={publishedCount}
          onNavigate={handleNavigate}
        />
        <AboutSection
          profile={data.profile}
          timeline={data.timeline}
          skills={data.skills}
          symbols={data.settings.symbols}
          onNavigate={handleNavigate}
        />
        <ProjectsSection projects={data.projects} symbols={data.settings.symbols} />
        <ThoughtsSection thoughts={data.thoughts} symbols={data.settings.symbols} />
        <ConnectSection profile={data.profile} links={data.links} />
      </main>

      <Footer data={data} />
    </>
  );
}

export function SiteExperience({ data, initialLang }: { data: SiteData; initialLang: Lang }) {
  return (
    <LanguageProvider initial={initialLang}>
      <Experience data={data} />
    </LanguageProvider>
  );
}
