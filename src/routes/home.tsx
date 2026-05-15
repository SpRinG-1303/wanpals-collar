import { createFileRoute, Link } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { useEffect, useState, type ReactNode } from "react";
import { DAILY_FACTS } from "@/lib/mock";
import {
  Brain, Microscope, Activity, Thermometer, MapPin, Wind, Sun, GitMerge,
  Check, BatteryMedium, Signal, Bluetooth, PawPrint, type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { T, useT, useLanguage } from "@/context/LanguageContext";

export const Route = createFileRoute("/home")({ component: Home });

type Dot = "rose" | "sage" | "lavender" | "red";
type Sensor = {
  Icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  jp: string; en: string;
  subJp: string; subEn: string;
  subColor?: string;
  valJp: string; valEn: string;
  dot: Dot;
  ml?: boolean;
  progress?: number;
  progressColor?: string;
  noteJp?: string; noteEn?: string;
  noteColor?: string;
};

const sensors: Sensor[] = [
  { Icon: Brain, iconBg: "#F5EEFF", iconColor: "#9B72CF", jp: "吠え分析", en: "BarkSense AI", subJp: "鳴き声解析", subEn: "Bark Analysis", valJp: "穏やか", valEn: "Calm", dot: "sage", ml: true },
  { Icon: Microscope, iconBg: "#FEEAF0", iconColor: "#D4708A", jp: "皮膚センサー", en: "SkinSense AI", subJp: "皮膚の健康", subEn: "Skin Health", valJp: "正常", valEn: "Normal", dot: "sage", ml: true },
  { Icon: Activity, iconBg: "#EAF4F0", iconColor: "#6BAE9A", jp: "運動センサー", en: "MotionSense", subJp: "活動量", subEn: "Activity Track", valJp: "2,340歩", valEn: "2,340 steps", dot: "sage", progress: 65, progressColor: "#B8D4C8" },
  { Icon: Thermometer, iconBg: "#FEF0EC", iconColor: "#E8956D", jp: "体温センサー", en: "TempSense AI", subJp: "体温", subEn: "Body Temp", valJp: "38.5°C 正常", valEn: "38.5°C Normal", dot: "sage", noteJp: "正常範囲", noteEn: "Normal Range" },
  { Icon: MapPin, iconBg: "#EAF4F0", iconColor: "#6BAE9A", jp: "位置センサー", en: "LocationSense", subJp: "GPS + 地図", subEn: "GPS + Map", valJp: "渋谷区, 東京", valEn: "Shibuya, Tokyo", dot: "lavender" },
  { Icon: Wind, iconBg: "#EFF8F6", iconColor: "#6BAE9A", jp: "圧力センサー", en: "PressureSense", subJp: "圧力データ", subEn: "Pressure Data", subColor: "#E8956D", valJp: "正常範囲", valEn: "Normal Range", dot: "sage", noteJp: "圧力データ", noteEn: "Pressure Data", noteColor: "#E8956D" },
  { Icon: Sun, iconBg: "#FEF9EC", iconColor: "#D4A843", jp: "光センサー", en: "LightSense AI", subJp: "RGB光データ", subEn: "RGB Light Data", valJp: "室内", valEn: "Indoor", dot: "sage" },
  { Icon: GitMerge, iconBg: "#F0EDF8", iconColor: "#9B72CF", jp: "総合分析", en: "CombineSense", subJp: "総合解析", subEn: "Combined Analysis", valJp: "87/100", valEn: "87/100", dot: "sage" },
];

const DOT_COLOR: Record<Dot, string> = {
  rose: "#E8A598",
  sage: "#6BAE9A",
  lavender: "#D4C5E2",
  red: "#EF4444",
};

type TimeBand = "morning" | "afternoon" | "evening" | "night";
function getTimeBand(): TimeBand {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "morning";
  if (h >= 12 && h < 18) return "afternoon";
  if (h >= 18 && h < 22) return "evening";
  return "night";
}

const BAND_GRADIENT: Record<TimeBand, string> = {
  morning: "linear-gradient(180deg,#FFF5F7 0%,#FFE8EE 40%,#E8F4F0 100%)",
  afternoon: "linear-gradient(180deg,#E8F4FC 0%,#C8E6F0 50%,#D4E8D0 100%)",
  evening: "linear-gradient(180deg,#FFE4CC 0%,#FFCBA4 40%,#E8A598 100%)",
  night: "linear-gradient(180deg,#1A2440 0%,#2C3E6B 50%,#1E3A5F 100%)",
};

function FujiScene({ band }: { band: TimeBand }) {
  const fujiBody =
    band === "morning" ? "#B8CDD9" :
    band === "afternoon" ? "#8FB5C8" :
    band === "evening" ? "#6B8A9A" : "#0F1E35";
  const sunColor =
    band === "morning" ? "#FFB7C5" :
    band === "afternoon" ? "#F2C96E" :
    band === "evening" ? "#F4A623" : "#FFF8E7";
  const sunSize = band === "evening" ? 56 : 32;
  const sunBottom = band === "evening" ? 70 : undefined;
  const sunTop = band === "evening" ? undefined : 22;
  const lakeColor =
    band === "morning" ? "#C8E6E0" :
    band === "afternoon" ? "#B8D8E0" :
    band === "evening" ? "#9B7A8A" : "#16264A";
  const blossomA = band === "night" ? "#FFE4EC" : "#FFB7C5";
  const blossomB = band === "night" ? "#FFE4EC" : "#FFC8D0";
  const blossomOpacity = band === "night" ? 0.55 : 0.95;
  const trunkColor = band === "night" ? "#3A2A24" : "#8B6F5E";
  const dogColor = band === "night" ? "#A0795A" : "#E8956D";

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: 24, background: BAND_GRADIENT[band] }}>
      {/* Sun / Moon */}
      {band === "night" ? (
        <div className="absolute" style={{ top: 18, right: 90 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: sunColor, boxShadow: `inset -10px 2px 0 0 ${BAND_GRADIENT[band].includes("1A2440") ? "#1A2440" : "#1E3A5F"}` }} />
        </div>
      ) : (
        <div className="absolute" style={{ top: sunTop, bottom: sunBottom, right: 90, width: sunSize, height: sunSize, borderRadius: "50%", background: sunColor, opacity: 0.85, filter: band === "evening" ? "blur(0.5px)" : "none" }} />
      )}

      {/* Stars (night only) */}
      {band === "night" && [[20,18],[58,30],[110,14],[160,40],[210,22],[260,12],[300,34],[330,48],[80,52],[240,52]].map(([l,t],i)=>(
        <div key={i} className="absolute rounded-full bg-white" style={{ left: l, top: t, width: i%3===0?2.5:1.5, height: i%3===0?2.5:1.5, opacity: 0.85 }}/>
      ))}

      {/* Clouds (afternoon only) */}
      {band === "afternoon" && [[40,28,46],[180,18,40],[260,40,52]].map(([l,t,w],i)=>(
        <div key={i} className="absolute rounded-full bg-white/80" style={{ left:l, top:t, width:w, height:(w as number)*0.45 }}/>
      ))}

      {/* Mount Fuji */}
      <svg className="absolute" style={{ right: 30, bottom: 20, width: 140, height: 95 }} viewBox="0 0 140 95" fill="none">
        {/* base mist */}
        <ellipse cx="70" cy="88" rx="70" ry="6" fill="#FFFFFF" opacity={band === "night" ? 0.08 : 0.5} />
        {/* fuji body */}
        <path d="M70 8 L130 88 L10 88 Z" fill={fujiBody} />
        {/* snow cap */}
        <path d="M70 8 L88 32 Q70 24 52 32 Z" fill="#FFFFFF" opacity={band === "night" ? 0.7 : 0.95} />
        {/* snow drips */}
        <path d="M58 32 L62 42 L66 32 Z M74 32 L78 44 L82 32 Z" fill="#FFFFFF" opacity={band === "night" ? 0.5 : 0.9} />
      </svg>

      {/* Lake */}
      <svg className="absolute bottom-0 inset-x-0" viewBox="0 0 360 22" preserveAspectRatio="none" style={{ height: 22, width: "100%" }}>
        <path d="M0 6 Q60 0 120 5 T240 5 T360 4 L360 22 L0 22 Z" fill={lakeColor} opacity={band === "night" ? 0.85 : 1}/>
        <path d="M0 10 Q60 6 120 9 T240 9 T360 8" stroke="#FFFFFF" strokeWidth="0.6" fill="none" opacity={band === "night" ? 0.15 : 0.4}/>
      </svg>

      {/* Cherry blossom tree (left) */}
      <div className="absolute" style={{ left: 14, bottom: 18, width: 80, height: 110 }}>
        {/* trunk */}
        <div style={{ position: "absolute", bottom: 0, left: 18, width: 4, height: 60, background: trunkColor, borderRadius: 2, transform: "rotate(-6deg)", transformOrigin: "bottom" }} />
        {/* branches */}
        <div style={{ position: "absolute", bottom: 38, left: 20, width: 30, height: 2, background: trunkColor, borderRadius: 2, transform: "rotate(-25deg)", transformOrigin: "left" }} />
        <div style={{ position: "absolute", bottom: 52, left: 22, width: 24, height: 2, background: trunkColor, borderRadius: 2, transform: "rotate(-50deg)", transformOrigin: "left" }} />
        <div style={{ position: "absolute", bottom: 28, left: 18, width: 22, height: 2, background: trunkColor, borderRadius: 2, transform: "rotate(-8deg)", transformOrigin: "left" }} />
        {/* blossoms */}
        {[
          [42, 8, 14, blossomA], [54, 18, 11, blossomB], [60, 6, 10, blossomA],
          [38, 26, 12, blossomB], [50, 32, 13, blossomA], [28, 14, 9, blossomB],
          [46, 44, 10, blossomA], [62, 30, 9, blossomB], [34, 40, 11, blossomA],
          [22, 28, 8, blossomB], [56, 54, 9, blossomA],
        ].map(([l,t,s,c],i)=>(
          <div key={i} className="absolute rounded-full" style={{ left: l as number, top: t as number, width: s as number, height: s as number, background: c as string, opacity: blossomOpacity }}/>
        ))}
      </div>

      {/* Falling petals */}
      {!band.includes("night") && [
        { left: 110, delay: "0s", dur: "7s" },
        { left: 180, delay: "2s", dur: "6s" },
        { left: 240, delay: "4s", dur: "8s" },
        { left: 80, delay: "1s", dur: "9s" },
      ].map((p,i)=>(
        <div key={i} className="absolute rounded-full" style={{
          left: p.left, top: -8, width: 6, height: 5,
          background: "#FFB7C5", opacity: 0.7,
          animation: `petalFall ${p.dur} linear ${p.delay} infinite`,
          transform: `rotate(${(i*23)%30 - 15}deg)`,
        }}/>
      ))}

      {/* Shiba inu silhouette (bottom-left) */}
      <div className="absolute" style={{ bottom: 26, left: 96 }}>
        {band === "night" ? (
          // sleeping curl
          <div style={{ width: 34, height: 14, background: dogColor, borderRadius: "50%", opacity: 0.95 }} />
        ) : (
          <div style={{ width: 24, height: 18, background: dogColor, borderRadius: "55% 55% 45% 45%", position: "relative" }}>
            {/* head */}
            <div style={{ position: "absolute", top: -8, left: -2, width: 14, height: 14, background: dogColor, borderRadius: "50%" }}>
              {/* ears */}
              <div style={{ position: "absolute", top: -3, left: 0, width: 5, height: 7, background: dogColor, clipPath: "polygon(50% 0,100% 100%,0 100%)" }} />
              <div style={{ position: "absolute", top: -3, right: 0, width: 5, height: 7, background: dogColor, clipPath: "polygon(50% 0,100% 100%,0 100%)" }} />
              {/* eye */}
              <div style={{ position: "absolute", top: 6, left: 4, width: 2, height: 2, background: "#2D2D2D", borderRadius: "50%" }} />
            </div>
            {/* tail */}
            <div style={{ position: "absolute", top: -2, right: -4, width: 8, height: 8, border: `2px solid ${dogColor}`, borderRadius: "50%", borderLeftColor: "transparent", borderBottomColor: "transparent" }} />
          </div>
        )}
      </div>

      {/* Sakura branch watermark (top-right corner) */}
      <svg className="absolute" style={{ top: 6, right: 6, width: 60, height: 40, opacity: 0.18 }} viewBox="0 0 60 40" fill="#FFB7C5">
        <path d="M2 38 Q20 20 56 4" stroke="#FFB7C5" strokeWidth="1" fill="none"/>
        <circle cx="14" cy="28" r="3"/><circle cx="22" cy="22" r="2.5"/><circle cx="32" cy="16" r="3"/>
        <circle cx="42" cy="10" r="2.5"/><circle cx="50" cy="6" r="3"/>
      </svg>
    </div>
  );
}

function JapanHeroCard({ score }: { score: number }) {
  const t = useT();
  const band = getTimeBand();
  const greetJp = band === "morning" ? "おはよう、ハナ! 🐾"
    : band === "afternoon" ? "こんにちは、ハナ! 🐾"
    : band === "evening" ? "こんばんは、ハナ! 🐾"
    : "おやすみ、ハナ! 🌙";
  const greetEn = band === "morning" ? "Good Morning, Hana! 🐾"
    : band === "afternoon" ? "Good Afternoon, Hana! 🐾"
    : band === "evening" ? "Good Evening, Hana! 🐾"
    : "Good Night, Hana! 🌙";
  const moodJp = score >= 87 ? "ハナは今日とっても元気"
    : score >= 60 ? "ハナは今日まずまずです"
    : "ハナに注意が必要です";
  const moodEn = score >= 87 ? "Hana is feeling great today"
    : score >= 60 ? "Hana is doing okay today"
    : "Hana needs attention today";

  const textColor = band === "night" ? "#F5F0E8" : "#2D2D2D";
  const subColor = band === "night" ? "rgba(245,240,232,0.75)" : "#9A8F8F";

  return (
    <div
      className="relative"
      style={{
        margin: "12px 16px",
        height: 180,
        borderRadius: 24,
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(180,150,140,0.18)",
      }}
    >
      <FujiScene band={band} />

      {/* Greeting (bottom-left) */}
      <div className="absolute" style={{ left: 16, bottom: 14, maxWidth: "65%" }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: textColor, lineHeight: 1.15 }}>
          {t(greetJp, greetEn)}
        </div>
        <div style={{ fontSize: 12, color: subColor, marginTop: 4 }}>
          {t(moodJp, moodEn)}
        </div>
      </div>

      {/* Health chip (bottom-right) */}
      <div className="absolute" style={{ right: 12, bottom: 14 }}>
        <div style={{
          background: "rgba(255,255,255,0.85)",
          color: "#E8A598",
          fontSize: 11, fontWeight: 700,
          borderRadius: 20, padding: "4px 10px",
          backdropFilter: "blur(4px)",
        }}>
          {score}/100 ✨
        </div>
      </div>
    </div>
  );
}

function Home() {
  const [factIdx, setFactIdx] = useState(0);
  const [sosOpen, setSosOpen] = useState(false);
  const t = useT();
  const { language } = useLanguage();
  useEffect(() => {
    const tm = setInterval(() => setFactIdx((i) => (i + 1) % DAILY_FACTS.length), 10000);
    return () => clearInterval(tm);
  }, []);
  const fact = DAILY_FACTS[factIdx];
  const score = 87;

  return (
    <AppShell titleJp="" titleEn="" noPadding>
      {/* Falling petals keyframes */}
      <style>{`
        @keyframes petalFall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 0; }
          15% { opacity: 0.7; }
          100% { transform: translateY(190px) rotate(180deg); opacity: 0; }
        }
      `}</style>

      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        <div className="absolute rounded-full" style={{ top: -40, right: -40, width: 220, height: 220, background: "#FFB7C5", opacity: 0.04 }}/>
        <div className="absolute rounded-full" style={{ bottom: 200, left: -60, width: 240, height: 240, background: "#B8D4C8", opacity: 0.04 }}/>
      </div>

      <JapanHeroCard score={score} />

      {sosOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4" onClick={() => setSosOpen(false)}>
          <motion.div
            initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="bg-card rounded-2xl p-6 w-full max-w-sm shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-destructive">🆘 <T jp="緊急" en="Emergency"/></h3>
            <p className="text-sm text-muted-foreground mt-1">{t("最寄りの24時間獣医に連絡します", "Contact the nearest 24h vet")}</p>
            <div className="mt-4 space-y-2">
              <button className="w-full bg-destructive text-destructive-foreground rounded-xl py-3 font-bold">📞 {t("今すぐ電話", "Call Now")}</button>
              <button className="w-full bg-muted rounded-xl py-3 font-medium">📍 {t("迷子モードを起動", "Activate Lost Mode")}</button>
              <button onClick={() => setSosOpen(false)} className="w-full text-sm text-muted-foreground py-2">{t("キャンセル", "Cancel")}</button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="px-4">
      {/* Hero profile */}
      <Section>
        <div className="bg-card rounded-[20px] p-4 shadow-card flex gap-4 items-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl" style={{ background: "linear-gradient(135deg,#FDE2DC,#FFD6CB)", boxShadow: "0 0 0 3px #E8A598" }}>🐕</div>
            <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full" style={{ background: "#6BAE9A", border: "2px solid #fff" }}/>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-base" style={{ color: "#2D2D2D" }}>{t("ハナ", "Hana")}</div>
            <div className="flex gap-1 mt-1 flex-wrap">
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: "#B8D4C8", color: "#2F5D4A" }}>{t("柴犬", "Shiba Inu")}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "#F0E8E5", color: "#7A6F6F" }}>{t("3歳", "3 yrs")}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: "#D4F0E0", color: "#2F7A5A" }}>● {t("接続済", "Connected")}</span>
            </div>
            <div className="flex gap-3 mt-2">
              <button className="text-[11px] font-bold" style={{ color: "#E8A598" }}>{t("プロフィール編集", "Edit Profile")} →</button>
              <button className="text-[11px] font-bold" style={{ color: "#9B72CF" }}>+ {t("ペット追加", "Add Pet")}</button>
            </div>
          </div>
        </div>
      </Section>

      {/* Daily fact */}
      <motion.div key={factIdx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="mt-3 rounded-[20px] overflow-hidden flex"
        style={{ background: "#FEF3C7", boxShadow: "0 4px 16px rgba(180,150,140,0.12)" }}
      >
        <div style={{ width: 4, background: "#F2C96E" }} />
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: "#92400E" }}>
              <PawPrint className="w-3.5 h-3.5" style={{ color: "#D4A843" }} /> {t("今日の豆知識", "Daily Dog Fact")}
            </div>
            <span className="text-[10px] font-bold" style={{ color: "#D4A843" }}>#{1247 + factIdx}</span>
          </div>
          <div className="mt-1 text-sm font-bold" style={{ color: "#451A03" }}>
            {language === "english" ? fact.en : fact.jp}
          </div>
          {language === "mixed" && <div className="text-xs mt-0.5" style={{ color: "#92400E", opacity: .8 }}>{fact.en}</div>}
        </div>
      </motion.div>

      {/* Health score */}
      <div className="mt-3 bg-card rounded-[20px] p-5 shadow-card flex items-center gap-4">
        <ScoreRing value={score} />
        <div className="flex-1">
          <T jp="総合健康スコア" en="Overall Health Score" className="text-sm font-bold" as="div" />
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            <span className="relative w-2 h-2"><span className="absolute inset-0 rounded-full" style={{ background: "#E8A598" }}/><span className="absolute inset-0 rounded-full animate-ping" style={{ background: "#E8A598" }}/></span>
            <span className="font-bold" style={{ color: "#E8A598" }}>LIVE</span>
            <span className="text-muted-foreground">· {t("全センサー稼働中", "All sensors active")}</span>
          </div>
        </div>
      </div>

      {/* Collar Status */}
      <div className="mt-3 bg-card rounded-[20px]" style={{ padding: 20, boxShadow: "0 4px 16px rgba(180,150,140,0.12)" }}>
        <T jp="カラーステータス" en="Collar Status" className="block text-[18px] font-bold mb-4" as="div" />

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#D4F0E0" }}>
            <Check size={20} style={{ color: "#6BAE9A" }} strokeWidth={3} />
          </div>
          <div className="flex-1">
            <div className="text-[15px] font-semibold" style={{ color: "#2D2D2D" }}>{t("接続済み", "Connected")}</div>
            <div className="text-[12px] text-muted-foreground">{t("最終同期: 2分前", "Last sync: 2 minutes ago")}</div>
          </div>
        </div>

        <div className="my-5 h-px" style={{ background: "#F0E8E5" }} />

        <div className="flex items-center justify-between mb-[14px]">
          <div className="flex items-center" style={{ gap: 6 }}>
            <BatteryMedium size={18} style={{ color: "#9A8F8F" }} />
            <span className="text-[14px] font-medium text-muted-foreground">{t("バッテリー", "Battery")}</span>
          </div>
          <div className="flex items-center">
            <div className="rounded-[4px] overflow-hidden" style={{ width: 120, height: 8, background: "#F0E8E5" }}>
              <div className="h-full rounded-[4px]" style={{ width: "87%", background: "#B8D4C8" }} />
            </div>
            <span className="ml-2 text-[14px] font-semibold" style={{ color: "#2D2D2D" }}>87%</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center" style={{ gap: 6 }}>
            <Signal size={18} style={{ color: "#E8A598" }} />
            <span className="text-[14px] font-medium" style={{ color: "#E8A598" }}>{t("信号強度", "Signal Strength")}</span>
          </div>
          <div className="flex items-center">
            <div className="flex items-end" style={{ gap: 3 }}>
              {[6, 10, 14, 18].map((h) => (
                <div key={h} className="rounded-[2px]" style={{ width: 4, height: h, background: "#E8A598" }} />
              ))}
            </div>
            <span className="ml-2 text-[14px] font-semibold" style={{ color: "#2D2D2D" }}>{t("優秀", "Excellent")}</span>
          </div>
        </div>

        <button
          className="w-full flex items-center justify-center gap-2 rounded-[12px] font-semibold transition-colors"
          style={{ background: "#FDF0EE", color: "#E8A598", height: 48, fontSize: 15 }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#FBE3DF")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#FDF0EE")}
        >
          <Bluetooth size={18} style={{ color: "#E8A598" }} />
          <span>{t("カラーを接続", "Connect Collar")}</span>
        </button>
      </div>

      {/* Sensors grid */}
      <div className="mt-5 mb-2 flex items-center gap-2">
        <h2 className="text-[18px] font-semibold" style={{ color: "#2D2D2D" }}>🤖 {t("AI センサー", "AI Sensors")}</h2>
        <span className="text-[11px] font-bold rounded-full text-white" style={{ background: "#E8A598", padding: "2px 8px" }}>8 active</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {sensors.map((s) => {
          const Icon = s.Icon;
          return (
            <Link
              to="/report"
              key={s.en}
              className="relative bg-card rounded-2xl p-4 flex flex-col"
              style={{ boxShadow: "0 4px 16px rgba(180,150,140,0.12)" }}
            >
              {s.ml && (
                <span
                  className="absolute top-2 right-2 text-white font-bold rounded-full"
                  style={{ fontSize: 10, padding: "3px 8px",
                    background: "linear-gradient(135deg,#C084FC,#E8A598)",
                    boxShadow: "0 2px 4px rgba(192,132,252,0.3)" }}
                >
                  ML Training
                </span>
              )}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: s.iconBg }}>
                <Icon size={24} style={{ color: s.iconColor }} />
              </div>
              <T jp={s.jp} en={s.en} className="mt-3 text-[15px] font-semibold leading-tight" as="div" />
              <T jp={s.subJp} en={s.subEn} className="text-[12px] leading-tight mt-0.5" as="div" />
              <div className="mt-2 flex items-center justify-between gap-2">
                <div className="text-[16px] font-bold leading-tight" style={{ color: "#2D2D2D" }}>{t(s.valJp, s.valEn)}</div>
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${s.dot === "sage" || s.dot === "rose" ? "animate-pulse" : ""}`}
                  style={{ background: DOT_COLOR[s.dot] }}
                />
              </div>
              {s.noteJp && (
                <div className="text-[11px] mt-1" style={{ color: s.noteColor ?? "#9A8F8F" }}>
                  {t(s.noteJp, s.noteEn!)}
                </div>
              )}
              {s.progress !== undefined && (
                <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: "#F0E8E5" }}>
                  <div className="h-full rounded-full" style={{ width: `${s.progress}%`, background: s.progressColor ?? "#B8D4C8" }}/>
                </div>
              )}
              {s.ml && (
                <button
                  onClick={(e) => { e.preventDefault(); }}
                  className="mt-3 w-full rounded-lg text-[13px] font-medium transition-colors"
                  style={{ background: "#F5EFEC", color: "#9A8F8F", height: 34 }}
                >
                  {t("モデルを学習", "Train Model")}
                </button>
              )}
            </Link>
          );
        })}
      </div>

      <div className="mt-4 mb-4 grid grid-cols-2 gap-3">
        <Link to="/report" className="rounded-full flex items-center justify-center text-[14px] font-bold gap-2"
          style={{ background: "#2D2D2D", color: "#fff", height: 52 }}>
          📊 {t("健康レポート", "Health Report")}
        </Link>
        <Link to="/breeds" className="rounded-full flex items-center justify-center text-[14px] font-bold gap-2"
          style={{ background: "#F5EEFF", color: "#9B72CF", height: 52 }}>
          📚 {t("犬種図鑑", "Breeds")}
        </Link>
      </div>
      </div>
    </AppShell>
  );
}

function Section({ children }: { children: ReactNode }) { return <>{children}</>; }

function ScoreRing({ value }: { value: number }) {
  const r = 36, c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <div className="relative w-24 h-24">
      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
        <defs>
          <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E8A598" />
            <stop offset="100%" stopColor="#F2C96E" />
          </linearGradient>
        </defs>
        <circle cx="40" cy="40" r={r} stroke="#F0E8E5" strokeWidth="6" fill="none"/>
        <circle cx="40" cy="40" r={r} stroke="url(#scoreGrad)" strokeWidth="6" fill="none" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off} className="transition-all"/>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-black" style={{ color: "#2D2D2D" }}>{value}</div>
        <div className="text-[9px]" style={{ color: "#9A8F8F" }}>/100</div>
      </div>
    </div>
  );
}
