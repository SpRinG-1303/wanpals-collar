import { createFileRoute, Link } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { useState, useRef, useEffect } from "react";
import { Camera, Mic, Send, Sparkles, Stethoscope, Heart, Activity, Calendar, MapPin, AlertTriangle, Plus } from "lucide-react";
import { useT, useLanguage, T } from "@/context/LanguageContext";
import { usePet } from "@/context/PetContext";
import DogAvatar from "@/components/DogAvatar";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/ai")({ component: AI });

type Msg = {
  id: number;
  from: "user" | "ai";
  jp: string;
  en: string;
  card?: "health" | "tip";
  time?: string;
};

const QUICK: { jp: string; en: string; icon: any; color: string; soft: string }[] = [
  { jp: "健康確認", en: "Health Check", icon: Heart, color: "#E8829A", soft: "#FFF0F5" },
  { jp: "ワクチン", en: "Vaccines", icon: Calendar, color: "#7B68C8", soft: "#F0ECFF" },
  { jp: "近くの獣医", en: "Nearby Vets", icon: MapPin, color: "#6BAF92", soft: "#E8F5EE" },
  { jp: "緊急", en: "Emergency", icon: AlertTriangle, color: "#E53935", soft: "#FFECEC" },
];

function nowTime() {
  const d = new Date();
  return `${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}`;
}

function AI() {
  const t = useT();
  const { language } = useLanguage();
  const { pet } = usePet();
  const name = pet.name || (language === "japanese" ? "ワンちゃん" : "your dog");

  const [msgs, setMsgs] = useState<Msg[]>([
    { id: 1, from: "user", jp: "うちの犬の全体的な健康状態を教えて", en: "Tell me about my dog's overall health", time: nowTime() },
    { id: 2, from: "ai", jp: `${name}ちゃんの健康サマリーです 🌸`, en: `Here's ${name}'s health summary 🌸`, card: "health", time: nowTime() },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  const send = (text?: string) => {
    const v = (text ?? input).trim();
    if (!v) return;
    const id = Date.now();
    setMsgs((m) => [...m, { id, from: "user", jp: v, en: v, time: nowTime() }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [
        ...m,
        {
          id: id + 1,
          from: "ai",
          jp: `了解しました！${name}ちゃんのデータを確認しています… 現在とても健康です ✓`,
          en: `Got it! Checking ${name}'s data… currently very healthy ✓`,
          time: nowTime(),
        },
      ]);
    }, 900);
  };

  const renderText = (m: Msg) => {
    if (language === "english") return <span>{m.en}</span>;
    if (language === "japanese") return <span>{m.jp}</span>;
    return (
      <>
        <span className="block">{m.jp}</span>
        <span className="block text-[0.8em] opacity-70 mt-0.5">{m.en}</span>
      </>
    );
  };

  return (
    <AppShell hideTopBar noPadding>
      {/* Subtle sakura pattern background */}
      <div
        className="min-h-screen pb-[180px]"
        style={{
          background:
            "linear-gradient(180deg, #FFF5F8 0%, #F8F5FF 50%, #F5F8FF 100%)",
        }}
      >
        {/* AI Header Banner */}
        <div
          className="relative overflow-hidden"
          style={{
            height: 130,
            background:
              "linear-gradient(135deg, #F0ECFF 0%, #E8E0FF 40%, #EEF0FF 100%)",
            borderRadius: "0 0 28px 28px",
          }}
        >
          {/* Floating sakura petals */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute pointer-events-none"
              style={{
                left: `${15 + i * 18}%`,
                top: -10,
                width: 10,
                height: 10,
                borderRadius: "50% 0 50% 0",
                background: i % 2 === 0 ? "#E8829A" : "#7B68C8",
                opacity: 0.25,
                animation: `petalFall ${6 + i}s ${i * 1.2}s infinite linear`,
              }}
            />
          ))}

          <div className="relative flex items-center gap-3 px-5 pt-5 pb-4 h-full">
            {/* AI Avatar */}
            <div className="relative shrink-0">
              <div
                className="rounded-full flex items-center justify-center"
                style={{
                  width: 68,
                  height: 68,
                  background: "linear-gradient(135deg, #7B68C8 0%, #9B88D8 100%)",
                  boxShadow: "0 8px 24px rgba(123,104,200,0.35)",
                  border: "3px solid #FFFFFF",
                }}
              >
                <div style={{ width: 54, height: 54, borderRadius: "50%", overflow: "hidden", background: "#FFF" }}>
                  <DogAvatar breed="shiba" size={54} ring={false} showCollar={false} eyeStyle="sparkle" />
                </div>
              </div>
              {/* Stethoscope badge */}
              <div
                className="absolute flex items-center justify-center"
                style={{
                  right: -2,
                  bottom: -2,
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "#FFFFFF",
                  boxShadow: "0 2px 8px rgba(123,104,200,0.35)",
                  border: "2px solid #FFFFFF",
                }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{ width: 20, height: 20, borderRadius: "50%", background: "#7B68C8" }}
                >
                  <Stethoscope size={11} color="#FFFFFF" strokeWidth={2.5} />
                </div>
              </div>
            </div>

            {/* Identity */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <h1 style={{ fontSize: 18, fontWeight: 800, color: "#2C2C2C", letterSpacing: "0.01em" }}>
                  {language === "english" ? "WanCare AI" : "ワンケアAI"}
                </h1>
                {language === "mixed" && (
                  <span style={{ fontSize: 11, color: "#8A8A8A", fontWeight: 500 }}>WanCare AI</span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="relative inline-block" style={{ width: 7, height: 7 }}>
                  <span className="absolute inset-0 rounded-full" style={{ background: "#4ADE80" }} />
                  <span className="absolute inset-0 rounded-full pulse-dot" style={{ color: "#4ADE80" }} />
                </span>
                <span style={{ fontSize: 11, color: "#4A8A6A", fontWeight: 600 }}>
                  {t("オンライン", "Online")}
                </span>
                <span style={{ fontSize: 10, color: "#8A8A8A" }}>·</span>
                <span style={{ fontSize: 10, color: "#8A8A8A" }}>
                  {t("獣医監修", "Vet-supervised")}
                </span>
              </div>
            </div>

            {/* New chat */}
            <button
              onClick={() => setMsgs([])}
              className="shrink-0 flex items-center justify-center"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(8px)",
                color: "#7B68C8",
              }}
              aria-label="New chat"
            >
              <Plus size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Chat area */}
        <div ref={scrollRef} className="px-4 pt-4 space-y-4">
          {/* Date divider */}
          <div className="flex items-center justify-center">
            <div
              style={{
                fontSize: 10,
                color: "#9A8F8F",
                background: "rgba(255,255,255,0.7)",
                padding: "4px 12px",
                borderRadius: 12,
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            >
              {t("今日", "Today")}
            </div>
          </div>

          <AnimatePresence initial={false}>
            {msgs.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25 }}
                className={`flex gap-2 ${m.from === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.from === "ai" && (
                  <div
                    className="shrink-0 rounded-full flex items-center justify-center self-end"
                    style={{
                      width: 32,
                      height: 32,
                      background: "linear-gradient(135deg, #7B68C8, #9B88D8)",
                      boxShadow: "0 2px 8px rgba(123,104,200,0.3)",
                      overflow: "hidden",
                    }}
                  >
                    <DogAvatar breed="shiba" size={28} ring={false} showCollar={false} />
                  </div>
                )}

                <div className={`max-w-[78%] flex flex-col ${m.from === "user" ? "items-end" : "items-start"}`}>
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: m.from === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                      background:
                        m.from === "user"
                          ? "linear-gradient(135deg, #E8829A 0%, #F4A6B8 100%)"
                          : "#FFFFFF",
                      color: m.from === "user" ? "#FFFFFF" : "#2C2C2C",
                      fontSize: 14,
                      lineHeight: 1.5,
                      boxShadow:
                        m.from === "user"
                          ? "0 4px 12px rgba(232,130,154,0.25)"
                          : "0 2px 12px rgba(180,150,140,0.10)",
                      border: m.from === "ai" ? "1px solid #F0ECE8" : "none",
                    }}
                  >
                    {renderText(m)}
                  </div>

                  {m.card === "health" && <HealthCard t={t} />}

                  <span style={{ fontSize: 10, color: "#B0A8A4", marginTop: 4, padding: "0 4px" }}>
                    {m.time}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {typing && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2 justify-start"
            >
              <div
                className="shrink-0 rounded-full self-end overflow-hidden"
                style={{
                  width: 32,
                  height: 32,
                  background: "linear-gradient(135deg, #7B68C8, #9B88D8)",
                  boxShadow: "0 2px 8px rgba(123,104,200,0.3)",
                }}
              >
                <DogAvatar breed="shiba" size={28} ring={false} showCollar={false} />
              </div>
              <div
                className="flex items-center gap-1"
                style={{
                  padding: "12px 16px",
                  borderRadius: "20px 20px 20px 4px",
                  background: "#FFFFFF",
                  border: "1px solid #F0ECE8",
                  boxShadow: "0 2px 12px rgba(180,150,140,0.10)",
                }}
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="block rounded-full"
                    style={{
                      width: 6,
                      height: 6,
                      background: "#7B68C8",
                      animation: `typingBounce 1.2s ${i * 0.15}s infinite ease-in-out`,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Sticky composer */}
      <div
        className="fixed bottom-16 inset-x-0 max-w-md mx-auto px-3 pt-3 pb-3 z-30"
        style={{
          background: "linear-gradient(180deg, rgba(248,245,255,0) 0%, rgba(248,245,255,0.95) 30%, #F8F5FF 100%)",
        }}
      >
        {/* Quick reply chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 px-1">
          {QUICK.map((q) => {
            const Icon = q.icon;
            return (
              <button
                key={q.en}
                onClick={() => send(t(q.jp, q.en))}
                className="shrink-0 flex items-center gap-1.5 transition-transform active:scale-95"
                style={{
                  background: "#FFFFFF",
                  border: `1.5px solid ${q.color}33`,
                  color: q.color,
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "7px 14px",
                  borderRadius: 999,
                  boxShadow: `0 2px 8px ${q.color}1F`,
                }}
              >
                <Icon size={13} strokeWidth={2.5} />
                {t(q.jp, q.en)}
              </button>
            );
          })}
        </div>

        {/* Composer */}
        <div
          className="flex items-center gap-2 mt-1"
          style={{
            background: "#FFFFFF",
            borderRadius: 28,
            padding: "6px 6px 6px 8px",
            boxShadow: "0 8px 24px rgba(123,104,200,0.12), 0 2px 8px rgba(0,0,0,0.04)",
            border: "1px solid #EEE8F5",
          }}
        >
          <button
            className="flex items-center justify-center shrink-0"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#F5F0FA",
              color: "#7B68C8",
            }}
            aria-label="Camera"
          >
            <Camera size={17} strokeWidth={2} />
          </button>
          <button
            className="flex items-center justify-center shrink-0"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#F5F0FA",
              color: "#7B68C8",
            }}
            aria-label="Mic"
          >
            <Mic size={17} strokeWidth={2} />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            className="flex-1 bg-transparent outline-none px-1"
            style={{ fontSize: 14, color: "#2C2C2C" }}
            placeholder={t("メッセージを入力...", "Type a message...")}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim()}
            className="flex items-center justify-center shrink-0 transition-transform active:scale-90 disabled:opacity-50"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: input.trim()
                ? "linear-gradient(135deg, #E8829A 0%, #7B68C8 100%)"
                : "#D8D2E0",
              color: "#FFFFFF",
              boxShadow: input.trim() ? "0 4px 14px rgba(232,130,154,0.4)" : "none",
            }}
            aria-label="Send"
          >
            <Send size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </AppShell>
  );
}

function HealthCard({ t }: { t: (jp: string, en: string) => string }) {
  const metrics = [
    { jp: "体温", en: "Temp", value: 80, color: "#E8829A", icon: "🌡️" },
    { jp: "運動", en: "Activity", value: 90, color: "#6BAF92", icon: "🏃" },
    { jp: "睡眠", en: "Sleep", value: 75, color: "#7B68C8", icon: "🌙" },
    { jp: "食事", en: "Diet", value: 85, color: "#F2C96E", icon: "🍱" },
  ];
  return (
    <div
      className="mt-2 w-full"
      style={{
        background: "#FFFFFF",
        borderRadius: 20,
        padding: 14,
        border: "1px solid #F0ECE8",
        boxShadow: "0 4px 16px rgba(123,104,200,0.10)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Top accent strip */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "linear-gradient(90deg, #E8829A 0%, #7B68C8 50%, #6BAF92 100%)",
        }}
      />

      <div className="flex items-center justify-between mb-3 mt-1">
        <div className="flex items-center gap-1.5">
          <Sparkles size={14} color="#7B68C8" strokeWidth={2.5} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#7B68C8", letterSpacing: "0.05em" }}>
            {t("健康スコア", "HEALTH SCORE")}
          </span>
        </div>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: "#4A8A6A",
            background: "#E8F5EE",
            padding: "2px 8px",
            borderRadius: 8,
          }}
        >
          ✓ {t("良好", "Good")}
        </span>
      </div>

      <div className="flex items-end justify-between mb-3">
        <div>
          <div style={{ fontSize: 36, fontWeight: 900, color: "#2C2C2C", lineHeight: 1, letterSpacing: "-0.02em" }}>
            87
            <span style={{ fontSize: 16, color: "#9A8F8F", fontWeight: 600 }}>/100</span>
          </div>
          <div style={{ fontSize: 11, color: "#8A8A8A", marginTop: 2 }}>
            {t("全体的に健康です", "Overall healthy")}
          </div>
        </div>
        <Activity size={28} color="#6BAF92" strokeWidth={2} />
      </div>

      <div className="grid grid-cols-4 gap-2 mb-3">
        {metrics.map((m, j) => (
          <div key={j} className="flex flex-col items-center">
            <div
              className="relative w-full overflow-hidden"
              style={{ height: 48, background: `${m.color}15`, borderRadius: 10 }}
            >
              <div
                className="absolute bottom-0 inset-x-0 transition-all"
                style={{
                  height: `${m.value}%`,
                  background: `linear-gradient(180deg, ${m.color}CC 0%, ${m.color} 100%)`,
                  borderRadius: "8px 8px 10px 10px",
                }}
              />
              <span
                className="absolute top-1 left-1/2 -translate-x-1/2"
                style={{ fontSize: 11 }}
              >
                {m.icon}
              </span>
            </div>
            <div style={{ fontSize: 9, color: "#6A6A6A", marginTop: 4, fontWeight: 600 }}>
              {t(m.jp, m.en)}
            </div>
            <div style={{ fontSize: 9, color: m.color, fontWeight: 700 }}>{m.value}%</div>
          </div>
        ))}
      </div>

      <Link
        to="/report"
        className="flex items-center justify-center gap-1.5 w-full transition-transform active:scale-[0.98]"
        style={{
          background: "linear-gradient(135deg, #E8829A 0%, #7B68C8 100%)",
          color: "#FFFFFF",
          padding: "10px 14px",
          borderRadius: 14,
          fontSize: 12,
          fontWeight: 700,
          boxShadow: "0 4px 12px rgba(232,130,154,0.3)",
        }}
      >
        <Heart size={13} strokeWidth={2.5} />
        {t("フルレポートを見る", "View Full Report")}
        <span style={{ marginLeft: 2 }}>→</span>
      </Link>
    </div>
  );
}
