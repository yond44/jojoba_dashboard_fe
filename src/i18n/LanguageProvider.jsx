import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { setFormatterLanguage } from "../lib/format.js";
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  TRANSLATIONS,
} from "./translations.js";

const STORAGE_KEY = "jojoba.language";
const LanguageContext = createContext(null);

function readStoredLanguage() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && TRANSLATIONS[stored]) return stored;
  } catch {
    return DEFAULT_LANGUAGE;
  }
  return DEFAULT_LANGUAGE;
}

function interpolate(template, values) {
  if (!values) return template;
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template
  );
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(readStoredLanguage);

  useEffect(() => {
    setFormatterLanguage(language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((nextLanguage) => {
    if (!TRANSLATIONS[nextLanguage]) return;
    setLanguageState(nextLanguage);
    document.documentElement.lang = nextLanguage;
    try {
      window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    } catch {
      return;
    }
  }, []);

  const translate = useCallback(
    (key, values) => {
      const dictionary = TRANSLATIONS[language] || TRANSLATIONS[DEFAULT_LANGUAGE];
      const fallback = TRANSLATIONS[DEFAULT_LANGUAGE];
      const template = dictionary[key] ?? fallback[key] ?? key;
      return interpolate(template, values);
    },
    [language]
  );

  const value = useMemo(
    () => ({ language, setLanguage, t: translate, languages: SUPPORTED_LANGUAGES }),
    [language, setLanguage, translate]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage harus dipakai di dalam LanguageProvider");
  }
  return context;
}
