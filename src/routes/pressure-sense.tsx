import { createFileRoute } from "@tanstack/react-router";
import { Droplet } from "lucide-react";
import { SensorPage, Card, TimeTabs, useTimeTab, SP, Bi, SectionLabel, AIInsightCard } from "@/components/SensorPage";
import { useT } from "@/context/LanguageContext";

export const Route = createFileRoute("/pressure-sense")({ component: PressureSensePage });

const PATTERN = [42, 48, 45, 52, 50, 47, 49];
const DAYS = [
  { jp: "月", en: "Mon" }, { jp: "火", en: "Tue" }, { jp: "水", en: "Wed" },
  { jp: "木", en: "Thu" }, { jp: "金", en: "Fri" }, { jp: "土", en: "Sat" }, { jp: "日", en: "Sun" },
];

function PressureSensePage() {
  const [tab, setTab] = useTimeTab();
  const t = useT();
  const value = 0.62;
  const angle = -180 + value * 180;

  return (
    <SensorPage titleJp="圧力センス AI" titleEn="PressureSense AI">
      <TimeTabs value={tab} onChange={setTab} />

      {/* Pressure gauge */}
      <Card>
        <SectionLabel jp="現在の圧力" en="Current Pressure" />
        <div style={{ position: "relative", width: 240, height: 140, margin: "0 auto" }}>
          <svg viewBox="0 0 240 140" width="240" height="140">
            <defs>
              <linearGradient id="pGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={SP.rose} />
                <stop offset="100%" stopColor={SP.roseSoft} />
              </linearGradient>
            </defs>
            <path d="M 24 120 A 96 96 0 0 1 216 120"
              stroke={SP.divider} strokeWidth={12} fill="none" strokeLinecap="round" />
            <path d="M 24 120 A 96 96 0 0 1 216 120"
              stroke="url(#pGrad)" strokeWidth={12} fill="none" strokeLinecap="round"
              strokeDasharray={`${value * 302} 302`} />
            <g transform={`rotate(${angle} 120 120)`}>
              <line x1={120} y1={120} x2={120} y2={36}
                stroke={SP.rose} strokeWidth={2} strokeLinecap="round" />
              <circle cx={120} cy={120} r={5} fill={SP.rose} />
              <circle cx={120} cy={120} r={2.5} fill="#fff" />
            </g>
            <text x={24} y={138} fontSize="10" fill={SP.muted} textAnchor="middle">{t("低", "Low")}</text>
            <text x={216} y={138} fontSize="10" fill={SP.muted} textAnchor="middle">{t("高", "High")}</text>
          </svg>
        </div>

        <div style={{ textAlign: "center", marginTop: 4 }}>
          <div style={{ fontSize: 40, fontWeight: 700, color: SP.sumi, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
            62<span style={{ fontSize: 16, color: SP.muted, marginLeft: 6, fontWeight: 400 }}>kPa</span>
          </div>
          <Bi
            jp="現在の圧力" en="Current Pressure"
            jpStyle={{ fontSize: 11, color: SP.muted, marginTop: 6 }}
            enStyle={{ fontSize: 11, color: SP.muted, marginTop: 6 }}
          />
          <div style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6,
            background: SP.okBg, color: SP.ok, padding: "4px 12px", borderRadius: 50,
            fontSize: 12, fontWeight: 600 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: SP.okDot }} />
            {t("正常", "Normal")}
          </div>
        </div>
      </Card>

      {/* Swallow count */}
      <Card>
        <SectionLabel jp="今日の飲み込み" en="Today's Swallow Count" />
        <div className="flex items-center" style={{ gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            background: SP.roseFaint,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Droplet size={20} style={{ color: SP.rose }} />
          </div>
          <div style={{ flex: 1 }}>
            <div>
              <span style={{ fontSize: 32, fontWeight: 700, color: SP.rose, fontVariantNumeric: "tabular-nums" }}>142</span>
              <span style={{ fontSize: 16, color: SP.muted, marginLeft: 6 }}>{t("回", "")}</span>
            </div>
            <div style={{ fontSize: 12, color: SP.muted, marginTop: 2 }}>
              {t("飲み込み", "swallows today")}
            </div>
            <div style={{ fontSize: 12, color: SP.ok, marginTop: 4, fontWeight: 500 }}>
              {t("昨日より +12回", "+12 more than yesterday")}
            </div>
          </div>
        </div>
      </Card>

      {/* Pattern graph */}
      <Card>
        <SectionLabel jp="圧力パターン・7日間" en="Pressure Pattern · 7 Days" />
        <svg viewBox="0 0 300 130" width="100%" height={130}>
          <defs>
            <linearGradient id="pressFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={SP.rose} stopOpacity="0.16" />
              <stop offset="100%" stopColor={SP.rose} stopOpacity="0" />
            </linearGradient>
          </defs>
          {[
            { y: 20, label: "70" },
            { y: 55, label: "50" },
            { y: 90, label: "30" },
          ].map((g) => (
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
                <path d={d} stroke={SP.rose} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                {pts.map((p, i) => (
                  <g key={i}>
                    <circle cx={p[0]} cy={p[1]} r={3} fill="#fff" stroke={SP.rose} strokeWidth={2} />
                    <text x={p[0]} y={120} fontSize="11" fill={SP.muted} textAnchor="middle">{t(DAYS[i].jp, DAYS[i].en)}</text>
                  </g>
                ))}
              </>
            );
          })()}
        </svg>
      </Card>

      <AIInsightCard
        jp="嚥下パターンは正常です。異常は検出されていません。"
        en="Swallowing pattern is normal. No irregularities detected."
      />
    </SensorPage>
  );
}
