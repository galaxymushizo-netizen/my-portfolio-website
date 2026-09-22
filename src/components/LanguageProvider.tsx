"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { translate } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

type LangContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
  ready: boolean;
};

const LangContext = createContext<LangContextValue>({
  lang: "en",
  setLang: () => {},
  t: (key: string) => translate("en", key),
  ready: false,
});

export function LanguageProvider({
  children,
  initial = "en",
}: {
  children: ReactNode;
  initial?: Lang;
}) {
  const [lang, setLangState] = useState<Lang>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("galaxy_lang");
      if (saved === "en" || saved === "sw") setLangState(saved);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang === "sw" ? "sw" : "en";
    }
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem("galaxy_lang", next);
      document.cookie = `galaxy_lang=${next}; path=/; max-age=31536000; samesite=lax`;
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<LangContextValue>(
    () => ({
      lang,
      setLang,
      ready,
      t: (key: string) => translate(lang, key),
    }),
    [lang, setLang, ready],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
