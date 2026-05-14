import { createFileRoute } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { useState } from "react";
import { Navigation, AlertTriangle, Phone } from "lucide-react";

export const Route = createFileRoute("/map")({ component: MapScreen });

function MapScreen() {
  const [lost, setLost] = useState(false);
  const [safeZone, setSafeZone] = useState(true);
  return (
    <AppShell title="🗺️ 位置追跡 / Location">
      {lost && (
        <div className="bg-destructive text-destructive-foreground rounded-2xl p-3 -mt-2 mb-3 text-xs font-bold flex items-center gap-2 animate-pulse">
          <AlertTriangle className="w-4 h-4"/> 迷子モード ON · 24時間獣医を検索中…
        </div>
      )}

      {/* Map placeholder */}
      <div className="relative h-80 rounded-2xl overflow-hidden shadow-card border border-border" style={{
        background: `repeating-linear-gradient(0deg, #E8EAF0 0 1px, transparent 1px 40px),
                     repeating-linear-gradient(90deg, #E8EAF0 0 1px, transparent 1px 40px),
                     linear-gradient(135deg, #F0F4FA, #E8EEF7)`
      }}>
        {/* roads */}
        <div className="absolute inset-x-0 top-1/2 h-3 bg-card/80"/>
        <div className="absolute inset-y-0 left-1/3 w-3 bg-card/80"/>
        {/* safe zone */}
        {safeZone && <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full border-2 border-success bg-success/10"/>}
        {/* dog marker */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-12 h-12 rounded-full bg-sakura shadow-card flex items-center justify-center text-2xl border-4 border-card">🐾</div>
        </div>
        {/* owner */}
        <div className="absolute left-1/3 top-2/3">
          <div className="w-5 h-5 rounded-full bg-primary border-4 border-card shadow-card animate-pulse"/>
        </div>
        {lost && (
          <div className="absolute top-3 right-3 bg-card rounded-xl p-2 shadow-card text-xs">
            <div className="font-bold">🏥 渋谷24h動物病院</div>
            <div className="text-muted-foreground">1.1km · 営業中</div>
          </div>
        )}
      </div>

      <div className="mt-3 bg-card rounded-2xl p-4 shadow-card">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-bold">ハナ / Hana</div>
            <div className="text-xs text-muted-foreground">渋谷区神南1-2-3</div>
            <div className="text-[11px] text-success font-bold mt-1">● 今たった更新 / Just now</div>
          </div>
          <span className="text-xs bg-sakura-soft text-primary px-2 py-1 rounded-full font-bold">0.3km</span>
        </div>
        <button className="mt-3 w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-bold flex items-center justify-center gap-2">
          <Navigation className="w-4 h-4"/> 道案内 / Get Directions
        </button>
      </div>

      <div className="mt-3 bg-card rounded-2xl p-4 shadow-card flex items-center justify-between">
        <div>
          <div className="text-sm font-bold">セーフゾーン / Safe Zone</div>
          <div className="text-xs text-muted-foreground">200m半径で通知</div>
        </div>
        <Toggle on={safeZone} onChange={setSafeZone}/>
      </div>

      <div className={`mt-3 rounded-2xl p-4 shadow-card flex items-center justify-between ${lost ? "bg-destructive text-destructive-foreground" : "bg-card"}`}>
        <div>
          <div className="text-sm font-bold">🔴 迷子モード / Lost Mode</div>
          <div className={`text-xs ${lost ? "opacity-80" : "text-muted-foreground"}`}>緊急通知＋獣医アラート</div>
        </div>
        <Toggle on={lost} onChange={setLost}/>
      </div>

      {lost && (
        <>
          <button className="mt-3 w-full bg-destructive text-destructive-foreground rounded-2xl py-4 font-bold flex items-center justify-center gap-2 pulse-red">
            <Phone className="w-4 h-4"/> 今すぐ電話 / Call Now
          </button>
          <div className="mt-2 bg-success/15 border border-success/30 rounded-xl p-3 text-xs text-success font-bold text-center">
            ✓ 獣医にアラート送信済み / Alert Sent to Vet
          </div>
        </>
      )}
    </AppShell>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} className={`w-14 h-8 rounded-full relative transition-colors ${on ? "bg-success" : "bg-muted"}`}>
      <span className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow ${on ? "left-7" : "left-1"}`}/>
    </button>
  );
}
