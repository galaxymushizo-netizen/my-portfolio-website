"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/components/LanguageProvider";
import type { Lang } from "@/lib/types";

export const SECTIONS = [
  { id: "home", key: "nav.home", glyph: "⌁" },
  { id: "about", key: "nav.about", glyph: "◉" },
  { id: "projects", key: "nav.projects", glyph: "⟁" },
  { id: "thoughts", key: "nav.thoughts", glyph: "✦" },
  { id: "connect", key: "nav.connect", glyph: "☍" },
] as const;

export function SiteNav({
  visible,
  name,
  onNavigate,
}: {
  visible: boolean;
  name: string;
  onNavigate: (id: string) => void;
}) {
  const { t, lang, setLang } = useLang();
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const targets = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!targets.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visibleEntries[0]) setActive(visibleEntries[0].target.id);
      },
      { threshold: [0.2, 0.45, 0.7], rootMargin: "-72px 0px -35% 0px" },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [visible]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    onNavigate(id);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[70] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div
        className={`border-b transition-all duration-500 ${
          scrolled
            ? "border-white/[0.06] bg-ink-950/80 backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-18 sm:px-8">
          <button
            type="button"
            onClick={() => go("home")}
            className="group flex items-center gap-2.5"
            aria-label={t("nav.home")}
          >
            <span className="font-display text-lg text-signal-400 transition-transform duration-500 group-hover:rotate-180">
              ⌘
            </span>
            <span className="display text-[0.95rem] tracking-tight text-mist-50">
              {name}
            </span>
            <span className="hidden h-1.5 w-1.5 rounded-full bg-signal-400 sm:block" />
          </button>

          <div className="hidden items-center gap-1 md:flex">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => go(section.id)}
                className={`relative px-3.5 py-2 font-display text-[0.78rem] uppercase tracking-[0.14em] transition-colors duration-300 ${
                  active === section.id ? "text-mist-50" : "text-mist-400 hover:text-mist-200"
                }`}
              >
                {t(section.key)}
                <span
                  className="absolute inset-x-3 -bottom-0.5 h-[1px] bg-signal-400 transition-transform duration-500"
                  style={{ transform: `scaleX(${active === section.id ? 1 : 0})` }}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-full border border-white/[0.08] p-0.5">
              {(["en", "sw"] as Lang[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className={`rounded-full px-2.5 py-1 font-display text-[0.68rem] uppercase tracking-[0.14em] transition-all duration-300 ${
                    lang === code
                      ? "bg-signal-400 text-ink-950"
                      : "text-mist-400 hover:text-mist-100"
                  }`}
                  aria-pressed={lang === code}
                >
                  {code}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] text-mist-200 md:hidden"
              aria-label={open ? t("nav.close") : t("nav.menu")}
            >
              <span className="text-sm">{open ? "✕" : "⌁"}</span>
            </button>
          </div>
        </nav>
      </div>

      <div
        className={`overflow-hidden border-b border-white/[0.06] bg-ink-950/95 backdrop-blur-xl transition-[max-height,opacity] duration-500 md:hidden ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-1 px-5 py-4">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => go(section.id)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-white/[0.04]"
            >
              <span className="glyph text-sm">{section.glyph}</span>
              <span className="display text-base text-mist-100">{t(section.key)}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
