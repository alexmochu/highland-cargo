"use client";

import { createContext, useContext, useCallback, useEffect, useState } from "react";
import { translations, LOCALES, RTL_LOCALES, DEFAULT_LOCALE } from "./translations";

const STORAGE_KEY = "hc-locale";

const LocaleContext = createContext(null);

function getByPath(obj, path) {
  return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(DEFAULT_LOCALE);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && LOCALES.includes(stored)) setLocaleState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = RTL_LOCALES.includes(locale) ? "rtl" : "ltr";
  }, [locale]);

  const setLocale = useCallback((next) => {
    if (!LOCALES.includes(next)) return;
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  // t("services.items.0.title") style dotted-path lookup, with an English
  // fallback so a missing key never renders blank.
  const t = useCallback((path, vars) => {
    let value = getByPath(translations[locale], path);
    if (value === undefined) value = getByPath(translations[DEFAULT_LOCALE], path);
    if (value === undefined) return path;
    if (typeof value === "string" && vars) {
      return Object.entries(vars).reduce((str, [k, v]) => str.replaceAll(`{${k}}`, v), value);
    }
    return value;
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, locales: LOCALES, isRTL: RTL_LOCALES.includes(locale) }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useTranslation must be used within a LocaleProvider");
  return ctx;
}
