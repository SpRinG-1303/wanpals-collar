import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, ChevronLeft, Globe, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import AppShell from "@/components/AppShell";
import {
  ALL_LANGUAGES,
  INDIAN_LANGUAGES,
  GLOBAL_LANGUAGES,
  LANGUAGE_COUNT,
} from "@/lib/languages";
import { toast } from "sonner";

export const Route = createFileRoute("/language")({ component: LanguagePicker });

const NATIVE: Record<string, string> = {
  Hindi: "हिन्दी", Bengali: "বাংলা", Telugu: "తెలుగు", Marathi: "मराठी",
  Tamil: "தமிழ்", Urdu: "اردو", Gujarati: "ગુજરાતી", Kannada: "ಕನ್ನಡ",
  Malayalam: "മലയാളം", Odia: "ଓଡ଼ିଆ", Punjabi: "ਪੰਜਾਬੀ", Assamese: "অসমীয়া",
  Maithili: "मैथिली", Sanskrit: "संस्कृतम्", Konkani: "कोंकणी",
  Kashmiri: "کٲشُر", Sindhi: "سنڌي", Nepali: "नेपाली",
  "Manipuri (Meitei)": "মৈতৈলোন্", Bodo: "बड़ो", Dogri: "डोगरी",
  "Mandarin Chinese": "中文", Spanish: "Español", Arabic: "العربية",
  French: "Français", Portuguese: "Português", Russian: "Русский",
  German: "Deutsch", Japanese: "日本語", Korean: "한국어",
  Indonesian: "Bahasa Indonesia", Turkish: "Türkçe", Italian: "Italiano",
  Vietnamese: "Tiếng Việt", Thai: "ไทย", Dutch: "Nederlands",
  "Persian (Farsi)": "فارسی", Polish: "Polski", Swahili: "Kiswahili",
  "Filipino/Tagalog": "Filipino",
};

function LangRow({ name, active, onPick }: { name: string; active: boolean; onPick: () => void }) {
  return (
    <button
      onClick={onPick}
      className="w-full text-left flex items-center justify-between"
      data-no-translate
      style={{
        padding: "12px 14px",
        borderRadius: 14,
        background: active ? "var(--acc-pale)" : "var(--bg-card)",
        border: active ? "1.5px solid var(--acc-strong)" : "1px solid var(--border-card)",
        marginBottom: 8,
      }}
    >
      <span style={{ fontSize: 14, fontWeight: active ? 700 : 500, color: "var(--text-primary)" }}>
        {name}
        {NATIVE[name] && <span style={{ marginLeft: 8, fontSize: 12, color: "var(--text-secondary)" }}>{NATIVE[name]}</span>}
      </span>
      {active && <Check size={16} style={{ color: "var(--acc-strong)" }} />}
    </button>
  );
}

function LanguagePicker() {
  const nav = useNavigate();
  const { language, setLanguage, translating, translatedCount } = useLanguage();

  const pick = (l: string) => {
    setLanguage(l);
    toast(l === "English" ? "Language: English ✓" : `Translating to ${l}…`, {
      duration: 2000,
      icon: l === "English" ? undefined : <Loader2 size={14} className="animate-spin" />,
    });
  };

  return (
    <AppShell titleEn="Language" hideTopBar>
      <div style={{ padding: "16px 16px 24px" }}>
        <div className="flex items-center" style={{ gap: 10, marginBottom: 14 }}>
          <button
            onClick={() => nav({ to: "/settings" })}
            aria-label="Back to settings"
            className="flex items-center justify-center"
            style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--bg-card)", border: "1px solid var(--border-card)" }}
          >
            <ChevronLeft size={17} style={{ color: "var(--text-primary)" }} />
          </button>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
              App Language
            </div>
            <div className="flex items-center" style={{ gap: 5, fontSize: 11, color: "var(--text-secondary)" }}>
              <Globe size={11} style={{ color: "var(--acc-strong)" }} />
              {LANGUAGE_COUNT} languages available
            </div>
          </div>
        </div>

        {language !== "English" && (
          <div
            className="flex items-center"
            data-no-translate
            style={{
              gap: 8,
              padding: "10px 14px",
              borderRadius: 14,
              background: "var(--acc-pale)",
              border: "1px solid var(--acc-strong)",
              fontSize: 12,
              fontWeight: 600,
              color: "var(--acc-deep, var(--acc-strong))",
              marginBottom: 12,
            }}
          >
            {translating && <Loader2 size={13} className="animate-spin" />}
            {translating
              ? `Translating the app to ${language}… (${translatedCount} phrases ready)`
              : `${language} active · ${translatedCount} phrases translated`}
          </div>
        )}

        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)", margin: "6px 2px 8px" }}>
          Indian languages · {INDIAN_LANGUAGES.length}
        </div>
        {INDIAN_LANGUAGES.map((l) => (
          <LangRow key={l} name={l} active={language === l} onPick={() => pick(l)} />
        ))}

        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)", margin: "16px 2px 8px" }}>
          Global languages · {GLOBAL_LANGUAGES.length}
        </div>
        {GLOBAL_LANGUAGES.filter((l) => l !== "English").map((l) => (
          <LangRow key={l} name={l} active={language === l} onPick={() => pick(l)} />
        ))}

        <div style={{ fontSize: 10, color: "var(--text-placeholder)", textAlign: "center", marginTop: 14 }}>
          The whole app interface is translated live. Translations are saved on your device for instant loading next time.
        </div>
      </div>
    </AppShell>
  );
}
