import { createFileRoute } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { useState } from "react";
import { Camera, Mic, Send } from "lucide-react";

export const Route = createFileRoute("/ai")({ component: AI });

type Msg = { from: "user" | "ai"; text: string; card?: "health" | "image" };

const initial: Msg[] = [
  { from: "user", text: "うちの犬の全体的な健康状態を教えて" },
  { from: "ai", text: "ハナちゃんの健康サマリーです 🐕", card: "health" },
];

const quick = ["健康確認", "ワクチン", "近くの獣医", "緊急"];

function AI() {
  const [msgs, setMsgs] = useState<Msg[]>(initial);
  const [input, setInput] = useState("");
  const send = (t?: string) => {
    const text = (t ?? input).trim();
    if (!text) return;
    setMsgs((m) => [...m, { from: "user", text }, { from: "ai", text: "了解しました！データを確認しています… ハナちゃんは現在とても健康です ✓" }]);
    setInput("");
  };

  return (
    <AppShell title="🤖 ワンケア AI">
      <div className="-mt-2 mb-3 bg-card rounded-2xl p-3 shadow-soft flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-warning to-sakura flex items-center justify-center text-2xl">🐕‍🦺</div>
        <div className="flex-1">
          <div className="text-sm font-bold">ワンケアAI <span className="text-[10px] text-success ml-1">● オンライン</span></div>
          <div className="text-[10px] text-muted-foreground">獣医監修 AI アシスタント</div>
        </div>
      </div>

      <div className="space-y-3">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-soft ${m.from === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-card rounded-bl-sm"}`}>
              {m.text}
              {m.card === "health" && (
                <div className="mt-3 bg-background rounded-xl p-3 text-foreground">
                  <div className="flex justify-between items-center">
                    <div className="text-xs font-bold">スコア</div>
                    <div className="text-2xl font-black text-success">87/100 ✓</div>
                  </div>
                  <div className="grid grid-cols-4 gap-1 mt-2">
                    {[80,90,75,85].map((v,j) => (
                      <div key={j}><div className="h-12 bg-muted rounded relative overflow-hidden"><div className="absolute bottom-0 inset-x-0 bg-success" style={{height:`${v}%`}}/></div><div className="text-[8px] text-center mt-0.5 text-muted-foreground">{["温","運","睡","食"][j]}</div></div>
                    ))}
                  </div>
                  <div className="text-xs mt-2 font-bold">全体的に健康です！</div>
                  <button className="mt-2 w-full bg-sakura text-primary rounded-lg py-2 text-xs font-bold">📊 フルレポート →</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="h-4"/>

      <div className="fixed bottom-16 inset-x-0 max-w-md mx-auto px-4 pb-2 bg-gradient-to-t from-background via-background to-transparent">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {quick.map((q) => (
            <button key={q} onClick={() => send(q)} className="shrink-0 bg-sakura-soft border border-sakura text-primary text-xs font-bold px-3 py-1.5 rounded-full">{q}</button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-card rounded-full p-1.5 shadow-card border border-border">
          <button className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"><Camera className="w-4 h-4"/></button>
          <button className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"><Mic className="w-4 h-4"/></button>
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} className="flex-1 bg-transparent outline-none text-sm px-2" placeholder="メッセージを入力..."/>
          <button onClick={() => send()} className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center"><Send className="w-4 h-4"/></button>
        </div>
      </div>
    </AppShell>
  );
}
