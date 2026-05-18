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
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}
function hexToHsl(hex: string): { h: number; s: number; l: number } {
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

// Named colors
const NAMED: { hex: string; jp: string; en: string }[] = [
  { hex: "#FFFFFF", jp: "白", en: "White" },
  { hex: "#EF4444", jp: "赤", en: "Red" },
  { hex: "#3B82F6", jp: "青", en: "Blue" },
  { hex: "#10B981", jp: "緑", en: "Green" },
  { hex: "#F59E0B", jp: "黄", en: "Yellow" },
  { hex: "#8B5CF6", jp: "紫", en: "Purple" },
  { hex: "#FFB7C5", jp: "桜", en: "Sakura" },
  { hex: "#9B8EC4", jp: "藤", en: "Fuji" },
  { hex: "#8DC47C", jp: "若草", en: "Wakakusa" },
  { hex: "#E8C547", jp: "金", en: "Kin" },
  { hex: "#C0C0C0", jp: "銀", en: "Gin" },
  { hex: "#1A1A2E", jp: "漆黒", en: "Shikkoku" },
];
function findName(hex: string) {
  const u = hex.toUpperCase();
  return NAMED.find((n) => n.hex.toUpperCase() === u);
}

type Mode = "steady" | "blink" | "pulse" | "rainbow";
type Scene = "indoor" | "night" | "party" | "emergency";

// ───────────── Color Wheel ─────────────
function ColorWheel({
  size,
  color,
  onChange,
}: {
  size: number;
  color: string;
  onChange: (hex: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const radius = size / 2;

  // derive indicator pos from current color
  const { h, s } = hexToHsl(color);
  const rad = (h * Math.PI) / 180;
  const dist = Math.min(s / 100, 1) * (radius - 14);
  const ix = radius + Math.cos(rad) * dist;
  const iy = radius + Math.sin(rad) * dist;

  const handleAt = useCallback((cx: number, cy: number) => {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = cx - rect.left - radius;
    const y = cy - rect.top - radius;
    const d = Math.sqrt(x * x + y * y);
    const maxR = radius - 4;
    const sat = Math.min(d / maxR, 1) * 100;
    let ang = (Math.atan2(y, x) * 180) / Math.PI;
    if (ang < 0) ang += 360;
    onChange(hslToHex(ang, sat, 50));
  }, [radius, onChange]);

  useEffect(() => {
    const move = (e: PointerEvent) => { if (dragging.current) handleAt(e.clientX, e.clientY); };
    const up = () => { dragging.current = false; };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
  }, [handleAt]);

  return (
    <div
      ref={ref}
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as Element).setPointerCapture?.(e.pointerId);
        handleAt(e.clientX, e.clientY);
      }}
      style={{
        position: "relative", width: size, height: size, borderRadius: "50%",
        background: `conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)`,
        cursor: "crosshair", touchAction: "none",
        boxShadow: "0 6px 24px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(0,0,0,0.04)",
      }}
    >
      {/* center white saturation gradient */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: "radial-gradient(circle at center, #fff 0%, rgba(255,255,255,0.85) 18%, rgba(255,255,255,0) 65%)",
        pointerEvents: "none",
      }} />
      {/* indicator */}
      <div style={{
        position: "absolute", width: 24, height: 24, borderRadius: "50%",
        left: ix - 12, top: iy - 12,
        background: color, border: "2px solid #fff",
        boxShadow: "0 0 0 2px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.25)",
        pointerEvents: "none", transition: dragging.current ? "none" : "left 0.15s, top 0.15s",
      }} />
    </div>
  );
}

// ───────────── Page ─────────────
function LightSensePage() {
  const t = useT();
  const [color, setColor] = useState("#FFB7C5");
  const [brightness, setBrightness] = useState(75);
  const [mode, setMode] = useState<Mode>("steady");
  const [scene, setScene] = useState<Scene>("indoor");

  const named = useMemo(() => findName(color), [color]);
  const rgb = useMemo(() => hexToRgb(color), [color]);

  const applyScene = (s: Scene) => {
    setScene(s);
    if (s === "indoor") { setColor("#FFF5E1"); setBrightness(60); setMode("steady"); }
    else if (s === "night") { setColor("#FFFFFF"); setBrightness(100); setMode("steady"); }
    else if (s === "party") { setColor("#F472B6"); setBrightness(80); setMode("rainbow"); }
    else { setColor("#EF4444"); setBrightness(100); setMode("blink"); }
    toast.success(t("シーン適用", "Scene applied"));
  };

  // mode anim styles for preview
  const previewAnim =
    mode === "blink" ? "lsBlink 0.8s infinite" :
    mode === "pulse" ? "lsPulse 1.5s ease-in-out infinite" :
    mode === "rainbow" ? "lsHue 3s linear infinite" : "none";

  const cardBase: React.CSSProperties = {
    background: G.white, borderRadius: 22, padding: 20, overflow: "hidden",
    boxShadow: "0 4px 24px rgba(212,168,67,0.12)", borderLeft: `4px solid ${G.accent}`,
    boxSizing: "border-box",
  };
  const label: React.CSSProperties = {
    color: G.primary, fontSize: 11, letterSpacing: "0.08em", fontWeight: 700, marginBottom: 14,
  };

  return (
    <AppShell titleJp="ライトセンス" titleEn="LightSense AI" noPadding>
      <style>{`
        @keyframes lsBlink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        @keyframes lsPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.2)} }
        @keyframes lsHue { 0%{filter:hue-rotate(0deg)} 100%{filter:hue-rotate(360deg)} }
      `}</style>

      <div style={{ background: G.pale, minHeight: "100%", paddingBottom: 110, boxSizing: "border-box" }}>
        {/* HERO */}
        <div style={{
          position: "relative", height: 160, padding: 20,
          background: "linear-gradient(135deg, #9E7A1A 0%, #C49A30 55%, #D4A843 100%)",
          borderBottomLeftRadius: 28, borderBottomRightRadius: 28, overflow: "hidden",
          color: "#fff", boxSizing: "border-box",
        }}>
          <div style={{
            position: "absolute", right: -10, top: -30, fontSize: 140, opacity: 0.05,
            color: "#fff", fontWeight: 900, lineHeight: 1, pointerEvents: "none",
          }}>光</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 600 }}>LightSense AI</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 4 }}>
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
            borderRadius: 22, padding: "16px 20px",
            boxShadow: "0 16px 40px rgba(158,122,26,0.18)",
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12,
            boxSizing: "border-box",
          }}>
            {[
              {
                k: t("カラー", "CURRENT"),
                v: <div style={{
                  width: 32, height: 32, borderRadius: "50%", background: color, margin: "0 auto",
                  boxShadow: `0 0 12px ${color}`, border: "2px solid #fff",
                }} />,
              },
              { k: t("明るさ", "BRIGHTNESS"), v: <div style={{ fontSize: 22, fontWeight: 700, color: G.primary }}>{brightness}%</div> },
              { k: t("モード", "MODE"), v: <div style={{ fontSize: 13, fontWeight: 600, color: G.text, textTransform: "capitalize" }}>{mode}</div> },
            ].map((c, i) => (
              <div key={i} style={{ textAlign: "center", borderLeft: i ? "1px solid #F3F4F6" : "none" }}>
                <div style={{ fontSize: 9, letterSpacing: "0.12em", color: G.text3, fontWeight: 700, marginBottom: 8 }}>{c.k}</div>
                <div style={{ height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>{c.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* CARD 1: Color Wheel */}
          <div style={{ ...cardBase, borderLeft: `4px solid ${G.primary}` }}>
            <div style={label}>● {t("カラー選択", "COLOR SELECTION")}</div>
            <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
              <ColorWheel size={220} color={color} onChange={setColor} />
            </div>
            <div style={{
              marginTop: 18, height: 40, borderRadius: 12, background: color,
              boxShadow: `0 4px 18px ${color}66, inset 0 0 0 1px rgba(0,0,0,0.05)`,
            }} />
            <div style={{ textAlign: "center", marginTop: 12 }}>
              {named && (
                <div style={{ fontSize: 14, fontWeight: 600, color: G.text }}>
                  {named.jp} / {named.en}
                </div>
              )}
              <div style={{ fontSize: 12, color: G.text2, marginTop: 4 }}>{color}</div>
              <div style={{ fontSize: 11, color: G.text3, marginTop: 2 }}>
                RGB {rgb.r}, {rgb.g}, {rgb.b}
              </div>
            </div>
          </div>

          {/* CARD 2: Quick Colors */}
          <div style={cardBase}>
            <div style={label}>● {t("クイックカラー", "QUICK COLORS")}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
              {NAMED.map((n) => {
                const active = n.hex.toUpperCase() === color.toUpperCase();
                return (
                  <button
                    key={n.hex}
                    onClick={() => setColor(n.hex)}
                    title={`${n.jp} / ${n.en}`}
                    style={{
                      width: 44, height: 44, borderRadius: "50%", background: n.hex,
                      border: active ? "2px solid #fff" : "2px solid transparent",
                      boxShadow: active
                        ? `0 0 0 2px ${G.primary}, 0 4px 12px rgba(0,0,0,0.18)`
                        : "0 2px 8px rgba(0,0,0,0.1)",
                      transform: active ? "scale(1.1)" : "scale(1)",
                      transition: "transform 0.15s, box-shadow 0.15s",
                      cursor: "pointer", justifySelf: "center",
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* CARD 3: Scene Presets */}
          <div style={cardBase}>
            <div style={label}>● {t("シーン", "SCENE PRESETS")}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {([
                { k: "indoor", emoji: "🏠", jp: "屋内", en: "Indoor", sub: t("柔らかい光", "Soft warm light"), bg: G.soft, dark: false, ring: G.primary },
                { k: "night", emoji: "🌙", jp: "夜のお散歩", en: "Night Walk", sub: t("明るい光", "Bright for visibility"), bg: "#1E293B", dark: true, ring: G.accent },
                { k: "party", emoji: "🎉", jp: "パーティー", en: "Party", sub: t("レインボー", "Rainbow mode"), bg: "linear-gradient(135deg, #F472B6, #A78BFA)", dark: true, ring: "#F472B6" },
                { k: "emergency", emoji: "🚨", jp: "緊急", en: "Emergency", sub: t("点滅", "Flashing for safety"), bg: "#FEF2F2", dark: false, ring: "#EF4444" },
              ] as const).map((s) => {
                const active = scene === s.k;
                return (
                  <button
                    key={s.k}
                    onClick={() => applyScene(s.k as Scene)}
                    style={{
                      borderRadius: 16, padding: 16, textAlign: "center",
                      background: s.bg, color: s.dark ? "#fff" : G.text,
                      border: active ? `2px solid ${s.ring}` : "2px solid transparent",
                      boxShadow: active ? `0 6px 18px ${s.ring}40` : "0 2px 8px rgba(0,0,0,0.06)",
                      cursor: "pointer", transition: "all 0.2s",
                    }}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: "50%",
                      background: s.k === "emergency" ? "rgba(239,68,68,0.15)" : "rgba(212,168,67,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      margin: "0 auto 8px", fontSize: 20,
                    }}>{s.emoji}</div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{s.jp} / {s.en}</div>
                    <div style={{ fontSize: 10, opacity: 0.8, marginTop: 4 }}>{s.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CARD 4: Brightness */}
          <div style={cardBase}>
            <div style={{ ...label, marginBottom: 16 }}>● {t("明るさ", "BRIGHTNESS")}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: "#F5DFA0", fontSize: 14 }}>☀</span>
              <div style={{ flex: 1, position: "relative", height: 22, display: "flex", alignItems: "center" }}>
                <div style={{
                  position: "absolute", left: 0, right: 0, height: 8, borderRadius: 50,
                  background: `linear-gradient(to right, ${G.soft}, ${G.primary})`,
                }} />
                <input
                  type="range" min={0} max={100} value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  style={{
                    position: "relative", width: "100%", appearance: "none",
                    background: "transparent", height: 22, margin: 0, zIndex: 2,
                  }}
                  className="ls-bright"
                />
              </div>
              <span style={{ color: G.primary, fontSize: 20 }}>☀</span>
              <div style={{ minWidth: 44, textAlign: "right", color: G.primary, fontSize: 14, fontWeight: 700 }}>
                {brightness}%
              </div>
            </div>
            <style>{`
              .ls-bright::-webkit-slider-thumb {
                appearance: none; width: 22px; height: 22px; border-radius: 50%;
                background: #fff; box-shadow: 0 2px 8px rgba(212,168,67,0.5); cursor: pointer;
                border: 2px solid ${G.primary};
              }
              .ls-bright::-moz-range-thumb {
                width: 22px; height: 22px; border-radius: 50%; background: #fff;
                box-shadow: 0 2px 8px rgba(212,168,67,0.5); border: 2px solid ${G.primary};
              }
            `}</style>
          </div>

          {/* CARD 5: Light Modes */}
          <div style={cardBase}>
            <div style={label}>● {t("ライトモード", "LIGHT MODES")}</div>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
              {([
                { k: "steady", jp: "常灯", en: "Steady", anim: "none" },
                { k: "blink", jp: "点滅", en: "Blink", anim: "lsBlink 0.8s infinite" },
                { k: "pulse", jp: "パルス", en: "Pulse", anim: "lsPulse 1.5s ease-in-out infinite" },
                { k: "rainbow", jp: "レインボー", en: "Rainbow", anim: "lsHue 3s linear infinite" },
              ] as const).map((m) => {
                const active = mode === m.k;
                return (
                  <button
                    key={m.k}
                    onClick={() => setMode(m.k as Mode)}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      padding: "10px 16px", borderRadius: 50, flexShrink: 0,
                      background: active ? G.soft : "#FAFAFA",
                      border: active ? `2px solid ${G.primary}` : "2px solid transparent",
                      color: G.text, fontSize: 13, fontWeight: 600, cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <span style={{
                      width: 10, height: 10, borderRadius: "50%",
                      background: m.k === "rainbow"
                        ? "conic-gradient(red, yellow, lime, cyan, blue, magenta, red)"
                        : G.primary,
                      animation: m.anim,
                    }} />
                    {m.jp} / {m.en}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CARD 6: Collar Preview */}
          <div style={{
            borderRadius: 24, padding: 24, background: "#0F172A", overflow: "hidden",
            boxSizing: "border-box",
          }}>
            <div style={{
              color: "rgba(255,255,255,0.5)", fontSize: 11, letterSpacing: "0.1em",
              fontWeight: 700, marginBottom: 16,
            }}>{t("プレビュー", "PREVIEW")}</div>

            <div style={{ display: "flex", justifyContent: "center", padding: "24px 0" }}>
              <div style={{
                width: "80%", height: 60, borderRadius: 30,
                background: `linear-gradient(180deg, ${color}, ${color}cc)`,
                opacity: 0.3 + (brightness / 100) * 0.7,
                boxShadow: `0 0 30px 10px ${color}99, 0 0 60px 20px ${color}55, inset 0 2px 4px rgba(255,255,255,0.3)`,
                animation: previewAnim,
                border: "2px solid rgba(255,255,255,0.15)",
              }} />
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>
                {named ? `${named.jp} / ${named.en}` : color}
              </div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 4 }}>
                {color} · {brightness}% {t("明るさ", "brightness")}
              </div>
              <div style={{
                display: "inline-block", marginTop: 12, padding: "4px 12px",
                background: "rgba(255,255,255,0.1)", color: "#fff",
                fontSize: 10, borderRadius: 50,
              }}>
                {scene === "indoor" && `🏠 ${t("屋内", "Indoor")}`}
                {scene === "night" && `🌙 ${t("夜のお散歩", "Night Walk")}`}
                {scene === "party" && `🎉 ${t("パーティー", "Party")}`}
                {scene === "emergency" && `🚨 ${t("緊急", "Emergency")}`}
              </div>
            </div>
          </div>

          {/* CARD 7: Set Color Button */}
          <div>
            <button
              onClick={() => toast.success(t("カラーを設定しました", "Color applied to collar"))}
              style={{
                width: "100%", height: 52, borderRadius: 50, border: "none",
                background: `linear-gradient(135deg, ${G.medium}, ${G.primary})`,
                color: "#fff", fontSize: 16, fontWeight: 600, cursor: "pointer",
                boxShadow: "0 6px 20px rgba(212,168,67,0.4)",
              }}
            >
              {t("カラーを設定", "Set Color")}
            </button>
            <div style={{ textAlign: "center", marginTop: 10, fontSize: 12, color: G.text3 }}>
              {t("現在の設定", "Current")}: {named ? `${named.jp}` : color} · {brightness}%
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
