import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SensorPage, Card, TimeTabs, useTimeTab, SP, SectionLabel, AIInsightCard } from "@/components/SensorPage";
import { useT } from "@/context/LanguageContext";

export const Route = createFileRoute("/pressure-sense")({ component: PressureSensePage });

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

function PressureSensePage() {
  const [tab, setTab] = useTimeTab();
  const t = useT();
  const value = 62; // kPa, range 0-100
  const valueAnim = useCount(value, 1200);
  const valuePct = value / 100;

  const [drawn, setDrawn] = useState(false);
  useEffect(() => { const id = setTimeout(() => setDrawn(true), 80); return () => clearTimeout(id); }, []);

  // Semicircle gauge geometry
  const arcR = 100;
  const cx = 130, cy = 130;
  const arcLen = Math.PI * arcR; // half circle circumference
  // marker position
  const markerAngle = Math.PI + Math.PI * valuePct; // 180° to 360°
  const mx = cx + Math.cos(markerAngle) * arcR;
  const my = cy + Math.sin(markerAngle) * arcR;

  const count = 142;
  const countAnim = useCount(count, 1200);

  return (
    <SensorPage
      titleJp="圧力センス AI"
      titleEn="PressureSense AI"
      heroGradient="linear-gradient(135deg,#FFF5F7 0%,#F0F9FF 100%)"
      kanji="嚥"
    >
      <TimeTabs value={tab} onChange={setTab} />

      {/* Pressure gauge */}
      <Card>
        <SectionLabel jp="現在の嚥下圧力" en="Current Pressure" />
        <div style={{ position: "relative", width: 260, height: 160, margin: "0 auto" }}>
          <svg width={260} height={160} viewBox="0 0 260 160">
            <defs>
              <linearGradient id="pGauge" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="45%" stopColor="#F59E0B" />
                <stop offset="80%" stopColor="#F43F72" />
                <stop offset="100%" stopColor="#EF4444" />
              </linearGradient>
            </defs>
            {/* Track */}
            <path d={`M ${cx - arcR} ${cy} A ${arcR} ${arcR} 0 0 1 ${cx + arcR} ${cy}`}
              stroke={SP.divider} strokeWidth={16} fill="none" strokeLinecap="round" />
            {/* Tick marks */}
            {Array.from({ length: 11 }).map((_, i) => {
              const a = Math.PI + (Math.PI * i) / 10;
              const inner = arcR - 12, outer = arcR - 4;
              return (
                <line key={i}
                  x1={cx + Math.cos(a) * inner} y1={cy + Math.sin(a) * inner}
                  x2={cx + Math.cos(a) * outer} y2={cy + Math.sin(a) * outer}
                  stroke={SP.muted} strokeWidth={1} opacity={0.4}
                />
              );
            })}
            {/* Progress arc */}
            <path d={`M ${cx - arcR} ${cy} A ${arcR} ${arcR} 0 0 1 ${cx + arcR} ${cy}`}
              stroke="url(#pGauge)" strokeWidth={16} fill="none" strokeLinecap="round"
              strokeDasharray={arcLen}
              strokeDashoffset={drawn ? arcLen * (1 - valuePct) : arcLen}
              style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.2,.7,.2,1)" }}
            />
            {/* Marker diamond */}
            <g transform={`translate(${mx} ${my}) rotate(45)`}>
              <rect x={-6} y={-6} width={12} height={12} fill="#FFFFFF" stroke={SP.rose} strokeWidth={2} />
            </g>
            <text x={mx} y={my + 22} fontSize="10" fontWeight={700} fill={SP.rose} textAnchor="middle">{value} kPa</text>
          </svg>
          <div style={{ position: "absolute", top: 30, left: 0, right: 0, textAlign: "center" }}>
            <div style={{ fontSize: 48, fontWeight: 800, color: SP.sumi, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
              {valueAnim}
              <span style={{ fontSize: 18, color: SP.muted, marginLeft: 6, fontWeight: 400 }}>kPa</span>
            </div>
            <div style={{ marginTop: 6, display: "inline-flex", alignItems: "center", gap: 6,
              background: SP.okBg, color: SP.ok, padding: "4px 12px", borderRadius: 50, fontSize: 11, fontWeight: 600 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: SP.okDot }} />
              {t("正常", "Normal")}
            </div>
          </div>
        </div>
        <div className="flex justify-between" style={{ marginTop: 6, padding: "0 6px", fontSize: 10, color: SP.muted }}>
          <span>{t("低", "Low")}</span><span>{t("高", "High")}</span>
        </div>
      </Card>

      {/* Swallow count */}
      <Card>
        <SectionLabel jp="飲み込みカウント" en="Swallow Count" />
        <div className="flex items-baseline" style={{ gap: 8 }}>
          <span style={{ fontSize: 48, fontWeight: 800, color: SP.rose, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
            {countAnim}
          </span>
          <span style={{ fontSize: 16, color: SP.muted }}>{t("回", "times")}</span>
        </div>
        <div className="flex items-center" style={{ gap: 8, marginTop: 14 }}>
          <Pill jp="昨日 130回" en="Yesterday 130" />
          <span style={{ color: SP.muted, fontSize: 12 }}>→</span>
          <Pill jp="今日 142回" en="Today 142" active />
          <span style={{ color: SP.ok, fontSize: 12, fontWeight: 700, marginLeft: "auto" }}>+12 ▲</span>
        </div>

        {/* hourly bars */}
        <div style={{ marginTop: 16 }}>
          <div className="flex items-end" style={{ gap: 3, height: 60 }}>
            {HOURLY.map((v, i) => {
              const isPeak = v === Math.max(...HOURLY);
              return (
                <div key={i} style={{
                  flex: 1, height: `${(v / 30) * 100}%`,
                  background: isPeak ? SP.rose : "rgba(244,63,114,0.35)",
                  borderRadius: 3,
                  transform: drawn ? "scaleY(1)" : "scaleY(0)",
                  transformOrigin: "bottom",
                  transition: `transform 600ms cubic-bezier(.2,.7,.2,1) ${i * 30}ms`,
                }} />
              );
            })}
          </div>
          <div className="flex justify-between" style={{ fontSize: 9, color: SP.muted, marginTop: 6 }}>
            {HOUR_LABELS.map((h) => <span key={h}>{h}</span>)}
          </div>
          <div style={{ fontSize: 10, color: SP.rose, marginTop: 6, fontWeight: 600 }}>
            ● {t("最も活発: 12:00-13:00", "Most active: 12:00–13:00")}
          </div>
        </div>
      </Card>

      {/* Pattern graph */}
      <Card>
        <SectionLabel jp="圧力パターン・7日間" en="Pressure Pattern · 7 Days" />
        <svg viewBox="0 0 300 130" width="100%" height={130}>
          <defs>
            <linearGradient id="pressFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={SP.rose} stopOpacity="0.18" />
              <stop offset="100%" stopColor={SP.rose} stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* normal band 40-55 kPa */}
          {(() => {
            const yTop = 95 - (55 / 70) * 75;
            const yBot = 95 - (40 / 70) * 75;
            return <rect x={28} y={yTop} width={262} height={yBot - yTop} fill="#22C55E" opacity={0.08} rx={4} />;
          })()}
          {[{ y: 20, label: "70" }, { y: 55, label: "50" }, { y: 90, label: "30" }].map((g) => (
            <g key={g.label}>
              <line x1={28} x2={290} y1={g.y} y2={g.y} stroke={SP.divider} strokeWidth={1} />
              <text x={24} y={g.y + 3} fontSize="10" fill={SP.muted} textAnchor="end">{g.label}</text>
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
                <path d={d} stroke={SP.rose} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round"
                  pathLength={1} strokeDasharray={1} strokeDashoffset={drawn ? 0 : 1}
                  style={{ transition: "stroke-dashoffset 1.4s ease-out" }} />
                {pts.map((p, i) => (
                  <g key={i}>
                    <circle cx={p[0]} cy={p[1]} r={3} fill="#fff" stroke={SP.rose} strokeWidth={2} />
                    <text x={p[0]} y={120} fontSize="10" fill={SP.muted} textAnchor="middle">{t(DAYS[i].jp, DAYS[i].en)}</text>
                  </g>
                ))}
              </>
            );
          })()}
        </svg>
      </Card>

      <AIInsightCard
        jp="嚥下パターンは正常で、昨日より飲み込み回数が増加しています。"
        en="Swallowing pattern is normal. Count increased from yesterday."
      />
    </SensorPage>
  );
}

function Pill({ jp, en, active }: { jp: string; en: string; active?: boolean }) {
  const t = useT();
  return (
    <span style={{
      padding: "5px 10px", borderRadius: 50, fontSize: 11, fontWeight: 600,
      background: active ? SP.roseTint : "#F3F4F6",
      color: active ? SP.rose : SP.usuzumi,
    }}>{t(jp, en)}</span>
  );
}
