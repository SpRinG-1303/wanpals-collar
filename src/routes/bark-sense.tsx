import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SensorPage, Card, SP, SectionLabel, AIInsightCard } from "@/components/SensorPage";
import { useT, useLanguage } from "@/context/LanguageContext";

export const Route = createFileRoute("/bark-sense")({ component: BarkSensePage });

type EmotionKey =
  | "happy" | "calm" | "excited" | "anxious" | "sad"
  | "angry" | "playful" | "tired" | "scared";

const EMOTIONS: Record<EmotionKey, { jp: string; en: string; color: string; deep: string; angle: number }> = {
  happy:   { jp: "幸せ",     en: "Happy",   color: "#FEF3C7", deep: "#CA8A04", angle: 0 },
  calm:    { jp: "穏やか",   en: "Calm",    color: "#D1FAE5", deep: "#16A34A", angle: 40 },
  excited: { jp: "興奮",     en: "Excited", color: "#FCE7F3", deep: "#DB2777", angle: 80 },
  anxious: { jp: "不安",     en: "Anxious", color: "#EDE9FE", deep: "#7C3AED", angle: 120 },
  sad:     { jp: "悲しい",   en: "Sad",     color: "#DBEAFE", deep: "#2563EB", angle: 160 },
  angry:   { jp: "怒り",     en: "Angry",   color: "#FEE2E2", deep: "#DC2626", angle: 200 },
  playful: { jp: "遊びたい", en: "Playful", color: "#FFEDD5", deep: "#EA580C", angle: 240 },
  tired:   { jp: "疲れた",   en: "Tired",   color: "#F3F4F6", deep: "#6B7280", angle: 280 },
  scared:  { jp: "怖い",     en: "Scared",  color: "#F5F3FF", deep: "#8B5CF6", angle: 320 },
};

const ORDER: EmotionKey[] = ["happy","calm","excited","anxious","sad","angry","playful","tired","scared"];
const WEEK: EmotionKey[] = ["calm","happy","playful","calm","excited","tired","calm"];

function BreathWave({ color }: { color: string }) {
  return (
    <div className="flex items-center justify-center" style={{ gap: 3, height: 14 }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 3, height: 14, borderRadius: 2, background: color,
            transformOrigin: "center",
            animation: `breathBar 1.6s ease-in-out ${i * 0.18}s infinite`,
          }}
        />
      ))}
      <style>{`@keyframes breathBar{0%,100%{transform:scaleY(.35);opacity:.55}50%{transform:scaleY(1);opacity:1}}`}</style>
    </div>
  );
}

function PetalRing({ current }: { current: EmotionKey }) {
  const { language } = useLanguage();
  const size = 300;
  const cx = size / 2, cy = size / 2;
  const r = 110;
  const labelR = r + 28;
  const [angle, setAngle] = useState(0);
  const targetAngle = EMOTIONS[current].angle;

  useEffect(() => {
    const id = requestAnimationFrame(() => setAngle(targetAngle));
    return () => cancelAnimationFrame(id);
  }, [targetAngle]);

  function petal(cxp: number, cyp: number, rot: number, active: boolean) {
    const w = active ? 44 : 38;
    const h = active ? 86 : 76;
    return `M ${cxp} ${cyp - h} C ${cxp + w} ${cyp - h / 1.6} ${cxp + w} ${cyp - h / 4} ${cxp} ${cyp} C ${cxp - w} ${cyp - h / 4} ${cxp - w} ${cyp - h / 1.6} ${cxp} ${cyp - h} Z`;
  }

  return (
    <div className="relative" style={{ width: size, height: size, margin: "0 auto" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {ORDER.map((k, i) => {
          const a = i * 40;
          const active = current === k;
          const e = EMOTIONS[k];
          return (
            <g key={k} transform={`rotate(${a} ${cx} ${cy})`}>
              <path
                d={petal(cx, cy, a, active)}
                fill={e.color}
                opacity={active ? 1 : 0.55}
                stroke="#FFFFFF"
                strokeWidth={2}
                style={active ? { filter: `drop-shadow(0 0 8px ${e.color})`, animation: "petalPulse 2.4s ease-in-out infinite" } : undefined}
              />
            </g>
          );
        })}
        {/* Needle */}
        <g
          style={{
            transform: `rotate(${angle}deg)`,
            transformOrigin: `${cx}px ${cy}px`,
            transition: "transform 1.3s cubic-bezier(.4,1.6,.4,1)",
          }}
        >
          <line x1={cx} y1={cy + 4} x2={cx} y2={cy - r + 18} stroke={SP.rose} strokeWidth={1.4} strokeLinecap="round" />
          <circle cx={cx} cy={cy - r + 18} r={3} fill={SP.rose} />
        </g>
        {/* Inner white disc */}
        <circle cx={cx} cy={cy} r={48} fill="#FFFFFF" filter="url(#discShadow)" />
        <defs>
          <filter id="discShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dy="2" />
            <feComponentTransfer><feFuncA type="linear" slope="0.18" /></feComponentTransfer>
            <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <style>{`@keyframes petalPulse{0%,100%{transform:scale(1);transform-origin:${cx}px ${cy}px}50%{transform:scale(1.04);transform-origin:${cx}px ${cy}px}}`}</style>
      </svg>

      {/* Center wave + label */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
        <BreathWave color={EMOTIONS[current].deep} />
        <div style={{ fontSize: 12, color: EMOTIONS[current].deep, fontWeight: 600, marginTop: 6 }}>
          {language === "english" ? EMOTIONS[current].en : EMOTIONS[current].jp}
        </div>
      </div>

      {/* Petal labels */}
      {ORDER.map((k, i) => {
        const a = (i * 40 - 90) * (Math.PI / 180);
        const lx = cx + Math.cos(a) * labelR;
        const ly = cy + Math.sin(a) * labelR;
        const e = EMOTIONS[k];
        const active = current === k;
        return (
          <div key={k} style={{
            position: "absolute", left: lx, top: ly,
            transform: "translate(-50%,-50%)", textAlign: "center", lineHeight: 1.15,
            minWidth: 50, transition: "all .4s ease",
            color: active ? e.deep : SP.usuzumi,
          }}>
            {language !== "english" && <div style={{ fontSize: 11, fontWeight: active ? 700 : 500 }}>{e.jp}</div>}
            {language !== "japanese" && <div style={{ fontSize: 9, opacity: .85, marginTop: 1 }}>{e.en}</div>}
          </div>
        );
      })}
    </div>
  );
}

function BarkSensePage() {
  const t = useT();
  const current: EmotionKey = "calm";
  const cur = EMOTIONS[current];
  const days = ["月","火","水","木","金","土","日"];
  const daysEn = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  return (
    <SensorPage
      titleJp="バークセンス AI"
      titleEn="BarkSense AI · Emotion"
      heroGradient="linear-gradient(135deg,#FFF5F7 0%,#F9F0FF 100%)"
      kanji="気"
    >
      {/* Hero card — petal ring + emotion label */}
      <Card>
        <div style={{ padding: "4px 0 0" }}>
          <PetalRing current={current} />
        </div>
        <div style={{ textAlign: "center", marginTop: 14 }}>
          <div style={{ fontSize: 42, fontWeight: 200, color: cur.deep, letterSpacing: "0.03em", lineHeight: 1 }}>
            {t(cur.jp, cur.en)}
          </div>
          <div style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 6,
            background: "#F0FDF4", color: "#16A34A", padding: "5px 14px", borderRadius: 50, fontSize: 12, fontWeight: 600 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22C55E" }} />
            {t("信頼度 94%", "Confidence 94%")}
          </div>
          <div style={{ fontSize: 11, color: SP.rose, marginTop: 10, letterSpacing: "0.08em" }}>
            ● {t("ライブ解析中", "Live analysis")}
          </div>
        </div>
      </Card>

      {/* Timeline */}
      <Card>
        <SectionLabel jp="感情の軌跡" en="Emotion Journey" />
        <div style={{ overflowX: "auto", margin: "0 -4px" }}>
          <div className="flex" style={{ gap: 8, padding: "4px 4px 8px", minWidth: "100%" }}>
            {WEEK.map((k, i) => {
              const e = EMOTIONS[k];
              const isToday = i === WEEK.length - 1;
              return (
                <div key={i} style={{ flex: 1, minWidth: 42, textAlign: "center" }}>
                  {isToday && <div style={{ width: 4, height: 4, borderRadius: "50%", background: SP.rose, margin: "0 auto 4px" }} />}
                  <div style={{
                    background: e.color, color: e.deep,
                    borderRadius: 14, padding: "10px 4px",
                    fontSize: 10, fontWeight: 600, lineHeight: 1.2,
                    transform: isToday ? "translateY(-2px)" : "none",
                    boxShadow: isToday ? "0 4px 12px rgba(244,63,114,0.18)" : "none",
                  }}>
                    {t(e.jp, e.en)}
                  </div>
                  <div style={{ fontSize: 10, color: SP.muted, marginTop: 6 }}>{t(days[i], daysEn[i])}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ height: 1, background: SP.divider, margin: "14px 0 12px" }} />
        <div style={{ fontSize: 11, color: SP.muted, marginBottom: 10, letterSpacing: "0.06em" }}>
          {t("今週のまとめ", "This Week's Summary")}
        </div>
        <SummaryBar jp="穏やか" en="Calm" pct={68} color="#16A34A" track="#D1FAE5" />
        <SummaryBar jp="幸せ" en="Happy" pct={22} color="#CA8A04" track="#FEF3C7" />
      </Card>

      {/* Donut breakdown */}
      <Card>
        <SectionLabel jp="本日の感情分布" en="Today's Emotion Breakdown" />
        <EmotionDonut />
        <div className="grid grid-cols-3" style={{ gap: 8, marginTop: 14 }}>
          {([["calm",55],["happy",22],["playful",13],["tired",6],["excited",3],["anxious",1]] as [EmotionKey, number][]).map(([k, p]) => {
            const e = EMOTIONS[k];
            return (
              <div key={k} className="flex items-center" style={{ gap: 5, fontSize: 11 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: e.color, border: `1.5px solid ${e.deep}`, flexShrink: 0 }} />
                <span style={{ color: SP.ink, fontWeight: 600 }}>{p}%</span>
                <span style={{ color: SP.muted, fontSize: 10 }}>{t(e.jp, e.en)}</span>
              </div>
            );
          })}
        </div>
      </Card>

      <AIInsightCard
        jp="フラフィは今日穏やかで安定しています。先週より改善 ↑"
        en="Fluffy is calm and emotionally stable today. Improved from last week ↑"
      />
    </SensorPage>
  );
}

function SummaryBar({ jp, en, pct, color, track }: { jp: string; en: string; pct: number; color: string; track: string }) {
  const t = useT();
  return (
    <div style={{ marginBottom: 10 }}>
      <div className="flex justify-between" style={{ fontSize: 12, marginBottom: 4 }}>
        <span style={{ color: SP.ink, fontWeight: 600 }}>{t(jp, en)}</span>
        <span style={{ color: SP.muted, fontVariantNumeric: "tabular-nums" }}>{pct}%</span>
      </div>
      <div style={{ height: 6, borderRadius: 50, background: track, overflow: "hidden" }}>
        <div style={{
          width: `${pct}%`, height: "100%", borderRadius: 50, background: color,
          animation: "spBarGrow 900ms ease-out", transformOrigin: "left",
        }} />
      </div>
    </div>
  );
}

function EmotionDonut() {
  const slices: [EmotionKey, number][] = [["calm",55],["happy",22],["playful",13],["tired",6],["excited",3],["anxious",1]];
  const total = slices.reduce((s, [, v]) => s + v, 0);
  const R = 56, sw = 18, cx = 80, cy = 80;
  const C = 2 * Math.PI * R;
  let off = 0;
  return (
    <svg width={160} height={160} viewBox="0 0 160 160" style={{ display: "block", margin: "0 auto" }}>
      {slices.map(([k, v]) => {
        const e = EMOTIONS[k];
        const len = (v / total) * C;
        const seg = (
          <circle
            key={k}
            cx={cx} cy={cy} r={R}
            fill="none"
            stroke={e.color}
            strokeWidth={sw}
            strokeDasharray={`${len} ${C - len}`}
            strokeDashoffset={-off}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        );
        off += len;
        return seg;
      })}
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={20} fontWeight={700} fill={SP.rose}>🐾</text>
    </svg>
  );
}
