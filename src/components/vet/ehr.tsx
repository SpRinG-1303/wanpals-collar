import type { CSSProperties, ReactNode } from "react";
import DogAvatar from "@/components/DogAvatar";
import type { VetPatient } from "./vetData";

/* ============ EHR design tokens (professional clinical theme) ============ */
/* Colors resolve through the role-aware CSS variables so the veterinarian
   steel-blue theme keeps working; status colors are fixed clinical hues. */
export const E = {
  bg: "var(--ehr-bg, #F4F6FA)",
  card: "var(--bg-card)",
  ink: "var(--ehr-navy, #1F2A44)",
  sub: "var(--text-secondary)",
  faint: "var(--text-placeholder)",
  accent: "var(--acc-strong)",
  accentDeep: "var(--acc-deep)",
  pale: "var(--acc-pale)",
  border: "var(--border-card)",
  borderSubtle: "var(--border-subtle)",
  green: "var(--accent-matcha)",
  greenSoft: "var(--acc-pale)",
  amber: "var(--acc2-deep)",
  amberSoft: "var(--bg-card-peach)",
  red: "var(--accent-red)",
  redSoft: "var(--acc2-pale)",
  blue: "var(--acc-strong)",
  blueSoft: "var(--acc-pale)",
  grey: "#6B7686",
  greySoft: "#EFF1F5",
};

export const EHR_SHADOW = "var(--shadow-card)";
export const EHR_RADIUS = 20;

/* ============ Primitives ============ */

export function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        background: E.card,
        border: `1px solid ${E.border}`,
        borderRadius: EHR_RADIUS,
        boxShadow: EHR_SHADOW,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

type Tone = "green" | "amber" | "red" | "blue" | "grey";

const TONE_STYLE: Record<Tone, { fg: string; bg: string }> = {
  green: { fg: E.green, bg: E.greenSoft },
  amber: { fg: E.amber, bg: E.amberSoft },
  red: { fg: E.red, bg: E.redSoft },
  blue: { fg: E.blue, bg: E.blueSoft },
  grey: { fg: E.grey, bg: E.greySoft },
};

export function Chip({ tone = "grey", children, dot = false, style }: { tone?: Tone; children: ReactNode; dot?: boolean; style?: CSSProperties }) {
  const s = TONE_STYLE[tone];
  return (
    <span
      className="inline-flex items-center"
      style={{
        gap: 5,
        fontSize: 11,
        fontWeight: 600,
        color: s.fg,
        background: s.bg,
        borderRadius: 999,
        padding: "4px 10px",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.fg, flexShrink: 0 }} />}
      {children}
    </span>
  );
}

export function SectionTitle({ children, sub, right }: { children: ReactNode; sub?: string; right?: ReactNode }) {
  return (
    <div className="flex items-end justify-between" style={{ marginBottom: 12 }}>
      <div>
        <div style={{ fontSize: 17, fontWeight: 500, color: E.ink, fontFamily: "var(--font-display)" }}>{children}</div>
        {sub && <div style={{ fontSize: 12, color: E.sub, marginTop: 2 }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
}

export function PrimaryBtn({ children, onClick, disabled, style }: { children: ReactNode; onClick?: () => void; disabled?: boolean; style?: CSSProperties }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center active:scale-[0.98] transition-transform"
      style={{
        height: 38,
        padding: "0 16px",
        borderRadius: 14,
        border: "none",
        background: disabled ? "var(--text-placeholder)" : E.accent,
        color: "var(--primary-foreground)",
        fontSize: 13,
        fontWeight: 600,
        gap: 7,
        cursor: disabled ? "not-allowed" : "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function GhostBtn({ children, onClick, style }: { children: ReactNode; onClick?: () => void; style?: CSSProperties }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center active:scale-[0.98] transition-transform"
      style={{
        height: 38,
        padding: "0 16px",
        borderRadius: 14,
        border: `1px solid ${E.border}`,
        background: E.card,
        color: E.ink,
        fontSize: 13,
        fontWeight: 600,
        gap: 7,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: E.sub, letterSpacing: "0.03em", textTransform: "uppercase", marginBottom: 5 }}>
      {children}
    </label>
  );
}

export const inputStyle: CSSProperties = {
  width: "100%",
  height: 44,
  borderRadius: 14,
  border: `1px solid ${E.border}`,
  background: E.card,
  padding: "0 11px",
  fontSize: 13,
  fontWeight: 500,
  color: E.ink,
  outline: "none",
};

export const textareaStyle: CSSProperties = {
  ...inputStyle,
  height: "auto",
  minHeight: 76,
  padding: "9px 11px",
  lineHeight: 1.5,
  resize: "vertical",
};

/* Compact professional patient avatar — real photo-style avatar for dogs,
   initials monogram for cats/other species. */
export function PatientAvatar({ patient, size = 44 }: { patient: VetPatient; size?: number }) {
  if (patient.species !== "dog") {
    return (
      <span
        className="flex items-center justify-center"
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: E.pale,
          border: `1px solid ${E.border}`,
          color: E.accentDeep,
          fontSize: size * 0.36,
          fontWeight: 700,
          flexShrink: 0,
        }}
        aria-label={patient.name}
      >
        {patient.name.slice(0, 1)}
      </span>
    );
  }
  return (
    <span style={{ width: size, height: size, flexShrink: 0, display: "block" }}>
      <DogAvatar breed={patient.breedKey} size={size} ring={false} showCollar={false} showCheeks={false} />
    </span>
  );
}
