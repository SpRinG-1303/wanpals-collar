import { createFileRoute } from "@tanstack/react-router";
import { Thermometer, TrendingDown, TrendingUp } from "lucide-react";
import { SensorPage, Card, TimeTabs, useTimeTab, SP, Bi, SectionLabel, AIInsightCard } from "@/components/SensorPage";
import { useT } from "@/context/LanguageContext";

export const Route = createFileRoute("/temp-sense")({ component: TempSensePage });

const HISTORY = [38.2, 38.4, 38.3, 38.6, 38.5, 38.7, 38.5];
const DAYS = [
  { jp: "月", en: "Mon" }, { jp: "火", en: "Tue" }, { jp: "水", en: "Wed" },
  { jp: "木", en: "Thu" }, { jp: "金", en: "Fri" }, { jp: "土", en: "Sat" }, { jp: "日", en: "Sun" },
];

function TempSensePage() {
  const [tab, setTab] = useTimeTab();
  const t = useT();
  const temp = 38.5;
  const R = 64;
  const C = 2 * Math.PI * R;
  const pct = Math.min(1, Math.max(0, (temp - 37.5) / 2.5));
  const min = Math.min(...HISTORY);
  const max = Math.max(...HISTORY);

  return (
    <SensorPage titleJp="体温センス AI" titleEn="TempSense AI">
      <TimeTabs value={tab} onChange={setTab} />

      <Card>
        <SectionLabel jp="現在の体温" en="Current Temperature" />
        <div style={{ position: "relative", width: 160, height: 160, margin: "8px auto" }}>
          <svg width={160} height={160}>
            <circle cx={80} cy={80} r={R} stroke={SP.divider} strokeWidth={12} fill="none" />
            <circle
              cx={80} cy={80} r={R} stroke="url(#tGrad)" strokeWidth={12} fill="none"
              strokeLinecap="round" strokeDasharray={`${C * pct} ${C}`}
              transform="rotate(-90 80 80)"
            />
            <defs>
              <linearGradient id="tGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={SP.rose} />
                <stop offset="100%" stopColor={SP.roseSoft} />
              </linearGradient>
            </defs>
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Thermometer size={18} style={{ color: SP.rose, marginBottom: 2 }} />
            <div style={{ fontSize: 36, fontWeight: 700, color: SP.sumi, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
              {temp}<span style={{ fontSize: 18, fontWeight: 400, color: SP.usuzumi }}>°C</span>
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
            <TrendingDown size={14} style={{ color: SP.sora, margin: "0 auto 4px" }} />
            <div style={{ fontSize: 16, fontWeight: 600, color: SP.sumi, fontVariantNumeric: "tabular-nums" }}>{min}°C</div>
            <div style={{ fontSize: 11, color: SP.muted, marginTop: 2 }}>{t("最低", "Min")}</div>
          </div>
          <div style={{ width: 1, background: SP.divider }} />
          <div className="text-center" style={{ flex: 1 }}>
            <TrendingUp size={14} style={{ color: SP.rose, margin: "0 auto 4px" }} />
            <div style={{ fontSize: 16, fontWeight: 600, color: SP.sumi, fontVariantNumeric: "tabular-nums" }}>{max}°C</div>
            <div style={{ fontSize: 11, color: SP.muted, marginTop: 2 }}>{t("最高", "Max")}</div>
          </div>
        </div>
      </Card>

      <Card>
        <SectionLabel jp="体温履歴・7日間" en="Temperature History · 7 Days" />
        <svg viewBox="0 0 280 130" width="100%" height={130}>
          <defs>
            <linearGradient id="tFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={SP.rose} stopOpacity="0.16" />
              <stop offset="100%" stopColor={SP.rose} stopOpacity="0" />
            </linearGradient>
          </defs>
          {[37.5, 38.5, 39.5].map((v, i) => (
            <g key={i}>
              <line x1={28} x2={278} y1={20 + i * 35} y2={20 + i * 35} stroke={SP.divider} strokeWidth={1} />
              <text x={24} y={23 + i * 35} fontSize="10" fill={SP.muted} textAnchor="end">{v}</text>
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
                <path d={d} stroke={SP.rose} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                {pts.map((p, i) => (
                  <g key={i}>
                    <circle cx={p[0]} cy={p[1]} r={3} fill="#FFFFFF" stroke={SP.rose} strokeWidth={2} />
                    <text x={p[0]} y={115} fontSize="11" fill={SP.muted} textAnchor="middle">{t(DAYS[i].jp, DAYS[i].en)}</text>
                  </g>
                ))}
              </>
            );
          })()}
        </svg>
      </Card>

      <Card>
        <SectionLabel jp="アラートしきい値" en="Alert Thresholds" />
        <ThresholdRow color={SP.okDot} textColor={SP.ok} jp="正常" en="Normal" range="38.0 – 39.2°C" first />
        <ThresholdRow color={SP.warnDot} textColor={SP.warn} jp="注意" en="Warning" range="39.2 – 40.0°C" />
        <ThresholdRow color={SP.dangerDot} textColor={SP.danger} jp="危険" en="Danger" range="> 40.0°C" />
      </Card>

      <AIInsightCard
        jp="体温は正常範囲内で安定しています。過去7日間で大きな変動はありません。"
        en="Temperature is stable within the normal range. No significant variation over the past 7 days."
      />
    </SensorPage>
  );
}

function ThresholdRow({ color, textColor, jp, en, range, first }: {
  color: string; textColor: string; jp: string; en: string; range: string; first?: boolean;
}) {
  return (
    <div className="flex items-center" style={{
      gap: 10, padding: "14px 0",
      borderTop: first ? "none" : `1px solid ${SP.divider}`,
    }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <Bi
          jp={jp} en={en}
          jpStyle={{ fontSize: 13, fontWeight: 500, color: SP.ink }}
          enStyle={{ fontSize: 11, color: SP.muted }}
        />
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: textColor, fontVariantNumeric: "tabular-nums" }}>{range}</div>
    </div>
  );
}
