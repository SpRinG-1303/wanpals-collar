import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Pill, FlaskConical, ShieldCheck, ShieldAlert, AlertTriangle, ChevronDown,
  Trash2, Check, Plus,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import DogAvatar from "@/components/DogAvatar";
import {
  MEDICATIONS, TOXINS, VET_PATIENTS, calcToxicity, checkMedication,
  isMdr1Sensitive, type SafetyFlag,
} from "@/components/vet/vetData";

export const Route = createFileRoute("/vet-rx")({
  head: () => ({
    meta: [
      { title: "e-Prescription & Toxicity Calculator — MOooMENTUM Vet" },
      { name: "description", content: "Canine e-prescription with MDR1 toxic-check engine and a weight-synced toxin dose calculator." },
      { property: "og:title", content: "e-Prescription & Toxicity Calculator — MOooMENTUM Vet" },
      { property: "og:description", content: "Canine e-prescription with breed-aware safety checks and toxicity calculator." },
    ],
  }),
  component: VetRx,
});

const T = {
  card: "#FFFFFF",
  ink: "var(--text-primary)",
  sub: "var(--text-secondary)",
  accent: "var(--accent-sakura)",
  pale: "var(--acc-pale)",
  deep: "var(--acc-deep)",
  red: "#D9534F",
  redSoft: "#FBEBEA",
  amber: "#D9930D",
  amberSoft: "#FCF3E0",
  green: "#3D9B6E",
  greenSoft: "#E9F6EF",
};
const SHADOW = "0 2px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)";

const FLAG_STYLE: Record<SafetyFlag["level"], { Icon: typeof ShieldCheck; fg: string; bg: string }> = {
  danger: { Icon: ShieldAlert, fg: T.red, bg: T.redSoft },
  caution: { Icon: AlertTriangle, fg: T.amber, bg: T.amberSoft },
  ok: { Icon: ShieldCheck, fg: T.green, bg: T.greenSoft },
};

type RxLine = { medId: string; dose: string; duration: string };

function VetRx() {
  const [patientId, setPatientId] = useState(VET_PATIENTS[0].id);
  const patient = VET_PATIENTS.find((p) => p.id === patientId) ?? VET_PATIENTS[0];

  /* --- e-Rx state --- */
  const [medId, setMedId] = useState(MEDICATIONS[0].id);
  const [dose, setDose] = useState("");
  const [duration, setDuration] = useState("7 days");
  const [rx, setRx] = useState<RxLine[]>([]);
  const med = MEDICATIONS.find((m) => m.id === medId) ?? MEDICATIONS[0];
  const flags = useMemo(() => checkMedication(med, patient), [med, patient]);

  /* --- Toxicity calculator state --- */
  const [toxinId, setToxinId] = useState(TOXINS[0].id);
  const [amount, setAmount] = useState("");
  const [weight, setWeight] = useState(String(patient.weightKg));
  const toxin = TOXINS.find((t) => t.id === toxinId) ?? TOXINS[0];
  const result = useMemo(() => {
    const a = parseFloat(amount);
    const w = parseFloat(weight);
    if (!a || a <= 0 || !w || w <= 0) return null;
    return calcToxicity(toxin, a, w);
  }, [amount, weight, toxin]);

  const switchPatient = (id: string) => {
    setPatientId(id);
    const p = VET_PATIENTS.find((x) => x.id === id);
    if (p) setWeight(String(p.weightKg));
  };

  const addLine = () => {
    if (!dose.trim()) {
      toast.error("Enter a dose, e.g. 25 mg twice daily");
      return;
    }
    if (flags.some((f) => f.level === "danger")) {
      toast.error(`${med.name} is flagged for ${patient.breed} — resolve the safety warning first`);
      return;
    }
    setRx((r) => [...r, { medId, dose: dose.trim(), duration }]);
    setDose("");
    toast.success(`${med.name} added to ${patient.name}'s prescription`);
  };

  const levelTone = result
    ? result.level === "severe"
      ? { fg: T.red, bg: T.redSoft, label: "SEVERE TOXICITY" }
      : result.level === "moderate"
        ? { fg: T.amber, bg: T.amberSoft, label: "MODERATE RISK" }
        : result.level === "mild"
          ? { fg: T.amber, bg: T.amberSoft, label: "MILD EXPOSURE" }
          : { fg: T.green, bg: T.greenSoft, label: "BELOW TOXIC DOSE" }
    : null;

  const inputStyle: React.CSSProperties = {
    width: "100%", height: 44, borderRadius: 12, border: "1.5px solid var(--border-card)",
    background: "var(--bg-page)", padding: "0 12px", fontSize: 13.5, fontWeight: 600,
    color: T.ink, outline: "none", appearance: "none",
  };

  return (
    <AppShell titleJp="" titleEn="e-Rx & Toxicity" noPadding>
      <div style={{ padding: "10px 16px 24px" }}>
        {/* Patient strip */}
        <div className="flex items-center" style={{ gap: 12, background: T.card, borderRadius: 18, boxShadow: SHADOW, padding: "11px 13px" }}>
          <DogAvatar breed={patient.breedKey} size={46} ring />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: T.ink }}>{patient.name}</div>
            <div style={{ fontSize: 11, color: T.sub, marginTop: 1 }}>
              {patient.breed} · {patient.weightKg} kg
              {isMdr1Sensitive(patient.breed) && (
                <span style={{ color: T.red, fontWeight: 700 }}> · MDR1 sensitive</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex scrollbar-hide" style={{ gap: 8, overflowX: "auto", margin: "12px -16px 0", padding: "2px 16px" }}>
          {VET_PATIENTS.map((p) => {
            const active = p.id === patientId;
            return (
              <button
                key={p.id}
                onClick={() => switchPatient(p.id)}
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

        {/* ============ e-Prescription ============ */}
        <div style={{ background: T.card, borderRadius: 20, boxShadow: SHADOW, padding: 16, marginTop: 14 }}>
          <div className="flex items-center" style={{ gap: 9 }}>
            <div className="flex items-center justify-center" style={{ width: 34, height: 34, borderRadius: 11, background: T.pale }}>
              <Pill size={17} strokeWidth={2} style={{ color: T.accent }} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: T.ink }}>e-Prescription</div>
              <div style={{ fontSize: 10, color: T.sub }}>Breed-aware Toxic-Check Engine</div>
            </div>
          </div>

          {/* Medication select */}
          <div style={{ marginTop: 14 }}>
            <label style={{ fontSize: 10.5, fontWeight: 700, color: T.sub, letterSpacing: "0.04em", textTransform: "uppercase" }}>Medication</label>
            <div style={{ position: "relative", marginTop: 5 }}>
              <select value={medId} onChange={(e) => setMedId(e.target.value)} style={{ ...inputStyle, paddingRight: 34 }}>
                {MEDICATIONS.map((m) => (
                  <option key={m.id} value={m.id}>{m.name} — {m.category}</option>
                ))}
              </select>
              <ChevronDown size={16} style={{ position: "absolute", right: 12, top: 14, color: T.sub, pointerEvents: "none" }} />
            </div>
            <div style={{ fontSize: 10.5, color: T.sub, marginTop: 5, lineHeight: 1.45 }}>{med.notes}</div>
          </div>

          {/* Safety flags — live cross-reference */}
          <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 12 }}>
            {flags.map((f, i) => {
              const S = FLAG_STYLE[f.level];
              return (
                <div key={i} className="flex items-start" style={{ gap: 8, background: S.bg, borderRadius: 12, padding: "9px 11px" }}>
                  <S.Icon size={15} strokeWidth={2.2} style={{ color: S.fg, flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 11.5, lineHeight: 1.5, color: S.fg, fontWeight: 600 }}>{f.text}</span>
                </div>
              );
            })}
          </div>

          {/* Dose + duration */}
          <div className="flex" style={{ gap: 10, marginTop: 12 }}>
            <div style={{ flex: 1.4 }}>
              <label style={{ fontSize: 10.5, fontWeight: 700, color: T.sub, letterSpacing: "0.04em", textTransform: "uppercase" }}>Dose</label>
              <input value={dose} onChange={(e) => setDose(e.target.value)} placeholder="e.g. 25 mg BID" style={{ ...inputStyle, marginTop: 5 }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 10.5, fontWeight: 700, color: T.sub, letterSpacing: "0.04em", textTransform: "uppercase" }}>Duration</label>
              <div style={{ position: "relative", marginTop: 5 }}>
                <select value={duration} onChange={(e) => setDuration(e.target.value)} style={{ ...inputStyle, paddingRight: 30 }}>
                  {["3 days", "5 days", "7 days", "14 days", "30 days"].map((d) => <option key={d}>{d}</option>)}
                </select>
                <ChevronDown size={15} style={{ position: "absolute", right: 10, top: 14, color: T.sub, pointerEvents: "none" }} />
              </div>
            </div>
          </div>

          <button
            onClick={addLine}
            className="flex items-center justify-center active:scale-[0.98] transition-transform"
            style={{
              width: "100%", height: 46, borderRadius: 14, border: "none", marginTop: 14,
              background: flags.some((f) => f.level === "danger") ? "var(--text-placeholder)" : T.accent,
              color: "#fff", fontSize: 13.5, fontWeight: 700, gap: 7,
              boxShadow: flags.some((f) => f.level === "danger") ? "none" : "0 6px 16px color-mix(in oklab, var(--accent-sakura) 35%, transparent)",
            }}
          >
            <Plus size={16} strokeWidth={2.5} />
            {flags.some((f) => f.level === "danger") ? "Blocked — safety warning" : "Add to Prescription"}
          </button>

          {/* Rx lines */}
          {rx.length > 0 && (
            <div style={{ marginTop: 14, borderTop: "1px solid var(--border-subtle)", paddingTop: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.sub, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 8 }}>
                Prescription for {patient.name} ({rx.length})
              </div>
              {rx.map((line, i) => {
                const m = MEDICATIONS.find((x) => x.id === line.medId)!;
                return (
                  <div key={i} className="flex items-center" style={{ gap: 9, padding: "9px 0", borderTop: i === 0 ? "none" : "1px solid var(--border-subtle)" }}>
                    <Check size={15} strokeWidth={2.5} style={{ color: T.green, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>{m.name}</div>
                      <div style={{ fontSize: 10.5, color: T.sub, marginTop: 1 }}>{line.dose} · {line.duration}</div>
                    </div>
                    <button onClick={() => setRx((r) => r.filter((_, idx) => idx !== i))} aria-label="Remove medication" style={{ background: "none", border: "none", color: T.sub, padding: 4 }}>
                      <Trash2 size={14} strokeWidth={2} />
                    </button>
                  </div>
                );
              })}
              <button
                onClick={() => toast.success(`Prescription sent to ${patient.owner} and logged to ${patient.name}'s record`)}
                className="flex items-center justify-center active:scale-[0.98] transition-transform"
                style={{ width: "100%", height: 42, borderRadius: 13, border: "none", marginTop: 10, background: T.green, color: "#fff", fontSize: 13, fontWeight: 700 }}
              >
                Send to Owner
              </button>
            </div>
          )}
        </div>

        {/* ============ Toxicity calculator ============ */}
        <div style={{ background: T.card, borderRadius: 20, boxShadow: SHADOW, padding: 16, marginTop: 14 }}>
          <div className="flex items-center" style={{ gap: 9 }}>
            <div className="flex items-center justify-center" style={{ width: 34, height: 34, borderRadius: 11, background: T.redSoft }}>
              <FlaskConical size={17} strokeWidth={2} style={{ color: T.red }} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: T.ink }}>Toxicity Calculator</div>
              <div style={{ fontSize: 10, color: T.sub }}>Dose scaled to {patient.name}'s synced weight</div>
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <label style={{ fontSize: 10.5, fontWeight: 700, color: T.sub, letterSpacing: "0.04em", textTransform: "uppercase" }}>Dog ate…</label>
            <div className="flex flex-wrap" style={{ gap: 7, marginTop: 6 }}>
              {TOXINS.map((tx) => {
                const active = tx.id === toxinId;
                return (
                  <button
                    key={tx.id}
                    onClick={() => setToxinId(tx.id)}
                    className="active:scale-95 transition-transform"
                    style={{
                      borderRadius: 11, padding: "7px 11px", fontSize: 11.5, fontWeight: 700,
                      border: active ? "none" : "1.5px solid var(--border-card)",
                      background: active ? T.red : "var(--bg-page)", color: active ? "#fff" : T.sub,
                    }}
                  >
                    {tx.name}
                  </button>
                );
              })}
            </div>
            <div style={{ fontSize: 10, color: T.sub, marginTop: 6 }}>{toxin.hint}</div>
          </div>

          <div className="flex" style={{ gap: 10, marginTop: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 10.5, fontWeight: 700, color: T.sub, letterSpacing: "0.04em", textTransform: "uppercase" }}>Amount ({toxin.unitLabel})</label>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                inputMode="decimal"
                placeholder={toxin.unit === "pieces" ? "e.g. 5" : "e.g. 200"}
                style={{ ...inputStyle, marginTop: 5 }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 10.5, fontWeight: 700, color: T.sub, letterSpacing: "0.04em", textTransform: "uppercase" }}>Weight (kg)</label>
              <input
                value={weight}
                onChange={(e) => setWeight(e.target.value.replace(/[^0-9.]/g, ""))}
                inputMode="decimal"
                style={{ ...inputStyle, marginTop: 5 }}
              />
            </div>
          </div>

          {result && levelTone && (
            <div style={{ marginTop: 14, borderRadius: 14, background: levelTone.bg, padding: 13 }}>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: 11, fontWeight: 800, color: levelTone.fg, letterSpacing: "0.05em" }}>{levelTone.label}</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: levelTone.fg, fontVariantNumeric: "tabular-nums" }}>
                  {result.doseMgKg} mg/kg
                </span>
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.55, color: levelTone.fg, fontWeight: 600, marginTop: 7 }}>
                {result.advice}
              </div>
            </div>
          )}
          {!result && (
            <div style={{ marginTop: 12, fontSize: 11, color: T.sub, textAlign: "center" }}>
              Enter an amount — e.g. “{patient.name} ate 200 g of dark chocolate”.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
