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
    <SensorPage titleJp="モーションセンス" titleEn="MotionSense">
      <TimeTabs value={tab} onChange={setTab} />

      <Card>
        <SectionLabel jp="本日の歩数" en="Today's Steps" />
        <div className="flex items-center" style={{ gap: 18 }}>
          <div style={{ position: "relative", width: 120, height: 120 }}>
            <svg width={120} height={120}>
              <circle cx={60} cy={60} r={48} stroke={SP.divider} strokeWidth={10} fill="none" />
              <circle
                cx={60} cy={60} r={48} stroke="url(#mGrad)" strokeWidth={10} fill="none"
                strokeLinecap="round" strokeDasharray={`${(2 * Math.PI * 48 * pct) / 100} ${2 * Math.PI * 48}`}
                transform="rotate(-90 60 60)"
              />
              <defs>
                <linearGradient id="mGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={SP.rose} />
                  <stop offset="100%" stopColor={SP.roseSoft} />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: SP.sumi, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{steps.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: SP.muted, marginTop: 4 }}>{t("歩", "steps")}</div>
              <div style={{ fontSize: 11, color: SP.rose, fontWeight: 600, marginTop: 2 }}>{pct}%</div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: SP.muted }}>{t("目標", "Goal")}</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: SP.sumi, fontVariantNumeric: "tabular-nums", marginTop: 2 }}>
              {goal.toLocaleString()}{t("歩", "")}
            </div>
            <div style={{ fontSize: 11, color: SP.muted, marginTop: 12 }}>{t("残り", "Remaining")}</div>
            <div style={{ fontSize: 16, fontWeight: 500, color: SP.rose, fontVariantNumeric: "tabular-nums", marginTop: 2 }}>
              {(goal - steps).toLocaleString()}{t("歩", "")}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <SectionLabel jp="週間アクティビティ" en="Weekly Activity" />
        <div
          className="flex items-end justify-between"
          style={{
            height: 140, gap: 8,
            background: SP.roseTint, borderRadius: 14, padding: "12px 10px",
          }}
        >
          {WEEK.map((d, i) => {
            const barH = Math.max(8, (d.v / max) * 96);
            const isToday = i === WEEK.length - 1;
            return (
              <div key={d.en} className="flex flex-col items-center justify-end" style={{ flex: 1, height: "100%" }}>
                {isToday && (
                  <div style={{ fontSize: 9, color: SP.rose, fontWeight: 700, marginBottom: 2 }}>
                    {t("今日", "Today")}
                  </div>
                )}
                <div style={{ fontSize: 9, color: SP.muted, marginBottom: 4, fontVariantNumeric: "tabular-nums" }}>
                  {(d.v / 1000).toFixed(1)}k
                </div>
                <div style={{
                  width: "100%", height: barH, borderRadius: "6px 6px 0 0",
                  background: isToday ? "#E11D5A" : SP.rose,
                  opacity: isToday ? 1 : 0.85,
                }} />
                <div style={{ fontSize: 10, color: isToday ? SP.rose : SP.muted, marginTop: 6, fontWeight: isToday ? 700 : 500 }}>
                  {t(d.jp, d.en)}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-3" style={{ gap: 10, marginBottom: 14 }}>
        <StatCard icon={<Activity size={18} />} iconColor={SP.rose} valJp="2時間" valEn="2h" labelJp="活動" labelEn="Active" />
        <StatCard icon={<Moon size={18} />} iconColor="#8B5CF6" valJp="14時間" valEn="14h" labelJp="休息" labelEn="Rest" />
        <StatCard icon={<Flame size={18} />} iconColor="#F97316" valJp="285" valEn="285" unit="kcal" labelJp="カロリー" labelEn="Calories" />
      </div>

      <Card>
        <SectionLabel jp="活動レベル・過去7日間" en="Activity Level · Past 7 Days" />
        <svg viewBox="0 0 280 120" width="100%" height={120} style={{ marginTop: language === "mixed" ? 0 : 4 }}>
          <defs>
            <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={SP.rose} stopOpacity="0.18" />
              <stop offset="100%" stopColor={SP.rose} stopOpacity="0" />
            </linearGradient>
          </defs>
          {[20, 55, 90].map((y) => (
            <line key={y} x1={10} x2={270} y1={y} y2={y} stroke={SP.divider} strokeWidth={1} />
          ))}
          {(() => {
            const pts = LINE.map((v, i) => [20 + i * 40, 95 - (v / 100) * 75] as [number, number]);
            const d = pts.reduce((acc, p, i) => {
              if (i === 0) return `M${p[0]},${p[1]}`;
              const prev = pts[i - 1];
              const cx1 = prev[0] + (p[0] - prev[0]) / 2;
              return `${acc} C${cx1},${prev[1]} ${cx1},${p[1]} ${p[0]},${p[1]}`;
            }, "");
            const fill = `${d} L${pts[pts.length - 1][0]},100 L${pts[0][0]},100 Z`;
            return (
              <>
                <path d={fill} fill="url(#lineFill)" />
                <path d={d} stroke={SP.rose} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                {pts.map((p, i) => (
                  <circle key={i} cx={p[0]} cy={p[1]} r={3} fill="#FFFFFF" stroke={SP.rose} strokeWidth={2} />
                ))}
              </>
            );
          })()}
        </svg>
      </Card>

      <AIInsightCard
        jp="今週は前週比12%増加。順調なペースです。"
        en="Activity up 12% from last week. Great pace!"
      />
    </SensorPage>
  );
}

function StatCard({ icon, iconColor, valJp, valEn, unit, labelJp, labelEn }: {
  icon: React.ReactNode; iconColor: string; valJp: string; valEn: string; unit?: string; labelJp: string; labelEn: string;
}) {
  const t = useT();
  return (
    <div style={{
      background: SP.card, borderRadius: 16, padding: 14,
      boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
    }}>
      <div style={{ color: iconColor, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: SP.sumi, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
        {t(valJp, valEn)}
        {unit && <span style={{ fontSize: 11, color: SP.muted, fontWeight: 400, marginLeft: 3 }}>{unit}</span>}
      </div>
      <div style={{ fontSize: 11, color: SP.muted, marginTop: 6 }}>{t(labelJp, labelEn)}</div>
    </div>
  );
}
