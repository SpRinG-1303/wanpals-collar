import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { SensorPage, Card, SP, Bi } from "@/components/SensorPage";
import { useT } from "@/context/LanguageContext";

export const Route = createFileRoute("/light-sense")({ component: LightSensePage });

const PRESETS: { jp: string; en: string; hex: string }[] = [
  { jp: "白", en: "White", hex: "#FFFFFF" },
  { jp: "桜", en: "Sakura", hex: "#E8829A" },
  { jp: "藤", en: "Lavender", hex: "#B9A8D4" },
  { jp: "空", en: "Sky", hex: "#9CC4E4" },
  { jp: "若葉", en: "Mint", hex: "#9CC4A8" },
  { jp: "山吹", en: "Gold", hex: "#E8C46A" },
  { jp: "珊瑚", en: "Coral", hex: "#F19A8E" },
  { jp: "紫", en: "Deep Purple", hex: "#6E5AA8" },
];

const ROSE = "#E8829A";

function LightSensePage() {
  const [hue, setHue] = useState(340); // 0-360
  const [sat, setSat] = useState(60); // 0-100
  const [val, setVal] = useState(85); // 0-100
  const [brightness, setBrightness] = useState(75);
  const [rainbow, setRainbow] = useState(false);
  const [blink, setBlink] = useState(false);
  const sbRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const t = useT();

  const color = hsvToHex(hue, sat, val);
  const rgb = hexToRgb(color);

  const handleSB = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    const el = sbRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const point = "touches" in e ? (e as TouchEvent).touches[0] : (e as MouseEvent);
    if (!point) return;
    const x = Math.max(0, Math.min(rect.width, point.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, point.clientY - rect.top));
    setSat(Math.round((x / rect.width) * 100));
    setVal(Math.round((1 - y / rect.height) * 100));
    setRainbow(false);
  };

  useEffect(() => {
    const move = (e: MouseEvent | TouchEvent) => { if (draggingRef.current) { e.preventDefault?.(); handleSB(e); } };
    const up = () => { draggingRef.current = false; };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };
  }, []);


  const displayColor = rainbow
    ? "linear-gradient(90deg,#F19A9A,#E8C46A,#9CC4A8,#9CC4E4,#B9A8D4,#E8829A)"
    : color;
  const glowColor = rainbow ? "#E8829A" : color;

  return (
    <SensorPage
      titleJp="ライトセンス"
      titleEn="Collar Light Control"
      headerGradient="linear-gradient(135deg,#FFE8EE 0%,#FFF2F5 60%,#FFF8F4 100%)"
      accent={ROSE}
    >
      <style>{`
        @keyframes lsGlow {
          0%,100% { box-shadow: 0 0 24px var(--g), 0 0 48px var(--g); opacity: .85; }
          50% { box-shadow: 0 0 36px var(--g), 0 0 80px var(--g); opacity: 1; }
        }
        @keyframes lsBlink {
          0%,49% { opacity: 1; }
          50%,100% { opacity: 0.2; }
        }
        .ls-slider {
          -webkit-appearance: none; appearance: none;
        }
        .ls-slider::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 20px; height: 20px; border-radius: 50%;
          background: #fff; border: 2px solid ${ROSE};
          box-shadow: 0 2px 6px rgba(232,130,154,0.4); cursor: pointer;
        }
        .ls-slider::-moz-range-thumb {
          width: 20px; height: 20px; border-radius: 50%;
          background: #fff; border: 2px solid ${ROSE};
          box-shadow: 0 2px 6px rgba(232,130,154,0.4); cursor: pointer;
        }
      `}</style>

      {/* Color picker card */}
      <CardSoft>
        <Label jp="カラー選択" en="Color Select" />

        {/* Hue slider */}
        <div style={{ marginTop: 14, position: "relative" }}>
          <div style={{
            height: 20, borderRadius: 999,
            background: "linear-gradient(90deg,#ff0000,#ffa500,#ffff00,#00ff00,#00ffff,#0000ff,#a020f0,#ff0000)",
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)",
          }} />
          <input
            type="range" min={0} max={360} value={hue}
            onChange={(e) => { setHue(Number(e.target.value)); setRainbow(false); }}
            className="ls-slider ls-hue"
            style={{
              position: "absolute", inset: 0, width: "100%", height: 20,
              background: "transparent", margin: 0, padding: 0,
            }}
          />
        </div>

        {/* Saturation / Brightness box */}
        <div
          ref={sbRef}
          onMouseDown={(e) => { draggingRef.current = true; handleSB(e.nativeEvent); }}
          onTouchStart={(e) => { draggingRef.current = true; handleSB(e.nativeEvent); }}
          style={{
            position: "relative", width: "100%", aspectRatio: "1 / 1",
            marginTop: 14, borderRadius: 14, overflow: "hidden",
            background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))`,
            cursor: "crosshair", touchAction: "none",
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{
            position: "absolute",
            left: `${sat}%`, top: `${100 - val}%`,
            transform: "translate(-50%,-50%)",
            width: 18, height: 18, borderRadius: "50%",
            border: "2px solid #fff", boxShadow: "0 0 0 1px rgba(0,0,0,0.25), 0 2px 6px rgba(0,0,0,0.3)",
            background: color, pointerEvents: "none",
          }} />
        </div>

        {/* Selected color preview */}
        <div style={{
          marginTop: 14, display: "flex", alignItems: "center", gap: 12,
          padding: "10px 14px", borderRadius: 14, background: "#FAF7F5",
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: rainbow
              ? "linear-gradient(90deg,#F19A9A,#E8C46A,#9CC4A8,#9CC4E4,#B9A8D4,#E8829A)"
              : color,
            boxShadow: `0 0 14px ${(rainbow ? "#E8829A" : color)}66`,
            transition: "background 0.25s",
            border: "2px solid #fff",
          }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: SP.usuzumi, letterSpacing: "0.12em" }}>
              {t("選択中", "SELECTED")}
            </div>
            <div style={{ fontSize: 13, color: SP.sumi, fontFamily: "monospace", fontWeight: 600, marginTop: 2 }}>
              {rainbow ? t("レインボー", "RAINBOW") : color.toUpperCase()}
            </div>
            <div style={{ fontSize: 10, color: SP.usuzumi, fontFamily: "monospace", marginTop: 1 }}>
              {rainbow ? "—" : `RGB ${rgb.r}, ${rgb.g}, ${rgb.b}`}
            </div>
          </div>
        </div>
      </CardSoft>

      {/* Quick colors */}
      <CardSoft>
        <Label jp="クイックカラー" en="Quick Colors" />
        <div className="flex items-center justify-between" style={{ marginTop: 14 }}>
          {PRESETS.map((p) => {
            const active = !rainbow && color.toUpperCase() === p.hex.toUpperCase();
            return (
              <button
                key={p.en}
                aria-label={p.en}
                onClick={() => {
                  const hsv = hexToHsv(p.hex);
                  setHue(hsv.h); setSat(hsv.s); setVal(hsv.v);
                  setRainbow(false);
                }}
                style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: p.hex,
                  border: p.hex === "#FFFFFF" ? "1px solid #EADFD8" : "none",
                  outline: active ? `2px solid ${ROSE}` : "2px solid transparent",
                  outlineOffset: 2,
                  boxShadow: active
                    ? `0 0 14px ${p.hex}66`
                    : "0 2px 6px rgba(0,0,0,0.08)",
                  cursor: "pointer", padding: 0,
                  transition: "transform 0.15s",
                  transform: active ? "scale(1.08)" : "scale(1)",
                }}
              />
            );
          })}
        </div>
      </CardSoft>

      {/* Brightness */}
      <CardSoft>
        <div className="flex items-center justify-between">
          <Bi
            jp="明るさ" en="Brightness"
            jpStyle={{ fontSize: 12, color: SP.usuzumi, fontWeight: 500 }}
            enStyle={{ fontSize: 11, color: SP.usuzumi, fontWeight: 500 }}
          />
          <span style={{ fontSize: 13, color: SP.sumi, fontVariantNumeric: "tabular-nums", fontWeight: 500 }}>
            {brightness}%
          </span>
        </div>
        <input
          type="range" min={0} max={100} value={brightness}
          onChange={(e) => setBrightness(Number(e.target.value))}
          className="ls-slider"
          style={{
            width: "100%", height: 6, borderRadius: 999, marginTop: 14,
            background: `linear-gradient(90deg, #FFD1DC 0%, ${ROSE} ${brightness}%, #F5EAEE ${brightness}%, #F5EAEE 100%)`,
          }}
        />
      </CardSoft>

      {/* Toggles */}
      <CardSoft>
        <ToggleRow
          icon={<Sparkles size={16} style={{ color: ROSE }} />}
          jp="点滅" en="Blink Mode"
          on={blink} onChange={setBlink}
        />
        <div style={{ height: 1, background: "#F5EAEE", margin: "14px 0" }} />
        <ToggleRow
          icon={
            <span style={{
              display: "inline-block", width: 16, height: 16, borderRadius: "50%",
              background: "conic-gradient(#F19A9A,#E8C46A,#9CC4A8,#9CC4E4,#B9A8D4,#E8829A,#F19A9A)",
            }} />
          }
          jp="レインボー" en="Rainbow Mode"
          on={rainbow} onChange={setRainbow}
        />
      </CardSoft>

      {/* Preview */}
      <div style={{
        background: "#1A1A2E", borderRadius: 20, padding: "22px 16px",
        marginBottom: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        textAlign: "center",
      }}>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: "0.14em", marginBottom: 14 }}>
          {t("プレビュー / PREVIEW", "PREVIEW")}
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <CollarTag color={displayColor} glow={glowColor} brightness={brightness} blink={blink} />
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>
          {t("首輪ライト", "Collar Light")}
        </div>
      </div>

      {/* Set button */}
      <div className="flex justify-center" style={{ marginTop: 4, marginBottom: 8 }}>
        <button
          style={{
            padding: "14px 36px", borderRadius: 999,
            background: "linear-gradient(135deg,#E8829A,#F19AA8)",
            color: "#fff", fontSize: 14, fontWeight: 600,
            boxShadow: "0 6px 18px rgba(232,130,154,0.35)",
            letterSpacing: "0.04em",
          }}
        >
          {t("カラーを設定", "Set Color")}
        </button>
      </div>
    </SensorPage>
  );
}

function CardSoft({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: "#FFFFFF", borderRadius: 20, padding: 18,
      marginBottom: 14, boxShadow: "0 2px 14px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)",
    }}>{children}</div>
  );
}

function Label({ jp, en }: { jp: string; en: string }) {
  const t = useT();
  return (
    <div style={{ fontSize: 11, color: ROSE, fontWeight: 600, letterSpacing: "0.08em" }}>
      {t(`${jp} / ${en}`, en.toUpperCase())}
    </div>
  );
}

function ToggleRow({ icon, jp, en, on, onChange }: {
  icon: React.ReactNode; jp: string; en: string; on: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center" style={{ gap: 12 }}>
      <div style={{
        width: 32, height: 32, borderRadius: 10, background: "#FDF4F7",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <Bi
          jp={jp} en={en}
          jpStyle={{ fontSize: 13, fontWeight: 600, color: SP.sumi }}
          enStyle={{ fontSize: 12, fontWeight: 500, color: SP.sumi }}
        />
      </div>
      <button
        onClick={() => onChange(!on)}
        aria-pressed={on}
        style={{
          width: 44, height: 26, borderRadius: 999, position: "relative",
          background: on ? ROSE : "#EADFD8", transition: "background 0.2s",
          border: "none", padding: 0, cursor: "pointer",
        }}
      >
        <span style={{
          position: "absolute", top: 3, left: on ? 21 : 3,
          width: 20, height: 20, borderRadius: "50%", background: "#fff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.18)", transition: "left 0.2s",
        }} />
      </button>
    </div>
  );
}

function CollarTag({ color, glow, brightness, blink }: {
  color: string; glow: string; brightness: number; blink: boolean;
}) {
  return (
    <div style={{ position: "relative", width: 96, height: 96 }}>
      {/* outer ring (collar) */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        border: "2px solid rgba(255,255,255,0.18)",
      }} />
      {/* glowing tag */}
      <div
        style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 44, height: 44, borderRadius: "50%",
          background: color,
          opacity: brightness / 100,
          ["--g" as never]: `${glow}cc`,
          animation: blink
            ? "lsBlink 0.9s steps(1,end) infinite"
            : "lsGlow 2.4s ease-in-out infinite",
        }}
      />
    </div>
  );
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const c = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return Math.round(c * 255).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
