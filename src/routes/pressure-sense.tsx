import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Droplet } from "lucide-react";
import { SensorPage, Card, TimeTabs, useTimeTab, SP, Bi } from "@/components/SensorPage";
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
    <SensorPage
      titleJp="嚥下圧力センス"
      titleEn="PressureSense AI · Swallowing Pressure"
      headerGradient="linear-gradient(135deg, #FFE6B8 0%, #FFD49A 100%)"
      accent={SP.yuzu}
    >
      <TimeTabs value={tab} onChange={setTab} />

      <Card accent={SP.yuzu}>
        <div className="flex justify-center" style={{ marginBottom: 10 }}>
          <span style={{
            background: "#E8F5EE", color: SP.matcha, fontWeight: 800,
            padding: "8px 22px", borderRadius: 999, fontSize: 14, letterSpacing: "0.04em",
          }}>● {t("正常", "Normal")}</span>
        </div>

        <div style={{ position: "relative", width: 220, height: 130, margin: "0 auto" }}>
          <svg viewBox="0 0 220 130" width="220" height="130">
            <defs>
              <linearGradient id="pGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6BAF92" />
                <stop offset="50%" stopColor="#D4A843" />
                <stop offset="100%" stopColor="#E53935" />
              </linearGradient>
            </defs>
            <path d="M 20 110 A 90 90 0 0 1 200 110" stroke="#F5F0EC" strokeWidth={18} fill="none" strokeLinecap="round" />
            <path d="M 20 110 A 90 90 0 0 1 200 110" stroke="url(#pGrad)" strokeWidth={18} fill="none" strokeLinecap="round"
              strokeDasharray={`${value * 283} 283`} />
            <g transform={`rotate(${angle} 110 110)`}>
              <line x1={110} y1={110} x2={110} y2={30} stroke={SP.sumi} strokeWidth={3} strokeLinecap="round" />
              <circle cx={110} cy={110} r={8} fill={SP.sumi} />
            </g>
          </svg>
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            textAlign: "center",
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: SP.sumi, fontVariantNumeric: "tabular-nums" }}>62 kPa</div>
            <div style={{ fontSize: 11, color: SP.usuzumi }}>{t("現在の圧力", "Current Pressure")}</div>
          </div>
        </div>
      </Card>

      <Card accent={SP.sora}>
        <div className="flex items-center" style={{ gap: 14 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: "linear-gradient(135deg,#E8F2FF,#C8E0F8)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Droplet size={26} style={{ color: SP.sora }} />
          </div>
          <div style={{ flex: 1 }}>
            <Bi
              jp="今日の飲み込み回数" en="Today's Swallow Count"
              jpStyle={{ fontSize: 11, color: SP.usuzumi }}
              enStyle={{ fontSize: 11, color: SP.usuzumi, opacity: 0.7 }}
            />
            <div style={{ fontSize: 28, fontWeight: 800, color: SP.sumi, fontVariantNumeric: "tabular-nums", marginTop: 4 }}>
              142<span style={{ fontSize: 14, color: SP.usuzumi, marginLeft: 4 }}>{t("回", "times")}</span>
            </div>
          </div>
        </div>
      </Card>

      <Card accent={SP.yuzu}>
        <Bi
          jp="圧力パターン" en="Pressure Pattern · 7 days"
          jpStyle={{ fontSize: 14, fontWeight: 700, color: SP.sumi }}
          enStyle={{ fontSize: 11, color: SP.usuzumi, marginBottom: 12 }}
        />
        <svg viewBox="0 0 280 100" width="100%" height={100} style={{ marginTop: 8 }}>
          <defs>
            <linearGradient id="pressFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D4A843" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#D4A843" stopOpacity="0" />
            </linearGradient>
          </defs>
          {(() => {
            const pts = PATTERN.map((v, i) => [20 + i * 40, 90 - (v / 70) * 70] as [number, number]);
            const d = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
            const fill = `${d} L${pts[pts.length - 1][0]},95 L${pts[0][0]},95 Z`;
            return (
              <>
                <path d={fill} fill="url(#pressFill)" />
                <path d={d} stroke="#D4A843" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                {pts.map((p, i) => (
                  <g key={i}>
                    <circle cx={p[0]} cy={p[1]} r={3} fill="#fff" stroke="#D4A843" strokeWidth={2} />
                    <text x={p[0]} y={108} fontSize="9" fill="#8A8A8A" textAnchor="middle">{t(DAYS[i].jp, DAYS[i].en)}</text>
                  </g>
                ))}
              </>
            );
          })()}
        </svg>
      </Card>

      <Card accent={SP.fuji} style={{ background: "linear-gradient(135deg,#F5F0FF,#FFFFFF)" }}>
        <div className="flex items-start" style={{ gap: 10 }}>
          <Sparkles size={20} style={{ color: SP.fuji, flexShrink: 0, marginTop: 2 }} />
          <div>
            <Bi
              jp="AIの洞察" en="AI Insight"
              jpStyle={{ fontSize: 13, fontWeight: 700, color: SP.sumi }}
              enStyle={{ fontSize: 11, color: SP.usuzumi, marginBottom: 6 }}
            />
            <div style={{ fontSize: 12, color: SP.sumi, lineHeight: 1.5, marginTop: 4 }}>
              <Bi
                jp="嚥下パターンは正常です。異常は検出されていません。"
                en="Swallowing pattern is normal. No irregularities detected."
                jpStyle={{ color: SP.sumi }}
                enStyle={{ color: SP.usuzumi, fontSize: 11, marginTop: 2 }}
              />
            </div>
          </div>
        </div>
      </Card>
    </SensorPage>
  );
}
