import { BODY_ZONES, type BodyZone } from "./vetData";
import { E } from "./ehr";

export type MapPin = { zone: string; label: string };

/**
 * Clinical body map — a muted, professional examination tool used INSIDE the
 * consultation workflow (never as a primary screen). Tap a zone to attach a
 * finding to that region.
 */
export default function BodyMap({
  activeZone,
  pins,
  historyZones,
  onZoneTap,
}: {
  activeZone: string | null;
  pins: MapPin[];
  historyZones: string[];
  onZoneTap: (z: BodyZone) => void;
}) {
  const body = "var(--acc-soft)";
  const bodyDark = "var(--acc-strong)";
  return (
    <svg viewBox="0 0 200 140" style={{ width: "100%", display: "block" }} role="img" aria-label="Canine body map — examination regions">
      {/* Tail */}
      <path d="M172 62 Q192 52 188 30" stroke={bodyDark} strokeWidth="7" fill="none" strokeLinecap="round" />
      {/* Body */}
      <ellipse cx="115" cy="72" rx="62" ry="32" fill={body} />
      {/* Neck + head (facing left) */}
      <path d="M62 52 Q58 30 40 26 Q22 22 16 36 Q10 50 24 56 Q40 62 58 62 Z" fill={body} />
      {/* Snout */}
      <ellipse cx="16" cy="46" rx="10" ry="7" fill={body} />
      <circle cx="10" cy="44" r="2.6" fill={E.ink} />
      {/* Ear (upright) */}
      <path d="M40 26 L46 6 L56 24 Z" fill={bodyDark} />
      {/* Eye */}
      <circle cx="30" cy="34" r="3" fill={E.ink} />
      <circle cx="31" cy="33" r="1" fill="#fff" />
      {/* Legs */}
      <rect x="68" y="92" width="14" height="42" rx="7" fill={body} />
      <rect x="90" y="94" width="14" height="40" rx="7" fill={body} opacity="0.85" />
      <rect x="144" y="92" width="14" height="42" rx="7" fill={body} />
      <rect x="162" y="94" width="14" height="40" rx="7" fill={body} opacity="0.85" />
      {/* Paws */}
      <ellipse cx="75" cy="132" rx="10" ry="5" fill={bodyDark} />
      <ellipse cx="151" cy="132" rx="10" ry="5" fill={bodyDark} />

      {/* Prior AI-upload history markers (subtle outline) */}
      {BODY_ZONES.filter((z) => historyZones.includes(z.id)).map((z) => (
        <g key={`h-${z.id}`} pointerEvents="none">
          <circle cx={z.cx} cy={z.cy} r="6" fill="none" stroke={E.red} strokeWidth="1.6" strokeDasharray="3 2" />
          <circle cx={z.cx} cy={z.cy} r="2.4" fill={E.red} />
        </g>
      ))}

      {/* Pins recorded this consultation */}
      {pins.map((p, i) => {
        const z = BODY_ZONES.find((b) => b.id === p.zone);
        if (!z) return null;
        return (
          <g key={`p-${i}`} pointerEvents="none">
            <circle cx={z.cx + 10} cy={z.cy - 10} r="5.5" fill={E.accent} stroke="#fff" strokeWidth="1.5" />
            <text x={z.cx + 10} y={z.cy - 9} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 6.5, fontWeight: 800, fill: "#fff" }}>
              {i + 1}
            </text>
          </g>
        );
      })}

      {/* Region targets */}
      {BODY_ZONES.map((z) => {
        const active = activeZone === z.id;
        return (
          <g key={z.id} onClick={() => onZoneTap(z)} style={{ cursor: "pointer" }} role="button" aria-label={`Record finding at ${z.label}`}>
            <circle cx={z.cx} cy={z.cy} r={z.r + 5} fill="transparent" />
            <circle
              cx={z.cx} cy={z.cy} r={active ? z.r : z.r * 0.6}
              fill={active ? E.accent : "#FFFFFF"}
              fillOpacity={active ? 0.9 : 0.85}
              stroke={active ? E.accentDeep : "var(--acc-strong)"}
              strokeWidth={active ? 2 : 1.3}
              strokeDasharray={active ? "none" : "3 3"}
              style={{ transition: "all 0.18s ease" }}
            />
            <circle cx={z.cx} cy={z.cy} r="2.2" fill={active ? "#fff" : "var(--acc-strong)"} />
          </g>
        );
      })}
    </svg>
  );
}
