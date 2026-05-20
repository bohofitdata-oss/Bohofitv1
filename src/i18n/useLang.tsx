import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { translate, type Lang, LANGS } from "./longevity";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, params?: Record<string, string>) => string;
};

const LangContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "boho_lang";

function getInitialLang(): Lang {
  if (typeof window === "undefined") return "en";
  const url = new URL(window.location.href);
  const fromUrl = url.searchParams.get("lang") as Lang | null;
  if (fromUrl && LANGS.some((l) => l.code === fromUrl)) return fromUrl;
  const stored = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
  if (stored && LANGS.some((l) => l.code === stored)) return stored;
  return "en";
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    setLangState(getInitialLang());
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, l);
      const url = new URL(window.location.href);
      url.searchParams.set("lang", l);
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  const t = useCallback((key: string, params?: Record<string, string>) => translate(lang, key, params), [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): Ctx {
  const ctx = useContext(LangContext);
  if (!ctx) {
    // Fallback for routes that don't wrap the provider — default to English.
    return { lang: "en", setLang: () => {}, t: (k, p) => translate("en", k, p) };
  }
  return ctx;
}
