import { createFileRoute } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { CLINICS } from "@/lib/mock";
import { Search, SlidersHorizontal, Star, Navigation, Video, Phone } from "lucide-react";
import { useState } from "react";
import { useT, useLanguage } from "@/context/LanguageContext";

export const Route = createFileRoute("/clinics")({ component: Clinics });

function Clinics() {
  const t = useT();
  const { language } = useLanguage();
  const [filter, setFilter] = useState(false);
  const [active, setActive] = useState(0);

  const cats: { jp: string; en: string }[] = [
    { jp: "⭐ 高評価", en: "⭐ Top Rated" },
    { jp: "📍 近く", en: "📍 Nearby" },
    { jp: "👍 おすすめ", en: "👍 Recommended" },
    { jp: "🔬 専門", en: "🔬 Specialist" },
    { jp: "🏛️ 公立/私立", en: "🏛️ Public/Private" },
  ];

  return (
    <AppShell titleJp="🏥 クリニック" titleEn="🏥 Clinics">
      <div className="flex gap-2">
        <div className="flex-1 bg-card rounded-xl shadow-soft px-3 flex items-center gap-2">
          <Search className="w-4 h-4 text-muted-foreground"/>
          <input className="flex-1 py-3 bg-transparent outline-none text-sm" placeholder={t("クリニックを検索", "Search clinics")}/>
        </div>
        <button onClick={() => setFilter(!filter)} className="w-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow-card">
          <SlidersHorizontal className="w-4 h-4"/>
        </button>
      </div>

      <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1">
        {cats.map((c, i) => (
          <button key={c.en} onClick={() => setActive(i)} className={`shrink-0 px-3 py-2 rounded-full text-xs font-bold ${active === i ? "bg-sakura text-primary" : "bg-card text-muted-foreground border border-border"}`}>
            {t(c.jp, c.en)}
          </button>
        ))}
      </div>

      {filter && (
        <div className="mt-3 bg-card rounded-2xl p-4 shadow-card space-y-3">
          <div>
            <div className="text-xs font-bold mb-1">{t("距離: 5km", "Distance: 5km")}</div>
            <input type="range" defaultValue={5} min={0} max={10} className="w-full accent-sakura"/>
          </div>
          <div className="flex gap-1">{[1,2,3,4,5].map(s=><Star key={s} className="w-5 h-5 fill-warning text-warning"/>)}</div>
          <label className="flex items-center justify-between text-sm"><span>{t("営業中のみ", "Open Now")}</span><input type="checkbox" defaultChecked className="accent-sakura"/></label>
          <label className="flex items-center justify-between text-sm"><span>{t("24時間緊急", "24h Emergency")}</span><input type="checkbox" className="accent-sakura"/></label>
        </div>
      )}

      <div className="mt-4 space-y-3">
        {CLINICS.map((c, i) => (
          <div key={i} className="bg-card rounded-2xl shadow-card overflow-hidden flex">
            <div className="w-24 shrink-0 bg-gradient-to-br from-sakura-soft to-muted flex items-center justify-center text-4xl">🏥</div>
            <div className="flex-1 p-3">
              <div className="font-bold text-sm">{language === "english" ? c.en : c.jp}</div>
              {language === "mixed" && <div className="text-[10px] text-muted-foreground">{c.en}</div>}
              <div className="flex items-center gap-2 mt-1 text-xs">
                <span className="flex items-center gap-0.5"><Star className="w-3 h-3 fill-warning text-warning"/> {c.rating}</span>
                <span className="text-muted-foreground">📍 {c.km}km</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${c.open ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>
                  {c.open ? t("営業中", "Open") : t("閉店中", "Closed")}
                </span>
              </div>
              {c.em && <div className="text-[10px] text-destructive font-bold mt-1">🚨 {t("24時間緊急", "24h Emergency")}</div>}
              <button className="mt-2 text-xs bg-primary text-primary-foreground rounded-lg px-3 py-1.5 font-bold flex items-center gap-1">
                <Navigation className="w-3 h-3"/> {t("道案内", "Directions")} →
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button className="bg-primary text-primary-foreground rounded-2xl py-3 font-bold text-xs flex items-center justify-center gap-1"><Video className="w-4 h-4"/> {t("ビデオ診察", "Video Visit")}</button>
        <button className="bg-destructive text-destructive-foreground rounded-2xl py-3 font-bold text-xs flex items-center justify-center gap-1 pulse-red"><Phone className="w-4 h-4"/> {t("緊急対応", "Emergency")}</button>
      </div>
    </AppShell>
  );
}
