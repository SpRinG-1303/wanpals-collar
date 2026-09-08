import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Bell, ArrowLeft, AlertTriangle, Heart, Syringe } from "lucide-react";
import { toast } from "sonner";
import pawLogoAsset from "@/assets/paw-logo.png.asset.json";
import { motion } from "framer-motion";
import { useState, useEffect, type ReactNode } from "react";
import { T, useT } from "@/context/LanguageContext";
import SideDrawer, { HamburgerButton } from "@/components/SideDrawer";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/context/AuthContext";

/* Pet-owner routes that veterinarians must never see — vets only get the
   clinical console (/home), body map, e-Rx and their profile. */
const VET_BLOCKED_PREFIXES = [
  "/map", "/clinics", "/community", "/ai", "/breeds", "/report",
  "/bark-sense", "/skin-sense", "/motion-sense", "/temp-sense",
  "/pressure-sense", "/light-sense", "/avatar-setup", "/onboarding",
];

export function TopBar({
  titleJp,
  titleEn,
  onMenuClick,
  menuOpen = false,
  showBack = false,
  backTo = "/home",
}: {
  titleJp?: string;
  titleEn?: string;
  onMenuClick?: () => void;
  menuOpen?: boolean;
  showBack?: boolean;
  backTo?: string;
}) {
  const [sosOpen, setSosOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const navigate = useNavigate();
  const t = useT();
  const showTitle = Boolean(titleJp || titleEn);
  const notifications = [
    { Icon: Heart, color: "var(--accent-sakura)", text: t("健康スコアが更新されました", "Health score updated: 87/100"), time: "2m" },
    { Icon: Syringe, color: "var(--accent-matcha)", text: t("ワクチン接種のリマインダー", "Vaccination reminder: rabies booster due"), time: "1h" },
    { Icon: AlertTriangle, color: "var(--accent-yuzu)", text: t("活動量がいつもより少なめです", "Activity is lower than usual today"), time: "3h" },
  ];
  return (
    <>
      <header className="sticky top-0 z-40" style={{ background: "var(--bg-topbar)" }}>
        <div className="flex items-center justify-between" style={{ padding: "0 16px", height: 60, gap: 10 }}>
          <div className="flex items-center" style={{ gap: 8 }}>
            {onMenuClick && <HamburgerButton isOpen={menuOpen} onClick={onMenuClick} />}
            {showBack && (
              <Link
                to={backTo}
                aria-label="Back"
                className="flex items-center justify-center"
                style={{ width: 36, height: 36, borderRadius: "50%", color: "var(--text-secondary)" }}
              >
                <ArrowLeft size={22} strokeWidth={2} />
              </Link>
            )}
            <Link
              to="/home"
              className="flex items-center"
              style={{ gap: 10, background: "transparent" }}
              aria-label="Home"
            >
              <img
                src={pawLogoAsset.url}
                alt="Pawsitive logo"
                style={{ width: 40, height: 40, objectFit: "contain", display: "block" }}
              />
              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                  Pawsitive
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>
                  Diagnostics
                </span>
              </div>
            </Link>
          </div>
          {showTitle ? (
            <div className="text-sm font-bold truncate flex-1 text-center" style={{ color: "var(--text-primary)", letterSpacing: "0.02em" }}>
              {t(titleJp ?? "", titleEn ?? "")}
            </div>
          ) : (
            <div className="flex-1" />
          )}
          <div className="flex items-center" style={{ gap: 0 }}>
            <button
              onClick={() => setBellOpen((o) => !o)}
              className="flex items-center justify-center relative"
              style={{ width: 36, height: 36, margin: "0 4px 0 8px", color: bellOpen ? "var(--acc-strong)" : "var(--text-secondary)" }}
              aria-label={t("通知", "Notifications")}
            >
              <Bell size={22} strokeWidth={1.75} />
              <span style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", background: "#E53935", border: "2px solid var(--bg-topbar)" }} />
            </button>
            <button
              onClick={() => setSosOpen(true)}
              className="font-bold flex items-center active:scale-95 transition-transform"
              style={{
                background: "#E53935",
                color: "#fff",
                borderRadius: 20,
                padding: "6px 12px",
                fontSize: 12,
                boxShadow: "0 2px 8px rgba(229,57,53,0.3)",
              }}
            >
              SOS
            </button>
          </div>
        </div>
        {bellOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setBellOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-3 z-50"
              style={{ top: 62, width: 300, background: "#FFFFFF", borderRadius: 16, boxShadow: "0 12px 32px rgba(0,0,0,0.14)", padding: 8 }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", padding: "6px 10px 8px" }}>
                {t("通知", "Notifications")}
              </div>
              {notifications.map((n, i) => (
                <button
                  key={i}
                  onClick={() => { setBellOpen(false); navigate({ to: "/ai" }); }}
                  className="w-full flex items-center gap-3 text-left"
                  style={{ padding: "8px 10px", borderRadius: 12 }}
                >
                  <span className="flex items-center justify-center shrink-0" style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--acc-pale)" }}>
                    <n.Icon size={16} style={{ color: n.color }} />
                  </span>
                  <span className="flex-1 min-w-0" style={{ fontSize: 12, color: "var(--text-primary)", lineHeight: 1.35 }}>{n.text}</span>
                  <span style={{ fontSize: 10, color: "var(--text-placeholder)", flexShrink: 0 }}>{n.time}</span>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </header>
      {sosOpen && (
        <div className="fixed inset-0 z-[120] bg-black/50 flex items-end sm:items-center justify-center p-4" onClick={() => setSosOpen(false)}>
          <motion.div
            initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="bg-card rounded-2xl p-6 w-full max-w-sm shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-destructive"> <T jp="緊急" en="Emergency"/></h3>
            <p className="text-sm text-muted-foreground mt-1">{t("最寄りの24時間獣医に連絡します", "Contact the nearest 24h vet")}</p>
            <div className="mt-4 space-y-2">
              <button
                onClick={() => { window.location.href = "tel:+919820001234"; toast.info(t("24時間獣医に発信中…", "Calling 24h vet helpline…")); }}
                className="w-full bg-destructive text-destructive-foreground rounded-xl py-3 font-bold"
              > {t("今すぐ電話", "Call Now")}</button>
              <button
                onClick={() => { setSosOpen(false); navigate({ to: "/map" }); toast.error(t("迷子モードを有効化 — 地図で確認", "Lost Mode — activate it on the map")); }}
                className="w-full bg-muted rounded-xl py-3 font-medium"
              > {t("迷子モードを起動", "Activate Lost Mode")}</button>
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
  fullHeight = false,
  hideBottomNav = false,
  renderTopBar,
}: {
  children: ReactNode;
  titleJp?: string;
  titleEn?: string;
  hideTopBar?: boolean;
  noPadding?: boolean;
  fullHeight?: boolean;
  hideBottomNav?: boolean;
  renderTopBar?: (ctx: { menuOpen: boolean; onMenuClick: () => void }) => ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { session, hydrated } = useAuth();
  const loc = useLocation();
  const navigate = useNavigate();

  // Vet role guard — bounce vets away from pet-owner features
  const vetBlocked =
    hydrated &&
    session?.role === "vet" &&
    VET_BLOCKED_PREFIXES.some((p) => loc.pathname === p || loc.pathname.startsWith(p + "/"));
  useEffect(() => {
    if (vetBlocked) navigate({ to: "/home", replace: true });
  }, [vetBlocked, navigate]);

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

  const onMenuClick = () => setMenuOpen((o) => !o);

  return (
    <div
      style={{
        background: "var(--bg-outside)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div
        className="jaipur-jaali"
        style={{
          position: "relative",
          overflow: "hidden",
          width: "100%",
          maxWidth: 430,
          height: "100dvh",
          backgroundColor: "var(--bg-page)",
          display: "flex",
          flexDirection: "column",
          // Containing block for position:fixed descendants — keeps modals,
          // drawers and bottom sheets inside phone coordinates on desktop.
          transform: "translateZ(0)",
          clipPath: "inset(0)",
        }}
      >
        {renderTopBar
          ? renderTopBar({ menuOpen, onMenuClick })
          : !hideTopBar && (
              <TopBar
                titleJp={titleJp}
                titleEn={titleEn}
                onMenuClick={onMenuClick}
                menuOpen={menuOpen}
              />
            )}
        <main
          className={noPadding ? "" : "px-4 py-4"}
          style={
            fullHeight
              ? {
                  flex: 1,
                  minHeight: 0,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  paddingBottom: hideBottomNav ? 0 : 64,
                }
              : {
                  flex: 1,
                  minHeight: 0,
                  overflowY: "auto",
                  overflowX: "hidden",
                  WebkitOverflowScrolling: "touch",
                  paddingBottom: hideBottomNav ? undefined : 80,
                }
          }
        >
          {vetBlocked ? null : children}
        </main>
        <SideDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        {!hideBottomNav && <BottomNav />}
      </div>
    </div>
  );
}
