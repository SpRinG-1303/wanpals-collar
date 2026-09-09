import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, ChevronLeft, Globe } from "lucide-react";
import { useState } from "react";
import AppShell from "@/components/AppShell";
import {
  ALL_LANGUAGES,
  INDIAN_LANGUAGES,
  GLOBAL_LANGUAGES,
  LANGUAGE_COUNT,
  getDisplayLanguage,
  setDisplayLanguage,
} from "@/lib/languages";
import { toast } from "sonner";

export const Route = createFileRoute("/language")({ component: LanguagePicker });

function LangRow({ name, active, onPick }: { name: string; active: boolean; onPick: () => void }) {
  return (
    <button
      onClick={onPick}
      className="w-full text-left flex items-center justify-between"
      style={{
        padding: "12px 14px",
        borderRadius: 14,
        background: active ? "var(--acc-pale)" : "var(--bg-card)",
        border: active ? "1.5px solid var(--acc-strong)" : "1px solid var(--border-card)",
        marginBottom: 8,
      }}
    >
      <span style={{ fontSize: 14, fontWeight: active ? 700 : 500, color: "var(--text-primary)" }}>{name}</span>
      {active && <Check size={16} style={{ color: "var(--acc-strong)" }} />}
    </button>
  );
}

function LanguagePicker() {
  const nav = useNavigate();
  const [selected, setSelected] = useState(getDisplayLanguage());

  const pick = (l: string) => {
    setSelected(l);
    setDisplayLanguage(l);
    toast(`${l} selected`, { duration: 1500 });
  };

  return (
    <AppShell titleEn="Language" titleJp="言語" hideTopBar>
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

        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)", margin: "6px 2px 8px" }}>
          Indian languages · {INDIAN_LANGUAGES.length}
        </div>
        {INDIAN_LANGUAGES.map((l) => (
          <LangRow key={l} name={l} active={selected === l} onPick={() => pick(l)} />
        ))}

        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)", margin: "16px 2px 8px" }}>
          Global languages · {GLOBAL_LANGUAGES.length}
        </div>
        {GLOBAL_LANGUAGES.filter((l) => l !== "English").map((l) => (
          <LangRow key={l} name={l} active={selected === l} onPick={() => pick(l)} />
        ))}

        <div style={{ fontSize: 10, color: "var(--text-placeholder)", textAlign: "center", marginTop: 14 }}>
          App interface translation is rolling out — your choice is saved for when your language goes live.
        </div>
      </div>
    </AppShell>
  );
}
