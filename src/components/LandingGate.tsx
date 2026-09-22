"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/components/LanguageProvider";
import { SymbolField } from "@/components/primitives";
import { pick } from "@/lib/types";
import type { Bilingual } from "@/lib/types";

export type GateChoice = "work" | "me" | "connect" | "everything";

export function LandingGate({
  symbols,
  question,
  hint,
  options,
  onChoose,
}: {
  symbols: string;
  question: Bilingual;
  hint: Bilingual;
  options: { id: GateChoice; glyph: string; label: Bilingual; sub: Bilingual }[];
  onChoose: (choice: GateChoice) => void;
}) {
  const { t, lang } = useLang();
  const [leaving, setLeaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState<GateChoice | null>(null);

  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 60);
    return () => window.clearTimeout(id);
  }, []);

  const choose = (choice: GateChoice) => {
    if (leaving) return;
    setLeaving(true);
    window.setTimeout(() => onChoose(choice), 640);
  };

  const glyphList = symbols.split(/\s+/).filter(Boolean);

  return (
    <div
      className={`fixed inset-0 z-[90] flex items-center justify-center overflow-hidden px-5 transition-all duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        leaving ? "pointer-events-none opacity-0 blur-md" : "opacity-100"
      }`}
      style={{
        background:
          "radial-gradient(120% 90% at 50% 0%, #0d1018 0%, #06070a 55%, #06070a 100%)",
      }}
    >
      <SymbolField symbols={symbols} count={8} />

      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block"
      >
        <div className="animate-spin-slow relative h-[560px] w-[560px] rounded-full border border-white/[0.05]" />
        <div className="absolute inset-[70px] rounded-full border border-white/[0.035]" />
        <div className="absolute inset-[170px] rounded-full border border-signal-400/10" />
      </div>

      <div
        className={`relative z-10 w-full max-w-3xl transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          mounted && !leaving ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <div className="mb-10 text-center">
          <div className="mb-6 flex items-center justify-center gap-3">
            {glyphList.slice(0, 3).map((g, i) => (
              <span
                key={i}
                className="glyph animate-drift text-lg"
                style={{ animationDelay: `${i * 0.9}s` }}
              >
                {g}
              </span>
            ))}
          </div>
          <h1 className="display text-balance text-4xl leading-[1.05] text-mist-50 sm:text-5xl md:text-6xl">
            {pick(question, lang)}
            <span className="animate-caret ml-1 text-signal-400">_</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-mist-400 sm:text-base">
            {pick(hint, lang)}
          </p>
        </div>

        <div className="space-y-3">
          {options.map((option, index) => (
            <button
              key={option.id}
              type="button"
              onMouseEnter={() => setHovered(option.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => choose(option.id)}
              className="group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.015] px-5 py-5 text-left transition-all duration-500 hover:border-signal-400/40 hover:bg-white/[0.04] sm:px-7 sm:py-6"
              style={{
                transform:
                  mounted && !leaving ? "translateY(0)" : "translateY(14px)",
                opacity: mounted && !leaving ? 1 : 0,
                transitionDelay: `${160 + index * 110}ms`,
              }}
            >
              <span
                className={`font-display text-xl transition-all duration-500 sm:text-2xl ${
                  hovered === option.id ? "text-signal-400" : "text-mist-400"
                }`}
              >
                {option.glyph}
              </span>
              <span className="min-w-0 flex-1">
                <span className="display block text-lg text-mist-50 sm:text-xl">
                  {pick(option.label, lang)}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-mist-400 sm:text-sm">
                  {pick(option.sub, lang)}
                </span>
              </span>
              <span
                className={`shrink-0 font-display text-lg transition-all duration-500 sm:text-xl ${
                  hovered === option.id
                    ? "translate-x-0 text-signal-400 opacity-100"
                    : "-translate-x-2 text-mist-400 opacity-40"
                }`}
              >
                →
              </span>
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 w-[2px] bg-signal-400 transition-all duration-500"
                style={{ transform: `scaleY(${hovered === option.id ? 1 : 0})` }}
              />
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => choose("everything")}
            className="font-display text-[0.7rem] uppercase tracking-[0.2em] text-mist-500 transition-colors hover:text-signal-300"
          >
            {t("landing.skip")}
          </button>
        </div>
      </div>
    </div>
  );
}
