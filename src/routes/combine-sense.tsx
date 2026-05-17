import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Thermometer, MapPin, Wind, Sun, Brain, Sparkles, Clock } from "lucide-react";
import { SensorPage, Card, TimeTabs, useTimeTab, SP } from "@/components/SensorPage";

export const Route = createFileRoute("/combine-sense")({ component: CombineSensePage });

const MINI = [
  { to: "/motion-sense", Icon: Activity, jp: "運動", en: "Motion", val: "2,340歩", color: SP.sora, bg: "#E8F2FF" },
  { to: "/temp-sense", Icon: Thermometer, jp: "体温", en: "Temp", val: "38.5°C", color: SP.momiji, bg: "#FFE8DC" },
  { to: "/location-sense", Icon: MapPin, jp: "位置", en: "Location", val: "渋谷", color: SP.matcha, bg: "#E8F5EE" },
  { to: "/pressure-sense", Icon: Wind, jp: "圧力", en: "Pressure", val: "正常", color: SP.yuzu, bg: "#FFF8DC" },
  { to: "/light-sense", Icon: Sun, jp: "光", en: "Light", val: "ピンク", color: SP.sakura, bg: "#FFE4EC" },
  { to: "/report", Icon: Brain, jp: "吠え", en: "Bark", val: "穏やか", color: SP.fuji, bg: "#EDE0FF" },
];

const TIMELINE = [
  { time: "10:42", jp: "渋谷駅に到着", en: "Arrived at Shibuya Station", color: SP.matcha },
  { time: "09:55", jp: "活動量が増加", en: "Activity level rose", color: SP.sora },
  { time: "09:30", jp: "代々木公園で散歩", en: "Walk in Yoyogi Park", color: SP.matcha },
  { time: "08:15", jp: "朝食 · 嚥下正常", en: "Breakfast · swallow normal", color: SP.yuzu },
  { time: "07:00", jp: "起床 · 体温正常", en: "Awake · temp normal", color: SP.momiji },
];

function CombineSensePage() {
  const [tab, setTab] = useTimeTab();
  const score = 87;
  const R = 56;
  const C = 2 * Math.PI * R;

  return (
    <SensorPage
      titleJp="コンバインセンス"
      titleEn="CombineSense AI · All Sensors"
      headerGradient="linear-gradient(135deg, #DDD0FF 0%, #C8B8FF 100%)"
      accent={SP.fuji}
    >
      <TimeTabs value={tab} onChange={setTab} />

      <Card accent={SP.fuji}>
        <div className="flex items-center" style={{ gap: 18 }}>
          <div style={{ position: "relative", width: 140, height: 140 }}>
            <svg width={140} height={140}>
              <circle cx={70} cy={70} r={R} stroke="#F0E8FF" strokeWidth={10} fill="none" />
              <circle
                cx={70} cy={70} r={R} stroke="url(#cGrad)" strokeWidth={10} fill="none"
                strokeLinecap="round" strokeDasharray={`${(C * score) / 100} ${C}`}
                transform="rotate(-90 70 70)"
              />
              <defs>
                <linearGradient id="cGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#9B72CF" />
                  <stop offset="100%" stopColor="#E8829A" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 30, fontWeight: 800, color: SP.sumi, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{score}</div>
              <div style={{ fontSize: 11, color: SP.usuzumi, marginTop: 2 }}>/ 100</div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: SP.sumi }}>総合健康スコア</div>
            <div style={{ fontSize: 11, color: SP.usuzumi }}>Overall Health Score</div>
            <div className="flex items-center" style={{ gap: 6, marginTop: 10 }}>
              <span className="relative" style={{ width: 8, height: 8 }}>
                <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: SP.matcha }} />
                <span className="animate-ping" style={{ position: "absolute", inset: 0, borderRadius: "50%", background: SP.matcha, opacity: 0.6 }} />
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, color: SP.matcha, letterSpacing: "0.08em" }}>LIVE</span>
              <span style={{ fontSize: 11, color: SP.usuzumi }}>· 全6センサー</span>
            </div>
          </div>
        </div>
      </Card>

      <div style={{ fontSize: 13, fontWeight: 700, color: SP.sumi, margin: "8px 4px 8px" }}>
        全センサー <span style={{ color: SP.usuzumi, fontWeight: 500, fontSize: 11 }}>· All Sensors</span>
      </div>

      <div className="grid grid-cols-2" style={{ gap: 8, marginBottom: 12 }}>
        {MINI.map((m) => (
          <Link
            key={m.en}
            to={m.to}
            style={{
              background: "#fff", borderRadius: 14, padding: 12,
              borderLeft: `3px solid ${m.color}`,
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              display: "block",
            }}
          >
            <div className="flex items-center" style={{ gap: 8, marginBottom: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10, background: m.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <m.Icon size={16} style={{ color: m.color }} />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: SP.sumi, lineHeight: 1.1 }}>{m.jp}</div>
                <div style={{ fontSize: 9, color: SP.usuzumi }}>{m.en}</div>
              </div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: m.color, fontVariantNumeric: "tabular-nums" }}>{m.val}</div>
          </Link>
        ))}
      </div>

      <Card accent={SP.sora}>
        <div className="flex items-center" style={{ gap: 8, marginBottom: 12 }}>
          <Clock size={16} style={{ color: SP.sora }} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: SP.sumi }}>今日のタイムライン</div>
            <div style={{ fontSize: 11, color: SP.usuzumi }}>Today's Timeline</div>
          </div>
        </div>
        <div style={{ position: "relative", paddingLeft: 16 }}>
          <div style={{ position: "absolute", left: 4, top: 6, bottom: 6, width: 2, background: SP.divider }} />
          {TIMELINE.map((e, i) => (
            <div key={i} style={{ position: "relative", paddingBottom: i < TIMELINE.length - 1 ? 14 : 0 }}>
              <div style={{
                position: "absolute", left: -16, top: 4,
                width: 10, height: 10, borderRadius: "50%",
                background: e.color, border: "2px solid #fff",
              }} />
              <div className="flex items-baseline justify-between" style={{ gap: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: SP.sumi, flex: 1 }}>{e.jp}</div>
                <div style={{ fontSize: 10, color: SP.usuzumi, fontVariantNumeric: "tabular-nums" }}>{e.time}</div>
              </div>
              <div style={{ fontSize: 10, color: SP.usuzumi }}>{e.en}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card accent={SP.sakura} style={{ background: "linear-gradient(135deg,#FFF0F3,#F5F0FF)" }}>
        <div className="flex items-start" style={{ gap: 10 }}>
          <Sparkles size={20} style={{ color: SP.sakura, flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: SP.sumi }}>AIサマリー</div>
            <div style={{ fontSize: 11, color: SP.usuzumi, marginBottom: 6 }}>AI Summary</div>
            <div style={{ fontSize: 12, color: SP.sumi, lineHeight: 1.55 }}>
              全センサー良好。活動量は前週比+12%、体温・嚥下圧ともに正常範囲内。継続して健康的なルーチンを維持してください。<br/>
              <span style={{ color: SP.usuzumi }}>
                All sensors healthy. Activity +12% vs last week, temperature and swallow pressure both within normal range. Keep up the healthy routine.
              </span>
            </div>
          </div>
        </div>
      </Card>
    </SensorPage>
  );
}
