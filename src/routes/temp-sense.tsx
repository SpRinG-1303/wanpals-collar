import { createFileRoute } from "@tanstack/react-router";
import { Thermometer, TrendingDown, TrendingUp, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { SensorPage, Card, TimeTabs, useTimeTab, SP } from "@/components/SensorPage";
import { useLanguage, useT } from "@/context/LanguageContext";
import { usePet, displayName } from "@/context/PetContext";

export const Route = createFileRoute("/temp-sense")({ component: TempSensePage });

// ---------- Pastel orange identity ----------
const O = {
  primary: "#F4A56A",
  medium: "#E8895A",
  deep: "#C96B3A",
  soft: "#FEF0E6",
  pale: "#FEF5EF",
  accent: "#F7BC8E",
  muted: "#FAD4B4",
  light: "#FDECD8",
  cream: "#FFF8F3",
  sumi: "#1A1A2E",
  ink: "#4B5563",
  ink2: "#6B7280",
  textMuted: "#9CA3AF",
  divider: "#FEF0E6",
  ok: "#16A34A",
  okBg: "#F0FDF4",
  warn: "#D97706",
  danger: "#DC2626",
  coldBlue: "#93C4E0",
};

const HISTORY = [38.2, 38.4, 38.3, 38.6, 38.5, 38.7, 38.5];
const DAYS = [
  { jp: "月", en: "Mon" }, { jp: "火", en: "Tue" }, { jp: "水", en: "Wed" },
  { jp: "木", en: "Thu" }, { jp: "金", en: "Fri" }, { jp: "土", en: "Sat" }, { jp: "日", en: "Sun" },
];

// Hourly today (6..21) — 16 readings
const HOURLY: { h: number; v: number }[] = [
  { h: 6, v: 38.3 }, { h: 7, v: 38.2 }, { h: 8, v: 38.4 }, { h: 9, v: 38.5 },
  { h: 10, v: 38.6 }, { h: 11, v: 38.5 }, { h: 12, v: 38.4 }, { h: 13, v: 38.5 },
  { h: 14, v: 38.5 }, { h: 15, v: 38.6 }, { h: 16, v: 38.7 }, { h: 17, v: 38.5 },
  { h: 18, v: 38.4 }, { h: 19, v: 38.3 }, { h: 20, v: 38.3 }, { h: 21, v: 38.2 },
];

function useCount(target: number, duration = 1100) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setV(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
}

// Local orange SectionLabel
function OrangeSectionLabel({ jp, en }: { jp: string; en: string }) {
  const t = useT();
  return (
    <div className="flex items-center" style={{ gap: 6, marginBottom: 12 }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: O.primary, flexShrink: 0 }} />
      <span style={{
        fontSize: 11, color: O.primary, fontWeight: 600,
        letterSpacing: "0.08em", textTransform: "uppercase",
      }}>
        {t(jp, en)}
      </span>
    </div>
  );
}

function TempSensePage() {
  const [tab, setTab] = useTimeTab();
  const t = useT();
  const { pet } = usePet();
  const name = displayName(pet, "Fluffy");
  const temp = 38.5;
  const tAnim = useCount(temp, 1200);
  const R = 70, sw = 14, cx = 90, cy = 90;
  const C = 2 * Math.PI * R;
  const pct = Math.min(1, Math.max(0, (temp - 37.5) / 2.5));
  const min = Math.min(...HISTORY);
  const max = Math.max(...HISTORY);
  const avg = (HISTORY.reduce((s, v) => s + v, 0) / HISTORY.length).toFixed(1);
  const [drawn, setDrawn] = useState(false);
  useEffect(() => { const id = setTimeout(() => setDrawn(true), 80); return () => clearTimeout(id); }, []);

  // Marker position on spectrum bar — temp range 36..41
  const markerPct = Math.min(1, Math.max(0, (temp - 36) / 5));

  return (
    <SensorPage
      titleJp="体温センス AI"
      titleEn="TempSense AI"
      subtitleJp="テンプセンス AI"
      descriptorJp="体温モニタリング"
      descriptorEn="Body temperature monitoring"
      bannerGradient="linear-gradient(135deg,#FFF8F3 0%,#FEF0E6 100%)"
      bannerKanji="熱"
      bannerKanjiColor="rgba(244,165,106,0.07)"
      bannerSubtitleColor="#D4956A"
    >
      {/* full-bleed pastel orange page wash, sits behind all cards */}
      <div style={{
        margin: "-16px -16px 0",
        padding: "16px 16px 110px",
        background: O.pale,
        minHeight: "100%",
      }}>
        <TimeTabs value={tab} onChange={setTab} />

        {/* ---- CURRENT TEMPERATURE ---- */}
        <div style={{
          background: "#FFFFFF",
          borderRadius: 24,
          padding: 20,
          marginBottom: 14,
          borderLeft: `4px solid ${O.primary}`,
          boxShadow: "0 4px 20px rgba(244,165,106,0.12)",
        }}>
          <OrangeSectionLabel jp="現在の体温" en="Current Temperature" />
          <div style={{ position: "relative", width: 180, height: 180, margin: "8px auto" }}>
            <svg width={180} height={180} viewBox="0 0 180 180" style={{ position: "absolute", inset: 0 }}>
              <circle cx={cx} cy={cy} r={84} fill="none" stroke="rgba(244,165,106,0.2)" strokeWidth={1} />
              {Array.from({ length: 12 }).map((_, i) => {
                const a = (i * 30) * Math.PI / 180;
                const x1 = cx + Math.cos(a) * 80, y1 = cy + Math.sin(a) * 80;
                const x2 = cx + Math.cos(a) * 84, y2 = cy + Math.sin(a) * 84;
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(244,165,106,0.35)" strokeWidth={1} />;
              })}
              <defs>
                <linearGradient id="tGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={O.primary} />
                  <stop offset="100%" stopColor={O.accent} />
                </linearGradient>
              </defs>
              <circle cx={cx} cy={cy} r={R} stroke={O.light} strokeWidth={sw} fill="none" />
              <circle
                cx={cx} cy={cy} r={R} stroke="url(#tGrad)" strokeWidth={sw} fill="none" strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={drawn ? C * (1 - pct) : C}
                transform={`rotate(-90 ${cx} ${cy})`}
                style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.2,.7,.2,1)", filter: "drop-shadow(0 0 6px rgba(244,165,106,0.5))" }}
              />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <Thermometer size={18} style={{ color: O.primary, marginBottom: 2 }} />
              <div style={{ fontSize: 40, fontWeight: 700, color: O.sumi, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
                {tAnim.toFixed(1)}<span style={{ fontSize: 20, fontWeight: 400, color: O.ink2 }}>°C</span>
              </div>
              <div style={{
                marginTop: 8, fontSize: 12, fontWeight: 600, color: O.ok,
                background: O.okBg, padding: "4px 12px", borderRadius: 50,
                display: "inline-flex", alignItems: "center", gap: 6,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: O.ok }} />
                {t("正常", "Normal")}
              </div>
            </div>
          </div>
          <div className="flex" style={{ marginTop: 12, paddingTop: 14, borderTop: `1px solid ${O.divider}` }}>
            <div className="text-center" style={{ flex: 1 }}>
              <TrendingDown size={14} style={{ color: O.coldBlue, margin: "0 auto 4px" }} />
              <div style={{ fontSize: 18, fontWeight: 600, color: O.sumi, fontVariantNumeric: "tabular-nums" }}>{min}°C</div>
              <div style={{ fontSize: 10, color: O.textMuted, marginTop: 2 }}>{t("最低気温", "Min")}</div>
            </div>
            <div style={{ width: 1, background: O.divider }} />
            <div className="text-center" style={{ flex: 1 }}>
              <TrendingUp size={14} style={{ color: O.primary, margin: "0 auto 4px" }} />
              <div style={{ fontSize: 18, fontWeight: 600, color: O.sumi, fontVariantNumeric: "tabular-nums" }}>{max}°C</div>
              <div style={{ fontSize: 10, color: O.textMuted, marginTop: 2 }}>{t("最高気温", "Max")}</div>
            </div>
          </div>
        </div>

        {/* ---- TEMPERATURE TREND ---- */}
        <div style={{
          background: "#FFFFFF",
          borderRadius: 22,
          padding: 20,
          marginBottom: 14,
          borderLeft: `4px solid ${O.accent}`,
          boxShadow: "0 4px 20px rgba(244,165,106,0.1)",
        }}>
          <OrangeSectionLabel jp="体温の推移・7日間" en="Temperature Trend · 7 Days" />
          <svg viewBox="0 0 280 140" width="100%" height={140}>
            <defs>
              <linearGradient id="tFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={O.primary} stopOpacity="0.18" />
                <stop offset="100%" stopColor={O.primary} stopOpacity="0" />
              </linearGradient>
            </defs>
            {(() => {
              const yTop = 95 - ((39.2 - 37.5) / 2) * 70;
              const yBot = 95 - ((38.0 - 37.5) / 2) * 70;
              return (
                <>
                  <rect x={28} y={yTop} width={250} height={yBot - yTop} fill="#22C55E" opacity={0.08} rx={4} />
                  <text x={32} y={yTop - 3} fontSize="9" fill={O.ok}>{t("正常範囲", "Normal range")}</text>
                </>
              );
            })()}
            {[37.5, 38.5, 39.5].map((v, i) => (
              <g key={i}>
                <line x1={28} x2={278} y1={20 + i * 35} y2={20 + i * 35} stroke="rgba(244,165,106,0.08)" strokeWidth={1} />
                <text x={24} y={23 + i * 35} fontSize="9" fill={O.textMuted} textAnchor="end">{v}</text>
              </g>
            ))}
            {(() => {
              const pts = HISTORY.map((v, i) => [40 + i * 38, 90 - ((v - 37.5) / 2) * 70] as [number, number]);
              const d = pts.reduce((acc, p, i) => {
                if (i === 0) return `M${p[0]},${p[1]}`;
                const prev = pts[i - 1];
                const cx1 = prev[0] + (p[0] - prev[0]) / 2;
                return `${acc} C${cx1},${prev[1]} ${cx1},${p[1]} ${p[0]},${p[1]}`;
              }, "");
              const fillD = `${d} L${pts[pts.length - 1][0]},95 L${pts[0][0]},95 Z`;
              return (
                <>
                  <path d={fillD} fill="url(#tFill)" />
                  <path d={d} stroke={O.primary} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round"
                    pathLength={1} strokeDasharray={1} strokeDashoffset={drawn ? 0 : 1}
                    style={{ transition: "stroke-dashoffset 1.4s ease-out" }} />
                  {pts.map((p, i) => {
                    const isToday = i === pts.length - 1;
                    return (
                      <g key={i}>
                        <circle cx={p[0]} cy={p[1]} r={3} fill="#FFFFFF" stroke={O.primary} strokeWidth={2} />
                        <text x={p[0]} y={120} fontSize="10"
                          fill={isToday ? O.primary : O.textMuted}
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

        {/* ---- BODY HEAT MAP (new) ---- */}
        <HourlyPatternCard avg={avg} min={min} max={max} drawn={drawn} />

        {/* ---- TEMPERATURE ALERTS ---- */}
        <div style={{
          background: "#FFFFFF",
          borderRadius: 22,
          padding: 20,
          marginBottom: 14,
          borderLeft: `4px solid ${O.accent}`,
          boxShadow: "0 4px 20px rgba(244,165,106,0.1)",
        }}>
          <OrangeSectionLabel jp="体温アラート" en="Temperature Alerts" />
          <div style={{ position: "relative", height: 28, marginTop: 16, marginBottom: 30 }}>
            <div style={{
              position: "absolute", inset: 0, borderRadius: 50,
              background: "linear-gradient(90deg,#93C5FD 0%,#86EFAC 30%,#FDE68A 60%,#FB923C 85%,#EF4444 100%)",
            }} />
            <div style={{
              position: "absolute", top: -6, left: `${markerPct * 100}%`, transform: "translateX(-50%)",
              width: 4, height: 40, background: O.primary, borderRadius: 2,
            }} />
            <div style={{
              position: "absolute", top: -24, left: `${markerPct * 100}%`, transform: "translateX(-50%)",
              background: O.primary, color: "#fff", padding: "3px 10px", borderRadius: 8,
              fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
            }}>{temp}°C</div>
          </div>
          <ThresholdRow color={O.ok} textColor={O.ok} jp="正常" en="Normal" range="38.0 – 39.2°C" first />
          <ThresholdRow color={O.warn} textColor={O.warn} jp="注意" en="Warning" range="39.2 – 40.0°C" />
          <ThresholdRow color={O.danger} textColor={O.danger} jp="危険" en="Danger" range="> 40.0°C" />
        </div>

        {/* ---- AI INSIGHT ---- */}
        <OrangeAIInsightCard name={name} />
      </div>
    </SensorPage>
  );
}

function HourlyPatternCard({ avg, min, max, drawn }: { avg: string; min: number; max: number; drawn: boolean }) {
  const t = useT();
  const W = 280, H = 130, PX = 28, PY = 16;
  const innerW = W - PX * 2, innerH = H - PY * 2;
  const yMin = 37.8, yMax = 39.4;
  const yFor = (v: number) => PY + (1 - (v - yMin) / (yMax - yMin)) * innerH;
  const yNormalHi = yFor(39.2);
  const yNormalLo = yFor(38.0);
  const pts = HOURLY.map((d, i) => {
    const x = PX + (i / (HOURLY.length - 1)) * innerW;
    return { x, y: yFor(d.v), v: d.v, h: d.h };
  });
  const path = pts.reduce((acc, p, i) => {
    if (i === 0) return `M${p.x},${p.y}`;
    const prev = pts[i - 1];
    const cx = (prev.x + p.x) / 2;
    return `${acc} C${cx},${prev.y} ${cx},${p.y} ${p.x},${p.y}`;
  }, "");

  return (
    <div style={{
      background: "#FFFFFF",
      borderRadius: 22,
      padding: 20,
      marginBottom: 14,
      borderLeft: `4px solid ${O.accent}`,
      boxShadow: "0 4px 20px rgba(244,165,106,0.1)",
    }}>
      <OrangeSectionLabel jp="体温の推移パターン" en="Temperature Pattern" />
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H}>
        {/* normal range band */}
        <rect x={PX} y={yNormalHi} width={innerW} height={yNormalLo - yNormalHi}
          fill="#22C55E" opacity={0.06} rx={3} />
        {/* reference lines */}
        <line x1={PX} x2={W - PX} y1={yNormalHi} y2={yNormalHi} stroke="rgba(0,0,0,0.05)" strokeDasharray="2 3" />
        <line x1={PX} x2={W - PX} y1={yNormalLo} y2={yNormalLo} stroke="rgba(0,0,0,0.05)" strokeDasharray="2 3" />
        <text x={4} y={yNormalHi + 3} fontSize="8" fill={O.textMuted}>39.2</text>
        <text x={4} y={yNormalLo + 3} fontSize="8" fill={O.textMuted}>38.0</text>
        {/* connector line */}
        <path d={path} stroke={O.muted} strokeWidth={1.5} fill="none" strokeLinecap="round"
          pathLength={1} strokeDasharray={1} strokeDashoffset={drawn ? 0 : 1}
          style={{ transition: "stroke-dashoffset 1.2s ease-out" }} />
        {/* dots */}
        {pts.map((p, i) => {
          const color = p.v > 40 ? O.danger : p.v > 39.2 ? O.warn : O.primary;
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={3.5} fill={color}
                opacity={drawn ? 1 : 0} style={{ transition: `opacity 400ms ease ${i * 30}ms` }} />
              {(p.h % 3 === 0) && (
                <text x={p.x} y={H - 2} fontSize="8" fill={O.textMuted} textAnchor="middle">{p.h}</text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="flex" style={{ gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        <StatPill bg="rgba(244,165,106,0.15)" color={O.deep} label={t("平均", "Avg")} value={`${avg}°C`} />
        <StatPill bg="rgba(147,196,224,0.2)" color="#3D7A9E" label={t("最低", "Min")} value={`${min}°C`} />
        <StatPill bg="rgba(247,188,142,0.25)" color={O.deep} label={t("最高", "Max")} value={`${max}°C`} />
      </div>
    </div>
  );
}

function StatPill({ bg, color, label, value }: { bg: string; color: string; label: string; value: string }) {
  return (
    <div className="inline-flex items-center" style={{
      background: bg, color, borderRadius: 50,
      padding: "6px 12px", fontSize: 11, fontWeight: 600, gap: 6,
    }}>
      <span style={{ opacity: 0.75 }}>{label}</span>
      <span style={{ fontVariantNumeric: "tabular-nums" }}>{value}</span>
    </div>
  );
}

function OrangeAIInsightCard({ name }: { name: string }) {
  const t = useT();
  const { language } = useLanguage();
  const jp = `${name}の体温は正常範囲内で安定しています。体温の変動は最小限で、健康的な状態です。`;
  const en = `${name}'s body temperature is stable within normal range. Temperature variation is minimal and healthy.`;
  return (
    <div style={{
      position: "relative",
      overflow: "hidden",
      background: "linear-gradient(135deg,#C96B3A 0%,#E8895A 100%)",
      borderRadius: 26,
      padding: 22,
      color: "#FFFFFF",
      boxShadow: "0 6px 24px rgba(201,107,58,0.2)",
    }}>
      <span aria-hidden style={{
        position: "absolute", top: -28, right: -8,
        fontSize: 140, lineHeight: 1, fontWeight: 800,
        color: "rgba(255,255,255,0.06)", pointerEvents: "none", userSelect: "none",
      }}>温</span>
      <div className="flex items-center" style={{ gap: 6, position: "relative" }}>
        <Sparkles size={14} color={O.muted} />
        <span style={{
          fontSize: 11, color: O.muted, fontWeight: 600,
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
      <div className="inline-flex items-center" style={{
        marginTop: 14, gap: 6,
        background: "rgba(255,255,255,0.15)", color: "#FFFFFF",
        borderRadius: 50, padding: "6px 14px",
        fontSize: 12, fontWeight: 500, position: "relative",
      }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#86EFAC" }} />
        {t("正常範囲内", "Within normal range")}
      </div>
      <div className="flex items-center justify-end" style={{ gap: 4, marginTop: 14, position: "relative" }}>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
          {t("最終更新: 今日 14:32", "Last updated: Today 14:32")}
        </span>
      </div>
    </div>
  );
}

function ThresholdRow({ color, textColor, jp, en, range, first }: {
  color: string; textColor: string; jp: string; en: string; range: string; first?: boolean;
}) {
  const t = useT();
  return (
    <div className="flex items-center" style={{
      gap: 10, padding: "12px 0",
      borderTop: first ? "none" : `1px solid ${O.divider}`,
    }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
      <div style={{ flex: 1, fontSize: 13, color: O.ink, fontWeight: 500 }}>{t(jp, en)}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: textColor, fontVariantNumeric: "tabular-nums" }}>{range}</div>
    </div>
  );
}

// keep import used to avoid tree-shake warnings when SP referenced indirectly
void SP;
void Card;
