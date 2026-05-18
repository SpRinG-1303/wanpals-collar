import { createFileRoute } from "@tanstack/react-router";
import { Thermometer, TrendingDown, TrendingUp } from "lucide-react";
import { SensorPage, Card, TimeTabs, useTimeTab, SP, Bi } from "@/components/SensorPage";
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
    <SensorPage
      titleJp="体温センス"
      titleEn="TempSense AI · Body Temperature"
      headerGradient="linear-gradient(135deg, #FFD9B8 0%, #FFC1A0 100%)"
      accent={SP.momiji}
    >
      <TimeTabs value={tab} onChange={setTab} />

      <Card>
        <div style={{ position: "relative", width: 160, height: 160, margin: "8px auto" }}>
          <svg width={160} height={160}>
            <circle cx={80} cy={80} r={R} stroke="#FFF0F3" strokeWidth={12} fill="none" />
            <circle
              cx={80} cy={80} r={R} stroke="url(#tGrad)" strokeWidth={12} fill="none"
              strokeLinecap="round" strokeDasharray={`${C * pct} ${C}`}
              transform="rotate(-90 80 80)"
            />
            <defs>
              <linearGradient id="tGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F43F72" />
                <stop offset="100%" stopColor="#E8829A" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Thermometer size={20} style={{ color: SP.rose, marginBottom: 2 }} />
            <div style={{ fontSize: 32, fontWeight: 700, color: SP.sumi, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
              {temp}<span style={{ fontSize: 16 }}>°C</span>
            </div>
            <div style={{
              marginTop: 8, fontSize: 10, fontWeight: 700, color: "#2E7D32",
              background: "#E8F5E9", padding: "3px 10px", borderRadius: 999,
            }}>{t("正常範囲", "Normal")}</div>
          </div>
        </div>
        <div className="flex justify-around" style={{ marginTop: 8, paddingTop: 14, borderTop: `1px solid ${SP.divider}` }}>
          <div className="text-center">
            <TrendingDown size={14} style={{ color: SP.rose, margin: "0 auto" }} />
            <div style={{ fontSize: 16, fontWeight: 700, color: SP.sumi, fontVariantNumeric: "tabular-nums" }}>{min}°C</div>
            <div style={{ fontSize: 10, color: SP.usuzumi }}>{t("最低", "Min")}</div>
          </div>
          <div className="text-center">
            <TrendingUp size={14} style={{ color: SP.rose, margin: "0 auto" }} />
            <div style={{ fontSize: 16, fontWeight: 700, color: SP.sumi, fontVariantNumeric: "tabular-nums" }}>{max}°C</div>
            <div style={{ fontSize: 10, color: SP.usuzumi }}>{t("最高", "Max")}</div>
          </div>
        </div>
      </Card>

      <Card>
        <Bi
          jp="体温履歴" en="Temperature History · 7 days"
          jpStyle={{ fontSize: 14, fontWeight: 700, color: SP.sumi }}
          enStyle={{ fontSize: 11, color: SP.usuzumi, marginBottom: 12 }}
        />
        <svg viewBox="0 0 280 110" width="100%" height={110} style={{ marginTop: 8 }}>
          <defs>
            <linearGradient id="tFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F43F72" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#FFF0F3" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[37.5, 38.5, 39.5].map((v, i) => (
            <line key={i} x1={20} x2={280} y1={20 + i * 35} y2={20 + i * 35} stroke="#FAE0E8" strokeWidth={1} strokeDasharray="3 3" />
          ))}
          {(() => {
            const pts = HISTORY.map((v, i) => [25 + i * 40, 90 - ((v - 37.5) / 2) * 70] as [number, number]);
            const d = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
            const fillD = `${d} L${pts[pts.length - 1][0]},95 L${pts[0][0]},95 Z`;
            return (
              <>
                <path d={fillD} fill="url(#tFill)" />
                <path d={d} stroke="#F43F72" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                {pts.map((p, i) => (
                  <g key={i}>
                    <circle cx={p[0]} cy={p[1]} r={4} fill="#FFFFFF" stroke="#F43F72" strokeWidth={2} />
                    <text x={p[0]} y={108} fontSize="9" fill="#8A8A8A" textAnchor="middle">{t(DAYS[i].jp, DAYS[i].en)}</text>
                  </g>
                ))}
              </>
            );
          })()}
        </svg>
      </Card>

      <Card>
        <Bi
          jp="警告しきい値" en="Alert Thresholds"
          jpStyle={{ fontSize: 14, fontWeight: 700, color: SP.sumi }}
          enStyle={{ fontSize: 11, color: SP.usuzumi, marginBottom: 14 }}
        />
        <ThresholdRow color="#2E7D32" jp="正常範囲" en="Normal" range="38.0 – 39.2°C" />
        <ThresholdRow color="#F57F17" jp="注意" en="Warning" range="39.2 – 40.0°C" />
        <ThresholdRow color="#C62828" jp="危険" en="Danger" range="> 40.0°C" />
      </Card>
    </SensorPage>
  );
}

function ThresholdRow({ color, jp, en, range }: { color: string; jp: string; en: string; range: string }) {
  return (
    <div className="flex items-center" style={{ gap: 10, padding: "8px 0" }}>
      <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <Bi
          jp={jp} en={en}
          jpStyle={{ fontSize: 13, fontWeight: 600, color: SP.sumi }}
          enStyle={{ fontSize: 10, color: SP.usuzumi }}
        />
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color, fontVariantNumeric: "tabular-nums" }}>{range}</div>
    </div>
  );
}
