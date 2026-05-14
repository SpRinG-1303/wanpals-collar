import { createFileRoute } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { BREEDS } from "@/lib/mock";
import { useState } from "react";
import { Search } from "lucide-react";
import { useT, useLanguage } from "@/context/LanguageContext";

export const Route = createFileRoute("/breeds")({ component: Breeds });

function Breeds() {
  const t = useT();
  const { language } = useLanguage();
  const [size, setSize] = useState(0);
  const [open, setOpen] = useState<string | null>(null);
  const breed = BREEDS.find((b) => b.jp === open);

  const sizes: { jp: string; en: string }[] = [
    { jp: "全部", en: "All" },
    { jp: "小型犬", en: "Small" },
    { jp: "中型犬", en: "Medium" },
    { jp: "大型犬", en: "Large" },
    { jp: "ミックス", en: "Mixed" },
    { jp: "🇯🇵 人気順", en: "🇯🇵 Popular" },
  ];

  return (
    <AppShell titleJp="📚 犬種図鑑" titleEn="📚 Breeds">
      <div className="bg-card rounded-xl shadow-soft px-3 flex items-center gap-2">
        <Search className="w-4 h-4 text-muted-foreground"/>
        <input className="flex-1 py-3 bg-transparent outline-none text-sm" placeholder={t("犬種を検索", "Search any breed")}/>
      </div>
      <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1">
        {sizes.map((s, i) => (
          <button key={s.en} onClick={() => setSize(i)} className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold ${size === i ? "bg-sakura text-primary" : "bg-card border border-border text-muted-foreground"}`}>
            {t(s.jp, s.en)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        {BREEDS.map((b) => (
          <button key={b.jp} onClick={() => setOpen(b.jp)} className="bg-card rounded-2xl p-4 shadow-card text-left">
            <div className="h-20 bg-gradient-to-br from-sakura-soft to-muted rounded-xl flex items-center justify-center text-4xl">🐕</div>
            <div className="mt-2 font-bold text-sm">{language === "english" ? b.en : b.jp}</div>
            {language === "mixed" && <div className="text-[10px] text-muted-foreground">{b.en}</div>}
            {b.rank <= 5 && <div className="mt-1 text-[10px] bg-warning/20 text-warning-foreground inline-block px-2 py-0.5 rounded-full font-bold">🏅 #{b.rank} {t("人気", "Popular")}</div>}
          </button>
        ))}
      </div>

      {breed && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setOpen(null)}>
          <div className="bg-background w-full max-h-[90vh] rounded-t-3xl p-5 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-3"/>
            <div className="h-40 bg-gradient-to-br from-sakura to-secondary rounded-2xl flex items-center justify-center text-7xl">🐕</div>
            <h2 className="text-2xl font-black mt-3">{language === "english" ? breed.en : breed.jp}</h2>
            <p className="text-sm text-muted-foreground">
              {language === "english" ? `${breed.en} · #${breed.rank} popular` : `${breed.en} · ${t("人気ランク", "Popularity")} #${breed.rank}`}
            </p>

            <div className="mt-4 space-y-3">
              {([
                ["エネルギー","Energy",80],
                ["友好性","Friendliness",90],
                ["訓練性","Trainability",70],
                ["手入れ","Grooming",60],
              ] as const).map(([jp,en,v]) => (
                <div key={en}>
                  <div className="flex justify-between text-xs">
                    <span className="font-bold">{t(jp, en)}</span>
                    <span className="font-bold">{v}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden mt-1"><div className="h-full bg-sakura rounded-full" style={{width:`${v}%`}}/></div>
                </div>
              ))}
            </div>

            <h3 className="mt-5 text-sm font-bold">⚠️ {t("日本での注意疾患", "Common conditions in Japan")}</h3>
            <ul className="text-xs text-muted-foreground mt-1 space-y-1">
              <li>• {t("膝蓋骨脱臼", "Patellar Luxation")}</li>
              <li>• {t("アレルギー性皮膚炎", "Skin Allergies")}</li>
              <li>• {t("熱中症リスク (夏季)", "Heat Stroke (summer)")}</li>
            </ul>

            <button className="mt-5 w-full bg-primary text-primary-foreground rounded-2xl py-3 font-bold text-sm">🐾 {t("このコをコミュニティで見る", "Find this breed in community")}</button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
