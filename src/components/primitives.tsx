"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLang } from "@/components/LanguageProvider";

/* ------------------------------------------------------------------ */
/*  Scroll reveal                                                      */
/* ------------------------------------------------------------------ */

export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "span";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/*  Decorative symbols                                                 */
/* ------------------------------------------------------------------ */

export function SymbolField({
  symbols,
  className = "",
  count = 7,
}: {
  symbols: string;
  className?: string;
  count?: number;
}) {
  const glyphs = (symbols.trim() || "⌁ ◉ ⟁ ☍ ✦ ⌘ ⊹")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 12);
  const items = Array.from({ length: count }, (_, i) => {
    const glyph = glyphs[i % glyphs.length];
    const left = (i * 37.5 + (i % 3) * 9) % 96;
    const top = (i * 23.7 + (i % 4) * 11) % 92;
    return { glyph, left, top, i };
  });

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {items.map(({ glyph, left, top, i }) => (
        <span
          key={i}
          className="glyph animate-drift absolute text-2xl sm:text-3xl"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            animationDelay: `${i * 1.3}s`,
            animationDuration: `${8 + (i % 5) * 2}s`,
            opacity: 0.18 + (i % 4) * 0.07,
            fontSize: `${0.9 + (i % 3) * 0.35}rem`,
          }}
        >
          {glyph}
        </span>
      ))}
    </div>
  );
}

export function SlowGlyph({ glyph, className = "" }: { glyph: string; className?: string }) {
  return (
    <span aria-hidden className={`glyph animate-spin-slow inline-block ${className}`}>
      {glyph}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Procedural cover art (used when no image is uploaded)              */
/* ------------------------------------------------------------------ */

function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function CoverArt({
  seed,
  label = "",
  glyphs = "⌁ ◉ ⟁ ☍ ✦ ⌘ ⊹",
  className = "",
}: {
  seed: string;
  label?: string;
  glyphs?: string;
  className?: string;
}) {
  const h = hash(seed);
  const angle = h % 360;
  const x1 = 15 + (h % 60);
  const y1 = 10 + ((h >> 3) % 55);
  const x2 = 20 + ((h >> 5) % 65);
  const y2 = 20 + ((h >> 7) % 60);
  const list = glyphs.split(/\s+/).filter(Boolean);
  const g1 = list[h % list.length] ?? "✦";
  const g2 = list[(h >> 4) % list.length] ?? "⌁";
  const initials = label
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div
      aria-hidden
      className={`relative h-full w-full overflow-hidden bg-ink-900 ${className}`}
      style={{
        backgroundImage: `
          radial-gradient(70% 70% at ${x1}% ${y1}%, hsla(${angle}, 60%, 42%, 0.30), transparent 60%),
          radial-gradient(60% 60% at ${x2}% ${y2}%, hsla(${(angle + 90) % 360}, 55%, 40%, 0.22), transparent 62%),
          linear-gradient(${angle}deg, #0b0d13, #101420 60%, #0a0b10)
        `,
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
          maskImage: "radial-gradient(80% 80% at 50% 40%, black, transparent 75%)",
          WebkitMaskImage: "radial-gradient(80% 80% at 50% 40%, black, transparent 75%)",
        }}
      />
      <span
        className="absolute select-none font-display text-white/[0.07]"
        style={{ right: "4%", bottom: "-6%", fontSize: "clamp(3.5rem, 11vw, 7rem)", lineHeight: 1 }}
      >
        {g1}
      </span>
      <span
        className="absolute select-none font-display text-signal-400/20"
        style={{ left: "6%", top: "6%", fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)" }}
      >
        {g2}
      </span>
      <span
        className="absolute left-6 top-1/2 -translate-y-1/2 font-display text-3xl text-white/85 sm:text-4xl"
        style={{ letterSpacing: "-0.04em" }}
      >
        {initials}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Badges                                                             */
/* ------------------------------------------------------------------ */

const STATUS_STYLE: Record<string, string> = {
  idea: "border-mist-400/30 text-mist-200",
  "in-progress": "border-signal-400/40 text-signal-300",
  live: "border-emerald-400/40 text-emerald-300",
  paused: "border-amber-400/40 text-amber-300",
  archived: "border-mist-500/30 text-mist-400",
};

export function StatusBadge({ status }: { status: string }) {
  const { t } = useLang();
  const key = STATUS_STYLE[status] ? status : "idea";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-display text-[0.62rem] uppercase tracking-[0.16em] ${STATUS_STYLE[key]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {t(`status.${key}`)}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  id,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  id?: string;
}) {
  return (
    <Reveal className="max-w-3xl">
      <p className="eyebrow" id={id}>
        {eyebrow}
      </p>
      <h2 className="display mt-4 text-balance text-3xl leading-[1.05] text-mist-50 sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-mist-400 sm:text-lg">{subtitle}</p>
      ) : null}
    </Reveal>
  );
}
