import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Syringe, X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import VetShell from "@/components/vet/VetShell";
import { Card, Chip, E, FieldLabel, GhostBtn, PatientAvatar, PrimaryBtn, inputStyle } from "@/components/vet/ehr";
import { VET_PATIENTS, patientById, recordFor, type VaccineRecord } from "@/components/vet/vetData";

export const Route = createFileRoute("/vet-vaccinations")({
  head: () => ({
    meta: [
      { title: "Vaccinations — MOooMENTUM Veterinary" },
      { name: "description", content: "Vaccination records, due and overdue boosters, and vaccine administration tracking for clinic patients." },
      { property: "og:title", content: "Vaccinations — MOooMENTUM Veterinary" },
      { property: "og:description", content: "Vaccination records and booster tracking." },
    ],
  }),
  component: VetVaccinations,
});

type VaxRow = { patientId: string; vax: VaccineRecord };
const VAX_TYPES = ["Rabies", "DHPP", "FVRCP", "Leptospirosis", "Kennel Cough (Bordetella)", "Canine Influenza"];

const VAX_TONE: Record<VaccineRecord["status"], "green" | "amber" | "red"> = {
  Administered: "green",
  Due: "amber",
  Overdue: "red",
};

function VetVaccinations() {
  const navigate = useNavigate();
  const [added, setAdded] = useState<VaxRow[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ patientId: VET_PATIENTS[0].id, name: VAX_TYPES[0], date: new Date().toISOString().slice(0, 10) });

  const rows = useMemo<VaxRow[]>(() => {
    const base = VET_PATIENTS.flatMap((p) => recordFor(p.id).vaccinations.map((vax) => ({ patientId: p.id, vax })));
    return [...added, ...base];
  }, [added]);

  const due = rows.filter((r) => r.vax.status !== "Administered");
  const done = rows.filter((r) => r.vax.status === "Administered");

  const save = () => {
    const d = new Date(form.date);
    const next = new Date(d); next.setFullYear(next.getFullYear() + 1);
    const fmt = (x: Date) => x.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    setAdded((a) => [{ patientId: form.patientId, vax: { name: form.name, date: fmt(d), nextDue: fmt(next), status: "Administered" } }, ...a]);
    setAddOpen(false);
    toast.success(`${form.name} recorded for ${patientById(form.patientId)?.name} — next due ${fmt(next)}.`);
  };

  const Row = ({ r }: { r: VaxRow }) => {
    const p = patientById(r.patientId)!;
    return (
      <button
        onClick={() => navigate({ to: "/vet-patient/$id", params: { id: p.id } })}
        className="w-full flex items-center text-left"
        style={{ gap: 11, padding: "12px 16px", border: "none", background: "transparent", borderTop: `1px solid ${E.borderSubtle}` }}
      >
        <span className="flex items-center justify-center" style={{ width: 34, height: 34, borderRadius: 9, background: r.vax.status === "Administered" ? E.greenSoft : r.vax.status === "Due" ? E.amberSoft : E.redSoft, color: r.vax.status === "Administered" ? E.green : r.vax.status === "Due" ? E.amber : E.red, flexShrink: 0 }}>
          <Syringe size={15} />
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "block", fontSize: 13.5, fontWeight: 700, color: E.ink }}>{r.vax.name} <span style={{ fontWeight: 500, color: E.sub }}>· {p.name}</span></span>
          <span style={{ display: "block", fontSize: 11.5, color: E.sub, marginTop: 1 }}>
            Given {r.vax.date} · Next due {r.vax.nextDue}
          </span>
        </span>
        <Chip tone={VAX_TONE[r.vax.status]} dot>{r.vax.status}</Chip>
      </button>
    );
  };

  return (
    <VetShell
      title="Vaccinations"
      subtitle={`${due.length} due or overdue · ${done.length} administered`}
      actions={<PrimaryBtn onClick={() => setAddOpen(true)}><Plus size={15} /> Record Vaccination</PrimaryBtn>}
    >
      {/* Due & overdue */}
      {due.length > 0 && (
        <Card style={{ overflow: "hidden", marginBottom: 14 }}>
          <div className="flex items-center" style={{ gap: 8, padding: "13px 16px", background: E.amberSoft }}>
            <AlertTriangle size={15} style={{ color: E.amber }} />
            <div style={{ fontSize: 13.5, fontWeight: 700, color: E.amber }}>Due & Overdue Boosters</div>
          </div>
          {due.map((r, i) => <Row key={`d-${i}`} r={r} />)}
        </Card>
      )}

      {/* Administered */}
      <Card style={{ overflow: "hidden" }}>
        <div style={{ padding: "13px 16px", fontSize: 13.5, fontWeight: 700, color: E.ink }}>Administered Vaccines</div>
        {done.map((r, i) => <Row key={`a-${i}`} r={r} />)}
      </Card>

      {/* Record modal */}
      {addOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(20,28,44,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => setAddOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: E.card, borderRadius: 16, padding: 22, width: "100%", maxWidth: 420, boxShadow: "0 24px 60px rgba(20,28,44,0.25)" }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: E.ink }}>Record Vaccination</div>
              <button onClick={() => setAddOpen(false)} aria-label="Close" style={{ background: "none", border: "none", color: E.sub, padding: 4 }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <FieldLabel>Patient</FieldLabel>
                <select value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })} style={{ ...inputStyle, appearance: "none" }}>
                  {VET_PATIENTS.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} — {p.owner}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2" style={{ gap: 10 }}>
                <div>
                  <FieldLabel>Vaccine</FieldLabel>
                  <select value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ ...inputStyle, appearance: "none" }}>
                    {VAX_TYPES.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <FieldLabel>Date given</FieldLabel>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} style={inputStyle} />
                </div>
              </div>
              <div className="flex" style={{ gap: 10, marginTop: 4 }}>
                <GhostBtn onClick={() => setAddOpen(false)} style={{ flex: 1 }}>Cancel</GhostBtn>
                <PrimaryBtn onClick={save} style={{ flex: 1 }}>Save Record</PrimaryBtn>
              </div>
            </div>
          </div>
        </div>
      )}
    </VetShell>
  );
}
