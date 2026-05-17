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
  { Icon: MapPin, accent: JP.matcha, iconBg: "#E8F5EE", strip: JP.matchaStrip, to: "/location-sense",
    jp: "位置センサー", en: "LocationSense", subJp: "GPS + 地図", subEn: "GPS + Map", valJp: "渋谷区, 東京", valEn: "Shibuya, Tokyo" },
  { Icon: Wind, accent: JP.yuzu, iconBg: "#FFF8DC", strip: JP.yuzuStrip, to: "/pressure-sense",
    jp: "圧力センサー", en: "PressureSense", subJp: "圧力データ", subEn: "Pressure Data", valJp: "正常範囲", valEn: "Normal Range" },
  { Icon: Sun, accent: "#C4920A", iconBg: "#FFFBCC", strip: "linear-gradient(90deg,#FFF8DC,#FFFEF0)", to: "/light-sense",
    jp: "光センサー", en: "LightSense AI", subJp: "RGB光データ", subEn: "RGB Light Data", valJp: "室内", valEn: "Indoor" },
  { Icon: GitMerge, accent: "#9B72CF", iconBg: "#F0E8FF", strip: "linear-gradient(90deg,#F0E8FF,#F8F5FF)", to: "/combine-sense",
    jp: "総合分析", en: "CombineSense", subJp: "総合解析", subEn: "Combined Analysis", valJp: "87/100", valEn: "87/100" },
];

/* ---------- Hero (postcard-style, watercolour Japan) ---------- */
type TimeBand = "morning" | "afternoon" | "evening" | "night";
function getTimeBand(): TimeBand {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "morning";
  if (h >= 12 && h < 18) return "afternoon";
  if (h >= 18 && h < 22) return "evening";
  return "night";
}

const SCENE: Record<TimeBand, { bg: string; sun: string; fuji: string; blossom: string }> = {
  morning:   { bg: "linear-gradient(135deg,#FFF8F0 0%,#FFE8EE 100%)", sun: "#FFD4A8", fuji: "#C5D8E8", blossom: "#FFB7C5" },
  afternoon: { bg: "linear-gradient(135deg,#E8F4FF 0%,#D4EEFF 100%)", sun: "#F2C96E", fuji: "#8FB5C8", blossom: "#FFC8D0" },
  evening:   { bg: "linear-gradient(135deg,#FFE8D0 0%,#FFD0B0 100%)", sun: "#F4A56B", fuji: "#7B6480", blossom: "#FFB7C5" },
  night:     { bg: "linear-gradient(135deg,#E8EEF8 0%,#D4DCF0 100%)", sun: "#FFF4D8", fuji: "#9AA0B8", blossom: "#E8D8E4" },
};

function PostcardScene({ band }: { band: TimeBand }) {
  const s = SCENE[band];
  return (
    <div className="absolute inset-y-0 right-0" style={{ width: "55%", background: s.bg, overflow: "hidden" }}>
      {/* Sun / moon */}
      {band === "night" ? (
        <div style={{ position: "absolute", top: 22, right: 28, width: 38, height: 38, borderRadius: "50%", background: s.sun, boxShadow: `inset -10px 2px 0 0 #D4DCF0` }} />
      ) : (
        <div style={{ position: "absolute", top: 18, right: 24, width: 70, height: 70, borderRadius: "50%", background: s.sun, opacity: 0.6 }} />
      )}

      {/* Stars (night) */}
      {band === "night" && [[18,30],[44,18],[78,42],[110,22],[140,48],[60,60]].map(([l,t],i)=>(
        <div key={i} style={{ position:"absolute", left:l, top:t, width: i%2?2:3, height: i%2?2:3, borderRadius:"50%", background:"#C8C0E8" }}/>
      ))}

      {/* Clouds (afternoon) */}
      {band === "afternoon" && [[20,40,42],[100,22,36]].map(([l,t,w],i)=>(
        <div key={i} style={{ position:"absolute", left:l, top:t, width:w, height:(w as number)*0.45, background:"#FFFFFF", opacity:0.85, borderRadius: 999 }}/>
      ))}

      {/* Diagonal sakura branch */}
      <svg style={{ position:"absolute", top: 8, left: 4, width: 130, height: 70 }} viewBox="0 0 130 70" fill="none">
        <path d="M2 60 Q40 30 124 6" stroke="#C4A882" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {/* Blossom dots along branch */}
      {[[18,52,8],[34,42,6],[52,32,9],[72,22,7],[92,14,10],[110,8,6],[40,58,5,0.5],[80,40,4,0.55]].map((p,i)=>{
        const [l,t,sz,op] = p as [number,number,number,number?];
        return <div key={i} style={{ position:"absolute", left:l, top:t, width:sz, height:sz, borderRadius:"50%", background: s.blossom, opacity: op ?? 0.95 }}/>;
      })}

      {/* Mount Fuji */}
      <svg style={{ position:"absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 110, height: 80 }} viewBox="0 0 110 80" fill="none">
        <path d="M55 6 L104 76 L6 76 Z" fill={s.fuji} />
        <path d="M55 6 L70 28 Q55 22 40 28 Z" fill="#FFFFFF" opacity={band === "night" ? 0.7 : 0.95}/>
        <ellipse cx="55" cy="76" rx="55" ry="4" fill="#FFFFFF" opacity={band === "night" ? 0.15 : 0.5}/>
      </svg>

      {/* Falling petals */}
      {band !== "night" && [
        { left: "20%", delay: "0s", dur: "8s" },
        { left: "55%", delay: "2.5s", dur: "9s" },
        { left: "80%", delay: "5s", dur: "7s" },
      ].map((p,i)=>(
        <div key={i} style={{
          position:"absolute", left: p.left, top: -6, width: 6, height: 4,
          background: s.blossom, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
          opacity: 0.7, animation: `petalFall ${p.dur} linear ${p.delay} infinite`,
        }}/>
      ))}
    </div>
  );
}

function HeroPostcard({ score, name, mood }: { score: number; name: string; mood: string }) {
  const t = useT();
  // Default to a stable band for SSR; refine on client to avoid hydration mismatch.
  const [band, setBand] = useState<TimeBand>("afternoon");
  useEffect(() => { setBand(getTimeBand()); }, []);
  const labelJp = band === "morning" ? "おはよう" : band === "afternoon" ? "こんにちは" : band === "evening" ? "こんばんは" : "おやすみ";
  const labelEn = band === "morning" ? "Good Morning" : band === "afternoon" ? "Good Afternoon" : band === "evening" ? "Good Evening" : "Good Night";


  return (
    <div
      className="relative"
      style={{
        margin: "12px 16px 4px",
        height: 160,
        borderRadius: 24,
        overflow: "hidden",
        background: JP.card,
        boxShadow: "0 4px 24px rgba(232,130,154,0.15)",
      }}
    >
      <PostcardScene band={band} />

      {/* Left content */}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "50%", padding: "20px 0 20px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 11, color: JP.sakura, letterSpacing: "0.05em", fontWeight: 600 }}>
            {t(`${labelJp} / ${labelEn}`, `${labelEn} / ${labelJp}`)}
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: JP.sumi, lineHeight: 1.1, marginTop: 4 }}>
            {name}
          </div>
          <div className="flex items-center" style={{ gap: 6, marginTop: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: JP.matcha, display: "inline-block" }} />
            <span style={{ fontSize: 12, color: JP.matcha, fontWeight: 500 }}>
              {mood}
            </span>
          </div>
        </div>

        <div>
          <span style={{
            display: "inline-block",
            background: JP.sakuraSoft,
            color: JP.sakura,
            borderRadius: 20,
            padding: "4px 12px",
            fontSize: 11,
            fontWeight: 700,
            fontVariantNumeric: "tabular-nums",
          }}>
            {score} / 100 ✦
          </span>
        </div>
      </div>
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
  const { pet } = usePet();
  useEffect(() => {
    const tm = setInterval(() => setFactIdx((i) => (i + 1) % DAILY_FACTS.length), 10000);
    return () => clearInterval(tm);
  }, []);
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
      <HeroPostcard score={score} name={heroName} mood={mood} />

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
                <span style={{ fontSize: 11, fontWeight: 700, color: JP.yuzu, fontVariantNumeric: "tabular-nums" }}>#{1247 + factIdx}</span>
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
