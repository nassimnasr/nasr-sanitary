"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  defaultLocale,
  getDictionary,
  getDirection,
  type Locale,
} from "@/app/i18n";

type LanguageContextType = {
  locale: Locale;
  direction: "ltr" | "rtl";
  dictionary: ReturnType<typeof getDictionary>;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = "nasr-sanitary-locale";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Initialize locale from localStorage or navigator after hydration
    const savedLocale = localStorage.getItem(STORAGE_KEY) as Locale | null;
    let detectedLocale: Locale = defaultLocale;

    if (savedLocale === "en" || savedLocale === "ar") {
      detectedLocale = savedLocale;
    } else {
      detectedLocale = navigator.language.toLowerCase().startsWith("ar") ? "ar" : "en";
    }

    setLocaleState(detectedLocale);
    setMounted(true);
  }, []);

  useEffect(() => {
    const direction = getDirection(locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
    localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const value = useMemo<LanguageContextType>(() => {
    return {
      locale,
      direction: getDirection(locale),
      dictionary: getDictionary(locale),
      setLocale: setLocaleState,
      toggleLocale: () => setLocaleState((prev) => (prev === "en" ? "ar" : "en")),
    };
  }, [locale]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
