import { Link } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, type ReactNode } from "react";
import { T, useT } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import SideDrawer, { HamburgerButton } from "@/components/SideDrawer";

export function TopBar({
  titleJp,
  titleEn,
  onMenuClick,
  menuOpen = false,
}: {
  titleJp?: string;
  titleEn?: string;
  onMenuClick?: () => void;
  menuOpen?: boolean;
}) {
  const [sosOpen, setSosOpen] = useState(false);
  const t = useT();
  const showTitle = Boolean(titleJp || titleEn);
  return (
    <>
      <header className="sticky top-0 z-40" style={{ background: "#FAFAF8" }}>
        <div className="flex items-center justify-between" style={{ padding: "0 16px", height: 60, gap: 10 }}>
          <div className="flex items-center" style={{ gap: 10 }}>
            {onMenuClick && <HamburgerButton isOpen={menuOpen} onClick={onMenuClick} />}
            <Link
              to="/settings"
              className="flex items-center justify-center text-lg"
              style={{ width: 42, height: 42, borderRadius: "50%", background: "#FFFFFF", border: "2px solid #E8829A" }}
              aria-label="Profile"
            >
              🐕
            </Link>
          </div>
          {showTitle ? (
            <div className="text-sm font-bold truncate flex-1 text-center" style={{ color: "#2C2C2C", letterSpacing: "0.02em" }}>
              {t(titleJp ?? "", titleEn ?? "")}
            </div>
          ) : (
            <div className="flex-1" />
          )}
          <div className="flex items-center" style={{ gap: 0 }}>
            <LanguageSwitcher />
            <button
              className="flex items-center justify-center"
              style={{ width: 36, height: 36, margin: "0 4px 0 8px", color: "#8A8A8A" }}
              aria-label={t("通知", "Notifications")}
            >
              <Bell size={22} strokeWidth={1.75} />
            </button>
            <button
              onClick={() => setSosOpen(true)}
              className="pulse-red font-bold flex items-center"
              style={{
                background: "#E53935",
                color: "#fff",
                borderRadius: 20,
                padding: "8px 14px",
                fontSize: 13,
                boxShadow: "0 4px 12px rgba(229,57,53,0.4)",
              }}
            >
              SOS
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
            <h3 className="text-lg font-bold text-destructive">🆘 <T jp="緊急" en="Emergency"/></h3>
            <p className="text-sm text-muted-foreground mt-1">{t("最寄りの24時間獣医に連絡します", "Contact the nearest 24h vet")}</p>
            <div className="mt-4 space-y-2">
              <button className="w-full bg-destructive text-destructive-foreground rounded-xl py-3 font-bold">📞 {t("今すぐ電話", "Call Now")}</button>
              <button className="w-full bg-muted rounded-xl py-3 font-medium">📍 {t("迷子モードを起動", "Activate Lost Mode")}</button>
              <button onClick={() => setSosOpen(false)} className="w-full text-sm text-muted-foreground py-2">{t("キャンセル", "Cancel")}</button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

export default function AppShell({
  children,
  titleJp,
  titleEn,
  hideTopBar = false,
  noPadding = false,
}: {
  children: ReactNode;
  titleJp?: string;
  titleEn?: string;
  hideTopBar?: boolean;
  noPadding?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("wancare-theme") === "dark") document.documentElement.classList.add("dark");
  }, []);

  // Swipe-from-left to open
  useEffect(() => {
    let startX = 0;
    let tracking = false;
    const onStart = (e: TouchEvent) => {
      const x = e.touches[0]?.clientX ?? 0;
      if (!menuOpen && x < 20) { tracking = true; startX = x; }
    };
    const onMove = (e: TouchEvent) => {
      if (!tracking) return;
      const dx = (e.touches[0]?.clientX ?? 0) - startX;
      if (dx > 60) { setMenuOpen(true); tracking = false; }
    };
    const onEnd = () => { tracking = false; };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [menuOpen]);

  return (
    <div className="min-h-screen max-w-md mx-auto" style={{ background: "#FAFAF8", paddingBottom: 20 }}>
      {!hideTopBar && (
        <TopBar
          titleJp={titleJp}
          titleEn={titleEn}
          onMenuClick={() => setMenuOpen((o) => !o)}
          menuOpen={menuOpen}
        />
      )}
      <main className={noPadding ? "" : "px-4 py-4"}>{children}</main>
      <SideDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
