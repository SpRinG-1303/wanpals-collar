import { createFileRoute } from "@tanstack/react-router";
import { Footprints, Flame, Moon, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { SensorPage, Card, TimeTabs, useTimeTab, SP, SectionLabel, AIInsightCard } from "@/components/SensorPage";
import { useT } from "@/context/LanguageContext";

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

function MotionSensePage() {
  const [tab, setTab] = useTimeTab();
  const t = useT();
  const steps = 2340;
  const goal = 5000;
  const pct = steps / goal;
  const R = 73, sw = 14, cx = 80, cy = 80;
  const C = 2 * Math.PI * R;
  const stepsAnim = useCount(steps, 1300);
  const max = Math.max(...WEEK.map((d) => d.v));

  const [drawn, setDrawn] = useState(false);
  useEffect(() => { const id = setTimeout(() => setDrawn(true), 80); return () => clearTimeout(id); }, []);

  return (
    <SensorPage
      titleJp="モーションセンス"
      titleEn="MotionSense · Activity"
      heroGradient="linear-gradient(135deg,#FFF5F7 0%,#F0FFF4 100%)"
      kanji="動"
    >
      <TimeTabs value={tab} onChange={setTab} />

      {/* Step counter hero */}
      <Card>
        <SectionLabel jp="本日の歩数" en="Today's Steps" />
        <div className="flex items-center" style={{ gap: 18 }}>
          <div style={{ position: "relative", width: 160, height: 160 }}>
            <svg width={160} height={160} viewBox="0 0 160 160">
              <defs>
                <linearGradient id="mGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#F43F72" />
                  <stop offset="100%" stopColor="#FF9EBA" />
                </linearGradient>
              </defs>
              <circle cx={cx} cy={cy} r={R} stroke="#F3F4F6" strokeWidth={sw} fill="none" />
              <circle
                cx={cx} cy={cy} r={R}
                stroke="url(#mGrad)" strokeWidth={sw} fill="none" strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={drawn ? C * (1 - pct) : C}
                transform={`rotate(-90 ${cx} ${cy})`}
                style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.2,.7,.2,1)" }}
              />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 28, color: SP.rose, opacity: 0.18, position: "absolute", top: 22 }}>🐾</span>
              <div style={{ fontSize: 32, fontWeight: 800, color: SP.sumi, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
                {stepsAnim.toLocaleString()}
              </div>
              <div style={{ fontSize: 14, color: SP.rose, fontWeight: 600, marginTop: 4 }}>{t("歩", "steps")}</div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: SP.muted, letterSpacing: "0.04em" }}>{t("目標", "Goal")}</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: SP.sumi, fontVariantNumeric: "tabular-nums" }}>
              {goal.toLocaleString()}{t("歩", "")}
            </div>
            <div style={{ height: 4, background: "#FFE4EC", borderRadius: 50, marginTop: 6, overflow: "hidden" }}>
              <div style={{ width: drawn ? `${pct * 100}%` : 0, height: "100%", background: SP.rose, borderRadius: 50, transition: "width 1.2s ease-out" }} />
            </div>
            <div style={{ fontSize: 11, color: SP.muted, marginTop: 14 }}>{t("残り", "Remaining")}</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: SP.rose, fontVariantNumeric: "tabular-nums" }}>
              {(goal - steps).toLocaleString()}{t("歩", "")}
            </div>
            <div style={{ fontSize: 11, color: SP.muted, marginTop: 8 }}>
              {t("予想達成 17:30頃", "Est. completion ~17:30")}
            </div>
          </div>
        </div>
      </Card>

      {/* Weekly bar chart — pill shapes */}
      <Card>
        <SectionLabel jp="週間アクティビティ" en="Weekly Activity" />
        <div className="flex items-end justify-between" style={{ height: 160, gap: 10, padding: "8px 4px 0" }}>
          {WEEK.map((d, i) => {
            const barH = Math.max(20, (d.v / max) * 130);
            const isToday = i === WEEK.length - 1;
            const barW = 20;
            return (
              <div key={d.en} className="flex flex-col items-center" style={{ flex: 1, height: "100%", justifyContent: "flex-end" }}>
                {isToday && <div style={{ fontSize: 11, color: SP.rose, marginBottom: 2 }}>🐾</div>}
                <div style={{ fontSize: 9, color: SP.muted, marginBottom: 4, fontVariantNumeric: "tabular-nums" }}>
                  {(d.v / 1000).toFixed(1)}k
                </div>
                <div style={{ position: "relative", width: barW, height: 130, background: "#FFF0F3", borderRadius: 50, overflow: "hidden" }}>
                  <div
                    style={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      height: drawn ? barH : 0,
                      borderRadius: 50,
                      background: isToday
                        ? "linear-gradient(180deg,#E11D5A 0%,#F43F72 100%)"
                        : "linear-gradient(180deg,#F43F72 0%,#FECDD3 100%)",
                      transition: `height 700ms cubic-bezier(.2,.7,.2,1) ${i * 60}ms`,
                    }}
                  />
                </div>
                <div style={{ fontSize: 10, color: isToday ? SP.rose : SP.muted, marginTop: 6, fontWeight: isToday ? 700 : 500 }}>
                  {t(d.jp, d.en)}
                </div>
                {isToday && <div style={{ width: 4, height: 4, borderRadius: "50%", background: SP.rose, marginTop: 3 }} />}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Stat cards */}
      <div className="grid grid-cols-3" style={{ gap: 10 }}>
        <StatCard icon={<Activity size={18} />} color={SP.rose} bg="#FFF5F7" valJp="2時間15分" valEn="2h 15m" labelJp="活動時間" labelEn="Active" />
        <StatCard icon={<Moon size={18} />} color="#6366F1" bg="#F5F3FF" valJp="13時間45分" valEn="13h 45m" labelJp="休息時間" labelEn="Rest" />
        <StatCard icon={<Flame size={18} />} color="#F97316" bg="#FFF7ED" valJp="285" valEn="285" unit="kcal" labelJp="カロリー" labelEn="Calories" />
      </div>

      {/* Activity line */}
      <Card>
        <SectionLabel jp="活動レベル・7日間" en="Activity Level · 7 Days" />
        <svg viewBox="0 0 280 130" width="100%" height={130}>
          <defs>
            <linearGradient id="actFill" x1="0" y1="0" x2="0" y2="1">
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
                <path d={fill} fill="url(#actFill)" />
                <path
                  d={d} stroke={SP.rose} strokeWidth={2.5} fill="none"
                  strokeLinecap="round" strokeLinejoin="round"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={drawn ? 0 : 1}
                  style={{ transition: "stroke-dashoffset 1.4s ease-out" }}
                />
                {pts.map((p, i) => (
                  <g key={i}>
                    <circle cx={p[0]} cy={p[1]} r={3} fill="#fff" stroke={SP.rose} strokeWidth={2} />
                    <text x={p[0]} y={120} fontSize="10" fill={SP.muted} textAnchor="middle">
                      {t(WEEK[i].jp, WEEK[i].en)}
                    </text>
                  </g>
                ))}
              </>
            );
          })()}
        </svg>
      </Card>

      <AIInsightCard
        jp="先週より12%活動量が増加しています。この調子で続けましょう！"
        en="Activity up 12% from last week. Keep it up!"
      />
    </SensorPage>
  );
}

function StatCard({ icon, color, bg, valJp, valEn, unit, labelJp, labelEn }: {
  icon: React.ReactNode; color: string; bg: string; valJp: string; valEn: string; unit?: string; labelJp: string; labelEn: string;
}) {
  const t = useT();
  return (
    <div style={{
      background: bg, borderRadius: 18, padding: 14, textAlign: "center",
      boxShadow: "0 2px 12px rgba(0,0,0,0.04)", marginBottom: 14,
    }}>
      <div style={{ color, display: "flex", justifyContent: "center", marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: SP.sumi, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
        {t(valJp, valEn)}
        {unit && <span style={{ fontSize: 11, color: SP.muted, fontWeight: 400, marginLeft: 3 }}>{unit}</span>}
      </div>
      <div style={{ fontSize: 10, color: SP.muted, marginTop: 6 }}>{t(labelJp, labelEn)}</div>
    </div>
  );
}
