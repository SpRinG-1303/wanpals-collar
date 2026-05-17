import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Navigation, Radio } from "lucide-react";
import { useState } from "react";
import { SensorPage, Card, SP } from "@/components/SensorPage";

export const Route = createFileRoute("/location-sense")({ component: LocationSensePage });

const HISTORY = [
  { jp: "渋谷駅", en: "Shibuya Station", time: "10:42" },
  { jp: "代々木公園", en: "Yoyogi Park", time: "09:30" },
  { jp: "自宅", en: "Home", time: "08:15" },
  { jp: "動物病院", en: "Vet Clinic", time: "昨日 16:00" },
  { jp: "原宿", en: "Harajuku", time: "昨日 14:20" },
];

function LocationSensePage() {
  const [safe, setSafe] = useState(true);
  const [live, setLive] = useState(true);

  return (
    <SensorPage
      titleJp="ロケーションセンス"
      titleEn="LocationSense · GPS Tracking"
      headerGradient="linear-gradient(135deg, #C8E8D4 0%, #B0E0C8 100%)"
      accent={SP.matcha}
    >
      <div style={{
        borderRadius: 18, overflow: "hidden", marginBottom: 12,
        boxShadow: "0 2px 20px rgba(0,0,0,0.06)", height: 200, position: "relative",
        background: "linear-gradient(135deg, #DCEFE2 0%, #C3E0CC 50%, #B0D4BC 100%)",
      }}>
        <svg viewBox="0 0 400 200" width="100%" height="100%" preserveAspectRatio="none">
          <path d="M0,140 Q100,100 200,130 T400,110" stroke="#8FBFA0" strokeWidth="2" fill="none" opacity="0.5" />
          <path d="M0,170 Q120,150 240,160 T400,140" stroke="#8FBFA0" strokeWidth="1.5" fill="none" opacity="0.4" />
          <path d="M50,0 L60,200 M150,0 L165,200 M280,0 L290,200" stroke="#FFFFFF" strokeWidth="1" opacity="0.6" />
          <path d="M0,60 L400,75 M0,100 L400,115" stroke="#FFFFFF" strokeWidth="1" opacity="0.6" />
          {[[80,55],[180,40],[320,90],[350,160],[120,170]].map(([x,y], i) => (
            <rect key={i} x={x} y={y} width={20} height={16} fill="#FFFFFF" opacity="0.55" rx={2} />
          ))}
        </svg>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-100%)" }}>
          <div style={{ position: "relative" }}>
            <div className="animate-ping" style={{
              position: "absolute", inset: -8, borderRadius: "50%",
              background: SP.sakura, opacity: 0.4,
            }} />
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: SP.sakura, border: "3px solid #fff",
              boxShadow: "0 4px 12px rgba(232,130,154,0.5)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <MapPin size={16} color="#fff" />
            </div>
          </div>
        </div>
      </div>

      <Card accent={SP.matcha}>
        <div className="flex items-center" style={{ gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: "#E8F5EE", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Navigation size={20} style={{ color: SP.matcha }} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="flex items-center" style={{ gap: 6 }}>
              <span className="relative" style={{ width: 8, height: 8 }}>
                <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: SP.matcha }} />
                <span className="animate-ping" style={{ position: "absolute", inset: 0, borderRadius: "50%", background: SP.matcha, opacity: 0.6 }} />
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, color: SP.matcha, letterSpacing: "0.08em" }}>LIVE</span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: SP.sumi, marginTop: 2 }}>渋谷、東京</div>
            <div style={{ fontSize: 11, color: SP.usuzumi }}>Shibuya, Tokyo · 35.6595° N</div>
          </div>
        </div>
      </Card>

      <Card accent={SP.matcha}>
        <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: SP.sumi }}>安全ゾーン</div>
            <div style={{ fontSize: 11, color: SP.usuzumi }}>Safe Zone · 500m radius</div>
          </div>
          <Toggle on={safe} onChange={setSafe} color={SP.matcha} />
        </div>
        <div style={{ position: "relative", height: 110, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            width: 100, height: 100, borderRadius: "50%",
            background: safe ? "rgba(107,175,146,0.15)" : "rgba(138,138,138,0.1)",
            border: `2px dashed ${safe ? SP.matcha : SP.usuzumi}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{
              width: 14, height: 14, borderRadius: "50%",
              background: safe ? SP.matcha : SP.usuzumi,
            }} />
          </div>
        </div>
        <div style={{ fontSize: 11, color: SP.usuzumi, textAlign: "center" }}>
          {safe ? "ゾーン内 / Inside zone" : "オフ / Off"}
        </div>
      </Card>

      <Card accent={SP.sakura}>
        <button
          onClick={() => setLive((v) => !v)}
          className="w-full flex items-center justify-center"
          style={{
            background: live ? "linear-gradient(135deg,#E8829A,#F093A0)" : "#F5F0EC",
            color: live ? "#fff" : SP.sumi,
            borderRadius: 14, height: 48, fontSize: 14, fontWeight: 700, gap: 8,
            boxShadow: live ? "0 6px 16px rgba(232,130,154,0.35)" : "none",
          }}
        >
          <Radio size={18} />
          {live ? "ライブ追跡 オン / Live Tracking ON" : "ライブ追跡 オフ / Live Tracking OFF"}
        </button>
      </Card>

      <Card accent={SP.fuji}>
        <div style={{ fontSize: 14, fontWeight: 700, color: SP.sumi }}>位置履歴</div>
        <div style={{ fontSize: 11, color: SP.usuzumi, marginBottom: 12 }}>Location History</div>
        {HISTORY.map((h, i) => (
          <div key={i} className="flex items-center" style={{
            gap: 10, padding: "10px 0",
            borderBottom: i < HISTORY.length - 1 ? `1px solid ${SP.divider}` : "none",
          }}>
            <MapPin size={16} style={{ color: SP.fuji, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: SP.sumi }}>{h.jp}</div>
              <div style={{ fontSize: 11, color: SP.usuzumi }}>{h.en}</div>
            </div>
            <div style={{ fontSize: 11, color: SP.usuzumi, fontVariantNumeric: "tabular-nums" }}>{h.time}</div>
          </div>
        ))}
      </Card>
    </SensorPage>
  );
}

function Toggle({ on, onChange, color }: { on: boolean; onChange: (v: boolean) => void; color: string }) {
  return (
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
  );
}
