import { createFileRoute, useNavigate } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { useState } from "react";
import {
  Navigation, AlertTriangle, Phone, Shield, History, Crosshair,
  Plus, Minus, Satellite, ChevronRight, Stethoscope,
} from "lucide-react";
import { toast } from "sonner";
import { useT } from "@/context/LanguageContext";
import { usePet, displayName } from "@/context/PetContext";
import { useGeoLocation } from "@/lib/useGeoLocation";

export const Route = createFileRoute("/map")({ component: MapScreen });

/* Home-page card spec */
const CARD_SHADOW = "var(--shadow-card)";

function SectionHeader({ title }: { title: string }) {
  return (
    <div style={{ margin: "24px 20px 10px", fontSize: 18, fontWeight: 500, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
      {title}
    </div>
  );
}

function MapScreen() {
  const t = useT();
  const navigate = useNavigate();
  const { pet } = usePet();
  const dogName = displayName(pet, t("ワンちゃん", "My Pet"));

  const [lost, setLost] = useState(false);
  const [safeZone, setSafeZone] = useState(true);
  const [radius, setRadius] = useState<100 | 200 | 500 | 1000>(200);
  const [mapType, setMapType] = useState<"map" | "satellite">("satellite");
  const [zoom, setZoom] = useState(1);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  const geo = useGeoLocation();

  const openDirections = () => {
    const dest = geo.coords
      ? `${geo.coords.lat},${geo.coords.lon}`
      : encodeURIComponent(geo.label);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${dest}`, "_blank");
  };

  return (
    <AppShell titleJp="位置情報" titleEn="Location" noPadding>
      <style>{`
        @keyframes mapPulse { 0%,100% { transform: scale(1); opacity: 1 } 50% { transform: scale(1.3); opacity: .6 } }
        @keyframes safeRotate { to { transform: translate(-50%,-50%) rotate(360deg) } }
        @keyframes greenPulse { 0%,100% { transform: scale(1); opacity: 1 } 50% { transform: scale(1.6); opacity: .4 } }
        @keyframes borderPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(229,57,53,.5) } 50% { box-shadow: 0 0 0 8px rgba(229,57,53,0) } }
        .map-pulse-ring { animation: mapPulse 2s ease-in-out infinite; }
        .safe-rotate { animation: safeRotate 60s linear infinite; }
        .green-pulse::before { content:""; position:absolute; inset:0; border-radius:9999px; background:var(--accent-sakura); animation: greenPulse 1.6s ease-in-out infinite; }
      `}</style>

      {/* LIVE STATUS BAR */}
      <div style={{ margin: "12px 16px", padding: "14px 16px", background: "var(--bg-card)", borderRadius: 24, border: "1px solid var(--border-card)", boxShadow: CARD_SHADOW }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative inline-block green-pulse" style={{ width: 8, height: 8, borderRadius: "50%", background: geo.tracking ? "var(--accent-sakura)" : "var(--text-placeholder)" }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
              {geo.tracking ? t("ライブ追跡中", "Live Tracking") : geo.loading ? t("位置を取得中…", "Locating…") : t("位置情報オフ", "Location Off")}
            </span>
          </div>
          <div className="flex items-center gap-1.5" style={{ color: geo.tracking ? "var(--accent-sakura)" : "var(--text-placeholder)" }}>
            <Satellite size={14} />
            <span style={{ fontSize: 12, fontWeight: 600 }}>
              {geo.coords ? `${geo.coords.lat.toFixed(4)}, ${geo.coords.lon.toFixed(4)}` : "GPS —"}
            </span>
          </div>
        </div>
        <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>
          {t("最終更新: たった今", "Last updated: Just now")}
        </div>
      </div>

      {/* MAP CARD */}
      <div style={{ margin: "12px 16px", borderRadius: 28, overflow: "hidden", height: 320, position: "relative", boxShadow: CARD_SHADOW, border: "1px solid var(--border-card)", background: "var(--acc-pale)" }}>
        {/* Real map / satellite tiles centered on live GPS */}
        {geo.coords ? (
          <iframe
            key={`${mapType}-${geo.coords.lat.toFixed(4)}-${geo.coords.lon.toFixed(4)}`}
            title="Live pet location map"
            src={`https://maps.google.com/maps?q=${geo.coords.lat},${geo.coords.lon}&z=${Math.round(14 + zoom * 2)}&t=${mapType === "satellite" ? "k" : "m"}&output=embed`}
            className="absolute inset-0"
            style={{ width: "100%", height: "100%", border: 0, pointerEvents: "none" }}
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: "var(--acc-pale)", color: "var(--text-secondary)", fontSize: 13, fontWeight: 600 }}>
            {geo.loading ? t("位置を取得中…", "Locating…") : t("位置情報オフ", "Location Off")}
          </div>
        )}

        {/* Collar GPS badge top-left */}
        <div className="absolute" style={{ top: 12, left: 12, background: "#FFFFFF", padding: "5px 10px", borderRadius: 12, fontSize: 11, color: "var(--accent-matcha)", fontWeight: 700, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
           {t("カラーGPS", "Collar GPS")}
        </div>

        {/* Map type toggle top-left lower */}
        <div className="absolute flex" style={{ top: 48, left: 12, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", borderRadius: 14, padding: 3, fontSize: 11, fontWeight: 600 }}>
          {(["map", "satellite"] as const).map(m => (
            <button key={m} onClick={() => setMapType(m)} style={{
              padding: "4px 10px", borderRadius: 12,
              background: mapType === m ? "var(--accent-sakura)" : "transparent",
              color: mapType === m ? "#fff" : "var(--text-secondary)",
            }}>
              {m === "map" ? t("地図", "Map") : t("衛星", "Satellite")}
            </button>
          ))}
        </div>

        {/* Zoom controls top-right */}
        <div className="absolute" style={{ top: 12, right: 12, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <button onClick={() => setZoom((z) => Math.min(2, +(z + 0.25).toFixed(2)))} aria-label="Zoom in" className="flex items-center justify-center" style={{ width: 36, height: 36, color: "var(--text-primary)" }}><Plus size={16} /></button>
          <div style={{ height: 1, background: "var(--border-card)" }} />
          <button onClick={() => setZoom((z) => Math.max(1, +(z - 0.25).toFixed(2)))} aria-label="Zoom out" className="flex items-center justify-center" style={{ width: 36, height: 36, color: "var(--text-primary)" }}><Minus size={16} /></button>
        </div>

        {/* My location button bottom-right */}
        <button
          onClick={() => { setZoom(1); toast.success(t("ペットの位置に移動しました", "Centered on your pet")); }}
          aria-label="Center on pet"
          className="absolute flex items-center justify-center active:scale-90 transition-transform" style={{ bottom: 14, right: 12, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
        >
          <Crosshair size={20} style={{ color: "var(--accent-sora)" }} />
        </button>

        {/* Zoomable marker layer */}
        <div className="absolute inset-0" style={{ transform: `scale(${zoom})`, transformOrigin: "center center", transition: "transform 0.25s ease", pointerEvents: "none" }}>
        {/* Safe zone circle */}
        {safeZone && (
          <div className="absolute" style={{
            left: "50%", top: "50%", width: 180, height: 180,
            transform: "translate(-50%,-50%)",
            borderRadius: "50%",
            background: "color-mix(in oklab, var(--acc-strong) 6.0%, transparent)",
          }}>
            <div className="absolute inset-0 safe-rotate" style={{
              borderRadius: "50%",
              border: "2px dashed var(--accent-matcha)",
            }} />
            <div className="absolute" style={{ left: "50%", top: -10, transform: "translateX(-50%)", background: "#FFFFFF", border: "1px solid var(--accent-matcha)", color: "var(--accent-matcha)", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap" }}>
              {t("安全ゾーン", "Safe Zone")}
            </div>
          </div>
        )}

        {/* Activity trail dots */}
        {[{x:38,y:62,s:5},{x:42,y:58,s:4.5},{x:45,y:55,s:4},{x:47,y:52,s:3.5},{x:48,y:50,s:3}].map((d,i)=>(
          <div key={i} className="absolute" style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.s, height: d.s, borderRadius: "50%", background: `color-mix(in srgb, var(--accent-sakura) calc(${0.4-i*0.06} * 100%), transparent)` }} />
        ))}

        {/* Owner marker */}
        <div className="absolute" style={{ left: "33%", top: "66%", transform: "translate(-50%,-50%)" }}>
          <div className="absolute" style={{ left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 40, height: 40, borderRadius: "50%", background: "color-mix(in oklab, var(--acc-strong) 15.0%, transparent)", border: "1px dashed color-mix(in oklab, var(--acc-strong) 40.0%, transparent)" }} />
          <div className="relative flex items-center justify-center" style={{ width: 16, height: 16, borderRadius: "50%", background: "var(--accent-sora)", border: "3px solid white", boxShadow: "0 2px 8px color-mix(in oklab, var(--acc-strong) 40.0%, transparent)" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />
          </div>
          <div className="absolute" style={{ left: "50%", top: -22, transform: "translateX(-50%)", background: "var(--acc2-pale)", border: "1px solid var(--accent-sora)", color: "var(--accent-sora)", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap" }}>
            {t("あなた", "You")}
          </div>
          <div className="absolute" style={{ left: "50%", top: 18, transform: "translateX(-50%)", fontSize: 9, color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
            {t("精度: ±5m", "±5m")}
          </div>
        </div>

        {/* Pet marker center */}
        <div className="absolute" style={{ left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}>
          {/* Pulse ring */}
          <div className="absolute map-pulse-ring" style={{ left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 48, height: 48, borderRadius: "50%", background: "color-mix(in srgb, var(--accent-sakura) calc(0.15 * 100%), transparent)", border: "2px solid color-mix(in srgb, var(--accent-sakura) calc(0.4 * 100%), transparent)" }} />
          {/* Middle */}
          <div className="absolute" style={{ left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 32, height: 32, borderRadius: "50%", background: "color-mix(in srgb, var(--accent-sakura) calc(0.25 * 100%), transparent)", border: "2px solid var(--accent-sakura)" }} />
          {/* Inner */}
          <div className="relative flex items-center justify-center" style={{ width: 20, height: 20, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent-sakura), var(--accent-sakura-dark))", boxShadow: "0 4px 12px color-mix(in srgb, var(--accent-sakura) calc(0.5 * 100%), transparent)" }}>
            <span style={{ color: "#fff", fontSize: 10 }}></span>
          </div>
          {/* Pin tip */}
          <div className="absolute" style={{ left: "50%", top: 20, transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderTop: "6px solid var(--accent-sakura-dark)" }} />
          {/* Name tag */}
          <div className="absolute" style={{ left: "50%", top: -26, transform: "translateX(-50%)", background: "#FFFFFF", border: "1px solid var(--acc-pale)", color: "var(--accent-sakura)", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 20, whiteSpace: "nowrap", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            {dogName} 
          </div>
        </div>

        </div>
        {/* Attribution */}
        <div className="absolute" style={{ bottom: 4, right: 8, fontSize: 8, color: "var(--text-secondary)", background: "rgba(255,255,255,0.7)", padding: "1px 6px", borderRadius: 6 }}>
          © Google Maps
        </div>
      </div>

      {/* PET INFO CARD */}
      <SectionHeader title={t("マイペット", "My Pet")} />
      <div style={{ margin: "0 16px 12px", background: "var(--bg-card)", borderRadius: 24, border: "1px solid var(--border-card)", boxShadow: CARD_SHADOW }}>
        <div style={{ padding: 14 }}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="min-w-0">
                <div style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)" }}>{dogName}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 1 }}>
                  {geo.loading && !geo.coords ? t("位置を取得中…", "Locating…") : geo.label}
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-sakura)" }} />
                  <span style={{ fontSize: 12, color: "var(--accent-sakura)", fontWeight: 600 }}>{t("今移動中", "Moving now")}</span>
                </div>
              </div>
            </div>
            <span style={{ background: "var(--accent-sakura-soft)", border: "1px solid var(--acc-pale)", color: "var(--accent-sakura)", fontSize: 13, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>0.3km</span>
          </div>

          <div className="flex items-center gap-2 mt-3" style={{ fontSize: 11, color: "var(--text-secondary)" }}>
            <span> {t("移動中", "Moving")}</span>
            <span>·</span>
            <span> {geo.short}</span>
            <span>·</span>
            <span> {t("たった今", "Just now")}</span>
            <span>·</span>
            <span> {t("4分", "4 min")}</span>
          </div>

          <button onClick={openDirections} className="w-full flex items-center justify-center gap-2 mt-3" style={{ height: 48, borderRadius: 14, background: "linear-gradient(135deg, var(--accent-sakura), var(--accent-sakura-dark))", color: "#fff", fontWeight: 700, fontSize: 14, boxShadow: "0 6px 16px color-mix(in oklab, var(--accent-sakura) 35%, transparent)" }}>
            <Navigation size={16} />
            {t("道案内", "Get Directions")}
          </button>
        </div>
      </div>

      {/* SAFE ZONE CARD */}
      <SectionHeader title={t("安全", "Safety")} />
      <div style={{ margin: "0 16px 12px", background: "var(--bg-card)", borderRadius: 24, border: "1px solid var(--border-card)", boxShadow: CARD_SHADOW }}>
        <div style={{ padding: 14 }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield size={20} style={{ color: "var(--accent-sakura)" }} />
              <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>{t("安全ゾーン", "Safe Zone")}</span>
            </div>
            <Toggle on={safeZone} onChange={setSafeZone} activeColor="var(--accent-sakura)" />
          </div>
          {safeZone && (
            <div className="mt-2">
              <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                {t(`${radius < 1000 ? radius + "m" : "1km"} 半径で通知`, `Notify within ${radius < 1000 ? radius + "m" : "1km"} radius`)}
              </div>
              <div className="flex gap-2 mt-2">
                 {([100,200,500,1000] as const).map(r => (
                  <button key={r} onClick={() => setRadius(r)} style={{
                    padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                    background: radius === r ? "var(--accent-sakura)" : "var(--bg-elevated)",
                    color: radius === r ? "#fff" : "var(--text-secondary)",
                  }}>{r < 1000 ? `${r}m` : "1km"}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* LOST MODE CARD */}
      <div style={{
        margin: "0 16px 12px",
        background: "var(--bg-card)",
        borderRadius: 24,
        border: lost ? "2px solid var(--accent-red)" : "1px solid var(--border-card)",
        boxShadow: CARD_SHADOW,
        animation: lost ? "borderPulse 1.6s infinite" : undefined,
        padding: 14,
      }}>
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-2 flex-1">
            <AlertTriangle size={20} style={{ color: lost ? "#E53935" : "var(--text-placeholder)", marginTop: 2 }} className={lost ? "animate-pulse" : ""} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: lost ? "#E53935" : "var(--text-primary)" }}>
                {lost ? ` ${t("迷子モード起動中", "Lost Mode ACTIVE")}` : t("迷子モード", "Lost Mode")}
              </div>
              <div style={{ fontSize: 12, color: lost ? "#E53935" : "var(--text-secondary)", marginTop: 2 }}>
                {lost ? t("緊急追跡中...", "Emergency tracking active...") : t("紛失時の緊急追跡", "Emergency tracking if lost")}
              </div>
            </div>
          </div>
          <Toggle on={lost} onChange={setLost} activeColor="#E53935" />
        </div>
        {lost && (
          <div className="mt-3 space-y-2">
            <a href="tel:+81000000000" className="w-full flex items-center justify-center gap-2" style={{ height: 44, borderRadius: 12, background: "linear-gradient(135deg, #E53935, #C62828)", color: "#fff", fontWeight: 700, fontSize: 13 }}>
              <Phone size={14} /> {t("獣医に通知", "Notify Vet")}
            </a>
            <button
              onClick={() => {
                if (sosActive) return;
                setSosActive(true);
                toast.error(t("SOS起動 — 近隣の獣医と警察に通報しました", "SOS activated — nearby vets and your emergency contact alerted"));
                setTimeout(() => setSosActive(false), 8000);
              }}
              className="w-full flex items-center justify-center gap-2"
              style={{ height: 44, borderRadius: 12, background: "linear-gradient(135deg, #E53935, #C62828)", color: "#fff", fontWeight: 700, fontSize: 13, opacity: sosActive ? 0.75 : 1 }}
            >
               {sosActive ? t("SOS発信中…", "SOS Broadcasting…") : t("SOS起動", "Activate SOS")}
            </button>
          </div>
        )}
      </div>

      {/* LOCATION HISTORY */}
      <SectionHeader title={t("アクティビティ", "Activity")} />
       <div style={{ margin: "0 16px 12px", background: "var(--bg-card)", borderRadius: 24, border: "1px solid var(--border-card)", boxShadow: CARD_SHADOW, padding: 14 }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <History size={18} style={{ color: "var(--accent-sakura)" }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{t("移動履歴", "Location History")}</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, color: "var(--accent-sakura)", background: "var(--accent-sakura-soft)", padding: "3px 10px", borderRadius: 20 }}>{t("今日", "Today")}</span>
        </div>

        {[
          { time: "14:30", jp: "ジョガーズパーク", en: "Joggers Park", dist: "+1.2km", color: "var(--accent-yuzu)" },
          { time: "12:15", jp: "", en: "Near Bandra Stn", dist: "+0.5km", color: "var(--accent-sora)" },
          { time: "09:00", jp: "自宅", en: "Home", dist: t("出発地", "Start"), color: "var(--accent-matcha)" },
          ...(showAllHistory ? [
            { time: "昨日 18:10", jp: "", en: "Carter Road Promenade", dist: "+2.1km", color: "var(--accent-yuzu)" },
            { time: "昨日 07:45", jp: "", en: "Joggers Park", dist: "+1.4km", color: "var(--accent-sora)" },
            { time: "月曜 17:20", jp: "", en: "Bandra Fort", dist: "+3.0km", color: "var(--accent-matcha)" },
          ] : []),
        ].map((h, i) => (
          <div key={i} className="flex items-center gap-3" style={{ padding: "8px 0", borderTop: i === 0 ? "none" : "1px solid var(--bg-elevated)" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: h.color, flexShrink: 0 }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}> {h.time}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}> {t(h.jp, h.en)}</span>
              </div>
            </div>
            <span style={{ fontSize: 11, color: "var(--accent-sakura)", fontWeight: 600 }}>{h.dist}</span>
          </div>
        ))}

        <button onClick={() => setShowAllHistory((s) => !s)} className="flex items-center gap-1 mt-2" style={{ fontSize: 12, color: "var(--accent-sakura)", fontWeight: 600 }}>
          {showAllHistory ? t("履歴を閉じる", "Show Less") : t("全履歴を見る", "View Full History")} <ChevronRight size={14} style={{ transform: showAllHistory ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
        </button>
      </div>

      {/* NEARBY CLINIC */}
      <button onClick={() => navigate({ to: "/clinics" })} className="w-full flex items-center gap-3" style={{ margin: "0 16px 24px", width: "calc(100% - 32px)", background: "var(--bg-card)", boxShadow: CARD_SHADOW, border: "1px solid var(--border-card)", borderRadius: 24, padding: 14, textAlign: "left" }}>
        <div className="flex items-center justify-center" style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--accent-sakura-soft)" }}>
          <Stethoscope size={20} style={{ color: "var(--accent-sakura)" }} />
        </div>
        <div className="flex-1 min-w-0">
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
            {t("最寄りの動物病院", "Nearest Animal Hospital")}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
             {"Bandra Pet Hosp."} · 0.8km · 4.6 · 24H
          </div>
        </div>
        <div className="flex items-center justify-center" style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--accent-sakura)", color: "#fff", flexShrink: 0 }}>
          <ChevronRight size={18} />
        </div>
      </button>
    </AppShell>
  );
}

function Toggle({ on, onChange, activeColor = "var(--accent-matcha)" }: { on: boolean; onChange: (v: boolean) => void; activeColor?: string }) {
  return (
    <button onClick={() => onChange(!on)} style={{
      width: 48, height: 28, borderRadius: 999, position: "relative", transition: "background .3s",
      background: on ? activeColor : "var(--border-card)",
    }}>
      <span style={{
        position: "absolute", top: 3, left: on ? 23 : 3, width: 22, height: 22, borderRadius: "50%",
        background: "#fff", transition: "left .3s", boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      }} />
    </button>
  );
}
