import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  LayoutDashboard, PawPrint, Stethoscope, Pill, Settings, Search, Bell,
  Menu, X, ChevronDown, Siren, ArrowLeft, Phone, CalendarDays, FlaskConical, Syringe,
  BarChart3, Package, Receipt, type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import pawLogo from "@/assets/paw-logo.png";
import { useAuth } from "@/context/AuthContext";
import { E, PatientAvatar } from "./ehr";
import { CLINIC_BRANCHES, VET_PATIENTS } from "./vetData";

type NavItem = { to: string; label: string; Icon: LucideIcon };

/* Full clinic module set — every entry maps to a real route. */
const NAV_SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: "Clinical",
    items: [
      { to: "/home", label: "Dashboard", Icon: LayoutDashboard },
      { to: "/vet-appointments", label: "Appointments", Icon: CalendarDays },
      { to: "/vet-patients", label: "Patients & Records", Icon: PawPrint },
      { to: "/vet-consult", label: "Consultations", Icon: Stethoscope },
      { to: "/vet-rx", label: "Prescriptions", Icon: Pill },
    ],
  },
  {
    label: "Diagnostics & Care",
    items: [
      { to: "/vet-lab", label: "Laboratory", Icon: FlaskConical },
      { to: "/vet-vaccinations", label: "Vaccinations", Icon: Syringe },
      { to: "/vet-reports", label: "Reports", Icon: BarChart3 },
    ],
  },
  {
    label: "Practice",
    items: [
      { to: "/vet-inventory", label: "Inventory", Icon: Package },
      { to: "/vet-billing", label: "Billing", Icon: Receipt },
      { to: "/settings", label: "Settings", Icon: Settings },
    ],
  },
];

const NOTIFS = [
  { text: "Lab result ready — Simba, thyroid panel", time: "12m" },
  { text: "Bruno checked in for 09:30 appointment", time: "31m" },
  { text: "Follow-up reminder sent to Sarah Mehta", time: "1h" },
];

function BrandBlock() {
  return (
    <Link to="/home" className="flex items-center" style={{ gap: 9, textDecoration: "none", minWidth: 0 }}>
      <img src={pawLogo} alt="Pawsitive Diagnostics logo" style={{ width: 32, height: 32, objectFit: "contain", flexShrink: 0 }} />
      <span style={{ lineHeight: 1.12, minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 13.5, fontWeight: 800, color: E.ink, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
          Pawsitive Diagnostics
        </span>
        <span style={{ display: "block", fontSize: 10, fontWeight: 600, color: E.sub }}>Veterinary Clinic</span>
      </span>
    </Link>
  );
}

function SideNav({ onNavigate }: { onNavigate?: () => void }) {
  const loc = useLocation();
  return (
    <nav style={{ padding: "8px 12px", display: "flex", flexDirection: "column", flex: 1, overflowY: "auto" }}>
      {NAV_SECTIONS.map((section) => (
        <div key={section.label} style={{ marginBottom: 6 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: E.faint, letterSpacing: "0.08em", textTransform: "uppercase", padding: "8px 11px 5px" }}>
            {section.label}
          </div>
          {section.items.map(({ to, label, Icon }) => {
            const active = to === "/home" ? loc.pathname === "/home" : loc.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                onClick={onNavigate}
                className="flex items-center"
                style={{
                  gap: 11,
                  padding: "9px 11px",
                  borderRadius: 10,
                  fontSize: 13.5,
                  fontWeight: active ? 700 : 500,
                  color: active ? E.accentDeep : E.sub,
                  background: active ? E.pale : "transparent",
                  textDecoration: "none",
                  borderLeft: active ? `3px solid ${E.accent}` : "3px solid transparent",
                }}
              >
                <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />
                {label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

export default function VetShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { session } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [sosOpen, setSosOpen] = useState(false);
  const [branch, setBranch] = useState(CLINIC_BRANCHES[0]);
  const [q, setQ] = useState("");
  const [qFocus, setQFocus] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const drName = session?.name ? (session.name.startsWith("Dr") ? session.name : `Dr. ${session.name}`) : "Dr. Sharma";
  const initials = drName.replace(/^Dr\.?\s*/, "").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "DR";

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setQFocus(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const matches = q.trim()
    ? VET_PATIENTS.filter((p) =>
        [p.name, p.owner, p.microchip, p.patientCode, p.ownerPhone]
          .join(" ")
          .toLowerCase()
          .includes(q.trim().toLowerCase())
      ).slice(0, 5)
    : [];

  const openPatient = (id: string) => {
    setQ("");
    setQFocus(false);
    navigate({ to: "/vet-patient/$id", params: { id } });
  };

  return (
    /* ===== Phone frame — identical geometry to the pet-owner AppShell ===== */
    <div
      data-role="vet"
      style={{
        background: "var(--bg-outside)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div
        className="mooomentum-frame"
        style={{
          position: "relative",
          overflow: "hidden",
          width: "100%",
          maxWidth: 430,
          height: "100dvh",
          background: E.bg,
          display: "flex",
          flexDirection: "column",
          // Containing block for position:fixed descendants (drawer, modals)
          transform: "translateZ(0)",
          clipPath: "inset(0)",
          borderInline: `1px solid ${E.border}`,
          boxShadow: "0 24px 70px rgba(22,62,56,0.12)",
        }}
      >
        {/* ===== Header ===== */}
        <header style={{ background: "color-mix(in oklab, var(--bg-card) 96%, transparent)", borderBottom: `1px solid ${E.border}`, flexShrink: 0, zIndex: 90, backdropFilter: "blur(16px)" }}>
          <div className="flex items-center" style={{ height: 64, padding: "0 12px", gap: 8 }}>
            {loc.pathname !== "/home" && (
              <button
                onClick={() => {
                  if (window.history.length > 1) window.history.back();
                  else navigate({ to: "/home" });
                }}
                aria-label="Back"
                className="flex items-center justify-center"
                style={{ width: 38, height: 38, borderRadius: 14, border: `1px solid ${E.border}`, background: E.card, color: E.ink, flexShrink: 0 }}
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              className="flex items-center justify-center"
               style={{ width: 38, height: 38, borderRadius: 14, border: `1px solid ${E.border}`, background: E.card, color: E.ink, flexShrink: 0 }}
            >
              <Menu size={18} />
            </button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <BrandBlock />
            </div>
            <button
              onClick={() => setSosOpen(true)}
              aria-label="Emergency"
              className="flex items-center justify-center"
               style={{ width: 38, height: 38, borderRadius: 14, border: `1px solid ${E.red}`, background: E.redSoft, color: E.red, flexShrink: 0 }}
            >
              <Siren size={16} />
            </button>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <button
                onClick={() => setBellOpen((o) => !o)}
                aria-label="Notifications"
                className="flex items-center justify-center"
                 style={{ width: 38, height: 38, borderRadius: 14, border: `1px solid ${E.border}`, background: E.card, color: bellOpen ? E.accent : E.sub, position: "relative" }}
              >
                <Bell size={17} />
                <span style={{ position: "absolute", top: 7, right: 8, width: 7, height: 7, borderRadius: "50%", background: E.red, border: `2px solid ${E.card}` }} />
              </button>
              {bellOpen && (
                <>
                  <div style={{ position: "fixed", inset: 0, zIndex: 95 }} onClick={() => setBellOpen(false)} />
                  <div style={{ position: "absolute", top: 42, right: 0, zIndex: 96, width: 280, background: E.card, border: `1px solid ${E.border}`, borderRadius: 13, boxShadow: "0 14px 36px rgba(31,42,68,0.14)", padding: 6 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: E.ink, padding: "6px 10px 8px" }}>Notifications</div>
                    {NOTIFS.map((n, i) => (
                      <button
                        key={i}
                        onClick={() => { setBellOpen(false); toast.info("Opening clinical record…"); }}
                        className="w-full text-left"
                        style={{ padding: "8px 10px", borderRadius: 9, border: "none", background: "transparent", fontSize: 12, color: E.ink, lineHeight: 1.4 }}
                      >
                        {n.text}
                        <span style={{ display: "block", fontSize: 10.5, color: E.faint, marginTop: 2 }}>{n.time} ago</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <Link to="/settings" aria-label="Profile" style={{ textDecoration: "none", flexShrink: 0 }}>
              <span
                className="flex items-center justify-center"
                style={{ width: 36, height: 36, borderRadius: "50%", background: E.accent, color: "#fff", fontSize: 12.5, fontWeight: 700 }}
              >
                {initials}
              </span>
            </Link>
          </div>

          {/* Patient search row */}
          <div ref={searchRef} style={{ position: "relative", padding: "0 12px 10px" }}>
             <div className="flex items-center" style={{ gap: 8, height: 44, borderRadius: 15, border: `1px solid ${E.border}`, background: E.card, padding: "0 12px", boxShadow: "0 3px 14px rgba(22,62,56,0.04)" }}>
              <Search size={15} style={{ color: E.faint, flexShrink: 0 }} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onFocus={() => setQFocus(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setQFocus(false);
                    navigate({ to: "/vet-patients", search: { q: q.trim() } });
                  }
                }}
                placeholder="Search patient, owner, microchip ID…"
                style={{ flex: 1, minWidth: 0, border: "none", background: "transparent", outline: "none", fontSize: 13, color: E.ink }}
              />
            </div>
            {qFocus && q.trim() && (
              <div style={{ position: "absolute", top: 44, left: 12, right: 12, zIndex: 96, background: E.card, border: `1px solid ${E.border}`, borderRadius: 12, boxShadow: "0 14px 36px rgba(31,42,68,0.14)", padding: 6, maxHeight: 320, overflowY: "auto" }}>
                {matches.length === 0 ? (
                  <div style={{ padding: "12px 12px", fontSize: 12.5, color: E.sub }}>No patients match “{q}”.</div>
                ) : (
                  matches.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => openPatient(p.id)}
                      className="w-full flex items-center text-left"
                      style={{ gap: 10, padding: "8px 9px", borderRadius: 9, border: "none", background: "transparent" }}
                    >
                      <PatientAvatar patient={p} size={32} />
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: "block", fontSize: 13, fontWeight: 700, color: E.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name} <span style={{ fontWeight: 500, color: E.sub }}>· {p.breed}</span></span>
                        <span style={{ display: "block", fontSize: 11, color: E.sub, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.owner} · {p.patientCode}</span>
                      </span>
                    </button>
                  ))
                )}
                <button
                  onClick={() => { setQFocus(false); navigate({ to: "/vet-patients", search: { q: q.trim() } }); }}
                  className="w-full text-left"
                  style={{ padding: "9px 11px", borderTop: `1px solid ${E.borderSubtle}`, border: "none", borderRadius: "0 0 9px 9px", background: "transparent", fontSize: 12, fontWeight: 700, color: E.accent }}
                >
                  See all results in Patients →
                </button>
              </div>
            )}
          </div>
        </header>

        {/* ===== Drawer ===== */}
        {drawerOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 200 }}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(20,28,44,0.4)" }} onClick={() => setDrawerOpen(false)} />
            <aside
              style={{
                position: "absolute", top: 0, bottom: 0, left: 0, width: 268,
                background: E.card, display: "flex", flexDirection: "column",
                boxShadow: "8px 0 32px rgba(20,28,44,0.18)",
              }}
            >
              <div className="flex items-center justify-between" style={{ padding: "14px 14px 10px", borderBottom: `1px solid ${E.borderSubtle}` }}>
                <BrandBlock />
                <button onClick={() => setDrawerOpen(false)} aria-label="Close menu" style={{ background: "none", border: "none", color: E.sub, padding: 6 }}>
                  <X size={19} />
                </button>
              </div>
              <SideNav onNavigate={() => setDrawerOpen(false)} />
              {/* Clinic branch selector */}
              <div style={{ padding: "10px 14px 14px", borderTop: `1px solid ${E.borderSubtle}` }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: E.faint, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Clinic branch</div>
                {CLINIC_BRANCHES.map((b) => (
                  <button
                    key={b}
                    onClick={() => { setBranch(b); setDrawerOpen(false); toast.success(`Switched to ${b}`); }}
                    className="w-full flex items-center justify-between text-left"
                    style={{ padding: "8px 10px", borderRadius: 8, border: "none", background: b === branch ? E.pale : "transparent", fontSize: 12.5, fontWeight: b === branch ? 700 : 500, color: E.ink }}
                  >
                    {b}
                    {b === branch && <ChevronDown size={13} style={{ color: E.accent, transform: "rotate(-90deg)" }} />}
                  </button>
                ))}
              </div>
              <Link
                to="/settings"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center"
                style={{ gap: 10, padding: "12px 16px", borderTop: `1px solid ${E.borderSubtle}`, textDecoration: "none" }}
              >
                <span
                  className="flex items-center justify-center"
                  style={{ width: 34, height: 34, borderRadius: "50%", background: E.accent, color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0 }}
                >
                  {initials}
                </span>
                <span style={{ lineHeight: 1.25, minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: E.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{drName}</span>
                  <span style={{ display: "block", fontSize: 10.5, color: E.sub }}>Veterinarian · {branch}</span>
                </span>
              </Link>
            </aside>
          </div>
        )}

        {/* ===== Content ===== */}
         <main className="jaipur-buti" style={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden", WebkitOverflowScrolling: "touch", padding: "18px 16px 44px" }}>
          {(title || actions) && (
            <div className="flex items-end justify-between flex-wrap" style={{ gap: 10, marginBottom: 14 }}>
              <div style={{ minWidth: 0 }}>
                 {title && <h1 style={{ fontSize: 23, fontWeight: 500, color: E.ink, margin: 0 }}>{title}</h1>}
                {subtitle && <div style={{ fontSize: 12.5, color: E.sub, marginTop: 3 }}>{subtitle}</div>}
              </div>
              {actions}
            </div>
          )}
          {children}
        </main>

        {/* ===== Emergency modal ===== */}
        {sosOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(20,28,44,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => setSosOpen(false)}>
            <div onClick={(e) => e.stopPropagation()} style={{ background: E.card, borderRadius: 16, padding: 22, width: "100%", maxWidth: 380, boxShadow: "0 24px 60px rgba(20,28,44,0.25)" }}>
              <div className="flex items-center" style={{ gap: 10 }}>
                <span className="flex items-center justify-center" style={{ width: 38, height: 38, borderRadius: 10, background: E.redSoft, color: E.red }}>
                  <Siren size={19} />
                </span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: E.ink }}>Clinic Emergency Protocol</div>
                  <div style={{ fontSize: 12, color: E.sub }}>Critical case escalation</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
                <button
                  onClick={() => { window.location.href = "tel:+919820001234"; toast.info("Calling 24×7 referral hospital…"); }}
                  className="flex items-center justify-center"
                  style={{ gap: 8, height: 42, borderRadius: 10, border: "none", background: E.red, color: "#fff", fontSize: 13.5, fontWeight: 700 }}
                >
                  <Phone size={15} /> Call 24×7 Referral Hospital
                </button>
                <button
                  onClick={() => { setSosOpen(false); toast.success("Emergency team paged — crash cart to Consult Room 1"); }}
                  style={{ height: 42, borderRadius: 10, border: `1px solid ${E.border}`, background: E.card, color: E.ink, fontSize: 13, fontWeight: 600 }}
                >
                  Page In-Clinic Emergency Team
                </button>
                <button onClick={() => setSosOpen(false)} style={{ height: 36, border: "none", background: "transparent", color: E.sub, fontSize: 12.5, fontWeight: 600 }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
