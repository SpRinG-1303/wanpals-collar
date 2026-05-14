import { createFileRoute, Link } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { useEffect, useState } from "react";
import { DAILY_FACTS } from "@/lib/mock";
import { Battery, Signal, Brain, Microscope, Activity, Thermometer, MapPin, Wind, Sun, GitMerge, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { T, useT, useLanguage } from "@/context/LanguageContext";

export const Route = createFileRoute("/home")({ component: Home });

type Dot = "green" | "blue" | "gray" | "red";
type Sensor = {
  Icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  jp: string; en: string;
  subJp: string; subEn: string;
  valJp: string; valEn: string;
  dot: Dot;
  ml?: boolean;
  progress?: number;
  noteJp?: string; noteEn?: string;
  noteColor?: string;
};

const sensors: Sensor[] = [
  { Icon: Brain, iconBg: "#F3E8FF", iconColor: "#9333EA", jp: "吠え分析", en: "BarkSense AI", subJp: "鳴き声解析", subEn: "Bark Analysis", valJp: "穏やか", valEn: "Calm", dot: "green", ml: true },
  { Icon: Microscope, iconBg: "#FFF0F3", iconColor: "#E91E8C", jp: "皮膚センサー", en: "SkinSense AI", subJp: "皮膚の健康", subEn: "Skin Health", valJp: "正常", valEn: "Normal", dot: "green", ml: true },
  { Icon: Activity, iconBg: "#EFF6FF", iconColor: "#3B82F6", jp: "運動センサー", en: "MotionSense", subJp: "活動量", subEn: "Activity Track", valJp: "2,340歩", valEn: "2,340 steps", dot: "blue", progress: 65 },
  { Icon: Thermometer, iconBg: "#FFF1F1", iconColor: "#EF4444", jp: "体温センサー", en: "TempSense AI", subJp: "体温", subEn: "Body Temp", valJp: "38.5°C 正常", valEn: "38.5°C Normal", dot: "green", noteJp: "正常範囲", noteEn: "Normal Range" },
  { Icon: MapPin, iconBg: "#F0FDF4", iconColor: "#22C55E", jp: "位置センサー", en: "LocationSense", subJp: "GPS + 地図", subEn: "GPS + Map", valJp: "渋谷区, 東京", valEn: "Shibuya, Tokyo", dot: "gray" },
  { Icon: Wind, iconBg: "#F0FFFE", iconColor: "#06B6D4", jp: "圧力センサー", en: "PressureSense", subJp: "圧力データ", subEn: "Pressure Data", valJp: "正常範囲", valEn: "Normal Range", dot: "green", noteJp: "圧力データ", noteEn: "Pressure Data", noteColor: "#F59E0B" },
  { Icon: Sun, iconBg: "#FFFBEB", iconColor: "#F59E0B", jp: "光センサー", en: "LightSense AI", subJp: "RGB光データ", subEn: "RGB Light Data", valJp: "室内", valEn: "Indoor", dot: "green" },
  { Icon: GitMerge, iconBg: "#F5F3FF", iconColor: "#6366F1", jp: "総合分析", en: "CombineSense", subJp: "総合解析", subEn: "Combined Analysis", valJp: "87/100", valEn: "87/100", dot: "green" },
];

const DOT_COLOR: Record<Dot, string> = {
  green: "#4CAF82",
  blue: "#3B82F6",
  gray: "#9CA3AF",
  red: "#EF4444",
};

function Home() {
  const [factIdx, setFactIdx] = useState(0);
  const t = useT();
  const { language } = useLanguage();
  useEffect(() => {
    const tm = setInterval(() => setFactIdx((i) => (i + 1) % DAILY_FACTS.length), 10000);
    return () => clearInterval(tm);
  }, []);
  const fact = DAILY_FACTS[factIdx];

  return (
    <AppShell
      titleJp="おはようございます、ハナ! 🐾"
      titleEn="Good Morning, Hana! 🐾"
    >
      {/* Hero profile */}
      <div className="bg-card rounded-2xl p-4 shadow-card flex gap-4 items-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sakura to-secondary flex items-center justify-center text-3xl ring-4 ring-success/40">🐕</div>
          <span className="absolute bottom-0 right-0 w-4 h-4 bg-success rounded-full border-2 border-card"/>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-base">{t("ハナ", "Hana")}</div>
          <div className="flex gap-1 mt-1 flex-wrap">
            <span className="text-[10px] px-2 py-0.5 bg-sakura-soft text-primary rounded-full font-bold">{t("柴犬", "Shiba Inu")}</span>
            <span className="text-[10px] px-2 py-0.5 bg-muted rounded-full">{t("3歳", "3 yrs")}</span>
            <span className="text-[10px] px-2 py-0.5 bg-success/15 text-success rounded-full font-bold">● {t("接続済", "Connected")}</span>
          </div>
          <div className="flex gap-2 mt-2">
            <button className="text-[11px] font-bold text-primary">{t("プロフィール編集", "Edit Profile")} →</button>
            <button className="text-[11px] font-bold text-sakura">+ {t("ペット追加", "Add Pet")}</button>
          </div>
        </div>
      </div>

      {/* Daily fact */}
      <motion.div key={factIdx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 bg-warning/15 border border-warning/30 rounded-2xl p-4">
        <div className="flex justify-between items-start">
          <div className="text-xs font-bold text-warning-foreground/80">🐾 {t("今日の豆知識", "Daily Dog Fact")}</div>
          <span className="text-[10px] text-muted-foreground">#{1247 + factIdx}</span>
        </div>
        <div className="mt-1 text-sm font-bold">
          {language === "english" ? fact.en : fact.jp}
        </div>
        {language === "mixed" && <div className="text-xs text-muted-foreground">{fact.en}</div>}
      </motion.div>

      {/* Health score */}
      <div className="mt-3 bg-card rounded-2xl p-5 shadow-card flex items-center gap-4">
        <ScoreRing value={87} />
        <div className="flex-1">
          <T jp="総合健康スコア" en="Overall Health Score" className="text-sm font-bold" as="div" />
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            <span className="relative w-2 h-2 text-success"><span className="absolute inset-0 rounded-full bg-success"/><span className="absolute inset-0 rounded-full bg-success animate-ping"/></span>
            <span className="font-bold text-success">LIVE</span>
            <span className="text-muted-foreground">· {t("全センサー稼働中", "All sensors active")}</span>
          </div>
        </div>
      </div>

      {/* Collar Connect */}
      <div className="mt-3 bg-card rounded-2xl p-4 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">{t("カラー接続状況", "Collar Status")}</div>
            <div className="font-bold flex items-center gap-2">WanCare Collar v2 <span className="text-success text-xs">● {t("接続済", "Connected")}</span></div>
          </div>
          <div className="text-right text-xs">
            <div className="flex items-center gap-1 justify-end"><Battery className="w-3.5 h-3.5"/><span className="font-bold">78%</span></div>
            <div className="flex items-center gap-1 justify-end mt-1"><Signal className="w-3.5 h-3.5"/><span>3/4</span></div>
          </div>
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
          <span>{t("最終同期: 2分前", "Last sync: 2 min ago")}</span>
          <button className="text-sakura font-bold">{t("再接続", "Reconnect")} →</button>
        </div>
      </div>

      {/* Sensors grid */}
      <h2 className="mt-5 mb-2 text-sm font-black flex items-center gap-2">🤖 {t("AI センサー", "AI Sensors")} <span className="text-xs font-normal text-muted-foreground">8 active</span></h2>
      <div className="grid grid-cols-2 gap-3">
        {sensors.map((s) => (
          <Link to="/report" key={s.en} className="bg-card rounded-2xl p-3 shadow-card flex flex-col gap-1.5">
            <div className="flex items-start justify-between">
              <span className="text-2xl">{s.icon}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${s.color === "success" ? "bg-success/15 text-success" : "bg-sakura-soft text-primary"}`}>{t(s.statusJp, s.statusEn)}</span>
            </div>
            <T jp={s.jp} en={s.en} className="text-[11px] font-bold leading-tight" as="div" />
            <div className="text-sm font-bold text-primary mt-0.5">{t(s.valJp, s.valEn)}</div>
            {s.progress && (
              <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                <div className="h-full bg-success rounded-full" style={{ width: `${s.progress}%` }}/>
              </div>
            )}
            {s.rgb && <div className="flex gap-1 mt-1">{["#E53935","#4CAF82","#1A2F5A"].map(c=><span key={c} className="w-2 h-2 rounded-full" style={{background:c}}/>)}</div>}
            {s.noteJp && <div className="text-[9px] text-muted-foreground mt-0.5">{t(s.noteJp, s.noteEn!)}</div>}
            {s.link && <div className="text-[10px] text-sakura font-bold flex items-center mt-0.5">{t("レポートを見る", "View report")} <ChevronRight className="w-3 h-3"/></div>}
          </Link>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Link to="/report" className="bg-primary text-primary-foreground rounded-2xl p-3 text-center text-xs font-bold">📊 {t("健康レポート", "Health Report")}</Link>
        <Link to="/breeds" className="bg-sakura text-primary rounded-2xl p-3 text-center text-xs font-bold">📚 {t("犬種図鑑", "Breeds")}</Link>
      </div>
    </AppShell>
  );
}

function ScoreRing({ value }: { value: number }) {
  const r = 36, c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <div className="relative w-24 h-24">
      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} stroke="currentColor" strokeWidth="6" fill="none" className="text-muted"/>
        <circle cx="40" cy="40" r={r} stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off} className="text-success transition-all"/>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-black">{value}</div>
        <div className="text-[9px] text-muted-foreground">/100</div>
      </div>
    </div>
  );
}
