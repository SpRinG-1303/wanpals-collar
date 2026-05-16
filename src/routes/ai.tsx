import { createFileRoute, Link } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { useState, useRef, useEffect } from "react";
import {
  Camera,
  Mic,
  Send,
  Heart,
  Activity,
  MapPin,
  AlertTriangle,
  MoreHorizontal,
  Syringe,
  Thermometer,
  Moon,
  UtensilsCrossed,
  FileHeart,
  ArrowDown,
} from "lucide-react";
import { useT, useLanguage } from "@/context/LanguageContext";
import { usePet } from "@/context/PetContext";
import DogAvatar from "@/components/DogAvatar";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/ai")({ component: AI });

type Msg = {
  id: number;
  from: "user" | "ai";
  jp: string;
  en: string;
  card?: "health";
  time?: string;
};

function nowTime() {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

const QUICK = [
  { jp: "健康確認", en: "Health Check", icon: Heart, color: "#E8829A", bg: "#FFF0F5" },
  { jp: "ワクチン", en: "Vaccines", icon: Syringe, color: "#6BAF92", bg: "#E8F5EE" },
  { jp: "近くの獣医", en: "Find Vet", icon: MapPin, color: "#5B9BD5", bg: "#E8F2FF" },
  { jp: "緊急", en: "Emergency", icon: AlertTriangle, color: "#E53935", bg: "#FFF0F0", pulse: true },
];

const SUGGESTIONS = [
  { jp: "🐾 うちの犬の健康状態を教えて", en: "🐾 Tell me my dog's health status", color: "#E8829A" },
  { jp: "💉 次のワクチンはいつ？", en: "💉 When is the next vaccine?", color: "#6BAF92" },
  { jp: "📍 近くの動物病院を探して", en: "📍 Find nearby animal hospital", color: "#5B9BD5" },
];

// Subtle paw pattern SVG data URL
const PAW_PATTERN =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'><g fill='%23E8829A' fill-opacity='0.025'><circle cx='12' cy='14' r='2.2'/><circle cx='18' cy='10' r='1.6'/><circle cx='8' cy='10' r='1.6'/><circle cx='15' cy='18' r='1.6'/><ellipse cx='13' cy='22' rx='3.6' ry='3'/></g></svg>`,
  );

function AI() {
  const t = useT();
  const { language } = useLanguage();
  const { pet } = usePet();
  const name = pet.name || (language === "japanese" ? "ワンちゃん" : "your dog");

  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: 1,
      from: "user",
      jp: "うちの犬の全体的な健康状態を教えて",
      en: "Tell me about my dog's overall health",
      time: nowTime(),
    },
    {
      id: 2,
      from: "ai",
      jp: `${name}ちゃんの健康サマリーです 🐾`,
      en: `Here's ${name}'s health summary 🐾`,
      card: "health",
      time: nowTime(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [focused, setFocused] = useState(false);
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
          jp: `了解しました！${name}ちゃんのデータを確認しています。現在とても健康です ✓ 🐾`,
          en: `Got it! Checking ${name}'s data — currently very healthy ✓ 🐾`,
          time: nowTime(),
        },
      ]);
    }, 1100);
  };

  const pickText = (m: Msg) => {
    if (language === "english") return m.en;
    if (language === "japanese") return m.jp;
    return null; // mixed handled inline
  };

  return (
    <AppShell hideTopBar noPadding>
      <div
        className="min-h-screen pb-[200px]"
        style={{
          background: `url("${PAW_PATTERN}") repeat, #FAFAF8`,
        }}
      >
        {/* HEADER CARD */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "0 0 24px 24px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
            padding: "16px 20px",
          }}
        >
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div
                className="flex items-center justify-center overflow-hidden"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #F0ECFF, #E8E0FF)",
                  border: "2px solid #C8C0F0",
                  boxShadow: "0 4px 12px rgba(123,104,200,0.2)",
                }}
              >
                <DogAvatar breed="shiba" size={52} ring={false} showCollar={false} eyeStyle="sparkle" />
              </div>
              {/* Online dot */}
              <div
                style={{
                  position: "absolute",
                  right: -2,
                  bottom: -2,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "#6BAF92",
                  border: "2px solid #FFFFFF",
                }}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span style={{ fontSize: 17, fontWeight: 800, color: "#2C2C2C" }}>ワンケアAI</span>
                <span style={{ fontSize: 13, color: "#8A8A8A" }}>WanCare AI</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="relative inline-block" style={{ width: 6, height: 6 }}>
                  <span className="absolute inset-0 rounded-full" style={{ background: "#6BAF92" }} />
                  <span className="absolute inset-0 rounded-full pulse-dot" style={{ background: "#6BAF92" }} />
                </span>
                <span style={{ fontSize: 12, color: "#6BAF92", fontWeight: 600 }}>
                  {t("オンライン", "Online")}
                </span>
                <span style={{ fontSize: 11, color: "#C4B8B4" }}>·</span>
                <span style={{ fontSize: 12, color: "#8A8A8A" }}>{t("獣医監修", "Vet-supervised")}</span>
              </div>
              {/* Capability chips */}
              <div className="flex items-center gap-1 mt-1.5 overflow-x-auto scrollbar-hide">
                {[
                  { jp: "📷 画像分析", en: "📷 Image" },
                  { jp: "📊 健康分析", en: "📊 Health" },
                  { jp: "🗺️ クリニック", en: "🗺️ Clinics" },
                ].map((c, i) => (
                  <span
                    key={i}
                    className="shrink-0"
                    style={{
                      fontSize: 9,
                      background: "#F0ECFF",
                      color: "#7B68C8",
                      padding: "2px 6px",
                      borderRadius: 20,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {language === "english" ? c.en : c.jp}
                  </span>
                ))}
              </div>
            </div>

            <button
              className="shrink-0 flex items-center justify-center"
              style={{ width: 36, height: 36, borderRadius: "50%", background: "#F5F5F5", color: "#8A8A8A" }}
              aria-label="More"
            >
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>

        {/* CHAT */}
        <div ref={scrollRef} className="px-4 pt-3 space-y-3">
          {/* Date divider */}
          <div className="flex items-center justify-center my-3">
            <div
              style={{
                fontSize: 11,
                color: "#E8829A",
                background: "rgba(232,130,154,0.1)",
                border: "1px solid rgba(232,130,154,0.2)",
                padding: "4px 16px",
                borderRadius: 20,
                fontWeight: 600,
              }}
            >
              {t("今日", "Today")}
            </div>
          </div>

          {msgs.length === 0 && (
            <WelcomeState t={t} language={language} onPick={(s) => setInput(s)} />
          )}

          <AnimatePresence initial={false}>
            {msgs.map((m) => {
              const isUser = m.from === "user";
              const txt = pickText(m);
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, x: isUser ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`flex gap-2 ${isUser ? "justify-end" : "justify-start items-end"}`}
                >
                  {!isUser && (
                    <div
                      className="shrink-0 overflow-hidden flex items-center justify-center"
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #F0ECFF, #E8E0FF)",
                        border: "1.5px solid #C8C0F0",
                      }}
                    >
                      <DogAvatar breed="shiba" size={26} ring={false} showCollar={false} />
                    </div>
                  )}

                  <div className={`flex flex-col ${isUser ? "items-end max-w-[75%]" : "items-start max-w-[80%]"}`}>
                    {m.card === "health" ? (
                      <HealthCard t={t} />
                    ) : (
                      <div
                        style={{
                          padding: "12px 16px",
                          borderRadius: isUser ? "20px 20px 4px 20px" : "4px 20px 20px 20px",
                          background: isUser
                            ? "linear-gradient(135deg, #E8829A, #C86882)"
                            : "#FFFFFF",
                          color: isUser ? "#FFFFFF" : "#2C2C2C",
                          fontSize: 15,
                          lineHeight: 1.45,
                          boxShadow: isUser
                            ? "0 4px 12px rgba(232,130,154,0.3)"
                            : "0 2px 12px rgba(0,0,0,0.07)",
                          border: isUser ? "none" : "1px solid #F0ECE8",
                          borderLeft: isUser ? "none" : "3px solid #7B68C8",
                        }}
                      >
                        {txt !== null ? (
                          txt
                        ) : (
                          <>
                            <span className="block">{m.jp}</span>
                            <span
                              className="block mt-0.5"
                              style={{ fontSize: 12, opacity: 0.75 }}
                            >
                              {m.en}
                            </span>
                          </>
                        )}
                      </div>
                    )}

                    <div
                      className={`flex items-center gap-1 mt-1 px-1 ${isUser ? "justify-end" : "justify-start"}`}
                      style={{ fontSize: 10, color: "#C4B8B4" }}
                    >
                      <span>{m.time}</span>
                      {isUser && <span style={{ color: "#6BAF92", fontWeight: 700 }}>✓✓</span>}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {typing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 items-end">
              <div
                className="shrink-0 overflow-hidden"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #F0ECFF, #E8E0FF)",
                  border: "1.5px solid #C8C0F0",
                }}
              >
                <DogAvatar breed="shiba" size={26} ring={false} showCollar={false} />
              </div>
              <div
                className="flex items-center gap-2"
                style={{
                  padding: "12px 16px",
                  borderRadius: "4px 20px 20px 20px",
                  background: "#FFFFFF",
                  border: "1px solid #F0ECE8",
                  borderLeft: "3px solid #7B68C8",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                }}
              >
                <div className="flex items-center gap-1">
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
                <span style={{ fontSize: 10, color: "#8A8A8A", fontStyle: "italic" }}>
                  {t("考え中...", "Thinking...")}
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* COMPOSER (quick chips + input) */}
      <div className="fixed bottom-16 inset-x-0 max-w-md mx-auto z-30">
        {/* Quick chips */}
        <div
          style={{
            background: "#FFFFFF",
            borderTop: "1px solid #F0ECE8",
            padding: "10px 16px",
          }}
        >
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {QUICK.map((q) => {
              const Icon = q.icon;
              return (
                <button
                  key={q.en}
                  onClick={() => send(t(q.jp, q.en))}
                  className={`shrink-0 flex items-center gap-1.5 transition-transform active:scale-95 ${q.pulse ? "pulse-soft" : ""}`}
                  style={{
                    height: 36,
                    border: `1.5px solid ${q.color}`,
                    background: q.bg,
                    color: q.color,
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "0 14px",
                    borderRadius: 20,
                    whiteSpace: "nowrap",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  }}
                >
                  <Icon size={12} strokeWidth={2.5} />
                  {language === "english" ? q.en : q.jp}
                </button>
              );
            })}
          </div>
        </div>

        {/* Input bar */}
        <div
          style={{
            background: "#FFFFFF",
            borderTop: "1px solid #F0ECE8",
            padding: "10px 16px 20px",
            boxShadow: "0 -4px 20px rgba(0,0,0,0.05)",
          }}
        >
          <div className="flex items-center gap-2">
            <button
              className="shrink-0 flex items-center justify-center"
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "#F5F0FF",
                boxShadow: "0 2px 8px rgba(123,104,200,0.15)",
              }}
              aria-label="Camera"
            >
              <Camera size={18} color="#7B68C8" />
            </button>
            <button
              className="shrink-0 flex items-center justify-center"
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "#E8F5EE",
                boxShadow: "0 2px 8px rgba(107,175,146,0.15)",
              }}
              aria-label="Mic"
            >
              <Mic size={18} color="#6BAF92" />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              className="flex-1 outline-none"
              style={{
                height: 44,
                background: "#FAFAF8",
                border: focused ? "1.5px solid #7B68C8" : "1.5px solid #EDE8E4",
                borderRadius: 20,
                padding: "0 16px",
                fontSize: 14,
                color: "#2C2C2C",
                boxShadow: focused ? "0 0 0 3px rgba(123,104,200,0.1)" : "none",
                transition: "all 0.2s",
              }}
              placeholder={t("メッセージを入力...", "Type a message...")}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim()}
              className="shrink-0 flex items-center justify-center transition-all active:scale-90"
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: input.trim()
                  ? "linear-gradient(135deg, #7B68C8, #9B88D8)"
                  : "#C4B8B4",
                color: "#FFFFFF",
                boxShadow: input.trim() ? "0 4px 12px rgba(123,104,200,0.3)" : "none",
              }}
              aria-label="Send"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
        .pulse-soft {
          animation: pulseSoft 2s infinite;
        }
        @keyframes pulseSoft {
          0%, 100% { box-shadow: 0 2px 6px rgba(229,57,53,0.15); }
          50% { box-shadow: 0 2px 14px rgba(229,57,53,0.4); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </AppShell>
  );
}

function WelcomeState({
  t,
  language,
  onPick,
}: {
  t: (jp: string, en: string) => string;
  language: string;
  onPick: (s: string) => void;
}) {
  return (
    <div className="flex flex-col items-center text-center pt-8 pb-4">
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="overflow-hidden flex items-center justify-center mb-4"
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #F0ECFF, #E8E0FF)",
          border: "2px solid #C8C0F0",
          boxShadow: "0 8px 20px rgba(123,104,200,0.2)",
        }}
      >
        <DogAvatar breed="shiba" size={74} ring={false} showCollar={false} eyeStyle="sparkle" />
      </motion.div>
      <div style={{ fontSize: 20, fontWeight: 700, color: "#2C2C2C" }}>{t("こんにちは！", "Hello!")}</div>
      <div style={{ fontSize: 13, color: "#8A8A8A", maxWidth: 250, marginTop: 4 }}>
        {t("ワンケアAIです。何でも聞いてください。", "I'm WanCare AI. Ask me anything!")}
      </div>
      <div className="w-full mt-5 space-y-2">
        {SUGGESTIONS.map((s, i) => (
          <button
            key={i}
            onClick={() => onPick(language === "english" ? s.en : s.jp)}
            className="w-full text-left transition-transform active:scale-[0.98]"
            style={{
              background: "#FFFFFF",
              borderRadius: 16,
              padding: "12px 16px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              borderLeft: `3px solid ${s.color}`,
              fontSize: 13,
              color: "#2C2C2C",
            }}
          >
            {language === "english" ? s.en : s.jp}
          </button>
        ))}
      </div>
    </div>
  );
}

function HealthCard({ t }: { t: (jp: string, en: string) => string }) {
  const metrics = [
    { jp: "体温", en: "Temp", value: "38.5°C", pct: 80, color: "#D4714E", bg: "#FFF0EC", Icon: Thermometer },
    { jp: "運動", en: "Activity", value: "2,340歩", pct: 90, color: "#5B9BD5", bg: "#E8F2FF", Icon: Activity },
    { jp: "睡眠", en: "Sleep", value: "7.5h", pct: 75, color: "#7B68C8", bg: "#F0ECFF", Icon: Moon },
    { jp: "食事", en: "Diet", value: t("良好", "Good"), pct: 85, color: "#D4A843", bg: "#FFF8DC", Icon: UtensilsCrossed },
  ];

  // Simple sparkline points
  const points = [22, 18, 20, 14, 16, 10, 8];
  const path = points
    .map((y, i) => `${i === 0 ? "M" : "L"} ${i * 10} ${y}`)
    .join(" ");

  return (
    <div
      className="w-full"
      style={{
        background: "#FFFFFF",
        borderRadius: 20,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        border: "1px solid #F0ECE8",
        overflow: "hidden",
      }}
    >
      {/* Top strip */}
      <div
        style={{
          height: 6,
          background: "linear-gradient(90deg, #E8829A, #7B68C8, #6BAF92)",
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-1.5">
          <Activity size={16} color="#7B68C8" strokeWidth={2.5} />
          <span style={{ fontSize: 11, color: "#8A8A8A", fontWeight: 700, letterSpacing: "0.08em" }}>
            {t("健康スコア", "HEALTH SCORE")}
          </span>
        </div>
        <span
          style={{
            background: "#E8F5EE",
            border: "1px solid #B8D4C0",
            color: "#6BAF92",
            fontSize: 11,
            fontWeight: 700,
            padding: "3px 10px",
            borderRadius: 20,
          }}
        >
          ✓ {t("良好", "Good")}
        </span>
      </div>

      {/* Score */}
      <div className="flex items-end justify-between px-4 pb-3">
        <div>
          <div style={{ fontSize: 42, fontWeight: 800, color: "#2C2C2C", lineHeight: 1, letterSpacing: "-0.02em" }}>
            87
            <span style={{ fontSize: 18, color: "#8A8A8A", fontWeight: 600 }}>/100</span>
          </div>
          <div style={{ fontSize: 12, color: "#6BAF92", marginTop: 2 }}>
            {t("全体的に健康です", "Overall healthy")}
          </div>
        </div>
        <svg width="60" height="30" viewBox="0 -2 65 30" fill="none">
          <path d={path} stroke="#6BAF92" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="60" cy="8" r="2.5" fill="#6BAF92" />
        </svg>
      </div>

      <div style={{ height: 1, background: "#F5F0EC" }} />

      {/* Sensor grid */}
      <div className="grid grid-cols-2 gap-2 p-3">
        {metrics.map((m, i) => {
          const Icon = m.Icon;
          return (
            <div
              key={i}
              style={{
                background: m.bg,
                borderRadius: 12,
                padding: 10,
                height: 70,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div className="flex items-center gap-1.5">
                <Icon size={14} color={m.color} strokeWidth={2.5} />
                <span style={{ fontSize: 10, color: "#6A6A6A", fontWeight: 600 }}>{t(m.jp, m.en)}</span>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#2C2C2C" }}>{m.value}</div>
                <div
                  className="relative w-full overflow-hidden"
                  style={{ height: 4, borderRadius: 2, background: "rgba(0,0,0,0.08)", marginTop: 4 }}
                >
                  <div
                    style={{
                      width: `${m.pct}%`,
                      height: "100%",
                      background: m.color,
                      borderRadius: 2,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer button */}
      <Link
        to="/report"
        className="flex items-center justify-center gap-1.5 w-full transition-opacity active:opacity-90"
        style={{
          background: "linear-gradient(135deg, #7B68C8, #9B88D8)",
          color: "#FFFFFF",
          height: 40,
          fontSize: 13,
          fontWeight: 700,
          borderRadius: "0 0 20px 20px",
        }}
      >
        <FileHeart size={14} />
        {t("フルレポートを見る", "View Full Report")} →
      </Link>
    </div>
  );
}
