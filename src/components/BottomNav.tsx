import { useLocation, useNavigate } from "@tanstack/react-router";
import { Home, HeartPulse, MapPin, Bell, Users, type LucideIcon } from "lucide-react";

type Tab = {
  Icon: LucideIcon;
  label: string;
  route: string;
};

const TABS: Tab[] = [
  { Icon: Home, label: "Home", route: "/home" },
  { Icon: HeartPulse, label: "Health", route: "/report" },
  { Icon: MapPin, label: "Map", route: "/map" },
  { Icon: Bell, label: "Alerts", route: "/ai" },
  { Icon: Users, label: "Community", route: "/community" },
];

const ACCENT = "var(--accent-sakura)";
const INACTIVE = "var(--text-placeholder)";

export default function BottomNav() {
  const loc = useLocation();
  const navigate = useNavigate();

  const isActive = (route: string) =>
    loc.pathname === route || loc.pathname.startsWith(route + "/");

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
        return (
          <button
            key={tab.route}
            onClick={() => {
              if (loc.pathname !== tab.route) navigate({ to: tab.route });
            }}
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
              strokeWidth={active ? 2 : 1.7}
              style={{
                color: active ? ACCENT : INACTIVE,
                transition: "color 0.2s ease",
              }}
            />
            <span
              style={{
                fontSize: 10,
                color: active ? ACCENT : INACTIVE,
                fontWeight: active ? 600 : 500,
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
