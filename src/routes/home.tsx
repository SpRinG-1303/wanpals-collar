import { createFileRoute, Link } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { useEffect, useState, type ReactNode } from "react";
import { DAILY_FACTS } from "@/lib/mock";
import {
  Brain, Microscope, Activity, Thermometer, MapPin, Wind, Sun, GitMerge,
  PawPrint, Search, SlidersHorizontal, ChevronDown, Bluetooth,
  BatteryMedium, ArrowRight, type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { usePet, displayName } from "@/context/PetContext";

export const Route = createFileRoute("/home")({ component: Home });

/* ---------- Tokens ---------- */
const T = {
  card: "#FFFFFF",
  ink: "var(--text-primary)",
  sub: "var(--text-secondary)",
  faint: "var(--text-placeholder)",
  accent: "var(--accent-sakura)",
  accentDark: "var(--accent-sakura-dark)",
  accentSoft: "var(--accent-sakura-soft)",
  border: "var(--border-subtle)",
  ok: "var(--success-foreground)",
  okDot: "var(--success)",
};

const CARD_SHADOW = "0 2px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)";

function Card({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: T.card, borderRadius: 18, boxShadow: CARD_SHADOW, ...style }}>
      {children}
    </div>
  );
}

/* Small caps editorial section label */
function SectionLabel({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div
      className="flex items-center justify-between"
      style={{ margin: "24px 2px 10px" }}
    >
      <span
        style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.09em",
          color: T.sub, textTransform: "uppercase",
        }}
      >
        {children}
      </span>
      {right}
    </div>
  );
}

/* ---------- AI monitoring modules ---------- */
type Module = {
  Icon: LucideIcon;
  en: string;
  status: "Normal" | "Active";
  to: string;
};

const MODULES: Module[] = [
  { Icon: Brain, en: "Bark", status: "Normal", to: "/bark-sense" },
  { Icon: Microscope, en: "Skin", status: "Normal", to: "/skin-sense" },
  { Icon: Activity, en: "Motion", status: "Active", to: "/motion-sense" },
  { Icon: Thermometer, en: "Temperature", status: "Normal", to: "/temp-sense" },
  { Icon: MapPin, en: "Location", status: "Active", to: "/map" },
  { Icon: Wind, en: "Pressure", status: "Normal", to: "/pressure-sense" },
  { Icon: Sun, en: "Light", status: "Normal", to: "/light-sense" },
  { Icon: GitMerge, en: "Combine", status: "Normal", to: "/report" },
];

/* Recent health scores trending up to 87 */
const TREND = [78, 81, 79, 83, 82, 85, 87];

function TrendSpark() {
  const w = 96, h = 40, min = 76, max = 89;
  const pts = TREND.map((v, i) => {
    const x = (i / (TREND.length - 1)) * w;
    const y = h - 4 - ((v - min) / (max - min)) * (h - 10);
    return [Math.round(x * 10) / 10, Math.round(y * 10) / 10] as const;
  });
  const line = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
  const last = pts[pts.length - 1];
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden>
      <path d={`${line} L${w},${h} L0,${h} Z`} fill="var(--accent-sakura)" opacity={0.08} />
      <path d={line} fill="none" stroke="var(--accent-sakura)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r={3} fill="var(--accent-sakura)" stroke="#fff" strokeWidth={1.5} />
    </svg>
  );
}

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

  const filtered = query.trim()
    ? MODULES.filter((m) => m.en.toLowerCase().includes(query.trim().toLowerCase()))
    : MODULES;

  return (
    <AppShell titleJp="" titleEn="" noPadding>
      <div style={{ padding: "6px 18px 0" }}>

        {/* Location row */}
        <div className="flex items-center justify-between" style={{ marginTop: 4 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 10, color: T.sub, fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase" }}>
              Location
            </div>
            <div className="flex items-center" style={{ gap: 5, marginTop: 3 }}>
              <MapPin size={15} strokeWidth={2.2} style={{ color: T.accent, flexShrink: 0 }} />
              <span style={{ fontSize: 15, fontWeight: 700, color: T.ink, letterSpacing: "-0.01em" }}>Bandra, Mumbai</span>
              <ChevronDown size={14} strokeWidth={2.2} style={{ color: T.sub }} />
            </div>
          </div>
          <Link
            to="/settings"
            aria-label="Settings"
            className="flex items-center justify-center"
            style={{
              width: 38, height: 38, borderRadius: 12, flexShrink: 0,
              background: T.card, boxShadow: CARD_SHADOW, color: T.sub,
            }}
          >
            <SlidersHorizontal size={17} strokeWidth={1.9} />
          </Link>
        </div>

        {/* Search */}
        <div
          className="flex items-center"
          style={{
            height: 44, marginTop: 14, background: T.card, borderRadius: 13,
            boxShadow: CARD_SHADOW, padding: "0 14px", gap: 10,
          }}
        >
          <Search size={17} strokeWidth={1.9} style={{ color: T.faint, flexShrink: 0 }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search health insights…"
            className="flex-1 outline-none"
            style={{ border: "none", background: "transparent", height: "100%", fontSize: 13.5, color: T.ink, minWidth: 0 }}
          />
        </div>

        {/* Health hero — premium dashboard card */}
        <Link to="/report" style={{ display: "block", marginTop: 16, textDecoration: "none" }}>
          <Card style={{ padding: "18px 18px 14px" }}>
            <div className="flex items-start justify-between">
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.09em", color: T.sub, textTransform: "uppercase" }}>
                  {dogName}&rsquo;s Health
                </div>
                <div className="flex items-baseline" style={{ gap: 5, marginTop: 6 }}>
                  <span style={{ fontSize: 42, fontWeight: 800, color: T.ink, lineHeight: 1, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>
                    {score}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: T.faint }}>/ 100</span>
                </div>
                <div className="flex items-center" style={{ gap: 6, marginTop: 7 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.okDot, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.ok }}>Healthy today</span>
                </div>
              </div>
              <div style={{ flexShrink: 0, marginTop: 14 }}>
                <TrendSpark />
              </div>
            </div>

            <div className="flex items-center" style={{ gap: 6, marginTop: 12 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: T.okDot, flexShrink: 0 }} />
              <span style={{ fontSize: 11.5, color: T.sub, fontWeight: 500 }}>All monitoring systems normal</span>
            </div>

            <div style={{ height: 1, background: T.border, margin: "12px 0" }} />

            <div className="flex items-center justify-between">
              <div className="flex items-center" style={{ gap: 5, color: T.sub }}>
                <Bluetooth size={13} strokeWidth={1.9} style={{ color: T.accent }} />
                <span style={{ fontSize: 11, fontWeight: 600 }}>Collar</span>
                <BatteryMedium size={13} strokeWidth={1.8} style={{ marginLeft: 4 }} />
                <span style={{ fontSize: 11, fontWeight: 600 }}>87%</span>
              </div>
              <span className="flex items-center" style={{ gap: 4, fontSize: 12.5, fontWeight: 700, color: T.accent }}>
                View Health Report <ArrowRight size={14} strokeWidth={2.2} />
              </span>
            </div>
          </Card>
        </Link>

        {/* Pawsitive Insight — compact editorial card */}
        <SectionLabel>Pawsitive Insight</SectionLabel>
        <motion.div key={factIdx} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <Card style={{ padding: "14px 16px" }}>
            <div className="flex" style={{ gap: 12 }}>
              <div
                className="flex items-center justify-center"
                style={{ width: 34, height: 34, borderRadius: 10, background: T.accentSoft, flexShrink: 0 }}
              >
                <PawPrint size={16} strokeWidth={1.9} style={{ color: T.accent }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.accent, letterSpacing: "0.01em" }}>
                  Did you know?
                </div>
                <div style={{ marginTop: 3, fontSize: 13.5, lineHeight: 1.55, color: T.ink, fontWeight: 500 }}>
                  {language === "english" ? fact.en : fact.jp}
                </div>
                {language === "mixed" && (
                  <div style={{ marginTop: 4, fontSize: 11, color: T.sub, lineHeight: 1.5 }}>{fact.en}</div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* AI Monitoring — one coherent system in a single card */}
        <SectionLabel
          right={
            <span className="flex items-center" style={{ gap: 5 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: T.okDot }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: T.sub }}>All systems normal</span>
            </span>
          }
        >
          AI Monitoring
        </SectionLabel>
        <Card style={{ padding: "6px 0" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 20, textAlign: "center", fontSize: 13, color: T.sub }}>
              No modules match &ldquo;{query}&rdquo;.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
              {filtered.map((m) => {
                const Icon = m.Icon;
                return (
                  <Link
                    key={m.en}
                    to={m.to}
                    className="flex flex-col items-center"
                    style={{ padding: "14px 4px 12px", gap: 7 }}
                    aria-label={m.en}
                  >
                    <Icon size={22} strokeWidth={1.6} style={{ color: T.accentDark }} />
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: T.ink, lineHeight: 1 }}>
                      {m.en}
                    </span>
                    <span className="flex items-center" style={{ gap: 3 }}>
                      <span
                        style={{
                          width: 4, height: 4, borderRadius: "50%",
                          background: m.status === "Active" ? T.accent : T.okDot,
                        }}
                      />
                      <span style={{ fontSize: 9.5, fontWeight: 500, color: T.faint, lineHeight: 1 }}>
                        {m.status}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </Card>

        {/* Quick Access — compact consistent cards */}
        <SectionLabel>Quick Access</SectionLabel>
        <div className="flex" style={{ gap: 10, marginBottom: 20 }}>
          {[
            { to: "/report", Icon: Activity, label: "Health Report", sub: "87/100" },
            { to: "/breeds", Icon: PawPrint, label: "Breed Guide", sub: "200+ breeds" },
          ].map((q) => (
            <Link
              key={q.label}
              to={q.to}
              className="flex items-center flex-1"
              style={{
                gap: 11, padding: "12px 14px", background: T.card,
                borderRadius: 16, boxShadow: CARD_SHADOW, minWidth: 0,
              }}
              aria-label={q.label}
            >
              <div
                className="flex items-center justify-center"
                style={{ width: 36, height: 36, borderRadius: 11, background: T.accentSoft, flexShrink: 0 }}
              >
                <q.Icon size={17} strokeWidth={1.8} style={{ color: T.accent }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: T.ink, lineHeight: 1.25 }}>{q.label}</div>
                <div style={{ fontSize: 10.5, fontWeight: 500, color: T.sub, marginTop: 1 }}>{q.sub}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
