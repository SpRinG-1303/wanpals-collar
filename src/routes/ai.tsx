import { createFileRoute } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { useState } from "react";
import { Camera, Mic, Send } from "lucide-react";
import { useT, useLanguage } from "@/context/LanguageContext";

export const Route = createFileRoute("/ai")({ component: AI });

type Msg = { from: "user" | "ai"; jp: string; en: string; card?: "health" | "image" };

function AI() {
  const t = useT();
  const { language } = useLanguage();
  const initial: Msg[] = [
    { from: "user", jp: "うちの犬の全体的な健康状態を教えて", en: "Tell me about my dog's overall health" },
    { from: "ai", jp: "ハナちゃんの健康サマリーです 🐕", en: "Here is Hana's health summary 🐕", card: "health" },
  ];
  const [msgs, setMsgs] = useState<Msg[]>(initial);
  const [input, setInput] = useState("");

  const send = (text?: string) => {
    const v = (text ?? input).trim();
    if (!v) return;
    setMsgs((m) => [
      ...m,
      { from: "user", jp: v, en: v },
      { from: "ai", jp: "了解しました！データを確認しています… ハナちゃんは現在とても健康です ✓", en: "Got it! Checking the data… Hana is currently very healthy ✓" },
    ]);
    setInput("");
  };

  const quick: { jp: string; en: string }[] = [
    { jp: "健康確認", en: "Health Check" },
    { jp: "ワクチン", en: "Vaccines" },
    { jp: "近くの獣医", en: "Nearby Vets" },
    { jp: "緊急", en: "Emergency" },
  ];

  const render = (m: Msg) => {
    if (language === "english") return m.en;
    if (language === "japanese") return m.jp;
    return (
      <>
        <span className="block">{m.jp}</span>
        <span className="block text-[0.85em] opacity-70">{m.en}</span>
      </>
    );
  };

  return (
    <AppShell titleJp="🤖 ワンケア AI" titleEn="🤖 WanCare AI">
      <div className="-mt-2 mb-3 bg-card rounded-2xl p-3 shadow-soft flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-warning to-sakura flex items-center justify-center text-2xl">🐕‍🦺</div>
        <div className="flex-1">
          <div className="text-sm font-bold">{t("ワンケアAI", "WanCare AI")} <span className="text-[10px] text-success ml-1">● {t("オンライン", "Online")}</span></div>
          <div className="text-[10px] text-muted-foreground">{t("獣医監修 AI アシスタント", "Vet-supervised AI assistant")}</div>
        </div>
      </div>

      <div className="space-y-3">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-soft ${m.from === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-card rounded-bl-sm"}`}>
              {render(m)}
              {m.card === "health" && (
                <div className="mt-3 bg-background rounded-xl p-3 text-foreground">
                  <div className="flex justify-between items-center">
                    <div className="text-xs font-bold">{t("スコア", "Score")}</div>
                    <div className="text-2xl font-black text-success">87/100 ✓</div>
                  </div>
                  <div className="grid grid-cols-4 gap-1 mt-2">
                    {[80,90,75,85].map((v,j) => (
                      <div key={j}>
                        <div className="h-12 bg-muted rounded relative overflow-hidden"><div className="absolute bottom-0 inset-x-0 bg-success" style={{height:`${v}%`}}/></div>
                        <div className="text-[8px] text-center mt-0.5 text-muted-foreground">
                          {language === "english" ? ["Tmp","Act","Slp","Eat"][j] : ["温","運","睡","食"][j]}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs mt-2 font-bold">{t("全体的に健康です！", "Overall healthy!")}</div>
                  <button className="mt-2 w-full bg-sakura text-primary rounded-lg py-2 text-xs font-bold">📊 {t("フルレポート", "Full Report")} →</button>
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
            <button key={q.en} onClick={() => send(t(q.jp, q.en))} className="shrink-0 bg-sakura-soft border border-sakura text-primary text-xs font-bold px-3 py-1.5 rounded-full">
              {t(q.jp, q.en)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-card rounded-full p-1.5 shadow-card border border-border">
          <button className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"><Camera className="w-4 h-4"/></button>
          <button className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"><Mic className="w-4 h-4"/></button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            className="flex-1 bg-transparent outline-none text-sm px-2"
            placeholder={t("メッセージを入力...", "Type a message...")}
          />
          <button onClick={() => send()} className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center"><Send className="w-4 h-4"/></button>
        </div>
      </div>
    </AppShell>
  );
}
