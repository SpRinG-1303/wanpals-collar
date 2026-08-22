import { createFileRoute, Link } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { useEffect, useState, type ReactNode } from "react";
import { DAILY_FACTS } from "@/lib/mock";
import {
  Brain, Microscope, Activity, Thermometer, MapPin, Wind, Sun, GitMerge,
  Bluetooth, BatteryMedium, PawPrint, Search, SlidersHorizontal,
  ChevronDown, ArrowUpRight, HeartHandshake, Stethoscope, type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { usePet, displayName } from "@/context/PetContext";
import { useGeoLocation } from "@/lib/useGeoLocation";
import { useAuth } from "@/context/AuthContext";
import VetHome from "@/components/vet/VetHome";

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
  const { session, hydrated } = useAuth();
  const [factIdx, setFactIdx] = useState(0);
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [collarState, setCollarState] = useState<"idle" | "connecting" | "connected">("idle");
  const { language } = useLanguage();
  const { pet } = usePet();
  const geo = useGeoLocation();
  useEffect(() => {
    const tm = setInterval(() => setFactIdx((i) => (i + 1) % DAILY_FACTS.length), 10000);
    return () => clearInterval(tm);
  }, []);
  // Wait for the session to load from storage so vets never see a flash
  // of the pet-owner home (or vice versa) on reload.
  if (!hydrated) return null;
  // Veterinarians get a dedicated clinical console instead of the owner home
  if (session?.role === "vet") return <VetHome />;

  const fact = DAILY_FACTS[factIdx];
  const score = 87;

  const dogName = displayName(pet);
  const mood = pet.name?.trim() ? `${dogName} is feeling great` : "Feeling great";

  const filtered = (query.trim()
    ? sensors.filter((s) =>
        (s.en + " " + s.subEn).toLowerCase().includes(query.trim().toLowerCase())
      )
    : sensors
  ).map((s) => (s.en === "LocationSense" ? { ...s, valEn: geo.loading ? "Locating…" : geo.short } : s));

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
              <span style={{ fontSize: 15, fontWeight: 700, color: JP.sumi }}>
                {geo.loading && !geo.coords ? "Locating…" : geo.label}
              </span>
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
          <button
            onClick={() => setViewMode((m) => (m === "grid" ? "list" : "grid"))}
            aria-label="Toggle sensor view"
            className="flex items-center justify-center active:scale-95 transition-transform"
            style={{
              width: 48, height: 48, borderRadius: 14, flexShrink: 0,
              background: viewMode === "list"
                ? "var(--acc-pale)"
                : `linear-gradient(135deg, ${JP.sakura}, var(--accent-sakura-dark))`,
              boxShadow: "0 6px 16px color-mix(in oklab, var(--accent-sakura) 35%, transparent)",
              color: viewMode === "list" ? JP.sakura : "#FFFFFF",
            }}
          >
            <SlidersHorizontal size={19} strokeWidth={2.2} />
          </button>
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

        {/* Daily fact — clean white card, above sensors (lightweight CSS fade, no animation lib) */}
        <style>{`@keyframes factFade { from { opacity: 0; } to { opacity: 1; } }`}</style>
        <SectionHeader en="Daily Dog Fact" />
        <div key={factIdx} style={{ animation: "factFade 0.3s ease" }}>
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
        </div>

        {/* Collar status — compact box: connection state + battery + connect */}
        <SectionHeader en="Collar Status" />
        <JCard style={{ padding: "12px 14px" }}>
          <div className="flex items-center" style={{ gap: 10 }}>
            <div
              className="flex items-center justify-center"
              style={{ width: 38, height: 38, borderRadius: 12, background: "var(--acc-pale)", flexShrink: 0 }}
            >
              <Bluetooth
                size={18}
                strokeWidth={2}
                className={collarState === "connecting" ? "animate-pulse" : ""}
                style={{ color: collarState === "connected" ? JP.matcha : JP.sakura }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: JP.sumi, lineHeight: 1.2 }}>
                {collarState === "connected"
                  ? "Collar Connected"
                  : collarState === "connecting"
                    ? "Pairing…"
                    : "Collar Not Connected"}
              </div>
              <div style={{ fontSize: 11, color: JP.usuzumi, marginTop: 1 }}>
                {collarState === "connected" ? "Synced just now" : "Tap connect to sync"}
              </div>
            </div>
            <div
              className="flex items-center"
              style={{ gap: 4, flexShrink: 0, background: "var(--acc-pale)", borderRadius: 20, padding: "5px 10px" }}
              aria-label="Collar battery 87 percent"
            >
              <BatteryMedium size={14} strokeWidth={2} style={{ color: JP.sora }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: JP.sora, fontVariantNumeric: "tabular-nums" }}>87%</span>
            </div>
            <button
              disabled={collarState === "connecting"}
              onClick={() => {
                if (collarState === "connected") {
                  setCollarState("idle");
                  toast.info("Collar disconnected");
                  return;
                }
                setCollarState("connecting");
                setTimeout(() => {
                  setCollarState("connected");
                  toast.success("Collar connected — data synced just now");
                }, 1400);
              }}
              className="flex items-center justify-center active:scale-95 transition-transform"
              style={{
                height: 34, padding: "0 14px", borderRadius: 17, border: "none", flexShrink: 0,
                fontSize: 12, fontWeight: 700,
                background: collarState === "connected" ? "var(--accent-matcha)" : JP.sakura,
                color: "#FFFFFF",
                opacity: collarState === "connecting" ? 0.8 : 1,
              }}
            >
              {collarState === "connecting" ? "Pairing…" : collarState === "connected" ? "On" : "Connect"}
            </button>
          </div>
        </JCard>

        {/* Sensor quick icons — all 8 visible in one line, no scrolling */}
        <SectionHeader en="Sense AI" />
        {filtered.length === 0 ? (
          <JCard style={{ padding: 20, textAlign: "center" }}>
            <div style={{ fontSize: 13, color: JP.usuzumi }}>No sensors match “{query}”.</div>
          </JCard>
        ) : viewMode === "list" ? (
          <JCard style={{ padding: 6 }}>
            {filtered.map((s, i) => {
              const Icon = s.Icon;
              return (
                <Link
                  key={s.en}
                  to={s.to}
                  className="flex items-center"
                  style={{
                    gap: 12, padding: "12px 10px",
                    borderTop: i === 0 ? "none" : "1px solid var(--border-subtle)",
                  }}
                >
                  <div
                    className="flex items-center justify-center"
                    style={{ width: 44, height: 44, borderRadius: "50%", background: s.iconBg, flexShrink: 0 }}
                  >
                    <Icon size={20} strokeWidth={1.8} style={{ color: s.accent }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: JP.sumi }}>{s.en}</div>
                    <div style={{ fontSize: 11, color: JP.usuzumi, marginTop: 1 }}>{s.subEn}</div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: s.accent, flexShrink: 0 }}>{s.valEn}</span>
                </Link>
              );
            })}
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
