import { createFileRoute } from "@tanstack/react-router";
import AppShell, { TopBar } from "@/components/AppShell";
import { useT, useLanguage } from "@/context/LanguageContext";
import { usePet, displayName } from "@/context/PetContext";


export const Route = createFileRoute("/bark-sense")({ component: BarkSensePage });

type EmotionKey =
  | "happy" | "calm" | "excited" | "anxious" | "sad"
  | "angry" | "playful" | "tired" | "scared";

const EMOTIONS: Record<EmotionKey, { jp: string; en: string; soft: string; deep: string; glow: string }> = {
  happy:   { jp: "幸せ",     en: "Happy",   soft: "#FEF3C7", deep: "#CA8A04", glow: "#FCD34D" },
  calm:    { jp: "穏やか",   en: "Calm",    soft: "#D1FAE5", deep: "#16A34A", glow: "#34D399" },
  excited: { jp: "興奮",     en: "Excited", soft: "#FCE7F3", deep: "#DB2777", glow: "#F472B6" },
  anxious: { jp: "不安",     en: "Anxious", soft: "#EDE9FE", deep: "#7C3AED", glow: "#A78BFA" },
  sad:     { jp: "悲しい",   en: "Sad",     soft: "#DBEAFE", deep: "#2563EB", glow: "#60A5FA" },
  angry:   { jp: "怒り",     en: "Angry",   soft: "#FEE2E2", deep: "#DC2626", glow: "#F87171" },
  playful: { jp: "遊び心",   en: "Playful", soft: "#FFEDD5", deep: "#EA580C", glow: "#FB923C" },
  tired:   { jp: "疲れた",   en: "Tired",   soft: "#F3F4F6", deep: "#6B7280", glow: "#9CA3AF" },
  scared:  { jp: "怖い",     en: "Scared",  soft: "#F5F3FF", deep: "#8B5CF6", glow: "#C4B5FD" },
};

const ORDER: EmotionKey[] = ["happy","calm","excited","anxious","sad","angry","playful","tired","scared"];
const INTENSITY: Record<EmotionKey, number> = {
  calm: 94, happy: 12, playful: 8, excited: 4, tired: 6, anxious: 2, sad: 1, angry: 0, scared: 1,
};
const WEEK: { day: EmotionKey; jp: string; en: string }[] = [
  { day: "calm", jp: "月", en: "M" }, { day: "happy", jp: "火", en: "T" },
  { day: "playful", jp: "水", en: "W" }, { day: "calm", jp: "木", en: "T" },
  { day: "excited", jp: "金", en: "F" }, { day: "tired", jp: "土", en: "S" },
  { day: "calm", jp: "日", en: "S" },
];
const HOURS_24: EmotionKey[] = [
  "tired","tired","tired","tired","tired","tired",
  "calm","calm","excited","playful","calm","happy",
  "calm","calm","playful","happy","excited","calm",
  "calm","calm","calm","tired","tired","tired",
];
const TRIGGERS = [
  { time: "08:15", emotion: "excited" as EmotionKey, jp: "お散歩前", en: "Before walk" },
  { time: "12:30", emotion: "calm"    as EmotionKey, jp: "食後の休息", en: "After meal" },
  { time: "16:00", emotion: "playful" as EmotionKey, jp: "おもちゃで遊ぶ", en: "Playing with toy" },
];

const ROSE = "#F43F72";
const INK = "#1A1A2E";
const MUTED = "#9CA3AF";
const SUB = "#6B7280";

function BarkSensePage() {
  const t = useT();
  const { language } = useLanguage();
  const { pet } = usePet();
  const name = displayName(pet, "Fluffy");
  const current: EmotionKey = "calm";


  return (
    <AppShell
      noPadding
      renderTopBar={({ menuOpen, onMenuClick }) => (
        <TopBar showBack backTo="/home" menuOpen={menuOpen} onMenuClick={onMenuClick} />
      )}
    >
      <style>{`
        @keyframes bsOrbBreath { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.08);opacity:.92} }
        @keyframes bsOrbit { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes bsOrbitInner { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
        @keyframes bsWave { 0%,100%{transform:scaleY(.35)} 50%{transform:scaleY(1)} }
        @keyframes bsLive { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.4)} }
        @keyframes bsCardIn { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bsBarRise { from{transform:scaleY(0)} to{transform:scaleY(1)} }
        @keyframes bsFillIn { from{width:0} }
        @keyframes bsSparkle { 0%,100%{transform:rotate(0deg) scale(1)} 50%{transform:rotate(180deg) scale(1.15)} }
        @keyframes bsClockSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes bsDrawPath { from{stroke-dashoffset:1000} to{stroke-dashoffset:0} }
        .bs-stack > * { opacity:0; animation: bsCardIn 480ms cubic-bezier(.2,.7,.2,1) forwards; }
        .bs-stack > *:nth-child(1){animation-delay:60ms}
        .bs-stack > *:nth-child(2){animation-delay:160ms}
        .bs-stack > *:nth-child(3){animation-delay:240ms}
        .bs-stack > *:nth-child(4){animation-delay:320ms}
        .bs-stack > *:nth-child(5){animation-delay:400ms}
        .bs-stack > *:nth-child(6){animation-delay:480ms}
        .bs-noise {
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/></svg>");
        }
      `}</style>

      <div style={{ position: "relative", minHeight: "100%", paddingBottom: 100, background: "#FAFAF9" }}>
        {/* Watercolor mesh background */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `
            radial-gradient(circle at 0% 0%, rgba(244,63,114,0.06), transparent 50%),
            radial-gradient(circle at 100% 0%, rgba(167,139,250,0.06), transparent 50%),
            radial-gradient(circle at 0% 100%, rgba(134,239,172,0.06), transparent 50%),
            radial-gradient(circle at 100% 100%, rgba(253,224,71,0.05), transparent 50%)
          `,
        }} />
        <div aria-hidden className="bs-noise absolute inset-0" style={{ opacity: 0.02, pointerEvents: "none" }} />

        {/* ───────── HERO — Aurora Orb ───────── */}
        <HeroOrb current={current} name={name} />

        {/* ───────── Cards stack ───────── */}
        <div className="bs-stack relative" style={{ padding: "4px 16px 0" }}>
          {/* CARD 1 — Spectrum (glass) */}
          <GlassCard>
            <CardTitle jp="感情スペクトラム" en="EMOTION SPECTRUM" action={t("すべて", "View all")} />
            <div className="flex items-end" style={{ gap: 6, height: 130, marginTop: 6 }}>
              {ORDER.map((k, i) => {
                const e = EMOTIONS[k];
                const v = INTENSITY[k];
                const h = Math.max(6, (v / 100) * 110);
                return (
                  <div key={k} className="flex-1 flex flex-col items-center" style={{ minWidth: 0 }}>
                    <div style={{
                      width: "100%", height: 110, position: "relative",
                      background: "rgba(0,0,0,0.025)", borderRadius: 50, overflow: "hidden",
                      display: "flex", alignItems: "flex-end",
                    }}>
                      <div style={{
                        width: "100%", height: h, borderRadius: 50,
                        background: `linear-gradient(180deg, ${e.glow}, ${e.deep})`,
                        boxShadow: `0 0 12px ${e.glow}55, inset 0 1px 1px rgba(255,255,255,0.4)`,
                        transformOrigin: "bottom",
                        animation: `bsBarRise 700ms cubic-bezier(.2,.8,.2,1) ${i * 60}ms both`,
                      }} />
                    </div>
                    <div style={{ marginTop: 8, textAlign: "center", lineHeight: 1.1 }}>
                      {language !== "english" && <div style={{ fontSize: 10, color: INK, fontWeight: 600 }}>{e.jp}</div>}
                      {language !== "japanese" && <div style={{ fontSize: 8, color: MUTED, marginTop: 1 }}>{e.en}</div>}
                      <div style={{ fontSize: 9, color: e.deep, fontWeight: 700, fontVariantNumeric: "tabular-nums", marginTop: 2 }}>{v}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* CARD 2 — Emotion River */}
          <WhiteCard>
            <CardTitle jp="感情の軌跡" en="EMOTION JOURNEY" />
            <EmotionRiver />
            <div style={{ fontSize: 11, color: MUTED, letterSpacing: "0.04em", margin: "14px 0 10px" }}>
              {t("今週のまとめ", "THIS WEEK'S SUMMARY")}
            </div>
            <SummaryBar jp="穏やか" en="Calm" pct={68} from="#34D399" to="#16A34A" />
            <SummaryBar jp="幸せ" en="Happy" pct={22} from="#FCD34D" to="#CA8A04" />
          </WhiteCard>

          {/* CARD 3 — Mood Clock */}
          <WhiteCard>
            <CardTitle jp="本日のムードクロック" en="TODAY'S MOOD CLOCK" />
            <MoodClock />
            <div className="flex flex-wrap justify-center" style={{ gap: 10, marginTop: 12 }}>
              {([["calm",55],["happy",22],["playful",13],["tired",6],["excited",3],["anxious",1]] as [EmotionKey,number][]).map(([k,p])=>{
                const e = EMOTIONS[k];
                return (
                  <div key={k} className="flex items-center" style={{ gap: 5, fontSize: 11 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: e.glow, boxShadow: `0 0 6px ${e.glow}` }} />
                    <span style={{ color: INK, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{p}%</span>
                    <span style={{ color: SUB }}>{t(e.jp, e.en)}</span>
                  </div>
                );
              })}
            </div>
          </WhiteCard>

          {/* CARD 4 — Triggers */}
          <WhiteCard>
            <CardTitle jp="感情のきっかけ" en="EMOTION TRIGGERS" />
            <div style={{ fontSize: 11, color: MUTED, marginTop: -6, marginBottom: 10 }}>
              {t("今日検出されたパターン", "Patterns detected today")}
            </div>
            {TRIGGERS.map((tr, i) => {
              const e = EMOTIONS[tr.emotion];
              return (
                <div key={i}>
                  <div className="flex items-center" style={{ gap: 12, padding: "12px 0" }}>
                    <div style={{ fontSize: 11, color: ROSE, fontWeight: 700, fontVariantNumeric: "tabular-nums", width: 42 }}>{tr.time}</div>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: e.glow, boxShadow: `0 0 8px ${e.glow}`, flexShrink: 0 }} />
                    <div className="flex-1" style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: INK, fontWeight: 600 }}>
                        {t(e.jp, e.en)} <span style={{ color: SUB, fontWeight: 400 }}>— {t(tr.jp, tr.en)}</span>
                      </div>
                    </div>
                    <span style={{ color: MUTED, fontSize: 16 }}>›</span>
                  </div>
                  {i < TRIGGERS.length - 1 && <div style={{ height: 1, background: "#F3F4F6" }} />}
                </div>
              );
            })}
          </WhiteCard>

          {/* CARD 5 — Bark Pattern */}
          <WhiteCard>
            <CardTitle jp="鳴き声パターン" en="BARK PATTERN ANALYSIS" />
            <BarkWaveform />
            <div className="flex" style={{ marginTop: 14, borderTop: "1px solid #F3F4F6", paddingTop: 12 }}>
              <Stat label={t("総鳴き声", "Total Barks")} value="47" unit={t("回", "")} accent />
              <Divider />
              <Stat label={t("平均音量", "Avg Volume")} value={t("中", "Med")} />
              <Divider />
              <Stat label={t("ピーク時間", "Peak Time")} value="16:00" />
            </div>
            <div style={{ marginTop: 12 }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "#F0FDF4", color: "#16A34A",
                padding: "5px 12px", borderRadius: 50, fontSize: 11, fontWeight: 600,
              }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22C55E" }} />
                {t("正常な鳴き声パターン ✓", "Normal bark pattern ✓")}
              </span>
            </div>
          </WhiteCard>

          {/* CARD 6 — AI Insight */}
          <div style={{
            background: "linear-gradient(135deg,#FFF5F7 0%,#F9F0FF 100%)",
            borderRadius: 22, padding: 20, marginBottom: 14,
            borderLeft: `4px solid ${ROSE}`,
            boxShadow: "0 2px 6px rgba(244,63,114,0.06), 0 12px 32px rgba(244,63,114,0.08)",
          }}>
            <div className="flex items-center" style={{ gap: 8 }}>
              <span style={{ color: ROSE, fontSize: 14, display: "inline-block", animation: "bsSparkle 4s ease-in-out infinite", transformOrigin: "center" }}>✦</span>
              <span style={{ fontSize: 11, color: ROSE, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                {t("AI インサイト", "AI Insight")}
              </span>
            </div>
            <div style={{ height: 1, background: "rgba(244,63,114,0.12)", margin: "12px 0" }} />
            {language !== "english" && (
              <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.8 }}>
                {name}は今日とても穏やかで、感情的に安定しています。今週は68%の時間を穏やかな状態で過ごし、先週より15%改善しました。
              </div>
            )}
            {language !== "japanese" && (
              <div style={{ fontSize: 12, color: language === "english" ? "#374151" : "#9CA3AF", lineHeight: 1.7, marginTop: language === "english" ? 0 : 8 }}>
                {name} is very calm and emotionally stable today. This week 68% calm — 15% improvement from last week.
              </div>
            )}
            <div style={{
              marginTop: 14, background: "rgba(244,63,114,0.06)",
              borderRadius: 14, padding: "10px 14px",
            }}>
              <div style={{ fontSize: 10, color: ROSE, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 4 }}>
                {t("推奨 / RECOMMENDATION", "RECOMMENDATION")}
              </div>
              <div style={{ fontSize: 12, color: INK }}>
                {t("現在の生活パターンを維持してください", "Maintain current lifestyle patterns")}
              </div>
            </div>
            <div className="flex flex-wrap" style={{ gap: 8, marginTop: 14 }}>
              <Pill label={t("詳細を見る", "Details")} />
              <Pill label={t("レポート", "Export")} />
              <Pill label={t("アラート設定", "Alerts")} />
            </div>
            <div style={{ fontSize: 10, color: MUTED, marginTop: 12 }}>
              {t("最終更新 今日 14:32", "Last updated: Today 14:32")}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

/* ─────────────────────────────────── HERO ─────────────────────────────────── */
function HeroOrb({ current, name: _name }: { current: EmotionKey; name: string }) {
  const t = useT();
  const cur = EMOTIONS[current];
  const satellites = ORDER.filter((k) => k !== current);

  return (
    <div style={{ position: "relative", height: 460, overflow: "hidden" }}>
      {/* Aura */}
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(circle at center 42%, ${cur.glow}24 0%, transparent 60%)`,
      }} />
      {/* Kanji watermark */}
      <span aria-hidden style={{
        position: "absolute", top: 10, right: -20,
        fontSize: 200, lineHeight: 1, color: "rgba(0,0,0,0.035)",
        fontWeight: 700, userSelect: "none", pointerEvents: "none",
      }}>心</span>

      {/* Orb cluster */}
      <div style={{
        position: "absolute", top: 40, left: "50%",
        width: 360, height: 360, transform: "translateX(-50%)",
      }}>
        {/* Orbit ring (decorative) */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          border: "1px dashed rgba(0,0,0,0.06)",
        }} />
        {/* Satellites */}
        <div style={{
          position: "absolute", inset: 0,
          animation: "bsOrbit 40s linear infinite",
        }}>
          {satellites.map((k, i) => {
            const e = EMOTIONS[k];
            const angle = (i / satellites.length) * Math.PI * 2 - Math.PI / 2;
            const R = 168;
            const x = 180 + Math.cos(angle) * R;
            const y = 180 + Math.sin(angle) * R;
            return (
              <div key={k} style={{
                position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)",
                animation: "bsOrbitInner 40s linear infinite",
                textAlign: "center",
              }}>
                <span style={{
                  display: "block", width: 14, height: 14, borderRadius: "50%",
                  background: e.glow,
                  boxShadow: `0 0 12px ${e.glow}, inset 0 1px 1px rgba(255,255,255,0.5)`,
                  margin: "0 auto",
                }} />
                <div style={{ fontSize: 9, color: SUB, marginTop: 4, fontWeight: 600, whiteSpace: "nowrap" }}>{e.jp}</div>
              </div>
            );
          })}
        </div>

        {/* Aurora orb (centered) */}
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-50%,-50%)",
          width: 200, height: 200,
          animation: "bsOrbBreath 3.4s ease-in-out infinite",
        }}>
          {/* Outer glow */}
          <div aria-hidden style={{
            position: "absolute", inset: -50, borderRadius: "50%",
            background: `radial-gradient(circle, ${cur.glow}50 0%, transparent 70%)`,
            filter: "blur(20px)",
          }} />
          {/* Mid glow */}
          <div aria-hidden style={{
            position: "absolute", inset: -10, borderRadius: "50%",
            background: `radial-gradient(circle, ${cur.glow}99 0%, ${cur.glow}33 60%, transparent 100%)`,
            filter: "blur(12px)",
          }} />
          {/* Core */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            background: `radial-gradient(circle at 35% 30%, #ffffff, ${cur.glow} 45%, ${cur.deep} 100%)`,
            boxShadow: `inset 0 -10px 30px ${cur.deep}55, inset 0 10px 25px rgba(255,255,255,0.35)`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {/* Waveform */}
            <div className="flex items-center" style={{ gap: 5, height: 50 }}>
              {[0,1,2,3,4].map(i => (
                <span key={i} style={{
                  width: 4, borderRadius: 4, height: 50, background: "#ffffff",
                  boxShadow: "0 0 6px rgba(255,255,255,0.6)",
                  transformOrigin: "center",
                  animation: `bsWave ${1.2 + i * 0.18}s ease-in-out ${i * 0.12}s infinite`,
                }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Label below orb */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 14, textAlign: "center" }}>
        <div style={{ fontSize: 38, fontWeight: 300, color: cur.deep, letterSpacing: "0.1em", lineHeight: 1 }}>
          {cur.jp}
        </div>
        <div style={{ fontSize: 12, color: cur.deep, opacity: 0.7, letterSpacing: "0.25em", textTransform: "uppercase", marginTop: 6, fontWeight: 600 }}>
          {cur.en}
        </div>
        <div className="flex items-center justify-center" style={{ gap: 8, marginTop: 12 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#E11D48", animation: "bsLive 1.4s ease-in-out infinite" }} />
          <span style={{ fontSize: 11, color: SUB, letterSpacing: "0.04em" }}>
            {t("ライブ解析中 · 信頼度 94%", "Live analysis · Confidence 94%")}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────── PRIMITIVES ─────────────────────────────────── */
function WhiteCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: "#FFFFFF", borderRadius: 22, padding: 20, marginBottom: 14,
      boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.05), 0 16px 40px rgba(244,63,114,0.04)",
    }}>{children}</div>
  );
}
function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.72)",
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.85)",
      borderRadius: 24, padding: 20, marginBottom: 14,
      boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.07), 0 16px 48px rgba(244,63,114,0.05)",
    }}>{children}</div>
  );
}
function CardTitle({ jp, en, action }: { jp: string; en: string; action?: string }) {
  const t = useT();
  return (
    <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
      <div className="flex items-center" style={{ gap: 6 }}>
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: ROSE }} />
        <span style={{ fontSize: 11, color: ROSE, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          {t(jp, en)}
        </span>
      </div>
      {action && <span style={{ fontSize: 11, color: ROSE, fontWeight: 600 }}>{action} ›</span>}
    </div>
  );
}
function Pill({ label }: { label: string }) {
  return (
    <button style={{
      border: `1px solid ${ROSE}44`, color: ROSE,
      background: "transparent", padding: "6px 12px", borderRadius: 50,
      fontSize: 11, fontWeight: 600,
    }}>{label}</button>
  );
}
function Stat({ label, value, unit, accent }: { label: string; value: string; unit?: string; accent?: boolean }) {
  return (
    <div className="flex-1" style={{ textAlign: "center" }}>
      <div style={{ fontSize: 10, color: MUTED, letterSpacing: "0.04em", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: accent ? ROSE : INK, fontVariantNumeric: "tabular-nums" }}>
        {value}{unit && <span style={{ fontSize: 11, color: MUTED, marginLeft: 2 }}>{unit}</span>}
      </div>
    </div>
  );
}
function Divider() {
  return <div style={{ width: 1, background: "#F3F4F6" }} />;
}
function SummaryBar({ jp, en, pct, from, to }: { jp: string; en: string; pct: number; from: string; to: string }) {
  const t = useT();
  return (
    <div style={{ marginBottom: 10 }}>
      <div className="flex justify-between" style={{ fontSize: 12, marginBottom: 5 }}>
        <span style={{ color: INK, fontWeight: 600 }}>{t(jp, en)}</span>
        <span style={{ color: SUB, fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>{pct}%</span>
      </div>
      <div style={{ height: 8, borderRadius: 50, background: "#F3F4F6", overflow: "hidden", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.04)" }}>
        <div style={{
          width: `${pct}%`, height: "100%", borderRadius: 50,
          background: `linear-gradient(90deg, ${from}, ${to})`,
          boxShadow: `0 0 8px ${from}66, inset 0 1px 1px rgba(255,255,255,0.4)`,
          animation: "bsFillIn 1100ms cubic-bezier(.2,.8,.2,1) both",
        }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────── EMOTION RIVER ─────────────────────────────────── */
function EmotionRiver() {
  const t = useT();
  const W = 320, H = 80;
  const step = W / (WEEK.length - 1);
  // Build smooth ribbon — width varies per day
  const widths = [22, 28, 24, 30, 36, 18, 32];
  const ys = widths.map((w, i) => ({ top: H/2 - w/2, bot: H/2 + w/2, x: i * step }));

  const topPath = `M ${ys[0].x} ${ys[0].top} ` + ys.slice(1).map((p, i) => {
    const prev = ys[i];
    const cx = (prev.x + p.x) / 2;
    return `C ${cx} ${prev.top} ${cx} ${p.top} ${p.x} ${p.top}`;
  }).join(" ");
  const botPath = ` L ${ys[ys.length-1].x} ${ys[ys.length-1].bot} ` + [...ys].reverse().slice(1).map((p, i) => {
    const prevArr = [...ys].reverse();
    const prev = prevArr[i];
    const cx = (prev.x + p.x) / 2;
    return `C ${cx} ${prev.bot} ${cx} ${p.bot} ${p.x} ${p.bot}`;
  }).join(" ") + " Z";

  return (
    <div style={{ width: "100%" }}>
      <svg viewBox={`0 0 ${W} ${H + 26}`} width="100%" style={{ display: "block", overflow: "visible" }}>
        <defs>
          <linearGradient id="bsRiver" x1="0" y1="0" x2="1" y2="0">
            {WEEK.map((d, i) => (
              <stop key={i} offset={`${(i / (WEEK.length - 1)) * 100}%`} stopColor={EMOTIONS[d.day].glow} />
            ))}
          </linearGradient>
        </defs>
        <path d={topPath + botPath} fill="url(#bsRiver)" opacity="0.85"
              style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.08))" }} />
        {/* Day markers */}
        {WEEK.map((d, i) => {
          const isToday = i === WEEK.length - 1;
          return (
            <g key={i}>
              {isToday && (
                <>
                  <circle cx={i * step} cy={H + 6} r={3} fill={ROSE} />
                  <text x={i * step} y={H + 22} textAnchor="middle" fontSize="9" fontWeight="700" fill={ROSE}>
                    {t("今日", "Today")}
                  </text>
                </>
              )}
              {!isToday && (
                <text x={i * step} y={H + 18} textAnchor="middle" fontSize="11" fill={MUTED} fontWeight="600">
                  {t(d.jp, d.en)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ─────────────────────────────────── MOOD CLOCK ─────────────────────────────────── */
function MoodClock() {
  const t = useT();
  const size = 220, cx = size / 2, cy = size / 2;
  const R_OUT = 100, R_IN = 76;
  const segs = HOURS_24;
  const SEG = (Math.PI * 2) / 24;

  function arcPath(start: number, end: number) {
    const x1 = cx + Math.cos(start) * R_OUT;
    const y1 = cy + Math.sin(start) * R_OUT;
    const x2 = cx + Math.cos(end) * R_OUT;
    const y2 = cy + Math.sin(end) * R_OUT;
    const x3 = cx + Math.cos(end) * R_IN;
    const y3 = cy + Math.sin(end) * R_IN;
    const x4 = cx + Math.cos(start) * R_IN;
    const y4 = cy + Math.sin(start) * R_IN;
    return `M ${x1} ${y1} A ${R_OUT} ${R_OUT} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${R_IN} ${R_IN} 0 0 0 ${x4} ${y4} Z`;
  }

  const nowHour = 14, nowMin = 32;
  const nowAngle = ((nowHour + nowMin / 60) / 24) * Math.PI * 2 - Math.PI / 2;

  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
      {/* Slowly rotating background pattern */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: "conic-gradient(from 0deg, rgba(244,63,114,0.04), transparent, rgba(167,139,250,0.04), transparent, rgba(244,63,114,0.04))",
        animation: "bsClockSpin 60s linear infinite",
      }} />
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: "relative", filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.08))" }}>
        {segs.map((k, i) => {
          const a0 = i * SEG - Math.PI / 2;
          const a1 = (i + 1) * SEG - Math.PI / 2;
          const e = EMOTIONS[k];
          return <path key={i} d={arcPath(a0, a1 - 0.012)} fill={e.glow} opacity={0.78} />;
        })}
        {/* Hour markers */}
        {[0,6,12,18].map(h => {
          const a = (h / 24) * Math.PI * 2 - Math.PI / 2;
          const x = cx + Math.cos(a) * (R_IN - 8);
          const y = cy + Math.sin(a) * (R_IN - 8);
          return <text key={h} x={x} y={y + 3} textAnchor="middle" fontSize="9" fill={MUTED} fontWeight="600">{h === 0 ? 24 : h}</text>;
        })}
        {/* Now marker */}
        <circle cx={cx + Math.cos(nowAngle) * (R_IN - 4)} cy={cy + Math.sin(nowAngle) * (R_IN - 4)} r={3} fill={ROSE} />
        {/* Inner disc */}
        <circle cx={cx} cy={cy} r={R_IN - 12} fill="#FFFFFF" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
        <div style={{ fontSize: 9, color: MUTED, letterSpacing: "0.15em", fontWeight: 600 }}>{t("現在", "NOW")}</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: INK, fontVariantNumeric: "tabular-nums", marginTop: 2 }}>14:32</div>
        <div style={{ fontSize: 12, color: EMOTIONS.calm.deep, fontWeight: 600, marginTop: 2 }}>{t("穏やか", "Calm")}</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────── BARK WAVEFORM ─────────────────────────────────── */
function BarkWaveform() {
  // Deterministic pseudo-random heights
  const N = 60;
  const heights = Array.from({ length: N }, (_, i) => {
    const x = i / N;
    const env = Math.sin(x * Math.PI) * 0.85 + 0.15;
    const wiggle = 0.4 + 0.6 * Math.abs(Math.sin(i * 1.3) * Math.cos(i * 0.7));
    return Math.max(0.12, env * wiggle);
  });
  return (
    <div style={{
      position: "relative", height: 80, display: "flex", alignItems: "center",
      gap: 3, padding: "0 2px",
      background: "linear-gradient(180deg, #FFF5F7 0%, #FFFFFF 100%)",
      borderRadius: 14,
    }}>
      {heights.map((h, i) => (
        <div key={i} style={{
          flex: 1,
          height: `${h * 100}%`,
          borderRadius: 50,
          background: `linear-gradient(180deg, #FF6B8A, ${ROSE})`,
          boxShadow: `0 0 4px rgba(244,63,114,0.4)`,
          transformOrigin: "center",
          animation: `bsBarRise 600ms cubic-bezier(.2,.8,.2,1) ${i * 12}ms both`,
        }} />
      ))}
    </div>
  );
}
