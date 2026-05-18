import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import AppShell from "@/components/AppShell";
import { useT } from "@/context/LanguageContext";
import { toast } from "sonner";

export const Route = createFileRoute("/light-sense")({ component: LightSensePage });

// ───────────── Palette ─────────────
const G = {
  primary: "#D4A843",
  medium: "#C49A30",
  deep: "#9E7A1A",
  soft: "#FEF8E1",
  pale: "#FFFCF0",
  accent: "#ECC95A",
  white: "#FFFFFF",
  text: "#1A1A2E",
  text2: "#6B7280",
  text3: "#9CA3AF",
  ink: "#4B5563",
};

// ───────────── Color utils ─────────────
function hslToHex(h: number, s: number, l: number) {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))))).toString(16).padStart(2, "0");
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}
function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
}
function hexToHsl(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn: h = (gn - bn) / d + (gn < bn ? 6 : 0); break;
      case gn: h = (bn - rn) / d + 2; break;
      case bn: h = (rn - gn) / d + 4; break;
    }
    h *= 60;
  }
  return { h, s: s * 100, l: l * 100 };
}

type NamedColor = { hex: string; jp: string; en: string };
const TRADITIONAL: NamedColor[] = [
  { hex: "#FFB7C5", jp: "桜", en: "Sakura" },
  { hex: "#9B8EC4", jp: "藤", en: "Fuji" },
  { hex: "#8DC47C", jp: "若草", en: "Wakakusa" },
  { hex: "#F6AD3B", jp: "山吹", en: "Yamabuki" },
  { hex: "#FFFFFF", jp: "白", en: "Shiro" },
  { hex: "#E8C547", jp: "金", en: "Kin" },
];
const FUNCTIONAL: (NamedColor & { emoji: string; sub: string })[] = [
  { hex: "#1A1A2E", jp: "夜間", en: "Night", emoji: "🌙", sub: "Night Vision" },
  { hex: "#DC2626", jp: "安全", en: "Safety", emoji: "🚨", sub: "Emergency" },
  { hex: "#3B82F6", jp: "冷青", en: "Cool", emoji: "💙", sub: "Cool Blue" },
  { hex: "#16A34A", jp: "穏緑", en: "Calm", emoji: "💚", sub: "Calm Green" },
  { hex: "#F59E0B", jp: "暖橙", en: "Warm", emoji: "🧡", sub: "Warm Amber" },
  { hex: "rainbow", jp: "虹", en: "Rainbow", emoji: "🌈", sub: "Cycle" },
];
function findName(hex: string): NamedColor | undefined {
  const u = hex.toUpperCase();
  return [...TRADITIONAL, ...FUNCTIONAL].find((c) => c.hex.toUpperCase() === u);
}

type Mode = "steady" | "blink" | "pulse" | "rainbow";
type Schedule = "night" | "walk" | "sleep" | null;
type Env = "indoor" | "outdoor";

// ───────────── Color Wheel ─────────────
function ColorWheel({
  size, color, onChange,
}: {
  size: number;
  color: string;
  onChange: (hex: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const ring = 45;
  const radius = size / 2;
  const trackR = radius - ring / 2;

  const { h } = hexToHsl(color);
  const rad = ((h - 90) * Math.PI) / 180; // visual: 0deg = top
  const ix = radius + Math.cos(rad) * trackR;
  const iy = radius + Math.sin(rad) * trackR;

  const pick = useCallback((cx: number, cy: number) => {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = cx - rect.left - radius;
    const y = cy - rect.top - radius;
    let ang = (Math.atan2(y, x) * 180) / Math.PI + 90;
    if (ang < 0) ang += 360;
    if (ang >= 360) ang -= 360;
    onChange(hslToHex(ang, 85, 55));
  }, [radius, onChange]);

  useEffect(() => {
    if (!dragging) return;
    const move = (e: PointerEvent) => pick(e.clientX, e.clientY);
    const up = () => setDragging(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
  }, [dragging, pick]);

  const thumbSize = dragging ? 22 : 18;

  return (
    <div
      ref={ref}
      onPointerDown={(e) => {
        setDragging(true);
        (e.target as Element).setPointerCapture?.(e.pointerId);
        pick(e.clientX, e.clientY);
      }}
      style={{
        position: "relative", width: size, height: size, borderRadius: "50%",
        background: `conic-gradient(from 0deg, #ff0000, #ffaa00, #ffff00, #aaff00, #00ff00, #00ffaa, #00ffff, #00aaff, #0000ff, #aa00ff, #ff00ff, #ff00aa, #ff0000)`,
        cursor: dragging ? "grabbing" : "grab", touchAction: "none",
        boxShadow: "inset 0 0 0 1px " + G.soft,
      }}
    >
      {/* mask center to ring */}
      <div style={{
        position: "absolute", inset: ring, borderRadius: "50%",
        background: G.white,
        boxShadow: "inset 0 0 0 1px " + G.soft + ", 0 4px 18px rgba(212,168,67,0.18)",
      }} />
      {/* center preview */}
      <div style={{
        position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
        width: 100, height: 100, borderRadius: "50%",
        background: G.white, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        pointerEvents: "none",
      }}>
        <div style={{
          width: 60, height: 60, borderRadius: "50%",
          background: color, boxShadow: `0 0 24px 4px ${color}66`,
          border: "2px solid #fff",
        }} />
        <div style={{ fontSize: 9, color: G.text3, marginTop: 6, letterSpacing: "0.05em" }}>{color}</div>
      </div>
      {/* thumb */}
      <div style={{
        position: "absolute", width: thumbSize, height: thumbSize, borderRadius: "50%",
        left: ix - thumbSize / 2, top: iy - thumbSize / 2,
        background: "#fff", border: `2px solid ${color}`,
        boxShadow: dragging
          ? "0 4px 14px rgba(0,0,0,0.25)"
          : "0 2px 8px rgba(0,0,0,0.15)",
        pointerEvents: "none",
        transition: "width 0.12s, height 0.12s",
      }} />
    </div>
  );
}

// ───────────── Page ─────────────
function LightSensePage() {
  const t = useT();
  const [color, setColor] = useState("#FFB7C5");
  const [saturation, setSaturation] = useState(85);
  const [brightness, setBrightness] = useState(75);
  const [mode, setMode] = useState<Mode>("steady");
  const [schedule, setSchedule] = useState<Schedule>(null);
  const [env, setEnv] = useState<Env>("outdoor");
  const [rainbow, setRainbow] = useState(false);

  const named = useMemo(() => findName(color), [color]);

  const selectColor = (hex: string) => {
    if (hex === "rainbow") { setRainbow(true); setMode("rainbow"); return; }
    setRainbow(false);
    setColor(hex);
  };

  const previewAnim =
    mode === "blink" ? "lsBlink 0.6s infinite" :
    mode === "pulse" ? "lsPulse 1.5s ease-in-out infinite" :
    mode === "rainbow" ? "lsHue 3s linear infinite" :
    "lsSteady 2s ease-in-out infinite";

  const cardBase: React.CSSProperties = {
    background: G.white, borderRadius: 22, padding: 20, overflow: "hidden",
    boxShadow: "0 4px 24px rgba(212,168,67,0.10)",
    borderLeft: `4px solid ${G.accent}`, boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    color: G.primary, fontSize: 11, letterSpacing: "0.08em", fontWeight: 700, marginBottom: 14,
  };

  return (
    <AppShell titleJp="ライトセンス" titleEn="LightSense AI" noPadding>
      <style>{`
        @keyframes lsBlink { 0%,100%{opacity:1} 50%{opacity:0.1} }
        @keyframes lsPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }
        @keyframes lsHue { 0%{filter:hue-rotate(0deg)} 100%{filter:hue-rotate(360deg)} }
        @keyframes lsSteady { 0%,100%{opacity:1} 50%{opacity:0.92} }
        @keyframes lsRay { 0%,100%{opacity:0.05} 50%{opacity:0.12} }
      `}</style>

      <div style={{ background: G.pale, minHeight: "100%", paddingBottom: 120, boxSizing: "border-box", position: "relative" }}>
        {/* HERO */}
        <div style={{
          position: "relative", height: 160, padding: 20,
          background: "linear-gradient(135deg, #9E7A1A 0%, #C49A30 55%, #D4A843 100%)",
          borderBottomLeftRadius: 28, borderBottomRightRadius: 28, overflow: "hidden",
          color: "#fff", boxSizing: "border-box",
        }}>
          {/* light rays */}
          <svg style={{ position: "absolute", right: -40, top: -40, width: 280, height: 280, pointerEvents: "none" }} viewBox="0 0 280 280">
            {Array.from({ length: 6 }).map((_, i) => {
              const angle = 90 + i * 18;
              const rad = (angle * Math.PI) / 180;
              return (
                <line key={i} x1={40} y1={40} x2={40 + Math.cos(rad) * 280} y2={40 + Math.sin(rad) * 280}
                  stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
              );
            })}
          </svg>
          <div style={{
            position: "absolute", right: -10, top: -30, fontSize: 140, opacity: 0.05,
            color: "#fff", fontWeight: 900, lineHeight: 1, pointerEvents: "none",
          }}>光</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 600 }}>LightSense AI</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 4 }}>
                {t("カラーライト制御", "Collar Light Control")}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "rgba(255,255,255,0.18)", padding: "4px 10px", borderRadius: 50,
                fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80" }} />
                LIVE
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", marginTop: 6 }}>
                {t("ライト作動中", "Light active")}
              </div>
            </div>
          </div>
        </div>

        {/* Floating glass stats */}
        <div style={{ padding: "0 16px", marginTop: -34 }}>
          <div style={{
            background: "rgba(255,255,255,0.94)", backdropFilter: "blur(20px)",
            borderRadius: 22, padding: 16,
            boxShadow: "0 16px 40px rgba(158,122,26,0.18)",
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
            boxSizing: "border-box",
          }}>
            {[
              {
                k: t("カラー", "CURRENT"),
                v: <div style={{
                  width: 30, height: 30, borderRadius: "50%", background: color, margin: "0 auto",
                  boxShadow: `0 0 12px ${color}80`, border: "2px solid #fff",
                }} />,
              },
              { k: t("明るさ", "BRIGHTNESS"), v: <div style={{ fontSize: 20, fontWeight: 700, color: G.primary }}>{brightness}%</div> },
              { k: t("モード", "MODE"), v: <div style={{ fontSize: 13, fontWeight: 600, color: G.text, textTransform: "capitalize" }}>{mode}</div> },
            ].map((c, i) => (
              <div key={i} style={{ textAlign: "center", borderLeft: i ? `1px solid ${G.soft}` : "none" }}>
                <div style={{ fontSize: 9, letterSpacing: "0.12em", color: G.text3, fontWeight: 700, marginBottom: 8 }}>{c.k}</div>
                <div style={{ height: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>{c.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* CARD 1: Color Wheel */}
          <div style={{ ...cardBase, borderLeft: `4px solid ${G.primary}`, padding: 20 }}>
            <div style={labelStyle}>● {t("カラー選択", "COLOR SELECT")}</div>
            <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 16px" }}>
              <ColorWheel size={220} color={color} onChange={setColor} />
            </div>
            {/* Saturation slider */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 10, color: G.text3 }}>{t("彩度", "Saturation")}</span>
                <span style={{ fontSize: 11, color: G.primary, fontWeight: 600 }}>{saturation}%</span>
              </div>
              <div style={{
                position: "relative", height: 22, display: "flex", alignItems: "center",
              }}>
                <div style={{
                  position: "absolute", left: 0, right: 0, height: 12, borderRadius: 50,
                  background: `linear-gradient(to right, #fff, ${color})`,
                  border: `1px solid ${G.soft}`,
                }} />
                <input type="range" min={0} max={100} value={saturation}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setSaturation(v);
                    const { h } = hexToHsl(color);
                    setColor(hslToHex(h, v, 55));
                  }}
                  className="ls-slider"
                  style={{ position: "relative", width: "100%", appearance: "none", background: "transparent", height: 22, zIndex: 2, margin: 0 }} />
              </div>
            </div>
          </div>

          {/* CARD 2: Quick Color Presets */}
          <div style={cardBase}>
            <div style={labelStyle}>● {t("クイックカラー", "QUICK COLORS")}</div>

            <div style={{ fontSize: 10, color: G.text3, marginBottom: 10, fontWeight: 600 }}>
              {t("和の色", "Japanese Traditional")}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8, marginBottom: 18 }}>
              {TRADITIONAL.map((c) => {
                const active = c.hex.toUpperCase() === color.toUpperCase();
                return (
                  <button key={c.hex} onClick={() => selectColor(c.hex)}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                      background: "transparent", border: "none", cursor: "pointer", padding: 0,
                    }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%", background: c.hex,
                      border: active ? "2px solid #fff" : `1px solid ${G.soft}`,
                      boxShadow: active ? `0 0 0 2px ${G.primary}, 0 4px 12px ${c.hex}66` : "0 2px 8px rgba(0,0,0,0.08)",
                      transform: active ? "scale(1.08)" : "scale(1)",
                      transition: "transform 0.15s, box-shadow 0.15s",
                    }} />
                    <div style={{ fontSize: 10, color: G.text3, lineHeight: 1.1, textAlign: "center" }}>{c.jp}</div>
                  </button>
                );
              })}
            </div>

            <div style={{ fontSize: 10, color: G.text3, marginBottom: 10, fontWeight: 600 }}>
              {t("機能カラー", "Functional & Safety")}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
              {FUNCTIONAL.map((c) => {
                const active = c.hex === "rainbow" ? rainbow : c.hex.toUpperCase() === color.toUpperCase();
                const isRainbow = c.hex === "rainbow";
                return (
                  <button key={c.hex} onClick={() => selectColor(c.hex)}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                      background: "transparent", border: "none", cursor: "pointer", padding: 0,
                    }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%",
                      background: isRainbow
                        ? "conic-gradient(red, orange, yellow, lime, cyan, blue, magenta, red)"
                        : c.hex,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 18,
                      border: active ? "2px solid #fff" : `1px solid ${G.soft}`,
                      boxShadow: active ? `0 0 0 2px ${G.primary}, 0 4px 12px rgba(0,0,0,0.18)` : "0 2px 8px rgba(0,0,0,0.08)",
                      transform: active ? "scale(1.08)" : "scale(1)",
                      transition: "transform 0.15s",
                    }}>{c.emoji}</div>
                    <div style={{ fontSize: 9, color: G.text3, lineHeight: 1.1, textAlign: "center" }}>{c.jp}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CARD 3: Light Modes */}
          <div style={cardBase}>
            <div style={labelStyle}>● {t("ライトモード", "LIGHT MODES")}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {([
                { k: "steady", jp: "常灯", en: "Steady", sub: t("一定の光", "Constant light"), anim: "lsSteady 2s ease-in-out infinite" },
                { k: "blink", jp: "点滅", en: "Blink", sub: t("注意を引く", "Get attention"), anim: "lsBlink 0.6s infinite" },
                { k: "pulse", jp: "パルス", en: "Pulse", sub: t("呼吸する光", "Breathing light"), anim: "lsPulse 1.5s ease-in-out infinite" },
                { k: "rainbow", jp: "レインボー", en: "Rainbow", sub: t("カラーサイクル", "Color cycle"), anim: "lsHue 3s linear infinite" },
              ] as const).map((m) => {
                const active = mode === m.k;
                return (
                  <button key={m.k} onClick={() => setMode(m.k as Mode)}
                    style={{
                      borderRadius: 16, padding: 16, textAlign: "center", cursor: "pointer",
                      background: active ? G.soft : "#FAFAFA",
                      border: active ? `2px solid ${G.primary}` : "2px solid transparent",
                      transition: "all 0.2s",
                    }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 8, height: 30, alignItems: "center" }}>
                      <span style={{
                        display: "block", width: 18, height: 18, borderRadius: "50%",
                        background: m.k === "rainbow"
                          ? "conic-gradient(red, yellow, lime, cyan, blue, magenta, red)"
                          : G.primary,
                        boxShadow: m.k === "steady" ? `0 0 12px ${G.primary}80` : "none",
                        animation: m.anim,
                      }} />
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: G.text }}>{m.jp} / {m.en}</div>
                    <div style={{ fontSize: 10, color: G.text3, marginTop: 2 }}>{m.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CARD 4: Brightness & Schedule */}
          <div style={cardBase}>
            <div style={labelStyle}>● {t("明るさ", "BRIGHTNESS")}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
              <span style={{ color: "#F5DFA0", fontSize: 14 }}>🌅</span>
              <div style={{ flex: 1, position: "relative", height: 22, display: "flex", alignItems: "center" }}>
                <div style={{
                  position: "absolute", left: 0, right: 0, height: 10, borderRadius: 50,
                  background: `linear-gradient(to right, ${G.soft}, ${G.primary})`,
                }} />
                <input type="range" min={0} max={100} value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="ls-slider"
                  style={{ position: "relative", width: "100%", appearance: "none", background: "transparent", height: 22, zIndex: 2, margin: 0 }} />
              </div>
              <span style={{ color: G.primary, fontSize: 18 }}>☀️</span>
              <div style={{ minWidth: 40, textAlign: "right", color: G.primary, fontSize: 13, fontWeight: 700 }}>{brightness}%</div>
            </div>

            <div style={{ ...labelStyle, marginBottom: 10 }}>● {t("自動スケジュール", "AUTO SCHEDULE")}</div>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
              {([
                { k: "night", emoji: "🌙", jp: "夜間モード", en: "Night Mode", time: "19:00-07:00" },
                { k: "walk", emoji: "🚶", jp: "散歩モード", en: "Walk Mode", time: "07-09, 17-19" },
                { k: "sleep", emoji: "😴", jp: "おやすみ", en: "Sleep", time: "22:00-06:00" },
              ] as const).map((s) => {
                const active = schedule === s.k;
                return (
                  <button key={s.k}
                    onClick={() => setSchedule(active ? null : (s.k as Schedule))}
                    style={{
                      flexShrink: 0, padding: "8px 14px", borderRadius: 50, cursor: "pointer",
                      background: active ? G.soft : "#FAFAFA",
                      border: active ? `1.5px solid ${G.primary}` : "1.5px solid transparent",
                      color: active ? G.primary : G.text3, fontSize: 12, fontWeight: 600,
                      display: "inline-flex", alignItems: "center", gap: 6, transition: "all 0.2s",
                    }}>
                    <span>{s.emoji}</span>
                    <span>{s.jp} / {s.en}</span>
                    <span style={{ fontSize: 10, opacity: 0.7 }}>{s.time}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CARD 5: Collar Preview */}
          <div style={{
            borderRadius: 24, padding: 24, background: "#1A1A2E", overflow: "hidden", boxSizing: "border-box",
          }}>
            <div style={{
              color: "rgba(255,255,255,0.5)", fontSize: 11, letterSpacing: "0.1em",
              fontWeight: 700, textAlign: "center", marginBottom: 20,
            }}>{t("プレビュー", "PREVIEW")}</div>

            <div style={{ display: "flex", justifyContent: "center", padding: "16px 0 24px" }}>
              <div style={{
                width: 160, height: 160, borderRadius: "50%",
                background: "radial-gradient(circle, #2a2a44 0%, #1A1A2E 70%)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{
                  width: 120, height: 120, borderRadius: "50%",
                  border: `8px solid ${color}`,
                  background: "transparent",
                  opacity: 0.4 + (brightness / 100) * 0.6 * (env === "indoor" ? 0.7 : 1),
                  boxShadow: `0 0 30px 10px ${color}99, 0 0 60px 20px ${color}44, inset 0 0 20px ${color}55`,
                  animation: previewAnim,
                }} />
              </div>
            </div>

            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>
                {named ? `${named.jp} / ${named.en}` : t("カスタム", "Custom")}
              </div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 4 }}>
                {color} · {brightness}%
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              {([
                { k: "indoor", label: `🏠 ${t("屋内", "Indoor")}` },
                { k: "outdoor", label: `🌙 ${t("屋外", "Outdoor")}` },
              ] as const).map((e) => (
                <button key={e.k} onClick={() => setEnv(e.k as Env)}
                  style={{
                    padding: "6px 14px", borderRadius: 50, fontSize: 11, cursor: "pointer",
                    background: env === e.k ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)",
                    color: env === e.k ? "#fff" : "rgba(255,255,255,0.55)",
                    border: "none",
                  }}>{e.label}</button>
              ))}
            </div>
          </div>

          {/* CARD 6: Safety Tips */}
          <div style={{ ...cardBase, background: "#FFFDF5" }}>
            <div style={labelStyle}>● {t("安全性ヒント", "SAFETY TIPS")}</div>
            {[
              { emoji: "🌙", text: t("夜間は明るさ80%以上を推奨", "80%+ brightness recommended for night walks") },
              { emoji: "🚗", text: t("車の多いエリアでは点滅モードを使用", "Use blink mode in high traffic areas") },
              { emoji: "🔋", text: t("常灯より点滅の方が電池長持ち", "Blink mode saves battery vs steady") },
            ].map((tip, i, arr) => (
              <div key={i} style={{
                display: "flex", gap: 12, alignItems: "center", padding: "12px 0",
                borderBottom: i < arr.length - 1 ? `1px solid ${G.soft}` : "none",
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", background: G.soft,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, flexShrink: 0,
                }}>{tip.emoji}</div>
                <div style={{ fontSize: 12, color: G.ink, lineHeight: 1.4 }}>{tip.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Fixed Set Color button */}
        <div style={{
          position: "sticky", bottom: 16, padding: "0 16px", marginTop: 0,
        }}>
          <button
            onClick={() => toast.success(t("設定完了！", "Color set!"))}
            style={{
              width: "100%", height: 52, borderRadius: 50, border: "none",
              background: `linear-gradient(135deg, ${G.medium}, ${G.primary})`,
              color: "#fff", fontSize: 16, fontWeight: 600, cursor: "pointer",
              boxShadow: "0 6px 20px rgba(212,168,67,0.4)",
            }}>
            {t("カラーを設定", "Set Color")}
          </button>
        </div>
      </div>

      <style>{`
        .ls-slider::-webkit-slider-thumb {
          appearance: none; width: 22px; height: 22px; border-radius: 50%;
          background: #fff; cursor: pointer;
          box-shadow: 0 2px 8px rgba(212,168,67,0.5);
          border: 2px solid ${G.primary};
        }
        .ls-slider::-moz-range-thumb {
          width: 22px; height: 22px; border-radius: 50%; background: #fff;
          box-shadow: 0 2px 8px rgba(212,168,67,0.5); border: 2px solid ${G.primary};
        }
      `}</style>
    </AppShell>
  );
}
