import { createFileRoute } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { POSTS } from "@/lib/mock";
import { useState } from "react";
import { Pencil, ArrowUp, MessageCircle, Share2 } from "lucide-react";

export const Route = createFileRoute("/community")({ component: Community });

const subs = ["すべて All", "柴犬部", "プードル部", "迷子情報", "獣医Q&A", "東京", "大阪"];

function Community() {
  const [sub, setSub] = useState(0);
  const [open, setOpen] = useState<string | null>(null);
  const post = POSTS.find((p) => p.id === open);

  return (
    <AppShell title="👥 コミュニティ / Community">
      <div className="flex justify-between items-center -mt-2 mb-3">
        <div className="text-xs text-muted-foreground">{POSTS.length * 412} メンバー</div>
        <button className="bg-sakura text-primary rounded-full px-3 py-2 text-xs font-bold flex items-center gap-1 shadow-card">
          <Pencil className="w-3 h-3"/> 投稿 / Post
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
        {subs.map((s, i) => (
          <button key={s} onClick={() => setSub(i)} className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold ${sub === i ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"}`}>{s}</button>
        ))}
      </div>

      <div className="space-y-3 mt-2">
        {POSTS.map((p) => (
          <button key={p.id} onClick={() => setOpen(p.id)} className="w-full text-left bg-card rounded-2xl p-4 shadow-card">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sakura to-secondary flex items-center justify-center text-sm">🐕</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold">{p.user} <span className="text-[9px] bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground">{p.breed}</span></div>
                <div className="text-[10px] text-muted-foreground">{p.time}</div>
              </div>
              <span className="text-[10px] bg-sakura-soft text-primary font-bold px-2 py-0.5 rounded-full">#{p.flair}</span>
            </div>
            <div className="mt-2 font-bold text-sm">{p.titleJp}</div>
            <div className="text-xs text-muted-foreground">{p.titleEn}</div>
            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><ArrowUp className="w-3.5 h-3.5"/>{p.up}</span>
              <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5"/>{p.com}</span>
              <span className="flex items-center gap-1"><Share2 className="w-3.5 h-3.5"/></span>
            </div>
          </button>
        ))}
      </div>

      {post && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setOpen(null)}>
          <div className="bg-background w-full max-h-[90vh] rounded-t-3xl p-5 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-3"/>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-sakura flex items-center justify-center">🐕</div>
              <div>
                <div className="text-sm font-bold">{post.user}</div>
                <div className="text-[10px] text-muted-foreground">{post.time} · #{post.flair}</div>
              </div>
            </div>
            <h2 className="font-black text-lg mt-3">{post.titleJp}</h2>
            <p className="text-xs text-muted-foreground">{post.titleEn}</p>
            <p className="text-sm mt-3">こんにちは皆さん。最近うちの柴犬の体温が38.8℃と少し高めです。WanCareのセンサーで継続的にモニタリングしていますが、心配です。皆さんならどうしますか？</p>

            <div className="mt-4 bg-sakura-soft border border-sakura rounded-2xl p-3">
              <div className="text-[10px] font-bold text-primary">📡 共有センサーデータ</div>
              <div className="flex justify-between text-xs mt-2">
                <div><div className="font-bold">38.8°C</div><div className="text-[10px] text-muted-foreground">体温</div></div>
                <div><div className="font-bold">2,100歩</div><div className="text-[10px] text-muted-foreground">運動</div></div>
                <div><div className="font-bold">82</div><div className="text-[10px] text-muted-foreground">スコア</div></div>
              </div>
            </div>

            <h3 className="mt-4 text-sm font-bold">💬 コメント ({post.com})</h3>
            <div className="space-y-2 mt-2">
              {[["獣医ヤマダ","少し高めですが正常範囲内です。様子を見てください。"],["柴犬ファン","うちも夏場は同じくらいです！"]].map(([u,c]) => (
                <div key={u} className="bg-card rounded-xl p-3 shadow-soft">
                  <div className="text-[11px] font-bold">{u}</div>
                  <div className="text-xs mt-1">{c}</div>
                </div>
              ))}
            </div>

            <button className="mt-4 w-full bg-primary text-primary-foreground rounded-2xl py-3 font-bold text-sm">🩺 プロに聞く / Ask a Pro Vet</button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
