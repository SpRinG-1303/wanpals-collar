import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useLanguage, type Language } from "@/context/LanguageContext";

export const Route = createFileRoute("/language")({ component: LanguagePicker });

const opts: { id: Language; flag: string; title: string; sub: string }[] = [
  { id: "english", flag: "🇬🇧", title: "English Only", sub: "Use English throughout" },
  { id: "japanese", flag: "🇯🇵", title: "日本語 Japanese Only", sub: "日本語のみで使用" },
  { id: "mixed", flag: "🌐", title: "Mixed (EN + JP)", sub: "両方の言語を表示 / Show both" },
];

function LanguagePicker() {
  const { language, setLanguage } = useLanguage();
  const [sel, setSel] = useState<Language>(language);
  const nav = useNavigate();
  const choose = () => {
    setLanguage(sel);
    nav({ to: "/auth" });
  };
  return (
    <div className="min-h-screen paw-bg flex flex-col p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-black text-primary mt-8">
        {sel === "english" ? "Select Language" : sel === "japanese" ? "言語を選択" : "言語を選択 / Select Language"}
      </h1>
      <div className="mt-8 space-y-3">
        {opts.map((o) => (
          <button
            key={o.id}
            onClick={() => setSel(o.id)}
            className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all min-h-[64px] text-left shadow-soft border-2 ${
              sel === o.id ? "border-sakura bg-sakura-soft" : "border-transparent bg-card"
            }`}
          >
            <span className="text-3xl">{o.flag}</span>
            <div>
              <div className="font-bold text-foreground">{o.title}</div>
              <div className="text-xs text-muted-foreground">{o.sub}</div>
            </div>
          </button>
        ))}
      </div>
      <div className="mt-auto pt-8">
        <button onClick={choose} className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl shadow-card">
          {sel === "english" ? "Continue" : sel === "japanese" ? "続ける" : "続ける / Continue"}
        </button>
      </div>
    </div>
  );
}
