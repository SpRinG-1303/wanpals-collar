import { createContext, useContext, type ReactNode } from "react";

// Legacy union kept for type compatibility with existing comparisons.
// The app is English-only: the provider always reports "english".
export type Language = "english" | "japanese" | "mixed";

type Ctx = {
  language: Language;
  setLanguage: (l: Language) => void;
};

const LanguageContext = createContext<Ctx>({ language: "english", setLanguage: () => {} });

// The app is English-only; clear any legacy stored language preference.
function clearLegacyLangKeys() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("appLanguage");
    localStorage.removeItem("preferredLanguage");
    localStorage.removeItem("wancare-lang");
  } catch {}
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  clearLegacyLangKeys();
  return (
    <LanguageContext.Provider value={{ language: "english", setLanguage: () => {} }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

/** Text renderer. English-only app: always renders the English copy. */
export function T({
  en,
  className = "",
  as: As = "span",
}: {
  jp?: string;
  en: string;
  className?: string;
  enClassName?: string;
  as?: "span" | "div";
}) {
  return <As className={className}>{en}</As>;
}

/** String helper for places that need a plain string (placeholders, titles, attrs). */
export function useT() {
  return (_jp: string, en: string) => en;
}
