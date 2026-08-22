import { useLocation, useNavigate } from "@tanstack/react-router";
import { Home, MapPin, HeartPulse, Users, User, type LucideIcon } from "lucide-react";
import { useState } from "react";

type Tab = {
  Icon: LucideIcon;
  label: string;
  route: string;
};

const TABS: Tab[] = [
  { Icon: Home, label: "Home", route: "/home" },
  { Icon: MapPin, label: "Map", route: "/map" },
  { Icon: HeartPulse, label: "Clinics", route: "/clinics" },
  { Icon: Users, label: "Community", route: "/community" },
  { Icon: User, label: "Profile", route: "/settings" },
];

const ACCENT = "var(--accent-sakura)";
const INACTIVE = "var(--text-placeholder)";

export default function BottomNav() {
  const loc = useLocation();
  const navigate = useNavigate();
  const [bouncing, setBouncing] = useState<string | null>(null);

  const isActive = (route: string) =>
    loc.pathname === route || loc.pathname.startsWith(route + "/");

  const handleTap = (route: string) => {
    setBouncing(route);
    setTimeout(() => setBouncing(null), 220);
    if (loc.pathname !== route) navigate({ to: route });
  };

  return (
    <nav
      aria-label="Primary"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 62,
        background: "var(--bg-bottomnav)",
        borderTop: "1px solid var(--border-subtle)",
        boxShadow: "var(--shadow-nav)",
        paddingBottom: "max(6px, env(safe-area-inset-bottom))",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
      {TABS.map((tab) => {
        const active = isActive(tab.route);
        const { Icon } = tab;
        const bouncingNow = bouncing === tab.route;

        return (
          <button
            key={tab.route}
            onClick={() => handleTap(tab.route)}
            className="flex flex-col items-center justify-center relative"
            style={{ flex: 1, height: "100%", cursor: "pointer", gap: 3 }}
            aria-label={tab.label}
            aria-current={active ? "page" : undefined}
          >
            <span
              style={{
                position: "absolute",
                top: 6,
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: ACCENT,
                transform: active ? "scale(1)" : "scale(0)",
                transition: "transform 0.2s ease",
              }}
            />
            <Icon
              size={21}
              strokeWidth={1.8}
              style={{
                color: active ? ACCENT : INACTIVE,
                transform: bouncingNow ? "scale(1.2)" : "scale(1)",
                transition: "transform 0.2s ease, color 0.2s ease",
              }}
            />
            <span
              style={{
                fontSize: 10,
                color: active ? ACCENT : INACTIVE,
                fontWeight: active ? 700 : 500,
                lineHeight: 1,
                transition: "color 0.2s ease",
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
