import { createFileRoute } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { useLanguage } from "@/context/LanguageContext";
import { usePet, displayName } from "@/context/PetContext";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

export const Route = createFileRoute("/bark-sense")({ component: BarkSensePage });

type Lang = "english" | "japanese" | "mixed";

type EmotionKey =
  | "calm" | "happy" | "playful" | "excited"
  | "anxious" | "scared" | "sad" | "tired" | "angry";

const EMO: Record<EmotionKey, { jp: string; en: string; color: string }> = {
  calm:    { jp: "穏やか",   en: "Calm",    color: "#6DBA91" },
  happy:   { jp: "嬉しい",   en: "Happy",   color: "#F6C85F" },
  playful: { jp: "遊びたい", en: "Playful", color: "#F4A261" },
  excited: { jp: "興奮",     en: "Excited", color: "#F48FB1" },
  anxious: { jp: "不安",     en: "Anxious", color: "#B39DDB" },
  scared:  { jp: "怖い",     en: "Scared",  color: "#A8A2B8" },
  sad:     { jp: "悲しい",   en: "Sad",     color: "#90CAF9" },
  tired:   { jp: "疲れた",   en: "Tired",   color: "#BDB7B1" },
  angry:   { jp: "怒り",     en: "Angry",   color: "#E57373" },
};
const RADAR_ORDER: EmotionKey[] = [
  "calm","happy","playful","excited","anxious","scared","sad","tired","angry",
];

function L({ lang, jp, en, enClass = "" }: { lang: Lang; jp: string; en: string; enClass?: string }) {
  if (lang === "english") return <>{en}</>;
  if (lang === "japanese") return <>{jp}</>;
  return (
    <>
      <span className="block">{jp}</span>
      <span className={`block text-[0.72em] opacity-70 font-normal mt-0.5 ${enClass}`}>{en}</span>
    </>
  );
}
function pickT(lang: Lang, jp: string, en: string) {
  if (lang === "english") return en;
  if (lang === "japanese") return jp;
  return `${jp} / ${en}`;
}

function Section({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <section
      style={{
        background: "#FFFFFF",
        borderRadius: 26,
        padding: 22,
        boxShadow: "0 12px 32px rgba(58,36,59,0.10)",
        border: "1px solid rgba(244,63,114,0.06)",
        ...style,
      }}
    >
      {children}
    </section>
  );
}

function Label({ lang, jp, en }: { lang: Lang; jp: string; en: string }) {
  return (
    <div
      style={{
        color: "#F43F72",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
      }}
    >
      {pickT(lang, jp, en)}
    </div>
  );
}

function BarkSensePage() {
  const { language } = useLanguage();
  const lang = language as Lang;
  const { pet } = usePet();
  const dogName = displayName(pet, "Fluffy");

  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 30); return () => clearTimeout(t); }, []);

  // Mood breakdown
  const mood: { key: EmotionKey; pct: number }[] = [
    { key: "calm", pct: 68 },
    { key: "happy", pct: 16 },
    { key: "playful", pct: 9 },
    { key: "anxious", pct: 4 },
    { key: "tired", pct: 3 },
  ];

  // Radar layout
  const radarSize = 280;
  const center = radarSize / 2;
  const labelRadius = center - 8;
  const blobRadius = center - 58;

  // 24h heatmap
  const hours = Array.from({ length: 24 }, (_, h) => {
    const noise = Math.sin(h * 1.3) + Math.cos(h * 0.7);
    let level = 0;
    if (h >= 6 && h <= 8) level = 2;
    else if (h >= 9 && h <= 11) level = 1;
    else if (h >= 12 && h <= 14) level = 2;
    else if (h >= 15 && h <= 17) level = 3;
    else if (h >= 18 && h <= 20) level = 2;
    else if (h >= 21 && h <= 23) level = 1;
    else level = 0;
    if (noise > 1.2) level = Math.min(3, level + 1);
    return level;
  });
  const heatColors = ["#F7EEF2", "#FAD6E0", "#F48FB1", "#F43F72"];
  const nowHour = 14;

  // Donut
  const donut = [
    { key: "calm" as EmotionKey, pct: 55, trend: "+8%" },
    { key: "happy" as EmotionKey, pct: 18, trend: "+1%" },
    { key: "playful" as EmotionKey, pct: 12, trend: "+2%" },
    { key: "excited" as EmotionKey, pct: 7, trend: "0%" },
    { key: "anxious" as EmotionKey, pct: 5, trend: "-3%" },
    { key: "tired" as EmotionKey, pct: 3, trend: "-1%" },
  ];
  const donutR = 64;
  const donutC = 2 * Math.PI * donutR;
  let donutOffset = 0;

  // Week journey
  const week: { jp: string; en: string; emotion: EmotionKey; rangeJp: string; rangeEn: string; today?: boolean }[] = [
    { jp: "月", en: "Mon", emotion: "calm",    rangeJp: "9:00–18:00", rangeEn: "09:00–18:00" },
    { jp: "火", en: "Tue", emotion: "happy",   rangeJp: "10:00–14:00", rangeEn: "10:00–14:00" },
    { jp: "水", en: "Wed", emotion: "playful", rangeJp: "15:00–17:30", rangeEn: "15:00–17:30" },
    { jp: "木", en: "Thu", emotion: "calm",    rangeJp: "終日", rangeEn: "All day" },
    { jp: "金", en: "Fri", emotion: "excited", rangeJp: "夕方", rangeEn: "Evening" },
    { jp: "土", en: "Sat", emotion: "tired",   rangeJp: "夜",   rangeEn: "Night" },
    { jp: "日", en: "Sun", emotion: "calm",    rangeJp: "現在", rangeEn: "Now", today: true },
  ];

  return (
    <AppShell titleJp="バークセンスAI" titleEn="BarkSense AI" noPadding>
      <style>{`
        @keyframes bsHeroFade { from { opacity: 0; transform: translateY(8px);} to { opacity: 1; transform: translateY(0);} }
        @keyframes bsPulseRing { 0% { transform: scale(0.8); opacity: 0.7;} 80% { transform: scale(2.4); opacity: 0;} 100% { opacity: 0;} }
        @keyframes bsLiveDot { 0%,100% { opacity: 1;} 50% { opacity: 0.35;} }
        @keyframes bsWave {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1); }
        }
        @keyframes bsSignal {
          0% { transform: translateX(-30%); }
          100% { transform: translateX(30%); }
        }
        @keyframes bsBarFill { from { width: 0%; } }
        @keyframes bsFadeUp { from { opacity: 0; transform: translateY(10px);} to { opacity: 1; transform: translateY(0);} }
        @keyframes bsDraw { from { stroke-dashoffset: var(--bs-c); } to { stroke-dashoffset: var(--bs-o); } }
        .bs-bar { animation: bsBarFill 1.1s cubic-bezier(.2,.8,.2,1) both; }
        .bs-fade { animation: bsFadeUp .6s ease-out both; }
        .bs-wave-bar { transform-origin: center; animation: bsWave 1.3s ease-in-out infinite; }
      `}</style>

      <div
        style={{
          background:
            "linear-gradient(180deg, #F8F1F4 0%, #FAF3F6 40%, #FAFAF9 100%)",
          minHeight: "100%",
          paddingBottom: 110,
          position: "relative",
        }}
      >
        {/* Ambient background blobs */}
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 240, left: -60, width: 220, height: 220, borderRadius: "50%", background: "#F48FB1", filter: "blur(80px)", opacity: 0.18 }} />
          <div style={{ position: "absolute", top: 620, right: -80, width: 260, height: 260, borderRadius: "50%", background: "#B39DDB", filter: "blur(90px)", opacity: 0.16 }} />
          <div style={{ position: "absolute", top: 1100, left: -40, width: 200, height: 200, borderRadius: "50%", background: "#6DBA91", filter: "blur(80px)", opacity: 0.14 }} />
        </div>

        {/* HERO */}
        <div
          style={{
            position: "relative",
            margin: "0 0 0 0",
            padding: "20px 20px 56px",
            height: 220,
            background:
              "linear-gradient(135deg, #3A243B 0%, #6D3A58 45%, #F48FB1 100%)",
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
            overflow: "hidden",
            animation: "bsHeroFade .7s ease-out both",
          }}
        >
          {/* sound waves */}
          <svg
            aria-hidden
            viewBox="0 0 400 220"
            preserveAspectRatio="none"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 1 }}
          >
            {[40, 80, 120, 160, 200].map((y, i) => (
              <path
                key={i}
                d={`M0 ${y} Q 100 ${y - 18 + i * 4} 200 ${y} T 400 ${y}`}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={1}
                fill="none"
              />
            ))}
          </svg>
          {/* Kanji watermark */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              right: -10,
              top: 30,
              fontSize: 150,
              color: "white",
              opacity: 0.06,
              fontWeight: 900,
              fontFamily: "'Noto Serif JP', serif",
              lineHeight: 1,
              userSelect: "none",
            }}
          >
            声
          </div>

          <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ color: "white", fontWeight: 800, fontSize: 22, lineHeight: 1.15, letterSpacing: "0.01em" }}>
                {lang === "japanese" ? "バークセンスAI" : lang === "english" ? "BarkSense AI" : "バークセンスAI"}
              </div>
              {lang === "mixed" && (
                <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: 600, marginTop: 2 }}>BarkSense AI</div>
              )}
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, marginTop: 8, maxWidth: 230, lineHeight: 1.4 }}>
                {lang === "japanese"
                  ? "鳴き声から感情を解析"
                  : lang === "english"
                  ? "Emotion from bark patterns"
                  : "鳴き声から感情を解析"}
                {lang === "mixed" && (
                  <div style={{ fontSize: 11, opacity: 0.75 }}>Emotion from bark patterns</div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "rgba(255,255,255,0.18)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 999,
                  padding: "6px 12px",
                  color: "white",
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
                  border: "1px solid rgba(255,255,255,0.25)",
                }}
              >
                <span style={{ position: "relative", width: 8, height: 8 }}>
                  <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#FF5577", animation: "bsLiveDot 1.4s ease-in-out infinite" }} />
                  <span style={{ position: "absolute", inset: -2, borderRadius: "50%", background: "#FF5577", animation: "bsPulseRing 1.8s ease-out infinite" }} />
                </span>
                LIVE
              </div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>
                {pickT(lang, "リスニング中", "Listening now")}
              </div>
            </div>
          </div>
        </div>

        {/* Floating glass stat card overlapping hero */}
        <div style={{ padding: "0 16px", marginTop: -36, position: "relative", zIndex: 2 }}>
          <div
            style={{
              background: "rgba(255,255,255,0.82)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderRadius: 22,
              boxShadow: "0 12px 36px rgba(58,36,59,0.18)",
              padding: 16,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 8,
              border: "1px solid rgba(255,255,255,0.6)",
              animation: "bsFadeUp .7s ease-out .1s both",
            }}
          >
            {[
              { label: pickT(lang, "現在の感情", "Emotion"), value: pickT(lang, "穏やか", "Calm"), color: "#6DBA91" },
              { label: pickT(lang, "信頼度", "Confidence"), value: "94%", color: "#F43F72" },
              { label: pickT(lang, "本日の鳴き声", "Bark samples"), value: "128", color: "#3A243B" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center", padding: "2px 4px", borderRight: i < 2 ? "1px solid rgba(58,36,59,0.08)" : "none" }}>
                <div style={{ fontSize: 10, color: "#6B7280", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.label}</div>
                <div style={{ fontSize: 20, color: s.color, fontWeight: 800, marginTop: 4, lineHeight: 1 }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CARDS */}
        <div style={{ padding: "20px 16px 0", display: "flex", flexDirection: "column", gap: 18 }}>

          {/* CARD 1 - Emotion Radar */}
          <Section
            style={{
              background: "linear-gradient(180deg, #FFFFFF 0%, #FFF8FB 100%)",
              animation: "bsFadeUp .6s ease-out .15s both",
            }}
          >
            <Label lang={lang} jp="感情レーダー" en="Emotion Radar" />
            <div style={{ marginTop: 4, color: "#1A1A2E", fontSize: 17, fontWeight: 700 }}>
              {pickT(lang, "今のサウンドマップ", "Acoustic emotion map")}
            </div>

            <div style={{ position: "relative", width: "100%", marginTop: 14, display: "flex", justifyContent: "center" }}>
              <svg viewBox={`0 0 ${radarSize} ${radarSize}`} style={{ width: "100%", maxWidth: 320, overflow: "visible" }}>
                {/* concentric circles */}
                {[1, 2, 3].map((i) => (
                  <circle
                    key={i}
                    cx={center} cy={center}
                    r={(blobRadius * i) / 3}
                    fill="none"
                    stroke="rgba(58,36,59,0.08)"
                    strokeWidth={1}
                  />
                ))}
                {/* radial guides */}
                {RADAR_ORDER.map((_, i) => {
                  const a = (i / RADAR_ORDER.length) * Math.PI * 2 - Math.PI / 2;
                  return (
                    <line
                      key={i}
                      x1={center} y1={center}
                      x2={center + Math.cos(a) * blobRadius}
                      y2={center + Math.sin(a) * blobRadius}
                      stroke="rgba(58,36,59,0.06)"
                      strokeWidth={1}
                    />
                  );
                })}
                {/* emotion blobs */}
                {RADAR_ORDER.map((k, i) => {
                  const a = (i / RADAR_ORDER.length) * Math.PI * 2 - Math.PI / 2;
                  const r = blobRadius * 0.78;
                  const x = center + Math.cos(a) * r;
                  const y = center + Math.sin(a) * r;
                  const isCurrent = k === "calm";
                  return (
                    <circle
                      key={k}
                      cx={x} cy={y}
                      r={isCurrent ? 22 : 16}
                      fill={EMO[k].color}
                      opacity={isCurrent ? 0.45 : 0.18}
                      style={{ filter: "blur(6px)" }}
                    />
                  );
                })}
                {/* line to marker */}
                {(() => {
                  const i = RADAR_ORDER.indexOf("calm");
                  const a = (i / RADAR_ORDER.length) * Math.PI * 2 - Math.PI / 2;
                  const r = blobRadius * 0.78;
                  const x = center + Math.cos(a) * r;
                  const y = center + Math.sin(a) * r;
                  return (
                    <>
                      <path
                        d={`M ${center} ${center} Q ${(center + x) / 2 + 10} ${(center + y) / 2 - 10} ${x} ${y}`}
                        stroke="#6DBA91" strokeWidth={1.2} fill="none" strokeDasharray="3 3" opacity={0.7}
                      />
                      <circle cx={x} cy={y} r={6} fill="#6DBA91" />
                      <circle cx={x} cy={y} r={6} fill="none" stroke="#6DBA91" strokeWidth={2} style={{ transformOrigin: `${x}px ${y}px`, animation: "bsPulseRing 2s ease-out infinite" }} />
                    </>
                  );
                })()}

                {/* center glass card */}
                <circle cx={center} cy={center} r={48} fill="white" stroke="rgba(58,36,59,0.06)" />
                <circle cx={center} cy={center} r={48} fill="none" stroke="rgba(244,63,114,0.08)" strokeWidth={6} />

                {/* labels */}
                {RADAR_ORDER.map((k, i) => {
                  const a = (i / RADAR_ORDER.length) * Math.PI * 2 - Math.PI / 2;
                  const x = center + Math.cos(a) * labelRadius;
                  const y = center + Math.sin(a) * labelRadius;
                  const anchor = Math.abs(Math.cos(a)) < 0.2 ? "middle" : Math.cos(a) > 0 ? "start" : "end";
                  return (
                    <g key={k} transform={`translate(${x}, ${y})`}>
                      <text
                        textAnchor={anchor}
                        dominantBaseline="middle"
                        fontSize={lang === "mixed" ? 9 : 10}
                        fontWeight={k === "calm" ? 700 : 500}
                        fill={k === "calm" ? "#3A243B" : "#6B7280"}
                      >
                        {lang === "english" ? EMO[k].en : EMO[k].jp}
                      </text>
                      {lang === "mixed" && (
                        <text textAnchor={anchor} dominantBaseline="middle" y={10} fontSize={7} fill="#9CA3AF">
                          {EMO[k].en}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* center content overlay */}
              <div
                style={{
                  position: "absolute",
                  left: "50%", top: "50%",
                  transform: "translate(-50%, -50%)",
                  display: "flex", flexDirection: "column", alignItems: "center",
                  pointerEvents: "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 22 }}>
                  {[0.5, 0.8, 1, 0.8, 0.5].map((h, i) => (
                    <div
                      key={i}
                      className="bs-wave-bar"
                      style={{
                        width: 3, height: 22 * h,
                        borderRadius: 2,
                        background: "linear-gradient(180deg, #F43F72 0%, #6DBA91 100%)",
                        animationDelay: `${i * 0.12}s`,
                      }}
                    />
                  ))}
                </div>
                <div style={{ marginTop: 6, fontSize: 14, fontWeight: 800, color: "#1A1A2E" }}>
                  {pickT(lang, "穏やか", "Calm")}
                </div>
                <div style={{ fontSize: 10, color: "#6B7280", fontWeight: 600 }}>94%</div>
              </div>
            </div>

            {/* Live bark signal strip */}
            <div style={{ marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 600, letterSpacing: "0.06em" }}>
                  {pickT(lang, "ライブ波形", "Live bark signal")}
                </div>
                <div style={{ fontSize: 10, color: "#F43F72", fontWeight: 700 }}>● {pickT(lang, "解析中", "Analyzing")}</div>
              </div>
              <div style={{
                height: 44, borderRadius: 14,
                background: "linear-gradient(90deg, rgba(244,63,114,0.06), rgba(109,186,145,0.06))",
                position: "relative", overflow: "hidden",
                border: "1px solid rgba(58,36,59,0.05)",
              }}>
                <svg viewBox="0 0 300 44" preserveAspectRatio="none" style={{ width: "200%", height: "100%", animation: "bsSignal 6s linear infinite" }}>
                  {Array.from({ length: 60 }).map((_, i) => {
                    const h = 6 + Math.abs(Math.sin(i * 0.7) + Math.cos(i * 0.31)) * 14;
                    return (
                      <rect
                        key={i}
                        x={i * 5} y={22 - h / 2}
                        width={2} height={h} rx={1}
                        fill={`url(#bsGrad)`}
                      />
                    );
                  })}
                  <defs>
                    <linearGradient id="bsGrad" x1="0" x2="1">
                      <stop offset="0%" stopColor="#F43F72" />
                      <stop offset="100%" stopColor="#6DBA91" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </Section>

          {/* CARD 2 - Today's mood */}
          <Section style={{ animation: "bsFadeUp .6s ease-out .2s both" }}>
            <Label lang={lang} jp="今日のムード" en="Today's Mood" />
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 18, marginTop: 14, alignItems: "center" }}>
              <div style={{ textAlign: "center", minWidth: 96 }}>
                <div style={{
                  fontSize: 44, fontWeight: 800, color: "#6DBA91",
                  lineHeight: 1, letterSpacing: "-0.02em",
                }}>68%</div>
                <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 600, marginTop: 6 }}>
                  {pickT(lang, "穏やか", "Calm state")}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {mood.map((m, i) => (
                  <div key={m.key}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
                      <span style={{ color: "#1A1A2E", fontWeight: 600 }}>
                        {lang === "english" ? EMO[m.key].en : lang === "japanese" ? EMO[m.key].jp : `${EMO[m.key].jp}`}
                      </span>
                      <span style={{ color: "#6B7280" }}>{m.pct}%</span>
                    </div>
                    <div style={{ height: 6, background: "#F3EEF2", borderRadius: 99, overflow: "hidden" }}>
                      <div
                        className="bs-bar"
                        style={{
                          width: mounted ? `${m.pct}%` : 0,
                          height: "100%",
                          background: EMO[m.key].color,
                          borderRadius: 99,
                          transition: "width 1s cubic-bezier(.2,.8,.2,1)",
                          animationDelay: `${i * 0.08}s`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 14, padding: 12, background: "#FAF3F6", borderRadius: 14, fontSize: 12, color: "#3A243B", lineHeight: 1.5 }}>
              {lang === "english" && (
                <>{dogName} has been mostly calm today, with short playful bursts in the afternoon.</>
              )}
              {lang === "japanese" && (
                <>{dogName}は本日ほとんど穏やかで、午後に短い遊び心が見られました。</>
              )}
              {lang === "mixed" && (
                <>
                  <div>{dogName}は本日ほとんど穏やかで、午後に短い遊び心が見られました。</div>
                  <div style={{ fontSize: 11, opacity: 0.75, marginTop: 4 }}>
                    {dogName} has been mostly calm today, with short playful bursts in the afternoon.
                  </div>
                </>
              )}
            </div>
          </Section>

          {/* CARD 3 - Emotion Journey */}
          <Section style={{ animation: "bsFadeUp .6s ease-out .25s both" }}>
            <Label lang={lang} jp="感情の軌跡" en="Emotion Journey" />
            <div style={{ marginTop: 4, color: "#1A1A2E", fontSize: 15, fontWeight: 700 }}>
              {pickT(lang, "今週の感情マップ", "This week")}
            </div>
            <div style={{ position: "relative", marginTop: 16 }}>
              <div style={{
                position: "absolute", left: 14, top: 14, bottom: 14,
                width: 2, background: "rgba(244,63,114,0.18)", borderRadius: 2,
              }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {week.map((d, i) => (
                  <div
                    key={i}
                    className="bs-fade"
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      animationDelay: `${0.05 * i}s`,
                    }}
                  >
                    <div style={{
                      width: 30, height: 30, borderRadius: "50%",
                      background: "white", flexShrink: 0,
                      border: d.today ? "2px solid #F43F72" : "2px solid rgba(244,63,114,0.18)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700, color: d.today ? "#F43F72" : "#3A243B",
                      boxShadow: d.today ? "0 6px 16px rgba(244,63,114,0.25)" : "none",
                      position: "relative", zIndex: 1,
                    }}>
                      {lang === "english" ? d.en.slice(0, 1) : d.jp}
                    </div>
                    <div style={{
                      flex: 1,
                      background: d.today ? "linear-gradient(135deg, #FFF8FB, #FFE5ED)" : "#FAFAF9",
                      borderRadius: 14, padding: "10px 12px",
                      border: d.today ? "1px solid rgba(244,63,114,0.3)" : "1px solid rgba(58,36,59,0.05)",
                      boxShadow: d.today ? "0 8px 20px rgba(244,63,114,0.12)" : "none",
                      display: "flex", alignItems: "center", gap: 10,
                    }}>
                      <div style={{
                        width: 4, alignSelf: "stretch",
                        background: EMO[d.emotion].color, borderRadius: 4,
                      }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A2E" }}>
                            {lang === "english" ? EMO[d.emotion].en : EMO[d.emotion].jp}
                            {lang === "mixed" && (
                              <span style={{ fontSize: 10, color: "#9CA3AF", marginLeft: 6, fontWeight: 500 }}>
                                {EMO[d.emotion].en}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: 10, color: "#6B7280" }}>
                            {lang === "english" ? d.rangeEn : d.rangeJp}
                          </div>
                        </div>
                      </div>
                      {d.today && (
                        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, color: "#F43F72", fontWeight: 700, letterSpacing: "0.1em" }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#F43F72", animation: "bsLiveDot 1.4s ease-in-out infinite" }} />
                          LIVE
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* CARD 4 - Bark Activity Heatmap */}
          <Section style={{ animation: "bsFadeUp .6s ease-out .3s both" }}>
            <Label lang={lang} jp="鳴き声アクティビティ" en="Bark Activity" />
            <div style={{ marginTop: 4, color: "#1A1A2E", fontSize: 15, fontWeight: 700 }}>
              {pickT(lang, "24時間のサウンド", "24-hour sound pattern")}
            </div>

            <div style={{ position: "relative", marginTop: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(24, 1fr)", gap: 3, height: 56 }}>
                {hours.map((lv, i) => (
                  <div
                    key={i}
                    style={{
                      background: heatColors[lv],
                      borderRadius: 4,
                      animation: "bsFadeUp .4s ease-out both",
                      animationDelay: `${i * 0.012}s`,
                    }}
                    title={`${i}:00`}
                  />
                ))}
              </div>
              {/* Now marker */}
              <div style={{
                position: "absolute",
                left: `calc(${(nowHour + 0.5) / 24 * 100}% - 1px)`,
                top: -4, bottom: -4,
                width: 2, background: "#F43F72",
                boxShadow: "0 0 8px rgba(244,63,114,0.6)",
              }}>
                <div style={{
                  position: "absolute", top: -16, left: "50%",
                  transform: "translateX(-50%)",
                  background: "#F43F72", color: "white",
                  fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 6,
                  letterSpacing: "0.08em",
                }}>
                  {pickT(lang, "現在", "NOW")}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", marginTop: 8, fontSize: 9, color: "#9CA3AF" }}>
                {["6", "9", "12", "15", "18", "21"].map((h) => (
                  <div key={h} style={{ textAlign: "left" }}>{h}:00</div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {[
                { label: pickT(lang, "総鳴き声", "Total barks"), value: "128" },
                { label: pickT(lang, "最長静寂", "Longest calm"), value: "3h 20m" },
                { label: pickT(lang, "ピーク時刻", "Peak time"), value: "17:40" },
              ].map((s, i) => (
                <div key={i} style={{
                  background: "#FAF3F6", borderRadius: 12, padding: "10px 8px",
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: 9, color: "#6B7280", fontWeight: 600, letterSpacing: "0.06em" }}>{s.label}</div>
                  <div style={{ fontSize: 14, color: "#3A243B", fontWeight: 800, marginTop: 4 }}>{s.value}</div>
                </div>
              ))}
            </div>
          </Section>

          {/* CARD 5 - Emotion Breakdown (Donut) */}
          <Section style={{ animation: "bsFadeUp .6s ease-out .35s both" }}>
            <Label lang={lang} jp="感情分布" en="Emotion Breakdown" />
            <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 18, marginTop: 14, alignItems: "center" }}>
              <div style={{ position: "relative", width: 180, height: 180 }}>
                <svg width="180" height="180" viewBox="0 0 180 180" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="90" cy="90" r={donutR} fill="none" stroke="#F3EEF2" strokeWidth="22" />
                  {donut.map((d) => {
                    const len = (d.pct / 100) * donutC;
                    const off = donutOffset;
                    donutOffset += len;
                    return (
                      <circle
                        key={d.key}
                        cx="90" cy="90" r={donutR}
                        fill="none"
                        stroke={EMO[d.key].color}
                        strokeWidth="22"
                        strokeDasharray={`${mounted ? len : 0} ${donutC}`}
                        strokeDashoffset={-off}
                        style={{
                          transition: "stroke-dasharray 1.1s cubic-bezier(.2,.8,.2,1)",
                          filter: "drop-shadow(0 2px 4px rgba(58,36,59,0.15))",
                        }}
                      />
                    );
                  })}
                </svg>
                <div style={{
                  position: "absolute", inset: 0, display: "flex",
                  flexDirection: "column", alignItems: "center", justifyContent: "center",
                }}>
                  <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 600 }}>
                    {pickT(lang, "穏やか", "Calm")}
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: "#1A1A2E", lineHeight: 1 }}>55%</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {donut.map((d) => (
                  <div key={d.key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: EMO[d.key].color, flexShrink: 0 }} />
                    <span style={{ color: "#1A1A2E", fontWeight: 600, flex: 1 }}>
                      {lang === "english" ? EMO[d.key].en : EMO[d.key].jp}
                    </span>
                    <span style={{ color: "#6B7280" }}>{d.pct}%</span>
                    <span style={{
                      fontSize: 9, fontWeight: 700,
                      color: d.trend.startsWith("+") ? "#6DBA91" : d.trend.startsWith("-") ? "#E57373" : "#9CA3AF",
                    }}>{d.trend}</span>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* CARD 6 - AI Insight */}
          <section
            style={{
              position: "relative",
              borderRadius: 26,
              padding: 22,
              background: "linear-gradient(135deg, #3A243B 0%, #5B3552 100%)",
              boxShadow: "0 16px 40px rgba(58,36,59,0.30)",
              overflow: "hidden",
              animation: "bsFadeUp .6s ease-out .4s both",
            }}
          >
            <div aria-hidden style={{
              position: "absolute", right: -20, top: -20,
              fontSize: 140, color: "white", opacity: 0.06,
              fontFamily: "'Noto Serif JP', serif", fontWeight: 900, lineHeight: 1,
            }}>桜</div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                fontSize: 10, color: "#F48FB1",
                fontWeight: 800, letterSpacing: "0.2em",
              }}>AI INSIGHT</div>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.15)" }} />
            </div>

            <div style={{ marginTop: 14, color: "white", fontSize: 14, lineHeight: 1.6 }}>
              {lang === "english" && (
                <>{dogName}'s bark pattern is calm and stable today. Short playful bursts were detected in the afternoon, but no stress signals were found.</>
              )}
              {lang === "japanese" && (
                <>{dogName}の鳴き声パターンは本日穏やかで安定しています。午後に短い遊びたい反応がありましたが、ストレスの兆候は検出されていません。</>
              )}
              {lang === "mixed" && (
                <>
                  <div>{dogName}の鳴き声パターンは本日穏やかで安定しています。午後に短い遊びたい反応がありましたが、ストレスの兆候は検出されていません。</div>
                  <div style={{ fontSize: 12, opacity: 0.75, marginTop: 8 }}>
                    {dogName}'s bark pattern is calm and stable today. Short playful bursts were detected in the afternoon, but no stress signals were found.
                  </div>
                </>
              )}
            </div>

            <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "rgba(109,186,145,0.22)", color: "#A8E6C0",
                padding: "6px 12px", borderRadius: 999, fontSize: 11, fontWeight: 700,
                border: "1px solid rgba(109,186,145,0.35)",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6DBA91" }} />
                {pickT(lang, "感情状態は安定", "Stable emotional state")}
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>
                {pickT(lang, "更新 14:32", "Updated 14:32")}
              </div>
            </div>
          </section>

        </div>
      </div>
    </AppShell>
  );
}
