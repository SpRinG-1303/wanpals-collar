import { createFileRoute, Link } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { useEffect, useState, type ReactNode } from "react";
import { DAILY_FACTS } from "@/lib/mock";
import {
  Brain, Microscope, Activity, Thermometer, MapPin, Wind, Sun, GitMerge,
  Check, BatteryMedium, Signal, Bluetooth, PawPrint, Search, SlidersHorizontal,
  ChevronDown, ArrowUpRight, type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { usePet, displayName } from "@/context/PetContext";

export const Route = createFileRoute("/home")({ component: Home });

/* ---------- Theme tokens (colors unchanged) ---------- */
const JP = {
  card: "#FFFFFF",
  sumi: "var(--text-primary)",
  usuzumi: "var(--text-secondary)",
  sakura: "var(--accent-sakura)",
  sakuraSoft: "var(--accent-sakura-soft)",
  fuji: "var(--accent-fuji)",
  sora: "var(--accent-sora)",
  matcha: "var(--accent-matcha)",
  momiji: "var(--acc-strong)",
  yuzu: "var(--accent-yuzu)",
};

const CARD_SHADOW = "0 2px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)";

/* Clean white card — reference style: no strips, soft shadow, 20px radius */
function JCard({
  children,
  style,
}: {
  children: ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: JP.card,
        borderRadius: 20,
        boxShadow: CARD_SHADOW,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* Section header — reference style: bold title left, "See all" link right */
function SectionHeader({ en, to }: { en: string; to?: string }) {
  const inner = (
    <>
      <div style={{ fontSize: 16, fontWeight: 700, color: JP.sumi, letterSpacing: "-0.01em" }}>
        {en}
      </div>
      {to && (
        <span style={{ fontSize: 12, fontWeight: 600, color: JP.sakura }}>
          See all
        </span>
      )}
    </>
  );
  const style: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "22px 0 12px",
  };
  return to ? (
    <Link to={to} style={style}>{inner}</Link>
  ) : (
    <div style={style}>{inner}</div>
  );
}

/* ---------- Sensors ---------- */
type Sensor = {
  Icon: LucideIcon;
  accent: string; iconBg: string;
  en: string; subEn: string; valEn: string;
  to: string;
  progress?: number;
  noteEn?: string;
};

const sensors: Sensor[] = [
  { Icon: Brain, accent: JP.fuji, iconBg: "var(--bg-card-lavender)", to: "/bark-sense",
    en: "BarkSense AI", subEn: "Bark Analysis", valEn: "Calm" },
  { Icon: Microscope, accent: JP.sakura, iconBg: "var(--bg-card-sakura)", to: "/skin-sense",
    en: "SkinSense AI", subEn: "Skin Health", valEn: "Normal" },
  { Icon: Activity, accent: JP.sora, iconBg: "var(--acc2-pale)", to: "/motion-sense",
    en: "MotionSense", subEn: "Activity Track", valEn: "2,340 steps", progress: 65 },
  { Icon: Thermometer, accent: JP.momiji, iconBg: "var(--acc-pale)", to: "/temp-sense",
    en: "TempSense AI", subEn: "Body Temp", valEn: "38.5°C", noteEn: "Normal Range" },
  { Icon: MapPin, accent: JP.matcha, iconBg: "var(--acc-pale)", to: "/map",
    en: "LocationSense", subEn: "GPS + Map", valEn: "Bandra, Mumbai" },
  { Icon: Wind, accent: JP.yuzu, iconBg: "var(--acc-pale)", to: "/pressure-sense",
    en: "PressureSense", subEn: "Pressure Data", valEn: "Normal Range" },
  { Icon: Sun, accent: "var(--acc-deep)", iconBg: "var(--acc-pale)", to: "/light-sense",
    en: "LightSense AI", subEn: "RGB Light Data", valEn: "Indoor" },
  { Icon: GitMerge, accent: "var(--accent-fuji)", iconBg: "var(--bg-card-lavender)", to: "/report",
    en: "CombineSense", subEn: "Combined Analysis", valEn: "87/100" },
];

/* ---------- Page ---------- */
function Home() {
  const [factIdx, setFactIdx] = useState(0);
  const [query, setQuery] = useState("");
  const { language } = useLanguage();
  const { pet } = usePet();
  useEffect(() => {
    const tm = setInterval(() => setFactIdx((i) => (i + 1) % DAILY_FACTS.length), 10000);
    return () => clearInterval(tm);
  }, []);
  const fact = DAILY_FACTS[factIdx];
  const score = 87;

  const dogName = displayName(pet);
  const mood = pet.name?.trim() ? `${dogName} is feeling great` : "Feeling great";

  const filtered = query.trim()
    ? sensors.filter((s) =>
        (s.en + " " + s.subEn).toLowerCase().includes(query.trim().toLowerCase())
      )
    : sensors;

  return (
    <AppShell titleJp="" titleEn="" noPadding>
      <div style={{ padding: "8px 16px 0" }}>

        {/* Location header row — reference style */}
        <div className="flex items-center justify-between" style={{ marginTop: 4 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, color: JP.usuzumi, fontWeight: 500, letterSpacing: "0.04em" }}>
              Location
            </div>
            <div className="flex items-center" style={{ gap: 5, marginTop: 2 }}>
              <MapPin size={16} strokeWidth={2.2} style={{ color: JP.sakura, flexShrink: 0 }} />
              <span style={{ fontSize: 15, fontWeight: 700, color: JP.sumi }}>Bandra, Mumbai</span>
              <ChevronDown size={15} strokeWidth={2.2} style={{ color: JP.sumi }} />
            </div>
          </div>
          <Link
            to="/settings"
            aria-label="Settings"
            className="flex items-center justify-center"
            style={{
              width: 42, height: 42, borderRadius: 14, flexShrink: 0,
              background: "var(--acc-pale)",
              color: JP.sakura,
            }}
          >
            <SlidersHorizontal size={19} strokeWidth={2} />
          </Link>
        </div>

        {/* Search bar — reference style */}
        <div className="flex items-center" style={{ gap: 10, marginTop: 16 }}>
          <div
            className="flex items-center flex-1"
            style={{
              height: 48,
              background: JP.card,
              borderRadius: 14,
              boxShadow: CARD_SHADOW,
              padding: "0 14px",
              gap: 10,
              minWidth: 0,
            }}
          >
            <Search size={18} strokeWidth={2} style={{ color: "var(--text-placeholder)", flexShrink: 0 }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Senses…"
              className="flex-1 outline-none"
              style={{
                border: "none", background: "transparent", height: "100%",
                fontSize: 14, color: JP.sumi, minWidth: 0,
              }}
            />
          </div>
          <div
            className="flex items-center justify-center"
            style={{
              width: 48, height: 48, borderRadius: 14, flexShrink: 0,
              background: `linear-gradient(135deg, ${JP.sakura}, var(--accent-sakura-dark))`,
              boxShadow: "0 6px 16px color-mix(in oklab, var(--accent-sakura) 35%, transparent)",
              color: "#FFFFFF",
            }}
          >
            <SlidersHorizontal size={19} strokeWidth={2.2} />
          </div>
        </div>

        {/* Health overview — solid accent card, reference "upcoming schedule" style */}
        <Link
          to="/report"
          style={{
            display: "block",
            marginTop: 18,
            borderRadius: 20,
            background: "linear-gradient(135deg, var(--accent-sakura) 0%, var(--accent-sakura-dark) 100%)",
            boxShadow: "0 10px 28px color-mix(in oklab, var(--accent-sakura) 40%, transparent)",
            padding: 16,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative circles */}
          <div style={{ position: "absolute", top: -30, right: 40, width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -24, left: -16, width: 70, height: 70, borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />

          <div className="flex items-center" style={{ gap: 12, position: "relative", zIndex: 1 }}>
            <div
              className="flex items-center justify-center"
              style={{ width: 46, height: 46, borderRadius: "50%", background: "#FFFFFF", flexShrink: 0 }}
            >
              <PawPrint size={22} strokeWidth={2} style={{ color: JP.sakura }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.2 }}>
                Overall Health Score
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", marginTop: 2 }}>
                {mood}
              </div>
            </div>
            <div
              className="flex items-center justify-center"
              style={{ width: 40, height: 40, borderRadius: "50%", background: "#FFFFFF", flexShrink: 0 }}
            >
              <ArrowUpRight size={19} strokeWidth={2.4} style={{ color: JP.sakura }} />
            </div>
          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,0.25)", margin: "14px 0 12px", position: "relative", zIndex: 1 }} />

          <div className="flex items-center justify-between" style={{ position: "relative", zIndex: 1 }}>
            <div className="flex items-center" style={{ gap: 6 }}>
              <span className="relative inline-block" style={{ width: 8, height: 8 }}>
                <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#FFFFFF" }} />
                <span className="animate-ping" style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#FFFFFF", opacity: 0.6 }} />
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#FFFFFF", letterSpacing: "0.06em" }}>LIVE</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>· All sensors active</span>
            </div>
            <span style={{ fontSize: 17, fontWeight: 800, color: "#FFFFFF", fontVariantNumeric: "tabular-nums" }}>
              {score}<span style={{ fontSize: 12, fontWeight: 600, opacity: 0.8 }}> / 100</span>
            </span>
          </div>
        </Link>

        {/* Daily fact — clean white card, above sensors */}
        <SectionHeader en="Daily Dog Fact" />
        <motion.div key={factIdx} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <JCard style={{ padding: 16 }}>
            <div className="flex items-center" style={{ gap: 10 }}>
              <div
                className="flex items-center justify-center"
                style={{ width: 38, height: 38, borderRadius: 12, background: JP.sakuraSoft, flexShrink: 0 }}
              >
                <PawPrint size={18} strokeWidth={1.9} style={{ color: JP.sakura }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: JP.sumi }}>
                Did you know?
              </span>
            </div>
            <div style={{ marginTop: 10, fontSize: 14, lineHeight: 1.55, color: JP.sumi, fontWeight: 500 }}>
              {language === "english" ? fact.en : fact.jp}
            </div>
            {language === "mixed" && (
              <div style={{ marginTop: 6, fontSize: 11, color: JP.usuzumi, lineHeight: 1.5 }}>{fact.en}</div>
            )}
          </JCard>
        </motion.div>

        {/* Sensor quick icons — all 8 visible in one line, no scrolling */}
        <SectionHeader en="Sense AI" />
        {filtered.length === 0 ? (
          <JCard style={{ padding: 20, textAlign: "center" }}>
            <div style={{ fontSize: 13, color: JP.usuzumi }}>No sensors match “{query}”.</div>
          </JCard>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              rowGap: 18,
              columnGap: 8,
            }}
          >
            {filtered.map((s) => {
              const Icon = s.Icon;
              return (
                <Link
                  key={s.en}
                  to={s.to}
                  className="flex flex-col items-center"
                  style={{ gap: 8 }}
                  aria-label={s.en}
                >
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 58, height: 58, borderRadius: "50%",
                      background: s.iconBg,
                      boxShadow: "0 3px 10px rgba(0,0,0,0.06)",
                    }}
                  >
                    <Icon size={25} strokeWidth={1.8} style={{ color: s.accent }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: JP.usuzumi, textAlign: "center", lineHeight: 1.15, maxWidth: 74, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {s.en.replace(" AI", "").replace("Sense", "")}
                  </span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Collar status — white card + solid accent CTA */}
        <SectionHeader en="Collar Status" />
        <JCard style={{ padding: 16 }}>
          <div className="flex items-center" style={{ gap: 12 }}>
            <div
              className="flex items-center justify-center"
              style={{ width: 44, height: 44, borderRadius: 14, background: "var(--acc-pale)", flexShrink: 0 }}
            >
              <Check size={22} strokeWidth={2.5} style={{ color: JP.sora }} />
            </div>
            <div className="flex-1" style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: JP.sumi }}>Connected</div>
              <div style={{ fontSize: 12, color: JP.usuzumi, marginTop: 1 }}>Last sync: 2 minutes ago</div>
            </div>
          </div>

          <div style={{ height: 1, background: "var(--border-subtle)", margin: "14px 0" }} />

          <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
            <div className="flex items-center" style={{ gap: 8 }}>
              <BatteryMedium size={18} strokeWidth={1.6} style={{ color: JP.sora }} />
              <span style={{ fontSize: 13, color: JP.sumi, fontWeight: 500 }}>Battery</span>
            </div>
            <div className="flex items-center">
              <div style={{ width: 110, height: 6, background: "var(--acc-pale)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: "87%", height: "100%", background: JP.sora, borderRadius: 4 }} />
              </div>
              <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 700, color: JP.sora, fontVariantNumeric: "tabular-nums" }}>87%</span>
            </div>
          </div>

          <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
            <div className="flex items-center" style={{ gap: 8 }}>
              <Signal size={18} strokeWidth={1.6} style={{ color: JP.sora }} />
              <span style={{ fontSize: 13, color: JP.sumi, fontWeight: 500 }}>Signal Strength</span>
            </div>
            <div className="flex items-center">
              <div className="flex items-end" style={{ gap: 3 }}>
                {[6, 10, 14, 18].map((h) => (
                  <div key={h} style={{ width: 4, height: h, background: JP.sora, borderRadius: 2 }} />
                ))}
              </div>
              <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 600, color: JP.sora }}>Excellent</span>
            </div>
          </div>

          <button
            className="w-full flex items-center justify-center active:scale-[0.98] transition-transform"
            style={{
              background: `linear-gradient(135deg, ${JP.sakura}, var(--accent-sakura-dark))`,
              color: "#FFFFFF",
              border: "none",
              borderRadius: 14,
              height: 52,
              fontSize: 15,
              fontWeight: 700,
              gap: 8,
              boxShadow: "0 8px 20px color-mix(in oklab, var(--accent-sakura) 35%, transparent)",
            }}
          >
            <Bluetooth size={17} strokeWidth={2} />
            Connect Collar
          </button>
        </JCard>

        {/* Quick Access — circular icons matching the sensor row style */}
        <SectionHeader en="Quick Access" />
        <div className="flex" style={{ gap: 24, marginBottom: 20 }}>
          {[
            { to: "/report", Icon: Activity, label: "Health Report", sub: "87/100", bg: "var(--bg-card-lavender)", accent: "var(--accent-fuji)" },
            { to: "/breeds", Icon: PawPrint, label: "Breed Guide", sub: "200+ breeds", bg: JP.sakuraSoft, accent: JP.sakura },
          ].map((q) => (
            <Link
              key={q.label}
              to={q.to}
              className="flex flex-col items-center"
              style={{ width: 76, gap: 7 }}
              aria-label={q.label}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: q.bg,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                }}
              >
                <q.Icon size={24} strokeWidth={1.8} style={{ color: q.accent }} />
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: JP.sumi, lineHeight: 1.2 }}>{q.label}</div>
                <div style={{ fontSize: 9, fontWeight: 600, color: JP.usuzumi, marginTop: 1 }}>{q.sub}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
