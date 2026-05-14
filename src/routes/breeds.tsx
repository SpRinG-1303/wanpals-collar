import { createFileRoute } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { BREEDS } from "@/lib/mock";
import { useState } from "react";
import { Search } from "lucide-react";

export const Route = createFileRoute("/breeds")({ component: Breeds });

const sizes = ["全部 All", "小型犬", "中型犬", "大型犬", "ミックス", "🇯🇵 人気順"];

function Breeds() {
  const [size, setSize] = useState(0);
  const [open, setOpen] = useState<string | null>(null);
  const breed = BREEDS.find((b) => b.jp === open);

  return (
    <AppShell title="📚 犬種図鑑 / Breeds">
      <div className="bg-card rounded-xl shadow-soft px-3 flex items-center gap-2">
        <Search className="w-4 h-4 text-muted-foreground"/>
        <input className="flex-1 py-3 bg-transparent outline-none text-sm" placeholder="犬種を検索 / Search any breed"/>
      </div>
      <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1">
        {sizes.map((s, i) => (
          <button key={s} onClick={() => setSize(i)} className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold ${size === i ? "bg-sakura text-primary" : "bg-card border border-border text-muted-foreground"}`}>{s}</button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        {BREEDS.map((b) => (
          <button key={b.jp} onClick={() => setOpen(b.jp)} className="bg-card rounded-2xl p-4 shadow-card text-left">
            <div className="h-20 bg-gradient-to-br from-sakura-soft to-muted rounded-xl flex items-center justify-center text-4xl">🐕</div>
            <div className="mt-2 font-bold text-sm">{b.jp}</div>
            <div className="text-[10px] text-muted-foreground">{b.en}</div>
            {b.rank <= 5 && <div className="mt-1 text-[10px] bg-warning/20 text-warning-foreground inline-block px-2 py-0.5 rounded-full font-bold">🏅 #{b.rank} 人気</div>}
          </button>
        ))}
      </div>

      {breed && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setOpen(null)}>
          <div className="bg-background w-full max-h-[90vh] rounded-t-3xl p-5 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-3"/>
            <div className="h-40 bg-gradient-to-br from-sakura to-secondary rounded-2xl flex items-center justify-center text-7xl">🐕</div>
            <h2 className="text-2xl font-black mt-3">{breed.jp}</h2>
            <p className="text-sm text-muted-foreground">{breed.en} · 人気ランク #{breed.rank}</p>

            <div className="mt-4 space-y-3">
              {[["エネルギー","Energy",80],["友好性","Friendliness",90],["訓練性","Trainability",70],["手入れ","Grooming",60]].map(([jp,en,v]) => (
                <div key={jp as string}>
                  <div className="flex justify-between text-xs"><span className="font-bold">{jp} <span className="text-muted-foreground font-normal">{en}</span></span><span className="font-bold">{v}%</span></div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden mt-1"><div className="h-full bg-sakura rounded-full" style={{width:`${v}%`}}/></div>
                </div>
              ))}
            </div>

            <h3 className="mt-5 text-sm font-bold">⚠️ 日本での注意疾患</h3>
            <ul className="text-xs text-muted-foreground mt-1 space-y-1">
              <li>• 膝蓋骨脱臼 / Patellar Luxation</li>
              <li>• アレルギー性皮膚炎 / Skin Allergies</li>
              <li>• 熱中症リスク (夏季) / Heat Stroke</li>
            </ul>

            <button className="mt-5 w-full bg-primary text-primary-foreground rounded-2xl py-3 font-bold text-sm">🐾 このコをコミュニティで見る</button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
