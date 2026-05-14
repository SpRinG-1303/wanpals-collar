import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/language")({ component: Language });

const opts = [
  { id: "en", flag: "🇬🇧", title: "English Only", sub: "Use English throughout" },
  { id: "jp", flag: "🇯🇵", title: "日本語 Japanese Only", sub: "日本語のみで使用" },
  { id: "mix", flag: "🌐", title: "Mixed (EN + JP)", sub: "両方の言語を表示" },
];

function Language() {
  const [sel, setSel] = useState("mix");
  const nav = useNavigate();
  const choose = () => {
    if (typeof window !== "undefined") localStorage.setItem("wancare-lang", sel);
    nav({ to: "/auth" });
  };
  return (
    <div className="min-h-screen paw-bg flex flex-col p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-black text-primary mt-8">言語を選択</h1>
      <p className="text-sm text-muted-foreground">Select Language</p>
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
          続ける / Continue
        </button>
      </div>
    </div>
  );
}
