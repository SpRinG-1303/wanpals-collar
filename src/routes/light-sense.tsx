import { createFileRoute } from "@tanstack/react-router";
import { Lightbulb, Zap } from "lucide-react";
import { useState, useRef } from "react";
import { SensorPage, Card, SP, Bi } from "@/components/SensorPage";
import { useT } from "@/context/LanguageContext";

export const Route = createFileRoute("/light-sense")({ component: LightSensePage });

const PRESETS: { jp: string; en: string; hex: string }[] = [
  { jp: "白", en: "White", hex: "#FFFFFF" },
  { jp: "赤", en: "Red", hex: "#FF4444" },
  { jp: "青", en: "Blue", hex: "#4488FF" },
  { jp: "緑", en: "Green", hex: "#44CC66" },
  { jp: "紫", en: "Purple", hex: "#9B72CF" },
  { jp: "黄", en: "Yellow", hex: "#FFD83A" },
  { jp: "桃", en: "Pink", hex: "#E8829A" },
  { jp: "虹", en: "Rainbow", hex: "rainbow" },
];

function LightSensePage() {
  const [color, setColor] = useState("#E8829A");
  const [brightness, setBrightness] = useState(75);
  const [rainbow, setRainbow] = useState(false);
  const [blink, setBlink] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);
  const t = useT();

  const handleWheel = (e: React.MouseEvent | React.TouchEvent) => {
    const el = wheelRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const point = "touches" in e ? e.touches[0] : (e as React.MouseEvent);
    const dx = point.clientX - cx;
    const dy = point.clientY - cy;
    const r = Math.sqrt(dx * dx + dy * dy);
    const maxR = rect.width / 2;
    const dist = Math.min(1, r / maxR);
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    const hue = Math.round(angle);
    const sat = Math.round(dist * 100);
    setColor(hslToHex(hue, sat, 50));
    setRainbow(false);
  };

  const displayColor = rainbow ? "linear-gradient(90deg,#FF4444,#FFD83A,#44CC66,#4488FF,#9B72CF,#E8829A)" : color;

  return (
    <SensorPage
      titleJp="カラーライト"
      titleEn="Collar Light Control · LightSense AI"
      headerGradient="linear-gradient(135deg, #FFD1DC 0%, #FFD89A 25%, #C8E8B0 50%, #B0D8FF 75%, #D8C0FF 100%)"
      accent={SP.fuji}
    >
      <Card accent={SP.fuji}>
        <div
          ref={wheelRef}
          onClick={handleWheel}
          onTouchStart={handleWheel}
          style={{
            width: 220, height: 220, margin: "0 auto", borderRadius: "50%", cursor: "crosshair",
            background: "conic-gradient(red, yellow, lime, cyan, blue, magenta, red)",
            position: "relative",
            boxShadow: "0 6px 24px rgba(0,0,0,0.12), inset 0 0 0 2px #fff",
          }}
        >
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            background: "radial-gradient(circle, #fff 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            width: 64, height: 64, borderRadius: "50%",
            background: displayColor, border: "4px solid #fff",
            boxShadow: `0 0 24px ${rainbow ? "#E8829A" : color}, 0 4px 12px rgba(0,0,0,0.15)`,
            pointerEvents: "none",
          }} />
        </div>

        <div style={{ marginTop: 16, padding: "10px 14px", borderRadius: 12, background: "#FAFAF8", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8, background: displayColor,
            border: "2px solid #fff", boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: SP.usuzumi }}>{t("選択中の色", "Selected")}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: SP.sumi, fontFamily: "monospace" }}>
              {rainbow ? t("レインボー", "RAINBOW") : color.toUpperCase()}
            </div>
          </div>
        </div>
      </Card>

      <Card accent={SP.yuzu}>
        <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
          <div>
            <Bi
              jp="明るさ" en="Brightness"
              jpStyle={{ fontSize: 13, fontWeight: 700, color: SP.sumi }}
              enStyle={{ fontSize: 11, color: SP.usuzumi }}
            />
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: SP.yuzu, fontVariantNumeric: "tabular-nums" }}>{brightness}%</div>
        </div>
        <input
          type="range" min={0} max={100} value={brightness}
          onChange={(e) => setBrightness(Number(e.target.value))}
          style={{
            width: "100%", height: 8, borderRadius: 4, appearance: "none",
            background: `linear-gradient(90deg, ${SP.yuzu} ${brightness}%, #F5F0EC ${brightness}%)`,
          }}
        />
      </Card>

      <Card accent={SP.sakura}>
        <Bi
          jp="クイックカラー" en="Quick Colors"
          jpStyle={{ fontSize: 13, fontWeight: 700, color: SP.sumi }}
          enStyle={{ fontSize: 11, color: SP.usuzumi, marginBottom: 12 }}
        />
        <div className="grid grid-cols-4" style={{ gap: 8, marginTop: 8 }}>
          {PRESETS.map((p) => (
            <button
              key={p.en}
              onClick={() => {
                if (p.hex === "rainbow") { setRainbow(true); } else { setColor(p.hex); setRainbow(false); }
              }}
              style={{
                aspectRatio: "1", borderRadius: 12,
                background: p.hex === "rainbow"
                  ? "conic-gradient(red,yellow,lime,cyan,blue,magenta,red)"
                  : p.hex,
                border: ((p.hex === "rainbow" && rainbow) || (!rainbow && color === p.hex))
                  ? `3px solid ${SP.sakura}` : "2px solid #fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                fontSize: 9, fontWeight: 700,
                color: p.hex === "#FFFFFF" || p.hex === "#FFD83A" ? SP.sumi : "#fff",
              }}
            >{t(p.jp, p.en)}</button>
          ))}
        </div>
      </Card>

      <Card accent={SP.fuji}>
        <ToggleRow
          icon={<Zap size={18} style={{ color: SP.fuji }} />}
          jp="点滅モード" en="Blink Mode"
          on={blink} onChange={setBlink} color={SP.fuji}
        />
        <div style={{ height: 1, background: SP.divider, margin: "10px 0" }} />
        <ToggleRow
          icon={<Lightbulb size={18} style={{ color: SP.sakura }} />}
          jp="レインボーモード" en="Rainbow Mode"
          on={rainbow} onChange={setRainbow} color={SP.sakura}
        />
      </Card>

      <Card accent={SP.sakura} style={{ background: "linear-gradient(135deg,#FFF0F3,#FFFFFF)" }}>
        <div className="flex items-center justify-center" style={{ gap: 14, padding: "4px 0" }}>
          <div style={{
            width: 50, height: 50, borderRadius: "50%",
            background: "#F5F0EC", border: "3px solid " + SP.sumi,
            position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div className={blink ? "animate-pulse" : ""} style={{
              width: 18, height: 18, borderRadius: "50%",
              background: displayColor,
              boxShadow: `0 0 16px ${rainbow ? "#E8829A" : color}, 0 0 32px ${rainbow ? "#9B72CF" : color}`,
              opacity: brightness / 100,
            }} />
          </div>
          <div>
            <Bi
              jp="ライブプレビュー" en="Collar Preview"
              jpStyle={{ fontSize: 11, color: SP.usuzumi }}
              enStyle={{ fontSize: 12, color: SP.usuzumi, opacity: 0.7 }}
            />
          </div>
        </div>
      </Card>

      <button
        style={{
          width: "100%", height: 52, borderRadius: 16,
          background: "linear-gradient(135deg,#E8829A,#F093A0)",
          color: "#fff", fontSize: 15, fontWeight: 700,
          boxShadow: "0 8px 20px rgba(232,130,154,0.4)",
          marginTop: 4, letterSpacing: "0.02em",
        }}
      >
        {t("カラーを設定", "Set Color")}
      </button>
    </SensorPage>
  );
}

function ToggleRow({ icon, jp, en, on, onChange, color }: {
  icon: React.ReactNode; jp: string; en: string; on: boolean; onChange: (v: boolean) => void; color: string;
}) {
  return (
    <div className="flex items-center" style={{ gap: 12 }}>
      {icon}
      <div style={{ flex: 1 }}>
        <Bi
          jp={jp} en={en}
          jpStyle={{ fontSize: 13, fontWeight: 600, color: SP.sumi }}
          enStyle={{ fontSize: 10, color: SP.usuzumi }}
        />
      </div>
      <button
        onClick={() => onChange(!on)}
        style={{
          width: 48, height: 28, borderRadius: 999, position: "relative",
          background: on ? color : "#E0DAD4", transition: "background 0.2s",
        }}
      >
        <div style={{
          position: "absolute", top: 3, left: on ? 23 : 3,
          width: 22, height: 22, borderRadius: "50%", background: "#fff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.15)", transition: "left 0.2s",
        }} />
      </button>
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
