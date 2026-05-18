import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Activity, AlertTriangle, Mic, Droplet, Sparkles } from "lucide-react";
import { SensorPage, TimeTabs, useTimeTab } from "@/components/SensorPage";
import { useLanguage, useT } from "@/context/LanguageContext";
import { usePet, displayName } from "@/context/PetContext";

export const Route = createFileRoute("/pressure-sense")({ component: PressureSensePage });

// ---------- Pastel yellow identity ----------
const Y = {
  primary: "#E8C547",
  medium: "#D4AD35",
  deep: "#B8921A",
  soft: "#FEF9E7",
  pale: "#FFFDF0",
  accent: "#F2D063",
  muted: "#F7E49A",
  light: "#FDF5C8",
  cream: "#FFFEF5",
  sumi: "#1A1A2E",
  ink: "#4B5563",
  ink2: "#6B7280",
  textMuted: "#9CA3AF",
  divider: "#FEF9E7",
  ok: "#16A34A",
  okBg: "#F0FDF4",
  warn: "#D97706",
  danger: "#DC2626",
};

const PATTERN = [42, 48, 45, 52, 50, 47, 49];
const HOURLY = [4, 8, 14, 22, 18, 26, 20, 16, 12, 10, 14, 8, 6, 4, 3, 2];
const HOUR_LABELS = [6, 9, 12, 15, 18, 21];
const DAYS = [
  { jp: "月", en: "Mon" }, { jp: "火", en: "Tue" }, { jp: "水", en: "Wed" },
  { jp: "木", en: "Thu" }, { jp: "金", en: "Fri" }, { jp: "土", en: "Sat" }, { jp: "日", en: "Sun" },
];

function useCount(target: number, duration = 1100) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setV(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
}

function YellowSectionLabel({ jp, en }: { jp: string; en: string }) {
  const t = useT();
  return (
    <div className="flex items-center" style={{ gap: 6, marginBottom: 12 }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: Y.primary, flexShrink: 0 }} />
      <span style={{
        fontSize: 11, color: Y.primary, fontWeight: 600,
        letterSpacing: "0.08em", textTransform: "uppercase",
      }}>
        {t(jp, en)}
      </span>
    </div>
  );
}

function PressureSensePage() {
  const [tab, setTab] = useTimeTab();
  const t = useT();
  const { pet } = usePet();
  const name = displayName(pet, "Fluffy");
  const value = 62;
  const valueAnim = useCount(value, 1200);
  const valuePct = value / 100;

  const [drawn, setDrawn] = useState(false);
  useEffect(() => { const id = setTimeout(() => setDrawn(true), 80); return () => clearTimeout(id); }, []);

  const arcR = 100;
  const cx = 130, cy = 130;
  const arcLen = Math.PI * arcR;
  const markerAngle = Math.PI + Math.PI * valuePct;
  const mx = cx + Math.cos(markerAngle) * arcR;
  const my = cy + Math.sin(markerAngle) * arcR;

  const count = 142;
  const countAnim = useCount(count, 1200);

  return (
    <SensorPage
      titleJp="圧力センス AI"
      titleEn="PressureSense AI"
      heroGradient="linear-gradient(135deg,#B8921A 0%,#D4AD35 50%,#E8C547 100%)"
      kanji="嚥"
    >
      <div style={{
        margin: "-16px -16px 0",
        padding: "16px 16px 110px",
        background: Y.pale,
        minHeight: "100%",
        boxSizing: "border-box",
      }}>
        <TimeTabs value={tab} onChange={setTab} />

        {/* ---- CURRENT PRESSURE ---- */}
        <div style={{
          background: "#FFFFFF",
          borderRadius: 24,
          padding: 20,
          marginBottom: 14,
          borderLeft: `4px solid ${Y.primary}`,
          boxShadow: "0 4px 20px rgba(232,197,71,0.12)",
          overflow: "hidden",
          boxSizing: "border-box",
        }}>
          <YellowSectionLabel jp="現在の嚥下圧力" en="Current Pressure" />
          <div style={{ position: "relative", width: 260, height: 160, margin: "0 auto" }}>
            <svg width={260} height={160} viewBox="0 0 260 160">
              <defs>
                <linearGradient id="pGauge" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="45%" stopColor="#F59E0B" />
                  <stop offset="80%" stopColor="#FB923C" />
                  <stop offset="100%" stopColor="#EF4444" />
                </linearGradient>
              </defs>
              <path d={`M ${cx - arcR} ${cy} A ${arcR} ${arcR} 0 0 1 ${cx + arcR} ${cy}`}
                stroke={Y.light} strokeWidth={16} fill="none" strokeLinecap="round" />
              {Array.from({ length: 11 }).map((_, i) => {
                const a = Math.PI + (Math.PI * i) / 10;
                const inner = arcR - 12, outer = arcR - 4;
                return (
                  <line key={i}
                    x1={cx + Math.cos(a) * inner} y1={cy + Math.sin(a) * inner}
                    x2={cx + Math.cos(a) * outer} y2={cy + Math.sin(a) * outer}
                    stroke={Y.textMuted} strokeWidth={1} opacity={0.4}
                  />
                );
              })}
              <path d={`M ${cx - arcR} ${cy} A ${arcR} ${arcR} 0 0 1 ${cx + arcR} ${cy}`}
                stroke="url(#pGauge)" strokeWidth={16} fill="none" strokeLinecap="round"
                strokeDasharray={arcLen}
                strokeDashoffset={drawn ? arcLen * (1 - valuePct) : arcLen}
                style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.2,.7,.2,1)" }}
              />
              <g transform={`translate(${mx} ${my}) rotate(45)`}>
                <rect x={-6} y={-6} width={12} height={12} fill="#FFFFFF" stroke={Y.medium} strokeWidth={2} />
              </g>
              <text x={mx} y={my + 22} fontSize="10" fontWeight={700} fill={Y.medium} textAnchor="middle">{value} kPa</text>
            </svg>
            <div style={{ position: "absolute", top: 30, left: 0, right: 0, textAlign: "center" }}>
              <div style={{ fontSize: 48, fontWeight: 800, color: Y.sumi, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
                {valueAnim}
                <span style={{ fontSize: 18, color: Y.ink2, marginLeft: 6, fontWeight: 400 }}>kPa</span>
              </div>
              <div style={{ marginTop: 6, display: "inline-flex", alignItems: "center", gap: 6,
                background: Y.okBg, color: Y.ok, padding: "4px 12px", borderRadius: 50, fontSize: 11, fontWeight: 600 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: Y.ok }} />
                {t("正常", "Normal")}
              </div>
            </div>
          </div>
          <div className="flex justify-between" style={{ marginTop: 6, padding: "0 6px", fontSize: 10, color: Y.textMuted }}>
            <span>{t("低", "Low")}</span><span>{t("高", "High")}</span>
          </div>

          {/* throat status pills row */}
          <div className="flex" style={{ gap: 6, flexWrap: "wrap", marginTop: 14 }}>
            <StatusPill jp="嚥下: 正常" en="Swallowing: Normal" />
            <StatusPill jp="咽頭: 正常" en="Throat: Normal" />
            <StatusPill jp="水分恐怖: なし" en="Hydrophobia: None" />
          </div>
        </div>

        {/* ---- SWALLOW COUNT ---- */}
        <div style={{
          background: "#FFFFFF",
          borderRadius: 22,
          padding: 20,
          marginBottom: 14,
          borderLeft: `4px solid ${Y.accent}`,
          boxShadow: "0 4px 20px rgba(232,197,71,0.1)",
          overflow: "hidden",
          boxSizing: "border-box",
        }}>
          <YellowSectionLabel jp="飲み込みカウント" en="Swallow Count" />
          <div className="flex items-baseline" style={{ gap: 8 }}>
            <span style={{ fontSize: 48, fontWeight: 800, color: Y.medium, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
              {countAnim}
            </span>
            <span style={{ fontSize: 16, color: Y.textMuted }}>{t("回", "times")}</span>
          </div>
          <div className="flex items-center" style={{ gap: 8, marginTop: 14, flexWrap: "wrap" }}>
            <CompPill jp="昨日 130回" en="Yesterday 130" />
            <span style={{ color: Y.textMuted, fontSize: 12 }}>→</span>
            <CompPill jp="今日 142回" en="Today 142" active />
            <span style={{ color: Y.ok, fontSize: 12, fontWeight: 700, marginLeft: "auto" }}>+12 ▲</span>
          </div>

          <div style={{ marginTop: 16 }}>
            <div className="flex items-end" style={{ gap: 3, height: 60, background: Y.soft, borderRadius: 8, padding: 4 }}>
              {HOURLY.map((v, i) => {
                const isPeak = v === Math.max(...HOURLY);
                return (
                  <div key={i} style={{
                    flex: 1, height: `${(v / 30) * 100}%`,
                    background: isPeak ? Y.medium : Y.accent,
                    borderRadius: 3,
                    transform: drawn ? "scaleY(1)" : "scaleY(0)",
                    transformOrigin: "bottom",
                    transition: `transform 600ms cubic-bezier(.2,.7,.2,1) ${i * 30}ms`,
                  }} />
                );
              })}
            </div>
            <div className="flex justify-between" style={{ fontSize: 9, color: Y.textMuted, marginTop: 6 }}>
              {HOUR_LABELS.map((h) => <span key={h}>{h}</span>)}
            </div>
            <div className="flex items-center" style={{ gap: 6, marginTop: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: Y.primary }} />
              <span style={{ fontSize: 11, color: Y.ink2, fontWeight: 500 }}>
                {t("最も活発: 12:00-13:00", "Most active: 12:00–13:00")}
              </span>
            </div>
          </div>
        </div>

        {/* ---- THROAT HEALTH SIGNALS (new) ---- */}
        <div style={{
          background: "#FFFFFF",
          borderRadius: 22,
          padding: 20,
          marginBottom: 14,
          borderLeft: `4px solid ${Y.accent}`,
          boxShadow: "0 4px 20px rgba(232,197,71,0.1)",
          overflow: "hidden",
          boxSizing: "border-box",
        }}>
          <YellowSectionLabel jp="咽頭健康シグナル" en="Throat Health Signals" />
          <div className="grid grid-cols-2" style={{ gap: 10 }}>
            <SignalCard icon={<Activity size={18} />} jp="嚥下機能" en="Swallowing Function" statusJp="正常" statusEn="Normal" tone="ok" />
            <SignalCard icon={<AlertTriangle size={18} />} jp="咽頭刺激" en="Throat Irritation" statusJp="なし" statusEn="None" tone="ok" />
            <SignalCard icon={<Mic size={18} />} jp="声のかすれ" en="Hoarseness" statusJp="なし" statusEn="None" tone="ok" />
            <SignalCard icon={<Droplet size={18} />} jp="水分恐怖" en="Hydrophobia Risk" statusJp="低リスク" statusEn="Low Risk" tone="ok" />
          </div>
        </div>

        {/* ---- PRESSURE PATTERN ---- */}
        <div style={{
          background: "#FFFFFF",
          borderRadius: 22,
          padding: 20,
          marginBottom: 14,
          borderLeft: `4px solid ${Y.accent}`,
          boxShadow: "0 4px 20px rgba(232,197,71,0.1)",
          overflow: "hidden",
          boxSizing: "border-box",
        }}>
          <YellowSectionLabel jp="圧力パターン・7日間" en="Pressure Pattern · 7 Days" />
          <svg viewBox="0 0 300 130" width="100%" height={130}>
            <defs>
              <linearGradient id="pressFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={Y.primary} stopOpacity="0.2" />
                <stop offset="100%" stopColor={Y.primary} stopOpacity="0" />
              </linearGradient>
            </defs>
            {(() => {
              const yTop = 95 - (55 / 70) * 75;
              const yBot = 95 - (40 / 70) * 75;
              return (
                <>
                  <rect x={28} y={yTop} width={262} height={yBot - yTop} fill="#22C55E" opacity={0.08} rx={4} />
                  <text x={32} y={yTop - 3} fontSize="9" fill={Y.ok}>{t("正常範囲", "Normal range")}</text>
                </>
              );
            })()}
            {[{ y: 20, label: "70" }, { y: 55, label: "50" }, { y: 90, label: "30" }].map((g) => (
              <g key={g.label}>
                <line x1={28} x2={290} y1={g.y} y2={g.y} stroke="rgba(232,197,71,0.08)" strokeWidth={1} />
                <text x={24} y={g.y + 3} fontSize="10" fill={Y.textMuted} textAnchor="end">{g.label}</text>
              </g>
            ))}
            {(() => {
              const pts = PATTERN.map((v, i) => [44 + i * 38, 95 - (v / 70) * 75] as [number, number]);
              const d = pts.reduce((acc, p, i) => {
                if (i === 0) return `M${p[0]},${p[1]}`;
                const prev = pts[i - 1];
                const cx1 = prev[0] + (p[0] - prev[0]) / 2;
                return `${acc} C${cx1},${prev[1]} ${cx1},${p[1]} ${p[0]},${p[1]}`;
              }, "");
              const fill = `${d} L${pts[pts.length - 1][0]},100 L${pts[0][0]},100 Z`;
              return (
                <>
                  <path d={fill} fill="url(#pressFill)" />
                  <path d={d} stroke={Y.primary} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round"
                    pathLength={1} strokeDasharray={1} strokeDashoffset={drawn ? 0 : 1}
                    style={{ transition: "stroke-dashoffset 1.4s ease-out" }} />
                  {pts.map((p, i) => {
                    const isToday = i === pts.length - 1;
                    return (
                      <g key={i}>
                        <circle cx={p[0]} cy={p[1]} r={3} fill="#fff" stroke={Y.primary} strokeWidth={2} />
                        <text x={p[0]} y={120} fontSize="10"
                          fill={isToday ? Y.primary : Y.textMuted}
                          fontWeight={isToday ? 600 : 400}
                          textAnchor="middle">{t(DAYS[i].jp, DAYS[i].en)}</text>
                      </g>
                    );
                  })}
                </>
              );
            })()}
          </svg>
        </div>

        {/* ---- AI INSIGHT ---- */}
        <YellowAIInsightCard name={name} />
      </div>
    </SensorPage>
  );
}

function StatusPill({ jp, en }: { jp: string; en: string }) {
  const t = useT();
  return (
    <span style={{
      background: Y.okBg, color: Y.ok,
      borderRadius: 50, padding: "4px 10px",
      fontSize: 10, fontWeight: 600,
      display: "inline-flex", alignItems: "center", gap: 5,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: Y.ok }} />
      {t(jp, en)}
    </span>
  );
}

function CompPill({ jp, en, active }: { jp: string; en: string; active?: boolean }) {
  const t = useT();
  return (
    <span style={{
      padding: "5px 10px", borderRadius: 50, fontSize: 11, fontWeight: 600,
      background: active ? Y.light : Y.soft,
      color: active ? Y.medium : Y.ink2,
    }}>{t(jp, en)}</span>
  );
}

function SignalCard({ icon, jp, en, statusJp, statusEn, tone }: {
  icon: React.ReactNode; jp: string; en: string; statusJp: string; statusEn: string;
  tone: "ok" | "warn" | "danger";
}) {
  const t = useT();
  const toneColor = tone === "ok" ? Y.ok : tone === "warn" ? Y.warn : Y.danger;
  return (
    <div style={{
      background: Y.pale,
      borderRadius: 16,
      padding: 14,
      display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 8,
      boxSizing: "border-box",
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: "50%",
        background: "rgba(232,197,71,0.15)", color: Y.primary,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>{icon}</div>
      <div style={{ fontSize: 10, color: Y.textMuted, lineHeight: 1.3 }}>{t(jp, en)}</div>
      <div className="flex items-center" style={{ gap: 5 }}>
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: toneColor }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: toneColor }}>{t(statusJp, statusEn)}</span>
      </div>
    </div>
  );
}

function YellowAIInsightCard({ name }: { name: string }) {
  const t = useT();
  const { language } = useLanguage();
  const jp = `${name}の嚥下パターンは正常で安定しています。咽頭の刺激や水分恐怖の兆候は検出されていません。`;
  const en = `${name}'s swallowing pattern is normal and stable. No throat irritation or hydrophobia signals detected.`;
  return (
    <div style={{
      position: "relative",
      overflow: "hidden",
      background: "linear-gradient(135deg,#B8921A 0%,#D4AD35 100%)",
      borderRadius: 26,
      padding: 22,
      color: "#FFFFFF",
      boxShadow: "0 6px 24px rgba(184,146,26,0.22)",
      boxSizing: "border-box",
    }}>
      <span aria-hidden style={{
        position: "absolute", top: -28, right: -8,
        fontSize: 140, lineHeight: 1, fontWeight: 800,
        color: "rgba(255,255,255,0.06)", pointerEvents: "none", userSelect: "none",
      }}>健</span>
      <div className="flex items-center" style={{ gap: 6, position: "relative" }}>
        <Sparkles size={14} color={Y.muted} />
        <span style={{
          fontSize: 11, color: Y.muted, fontWeight: 600,
          letterSpacing: "0.1em", textTransform: "uppercase",
        }}>
          {t("AI インサイト", "AI Insight")}
        </span>
      </div>
      <div style={{ height: 1, background: "rgba(255,255,255,0.15)", margin: "12px 0", position: "relative" }} />
      {language !== "english" && (
        <div style={{ fontSize: 14, lineHeight: 1.8, color: "#FFFFFF", position: "relative" }}>{jp}</div>
      )}
      {language !== "japanese" && (
        <div style={{
          fontSize: language === "english" ? 14 : 13,
          lineHeight: 1.8,
          color: language === "english" ? "#FFFFFF" : "rgba(255,255,255,0.7)",
          marginTop: language === "mixed" ? 6 : 0,
          position: "relative",
        }}>{en}</div>
      )}
      <div className="flex items-center" style={{ gap: 8, marginTop: 14, flexWrap: "wrap", position: "relative" }}>
        <span className="inline-flex items-center" style={{
          gap: 6, background: "rgba(255,255,255,0.15)", color: "#FFFFFF",
          borderRadius: 50, padding: "6px 14px", fontSize: 12, fontWeight: 500,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#86EFAC" }} />
          {t("嚥下機能正常", "Swallowing Normal")}
        </span>
        <span className="inline-flex items-center" style={{
          gap: 6, background: "rgba(255,255,255,0.12)", color: "#FFFFFF",
          borderRadius: 50, padding: "6px 12px", fontSize: 11,
        }}>
          💡 {t("定期的な水分補給を推奨", "Regular hydration recommended")}
        </span>
      </div>
      <div className="flex items-center justify-end" style={{ gap: 4, marginTop: 14, position: "relative" }}>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
          {t("最終更新: 今日 14:32", "Last updated: Today 14:32")}
        </span>
      </div>
    </div>
  );
}
