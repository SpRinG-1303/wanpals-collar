import { Link, useLocation } from "@tanstack/react-router";
import { Home, MapPin, Bot, Stethoscope, Users, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, type ReactNode } from "react";

const tabs = [
  { to: "/home", icon: Home, jp: "ホーム", en: "Home" },
  { to: "/map", icon: MapPin, jp: "地図", en: "Map" },
  { to: "/ai", icon: Bot, jp: "AI", en: "AI" },
  { to: "/clinics", icon: Stethoscope, jp: "クリニック", en: "Clinic" },
  { to: "/community", icon: Users, jp: "コミュニティ", en: "Community" },
];

export function TopBar({ title = "こんにちは、ハナ! 🐾" }: { title?: string }) {
  const [sosOpen, setSosOpen] = useState(false);
  return (
    <>
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <Link to="/settings" className="w-10 h-10 rounded-full bg-gradient-to-br from-sakura to-secondary flex items-center justify-center text-lg shadow-soft">
            🐕
          </Link>
          <div className="text-sm font-bold truncate flex-1 text-center">{title}</div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSosOpen(true)}
              className="pulse-red bg-destructive text-destructive-foreground rounded-full px-3 h-10 text-xs font-bold flex items-center gap-1"
            >
              🆘 SOS
            </button>
          </div>
        </div>
      </header>
      {sosOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4" onClick={() => setSosOpen(false)}>
          <motion.div
            initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="bg-card rounded-2xl p-6 w-full max-w-sm shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-destructive">🆘 緊急 / Emergency</h3>
            <p className="text-sm text-muted-foreground mt-1">最寄りの24時間獣医に連絡します</p>
            <div className="mt-4 space-y-2">
              <button className="w-full bg-destructive text-destructive-foreground rounded-xl py-3 font-bold">📞 今すぐ電話 / Call Now</button>
              <button className="w-full bg-muted rounded-xl py-3 font-medium">📍 迷子モードを起動 / Lost Mode</button>
              <button onClick={() => setSosOpen(false)} className="w-full text-sm text-muted-foreground py-2">キャンセル</button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

export function BottomNav() {
  const loc = useLocation();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur-md border-t border-border">
      <div className="grid grid-cols-5 max-w-md mx-auto">
        {tabs.map((t) => {
          const active = loc.pathname.startsWith(t.to);
          const Icon = t.icon;
          return (
            <Link key={t.to} to={t.to} className="relative flex flex-col items-center justify-center py-2 min-h-[56px]">
              <Icon className={`w-5 h-5 ${active ? "text-sakura" : "text-muted-foreground"}`} />
              <span className={`text-[10px] mt-0.5 ${active ? "text-sakura font-bold" : "text-muted-foreground"}`}>{t.jp}</span>
              {active && <span className="absolute bottom-0 h-1 w-8 bg-sakura rounded-t-full" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default function AppShell({ children, title }: { children: ReactNode; title?: string }) {
  // Apply persisted dark mode
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("wancare-theme") === "dark") document.documentElement.classList.add("dark");
  }, []);
  return (
    <div className="min-h-screen bg-background pb-20 max-w-md mx-auto">
      <TopBar title={title} />
      <main className="px-4 py-4">{children}</main>
      <BottomNav />
    </div>
  );
}
