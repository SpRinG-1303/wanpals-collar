import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ChevronDown, ChevronUp, Plus, Trash2, X, Stethoscope, Paperclip,
  ShieldCheck, ShieldAlert, AlertTriangle, Printer, Send, Save,
} from "lucide-react";
import { toast } from "sonner";
import VetShell from "@/components/vet/VetShell";
import BodyMap from "@/components/vet/BodyMap";
import { Card, Chip, E, FieldLabel, GhostBtn, PatientAvatar, PrimaryBtn, inputStyle, textareaStyle } from "@/components/vet/ehr";
import {
  APPOINTMENTS, BODY_ZONES, COMMON_DIAGNOSES, MEDICATIONS, RX_DURATIONS, RX_FREQUENCIES,
  RX_ROUTES, SKIN_HISTORY_PINS, VET_PATIENTS, baselineFor, checkMedication,
  patientById, riskTagsFor, type BodyZone,
} from "@/components/vet/vetData";

type Search = { patient?: string };

export const Route = createFileRoute("/vet-consult")({
  validateSearch: (s: Record<string, unknown>): Search => ({ patient: typeof s.patient === "string" ? s.patient : undefined }),
  head: () => ({
    meta: [
      { title: "Consultation — Pawsitive Diagnostics Veterinary" },
      { name: "description", content: "Clinical consultation workspace: vitals, examination findings, diagnosis, prescription and follow-up." },
      { property: "og:title", content: "Consultation — Pawsitive Diagnostics Veterinary" },
      { property: "og:description", content: "Clinical consultation workspace for veterinarians." },
    ],
  }),
  component: VetConsult,
});

const OBSERVATION_SYSTEMS = [
  "General appearance", "Hydration", "Respiratory", "Cardiovascular",
  "Gastrointestinal", "Neurological", "Musculoskeletal", "Dermatological",
];

type Finding = { zone: string; zoneLabel: string; finding: string; severity: "Mild" | "Moderate" | "Severe"; notes: string; photo?: string };
type RxLine = { medId: string; dose: string; route: string; frequency: string; duration: string; instructions: string };

const FLAG_STYLE = {
  danger: { Icon: ShieldAlert, fg: E.red, bg: E.redSoft },
  caution: { Icon: AlertTriangle, fg: E.amber, bg: E.amberSoft },
  ok: { Icon: ShieldCheck, fg: E.green, bg: E.greenSoft },
} as const;

function VetConsult() {
  const { patient: patientParam } = Route.useSearch();
  const navigate = useNavigate();
  const patient = patientById(patientParam);

  /* --- vitals --- */
  const [vitals, setVitals] = useState({ temp: "", hr: "", rr: "", weight: "", spo2: "" });
  /* --- observations --- */
  const [obsOpen, setObsOpen] = useState<string | null>(null);
  const [obs, setObs] = useState<Record<string, { status: "Normal" | "Abnormal" | null; note: string }>>({});
  /* --- body map --- */
  const [mapOpen, setMapOpen] = useState(false);
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [findingForm, setFindingForm] = useState({ finding: "", severity: "Moderate" as Finding["severity"], notes: "", photo: "" });
  /* --- assessment --- */
  const [primary, setPrimary] = useState("");
  const [diffs, setDiffs] = useState<string[]>([]);
  const [diffInput, setDiffInput] = useState("");
  const [notes, setNotes] = useState("");
  /* --- prescription --- */
  const [medId, setMedId] = useState(MEDICATIONS[0].id);
  const [dose, setDose] = useState("");
  const [route, setRoute] = useState(RX_ROUTES[0]);
  const [frequency, setFrequency] = useState(RX_FREQUENCIES[1]);
  const [duration, setDuration] = useState(RX_DURATIONS[2]);
  const [instructions, setInstructions] = useState("");
  const [rx, setRx] = useState<RxLine[]>([]);
  /* --- follow-up --- */
  const [fuDate, setFuDate] = useState(() => { const d = new Date(); d.setDate(d.getDate() + 14); return d.toISOString().slice(0, 10); });
  const [fuReason, setFuReason] = useState("");
  const [fuRemind, setFuRemind] = useState(true);

  const med = MEDICATIONS.find((m) => m.id === medId) ?? MEDICATIONS[0];
  const flags = useMemo(() => (patient ? checkMedication(med, patient) : []), [med, patient]);
  const doseTotal = patient && dose ? Math.round(parseFloat(dose) * patient.weightKg * 10) / 10 : null;

  /* ============ Patient picker when none selected ============ */
  if (!patient) {
    const queueIds = [...new Set(APPOINTMENTS.filter((a) => a.status !== "completed").map((a) => a.patientId))];
    return (
      <VetShell title="Consultations" subtitle="Select a patient to begin a consultation">
        <Card style={{ overflow: "hidden" }}>
          <div style={{ padding: "13px 16px", borderBottom: `1px solid ${E.borderSubtle}`, fontSize: 13.5, fontWeight: 700, color: E.ink }}>
            Today's Queue
          </div>
          {queueIds.map((pid, i) => {
            const p = patientById(pid)!;
            const appt = APPOINTMENTS.find((a) => a.patientId === pid && a.status !== "completed")!;
            return (
              <button
                key={pid}
                onClick={() => navigate({ to: "/vet-consult", search: { patient: pid } })}
                className="w-full flex items-center text-left"
                style={{ gap: 12, padding: "12px 16px", borderTop: i === 0 ? "none" : `1px solid ${E.borderSubtle}`, border: "none", background: "transparent" }}
              >
                <PatientAvatar patient={p} size={38} />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 13.5, fontWeight: 700, color: E.ink }}>{p.name} <span style={{ fontWeight: 500, color: E.sub }}>· {p.breed}</span></span>
                  <span style={{ display: "block", fontSize: 11.5, color: E.sub, marginTop: 1 }}>{appt.time} · {appt.reason} · {p.owner}</span>
                </span>
                <span className="flex items-center" style={{ gap: 5, fontSize: 12, fontWeight: 700, color: E.accent }}>
                  <Stethoscope size={14} /> Begin
                </span>
              </button>
            );
          })}
        </Card>
        <div style={{ marginTop: 12, fontSize: 12, color: E.sub, textAlign: "center" }}>
          Or open any patient from the{" "}
          <button onClick={() => navigate({ to: "/vet-patients", search: { q: "" } })} style={{ background: "none", border: "none", color: E.accent, fontWeight: 700, fontSize: 12, padding: 0 }}>patient directory</button>.
        </div>
      </VetShell>
    );
  }

  const appt = APPOINTMENTS.find((a) => a.patientId === patient.id && a.status !== "completed");
  const zone = BODY_ZONES.find((z) => z.id === activeZone) ?? null;
  const history = SKIN_HISTORY_PINS[patient.id] ?? [];
  const base = baselineFor(patient);

  const onZoneTap = (z: BodyZone) => {
    setActiveZone(activeZone === z.id ? null : z.id);
    setFindingForm({ finding: "", severity: "Moderate", notes: "", photo: "" });
  };

  const addFinding = () => {
    if (!zone || !findingForm.finding.trim()) {
      toast.error("Select a region and enter a finding.");
      return;
    }
    setFindings((f) => [...f, { zone: zone.id, zoneLabel: zone.label, finding: findingForm.finding.trim(), severity: findingForm.severity, notes: findingForm.notes.trim(), photo: findingForm.photo || undefined }]);
    setActiveZone(null);
    setFindingForm({ finding: "", severity: "Moderate", notes: "", photo: "" });
    toast.success("Finding recorded.");
  };

  const addRxLine = () => {
    if (!dose.trim() || parseFloat(dose) <= 0) {
      toast.error("Enter a dose in mg/kg.");
      return;
    }
    if (flags.some((f) => f.level === "danger")) {
      toast.error(`${med.name} is flagged for ${patient.name} — resolve the safety warning first.`);
      return;
    }
    setRx((r) => [...r, { medId, dose: dose.trim(), route, frequency, duration, instructions: instructions.trim() }]);
    setDose(""); setInstructions("");
    toast.success(`${med.name} added to prescription.`);
  };

  const saveConsultation = (sendRx: boolean) => {
    if (!primary.trim()) {
      toast.error("A primary diagnosis is required to save the consultation.");
      return;
    }
    if (sendRx && rx.length === 0) {
      toast.error("Add at least one medication, or use Save Consultation instead.");
      return;
    }
    toast.success(sendRx
      ? `Consultation saved — prescription sent to ${patient.owner}.`
      : `Consultation saved to ${patient.name}'s record (${patient.patientCode}).`);
    navigate({ to: "/vet-patient/$id", params: { id: patient.id } });
  };

  const vitalFields: { key: keyof typeof vitals; label: string; unit: string; hint: string }[] = [
    { key: "temp", label: "Temperature", unit: "°C", hint: `Ref ${base.temp[0]}–${base.temp[1]}` },
    { key: "hr", label: "Heart Rate", unit: "bpm", hint: `Ref ${base.hr[0]}–${base.hr[1]}` },
    { key: "rr", label: "Respiratory Rate", unit: "/min", hint: `Ref ${base.rr[0]}–${base.rr[1]}` },
    { key: "weight", label: "Weight", unit: "kg", hint: `Last ${patient.weightKg} kg` },
    { key: "spo2", label: "SpO₂", unit: "%", hint: "Ref 95–100" },
  ];

  return (
    <VetShell>
      <div className="grid grid-cols-1" style={{ gap: 16, alignItems: "start" }}>
        {/* ============ Main consultation column ============ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
          {/* Current consultation header */}
          <Card style={{ padding: 16 }}>
            <div className="flex items-center" style={{ gap: 12 }}>
              <PatientAvatar patient={patient} size={48} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: E.accent, letterSpacing: "0.06em", textTransform: "uppercase" }}>Current Consultation</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: E.ink, marginTop: 1 }}>{patient.name}</div>
                <div style={{ fontSize: 12, color: E.sub, marginTop: 1 }}>
                  Reason for visit: <span style={{ fontWeight: 600, color: E.ink }}>{appt?.reason ?? "Walk-in consultation"}</span>
                </div>
              </div>
              <Chip tone="blue" dot>In progress</Chip>
            </div>
          </Card>

          {/* Vitals */}
          <Card style={{ padding: 16 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: E.ink, marginBottom: 12 }}>Vitals</div>
            <div className="grid grid-cols-2" style={{ gap: 10 }}>
              {vitalFields.map((f) => {
                const v = parseFloat(vitals[f.key]);
                let outOfRange = false;
                if (!Number.isNaN(v)) {
                  if (f.key === "temp") outOfRange = v < base.temp[0] || v > base.temp[1];
                  if (f.key === "hr") outOfRange = v < base.hr[0] || v > base.hr[1];
                  if (f.key === "rr") outOfRange = v < base.rr[0] || v > base.rr[1];
                  if (f.key === "spo2") outOfRange = v < 95;
                }
                return (
                  <div key={f.key}>
                    <FieldLabel>{f.label}</FieldLabel>
                    <div style={{ position: "relative" }}>
                      <input
                        value={vitals[f.key]}
                        onChange={(e) => setVitals({ ...vitals, [f.key]: e.target.value.replace(/[^0-9.]/g, "") })}
                        inputMode="decimal"
                        placeholder="—"
                        style={{ ...inputStyle, paddingRight: 34, borderColor: outOfRange ? E.red : E.border, background: outOfRange ? E.redSoft : E.card }}
                      />
                      <span style={{ position: "absolute", right: 10, top: 11, fontSize: 11, color: E.faint }}>{f.unit}</span>
                    </div>
                    <div style={{ fontSize: 9.5, color: outOfRange ? E.red : E.faint, marginTop: 3 }}>{outOfRange ? "Out of range — " : ""}{f.hint}</div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Clinical observations */}
          <Card style={{ overflow: "hidden" }}>
            <div style={{ padding: "14px 16px", borderBottom: `1px solid ${E.borderSubtle}` }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: E.ink }}>Clinical Observations</div>
              <div style={{ fontSize: 11.5, color: E.sub, marginTop: 2 }}>Expand a system to record findings.</div>
            </div>
            {OBSERVATION_SYSTEMS.map((sys, i) => {
              const open = obsOpen === sys;
              const state = obs[sys] ?? { status: null, note: "" };
              return (
                <div key={sys} style={{ borderTop: i === 0 ? "none" : `1px solid ${E.borderSubtle}` }}>
                  <button
                    onClick={() => setObsOpen(open ? null : sys)}
                    className="w-full flex items-center text-left"
                    style={{ gap: 10, padding: "11px 16px", border: "none", background: "transparent" }}
                  >
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: E.ink }}>{sys}</span>
                    {state.status && <Chip tone={state.status === "Normal" ? "green" : "amber"} dot>{state.status}</Chip>}
                    {open ? <ChevronUp size={15} style={{ color: E.faint }} /> : <ChevronDown size={15} style={{ color: E.faint }} />}
                  </button>
                  {open && (
                    <div style={{ padding: "2px 16px 14px" }}>
                      <div className="flex" style={{ gap: 7, marginBottom: 8 }}>
                        {(["Normal", "Abnormal"] as const).map((s) => {
                          const active = state.status === s;
                          return (
                            <button
                              key={s}
                              onClick={() => setObs({ ...obs, [sys]: { ...state, status: active ? null : s } })}
                              style={{
                                height: 30, padding: "0 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                                border: active ? "none" : `1px solid ${E.border}`,
                                background: active ? (s === "Normal" ? E.green : E.amber) : E.card,
                                color: active ? "#fff" : E.sub,
                              }}
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>
                      <textarea
                        value={state.note}
                        onChange={(e) => setObs({ ...obs, [sys]: { ...state, note: e.target.value } })}
                        placeholder={`${sys} notes…`}
                        style={{ ...textareaStyle, minHeight: 56, fontSize: 12.5 }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </Card>

          {/* Physical examination → body map (optional tool) */}
          <Card style={{ overflow: "hidden" }}>
            <button
              onClick={() => setMapOpen((o) => !o)}
              className="w-full flex items-center text-left"
              style={{ gap: 10, padding: "14px 16px", border: "none", background: "transparent" }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: E.ink }}>Physical Examination — Body Map</div>
                <div style={{ fontSize: 11.5, color: E.sub, marginTop: 2 }}>Optional · pin findings to anatomical regions{findings.length > 0 ? ` · ${findings.length} recorded` : ""}</div>
              </div>
              {mapOpen ? <ChevronUp size={16} style={{ color: E.faint }} /> : <ChevronDown size={16} style={{ color: E.faint }} />}
            </button>
            {mapOpen && (
              <div style={{ padding: "0 16px 16px" }}>
                <div style={{ background: E.bg, borderRadius: 12, padding: 12 }}>
                  <BodyMap
                    activeZone={activeZone}
                    pins={findings.map((f) => ({ zone: f.zone, label: f.finding }))}
                    historyZones={history.map((h) => h.zoneId)}
                    onZoneTap={onZoneTap}
                  />
                </div>
                {history.length > 0 && (
                  <div style={{ fontSize: 11, color: E.sub, marginTop: 8 }}>
                    Dashed markers: prior SkinSense AI uploads — {history.map((h) => h.note).join(" · ")}
                  </div>
                )}

                {/* Finding form for the selected region */}
                {zone && (
                  <div style={{ marginTop: 12, border: `1px solid ${E.border}`, borderRadius: 12, padding: 14 }}>
                    <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: E.ink }}>{zone.label}</div>
                      <button onClick={() => setActiveZone(null)} aria-label="Close region" style={{ background: "none", border: "none", color: E.sub, padding: 2 }}><X size={15} /></button>
                    </div>
                    <div className="grid grid-cols-1" style={{ gap: 10 }}>
                      <div>
                        <FieldLabel>Finding</FieldLabel>
                        <input
                          list={`zone-issues-${zone.id}`}
                          value={findingForm.finding}
                          onChange={(e) => setFindingForm({ ...findingForm, finding: e.target.value })}
                          placeholder="e.g. Otitis externa"
                          style={inputStyle}
                        />
                        <datalist id={`zone-issues-${zone.id}`}>
                          {zone.issues.map((i) => <option key={i} value={i} />)}
                        </datalist>
                      </div>
                      <div>
                        <FieldLabel>Severity</FieldLabel>
                        <div className="flex" style={{ gap: 6 }}>
                          {(["Mild", "Moderate", "Severe"] as const).map((s) => {
                            const active = findingForm.severity === s;
                            return (
                              <button
                                key={s}
                                onClick={() => setFindingForm({ ...findingForm, severity: s })}
                                style={{
                                  flex: 1, height: 38, borderRadius: 9, fontSize: 12, fontWeight: 600,
                                  border: active ? "none" : `1px solid ${E.border}`,
                                  background: active ? (s === "Severe" ? E.red : s === "Moderate" ? E.amber : E.green) : E.card,
                                  color: active ? "#fff" : E.sub,
                                }}
                              >
                                {s}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: 10 }}>
                      <FieldLabel>Notes</FieldLabel>
                      <textarea
                        value={findingForm.notes}
                        onChange={(e) => setFindingForm({ ...findingForm, notes: e.target.value })}
                        placeholder="e.g. Redness and discharge observed."
                        style={{ ...textareaStyle, minHeight: 52, fontSize: 12.5 }}
                      />
                    </div>
                    <div className="flex items-center" style={{ gap: 10, marginTop: 10 }}>
                      <label className="inline-flex items-center" style={{ gap: 6, height: 34, padding: "0 12px", borderRadius: 9, border: `1px solid ${E.border}`, fontSize: 12, fontWeight: 600, color: E.ink, cursor: "pointer" }}>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) { setFindingForm({ ...findingForm, photo: f.name }); toast.success(`${f.name} attached.`); }
                          }}
                        />
                        <Paperclip size={13} /> {findingForm.photo || "Attach photo"}
                      </label>
                      <PrimaryBtn onClick={addFinding} style={{ height: 34, marginLeft: "auto" }}><Plus size={14} /> Add Finding</PrimaryBtn>
                    </div>
                  </div>
                )}

                {/* Recorded findings */}
                {findings.length > 0 && (
                  <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                    {findings.map((f, i) => (
                      <div key={i} className="flex items-start" style={{ gap: 10, background: E.bg, borderRadius: 10, padding: "10px 12px" }}>
                        <span className="flex items-center justify-center" style={{ width: 22, height: 22, borderRadius: "50%", background: E.accent, color: "#fff", fontSize: 10.5, fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12.5, fontWeight: 700, color: E.ink }}>{f.finding} <span style={{ fontWeight: 500, color: E.sub }}>· {f.zoneLabel}</span></div>
                          <div style={{ fontSize: 11, color: E.sub, marginTop: 2 }}>
                            {f.severity}{f.notes ? ` — ${f.notes}` : ""}{f.photo ? ` · 📎 ${f.photo}` : ""}
                          </div>
                        </div>
                        <button onClick={() => setFindings((x) => x.filter((_, idx) => idx !== i))} aria-label="Remove finding" style={{ background: "none", border: "none", color: E.sub, padding: 3 }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Assessment */}
          <Card style={{ padding: 16 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: E.ink, marginBottom: 12 }}>Assessment</div>
            <div>
              <FieldLabel>Primary Diagnosis *</FieldLabel>
              <input list="common-diagnoses" value={primary} onChange={(e) => setPrimary(e.target.value)} placeholder="Search diagnosis…" style={inputStyle} />
              <datalist id="common-diagnoses">
                {COMMON_DIAGNOSES.map((d) => <option key={d} value={d} />)}
              </datalist>
            </div>
            <div style={{ marginTop: 12 }}>
              <FieldLabel>Differential Diagnoses</FieldLabel>
              <div className="flex" style={{ gap: 8 }}>
                <input
                  value={diffInput}
                  onChange={(e) => setDiffInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && diffInput.trim()) {
                      setDiffs((d) => [...d, diffInput.trim()]);
                      setDiffInput("");
                    }
                  }}
                  placeholder="Add differential and press Enter"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <GhostBtn onClick={() => { if (diffInput.trim()) { setDiffs((d) => [...d, diffInput.trim()]); setDiffInput(""); } }} style={{ height: 38 }}>
                  <Plus size={14} /> Add
                </GhostBtn>
              </div>
              {diffs.length > 0 && (
                <div className="flex" style={{ gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                  {diffs.map((d, i) => (
                    <span key={i} className="inline-flex items-center" style={{ gap: 6, fontSize: 12, fontWeight: 600, color: E.ink, background: E.bg, borderRadius: 8, padding: "5px 10px" }}>
                      {d}
                      <button onClick={() => setDiffs((x) => x.filter((_, idx) => idx !== i))} aria-label={`Remove ${d}`} style={{ background: "none", border: "none", color: E.sub, padding: 0, display: "flex" }}><X size={12} /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div style={{ marginTop: 12 }}>
              <FieldLabel>Clinical Notes</FieldLabel>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Examination narrative, owner discussion, plan…" style={textareaStyle} />
            </div>
          </Card>

          {/* Prescription */}
          <Card style={{ padding: 16 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: E.ink }}>Prescription</div>
              <span style={{ fontSize: 11, color: E.sub }}>Breed-aware safety check active</span>
            </div>
            <div className="grid grid-cols-1" style={{ gap: 10 }}>
              <div>
                <FieldLabel>Medication</FieldLabel>
                <select value={medId} onChange={(e) => setMedId(e.target.value)} style={{ ...inputStyle, appearance: "none" }}>
                  {MEDICATIONS.map((m) => <option key={m.id} value={m.id}>{m.name} — {m.category}</option>)}
                </select>
              </div>
              <div>
                <FieldLabel>Dose (mg/kg){doseTotal ? ` — ${doseTotal} mg total` : ""}</FieldLabel>
                <input value={dose} onChange={(e) => setDose(e.target.value.replace(/[^0-9.]/g, ""))} inputMode="decimal" placeholder="e.g. 5" style={inputStyle} />
              </div>
              <div>
                <FieldLabel>Route</FieldLabel>
                <select value={route} onChange={(e) => setRoute(e.target.value)} style={{ ...inputStyle, appearance: "none" }}>
                  {RX_ROUTES.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <FieldLabel>Frequency</FieldLabel>
                <select value={frequency} onChange={(e) => setFrequency(e.target.value)} style={{ ...inputStyle, appearance: "none" }}>
                  {RX_FREQUENCIES.map((f) => <option key={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <FieldLabel>Duration</FieldLabel>
                <select value={duration} onChange={(e) => setDuration(e.target.value)} style={{ ...inputStyle, appearance: "none" }}>
                  {RX_DURATIONS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <FieldLabel>Instructions</FieldLabel>
                <input value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="e.g. Give with food" style={inputStyle} />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
              {flags.map((f, i) => {
                const S = FLAG_STYLE[f.level];
                return (
                  <div key={i} className="flex items-start" style={{ gap: 8, background: S.bg, borderRadius: 9, padding: "8px 11px" }}>
                    <S.Icon size={14} style={{ color: S.fg, flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 11.5, lineHeight: 1.5, color: S.fg, fontWeight: 600 }}>{f.text}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex" style={{ marginTop: 10 }}>
              <GhostBtn onClick={addRxLine} style={{ marginLeft: "auto" }}>
                <Plus size={14} /> Add Medication
              </GhostBtn>
            </div>
            {rx.length > 0 && (
              <div style={{ marginTop: 12, borderTop: `1px solid ${E.borderSubtle}`, paddingTop: 10 }}>
                {rx.map((line, i) => {
                  const m = MEDICATIONS.find((x) => x.id === line.medId)!;
                  return (
                    <div key={i} className="flex items-center" style={{ gap: 9, padding: "8px 0", borderTop: i === 0 ? "none" : `1px solid ${E.borderSubtle}` }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: E.ink }}>{m.name} <span style={{ fontWeight: 500, color: E.sub }}>· {line.dose} mg/kg</span></div>
                        <div style={{ fontSize: 11, color: E.sub, marginTop: 1 }}>{line.route} · {line.frequency} · {line.duration}{line.instructions ? ` · ${line.instructions}` : ""}</div>
                      </div>
                      <button onClick={() => setRx((r) => r.filter((_, idx) => idx !== i))} aria-label="Remove medication" style={{ background: "none", border: "none", color: E.sub, padding: 4 }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Follow-up */}
          <Card style={{ padding: 16 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: E.ink, marginBottom: 12 }}>Follow-up</div>
            <div className="grid grid-cols-1" style={{ gap: 10 }}>
              <div>
                <FieldLabel>Next visit</FieldLabel>
                <input type="date" value={fuDate} onChange={(e) => setFuDate(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <FieldLabel>Reason</FieldLabel>
                <input value={fuReason} onChange={(e) => setFuReason(e.target.value)} placeholder="e.g. Recheck respiratory symptoms" style={inputStyle} />
              </div>
            </div>
            <label className="flex items-center" style={{ gap: 9, marginTop: 12, cursor: "pointer" }}>
              <input type="checkbox" checked={fuRemind} onChange={(e) => setFuRemind(e.target.checked)} style={{ width: 16, height: 16, accentColor: E.accent }} />
              <span style={{ fontSize: 12.5, fontWeight: 600, color: E.ink }}>Send owner notification reminder</span>
              <Chip tone="green" style={{ marginLeft: "auto" }}>Scheduled</Chip>
            </label>
          </Card>

          {/* Actions */}
          <div className="flex flex-wrap" style={{ gap: 10, marginBottom: 8 }}>
            <PrimaryBtn onClick={() => saveConsultation(false)} style={{ flex: 1, minWidth: 160, height: 44 }}>
              <Save size={15} /> Save Consultation
            </PrimaryBtn>
            <GhostBtn onClick={() => saveConsultation(true)} style={{ flex: 1, minWidth: 160, height: 44 }}>
              <Send size={14} /> Save & Send Prescription
            </GhostBtn>
            <GhostBtn onClick={() => { window.print(); toast.success("Sending consultation summary to printer…"); }} style={{ height: 44 }}>
              <Printer size={14} /> Print
            </GhostBtn>
          </div>
        </div>

        {/* ============ Side column: patient context ============ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
          <Card style={{ padding: 16 }}>
            <div className="flex items-center" style={{ gap: 11 }}>
              <PatientAvatar patient={patient} size={44} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: E.ink }}>{patient.name}</div>
                <div style={{ fontSize: 11.5, color: E.sub }}>{patient.breed} · {patient.gender === "female" ? "F" : "M"} · {patient.age} · {patient.weightKg} kg</div>
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${E.borderSubtle}`, marginTop: 12, paddingTop: 10, display: "flex", flexDirection: "column", gap: 7 }}>
              {[
                { k: "Owner", v: `${patient.owner} · ${patient.ownerPhone}` },
                { k: "Patient ID", v: patient.patientCode },
                { k: "Allergies", v: patient.allergies.length ? patient.allergies.join(", ") : "None recorded", warn: patient.allergies.length > 0 },
                { k: "Current meds", v: patient.currentMeds.length ? patient.currentMeds.join(", ") : "None" },
                { k: "Last visit", v: patient.lastVisit },
              ].map((r) => (
                <div key={r.k} className="flex" style={{ gap: 8, fontSize: 12 }}>
                  <span style={{ width: 92, flexShrink: 0, color: E.sub, fontWeight: 600 }}>{r.k}</span>
                  <span style={{ flex: 1, color: r.warn ? E.red : E.ink, fontWeight: r.warn ? 700 : 500 }}>{r.v}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card style={{ padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: E.ink, marginBottom: 10 }}>Breed Risk Profile</div>
            <div className="flex" style={{ gap: 6, flexWrap: "wrap" }}>
              {riskTagsFor(patient).map((t) => (
                <Chip key={t.label} tone={t.tone === "blue" ? "blue" : t.tone}>{t.label}</Chip>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </VetShell>
  );
}
