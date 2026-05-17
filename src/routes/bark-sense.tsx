import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SensorPage, Card, Bi, SP } from "@/components/SensorPage";
import { useT } from "@/context/LanguageContext";

export const Route = createFileRoute("/bark-sense")({ component: BarkSensePage });

type EmotionKey =
  | "happy" | "calm" | "excited" | "anxious" | "sad"
  | "angry" | "playful" | "tired" | "scared";

const EMOTIONS: Record<EmotionKey, { jp: string; en: string; emoji: string; color: string; angle: number }> = {
  happy:   { jp: "嬉しい", en: "Happy",   emoji: "😊", color: "#F2C94C", angle: 0 },
  calm:    { jp: "穏やか", en: "Calm",    emoji: "😌", color: "#6BAF92", angle: 40 },
  excited: { jp: "興奮",   en: "Excited", emoji: "🤩", color: "#E8829A", angle: 80 },
  playful: { jp: "遊びたい", en: "Playful", emoji: "🎾", color: "#5B9BD5", angle: 120 },
  tired:   { jp: "疲れた", en: "Tired",   emoji: "😴", color: "#9AA3B8", angle: 160 },
  sad:     { jp: "悲しい", en: "Sad",     emoji: "😢", color: "#7B8FC8", angle: 200 },
  anxious: { jp: "不安",   en: "Anxious", emoji: "😰", color: "#C9A86A", angle: 240 },
  scared:  { jp: "怖い",   en: "Scared",  emoji: "😨", color: "#9B72CF", angle: 280 },
  angry:   { jp: "怒り",   en: "Angry",   emoji: "😠", color: "#D4714E", angle: 320 },
};

const ORDER: EmotionKey[] = ["happy","calm","excited","playful","tired","sad","anxious","scared","angry"];

const WEEK: EmotionKey[] = ["calm","happy","playful","calm","excited","tired","calm"];

const TODAY_BREAKDOWN: { key: EmotionKey; pct: number }[] = [
  { key: "calm",    pct: 38 },
  { key: "happy",   pct: 22 },
  { key: "playful", pct: 14 },
  { key: "tired",   pct: 12 },
  { key: "excited", pct: 8 },
  { key: "anxious", pct: 6 },
];

function EmotionMeter({ current }: { current: EmotionKey }) {
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const r = 110;
  const targetAngle = EMOTIONS[current].angle;
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAngle(targetAngle));
    return () => cancelAnimationFrame(id);
  }, [targetAngle]);

  return (
    <div className="relative" style={{ width: size, height: size, margin: "0 auto" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {ORDER.map((k, i) => {
          const a0 = (i * 40 - 20) * (Math.PI / 180);
          const a1 = (i * 40 + 20) * (Math.PI / 180);
          const x0 = cx + Math.cos(a0 - Math.PI / 2) * r;
          const y0 = cy + Math.sin(a0 - Math.PI / 2) * r;
          const x1 = cx + Math.cos(a1 - Math.PI / 2) * r;
          const y1 = cy + Math.sin(a1 - Math.PI / 2) * r;
          return (
            <path
              key={k}
              d={`M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} Z`}
              fill={EMOTIONS[k].color}
              opacity={current === k ? 0.95 : 0.35}
              stroke="#FFFFFF"
              strokeWidth={2}
            />
          );
        })}
        <circle cx={cx} cy={cy} r={56} fill="#FFFFFF" stroke="#F5F0EC" strokeWidth={2} />
        <g
          style={{
            transform: `rotate(${angle}deg)`,
            transformOrigin: `${cx}px ${cy}px`,
            transition: "transform 1.2s cubic-bezier(.4,1.6,.4,1)",
          }}
        >
          <line x1={cx} y1={cy} x2={cx} y2={cy - r + 16} stroke={SP.sumi} strokeWidth={3} strokeLinecap="round" />
          <circle cx={cx} cy={cy - r + 16} r={6} fill={EMOTIONS[current].color} stroke={SP.sumi} strokeWidth={2} />
        </g>
        <circle cx={cx} cy={cy} r={8} fill={SP.sumi} />
      </svg>
      {ORDER.map((k, i) => {
        const a = (i * 40 - 90) * (Math.PI / 180);
        const lx = cx + Math.cos(a) * (r + 22);
        const ly = cy + Math.sin(a) * (r + 22);
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: lx, top: ly,
              transform: "translate(-50%, -50%)",
              fontSize: 18,
              opacity: current === k ? 1 : 0.55,
            }}
          >{EMOTIONS[k].emoji}</div>
        );
      })}
    </div>
  );
}

function Donut({ data }: { data: { key: EmotionKey; pct: number }[] }) {
  const size = 180;
  const cx = size / 2, cy = size / 2, r = 70, sw = 26;
  let acc = 0;
  const total = data.reduce((s, d) => s + d.pct, 0);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F5F0EC" strokeWidth={sw} />
      {data.map((d) => {
        const len = (d.pct / total) * (2 * Math.PI * r);
        const dash = `${len} ${2 * Math.PI * r}`;
        const off = -acc;
        acc += len;
        return (
          <circle
            key={d.key}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={EMOTIONS[d.key].color}
            strokeWidth={sw}
            strokeDasharray={dash}
            strokeDashoffset={off}
            transform={`rotate(-90 ${cx} ${cy})`}
            strokeLinecap="butt"
          />
        );
      })}
      <text x={cx} y={cy - 2} textAnchor="middle" fontSize={22} fontWeight={800} fill={SP.sumi}>{data[0].pct}%</text>
      <text x={cx} y={cy + 16} textAnchor="middle" fontSize={10} fill={SP.usuzumi}>{EMOTIONS[data[0].key].en}</text>
    </svg>
  );
}

function BarkSensePage() {
  const t = useT();
  const current: EmotionKey = "calm";
  const cur = EMOTIONS[current];
  const days = ["月","火","水","木","金","土","日"];
  const daysEn = ["M","T","W","T","F","S","S"];

  return (
    <SensorPage
      titleJp="感情トラッカー"
      titleEn="BarkSense AI — Emotion Tracker"
      accent={SP.fuji}
      headerGradient="linear-gradient(135deg,#F0E8FF 0%,#FFE4EC 100%)"
    >
      {/* Meter */}
      <Card accent={SP.fuji}>
        <Bi
          jp="現在の感情"
          en="Current Emotion"
          jpStyle={{ fontSize: 13, fontWeight: 700, color: SP.sumi }}
          enStyle={{ fontSize: 10, color: SP.usuzumi, marginBottom: 8 }}
        />
        <EmotionMeter current={current} />
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <div style={{ fontSize: 40 }}>{cur.emoji}</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: cur.color, marginTop: 4 }}>
            {t(cur.jp, cur.en)}
          </div>
          <div style={{ fontSize: 11, color: SP.usuzumi, marginTop: 4, letterSpacing: "0.1em" }}>
            {t("リアルタイム解析中", "Live Analysis")}
          </div>
        </div>
      </Card>

      {/* 7-day timeline */}
      <Card accent={SP.sakura}>
        <Bi
          jp="過去7日間の感情"
          en="Last 7 Days"
          jpStyle={{ fontSize: 14, fontWeight: 700, color: SP.sumi }}
          enStyle={{ fontSize: 10, color: SP.usuzumi, marginBottom: 10 }}
        />
        <div className="flex" style={{ gap: 4, marginTop: 10 }}>
          {WEEK.map((k, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center" }}>
              <div
                style={{
                  height: 56,
                  borderRadius: 8,
                  background: EMOTIONS[k].color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  boxShadow: "inset 0 -3px 0 rgba(0,0,0,0.08)",
                }}
              >{EMOTIONS[k].emoji}</div>
              <div style={{ fontSize: 10, color: SP.usuzumi, marginTop: 4, fontWeight: 600 }}>
                {t(days[i], daysEn[i])}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Today breakdown */}
      <Card accent={SP.matcha}>
        <Bi
          jp="今日の内訳"
          en="Today's Breakdown"
          jpStyle={{ fontSize: 14, fontWeight: 700, color: SP.sumi }}
          enStyle={{ fontSize: 10, color: SP.usuzumi, marginBottom: 10 }}
        />
        <div className="flex items-center" style={{ gap: 16, marginTop: 10 }}>
          <Donut data={TODAY_BREAKDOWN} />
          <div className="flex-1" style={{ display: "grid", gap: 6 }}>
            {TODAY_BREAKDOWN.map((d) => (
              <div key={d.key} className="flex items-center" style={{ gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: EMOTIONS[d.key].color }} />
                <span style={{ fontSize: 12, color: SP.sumi, fontWeight: 600, flex: 1 }}>
                  {t(EMOTIONS[d.key].jp, EMOTIONS[d.key].en)}
                </span>
                <span style={{ fontSize: 12, color: SP.usuzumi, fontVariantNumeric: "tabular-nums", fontWeight: 700 }}>{d.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* AI insight */}
      <Card accent={SP.yuzu} style={{ background: "#FFFDF5" }}>
        <div className="flex items-center" style={{ gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: 14 }}>✨</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: SP.yuzu, letterSpacing: "0.1em" }}>
            {t("AIインサイト", "AI INSIGHT")}
          </span>
        </div>
        <Bi
          jp="今日のワンちゃんは全体的に穏やかで、午後には少し遊び心も見られました。週を通して安定した感情パターンを示しており、ストレスの兆候はほとんどありません。夕方の散歩がリラックスに効果的です。"
          en="Your dog has been mostly calm today with playful moments in the afternoon. The weekly pattern shows stable emotions with few signs of stress. Evening walks appear to support relaxation."
          jpStyle={{ fontSize: 13, lineHeight: 1.6, color: "#3C3020", fontWeight: 500 }}
          enStyle={{ fontSize: 11, lineHeight: 1.5, color: SP.usuzumi, marginTop: 6 }}
        />
      </Card>
    </SensorPage>
  );
}
