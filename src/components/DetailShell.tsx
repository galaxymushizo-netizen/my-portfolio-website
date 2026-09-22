"use client";

import { useCallback, type ReactNode } from "react";
import { LanguageProvider, useLang } from "@/components/LanguageProvider";
import { SiteNav } from "@/components/SiteNav";
import { pick } from "@/lib/types";
import type { Lang } from "@/lib/types";

function Inner({
  name,
  shortBio,
  children,
}: {
  name: string;
  shortBio?: { en: string; sw: string };
  children: ReactNode;
}) {
  const { t, lang } = useLang();
  const handleNavigate = useCallback((id: string) => {
    if (id === "home" || id === "about" || id === "projects" || id === "thoughts" || id === "connect") {
      window.location.href = `/#${id}`;
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <>
      <SiteNav visible name={name} onNavigate={handleNavigate} />
      <main className="pt-24">{children}</main>
      <footer className="border-t border-white/[0.06] py-12">
        <div className="mx-auto flex max-w-4xl flex-col gap-4 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="display text-lg text-mist-50">{name}</p>
          <div className="text-xs text-mist-500">
            {shortBio ? <p className="max-w-sm">{pick(shortBio, lang)}</p> : null}
            <a
              href="/"
              className="mt-2 inline-block font-display uppercase tracking-[0.18em] text-mist-600 transition-colors hover:text-signal-300"
            >
              ← {t("common.backHome")}
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

export function DetailShell({
  name,
  shortBio,
  initialLang,
  children,
}: {
  name: string;
  shortBio?: { en: string; sw: string };
  initialLang: Lang;
  children: ReactNode;
}) {
  return (
    <LanguageProvider initial={initialLang}>
      <Inner name={name} shortBio={shortBio}>
        {children}
      </Inner>
    </LanguageProvider>
  );
}
