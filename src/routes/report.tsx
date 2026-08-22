import { createFileRoute } from "@tanstack/react-router";
import AppShell, { TopBar } from "@/components/AppShell";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip,
  CartesianGrid, ReferenceLine, ReferenceArea,
} from "recharts";
import { useState, type ReactNode, type CSSProperties } from "react";
import {
  QrCode, FileDown, Activity, Thermometer, Footprints, Moon,
  Syringe, Check, Clock, AlertTriangle, Stethoscope, Cross, CheckCircle2,
} from "lucide-react";
import { useT, useLanguage } from "@/context/LanguageContext";
import { usePet, type PetProfile } from "@/context/PetContext";

export const Route = createFileRoute("/report")({ component: Report });

const TABS = ["1d", "1w", "1m", "3m", "6m", "4y"] as const;

/* ─────────── Earthy Palette ─────────── */
const C = {
  cafe: "#4C3D19",     // darkest — headings / strong text
  kombu: "#354024",    // deep green — body / active / accents
  moss: "#889063",     // mid — icons / muted accents / borders
  tan: "#CFBB99",      // warm neutral — soft fills
  bone: "#E5D7C4",     // lightest — surfaces / page bg
};

const glass: CSSProperties = {
  background: "#FFFFFF",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  border: "1.5px solid rgba(136, 144, 99, 0.25)",
  borderRadius: 20,
  boxShadow: "0 4px 24px rgba(76, 61, 25, 0.08)",
};

function Report() {
  const t = useT();
  const { language } = useLanguage();
  const { pet } = usePet();
  const [tab, setTab] = useState<(typeof TABS)[number]>("1w");

  const dogName = pet.name || (language === "english" ? "your dog" : "ワンちゃん");

  const dayLabels = language === "english"
    ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    : ["月", "火", "水", "木", "金", "土", "日"];

  const scoreData = [82, 85, 83, 87, 86, 88, 87].map((v, i) => ({ d: dayLabels[i], v }));
  const tempData = [38.3, 38.6, 38.4, 38.8, 38.5, 38.7, 38.5].map((v, i) => ({ d: dayLabels[i], v }));
  const stepsData = [1800, 2600, 2400, 2200, 2000, 2800, 3100].map((v, i) => ({ d: dayLabels[i], v }));
  const sleepData = [7.2, 8.1, 7.5, 6.8, 7.9, 8.4, 7.5].map((v, i) => ({ d: dayLabels[i], v }));

  // Faint paper-grain noise overlay
  const noiseSvg =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>
        <filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter>
        <rect width='100%' height='100%' filter='url(#n)' opacity='0.6'/>
      </svg>`
    );

  return (
    <AppShell
      titleJp="健康レポート"
      titleEn="Health Report"
      renderTopBar={({ menuOpen, onMenuClick }) => <TopBar showBack backTo="/home" menuOpen={menuOpen} onMenuClick={onMenuClick} />}
    >
      <div
        style={{
          position: "relative",
          margin: "-16px -16px 0",
          padding: "16px",
          minHeight: "calc(100% + 32px)",
          background: C.bone,
        }}
      >
        {/* Paper-grain texture overlay */}
        <div
          aria-hidden
          style={{
            position: "absolute", inset: 0,
            backgroundImage: `url("${noiseSvg}")`,
            opacity: 0.03,
            pointerEvents: "none",
            mixBlendMode: "multiply",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <HeroBanner pet={pet} />
          <HeroCard pet={pet} dogName={dogName} />

          {/* Time filter tabs */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(136,144,99,0.2)",
              borderRadius: 16,
              padding: 4,
              margin: "0 0 12px",
              display: "flex",
              boxShadow: "0 2px 12px rgba(76,61,25,0.05)",
            }}
          >
            {TABS.map((tb) => {
              const active = tab === tb;
              return (
                <button
                  key={tb}
                  onClick={() => setTab(tb)}
                  style={{
                    flex: 1,
                    height: 36,
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 700,
                    color: active ? C.bone : C.moss,
                    background: active ? C.kombu : "transparent",
                    border: "none",
                    margin: 2,
                    boxShadow: active ? "0 4px 12px rgba(53,64,36,0.3)" : "none",
                    transition: "all 0.2s",
                  }}
                >
                  {tb}
                </button>
              );
            })}
          </div>

          <SectionDivider jp="センサーデータ" en="Sensor Data" />

          {/* Health Score */}
          <ChartCard
            accent={C.kombu}
            icon={<Activity size={18} color={C.kombu} />}
            titleJp="健康スコア推移"
            titleEn="Health Score"
            chipText="87 / 100"
            chipBg="rgba(53,64,36,0.1)"
            chipBorder="rgba(53,64,36,0.2)"
            chipColor={C.kombu}
          >
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={scoreData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.kombu} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={C.kombu} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(136,144,99,0.1)" vertical={false} />
                <XAxis dataKey="d" tick={{ fill: C.moss, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[60, 100]} tick={{ fill: C.moss, fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<NiceTooltip suffix="" />} />
                <Area type="monotone" dataKey="v" stroke={C.kombu} strokeWidth={2.5} fill="url(#scoreFill)"
                  dot={{ r: 3, fill: C.kombu, stroke: C.bone, strokeWidth: 1.5 }} animationDuration={1000} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Temperature */}
          <ChartCard
            accent={C.moss}
            icon={<Thermometer size={18} color={C.moss} />}
            titleJp="体温履歴"
            titleEn="Temperature History"
            chipText="Avg 38.5°C"
            chipBg="rgba(136,144,99,0.15)"
            chipBorder="rgba(136,144,99,0.3)"
            chipColor={C.moss}
          >
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={tempData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.moss} stopOpacity={0.15} />
                    <stop offset="100%" stopColor={C.moss} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(136,144,99,0.1)" vertical={false} />
                <XAxis dataKey="d" tick={{ fill: C.moss, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[37.5, 39.5]} tick={{ fill: C.moss, fontSize: 10 }} axisLine={false} tickLine={false} />
                <ReferenceArea y1={38.0} y2={39.2} fill={C.moss} fillOpacity={0.08} />
                <ReferenceLine y={38.5} stroke={C.moss} strokeDasharray="4 4" strokeOpacity={0.4}
                  label={{ value: t("正常", "Normal"), position: "right", fill: C.moss, fontSize: 10 }} />
                <Tooltip content={<NiceTooltip suffix="°C" />} />
                <Area type="monotone" dataKey="v" stroke={C.moss} strokeWidth={2.5} fill="url(#tempFill)"
                  dot={{ r: 3, fill: C.moss, stroke: C.bone, strokeWidth: 1.5 }} animationDuration={1000} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Activity Steps */}
          <ChartCard
            accent={C.tan}
            icon={<Footprints size={18} color={C.kombu} />}
            titleJp="運動・歩数"
            titleEn="Activity Steps"
            chipText="Avg 2,340"
            chipBg="rgba(207,187,153,0.3)"
            chipBorder="rgba(207,187,153,0.6)"
            chipColor={C.cafe}
          >
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={stepsData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="stepsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.kombu} stopOpacity={1} />
                    <stop offset="100%" stopColor={C.moss} stopOpacity={1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(136,144,99,0.1)" vertical={false} />
                <XAxis dataKey="d" tick={{ fill: C.moss, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: C.moss, fontSize: 10 }} axisLine={false} tickLine={false} />
                <ReferenceLine y={3000} stroke={C.kombu} strokeDasharray="4 4" strokeOpacity={0.4}
                  label={{ value: t("目標", "Goal"), position: "right", fill: C.kombu, fontSize: 10 }} />
                <Tooltip content={<NiceTooltip suffix="" />} />
                <Bar dataKey="v" fill="url(#stepsFill)" radius={[6, 6, 0, 0]} animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Sleep */}
          <ChartCard
            accent={C.cafe}
            icon={<Moon size={18} color={C.cafe} />}
            titleJp="睡眠パターン"
            titleEn="Sleep Pattern"
            chipText="Avg 7.5h"
            chipBg="rgba(76,61,25,0.12)"
            chipBorder="rgba(76,61,25,0.25)"
            chipColor={C.cafe}
          >
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={sleepData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="sleepFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.cafe} stopOpacity={1} />
                    <stop offset="100%" stopColor={C.moss} stopOpacity={1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(136,144,99,0.1)" vertical={false} />
                <XAxis dataKey="d" tick={{ fill: C.moss, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 12]} tick={{ fill: C.moss, fontSize: 10 }} axisLine={false} tickLine={false} />
                <ReferenceArea y1={8} y2={10} fill={C.moss} fillOpacity={0.08} />
                <Tooltip content={<NiceTooltip suffix="h" />} />
                <Bar dataKey="v" fill="url(#sleepFill)" radius={[6, 6, 0, 0]} animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <SectionDivider jp="健康記録" en="Health Records" />

          <VaccinationCard />
          <LastVisitCard />

          <SectionDivider jp="レポート" en="Reports" />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12, alignItems: "stretch" }}>
            <QRCard />
            <PDFCard />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

/* ─────────── Health Summary Card ─────────── */
function HeroCard({ pet: _pet, dogName: _dogName }: { pet: PetProfile; dogName: string }) {
  const t = useT();
  const score = 87;
  const r = 44;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <div style={{
      ...glass,
      marginBottom: 16,
      overflow: "hidden",
      borderRadius: 24,
    }}>
      <div style={{ height: 8, background: `linear-gradient(90deg, ${C.kombu}, ${C.moss}, ${C.tan})` }} />
      <div style={{ padding: 20 }}>
        {/* Ring + stats */}
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 20, alignItems: "center" }}>
          <div style={{ position: "relative", width: 100, height: 100 }}>
            <svg width={100} height={100} viewBox="0 0 100 100">
              <circle cx={50} cy={50} r={r} stroke="rgba(136,144,99,0.25)" strokeWidth={10} fill="none" />
              <circle
                cx={50} cy={50} r={r} stroke={C.kombu} strokeWidth={10} fill="none"
                strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
                <span style={{ fontSize: 28, fontWeight: 700, color: C.cafe, lineHeight: 1 }}>{score}</span>
                <span style={{ fontSize: 12, color: C.moss }}>/100</span>
              </div>
              <span style={{ fontSize: 9, color: C.moss, letterSpacing: "0.1em", marginTop: 2 }}>
                {t("スコア", "SCORE")}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <StatRow icon={<Thermometer size={16} color={C.kombu} />}
              labelJp="体温" labelEn="Avg Temp" value="38.5°C" />
            <div style={{ height: 1, background: "rgba(136,144,99,0.2)" }} />
            <StatRow icon={<Footprints size={16} color={C.kombu} />}
              labelJp="歩数" labelEn="Avg Steps" value="2,340" />
            <div style={{ height: 1, background: "rgba(136,144,99,0.2)" }} />
            <StatRow icon={<Moon size={16} color={C.kombu} />}
              labelJp="睡眠" labelEn="Sleep" value="7.5h" />
          </div>
        </div>

        <div style={{ height: 1, background: "rgba(136,144,99,0.2)", margin: "14px 0" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <CheckCircle2 size={14} color={C.moss} />
            <span style={{ fontSize: 12, color: C.moss, fontWeight: 600 }}>
              {t("全センサー正常", "All sensors normal")}
            </span>
          </div>
          <span style={{ fontSize: 11, color: C.tan }}>
            {t("2026年5月16日", "May 16, 2026")}
          </span>
        </div>
      </div>
    </div>
  );
}

function StatRow({ icon, labelJp, labelEn, value }: {
  icon: ReactNode;
  labelJp: string; labelEn: string;
  value: string;
}) {
  const t = useT();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}>
      <div style={{
        width: 32, height: 32, borderRadius: 999,
        background: "rgba(136, 144, 99, 0.2)",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>{icon}</div>
      <span style={{ flex: 1, fontSize: 11, color: C.moss }}>
        {t(labelJp, labelEn)}
      </span>
      <span style={{ fontSize: 15, fontWeight: 700, color: C.cafe }}>{value}</span>
    </div>
  );
}

/* ─────────── Section Divider ─────────── */
function SectionDivider({ jp, en }: { jp: string; en: string }) {
  const t = useT();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "4px 0 10px" }}>
      <div style={{ flex: 1, height: 1, background: "rgba(136,144,99,0.3)" }} />
      <span style={{
        fontSize: 11, color: C.moss, letterSpacing: "0.15em",
        fontWeight: 700, textTransform: "uppercase",
      }}>
        {t(jp, en)}
      </span>
      <div style={{ flex: 1, height: 1, background: "rgba(136,144,99,0.3)" }} />
    </div>
  );
}

/* ─────────── Chart Card Wrapper ─────────── */
function ChartCard({
  accent, icon, titleJp, titleEn, chipText, chipBg, chipBorder, chipColor, children,
}: {
  accent: string;
  icon: ReactNode;
  titleJp: string; titleEn: string;
  chipText: string;
  chipBg: string; chipBorder: string; chipColor: string;
  children: ReactNode;
}) {
  const t = useT();
  const { language } = useLanguage();
  return (
    <div style={{
      ...glass,
      marginBottom: 12,
      overflow: "hidden",
      borderLeft: `4px solid ${accent}`,
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "14px 16px 4px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: `${hexA(accent, 0.12)}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>{icon}</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.cafe }}>
              {t(titleJp, titleEn)}
            </div>
            {language === "mixed" && (
              <div style={{ fontSize: 11, color: C.moss }}>{titleEn}</div>
            )}
          </div>
        </div>
        <span style={{
          background: chipBg, color: chipColor, fontSize: 12, fontWeight: 700,
          padding: "4px 12px", borderRadius: 20, border: `1px solid ${chipBorder}`,
        }}>{chipText}</span>
      </div>
      <div style={{ padding: "8px 8px 12px" }}>{children}</div>
    </div>
  );
}

/* Convert known hex to rgba; falls back to the hex */
function hexA(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map(c => c + c).join("") : h, 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function NiceTooltip({ active, payload, label, suffix }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgba(229, 215, 196, 0.95)",
      backdropFilter: "blur(8px)",
      border: `1px solid ${C.tan}`, borderRadius: 12,
      padding: "6px 10px", fontSize: 11, color: C.cafe,
      boxShadow: "0 4px 12px rgba(76,61,25,0.15)",
    }}>
      <div style={{ color: C.moss }}>{label}</div>
      <div style={{ fontWeight: 700, color: C.cafe }}>{payload[0].value}{suffix}</div>
    </div>
  );
}

/* ─────────── Vaccination Card ─────────── */
type VaxStatus = "current" | "soon";
function VaccinationCard() {
  const t = useT();
  const vaccines: { jp: string; en: string; date: string; status: VaxStatus }[] = [
    { jp: "狂犬病", en: "Rabies", date: "2025/04/15", status: "current" },
    { jp: "混合ワクチン", en: "Combination", date: "2025/03/02", status: "current" },
    { jp: "フィラリア", en: "Heartworm", date: "2026/01/20", status: "current" },
    { jp: "ノミ・マダニ", en: "Flea & Tick", date: t("次回 2026年6月", "Next: Jun 2026"), status: "soon" },
  ];
  return (
    <div style={{
      ...glass,
      marginBottom: 12,
      overflow: "hidden",
      borderLeft: `4px solid ${C.moss}`,
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "14px 16px 10px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Syringe size={18} color={C.moss} />
          <span style={{ fontSize: 14, fontWeight: 700, color: C.cafe }}>
            {t("ワクチン記録", "Vaccination Records")}
          </span>
        </div>
        <span style={{
          background: "rgba(136,144,99,0.15)", color: C.kombu, fontSize: 11, fontWeight: 700,
          padding: "3px 10px", borderRadius: 20, border: `1px solid ${C.moss}`,
        }}>{t("4件", "4 records")}</span>
      </div>
      <div>
        {vaccines.map((v, i) => <VaccineRow key={v.en} {...v} isLast={i === vaccines.length - 1} />)}
      </div>
    </div>
  );
}

function VaccineRow({ jp, en, date, status, isLast }: {
  jp: string; en: string; date: string; status: VaxStatus; isLast: boolean;
}) {
  const t = useT();
  const cfg = status === "current"
    ? {
        icon: <Check size={16} color={C.kombu} />,
        bg: "rgba(53,64,36,0.1)",
        chipBg: C.kombu,
        chipBorder: C.kombu,
        chipColor: C.bone,
        chipText: t("最新", "Current"),
      }
    : {
        icon: <Clock size={16} color={C.cafe} />,
        bg: "rgba(207,187,153,0.3)",
        chipBg: C.tan,
        chipBorder: C.tan,
        chipColor: C.cafe,
        chipText: t("もうすぐ", "Soon"),
      };
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "0 16px", height: 56,
      borderBottom: isLast ? "none" : "1px solid rgba(136,144,99,0.15)",
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%", background: cfg.bg,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>{cfg.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.cafe, lineHeight: 1.2 }}>
          {t(jp, en)}
        </div>
        <div style={{ fontSize: 11, color: C.moss }}>{en}</div>
      </div>
      <span style={{ fontSize: 12, color: C.moss, whiteSpace: "nowrap" }}>{date}</span>
      <span style={{
        background: cfg.chipBg, color: cfg.chipColor, fontSize: 10, fontWeight: 700,
        padding: "3px 8px", borderRadius: 12, whiteSpace: "nowrap",
        border: `1px solid ${cfg.chipBorder}`,
      }}>{cfg.chipText}</span>
    </div>
  );
}

/* ─────────── Last Visit Card ─────────── */
function LastVisitCard() {
  const t = useT();
  return (
    <div style={{
      ...glass,
      marginBottom: 12,
      overflow: "hidden",
      borderLeft: `4px solid ${C.kombu}`,
    }}>
      <div style={{ padding: "14px 16px 4px", display: "flex", alignItems: "center", gap: 10 }}>
        <Stethoscope size={18} color={C.cafe} />
        <span style={{ fontSize: 14, fontWeight: 700, color: C.cafe }}>
          {t("最後の診察", "Last Vet Visit")}
        </span>
      </div>
      <div style={{ padding: "8px 16px 12px", display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{
          width: 48, height: 48, borderRadius: "50%", background: "rgba(53,64,36,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Cross size={22} color={C.kombu} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.cafe, lineHeight: 1.2 }}>
            {t("渋谷動物病院", "Shibuya Animal Hospital")}
          </div>
          <div style={{ fontSize: 12, color: C.moss, marginTop: 2 }}>
            {t("2026年4月20日", "Apr 20, 2026")}
          </div>
          <span style={{
            display: "inline-block", marginTop: 6, fontSize: 11, fontWeight: 700,
            background: "rgba(53,64,36,0.1)", color: C.kombu,
            border: "1px solid rgba(53,64,36,0.25)",
            padding: "3px 10px", borderRadius: 20,
          }}>{t("健康診断: 異常なし ✓", "Health check: All clear ✓")}</span>
        </div>
      </div>
      <div style={{
        padding: "10px 16px", borderTop: "1px solid rgba(136,144,99,0.2)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: 11, color: C.moss }}>{t("次回予約", "Next Appointment")}</div>
          <div style={{ fontSize: 12, color: C.cafe, fontWeight: 600 }}>
            {t("未定", "Not scheduled")}
          </div>
        </div>
        <button
          style={{
            background: "rgba(53,64,36,0.08)", color: C.kombu, fontSize: 12, fontWeight: 700,
            border: `1px solid ${C.kombu}`, borderRadius: 12, padding: "6px 16px",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(53,64,36,0.16)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(53,64,36,0.08)")}
        >
          {t("予約する →", "Book Now →")}
        </button>
      </div>
    </div>
  );
}

/* ─────────── QR & PDF Cards ─────────── */
function QRCard() {
  const t = useT();
  return (
    <div style={{
      ...glass,
      borderLeft: `4px solid ${C.kombu}`,
      padding: 16,
      display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: "50%", background: "rgba(53,64,36,0.12)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <QrCode size={28} color={C.kombu} />
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.cafe, textAlign: "center" }}>
        {t("獣医用QRコード", "Vet QR Code")}
      </div>
      <div style={{ fontSize: 10, color: C.moss, textAlign: "center" }}>
        {t("毎回新しいQRを生成", "New QR every visit")}
      </div>
      <div style={{
        width: 80, height: 80, background: C.bone, borderRadius: 8,
        border: "1px solid rgba(207,187,153,0.6)", padding: 6,
        display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1,
      }}>
        {Array.from({ length: 49 }).map((_, i) => (
          <div key={i} style={{
            background: [0, 6, 8, 9, 12, 14, 18, 20, 22, 27, 30, 33, 36, 40, 42, 44, 48].includes(i % 49) || (i * 7) % 13 < 5 ? C.cafe : "transparent",
            borderRadius: 1,
          }} />
        ))}
      </div>
      <button style={{
        width: "100%", height: 40, marginTop: 4,
        background: C.kombu,
        color: C.bone, fontWeight: 700, fontSize: 13, borderRadius: 12,
        border: "none",
        boxShadow: "0 4px 16px rgba(53,64,36,0.3)",
      }}>
        {t("生成", "Generate")}
      </button>
    </div>
  );
}

function PDFCard() {
  const t = useT();
  const items: [string, string][] = [
    ["ワクチン履歴", "Vaccination history"],
    ["最終診察", "Last checkup details"],
    ["年間データ", "Annual data"],
  ];
  return (
    <div style={{
      ...glass,
      borderLeft: `4px solid ${C.moss}`,
      padding: 16,
      display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: "50%", background: "rgba(136,144,99,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <FileDown size={28} color={C.moss} />
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.cafe, textAlign: "center" }}>
        {t("PDF出力", "PDF Export")}
      </div>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
        {items.map(([jp, en]) => (
          <div key={en} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Check size={12} color={C.kombu} strokeWidth={3} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: C.moss }}>{t(jp, en)}</span>
          </div>
        ))}
      </div>
      <button style={{
        width: "100%", height: 40, marginTop: "auto",
        background: C.moss,
        color: C.bone, fontWeight: 700, fontSize: 12, borderRadius: 12,
        border: "none",
        boxShadow: "0 4px 16px rgba(136,144,99,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
      }}>
        {t("PDF出力", "PDF Export")}
      </button>
    </div>
  );
}

/* ─────────── Hero Banner ─────────── */
function HeroBanner({ pet }: { pet: PetProfile }) {
  const t = useT();
  const { language } = useLanguage();
  const breedEn = pet.breedEn || "Shiba Inu";
  const breedJp = pet.breedJp || "柴犬";
  const name = pet.name || (language === "english" ? "your dog" : "ワンちゃん");

  return (
    <div
      style={{
        position: "relative",
        width: "auto",
        height: 180,
        margin: "-16px -16px 16px",
        borderRadius: "0 0 32px 32px",
        overflow: "hidden",
        background: `linear-gradient(90deg, ${C.kombu} 0%, ${C.moss} 100%)`,
        boxShadow: "0 10px 30px rgba(53,64,36,0.25)",
      }}
    >
      {/* Large leaf-like blob top-right */}
      <div style={{
        position: "absolute", top: -70, right: -60, width: 220, height: 220,
        borderRadius: "60% 40% 55% 45% / 50% 60% 40% 50%",
        background: "rgba(207, 187, 153, 0.2)",
        filter: "blur(1px)",
      }} />
      {/* Smaller bottom-left blob */}
      <div style={{
        position: "absolute", bottom: -40, left: -30, width: 140, height: 140,
        borderRadius: "50%", background: "rgba(207, 187, 153, 0.2)",
      }} />

      {/* Faint paw print watermark right side */}
      <svg
        width={120} height={120} viewBox="0 0 24 24"
        style={{
          position: "absolute", right: 12, bottom: 12,
          opacity: 1, pointerEvents: "none",
        }}
        aria-hidden
      >
        <g fill="rgba(229,215,196,0.15)">
          <ellipse cx="12" cy="16" rx="4" ry="3.2" />
          <ellipse cx="6" cy="10" rx="1.8" ry="2.4" />
          <ellipse cx="10" cy="7" rx="1.8" ry="2.4" />
          <ellipse cx="14" cy="7" rx="1.8" ry="2.4" />
          <ellipse cx="18" cy="10" rx="1.8" ry="2.4" />
        </g>
      </svg>

      {/* Text content */}
      <div style={{
        position: "relative", zIndex: 1,
        padding: 24,
        display: "flex", flexDirection: "column",
        height: "100%", justifyContent: "space-between",
      }}>
        <div>
          <div style={{
            fontSize: 11,
            color: "rgba(229, 215, 196, 0.85)",
            letterSpacing: "0.12em",
            fontWeight: 600,
            textTransform: "uppercase",
          }}>
            {t("ヘルスレポート", "Health")}
          </div>
          <div style={{
            fontSize: 28, fontWeight: 700, color: C.bone,
            lineHeight: 1.1, marginTop: 4,
            letterSpacing: "-0.01em",
          }}>
            {t("'''Do not make any visual modifications. The phrases I write are commands to understand what I want, not to be written down. Understand their content well, then execute what is required.'''\n                                        \n                                            \n                                            remove all the feature and contenet in the app related to japan and japanese", "'''Do not make any visual modifications. The phrases I write are commands to understand what I want, not to be written down. Understand their content well, then execute what is required.'''\n                                        \n                                            \n                                            remove all the feature and contenet in the app related to japan and japanese")}
          </div>
          <div style={{
            fontSize: 13, color: "rgba(229, 215, 196, 0.75)",
            marginTop: 6, display: "flex", alignItems: "center", gap: 6,
          }}>
            <span aria-hidden>🐾</span>
            <span>{name} · {t(breedJp, breedEn)} · {t("2026年5月", "May 2026")}</span>
          </div>
        </div>

        <div style={{
          alignSelf: "flex-start",
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.6)",
          borderRadius: 20,
          padding: "4px 12px",
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "#FFFFFF",
            boxShadow: "0 0 8px rgba(255,255,255,0.8)",
          }} />
          <span style={{ fontSize: 12, color: "#FFFFFF", fontWeight: 600 }}>
            {t("良好", "Good")}
          </span>
        </div>
      </div>
    </div>
  );
}

// reserved for future overdue states
void AlertTriangle;
