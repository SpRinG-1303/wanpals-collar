import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { getDisplayLanguage, setDisplayLanguage } from "@/lib/languages";
import { translateTexts } from "@/lib/translate.functions";

export type Language = string;

type Ctx = {
  language: Language;
  setLanguage: (l: Language) => void;
  /** number of strings translated so far for the active language */
  translatedCount: number;
  translating: boolean;
};

const LanguageContext = createContext<Ctx>({
  language: "English",
  setLanguage: () => {},
  translatedCount: 0,
  translating: false,
});

const RTL_LANGS = new Set(["Urdu", "Arabic", "Persian (Farsi)", "Kashmiri", "Sindhi"]);
const CACHE_PREFIX = "moo-i18n-v1:";
const SKIP = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "CODE"]);

function loadCache(lang: string): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(CACHE_PREFIX + lang) || "{}");
  } catch {
    return {};
  }
}

function saveCache(lang: string, map: Record<string, string>) {
  try {
    if (Object.keys(map).length > 4000) return;
    localStorage.setItem(CACHE_PREFIX + lang, JSON.stringify(map));
  } catch {}
}

function clearLegacyLangKeys() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("appLanguage");
    localStorage.removeItem("preferredLanguage");
    localStorage.removeItem("wancare-lang");
  } catch {}
}

/** A text node is worth translating if it has at least one letter and isn't
    the brand mark or pure numbers/punctuation. */
function worthTranslating(s: string): boolean {
  if (s.length < 2 || s.length > 240) return false;
  if (!/[A-Za-z]/.test(s)) return false;
  if (s.includes("MOooMENTUM")) return false;
  return true;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  clearLegacyLangKeys();
  const [language, setLanguageState] = useState<Language>(() => getDisplayLanguage());
  const [translatedCount, setTranslatedCount] = useState(0);
  const [translating, setTranslating] = useState(false);
  const langRef = useRef<Language>(language);
  // originals: text node -> its English source text
  const originalsRef = useRef<WeakMap<Text, string>>(new WeakMap());
  const cacheRef = useRef<Record<string, string>>({});
  const pendingRef = useRef<Set<string>>(new Set());
  const timerRef = useRef<number | undefined>(undefined);
  const busyRef = useRef(false);

  const notify = () => {
    setTranslatedCount(Object.keys(cacheRef.current).length);
    setTranslating(busyRef.current || pendingRef.current.size > 0);
  };

  const collectNodes = (): Text[] => {
    const out: Text[] = [];
    const frames = document.querySelectorAll(".mooomentum-frame");
    frames.forEach((frame) => {
      const walker = document.createTreeWalker(frame, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent || SKIP.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
          if (parent.closest("[data-no-translate]")) return NodeFilter.FILTER_REJECT;
          const txt = (node.textContent || "").trim();
          return worthTranslating(txt) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
        },
      });
      let n;
      while ((n = walker.nextNode())) out.push(n as Text);
    });
    return out;
  };

  const applyTranslations = () => {
    const lang = langRef.current;
    const cache = cacheRef.current;
    const frames = document.querySelectorAll<HTMLElement>(".mooomentum-frame");
    frames.forEach((f) => {
      f.dir = RTL_LANGS.has(lang) ? "rtl" : "ltr";
      f.lang = lang;
    });
    collectNodes().forEach((node) => {
      const originals = originalsRef.current;
      let original = originals.get(node);
      const current = (node.textContent || "").trim();
      if (!original) {
        original = current;
        originals.set(node, original);
      }
      if (lang === "English") {
        if (node.textContent !== original) node.textContent = original;
        return;
      }
      const hit = cache[original];
      if (hit) {
        if (node.textContent !== hit) node.textContent = hit;
      } else {
        if (node.textContent !== original) node.textContent = original;
        pendingRef.current.add(original);
      }
    });
    if (pendingRef.current.size > 0 && !busyRef.current) scheduleFetch();
  };

  const scheduleFetch = () => {
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(fetchPending, 600);
  };

  const fetchPending = async () => {
    if (busyRef.current) return;
    const batch = Array.from(pendingRef.current).slice(0, 60);
    if (batch.length === 0) return;
    busyRef.current = true;
    notify();
    try {
      const { translations } = await translateTexts({
        data: { target: langRef.current, texts: batch },
      });
      const cache = cacheRef.current;
      batch.forEach((src, i) => {
        const t = translations[i];
        if (t && t !== src) cache[src] = t;
        pendingRef.current.delete(src);
      });
      saveCache(langRef.current, cache);
    } catch {
      batch.forEach((s) => pendingRef.current.delete(s));
    } finally {
      busyRef.current = false;
    }
    applyTranslations();
    notify();
    if (pendingRef.current.size > 0) scheduleFetch();
  };

  const setLanguage = (l: Language) => {
    langRef.current = l;
    setLanguageState(l);
    setDisplayLanguage(l);
    cacheRef.current = loadCache(l);
    pendingRef.current.clear();
    window.clearTimeout(timerRef.current);
    applyTranslations();
    notify();
  };

  // Initial apply + observe DOM changes so newly rendered screens translate too
  useEffect(() => {
    langRef.current = getDisplayLanguage();
    cacheRef.current = loadCache(langRef.current);
    const obs = new MutationObserver(() => {
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(applyTranslations, 500);
    });
    obs.observe(document.body, { childList: true, subtree: true });
    // first pass after mount
    const id = window.setTimeout(applyTranslations, 300);
    return () => {
      obs.disconnect();
      window.clearTimeout(id);
      window.clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        get language() {
          return langRef.current;
        },
        setLanguage,
        get translatedCount() {
          return Object.keys(cacheRef.current).length;
        },
        get translating() {
          return busyRef.current || pendingRef.current.size > 0;
        },
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function T({ en, className = "", as: As = "span" }: {
  jp?: string; en: string; className?: string; enClassName?: string; as?: "span" | "div";
}) {
  return <As className={className}>{en}</As>;
}

export function useT() {
  return (_jp: string, en: string) => en;
}
