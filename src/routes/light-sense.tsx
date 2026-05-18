import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState, useMemo } from "react";
import { SensorPage } from "@/components/SensorPage";
import { useT } from "@/context/LanguageContext";

export const Route = createFileRoute("/light-sense")({ component: LightSensePage });

// ───────────── Palette ─────────────
const Y = {
  primary: "#E8C547",
  medium: "#D4AD35",
  deep: "#B8921A",
  soft: "#FEF9E7",
  pale: "#FFFDF0",
  accent: "#F2D063",
  muted: "#F7E49A",
  light: "#FDF5C8",
  white: "#FFFFFF",
  text: "#1A1A2E",
  text2: "#6B7280",
  text3: "#9CA3AF",
  ink: "#4B5563",
};

// ───────────── Color Data ─────────────
type Swatch = { jp: string; en: string; hex: string };
type Mood = { key: string; emoji: string; jp: string; en: string; colors: Swatch[] };

const MOODS: Mood[] = [
  {
    key: "wa", emoji: "🌸", jp: "和", en: "Japanese",
    colors: [
      { jp: "桜", en: "Sakura", hex: "#FFB7C5" },
      { jp: "梅", en: "Ume", hex: "#E8B4BD" },
      { jp: "牡丹", en: "Botan", hex: "#D14B7C" },
      { jp: "撫子", en: "Nadeshiko", hex: "#F19BAB" },
      { jp: "若竹", en: "Wakatake", hex: "#89C3EB" },
      { jp: "藤", en: "Fuji", hex: "#9B8EC4" },
      { jp: "若草", en: "Wakakusa", hex: "#8DC47C" },
      { jp: "山吹", en: "Yamabuki", hex: "#F6AD3B" },
      { jp: "白", en: "Shiro", hex: "#FFFFFF" },
      { jp: "金", en: "Kin", hex: "#E8C547" },
      { jp: "銀", en: "Gin", hex: "#C0C0C0" },
      { jp: "漆黒", en: "Shikkoku", hex: "#2A2A4E" },
    ],
  },
  {
    key: "night", emoji: "🌙", jp: "夜", en: "Night",
    colors: [
      { jp: "群青", en: "Gunjo", hex: "#3D5A8C" },
      { jp: "藍", en: "Ai", hex: "#274472" },
      { jp: "紺", en: "Kon", hex: "#1F2A5C" },
      { jp: "瑠璃", en: "Ruri", hex: "#1E50A2" },
      { jp: "菫", en: "Sumire", hex: "#7058A3" },
      { jp: "葡萄", en: "Ebi", hex: "#5D3F6A" },
      { jp: "深紫", en: "Kokimurasaki", hex: "#3E2E5C" },
      { jp: "夜空", en: "Yozora", hex: "#1A1A3E" },
      { jp: "月白", en: "Geppaku", hex: "#E8EAF0" },
      { jp: "星空", en: "Hoshizora", hex: "#4A6FA5" },
      { jp: "宵闇", en: "Yoiyami", hex: "#2D2D55" },
      { jp: "蛍", en: "Hotaru", hex: "#C4E89A" },
    ],
  },
  {
    key: "nature", emoji: "🌿", jp: "自然", en: "Nature",
    colors: [
      { jp: "薄荷", en: "Hakka", hex: "#A8E6CF" },
      { jp: "若苔", en: "Wakagoke", hex: "#7FAE6E" },
      { jp: "苔", en: "Koke", hex: "#5C7A3F" },
      { jp: "竹", en: "Take", hex: "#7BA05B" },
      { jp: "若葉", en: "Wakaba", hex: "#B8D88A" },
      { jp: "森", en: "Mori", hex: "#3D5A40" },
      { jp: "空", en: "Sora", hex: "#9CC4E4" },
      { jp: "水", en: "Mizu", hex: "#B5D8E8" },
      { jp: "土", en: "Tsuchi", hex: "#A88B6A" },
      { jp: "砂", en: "Suna", hex: "#E0CFA8" },
      { jp: "黄昏", en: "Tasogare", hex: "#E89A6B" },
      { jp: "朝霧", en: "Asagiri", hex: "#D8E4E8" },
    ],
  },
  {
    key: "special", emoji: "✨", jp: "特別", en: "Special",
    colors: [
      { jp: "虹", en: "Rainbow", hex: "#FF6B9D" },
      { jp: "暖白", en: "Warm White", hex: "#FFF4D6" },
      { jp: "冷白", en: "Cool White", hex: "#E8F0FF" },
      { jp: "夕焼", en: "Yuyake", hex: "#FF8A5C" },
      { jp: "極光", en: "Aurora", hex: "#7FFFD4" },
      { jp: "銀河", en: "Ginga", hex: "#9B72CF" },
      { jp: "煌めき", en: "Kirameki", hex: "#FFD700" },
      { jp: "炎", en: "Honoo", hex: "#FF5722" },
      { jp: "氷", en: "Koori", hex: "#B5E8F0" },
      { jp: "雷", en: "Kaminari", hex: "#FFF176" },
      { jp: "花火", en: "Hanabi", hex: "#E91E63" },
      { jp: "輝", en: "Kagayaki", hex: "#FFE082" },
    ],
  },
];

type Mode = "steady" | "blink" | "rainbow" | "pulse";

function LightSensePage() {
  const t = useT();
  const [moodKey, setMoodKey] = useState("wa");
  const [selected, setSelected] = useState<Swatch>(MOODS[0].colors[0]);
  const [brightness, setBrightness] = useState(75);
  const [mode, setMode] = useState<Mode>("steady");
  const [advOpen, setAdvOpen] = useState(false);
  const [hue, setHue] = useState(340);
  const [bri, setBri] = useState(85);
  const [sat, setSat] = useState(60);

  const mood = useMemo(() => MOODS.find(m => m.key === moodKey)!, [moodKey]);
  const isRainbow = mode === "rainbow";
  const displayBg = isRainbow
    ? "linear-gradient(90deg,#FF6B9D,#FFD700,#7FFFD4,#89C3EB,#9B72CF,#FF6B9D)"
    : selected.hex;
  const glowRgba = hexToRgba(selected.hex, 0.6);

  return (
    <SensorPage
      titleJp="ライトセンス AI"
      titleEn="LightSense AI"
      heroGradient="linear-gradient(135deg,#B8921A 0%,#D4AD35 50%,#E8C547 100%)"
    >
      <style>{`
        @keyframes lsBlink { 0%,49%{opacity:1} 50%,100%{opacity:.2} }
        @keyframes lsPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.18)} }
        @keyframes lsHueRot { from{filter:hue-rotate(0deg)} to{filter:hue-rotate(360deg)} }
        @keyframes lsLiveDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.3)} }
        @keyframes lsGlowPulse { 0%,100%{box-shadow:0 0 30px 10px var(--glow)} 50%{box-shadow:0 0 50px 16px var(--glow)} }
        .ls-slider { -webkit-appearance:none; appearance:none; }
        .ls-slider::-webkit-slider-thumb { -webkit-appearance:none; appearance:none;
          width:22px; height:22px; border-radius:50%; background:#fff;
          box-shadow:0 2px 8px rgba(232,197,71,.5); cursor:pointer; border:none; }
        .ls-slider::-moz-range-thumb { width:22px; height:22px; border-radius:50%;
          background:#fff; box-shadow:0 2px 8px rgba(232,197,71,.5); cursor:pointer; border:none; }
        .ls-mood-tabs::-webkit-scrollbar { display:none; }
      `}</style>

      {/* ───── Hero overlay (extra content on top of hero) ───── */}
      <HeroOverlay selectedHex={isRainbow ? "#E8C547" : selected.hex} brightness={brightness} mode={mode} />

      {/* ───── SECTION 1 — Color Selection ───── */}
      <CardY borderColor={Y.primary} shadow="0 4px 20px rgba(232,197,71,0.12)">
        <SectionLabel jp="カラー選択" en="COLOR SELECTION" />

        {/* Mood title */}
        <div style={{ fontSize: 13, color: Y.ink, fontWeight: 500, marginTop: 4, marginBottom: 10 }}>
          {t("気分で選ぶ", "Choose by Mood")}
        </div>

        {/* Mood tabs */}
        <div
          className="ls-mood-tabs"
          style={{
            display: "flex", gap: 8, overflowX: "auto",
            scrollbarWidth: "none", marginBottom: 16, paddingBottom: 2,
          }}
        >
          {MOODS.map((m) => {
            const active = m.key === moodKey;
            return (
              <button
                key={m.key}
                onClick={() => setMoodKey(m.key)}
                style={{
                  flexShrink: 0,
                  padding: "8px 14px", borderRadius: 50,
                  background: active ? Y.primary : Y.soft,
                  color: active ? "#fff" : Y.text2,
                  fontSize: 12, fontWeight: 600,
                  border: "none", cursor: "pointer",
                  transition: "all 200ms ease",
                  whiteSpace: "nowrap",
                }}
              >
                {m.emoji} {t(m.jp, m.en)}
              </button>
            );
          })}
        </div>

        {/* Color palette grid */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4,1fr)",
          gap: 14, justifyItems: "center",
        }}>
          {mood.colors.map((c) => {
            const active = selected.hex === c.hex;
            return (
              <button
                key={c.hex + c.en}
                onClick={() => setSelected(c)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  gap: 4, background: "transparent", border: "none", cursor: "pointer",
                  padding: 0,
                }}
              >
                <span
                  style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: c.hex,
                    border: c.hex === "#FFFFFF" ? "1px solid #EADFD8" : "2px solid #fff",
                    boxShadow: active
                      ? `0 0 0 3px ${hexToRgba(c.hex, 0.5)}, 0 4px 12px ${hexToRgba(c.hex, 0.4)}`
                      : "0 2px 6px rgba(0,0,0,0.08)",
                    transition: "all 200ms ease",
                    transform: active ? "scale(1.08)" : "scale(1)",
                  }}
                />
                <span style={{ fontSize: 9, color: Y.text3, lineHeight: 1.2, textAlign: "center" }}>
                  {t(c.jp, c.en)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected color display */}
        <div
          className="flex items-center"
          style={{
            marginTop: 18, padding: "12px 16px", borderRadius: 16,
            background: Y.pale, gap: 12,
          }}
        >
          <span style={{
            width: 32, height: 32, borderRadius: "50%",
            background: selected.hex,
            border: "2px solid #fff",
            boxShadow: `0 0 12px ${hexToRgba(selected.hex, 0.5)}`,
            flexShrink: 0,
          }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: Y.text }}>
              {t(`${selected.jp} / ${selected.en}`, selected.en)}
            </div>
            <div style={{ fontSize: 11, color: Y.text3, fontFamily: "monospace", marginTop: 2 }}>
              {selected.hex.toUpperCase()}
            </div>
          </div>
          <button
            onClick={() => setAdvOpen(o => !o)}
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              color: Y.primary, fontSize: 11, fontWeight: 600,
            }}
          >
            {t("変更", "Change")}
          </button>
        </div>

        {/* Advanced */}
        <button
          onClick={() => setAdvOpen(o => !o)}
          className="flex items-center justify-between"
          style={{
            width: "100%", marginTop: 14, padding: "10px 4px",
            background: "transparent", border: "none", cursor: "pointer",
            fontSize: 12, color: Y.text2, fontWeight: 500,
          }}
        >
          <span>{t("詳細設定", "Advanced")}</span>
          {advOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {advOpen && (
          <div style={{ paddingTop: 4 }}>
            {/* Hue bar */}
            <div style={{ position: "relative", marginBottom: 14 }}>
              <div style={{
                height: 16, borderRadius: 50,
                background: "linear-gradient(90deg,#ff0000,#ffa500,#ffff00,#00ff00,#00ffff,#0000ff,#a020f0,#ff0000)",
                boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)",
              }} />
              <input
                type="range" min={0} max={360} value={hue}
                onChange={(e) => setHue(Number(e.target.value))}
                className="ls-slider"
                style={{ position: "absolute", inset: 0, width: "100%", height: 16, background: "transparent", margin: 0 }}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <MiniSlider
                label={t("明度", "Brightness")}
                value={bri} onChange={setBri}
                gradient={`linear-gradient(90deg,#000,hsl(${hue},${sat}%,50%))`}
              />
              <MiniSlider
                label={t("彩度", "Saturation")}
                value={sat} onChange={setSat}
                gradient={`linear-gradient(90deg,#999,hsl(${hue},100%,50%))`}
              />
            </div>
          </div>
        )}
      </CardY>

      {/* ───── SECTION 2 — Brightness ───── */}
      <CardY borderColor={Y.accent}>
        <SectionLabel jp="明るさ" en="BRIGHTNESS" />
        <div className="flex items-center" style={{ gap: 12, marginTop: 4 }}>
          <SunIcon size={14} color={Y.muted} />
          <div style={{ flex: 1, position: "relative" }}>
            <input
              type="range" min={0} max={100} value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="ls-slider"
              style={{
                width: "100%", height: 8, borderRadius: 50,
                background: `linear-gradient(90deg, ${Y.soft} 0%, ${Y.primary} ${brightness}%, ${Y.soft} ${brightness}%, ${Y.soft} 100%)`,
              }}
            />
          </div>
          <SunIcon size={20} color={Y.medium} />
          <span style={{ fontSize: 14, fontWeight: 600, color: Y.medium, minWidth: 40, textAlign: "right" }}>
            {brightness}%
          </span>
        </div>
      </CardY>

      {/* ───── SECTION 3 — Light Modes ───── */}
      <CardY borderColor={Y.accent}>
        <SectionLabel jp="ライトモード" en="LIGHT MODES" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 4 }}>
          <ModeCard active={mode === "steady"} onClick={() => setMode("steady")}
            label={t("常灯", "Steady")} sub={t("一定の光", "Constant light")}
            icon={<span style={{ display: "block", width: 24, height: 24, borderRadius: "50%", background: selected.hex, boxShadow: `0 0 8px ${hexToRgba(selected.hex, 0.5)}` }} />}
          />
          <ModeCard active={mode === "blink"} onClick={() => setMode("blink")}
            label={t("点滅", "Blink")} sub={t("フラッシュ", "Flash effect")}
            icon={<span style={{ display: "block", width: 24, height: 24, borderRadius: "50%", background: selected.hex, animation: "lsBlink .8s steps(1,end) infinite" }} />}
          />
          <ModeCard active={mode === "rainbow"} onClick={() => setMode("rainbow")}
            label={t("レインボー", "Rainbow")} sub={t("カラーサイクル", "Color cycle")}
            icon={
              <span style={{
                display: "block", width: 24, height: 24, borderRadius: "50%",
                background: "conic-gradient(#FF6B9D,#FFD700,#7FFFD4,#89C3EB,#9B72CF,#FF6B9D)",
                animation: "lsHueRot 3s linear infinite",
              }} />
            }
          />
          <ModeCard active={mode === "pulse"} onClick={() => setMode("pulse")}
            label={t("パルス", "Pulse")} sub={t("呼吸する光", "Breathing light")}
            icon={<span style={{ display: "block", width: 24, height: 24, borderRadius: "50%", background: selected.hex, animation: "lsPulse 1.5s ease-in-out infinite" }} />}
          />
        </div>
      </CardY>

      {/* ───── SECTION 4 — Preview ───── */}
      <div style={{
        background: "#1A1A2E", borderRadius: 24, padding: 24,
        marginBottom: 14, overflow: "hidden", position: "relative",
      }}>
        <div style={{
          fontSize: 11, color: "rgba(255,255,255,0.5)",
          letterSpacing: "0.1em", marginBottom: 18, textAlign: "center",
        }}>
          {t("プレビュー", "PREVIEW")}
        </div>

        {/* Dog silhouette with glowing collar */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
          <DogWithCollar
            color={selected.hex}
            isRainbow={isRainbow}
            mode={mode}
            brightness={brightness}
            displayBg={displayBg}
            glowRgba={glowRgba}
          />
        </div>

        <div style={{ textAlign: "center", color: "#fff", fontSize: 14, fontWeight: 600 }}>
          {isRainbow ? t("レインボー", "Rainbow") : t(`${selected.jp} / ${selected.en}`, selected.en)}
        </div>
        <div style={{
          textAlign: "center", color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 4,
        }}>
          {isRainbow ? "—" : selected.hex.toUpperCase()} · {brightness}% {t("明るさ", "brightness")}
        </div>

        <div className="flex items-center justify-center" style={{ gap: 8, marginTop: 14 }}>
          <Pill>🏠 {t("屋内", "Indoor")}</Pill>
          <Pill>🌙 {t("夜間", "Night mode")}</Pill>
        </div>
      </div>

      {/* ───── SECTION 5 — Set Color Button ───── */}
      <button style={{
        width: "100%", height: 52, borderRadius: 50,
        background: `linear-gradient(135deg, ${Y.medium}, ${Y.primary})`,
        color: "#fff", fontSize: 16, fontWeight: 600,
        border: "none", cursor: "pointer",
        boxShadow: "0 6px 20px rgba(232,197,71,0.4)",
      }}>
        {t("カラーを設定", "Set Color")}
      </button>
      <div style={{
        textAlign: "center", fontSize: 12, color: Y.text3, marginTop: 10, marginBottom: 10,
      }}>
        {t(`現在の設定: ${selected.jp} · ${brightness}%`, `Current: ${selected.en} · ${brightness}%`)}
      </div>
    </SensorPage>
  );
}

// ───────────── Hero Overlay (kanji + live + stats) ─────────────
function HeroOverlay({ selectedHex, brightness, mode }: { selectedHex: string; brightness: number; mode: Mode }) {
  const t = useT();
  const modeLabel = ({
    steady: { jp: "常灯", en: "Steady" },
    blink: { jp: "点滅", en: "Blink" },
    rainbow: { jp: "レインボー", en: "Rainbow" },
    pulse: { jp: "パルス", en: "Pulse" },
  } as const)[mode];

  return (
    <>
      {/* Floating kanji + decorative — rendered absolutely over hero by negative margin trick */}
      <div style={{ position: "relative", marginTop: -50, marginBottom: 6, pointerEvents: "none", height: 0 }}>
        <span aria-hidden style={{
          position: "absolute", right: -10, top: -110, fontSize: 140,
          color: "rgba(255,255,255,0.05)", fontWeight: 700, lineHeight: 1, userSelect: "none",
        }}>光</span>
      </div>

      {/* Glass stats card */}
      <div style={{
        background: "#fff", borderRadius: 20, padding: "14px 16px",
        marginBottom: 16, boxShadow: "0 12px 36px rgba(184,146,26,0.15)",
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr", alignItems: "center",
      }}>
        <StatCol label={t("カラー", "CURRENT")}>
          <span style={{
            display: "inline-block", width: 22, height: 22, borderRadius: "50%",
            background: selectedHex, border: "2px solid #fff",
            boxShadow: `0 0 8px ${hexToRgba(selectedHex, 0.5)}`,
          }} />
        </StatCol>
        <StatCol label={t("明るさ", "BRIGHTNESS")} divider>
          <span style={{ fontSize: 17, fontWeight: 700, color: Y.text }}>{brightness}%</span>
        </StatCol>
        <StatCol label={t("モード", "MODE")} divider>
          <span style={{ fontSize: 13, fontWeight: 600, color: Y.text }}>
            {t(modeLabel.jp, modeLabel.en)}
          </span>
        </StatCol>
      </div>
    </>
  );
}

function StatCol({ label, children, divider }: { label: string; children: React.ReactNode; divider?: boolean }) {
  return (
    <div style={{
      textAlign: "center", padding: "2px 8px",
      borderLeft: divider ? `1px solid ${Y.soft}` : "none",
    }}>
      <div style={{ fontSize: 9, color: Y.text3, letterSpacing: "0.1em", marginBottom: 6 }}>{label}</div>
      <div style={{ minHeight: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {children}
      </div>
    </div>
  );
}

// ───────────── Sub-components ─────────────
function CardY({ children, borderColor, shadow }: { children: React.ReactNode; borderColor: string; shadow?: string }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 20, padding: 20,
      marginBottom: 14, overflow: "hidden", boxSizing: "border-box",
      borderLeft: `4px solid ${borderColor}`,
      boxShadow: shadow ?? "0 2px 14px rgba(0,0,0,0.04)",
    }}>{children}</div>
  );
}

function SectionLabel({ jp, en }: { jp: string; en: string }) {
  const t = useT();
  return (
    <div className="flex items-center" style={{ gap: 6, marginBottom: 10 }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: Y.primary }} />
      <span style={{
        fontSize: 11, color: Y.primary, fontWeight: 700,
        letterSpacing: "0.08em", textTransform: "uppercase",
      }}>
        {t(jp, en)}
      </span>
    </div>
  );
}

function MiniSlider({ label, value, onChange, gradient }: {
  label: string; value: number; onChange: (v: number) => void; gradient: string;
}) {
  return (
    <div>
      <div style={{ fontSize: 11, color: Y.text2, marginBottom: 6 }}>{label}</div>
      <input
        type="range" min={0} max={100} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="ls-slider"
        style={{ width: "100%", height: 10, borderRadius: 50, background: gradient }}
      />
    </div>
  );
}

function ModeCard({ active, onClick, label, sub, icon }: {
  active: boolean; onClick: () => void; label: string; sub: string; icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        borderRadius: 16, padding: 14,
        background: active ? Y.soft : "#FAFAFA",
        border: active ? `1.5px solid ${Y.primary}` : "1.5px solid transparent",
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: 8, cursor: "pointer", transition: "all 200ms ease",
        boxSizing: "border-box",
      }}
    >
      <div style={{ height: 28, display: "flex", alignItems: "center" }}>{icon}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: Y.text }}>{label}</div>
      <div style={{ fontSize: 10, color: Y.text3, textAlign: "center", lineHeight: 1.3 }}>{sub}</div>
    </button>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      background: "rgba(255,255,255,0.1)", color: "#fff",
      borderRadius: 50, padding: "5px 12px", fontSize: 11, fontWeight: 500,
    }}>
      {children}
    </span>
  );
}

function SunIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" fill={color} />
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="2" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="22" y2="12" />
      <line x1="4.5" y1="4.5" x2="6.6" y2="6.6" />
      <line x1="17.4" y1="17.4" x2="19.5" y2="19.5" />
      <line x1="4.5" y1="19.5" x2="6.6" y2="17.4" />
      <line x1="17.4" y1="6.6" x2="19.5" y2="4.5" />
    </svg>
  );
}

function DogWithCollar({ color, isRainbow, mode, brightness, displayBg, glowRgba }: {
  color: string; isRainbow: boolean; mode: Mode; brightness: number; displayBg: string; glowRgba: string;
}) {
  const animation =
    mode === "blink" ? "lsBlink .8s steps(1,end) infinite" :
    mode === "pulse" ? "lsPulse 1.5s ease-in-out infinite" :
    mode === "rainbow" ? "lsHueRot 3s linear infinite" : "none";

  const glowAlpha = Math.max(0.25, brightness / 100);
  const glow = isRainbow ? `rgba(232,197,71,${glowAlpha})` : hexToRgba(color, glowAlpha);

  return (
    <div style={{ position: "relative", width: 140, height: 120 }}>
      {/* Simple dog silhouette */}
      <svg viewBox="0 0 140 120" width="140" height="120" fill="none"
        stroke="rgba(255,255,255,0.55)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* head */}
        <ellipse cx="70" cy="42" rx="26" ry="22" />
        {/* ears */}
        <path d="M50 28 L44 14 L56 22 Z" />
        <path d="M90 28 L96 14 L84 22 Z" />
        {/* snout */}
        <path d="M62 52 Q70 60 78 52" />
        <circle cx="70" cy="50" r="2" fill="rgba(255,255,255,0.7)" />
        {/* eyes */}
        <circle cx="62" cy="40" r="1.5" fill="rgba(255,255,255,0.7)" />
        <circle cx="78" cy="40" r="1.5" fill="rgba(255,255,255,0.7)" />
        {/* body suggestion */}
        <path d="M52 64 Q50 78 56 90" />
        <path d="M88 64 Q90 78 84 90" />
      </svg>

      {/* Collar — sits at neck */}
      <div
        style={{
          position: "absolute", left: "50%", top: 64,
          transform: "translateX(-50%)",
          width: 52, height: 14, borderRadius: 50,
          background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "visible",
        }}
      >
        {/* Glowing tag */}
        <div
          style={{
            width: 18, height: 18, borderRadius: "50%",
            background: displayBg,
            opacity: brightness / 100 * 0.7 + 0.3,
            ["--glow" as never]: glow,
            boxShadow: `0 0 30px 10px ${glow}`,
            animation: animation !== "none" ? animation : "lsGlowPulse 2.4s ease-in-out infinite",
          }}
        />
      </div>
      {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
      <span style={{ display: "none" }}>{glowRgba}</span>
    </div>
  );
}

// ───────────── helpers ─────────────
function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
