import { createFileRoute } from "@tanstack/react-router";
import { Droplet } from "lucide-react";
import { SensorPage, useTimeTab, SP, Bi } from "@/components/SensorPage";
import { useT } from "@/context/LanguageContext";

export const Route = createFileRoute("/pressure-sense")({ component: PressureSensePage });

const ROSE = "#E8829A";
const ROSE_DEEP = "#F43F72";
const PATTERN = [42, 48, 45, 52, 50, 47, 49];
const DAYS = [
  { jp: "月", en: "Mon" }, { jp: "火", en: "Tue" }, { jp: "水", en: "Wed" },
  { jp: "木", en: "Thu" }, { jp: "金", en: "Fri" }, { jp: "土", en: "Sat" }, { jp: "日", en: "Sun" },
];

function SoftCard({ children }: { children: React.ReactNode; accent?: string }) {
  return (
    <div style={{
      background: "#FFFFFF", borderRadius: 20, padding: 20, marginBottom: 12,
      boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
    }}>{children}</div>
  );
}

function SoftTabs({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const tabs = ["1d", "1w", "1m"];
  return (
    <div className="flex items-center justify-center" style={{ gap: 6, marginBottom: 14 }}>
      {tabs.map((tab) => {
        const active = value === tab;
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            style={{
              padding: "6px 18px", borderRadius: 999, fontSize: 12, fontWeight: 600,
              letterSpacing: "0.06em", border: "none", cursor: "pointer",
              background: active ? ROSE : "transparent",
              color: active ? "#fff" : SP.usuzumi,
              boxShadow: active ? "0 2px 8px rgba(232,130,154,0.28)" : "none",
              transition: "all 0.2s",
            }}
          >{tab.toUpperCase()}</button>
        );
      })}
    </div>
  );
}

function PressureSensePage() {
  const [tab, setTab] = useTimeTab();
  const t = useT();
  const value = 0.62;
  const angle = -180 + value * 180;

  return (
    <SensorPage
      titleJp="圧力センス"
      titleEn="Swallowing Pressure Analysis"
      headerGradient="linear-gradient(135deg,#FFE8EE 0%,#FFF2F5 60%,#FFF8F4 100%)"
      accent={ROSE}
    >
      <SoftTabs value={tab} onChange={setTab} />

      {/* Pressure gauge */}
      <SoftCard accent={ROSE}>
        <div className="flex justify-center" style={{ marginBottom: 8 }}>
          <span style={{
            background: "#E8F5E9", color: "#2E7D32", fontWeight: 500,
            padding: "5px 14px", borderRadius: 999, fontSize: 11, letterSpacing: "0.04em",
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2E7D32" }} />
            {t("正常", "Normal")}
          </span>
        </div>

        <div style={{ position: "relative", width: 240, height: 140, margin: "8px auto 0" }}>
          <svg viewBox="0 0 240 140" width="240" height="140">
            <defs>
              <linearGradient id="pGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={ROSE} />
                <stop offset="55%" stopColor="#E8C46A" />
                <stop offset="100%" stopColor="#E88787" />
              </linearGradient>
            </defs>
            <path d="M 24 120 A 96 96 0 0 1 216 120"
              stroke="#F5EAEE" strokeWidth={14} fill="none" strokeLinecap="round" />
            <path d="M 24 120 A 96 96 0 0 1 216 120"
              stroke="url(#pGrad)" strokeWidth={14} fill="none" strokeLinecap="round"
              strokeDasharray={`${value * 302} 302`} />
            <g transform={`rotate(${angle} 120 120)`}>
              <line x1={120} y1={120} x2={120} y2={36}
                stroke={ROSE} strokeWidth={2} strokeLinecap="round" />
              <circle cx={120} cy={120} r={5} fill={ROSE} />
              <circle cx={120} cy={120} r={2.5} fill="#fff" />
            </g>
          </svg>
        </div>

        <div style={{ textAlign: "center", marginTop: 4 }}>
          <div style={{ fontSize: 32, fontWeight: 500, color: "#2D2D2D", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" }}>
            62<span style={{ fontSize: 14, color: SP.usuzumi, marginLeft: 6, fontWeight: 400 }}>kPa</span>
          </div>
          <Bi
            jp="現在の圧力" en="Current Pressure"
            jpStyle={{ fontSize: 11, color: SP.usuzumi, marginTop: 4 }}
            enStyle={{ fontSize: 11, color: SP.usuzumi, marginTop: 4 }}
          />
        </div>
      </SoftCard>

      {/* Swallow count */}
      <SoftCard accent={ROSE}>
        <div className="flex items-center" style={{ gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            background: "#FDF4F7",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Droplet size={22} style={{ color: ROSE }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: SP.usuzumi, fontWeight: 500 }}>
              {t("今日の飲み込み回数", "Today's Swallow Count")}
            </div>
            <div style={{ fontSize: 10, color: SP.usuzumi, opacity: 0.7, marginTop: 1 }}>
              {t("/ Today's Swallow Count", "/ 今日の飲み込み回数")}
            </div>
            <div style={{ marginTop: 6 }}>
              <span style={{ fontSize: 26, fontWeight: 700, color: ROSE_DEEP, fontVariantNumeric: "tabular-nums" }}>142</span>
              <span style={{ fontSize: 12, color: SP.usuzumi, marginLeft: 6 }}>{t("回 / times", "times")}</span>
            </div>
          </div>
        </div>
      </SoftCard>

      {/* Pattern graph */}
      <SoftCard accent={ROSE}>
        <div className="flex items-baseline" style={{ gap: 8, marginBottom: 8 }}>
          <Bi
            jp="圧力パターン" en="Pressure Pattern"
            jpStyle={{ fontSize: 13, fontWeight: 600, color: SP.sumi }}
            enStyle={{ fontSize: 13, fontWeight: 600, color: SP.sumi }}
          />
          <span style={{ fontSize: 11, color: SP.usuzumi }}>
            {t("・7日間", "· 7 days")}
          </span>
        </div>
        <svg viewBox="0 0 300 110" width="100%" height={110} style={{ marginTop: 6 }}>
          <defs>
            <linearGradient id="pressFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ROSE_DEEP} stopOpacity="0.18" />
              <stop offset="100%" stopColor="#FFF0F3" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* y-axis ticks */}
          {[20, 50, 80].map((y) => (
            <line key={y} x1={28} x2={290} y1={y} y2={y} stroke="#F5EAEE" strokeWidth={1} />
          ))}
          {[
            { y: 20, label: "70" },
            { y: 50, label: "50" },
            { y: 80, label: "30" },
          ].map((g) => (
            <text key={g.label} x={22} y={g.y + 3} fontSize="8" fill="#B0A8A2" textAnchor="end">{g.label}</text>
          ))}
          {(() => {
            const pts = PATTERN.map((v, i) => [40 + i * 38, 90 - (v / 70) * 70] as [number, number]);
            // smooth curve
            const d = pts.reduce((acc, p, i) => {
              if (i === 0) return `M${p[0]},${p[1]}`;
              const prev = pts[i - 1];
              const cx1 = prev[0] + (p[0] - prev[0]) / 2;
              return `${acc} C${cx1},${prev[1]} ${cx1},${p[1]} ${p[0]},${p[1]}`;
            }, "");
            const fill = `${d} L${pts[pts.length - 1][0]},95 L${pts[0][0]},95 Z`;
            return (
              <>
                <path d={fill} fill="url(#pressFill)" />
                <path d={d} stroke={ROSE_DEEP} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                {pts.map((p, i) => (
                  <g key={i}>
                    <circle cx={p[0]} cy={p[1]} r={3} fill="#fff" stroke={ROSE_DEEP} strokeWidth={1.5} />
                    <text x={p[0]} y={106} fontSize="9" fill="#B0A8A2" textAnchor="middle">{t(DAYS[i].jp, DAYS[i].en)}</text>
                  </g>
                ))}
              </>
            );
          })()}
        </svg>
      </SoftCard>

      {/* AI Insight */}
      <div style={{
        background: "linear-gradient(135deg,#FFF0F3 0%,#FFFFFF 100%)",
        borderRadius: 20, padding: 18, marginBottom: 16,
        boxShadow: "0 2px 14px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)",
        borderLeft: `3px solid ${ROSE}`,
      }}>
        <div className="flex items-center" style={{ gap: 6 }}>
          <span style={{ color: ROSE, fontSize: 13, lineHeight: 1 }}>✦</span>
          <span style={{ fontSize: 11, color: ROSE, fontWeight: 600, letterSpacing: "0.08em" }}>
            {t("AI インサイト / AI Insight", "AI INSIGHT")}
          </span>
        </div>
        <div style={{ height: 1, background: "#F5EAEE", margin: "10px 0 12px" }} />
        <div style={{ fontSize: 13, color: SP.sumi, lineHeight: 1.55 }}>
          {t("嚥下パターンは正常です。異常は検出されていません。",
             "Swallowing pattern is normal. No irregularities detected.")}
        </div>
        <div style={{ fontSize: 11, color: SP.usuzumi, lineHeight: 1.5, marginTop: 4 }}>
          {t("Swallowing pattern is normal. No irregularities detected.",
             "嚥下パターンは正常です。")}
        </div>
        <div style={{ fontSize: 10, color: "#B0A8A2", marginTop: 12 }}>
          {t("最終更新 / Last updated: 今日 14:32", "Last updated: Today 14:32")}
        </div>
      </div>
    </SensorPage>
  );
}
