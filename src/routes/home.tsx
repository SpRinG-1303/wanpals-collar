import { createFileRoute, Link } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { useEffect, useState, type ReactNode, type CSSProperties } from "react";
import { DAILY_FACTS, BREEDS } from "@/lib/mock";
import {
  Brain, Microscope, Activity, Thermometer, MapPin, Wind, Sun, GitMerge,
  Check, BatteryMedium, Signal, Bluetooth, PawPrint, X, type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { T, useT, useLanguage } from "@/context/LanguageContext";
import { usePet, displayName } from "@/context/PetContext";
import DogAvatar, { BREED_KEY_BY_JP, type BreedKey } from "@/components/DogAvatar";

export const Route = createFileRoute("/home")({ component: Home });

/* ---------- Japanese palette ---------- */
const JP = {
  bg: "#FAFAF8",
  card: "#FFFFFF",
  sumi: "#2C2C2C",
  usuzumi: "#8A8A8A",
  divider: "#F5F0EC",
  sakura: "#E8829A",
  sakuraSoft: "#FFF0F3",
  sakuraStrip: "linear-gradient(90deg,#FFE4EC,#FFF0F5)",
  fuji: "#7B68C8",
  fujiSoft: "#F0EEF8",
  fujiStrip: "linear-gradient(90deg,#EDE0FF,#F5F0FF)",
  matcha: "#6BAF92",
  matchaSoft: "#E8F5EE",
  matchaStrip: "linear-gradient(90deg,#E8F5EE,#F5FBF8)",
  yuzu: "#D4A843",
  yuzuSoft: "#FFF8DC",
  yuzuStrip: "linear-gradient(90deg,#FFF8DC,#FFFEF5)",
  sora: "#5B9BD5",
  soraSoft: "#E8F2FF",
  soraStrip: "linear-gradient(90deg,#E8F2FF,#F5F9FF)",
  momiji: "#D4714E",
  momijiSoft: "#FFE8DC",
  momijiStrip: "linear-gradient(90deg,#FFE8DC,#FFF2EC)",
};

const CARD_SHADOW = "0 2px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)";

/* Refined card wrapper: white bg, left accent border, top color strip */
function JCard({
  accent,
  strip,
  children,
  className = "",
  style,
}: {
  accent: string;
  strip: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={"relative " + className}
      style={{
        background: JP.card,
        borderRadius: 20,
        borderLeft: `4px solid ${accent}`,
        boxShadow: CARD_SHADOW,
        overflow: "hidden",
        transition: "transform 0.2s ease",
        ...style,
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, background: strip, pointerEvents: "none" }} />
      <div style={{ paddingTop: 8 }}>{children}</div>
    </div>
  );
}

/* Section label with thin lines: ──── LABEL ──── */
function SectionLabel({ jp, en }: { jp: string; en: string }) {
  const t = useT();
  return (
    <div className="flex items-center" style={{ gap: 12, margin: "20px 0 10px" }}>
      <div style={{ flex: 1, height: 1, background: "#E0DAD4" }} />
      <div style={{ fontSize: 11, color: JP.usuzumi, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>
        {t(jp, en)}
      </div>
      <div style={{ flex: 1, height: 1, background: "#E0DAD4" }} />
    </div>
  );
}

/* ---------- Sensors ---------- */
type Sensor = {
  Icon: LucideIcon;
  accent: string; iconBg: string; strip: string;
  jp: string; en: string;
  subJp: string; subEn: string;
  valJp: string; valEn: string;
  to: string;
  ml?: boolean;
  progress?: number;
  noteJp?: string; noteEn?: string;
};

const sensors: Sensor[] = [
  { Icon: Brain, accent: JP.fuji, iconBg: "#EDE0FF", strip: JP.fujiStrip, to: "/bark-sense",
    jp: "吠え分析", en: "BarkSense AI", subJp: "鳴き声解析", subEn: "Bark Analysis", valJp: "穏やか", valEn: "Calm", ml: true },
  { Icon: Microscope, accent: JP.sakura, iconBg: "#FFE4EC", strip: JP.sakuraStrip, to: "/skin-sense",
    jp: "皮膚センサー", en: "SkinSense AI", subJp: "皮膚の健康", subEn: "Skin Health", valJp: "正常", valEn: "Normal", ml: true },
  { Icon: Activity, accent: JP.sora, iconBg: "#E8F2FF", strip: JP.soraStrip, to: "/motion-sense",
    jp: "運動センサー", en: "MotionSense", subJp: "活動量", subEn: "Activity Track", valJp: "2,340 歩", valEn: "2,340 steps", progress: 65 },
  { Icon: Thermometer, accent: JP.momiji, iconBg: "#FFE8DC", strip: JP.momijiStrip, to: "/temp-sense",
    jp: "体温センサー", en: "TempSense AI", subJp: "体温", subEn: "Body Temp", valJp: "38.5°C", valEn: "38.5°C", noteJp: "正常範囲", noteEn: "Normal Range" },
  { Icon: MapPin, accent: JP.matcha, iconBg: "#E8F5EE", strip: JP.matchaStrip, to: "/map",
    jp: "位置センサー", en: "LocationSense", subJp: "GPS + 地図", subEn: "GPS + Map", valJp: "渋谷区, 東京", valEn: "Shibuya, Tokyo" },
  { Icon: Wind, accent: JP.yuzu, iconBg: "#FFF8DC", strip: JP.yuzuStrip, to: "/pressure-sense",
    jp: "圧力センサー", en: "PressureSense", subJp: "圧力データ", subEn: "Pressure Data", valJp: "正常範囲", valEn: "Normal Range" },
  { Icon: Sun, accent: "#C4920A", iconBg: "#FFFBCC", strip: "linear-gradient(90deg,#FFF8DC,#FFFEF0)", to: "/light-sense",
    jp: "光センサー", en: "LightSense AI", subJp: "RGB光データ", subEn: "RGB Light Data", valJp: "室内", valEn: "Indoor" },
  { Icon: GitMerge, accent: "#9B72CF", iconBg: "#F0E8FF", strip: "linear-gradient(90deg,#F0E8FF,#F8F5FF)", to: "/combine-sense",
    jp: "総合分析", en: "CombineSense", subJp: "総合解析", subEn: "Combined Analysis", valJp: "87/100", valEn: "87/100" },
];

/* ---------- Hero (time-based postcard with crossfading sky) ---------- */
type TimeBand = "morning" | "afternoon" | "evening" | "night";

function bandFromHour(h: number): TimeBand {
  if (h >= 5 && h < 11) return "morning";
  if (h >= 11 && h < 17) return "afternoon";
  if (h >= 17 && h < 20) return "evening";
  return "night";
}

type SceneTheme = {
  jp: string;
  bg: string;
  paperLines: string | null;
  trunk: string;
  blossom: string;
  blossomStroke: string;
  staticSun: { cx: number; cy: number; r: number; fill: string };
  fujiBody: string;
  fujiSnow: string;
  mist: string;
  stars: boolean;
  treeline: string | null;
  orb: string;
  glow: string;
  orbSize: number;
  startHour: number;
  endHour: number;
};

const BAND_META: Record<TimeBand, SceneTheme> = {
  morning: {
    jp: "朝", bg: "#F2E8D0", paperLines: "rgba(120,90,60,0.06)",
    trunk: "#1A0F08", blossom: "#E8A0A0", blossomStroke: "#B86060",
    staticSun: { cx: 200, cy: 270, r: 70, fill: "#C93808" },
    fujiBody: "#8AAAB5", fujiSnow: "#F0ECE0", mist: "rgba(200,195,185,0.55)",
    stars: false, treeline: null,
    orb: "#E05010", glow: "rgba(224,80,16,0.75)", orbSize: 56,
    startHour: 5, endHour: 11,
  },
  afternoon: {
    jp: "昼", bg: "#F5F0C8", paperLines: "rgba(160,140,60,0.05)",
    trunk: "#1A0F08", blossom: "#F0B8A8", blossomStroke: "#C07868",
    staticSun: { cx: 215, cy: 110, r: 50, fill: "#F5C800" },
    fujiBody: "#7AAAB8", fujiSnow: "#FFFFFF", mist: "rgba(180,200,180,0.55)",
    stars: false, treeline: null,
    orb: "#F5C800", glow: "rgba(245,200,0,0.75)", orbSize: 56,
    startHour: 11, endHour: 17,
  },
  evening: {
    jp: "夕", bg: "#E8C070", paperLines: "rgba(160,90,30,0.07)",
    trunk: "#1A0F08", blossom: "#E89080", blossomStroke: "#A85040",
    staticSun: { cx: 205, cy: 200, r: 60, fill: "#D84808" },
    fujiBody: "#607080", fujiSnow: "#E8D8B8", mist: "rgba(220,160,80,0.50)",
    stars: false, treeline: null,
    orb: "#D04800", glow: "rgba(255,170,70,0.80)", orbSize: 56,
    startHour: 17, endHour: 20,
  },
  night: {
    jp: "夜", bg: "#1C2048", paperLines: null,
    trunk: "#120808", blossom: "#F0C8D8", blossomStroke: "#A878A0",
    staticSun: { cx: 210, cy: 120, r: 56, fill: "#FFFFFF" },
    fujiBody: "#2A3060", fujiSnow: "#D8DCEC", mist: "rgba(30,40,90,0.55)",
    stars: true, treeline: "#0A0E28",
    orb: "#FFFFFF", glow: "rgba(190,220,255,0.80)", orbSize: 68,
    startHour: 20, endHour: 29,
  },
};

/* Shared geometry: tree (left) + fuji (right-center).
   viewBox 300 x 400 (3:4). */
const TRUNK_D =
  "M 8 410 C 28 360 18 310 40 260 C 55 220 38 180 60 130 C 72 100 60 70 78 30";
const BRANCHES: { d: string }[] = [
  // original main branches (right side)
  { d: "M 40 260 C 70 245 95 240 130 220" },
  { d: "M 50 200 C 85 195 110 180 140 165" },
  { d: "M 60 150 C 90 140 115 130 145 105" },
  { d: "M 70 100 C 95 92 115 78 138 60" },
  { d: "M 30 300 C 55 295 80 295 110 285" },
  { d: "M 45 230 C 25 210 18 195 12 170" },
  // extra branches — more density, more reach
  { d: "M 38 270 C 65 270 95 268 125 258" },
  { d: "M 52 185 C 78 178 100 172 118 152" },
  { d: "M 65 125 C 88 118 108 108 128 88" },
  { d: "M 35 280 C 22 268 16 252 10 232" },
  { d: "M 55 170 C 38 158 28 140 22 118" },
  { d: "M 72 80 C 92 70 108 56 122 38" },
  { d: "M 42 245 C 70 232 92 218 115 200" },
  { d: "M 48 215 C 30 200 22 182 18 158" },
  { d: "M 32 320 C 58 318 82 314 105 308" },
  { d: "M 62 140 C 80 128 96 116 112 102" },
];
const BLOSSOMS: { cx: number; cy: number; r: number }[] = [
  // original clusters
  { cx: 130, cy: 220, r: 11 }, { cx: 118, cy: 210, r: 8 }, { cx: 142, cy: 230, r: 9 },
  { cx: 140, cy: 165, r: 11 }, { cx: 152, cy: 158, r: 8 }, { cx: 128, cy: 175, r: 9 },
  { cx: 145, cy: 105, r: 11 }, { cx: 157, cy: 95, r: 9 }, { cx: 132, cy: 115, r: 8 },
  { cx: 138, cy: 60,  r: 11 }, { cx: 150, cy: 50, r: 9 }, { cx: 125, cy: 70, r: 8 },
  { cx: 110, cy: 285, r: 10 }, { cx: 96,  cy: 290, r: 8 }, { cx: 80, cy: 296, r: 9 },
  { cx: 12,  cy: 170, r: 9 },  { cx: 22,  cy: 180, r: 7 },
  { cx: 78,  cy: 30,  r: 10 }, { cx: 92,  cy: 26,  r: 8 },
  // new clusters on added branches
  { cx: 125, cy: 258, r: 11 }, { cx: 112, cy: 262, r: 8 }, { cx: 98, cy: 268, r: 9 },
  { cx: 118, cy: 152, r: 10 }, { cx: 106, cy: 160, r: 8 }, { cx: 92, cy: 168, r: 7 },
  { cx: 128, cy: 88,  r: 10 }, { cx: 116, cy: 96,  r: 8 }, { cx: 104, cy: 104, r: 7 },
  { cx: 22,  cy: 118, r: 9 },  { cx: 30,  cy: 130, r: 7 },
  { cx: 122, cy: 38,  r: 9 },  { cx: 110, cy: 46,  r: 7 },
  { cx: 115, cy: 200, r: 10 }, { cx: 102, cy: 208, r: 8 }, { cx: 88, cy: 214, r: 7 },
  { cx: 18,  cy: 158, r: 8 },  { cx: 26,  cy: 168, r: 7 },
  { cx: 105, cy: 308, r: 10 }, { cx: 90,  cy: 314, r: 8 }, { cx: 75, cy: 318, r: 8 },
  { cx: 112, cy: 102, r: 9 },  { cx: 98,  cy: 110, r: 7 },
  // soft falling/floating blossoms in air
  { cx: 165, cy: 140, r: 6 }, { cx: 170, cy: 240, r: 5 }, { cx: 25,  cy: 90,  r: 6 },
];

function Scene({ theme, active }: { theme: SceneTheme; active: boolean }) {
  return (
    <svg
      viewBox="0 0 300 400"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        opacity: active ? 1 : 0,
        transition: "opacity 2.5s ease-in-out",
        display: "block",
      }}
    >
      <defs>
        {theme.paperLines && (
          <pattern id={`paper-${theme.jp}`} width="6" height="400" patternUnits="userSpaceOnUse">
            <rect width="6" height="400" fill={theme.bg} />
            <line x1="0" y1="0" x2="0" y2="400" stroke={theme.paperLines} strokeWidth="1" />
          </pattern>
        )}
      </defs>

      {/* Background */}
      <rect width="300" height="400" fill={theme.paperLines ? `url(#paper-${theme.jp})` : theme.bg} />

      {/* Stars (night) */}
      {theme.stars && [
        [40, 40], [70, 25], [110, 55], [165, 30], [200, 18], [240, 45], [275, 28],
        [60, 90], [130, 80], [185, 70], [225, 95], [260, 110], [30, 130], [95, 145],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.6 : 1} fill="#FFFFFF" opacity={0.85} />
      ))}

      {/* Mt Fuji */}
      <path d="M 110 330 L 200 150 L 290 330 Z" fill={theme.fujiBody} />
      {/* Snow cap */}
      <path
        d="M 200 150 L 175 205 Q 188 200 200 207 Q 212 200 225 205 Z"
        fill={theme.fujiSnow}
      />
      {/* Snow drips */}
      <path d="M 178 205 L 170 230 M 195 207 L 198 235 M 215 207 L 222 232 M 205 207 L 208 240"
            stroke={theme.fujiSnow} strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Mist bands */}
      <ellipse cx="200" cy="330" rx="120" ry="10" fill={theme.mist} />
      <ellipse cx="180" cy="345" rx="140" ry="8" fill={theme.mist} opacity="0.7" />

      {/* Treeline silhouette (night) */}
      {theme.treeline && (
        <path
          d="M 0 400 L 0 378 Q 30 360 60 372 Q 90 358 120 370 Q 150 354 180 368 Q 210 356 240 370 Q 270 358 300 372 L 300 400 Z"
          fill={theme.treeline}
        />
      )}

      {/* Tree trunk */}
      <path d={TRUNK_D} stroke={theme.trunk} strokeWidth="14" strokeLinecap="round" fill="none" />
      {/* Tree branches (gentle sway) */}
      {BRANCHES.map((b, i) => {
        const m = b.d.match(/M\s+(\d+)\s+(\d+)/);
        const ox = m ? Number(m[1]) : 0;
        const oy = m ? Number(m[2]) : 0;
        return (
          <g
            key={i}
            style={{
              transformBox: "view-box",
              transformOrigin: `${ox}px ${oy}px`,
              animation: `branchSway ${4 + (i % 3)}s ease-in-out ${i * 0.5}s infinite`,
            }}
          >
            <path d={b.d} stroke={theme.trunk} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          </g>
        );
      })}
      {/* Sakura blossoms — 5-petal flower shapes */}
      {BLOSSOMS.map((b, i) => {
        const petals = 5;
        const petalR = b.r * 0.62;
        const offset = b.r * 0.55;
        return (
          <g
            key={i}
            style={{
              transformBox: "view-box",
              transformOrigin: `${b.cx}px ${b.cy}px`,
              animation: `blossomSway ${3 + ((i * 7) % 3)}s ease-in-out ${((i * 0.37) % 3).toFixed(2)}s infinite`,
            }}
          >
          <g transform={`rotate(${(i * 17) % 360} ${b.cx} ${b.cy})`}>
            {Array.from({ length: petals }).map((_, p) => {
              const ang = (p / petals) * Math.PI * 2 - Math.PI / 2;
              const px = b.cx + Math.cos(ang) * offset;
              const py = b.cy + Math.sin(ang) * offset;
              const deg = (ang * 180) / Math.PI + 90;
              return (
                <g key={p} transform={`rotate(${deg} ${px} ${py})`}>
                  {/* Petal: teardrop with notched tip */}
                  <path
                    d={`M ${px} ${py - petalR}
                        C ${px + petalR * 0.85} ${py - petalR * 0.7},
                          ${px + petalR * 0.7} ${py + petalR * 0.35},
                          ${px + petalR * 0.18} ${py + petalR * 0.55}
                        Q ${px} ${py + petalR * 0.45} ${px - petalR * 0.18} ${py + petalR * 0.55}
                        C ${px - petalR * 0.7} ${py + petalR * 0.35},
                          ${px - petalR * 0.85} ${py - petalR * 0.7},
                          ${px} ${py - petalR}
                        Z`}
                    fill={theme.blossom}
                    stroke={theme.blossomStroke}
                    strokeWidth="0.5"
                    opacity="0.95"
                  />
                  {/* Notch highlight on petal tip */}
                  <path
                    d={`M ${px - petalR * 0.18} ${py - petalR * 0.92}
                        Q ${px} ${py - petalR * 0.75} ${px + petalR * 0.18} ${py - petalR * 0.92}`}
                    stroke={theme.blossomStroke}
                    strokeWidth="0.6"
                    fill="none"
                    opacity="0.7"
                  />
                </g>
              );
            })}
            {/* Yellow center stamen */}
            <circle cx={b.cx} cy={b.cy} r={b.r * 0.18} fill="#F5D050" opacity="0.95" />
            {/* Stamen dots */}
            {Array.from({ length: 5 }).map((_, s) => {
              const a = (s / 5) * Math.PI * 2;
              return (
                <circle
                  key={s}
                  cx={b.cx + Math.cos(a) * b.r * 0.22}
                  cy={b.cy + Math.sin(a) * b.r * 0.22}
                  r={b.r * 0.07}
                  fill={theme.blossomStroke}
                  opacity="0.7"
                />
              );
            })}
          </g>
          </g>
        );
      })}
    </svg>
  );
}


function getProgress(now: Date, band: TimeBand): number {
  const meta = BAND_META[band];
  const h = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
  let cur = h;
  if (band === "night" && h < 5) cur = h + 24;
  const p = (cur - meta.startHour) / (meta.endHour - meta.startHour);
  return Math.max(0, Math.min(1, p));
}

function HeroPostcard({ score, name, mood, celebrate }: { score: number; name: string; mood: string; celebrate: boolean }) {
  const t = useT();
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const band: TimeBand = now ? bandFromHour(now.getHours()) : "afternoon";
  const meta = BAND_META[band];
  const progress = now ? getProgress(now, band) : 0.5;

  // Sine arc: x from 8% to 92%, y peaks at top (~15%) at progress=0.5
  const orbX = 8 + progress * 84; // %
  const orbY = 85 - Math.sin(progress * Math.PI) * 70; // 85% bottom -> 15% top -> 85% bottom

  const timeStr = now
    ? `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
    : "--:--";

  const labelJp = band === "morning" ? "おはよう" : band === "afternoon" ? "こんにちは" : band === "evening" ? "こんばんは" : "おやすみ";
  const labelEn = band === "morning" ? "Good Morning" : band === "afternoon" ? "Good Afternoon" : band === "evening" ? "Good Evening" : "Good Night";

  const hasName = !!name && name !== t("ワンちゃん", "Your Dog");
  const greeting = hasName
    ? t(`ようこそ、${name}！🐾`, `Welcome, ${name}! 🐾`)
    : name;

  const serif = `"Noto Serif JP", "Noto Sans JP", serif`;

  return (
    <div
      className="relative"
      style={{
        margin: "12px 16px 4px",
        aspectRatio: "3 / 4",
        borderRadius: 24,
        overflow: "hidden",
        background: "#1a1a1a",
        boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
        animation: celebrate ? "heroCelebrate 0.8s ease-out" : "none",
        fontFamily: serif,
      }}
    >
      {/* Crossfading SVG scenes */}
      {(Object.keys(BAND_META) as TimeBand[]).map((k) => (
        <Scene key={k} theme={BAND_META[k]} active={k === band} />
      ))}

      {/* Realistic sun / moon traversing arc */}
      {band === "night" ? (
        <div
          style={{
            position: "absolute",
            left: `${orbX}%`,
            top: `${orbY}%`,
            width: meta.orbSize, height: meta.orbSize,
            marginLeft: -meta.orbSize / 2, marginTop: -meta.orbSize / 2,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 38% 36%, #FFFFFF 0%, #F4F1E4 45%, #C9C4B0 78%, #8E8A78 100%)",
            boxShadow:
              "0 0 24px 4px rgba(230,235,255,0.55), 0 0 70px 18px rgba(180,200,255,0.35)",
            transition: "left 60s linear, top 60s linear",
            pointerEvents: "none",
          }}
        >
          {/* Lunar maria — subtle craters */}
          <span style={{ position: "absolute", top: "30%", left: "55%", width: "22%", height: "18%", borderRadius: "50%", background: "rgba(140,135,120,0.35)" }} />
          <span style={{ position: "absolute", top: "55%", left: "30%", width: "16%", height: "14%", borderRadius: "50%", background: "rgba(140,135,120,0.28)" }} />
          <span style={{ position: "absolute", top: "62%", left: "58%", width: "12%", height: "10%", borderRadius: "50%", background: "rgba(140,135,120,0.3)" }} />
        </div>
      ) : (
        <div
          style={{
            position: "absolute",
            left: `${orbX}%`,
            top: `${orbY}%`,
            width: meta.orbSize, height: meta.orbSize,
            marginLeft: -meta.orbSize / 2, marginTop: -meta.orbSize / 2,
            borderRadius: "50%",
            background:
              band === "evening"
                ? "radial-gradient(circle at 50% 50%, #FFE8B0 0%, #FFB060 35%, #E85A20 75%, rgba(232,90,32,0) 100%)"
                : band === "morning"
                ? "radial-gradient(circle at 50% 50%, #FFF6D8 0%, #FFD070 35%, #FF8838 78%, rgba(255,136,56,0) 100%)"
                : "radial-gradient(circle at 50% 50%, #FFFCE0 0%, #FFE070 40%, #FFB020 80%, rgba(255,176,32,0) 100%)",
            boxShadow: `0 0 30px 8px ${meta.glow}, 0 0 80px 22px ${meta.glow}`,
            transition: "left 60s linear, top 60s linear, background 2.5s ease, box-shadow 2.5s ease",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Falling petals overlay */}
      <div
        style={{
          position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none",
        }}
        aria-hidden
      >
        {Array.from({ length: 8 }).map((_, i) => {
          const leftPct = 6 + ((i * 13) % 85);
          const dur = 7 + ((i * 1.3) % 3); // 7-10s
          const delay = (i * 0.9) % 8;
          const drift = (i % 2 === 0 ? 1 : -1) * (20 + (i * 7) % 40);
          return (
            <span
              key={i}
              style={{
                position: "absolute",
                left: `${leftPct}%`,
                top: "-6%",
                width: 10,
                height: 14,
                borderRadius: "60% 60% 50% 50% / 70% 70% 40% 40%",
                background: "#F4B6C2",
                boxShadow: "inset -2px -2px 0 rgba(184,96,128,0.25)",
                opacity: 0,
                ["--drift" as any]: `${drift}px`,
                animation: `petalFall ${dur}s linear ${delay}s infinite`,
              }}
            />
          );
        })}
      </div>

      {/* Bottom dark gradient overlay (stronger, behind text) */}
      <div
        style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.65) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Top-left JP time label (with dark pill) */}
      <div
        style={{
          position: "absolute", top: 12, left: 14,
          fontFamily: serif, fontSize: 26, fontWeight: 600,
          color: "#fff",
          background: "rgba(0,0,0,0.25)",
          padding: "4px 12px",
          borderRadius: 14,
          lineHeight: 1,
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        }}
      >
        {meta.jp}
      </div>

      {/* Top-right current time (with dark pill) */}
      <div
        style={{
          position: "absolute", top: 14, right: 14,
          fontFamily: serif, fontSize: 15, fontWeight: 500,
          color: "#fff",
          letterSpacing: "0.08em",
          background: "rgba(0,0,0,0.25)",
          padding: "5px 12px",
          borderRadius: 14,
          fontVariantNumeric: "tabular-nums",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        }}
      >
        {timeStr}
      </div>

      {/* Bottom content */}
      <div
        style={{
          position: "absolute", left: 0, right: 0, bottom: 0,
          padding: "0 20px 18px",
          color: "#fff",
          fontFamily: serif,
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 500, opacity: 0.92, letterSpacing: "0.05em" }}>
          {t(`${labelJp} / ${labelEn}`, `${labelEn} / ${labelJp}`)}
        </div>
        <div style={{ fontSize: 26, fontWeight: 600, lineHeight: 1.15, marginTop: 4, textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
          {greeting}
        </div>
        <div className="flex items-center" style={{ gap: 8, marginTop: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#9EE3B8", display: "inline-block" }} />
          <span style={{ fontSize: 12, opacity: 0.95 }}>{mood}</span>
        </div>
        <div style={{ marginTop: 10 }}>
          <span style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            color: "#fff",
            borderRadius: 20,
            padding: "5px 14px",
            fontSize: 12,
            fontWeight: 600,
            fontVariantNumeric: "tabular-nums",
            border: "1px solid rgba(255,255,255,0.25)",
          }}>
            {score} / 100 ✦
          </span>
        </div>
      </div>

      <style>{`
        @keyframes heroCelebrate {
          0%,100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.02) rotate(-0.5deg); }
          75% { transform: scale(1.02) rotate(0.5deg); }
        }
        @keyframes branchSway {
          0%,100% { transform: rotate(-1.5deg); }
          50% { transform: rotate(1.5deg); }
        }
        @keyframes blossomSway {
          0%,100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        @keyframes petalFall {
          0%   { transform: translate(0, 0) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.8; }
          100% { transform: translate(var(--drift, 30px), 120vh) rotate(540deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ---------- Page ---------- */
function Home() {
  const [factIdx, setFactIdx] = useState(0);
  const [sosOpen, setSosOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const t = useT();
  const { language } = useLanguage();
  const { pet, updatePet } = usePet();
  const [celebrate, setCelebrate] = useState(false);
  useEffect(() => {
    const tm = setInterval(() => setFactIdx((i) => (i + 1) % DAILY_FACTS.length), 10000);
    return () => clearInterval(tm);
  }, []);
  useEffect(() => {
    if (pet.justCompletedOnboarding && pet.name?.trim()) {
      setCelebrate(true);
      const id = setTimeout(() => {
        setCelebrate(false);
        updatePet({ justCompletedOnboarding: false });
      }, 2000);
      return () => clearTimeout(id);
    }
  }, [pet.justCompletedOnboarding, pet.name, updatePet]);
  const fact = DAILY_FACTS[factIdx];
  const score = 87;

  const dogName = displayName(pet);
  const heroName = pet.name?.trim() ? dogName : t("ワンちゃん", "Your Dog");
  const mood = pet.name?.trim()
    ? t(`${pet.name}は元気です`, `${dogName} is feeling great`)
    : t("元気です", "Feeling great");
  const breedLabel = language === "english" ? pet.breedEn : language === "japanese" ? pet.breedJp : `${pet.breedJp} / ${pet.breedEn}`;
  const ageLabel = pet.age != null ? t(`${pet.age}歳`, `${pet.age} yrs`) : null;
  const breedKey: BreedKey = (BREED_KEY_BY_JP[pet.breedJp] ?? (pet.breed as BreedKey) ?? "mixed");

  return (
    <AppShell titleJp="" titleEn="" noPadding>
      <HeroPostcard score={score} name={heroName} mood={mood} celebrate={celebrate} />


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

      <div style={{ padding: "0 16px" }}>
        {/* Dog profile */}
        <div style={{ marginTop: 8 }}>
          <JCard accent={JP.sakura} strip={JP.sakuraStrip}>
            <div style={{ padding: 16 }} className="flex gap-3 items-center">
              <div className="relative">
                <div className="flex items-center justify-center" style={{ width: 56, height: 56, borderRadius: "50%", background: "#FFF6F8", border: `2px solid #FFB7C5`, overflow: "hidden" }}>
                  <DogAvatar
                    breed={breedKey}
                    furColor={pet.avatar.furColor}
                    earStyle={pet.avatar.earStyle as any}
                    eyeStyle={pet.avatar.eyeStyle as any}
                    collarColor={pet.avatar.collarColor}
                    size={52}
                    ring={false}
                    showCollar={false}
                    showCheeks={false}
                  />
                </div>
                <span style={{ position: "absolute", bottom: 0, right: 0, width: 12, height: 12, borderRadius: "50%", background: JP.matcha, border: "2px solid #fff" }}/>
              </div>
              <div className="flex-1 min-w-0">
                <div style={{ fontSize: 20, fontWeight: 700, color: JP.sumi, lineHeight: 1.1 }}>{dogName}</div>
                <div className="flex flex-wrap" style={{ gap: 6, marginTop: 6 }}>
                  <Chip bg={JP.sakuraSoft} color={JP.sakura} border="#FFD0DC">{breedLabel}</Chip>
                  {ageLabel && <Chip bg={JP.yuzuSoft} color={JP.yuzu} border="#F0E2A8">{ageLabel}</Chip>}
                  <Chip bg={JP.matchaSoft} color={JP.matcha} border="#C8E2D4">● {t("接続済", "Connected")}</Chip>
                </div>
                <div className="flex" style={{ gap: 14, marginTop: 8 }}>
                  <button onClick={() => setEditOpen(true)} style={{ fontSize: 13, color: JP.sakura, fontWeight: 600 }}>{t("プロフィール編集", "Edit Profile")} →</button>
                  <button style={{ fontSize: 13, color: JP.fuji, fontWeight: 600 }}>+ {t("ペット追加", "Add Pet")}</button>
                </div>
              </div>
            </div>
          </JCard>
        </div>

        {/* Daily fact */}
        <motion.div key={factIdx} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 8 }}>
          <JCard accent={JP.yuzu} strip={JP.yuzuStrip} style={{ background: "#FFFDF5" }}>
            <div style={{ padding: 16 }}>
              <div className="flex justify-between items-center">
                <div className="flex items-center" style={{ gap: 6 }}>
                  <PawPrint size={14} strokeWidth={1.75} style={{ color: JP.yuzu }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: JP.yuzu, letterSpacing: "0.02em" }}>
                    {t("今日の豆知識", "Daily Dog Fact")}
                  </span>
                </div>
              </div>
              <div style={{ marginTop: 10, fontSize: 15, lineHeight: 1.5, color: "#3C3020", fontWeight: 500 }}>
                {language === "english" ? fact.en : fact.jp}
              </div>
              {language === "mixed" && (
                <div style={{ marginTop: 6, fontSize: 11, color: JP.usuzumi, lineHeight: 1.5 }}>{fact.en}</div>
              )}
            </div>
          </JCard>
        </motion.div>

        {/* Health score */}
        <div style={{ marginTop: 8 }}>
          <JCard accent={JP.matcha} strip={JP.matchaStrip}>
            <div style={{ padding: 16 }} className="flex items-center gap-4">
              <ScoreRing value={score} />
              <div className="flex-1">
                <div style={{ fontSize: 16, fontWeight: 600, color: JP.sumi, letterSpacing: "0.02em" }}>
                  {t("総合健康スコア", "Overall Health Score")}
                </div>
                {language === "mixed" && <div style={{ fontSize: 11, color: JP.usuzumi, marginTop: 2 }}>Overall Health Score</div>}
                <div className="flex items-center" style={{ gap: 6, marginTop: 8, fontSize: 12 }}>
                  <span className="relative inline-block" style={{ width: 8, height: 8 }}>
                    <span style={{ position:"absolute", inset:0, borderRadius:"50%", background: JP.matcha }}/>
                    <span className="animate-ping" style={{ position:"absolute", inset:0, borderRadius:"50%", background: JP.matcha, opacity: 0.6 }}/>
                  </span>
                  <span style={{ color: JP.matcha, fontWeight: 700, letterSpacing: "0.05em" }}>LIVE</span>
                  <span style={{ color: JP.usuzumi }}>· {t("全センサー稼働中", "All sensors active")}</span>
                </div>
              </div>
            </div>
          </JCard>
        </div>

        {/* Collar status */}
        <div style={{ marginTop: 8 }}>
          <JCard accent={JP.sora} strip={JP.soraStrip}>
            <div style={{ padding: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: JP.sumi, marginBottom: 14, letterSpacing: "0.02em" }}>
                {t("カラーステータス", "Collar Status")}
              </div>

              <div className="flex items-center" style={{ gap: 12 }}>
                <div className="flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: "50%", background: "#EBF4FF" }}>
                  <Check size={20} strokeWidth={2.5} style={{ color: JP.sora }} />
                </div>
                <div className="flex-1">
                  <div style={{ fontSize: 14, fontWeight: 600, color: JP.sumi }}>{t("接続済み", "Connected")}</div>
                  <div style={{ fontSize: 12, color: JP.usuzumi }}>{t("最終同期: 2分前", "Last sync: 2 minutes ago")}</div>
                </div>
              </div>

              <div style={{ height: 1, background: JP.divider, margin: "14px 0" }} />

              <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                <div className="flex items-center" style={{ gap: 6 }}>
                  <BatteryMedium size={18} strokeWidth={1.5} style={{ color: JP.sora }} />
                  <span style={{ fontSize: 13, color: JP.sumi, fontWeight: 500 }}>{t("バッテリー", "Battery")}</span>
                </div>
                <div className="flex items-center">
                  <div style={{ width: 110, height: 6, background: "#EBF4FF", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: "87%", height: "100%", background: JP.sora, borderRadius: 4 }}/>
                  </div>
                  <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 700, color: JP.sora, fontVariantNumeric: "tabular-nums" }}>87%</span>
                </div>
              </div>

              <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
                <div className="flex items-center" style={{ gap: 6 }}>
                  <Signal size={18} strokeWidth={1.5} style={{ color: JP.sora }} />
                  <span style={{ fontSize: 13, color: JP.sumi, fontWeight: 500 }}>{t("信号強度", "Signal Strength")}</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-end" style={{ gap: 3 }}>
                    {[6, 10, 14, 18].map((h) => (
                      <div key={h} style={{ width: 4, height: h, background: JP.sora, borderRadius: 2 }} />
                    ))}
                  </div>
                  <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 600, color: JP.sora }}>{t("優秀", "Excellent")}</span>
                </div>
              </div>

              <button
                className="w-full flex items-center justify-center"
                style={{
                  background: "#F0F6FF",
                  color: JP.sora,
                  border: "1px solid #C8E0F8",
                  borderRadius: 12,
                  height: 44,
                  fontSize: 14,
                  fontWeight: 600,
                  gap: 8,
                  letterSpacing: "0.02em",
                }}
              >
                <Bluetooth size={16} strokeWidth={1.75} />
                {t("カラーを接続", "Connect Collar")}
              </button>
            </div>
          </JCard>
        </div>

        {/* AI Sensors section */}
        <SectionLabel jp="AI センサー" en="AI Sensors" />

        <div className="grid grid-cols-2" style={{ gap: 8 }}>
          {sensors.map((s) => {
            const Icon = s.Icon;
            return (
              <Link
                key={s.en}
                to={s.to}
                style={{
                  position: "relative",
                  background: JP.card,
                  borderRadius: 20,
                  borderLeft: `4px solid ${s.accent}`,
                  boxShadow: CARD_SHADOW,
                  overflow: "hidden",
                  transition: "transform 0.2s ease",
                }}
                className="flex flex-col"
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 10, background: s.strip, pointerEvents: "none" }} />
                <div style={{ padding: 14, paddingTop: 18, display: "flex", flexDirection: "column", flex: 1 }}>


                  <div style={{ width: 44, height: 44, borderRadius: 12, background: s.iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={22} strokeWidth={1.5} style={{ color: s.accent }} />
                  </div>

                  <div style={{ marginTop: 12, fontSize: 14, fontWeight: 600, color: JP.sumi, letterSpacing: "0.01em", lineHeight: 1.2 }}>
                    {t(s.jp, s.en)}
                  </div>
                  <div style={{ fontSize: 11, color: JP.usuzumi, marginTop: 2, lineHeight: 1.3 }}>
                    {t(s.subJp, s.subEn)}
                  </div>

                  <div className="flex items-center justify-between" style={{ marginTop: 10, gap: 6 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: JP.sumi, fontVariantNumeric: "tabular-nums", lineHeight: 1.1 }}>
                      {t(s.valJp, s.valEn)}
                    </div>
                    <span className="animate-pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: s.accent, flexShrink: 0 }}/>
                  </div>

                  {s.noteJp && (
                    <div style={{ fontSize: 11, color: JP.usuzumi, marginTop: 4 }}>
                      {t(s.noteJp, s.noteEn!)}
                    </div>
                  )}

                  {s.progress !== undefined && (
                    <div style={{ marginTop: 10, height: 4, borderRadius: 4, overflow: "hidden", background: "#F0ECE8" }}>
                      <div style={{ width: `${s.progress}%`, height: "100%", background: s.accent, borderRadius: 4 }}/>
                    </div>
                  )}

                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Access */}
        <SectionLabel jp="クイックアクセス" en="Quick Access" />

        <div className="grid grid-cols-2" style={{ gap: 10, marginBottom: 16 }}>
          {/* Health Report Card */}
          <Link
            to="/report"
            className="relative overflow-hidden"
            style={{
              height: 90,
              borderRadius: 20,
              background: "linear-gradient(135deg, #667EEA 0%, #9B72CF 100%)",
              boxShadow: "0 8px 24px rgba(102,126,234,0.35)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(102,126,234,0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(102,126,234,0.35)";
            }}
          >
            {/* Inner highlight */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "rgba(255,255,255,0.3)", zIndex: 2, pointerEvents: "none" }} />
            {/* Decorative circles */}
            <div style={{ position: "absolute", top: -20, right: 20, width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: 10, left: -10, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: 30, right: 50, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
            {/* Content */}
            <div style={{ position: "relative", zIndex: 1, padding: "12px 14px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", letterSpacing: "0.08em", fontWeight: 600 }}>
                  {t("レポート", "Report")}
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", lineHeight: 1.1, marginTop: 2 }}>
                  Health
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>
                  Report <span style={{ fontSize: 14 }}>→</span>
                </div>
              </div>
            </div>
            {/* Floating stat badge */}
            <div style={{
              position: "absolute",
              top: 10,
              right: 10,
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              borderRadius: 10,
              padding: "3px 8px",
              zIndex: 2,
              pointerEvents: "none",
            }}>
              87/100
            </div>
            {/* Large decorative icon */}
            <Activity size={52} strokeWidth={1.5} style={{
              position: "absolute",
              right: -8,
              bottom: -8,
              color: "rgba(255,255,255,0.15)",
              pointerEvents: "none",
            }} />
          </Link>

          {/* Breeds Card */}
          <Link
            to="/breeds"
            className="relative overflow-hidden"
            style={{
              height: 90,
              borderRadius: 20,
              background: "linear-gradient(135deg, #F093A0 0%, #E8829A 100%)",
              boxShadow: "0 8px 24px rgba(232,130,154,0.35)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(232,130,154,0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(232,130,154,0.35)";
            }}
          >
            {/* Inner highlight */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "rgba(255,255,255,0.3)", zIndex: 2, pointerEvents: "none" }} />
            {/* Decorative circles */}
            <div style={{ position: "absolute", top: -15, right: 25, width: 55, height: 55, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: 5, left: -5, width: 45, height: 45, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: 25, right: 55, width: 75, height: 75, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
            {/* Content */}
            <div style={{ position: "relative", zIndex: 1, padding: "12px 14px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", letterSpacing: "0.08em", fontWeight: 600 }}>
                  {t("犬種図鑑", "Breeds")}
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", lineHeight: 1.1, marginTop: 2 }}>
                  Breed
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>
                  Guide <span style={{ fontSize: 14 }}>→</span>
                </div>
              </div>
            </div>
            {/* Floating badge */}
            <div style={{
              position: "absolute",
              top: 10,
              right: 10,
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              borderRadius: 10,
              padding: "3px 8px",
              zIndex: 2,
              pointerEvents: "none",
            }}>
              {t("200+ 犬種", "200+ Breeds")}
            </div>
            {/* Large decorative icon */}
            <PawPrint size={52} strokeWidth={1.5} style={{
              position: "absolute",
              right: -8,
              bottom: -8,
              color: "rgba(255,255,255,0.15)",
              pointerEvents: "none",
            }} />
          </Link>
        </div>
      </div>

      {editOpen && <EditProfileSheet onClose={() => setEditOpen(false)} />}
    </AppShell>
  );
}

function EditProfileSheet({ onClose }: { onClose: () => void }) {
  const t = useT();
  const { pet, updatePet } = usePet();
  const [name, setName] = useState(pet.name);
  const [breedJp, setBreedJp] = useState(pet.breedJp);
  const [age, setAge] = useState<string>(pet.age != null ? String(pet.age) : "");
  const [weight, setWeight] = useState<string>(pet.weight != null ? String(pet.weight) : "");

  const save = () => {
    const b = BREEDS.find((x) => x.jp === breedJp);
    updatePet({
      name: name.trim(),
      breedJp,
      breedEn: b?.en ?? pet.breedEn,
      breed: BREED_KEY_BY_JP[breedJp] ?? pet.breed,
      age: age ? Number(age) : null,
      weight: weight ? Number(weight) : null,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(44,44,44,0.4)" }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md flex flex-col"
        style={{ background: "#FFFFFF", borderRadius: "32px 32px 0 0", boxShadow: "0 -8px 32px rgba(0,0,0,0.1)", maxHeight: "85vh" }}
      >
        <div className="mx-auto mt-3 mb-2 rounded-full" style={{ width: 32, height: 4, background: "#E8E0DC" }} />
        <div className="px-5 pb-3 flex items-center justify-between">
          <h3 className="text-[15px] font-semibold" style={{ color: "#2C2C2C" }}>{t("プロフィール編集", "Edit Profile")}</h3>
          <button onClick={onClose}><X className="w-5 h-5" style={{ color: "#8A8A8A" }} /></button>
        </div>
        <div className="px-5 pb-4 space-y-3 overflow-y-auto">
          <Field label={t("名前", "Name")}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("例: ハナ", "e.g. Hana")}
              className="w-full h-[48px] rounded-[12px] px-4 text-[15px] outline-none"
              style={{ background: "#FAFAF8", border: "1.5px solid #EDE8E4", color: "#2C2C2C" }}
            />
          </Field>
          <Field label={t("犬種", "Breed")}>
            <select
              value={breedJp}
              onChange={(e) => setBreedJp(e.target.value)}
              className="w-full h-[48px] rounded-[12px] px-3 text-[15px] outline-none"
              style={{ background: "#FAFAF8", border: "1.5px solid #EDE8E4", color: "#2C2C2C" }}
            >
              {BREEDS.map((b) => (
                <option key={b.jp} value={b.jp}>{b.jp} / {b.en}</option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("年齢", "Age")}>
              <input
                value={age} onChange={(e) => setAge(e.target.value)} type="number" placeholder="3"
                className="w-full h-[48px] rounded-[12px] px-4 text-[15px] outline-none"
                style={{ background: "#FAFAF8", border: "1.5px solid #EDE8E4", color: "#2C2C2C" }}
              />
            </Field>
            <Field label={t("体重 (kg)", "Weight (kg)")}>
              <input
                value={weight} onChange={(e) => setWeight(e.target.value)} type="number" placeholder="8.5"
                className="w-full h-[48px] rounded-[12px] px-4 text-[15px] outline-none"
                style={{ background: "#FAFAF8", border: "1.5px solid #EDE8E4", color: "#2C2C2C" }}
              />
            </Field>
          </div>
        </div>
        <div className="px-5 pb-5 pt-2 space-y-2" style={{ borderTop: "1px solid #F5F0EC" }}>
          <button
            onClick={save}
            className="w-full h-12 rounded-2xl text-white text-[15px] font-bold"
            style={{ background: "linear-gradient(135deg, #E8829A, #D86F88)", boxShadow: "0 6px 18px rgba(232,130,154,0.35)" }}
          >
            {t("保存", "Save Changes")}
          </button>
          <button onClick={onClose} className="w-full h-10 text-[13px] font-medium" style={{ color: "#8A8A8A" }}>
            {t("キャンセル", "Cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="text-[12px] font-semibold mb-1.5" style={{ color: "#2C2C2C" }}>{label}</div>
      {children}
    </div>
  );
}

function Chip({ children, bg, color, border }: { children: ReactNode; bg: string; color: string; border: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      fontSize: 11, fontWeight: 600,
      background: bg, color, border: `1px solid ${border}`,
      borderRadius: 20, padding: "3px 10px", letterSpacing: "0.02em",
    }}>{children}</span>
  );
}

function ScoreRing({ value }: { value: number }) {
  const r = 32, c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <div className="relative" style={{ width: 80, height: 80 }}>
      <svg className="-rotate-90" width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} stroke="#E0F0E8" strokeWidth="6" fill="none"/>
        <circle cx="40" cy="40" r={r} stroke={JP.matcha} strokeWidth="6" fill="none" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off} style={{ transition: "stroke-dashoffset 1.2s ease" }}/>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div style={{ fontSize: 22, fontWeight: 800, color: JP.sumi, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 9, color: JP.usuzumi, marginTop: 2 }}>/100</div>
      </div>
    </div>
  );
}
