import { createFileRoute } from "@tanstack/react-router";
import { Footprints, Flame, Moon, Activity } from "lucide-react";
import { SensorPage, Card, TimeTabs, useTimeTab, SP, Bi, SectionLabel, AIInsightCard } from "@/components/SensorPage";
import { useT, useLanguage } from "@/context/LanguageContext";

export const Route = createFileRoute("/motion-sense")({ component: MotionSensePage });

const WEEK = [
  { jp: "月", en: "Mon", v: 3200 },
  { jp: "火", en: "Tue", v: 4100 },
  { jp: "水", en: "Wed", v: 2800 },
  { jp: "木", en: "Thu", v: 5200 },
  { jp: "金", en: "Fri", v: 3600 },
  { jp: "土", en: "Sat", v: 4800 },
  { jp: "日", en: "Sun", v: 2340 },
];

const LINE = [55, 62, 48, 70, 58, 75, 65];

function MotionSensePage() {
  const [tab, setTab] = useTimeTab();
  const t = useT();
  const { language } = useLanguage();
  const steps = 2340;
  const goal = 5000;
  const pct = Math.round((steps / goal) * 100);
  const R = 56;
  const C = 2 * Math.PI * R;
  const max = Math.max(...WEEK.map((d) => d.v));

  return (
    <SensorPage
      titleJp="モーションセンス"
      titleEn="MotionSense · Activity Tracking"
      headerGradient="linear-gradient(135deg, #C8DAFF 0%, #E0D4FF 100%)"
      accent={SP.sora}
    >
      <TimeTabs value={tab} onChange={setTab} />

      <Card>
        <div className="flex items-center" style={{ gap: 18 }}>
          <div style={{ position: "relative", width: 140, height: 140 }}>
            <svg width={140} height={140}>
              <circle cx={70} cy={70} r={R} stroke="#FFF0F3" strokeWidth={10} fill="none" />
              <circle
                cx={70} cy={70} r={R} stroke="url(#mGrad)" strokeWidth={10} fill="none"
                strokeLinecap="round" strokeDasharray={`${(C * pct) / 100} ${C}`}
                transform="rotate(-90 70 70)"
              />
              <defs>
                <linearGradient id="mGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#F43F72" />
                  <stop offset="100%" stopColor="#E8829A" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: SP.sumi, fontVariantNumeric: "tabular-nums" }}>{steps.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: SP.usuzumi, marginTop: 2 }}>{t("歩", "steps")}</div>
              <div style={{ fontSize: 10, color: SP.rose, fontWeight: 700, marginTop: 4 }}>{pct}%</div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <Bi
              jp="今日の歩数" en="Today's Steps"
              jpStyle={{ fontSize: 12, color: SP.usuzumi }}
              enStyle={{ fontSize: 11, color: SP.usuzumi, opacity: 0.7 }}
            />
            <Bi
              jp="目標" en="Goal"
              jpStyle={{ marginTop: 10, fontSize: 11, color: SP.usuzumi }}
              enStyle={{ fontSize: 10, color: SP.usuzumi, opacity: 0.7 }}
            />
            <div style={{ fontSize: 18, fontWeight: 700, color: SP.sumi, fontVariantNumeric: "tabular-nums" }}>
              {goal.toLocaleString()}{t("歩", "")}
            </div>
            <div style={{ marginTop: 6, fontSize: 11, color: SP.rose, fontWeight: 600 }}>
              {t(`あと ${(goal - steps).toLocaleString()}歩`, `${(goal - steps).toLocaleString()} to go`)}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <Bi
          jp="週間アクティビティ" en="Weekly Activity"
          jpStyle={{ fontSize: 14, fontWeight: 700, color: SP.sumi }}
          enStyle={{ fontSize: 11, color: SP.usuzumi, marginBottom: 14 }}
        />
        <div
          className="flex items-end justify-between"
          style={{
            height: 140, gap: 8, marginTop: language === "mixed" ? 0 : 14,
            background: "#FFF8FA", borderRadius: 12, padding: "10px 8px",
          }}
        >
          {WEEK.map((d, i) => {
            const barH = Math.max(6, (d.v / max) * 96);
            const isToday = i === WEEK.length - 1;
            return (
              <div key={d.en} className="flex flex-col items-center justify-end" style={{ flex: 1, height: "100%" }}>
                <div style={{ fontSize: 9, color: SP.usuzumi, marginBottom: 4, fontVariantNumeric: "tabular-nums" }}>
                  {(d.v / 1000).toFixed(1)}k
                </div>
                <div style={{
                  width: "100%", height: barH, borderRadius: "6px 6px 2px 2px",
                  background: isToday ? "#F43F72" : "#F8B4C4",
                }} />
                <div style={{ fontSize: 11, color: isToday ? SP.rose : SP.usuzumi, marginTop: 6, fontWeight: isToday ? 700 : 500 }}>
                  {t(d.jp, d.en)}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-3" style={{ gap: 8, marginBottom: 12 }}>
        <StatCard icon={<Activity size={18} />} valJp="2時間" valEn="2h" labelJp="活動時間" labelEn="Active" />
        <StatCard icon={<Moon size={18} />} valJp="14時間" valEn="14h" labelJp="休息時間" labelEn="Rest" />
        <StatCard icon={<Flame size={18} />} valJp="285" valEn="285 kcal" labelJp="カロリー" labelEn="Calories" />
      </div>

      <Card>
        <Bi
          jp="活動レベル" en="Activity Level · Past 7 Days"
          jpStyle={{ fontSize: 14, fontWeight: 700, color: SP.sumi }}
          enStyle={{ fontSize: 11, color: SP.usuzumi, marginBottom: 12 }}
        />
        <svg viewBox="0 0 280 100" width="100%" height={100} style={{ marginTop: language === "mixed" ? 0 : 12 }}>
          <defs>
            <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F43F72" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#FFF0F3" stopOpacity="0" />
            </linearGradient>
          </defs>
          {(() => {
            const pts = LINE.map((v, i) => [10 + i * 43, 90 - (v / 100) * 70] as [number, number]);
            const d = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
            const fill = `${d} L${pts[pts.length - 1][0]},95 L${pts[0][0]},95 Z`;
            return (
              <>
                <path d={fill} fill="url(#lineFill)" />
                <path d={d} stroke="#F43F72" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                {pts.map((p, i) => (
                  <circle key={i} cx={p[0]} cy={p[1]} r={3} fill="#FFFFFF" stroke="#F43F72" strokeWidth={2} />
                ))}
              </>
            );
          })()}
        </svg>
      </Card>

      <Card>
        <div className="flex items-start" style={{ gap: 10 }}>
          <Footprints size={20} style={{ color: SP.rose, flexShrink: 0, marginTop: 2 }} />
          <div>
            <Bi
              jp="AIインサイト" en="AI Insight"
              jpStyle={{ fontSize: 13, fontWeight: 700, color: SP.sumi }}
              enStyle={{ fontSize: 11, color: SP.usuzumi, marginBottom: 6 }}
            />
            <div style={{ fontSize: 12, color: SP.sumi, lineHeight: 1.5, marginTop: 4 }}>
              <Bi
                jp="今週は前週比12%増加。順調なペースです。"
                en="Activity up 12% from last week. Great pace!"
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

function StatCard({ icon, valJp, valEn, labelJp, labelEn }: {
  icon: React.ReactNode; valJp: string; valEn: string; labelJp: string; labelEn: string;
}) {
  const t = useT();
  return (
    <div style={{
      background: SP.card, borderRadius: 16, padding: 14,
      boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
    }}>
      <div style={{ color: SP.rose, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: SP.sumi, fontVariantNumeric: "tabular-nums" }}>
        {t(valJp, valEn)}
      </div>
      <div style={{ fontSize: 10, color: SP.usuzumi, marginTop: 4 }}>{t(labelJp, labelEn)}</div>
    </div>
  );
}
