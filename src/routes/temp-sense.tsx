import { createFileRoute } from "@tanstack/react-router";
import { Thermometer, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { SensorPage, Card, TimeTabs, useTimeTab, SP, SectionLabel, AIInsightCard } from "@/components/SensorPage";
import { useT } from "@/context/LanguageContext";

export const Route = createFileRoute("/temp-sense")({ component: TempSensePage });

const HISTORY = [38.2, 38.4, 38.3, 38.6, 38.5, 38.7, 38.5];
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
      setV(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
}

function TempSensePage() {
  const [tab, setTab] = useTimeTab();
  const t = useT();
  const temp = 38.5;
  const tAnim = useCount(temp, 1200);
  const R = 70, sw = 14, cx = 90, cy = 90;
  const C = 2 * Math.PI * R;
  const pct = Math.min(1, Math.max(0, (temp - 37.5) / 2.5));
  const min = Math.min(...HISTORY);
  const max = Math.max(...HISTORY);
  const [drawn, setDrawn] = useState(false);
  useEffect(() => { const id = setTimeout(() => setDrawn(true), 80); return () => clearTimeout(id); }, []);

  // Marker position on spectrum bar — temp range 36..41
  const markerPct = Math.min(1, Math.max(0, (temp - 36) / 5));

  return (
    <SensorPage
      titleJp="体温センス AI"
      titleEn="TempSense AI"
      heroGradient="linear-gradient(135deg,#FFF5F7 0%,#FFF9F5 100%)"
      kanji="熱"
    >
      <TimeTabs value={tab} onChange={setTab} />

      <Card>
        <SectionLabel jp="現在の体温" en="Current Temperature" />
        <div style={{ position: "relative", width: 180, height: 180, margin: "8px auto" }}>
          {/* outer decorative ring with tick marks */}
          <svg width={180} height={180} viewBox="0 0 180 180" style={{ position: "absolute", inset: 0 }}>
            <circle cx={cx} cy={cy} r={84} fill="none" stroke="rgba(244,63,114,0.25)" strokeWidth={1} />
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * 30) * Math.PI / 180;
              const x1 = cx + Math.cos(a) * 80, y1 = cy + Math.sin(a) * 80;
              const x2 = cx + Math.cos(a) * 84, y2 = cy + Math.sin(a) * 84;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(244,63,114,0.4)" strokeWidth={1} />;
            })}
            <defs>
              <linearGradient id="tGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F43F72" />
                <stop offset="100%" stopColor="#FF6B8A" />
              </linearGradient>
            </defs>
            <circle cx={cx} cy={cy} r={R} stroke={SP.divider} strokeWidth={sw} fill="none" />
            <circle
              cx={cx} cy={cy} r={R} stroke="url(#tGrad)" strokeWidth={sw} fill="none" strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={drawn ? C * (1 - pct) : C}
              transform={`rotate(-90 ${cx} ${cy})`}
              style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.2,.7,.2,1)" }}
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Thermometer size={18} style={{ color: SP.rose, marginBottom: 2 }} />
            <div style={{ fontSize: 40, fontWeight: 700, color: SP.sumi, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
              {tAnim.toFixed(1)}<span style={{ fontSize: 20, fontWeight: 400, color: SP.usuzumi }}>°C</span>
            </div>
            <div style={{
              marginTop: 8, fontSize: 12, fontWeight: 600, color: SP.ok,
              background: SP.okBg, padding: "4px 12px", borderRadius: 50,
              display: "inline-flex", alignItems: "center", gap: 6,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: SP.okDot }} />
              {t("正常", "Normal")}
            </div>
          </div>
        </div>
        <div className="flex" style={{ marginTop: 12, paddingTop: 14, borderTop: `1px solid ${SP.divider}` }}>
          <div className="text-center" style={{ flex: 1 }}>
            <TrendingDown size={14} style={{ color: "#6366F1", margin: "0 auto 4px" }} />
            <div style={{ fontSize: 18, fontWeight: 600, color: SP.sumi, fontVariantNumeric: "tabular-nums" }}>{min}°C</div>
            <div style={{ fontSize: 10, color: SP.muted, marginTop: 2 }}>{t("最低気温", "Min")}</div>
          </div>
          <div style={{ width: 1, background: SP.divider }} />
          <div className="text-center" style={{ flex: 1 }}>
            <TrendingUp size={14} style={{ color: SP.rose, margin: "0 auto 4px" }} />
            <div style={{ fontSize: 18, fontWeight: 600, color: SP.sumi, fontVariantNumeric: "tabular-nums" }}>{max}°C</div>
            <div style={{ fontSize: 10, color: SP.muted, marginTop: 2 }}>{t("最高気温", "Max")}</div>
          </div>
        </div>
      </Card>

      {/* History */}
      <Card>
        <SectionLabel jp="体温の推移・7日間" en="Temperature Trend · 7 Days" />
        <svg viewBox="0 0 280 140" width="100%" height={140}>
          <defs>
            <linearGradient id="tFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={SP.rose} stopOpacity="0.18" />
              <stop offset="100%" stopColor={SP.rose} stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* normal range band (38.0-39.2) */}
          {(() => {
            const yTop = 95 - ((39.2 - 37.5) / 2) * 70;
            const yBot = 95 - ((38.0 - 37.5) / 2) * 70;
            return (
              <>
                <rect x={28} y={yTop} width={250} height={yBot - yTop} fill="#22C55E" opacity={0.08} rx={4} />
                <text x={32} y={yTop - 3} fontSize="9" fill="#16A34A">{t("正常範囲", "Normal range")}</text>
              </>
            );
          })()}
          {[37.5, 38.5, 39.5].map((v, i) => (
            <g key={i}>
              <line x1={28} x2={278} y1={20 + i * 35} y2={20 + i * 35} stroke={SP.divider} strokeWidth={1} />
              <text x={24} y={23 + i * 35} fontSize="9" fill={SP.muted} textAnchor="end">{v}</text>
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
                <path d={d} stroke={SP.rose} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round"
                  pathLength={1} strokeDasharray={1} strokeDashoffset={drawn ? 0 : 1}
                  style={{ transition: "stroke-dashoffset 1.4s ease-out" }} />
                {pts.map((p, i) => (
                  <g key={i}>
                    <circle cx={p[0]} cy={p[1]} r={3} fill="#FFFFFF" stroke={SP.rose} strokeWidth={2} />
                    <text x={p[0]} y={120} fontSize="10" fill={SP.muted} textAnchor="middle">{t(DAYS[i].jp, DAYS[i].en)}</text>
                  </g>
                ))}
              </>
            );
          })()}
        </svg>
      </Card>

      {/* Alert thresholds — spectrum bar */}
      <Card>
        <SectionLabel jp="体温アラート" en="Temperature Alerts" />
        <div style={{ position: "relative", height: 28, marginTop: 16, marginBottom: 30 }}>
          <div style={{
            position: "absolute", inset: 0, borderRadius: 50,
            background: "linear-gradient(90deg,#93C5FD 0%,#86EFAC 30%,#FDE68A 60%,#F43F72 85%,#EF4444 100%)",
          }} />
          <div style={{
            position: "absolute", top: -6, left: `${markerPct * 100}%`, transform: "translateX(-50%)",
            width: 4, height: 40, background: "#1A1A2E", borderRadius: 2,
          }} />
          <div style={{
            position: "absolute", top: -22, left: `${markerPct * 100}%`, transform: "translateX(-50%)",
            background: SP.sumi, color: "#fff", padding: "2px 8px", borderRadius: 6,
            fontSize: 10, fontWeight: 700, whiteSpace: "nowrap",
          }}>{temp}°C</div>
        </div>
        <ThresholdRow color={SP.okDot} textColor={SP.ok} jp="正常" en="Normal" range="38.0 – 39.2°C" first />
        <ThresholdRow color={SP.warnDot} textColor={SP.warn} jp="注意" en="Warning" range="39.2 – 40.0°C" />
        <ThresholdRow color={SP.dangerDot} textColor={SP.danger} jp="危険" en="Danger" range="> 40.0°C" />
      </Card>

      <AIInsightCard
        jp="体温は正常範囲内で安定しています。"
        en="Body temperature is stable within normal range."
      />
    </SensorPage>
  );
}

function ThresholdRow({ color, textColor, jp, en, range, first }: {
  color: string; textColor: string; jp: string; en: string; range: string; first?: boolean;
}) {
  const t = useT();
  return (
    <div className="flex items-center" style={{
      gap: 10, padding: "12px 0",
      borderTop: first ? "none" : `1px solid ${SP.divider}`,
    }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
      <div style={{ flex: 1, fontSize: 13, color: SP.ink, fontWeight: 500 }}>{t(jp, en)}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: textColor, fontVariantNumeric: "tabular-nums" }}>{range}</div>
    </div>
  );
}
