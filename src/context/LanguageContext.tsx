import { createContext, useContext, useEffect, type ReactNode } from "react";

export type Language = "english";

type Ctx = {
  language: Language;
  setLanguage: (l: Language) => void;
};

const LanguageContext = createContext<Ctx>({ language: "english", setLanguage: () => {} });

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Clean up legacy language preference keys — app is English-only now
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem("appLanguage");
      localStorage.removeItem("preferredLanguage");
      localStorage.removeItem("wancare-lang");
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language: "english", setLanguage: () => {} }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

/** English-only text. The jp argument is ignored (kept for call-site compatibility). */
export function T({
  en,
  className = "",
  as: As = "span",
}: {
  jp: string;
  en: string;
  className?: string;
  enClassName?: string;
  as?: "span" | "div";
}) {
  return <As className={className}>{en}</As>;
}

/** String helper — always returns the English string. */
export function useT() {
  return (_jp: string, en: string) => en;
}
