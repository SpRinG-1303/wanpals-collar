import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SensorPage, Card, Bi, SP } from "@/components/SensorPage";
import { useT, useLanguage } from "@/context/LanguageContext";

export const Route = createFileRoute("/bark-sense")({ component: BarkSensePage });

type EmotionKey =
  | "happy" | "calm" | "excited" | "playful" | "tired"
  | "sad" | "anxious" | "scared" | "angry";

const EMOTIONS: Record<EmotionKey, { jp: string; en: string; color: string; angle: number }> = {
  happy:   { jp: "嬉しい",   en: "Happy",   color: "#F2D27A", angle: 0 },
  calm:    { jp: "穏やか",   en: "Calm",    color: "#9CC4A8", angle: 40 },
  excited: { jp: "興奮",     en: "Excited", color: "#F19A9A", angle: 80 },
  playful: { jp: "遊びたい", en: "Playful", color: "#F2B284", angle: 120 },
  tired:   { jp: "疲れた",   en: "Tired",   color: "#B5ADA4", angle: 160 },
  sad:     { jp: "悲しい",   en: "Sad",     color: "#7A95B8", angle: 200 },
  anxious: { jp: "不安",     en: "Anxious", color: "#B9A8D4", angle: 240 },
  scared:  { jp: "怖い",     en: "Scared",  color: "#C2A1A8", angle: 280 },
  angry:   { jp: "怒り",     en: "Angry",   color: "#C97A7A", angle: 320 },
};

const ORDER: EmotionKey[] = ["happy","calm","excited","playful","tired","sad","anxious","scared","angry"];
const WEEK: EmotionKey[] = ["calm","happy","playful","calm","excited","tired","calm"];

function BarkWave({ color }: { color: string }) {
  const bars = [10, 18, 26, 20, 14, 22, 28, 16, 10];
  return (
    <div className="flex items-end justify-center" style={{ gap: 3, height: 32 }}>
      {bars.map((h, i) => (
        <span
          key={i}
          style={{
            width: 3,
            height: h,
            borderRadius: 2,
            background: color,
            animation: `barkPulse 1.2s ease-in-out ${i * 0.08}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes barkPulse {
          0%, 100% { transform: scaleY(0.5); opacity: 0.55; }
          50% { transform: scaleY(1.15); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function EmotionWheel({ current }: { current: EmotionKey }) {
  const { language } = useLanguage();
  const size = 300;
  const cx = size / 2;
  const cy = size / 2;
  const r = 118;
  const labelR = r + 26;
  const targetAngle = EMOTIONS[current].angle;
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAngle(targetAngle));
    return () => cancelAnimationFrame(id);
  }, [targetAngle]);

  const cur = EMOTIONS[current];

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
              opacity={current === k ? 0.95 : 0.32}
              stroke="#FFFFFF"
              strokeWidth={2}
            />
          );
        })}
        {/* Inner white disc */}
        <circle cx={cx} cy={cy} r={68} fill="#FFFFFF" stroke="#F2EDE8" strokeWidth={1} />
        {/* Elegant needle */}
        <g
          style={{
            transform: `rotate(${angle}deg)`,
            transformOrigin: `${cx}px ${cy}px`,
            transition: "transform 1.3s cubic-bezier(.4,1.6,.4,1)",
          }}
        >
          <line
            x1={cx} y1={cy + 6}
            x2={cx} y2={cy - r + 12}
            stroke={SP.sakura}
            strokeWidth={1.6}
            strokeLinecap="round"
          />
          <circle cx={cx} cy={cy - r + 12} r={3.5} fill={SP.sakura} />
        </g>
        <circle cx={cx} cy={cy} r={5} fill="#FFFFFF" stroke={SP.sakura} strokeWidth={1.5} />
      </svg>

      {/* Text labels around wheel */}
      {ORDER.map((k, i) => {
        const a = (i * 40 - 90) * (Math.PI / 180);
        const lx = cx + Math.cos(a) * labelR;
        const ly = cy + Math.sin(a) * labelR;
        const e = EMOTIONS[k];
        const active = current === k;
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: lx, top: ly,
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              lineHeight: 1.1,
              color: active ? e.color : SP.usuzumi,
              opacity: active ? 1 : 0.75,
              transition: "all 0.4s ease",
              minWidth: 44,
            }}
          >
            {language === "english" && (
              <div style={{ fontSize: 10.5, fontWeight: active ? 600 : 400, letterSpacing: "0.04em" }}>{e.en}</div>
            )}
            {language === "japanese" && (
              <div style={{ fontSize: 11, fontWeight: active ? 600 : 400 }}>{e.jp}</div>
            )}
            {language === "mixed" && (
              <>
                <div style={{ fontSize: 10.5, fontWeight: active ? 600 : 400 }}>{e.jp}</div>
                <div style={{ fontSize: 8, opacity: 0.7, marginTop: 1, letterSpacing: "0.04em" }}>{e.en}</div>
              </>
            )}
          </div>
        );
      })}

      {/* Center content overlay */}
      <div
        style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          pointerEvents: "none",
          paddingTop: 4,
        }}
      >
        <BarkWave color={cur.color} />
      </div>
    </div>
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
      accent={SP.sakura}
      headerGradient="linear-gradient(135deg,#FFE8EE 0%,#FFF2F5 60%,#FFF8F4 100%)"
    >
      {/* Meter card */}
      <Card accent={SP.sakura}>
        <Bi
          jp="現在の感情"
          en="Current Emotion"
          jpStyle={{ fontSize: 13, fontWeight: 600, color: SP.sumi, letterSpacing: "0.02em" }}
          enStyle={{ fontSize: 10, color: SP.usuzumi, marginBottom: 8, letterSpacing: "0.08em" }}
        />
        <div style={{ padding: "8px 0 4px" }}>
          <EmotionWheel current={current} />
        </div>
        <div style={{ textAlign: "center", marginTop: 18 }}>
          <div
            style={{
              fontSize: 30,
              fontWeight: 300,
              color: cur.color,
              letterSpacing: "0.04em",
              lineHeight: 1.1,
            }}
          >
            {t(cur.jp, cur.en)}
          </div>
          <div style={{ fontSize: 10.5, color: SP.usuzumi, marginTop: 8, letterSpacing: "0.2em", textTransform: "uppercase" }}>
            {t("ライブ解析", "Live Analysis")}
          </div>
        </div>
      </Card>

      {/* 7-day timeline (unchanged behaviour, emoji-free) */}
      <Card accent={SP.fuji}>
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
                  opacity: 0.9,
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  padding: 6,
                  fontSize: 9,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.95)",
                  boxShadow: "inset 0 -3px 0 rgba(0,0,0,0.06)",
                  letterSpacing: "0.03em",
                }}
              >
                {t(EMOTIONS[k].jp, EMOTIONS[k].en).slice(0, 4)}
              </div>
              <div style={{ fontSize: 10, color: SP.usuzumi, marginTop: 4, fontWeight: 600 }}>
                {t(days[i], daysEn[i])}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* AI insight */}
      <Card accent={SP.yuzu} style={{ background: "#FFFDF8" }}>
        <div className="flex items-center" style={{ gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: SP.yuzu, letterSpacing: "0.18em" }}>
            {t("AIインサイト", "AI INSIGHT")}
          </span>
        </div>
        <Bi
          jp="今日のワンちゃんは全体的に穏やかで、午後には少し遊び心も見られました。週を通して安定した感情パターンを示しており、ストレスの兆候はほとんどありません。"
          en="Your dog has been mostly calm today with playful moments in the afternoon. The weekly pattern shows stable emotions with few signs of stress."
          jpStyle={{ fontSize: 13, lineHeight: 1.7, color: "#3C3020", fontWeight: 500 }}
          enStyle={{ fontSize: 11, lineHeight: 1.5, color: SP.usuzumi, marginTop: 6 }}
        />
      </Card>
    </SensorPage>
  );
}
