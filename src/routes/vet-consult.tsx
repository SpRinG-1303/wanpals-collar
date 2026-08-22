import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Check, Trash2, Phone, Video, X } from "lucide-react";
import AppShell from "@/components/AppShell";
import DogAvatar from "@/components/DogAvatar";
import {
  BODY_ZONES, SKIN_HISTORY_PINS, VET_PATIENTS, riskTagsFor, type BodyZone,
} from "@/components/vet/vetData";

export const Route = createFileRoute("/vet-consult")({
  head: () => ({
    meta: [
      { title: "Body Map Consult — Pawsitive Diagnostics Vet" },
      { name: "description", content: "Interactive canine body map: tap zones to log exam findings during a video consultation." },
      { property: "og:title", content: "Body Map Consult — Pawsitive Diagnostics Vet" },
      { property: "og:description", content: "Interactive canine body map for veterinary consultations." },
    ],
  }),
  component: VetConsult,
});

const T = {
  card: "#FFFFFF",
  ink: "var(--text-primary)",
  sub: "var(--text-secondary)",
  accent: "var(--accent-sakura)",
  accentDark: "var(--accent-sakura-dark)",
  soft: "var(--accent-sakura-soft)",
  pale: "var(--acc-pale)",
  red: "#D9534F",
  redSoft: "#FBEBEA",
  green: "#3D9B6E",
  greenSoft: "#E9F6EF",
};
const SHADOW = "0 2px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)";

type LogEntry = { zone: string; issue: string };

/* Side-view dog silhouette with tappable zones */
function DogBodyMap({
  activeZone,
  pins,
  historyZones,
  onZoneTap,
}: {
  activeZone: string | null;
  pins: LogEntry[];
  historyZones: string[];
  onZoneTap: (z: BodyZone) => void;
}) {
  const body = "var(--acc-soft)";
  const bodyDark = "var(--acc-strong)";
  return (
    <svg viewBox="0 0 200 140" style={{ width: "100%", display: "block" }} role="img" aria-label="Interactive dog body map">
      {/* Tail */}
      <path d="M172 62 Q192 52 188 30" stroke={bodyDark} strokeWidth="7" fill="none" strokeLinecap="round" />
      {/* Body */}
      <ellipse cx="115" cy="72" rx="62" ry="32" fill={body} />
      {/* Neck + head (facing left) */}
      <path d="M62 52 Q58 30 40 26 Q22 22 16 36 Q10 50 24 56 Q40 62 58 62 Z" fill={body} />
      {/* Snout */}
      <ellipse cx="16" cy="46" rx="10" ry="7" fill={body} />
      <circle cx="10" cy="44" r="2.6" fill="var(--text-primary)" />
      {/* Ear (upright) */}
      <path d="M40 26 L46 6 L56 24 Z" fill={bodyDark} />
      {/* Eye */}
      <circle cx="30" cy="34" r="3" fill="var(--text-primary)" />
      <circle cx="31" cy="33" r="1" fill="#fff" />
      {/* Legs */}
      <rect x="68" y="92" width="14" height="42" rx="7" fill={body} />
      <rect x="90" y="94" width="14" height="40" rx="7" fill={body} opacity="0.85" />
      <rect x="144" y="92" width="14" height="42" rx="7" fill={body} />
      <rect x="162" y="94" width="14" height="40" rx="7" fill={body} opacity="0.85" />
      {/* Paws */}
      <ellipse cx="75" cy="132" rx="10" ry="5" fill={bodyDark} />
      <ellipse cx="151" cy="132" rx="10" ry="5" fill={bodyDark} />

      {/* SkinSense history pins — glowing red */}
      {BODY_ZONES.filter((z) => historyZones.includes(z.id)).map((z) => (
        <g key={`h-${z.id}`} pointerEvents="none">
          <circle cx={z.cx} cy={z.cy} r="7" fill="#E53935" opacity="0.35">
            <animate attributeName="r" values="5;10;5" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.45;0.08;0.45" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <circle cx={z.cx} cy={z.cy} r="4" fill="#E53935" stroke="#fff" strokeWidth="1.5" />
        </g>
      ))}

      {/* Dropped pins from this consult */}
      {pins.map((p, i) => {
        const z = BODY_ZONES.find((b) => b.id === p.zone);
        if (!z) return null;
        return (
          <g key={`p-${i}`} pointerEvents="none">
            <circle cx={z.cx + 10} cy={z.cy - 10} r="5.5" fill={T.accent} stroke="#fff" strokeWidth="1.5" />
            <text x={z.cx + 10} y={z.cy - 9} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 6.5, fontWeight: 800, fill: "#fff" }}>
              {i + 1}
            </text>
          </g>
        );
      })}

      {/* Tappable zone targets */}
      {BODY_ZONES.map((z) => {
        const active = activeZone === z.id;
        return (
          <g key={z.id} onClick={() => onZoneTap(z)} style={{ cursor: "pointer" }} role="button" aria-label={`Log finding at ${z.label}`}>
            <circle cx={z.cx} cy={z.cy} r={z.r + 5} fill="transparent" />
            <circle
              cx={z.cx} cy={z.cy} r={active ? z.r : z.r * 0.62}
              fill={active ? T.accent : "#FFFFFF"}
              fillOpacity={active ? 0.9 : 0.85}
              stroke={active ? T.accentDark : "var(--acc-strong)"}
              strokeWidth={active ? 2 : 1.4}
              strokeDasharray={active ? "none" : "3 3"}
              style={{ transition: "all 0.2s ease" }}
            />
            <circle cx={z.cx} cy={z.cy} r="2.4" fill={active ? "#fff" : "var(--acc-strong)"} />
          </g>
        );
      })}
    </svg>
  );
}

function VetConsult() {
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState(VET_PATIENTS[1].id); // Coco — first video consult
  const patient = VET_PATIENTS.find((p) => p.id === patientId) ?? VET_PATIENTS[0];
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const history = SKIN_HISTORY_PINS[patient.id] ?? [];
  const historyZones = history.map((h) => h.zoneId);

  const onZoneTap = (z: BodyZone) => setActiveZone(activeZone === z.id ? null : z.id);
  const zone = BODY_ZONES.find((z) => z.id === activeZone) ?? null;

  const addFinding = (issue: string) => {
    if (!zone) return;
    setLog((l) => [...l, { zone: zone.id, issue }]);
    toast.success(`${issue} logged at ${zone.label}`);
    setActiveZone(null);
  };

  const removeEntry = (i: number) => {
    setLog((l) => l.filter((_, idx) => idx !== i));
    toast.info("Finding removed");
  };

  return (
    <AppShell titleJp="" titleEn="Body Map Consult" noPadding>
      <div style={{ padding: "10px 16px 0" }}>
        {/* Patient strip */}
        <div
          className="flex items-center"
          style={{ gap: 12, background: T.card, borderRadius: 18, boxShadow: SHADOW, padding: "11px 13px" }}
        >
          <DogAvatar breed={patient.breedKey} size={46} ring />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: T.ink }}>{patient.name} <span style={{ fontSize: 11, fontWeight: 600, color: T.sub }}>· {patient.breed}</span></div>
            <div className="flex" style={{ gap: 5, marginTop: 4, flexWrap: "wrap" }}>
              {riskTagsFor(patient).slice(0, 2).map((t) => (
                <span key={t.label} style={{ fontSize: 8.5, fontWeight: 700, color: t.tone === "red" ? T.red : "var(--accent-sora)", background: t.tone === "red" ? T.redSoft : T.pale, borderRadius: 6, padding: "2px 6px" }}>
                  {t.label}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => { toast.success(`Calling ${patient.owner}…`); }}
            aria-label="Video call owner"
            className="flex items-center justify-center active:scale-95 transition-transform"
            style={{ width: 40, height: 40, borderRadius: "50%", background: T.accent, color: "#fff", flexShrink: 0, boxShadow: "0 4px 12px color-mix(in oklab, var(--accent-sakura) 35%, transparent)" }}
          >
            <Video size={17} strokeWidth={2} />
          </button>
          <button
            onClick={() => { window.location.href = "tel:+919820001234"; toast.info(`Calling ${patient.owner}…`); }}
            aria-label="Phone call owner"
            className="flex items-center justify-center active:scale-95 transition-transform"
            style={{ width: 40, height: 40, borderRadius: "50%", background: T.pale, color: T.accent, flexShrink: 0 }}
          >
            <Phone size={17} strokeWidth={2} />
          </button>
        </div>

        {/* Patient chips */}
        <div className="flex scrollbar-hide" style={{ gap: 8, overflowX: "auto", margin: "12px -16px 0", padding: "2px 16px" }}>
          {VET_PATIENTS.map((p) => {
            const active = p.id === patientId;
            return (
              <button
                key={p.id}
                onClick={() => { setPatientId(p.id); setActiveZone(null); }}
                className="active:scale-95 transition-transform"
                style={{
                  flexShrink: 0, borderRadius: 13, padding: "6px 12px", fontSize: 11.5, fontWeight: 700,
                  border: active ? "none" : "1.5px solid var(--border-card)",
                  background: active ? T.accent : T.card, color: active ? "#fff" : T.sub,
                }}
              >
                {p.name}
              </button>
            );
          })}
        </div>

        {/* Body map card */}
        <div style={{ background: T.card, borderRadius: 20, boxShadow: SHADOW, padding: 16, marginTop: 12 }}>
          <div className="flex items-center justify-between">
            <div style={{ fontSize: 14, fontWeight: 800, color: T.ink }}>Interactive Body Map</div>
            <span style={{ fontSize: 10, color: T.sub, fontWeight: 600 }}>Tap a zone to log</span>
          </div>
          <div style={{ marginTop: 6 }}>
            <DogBodyMap activeZone={activeZone} pins={log} historyZones={historyZones} onZoneTap={onZoneTap} />
          </div>
          {history.length > 0 && (
            <div className="flex items-start" style={{ gap: 8, marginTop: 8, background: T.redSoft, borderRadius: 12, padding: "9px 11px" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#E53935", flexShrink: 0, marginTop: 4 }} />
              <div style={{ fontSize: 11, lineHeight: 1.5, color: T.red, fontWeight: 600 }}>
                {history.map((h) => h.note).join(" · ")} — glowing marker on model.
              </div>
            </div>
          )}
        </div>

        {/* Consultation notes */}
        <div className="flex items-center justify-between" style={{ margin: "20px 0 10px" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.ink }}>Findings ({log.length})</div>
          {log.length > 0 && (
            <button
              onClick={() => { toast.success(`Consult summary for ${patient.name} saved to record`); navigate({ to: "/vet-rx" }); }}
              style={{ fontSize: 12, fontWeight: 700, color: T.accent, background: "none", border: "none" }}
            >
              Save & Prescribe
            </button>
          )}
        </div>
        {log.length === 0 ? (
          <div style={{ background: T.card, borderRadius: 18, boxShadow: SHADOW, padding: "18px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 12.5, color: T.sub, lineHeight: 1.55 }}>
              No findings yet. Tap a zone on the dog — ear, paw, abdomen — to open its quick-log menu.
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
            {log.map((entry, i) => {
              const z = BODY_ZONES.find((b) => b.id === entry.zone);
              return (
                <div key={i} className="flex items-center" style={{ gap: 10, background: T.card, borderRadius: 14, boxShadow: SHADOW, padding: "11px 13px" }}>
                  <span className="flex items-center justify-center" style={{ width: 26, height: 26, borderRadius: "50%", background: T.pale, color: T.accent, fontSize: 11, fontWeight: 800, flexShrink: 0 }}>
                    {i + 1}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>{entry.issue}</div>
                    <div style={{ fontSize: 10.5, color: T.sub, marginTop: 1 }}>{z?.label}</div>
                  </div>
                  <button onClick={() => removeEntry(i)} aria-label="Remove finding" className="flex items-center justify-center" style={{ width: 30, height: 30, borderRadius: 10, color: T.sub, background: "none", border: "none" }}>
                    <Trash2 size={15} strokeWidth={2} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick-log bottom sheet */}
      <AnimatePresence>
        {zone && (
          <div className="fixed inset-0 z-[120] flex items-end justify-center" style={{ background: "rgba(20,25,35,0.45)" }} onClick={() => setActiveZone(null)}>
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%", maxWidth: 430, background: T.card,
                borderRadius: "24px 24px 0 0", padding: "14px 20px calc(20px + env(safe-area-inset-bottom))",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: T.sub, letterSpacing: "0.06em", textTransform: "uppercase" }}>Quick-Log</div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: T.ink, marginTop: 2 }}>{zone.label}</div>
                </div>
                <button onClick={() => setActiveZone(null)} aria-label="Close" className="flex items-center justify-center" style={{ width: 34, height: 34, borderRadius: "50%", background: T.pale, color: T.sub, border: "none" }}>
                  <X size={17} strokeWidth={2.2} />
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
                {zone.issues.map((issue) => (
                  <button
                    key={issue}
                    onClick={() => addFinding(issue)}
                    className="flex items-center active:scale-[0.98] transition-transform"
                    style={{
                      gap: 10, padding: "12px 14px", borderRadius: 14, textAlign: "left",
                      background: T.pale, border: "1.5px solid transparent",
                    }}
                  >
                    <Check size={16} strokeWidth={2.4} style={{ color: T.accent, flexShrink: 0 }} />
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: T.ink }}>{issue}</span>
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 10.5, color: T.sub, marginTop: 12, textAlign: "center" }}>
                Finding is pinned to {zone.label} on the body map.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
