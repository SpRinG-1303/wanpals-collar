import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, FlaskConical, Plus, Upload, X, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import VetShell from "@/components/vet/VetShell";
import { Card, Chip, E, FieldLabel, GhostBtn, PatientAvatar, PrimaryBtn, inputStyle } from "@/components/vet/ehr";
import { VET_PATIENTS, patientById, recordFor, type LabResult } from "@/components/vet/vetData";

export const Route = createFileRoute("/vet-lab")({
  head: () => ({
    meta: [
      { title: "Laboratory — Pawsitive Diagnostics Veterinary" },
      { name: "description", content: "Veterinary laboratory results: CBC, blood chemistry, urinalysis and imaging with abnormal values highlighted." },
      { property: "og:title", content: "Laboratory — Pawsitive Diagnostics Veterinary" },
      { property: "og:description", content: "Veterinary lab results and orders." },
    ],
  }),
  component: VetLab,
});

type LabRow = { patientId: string; lab: LabResult };
const TEST_TYPES = ["CBC", "Blood Chemistry", "Urinalysis", "Thyroid Panel", "Thoracic Imaging", "Fecal Examination"];

function VetLab() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState<string[]>([]);
  const [orders, setOrders] = useState<LabRow[]>([]);
  const [orderOpen, setOrderOpen] = useState(false);
  const [form, setForm] = useState({ patientId: VET_PATIENTS[0].id, name: TEST_TYPES[0] });

  const rows = useMemo<LabRow[]>(() => {
    const base = VET_PATIENTS.flatMap((p) => recordFor(p.id).labs.map((lab) => ({ patientId: p.id, lab })));
    return [...orders, ...base];
  }, [orders]);

  const isPending = (r: LabRow) => r.lab.status === "pending" && !uploaded.includes(r.lab.id);
  const pendingCount = rows.filter(isPending).length;

  const uploadResult = (r: LabRow) => {
    setUploaded((u) => [...u, r.lab.id]);
    toast.success(`${r.lab.name} result uploaded for ${patientById(r.patientId)?.name}.`);
  };

  const placeOrder = () => {
    const id = `l-new-${Date.now()}`;
    setOrders((o) => [
      { patientId: form.patientId, lab: { id, name: form.name, date: "Today", status: "pending", values: [] } },
      ...o,
    ]);
    setOrderOpen(false);
    toast.success(`${form.name} ordered for ${patientById(form.patientId)?.name}.`);
  };

  return (
    <VetShell
      title="Laboratory"
      subtitle={`${rows.length} tests on record · ${pendingCount} pending`}
      actions={<PrimaryBtn onClick={() => setOrderOpen(true)}><Plus size={15} /> New Lab Order</PrimaryBtn>}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {rows.map((r) => {
          const p = patientById(r.patientId)!;
          const pending = isPending(r);
          const open = expanded === r.lab.id;
          const abnormal = r.lab.values.filter((v) => v.flag !== "normal").length;
          return (
            <Card key={r.lab.id} style={{ overflow: "hidden" }}>
              <button
                onClick={() => !pending && setExpanded(open ? null : r.lab.id)}
                className="w-full flex items-center text-left"
                style={{ gap: 11, padding: "13px 16px", border: "none", background: "transparent" }}
              >
                <span className="flex items-center justify-center" style={{ width: 36, height: 36, borderRadius: 10, background: E.pale, color: E.accent, flexShrink: 0 }}>
                  <FlaskConical size={16} />
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 13.5, fontWeight: 700, color: E.ink }}>{r.lab.name}</span>
                  <span style={{ display: "block", fontSize: 11.5, color: E.sub, marginTop: 1 }}>
                    {p.name} · {p.owner} · {r.lab.date}
                  </span>
                </span>
                {!pending && abnormal > 0 && <Chip tone="amber">{abnormal} abnormal</Chip>}
                <Chip tone={pending ? "amber" : "green"} dot>{pending ? "Pending" : "Available"}</Chip>
                {!pending && (open ? <ChevronUp size={15} style={{ color: E.faint }} /> : <ChevronDown size={15} style={{ color: E.faint }} />)}
              </button>

              {pending && (
                <div style={{ padding: "0 16px 14px 63px" }}>
                  <GhostBtn style={{ height: 32, fontSize: 12 }} onClick={() => uploadResult(r)}>
                    <Upload size={13} /> Upload Result
                  </GhostBtn>
                </div>
              )}

              {open && !pending && (
                <div style={{ borderTop: `1px solid ${E.borderSubtle}` }}>
                  {r.lab.values.map((v, i) => (
                    <div key={i} className="flex items-center" style={{ gap: 10, padding: "10px 16px", borderTop: i === 0 ? "none" : `1px solid ${E.borderSubtle}`, background: v.flag !== "normal" ? E.amberSoft : "transparent" }}>
                      <span style={{ flex: 1, fontSize: 12.5, fontWeight: 600, color: E.ink }}>{v.name}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: v.flag !== "normal" ? E.amber : E.ink, fontVariantNumeric: "tabular-nums" }}>
                        {v.value} {v.unit}
                      </span>
                      {v.ref && <span style={{ fontSize: 10.5, color: E.faint, width: 84, textAlign: "right" }}>Ref {v.ref}</span>}
                      {v.flag === "normal" ? (
                        <Chip tone="green" style={{ width: 70, justifyContent: "center" }}>Normal</Chip>
                      ) : (
                        <Chip tone={v.flag === "high" ? "red" : "amber"} style={{ width: 70, justifyContent: "center" }}>
                          {v.flag === "high" ? <ArrowUp size={10} /> : <ArrowDown size={10} />} {v.flag === "high" ? "High" : "Low"}
                        </Chip>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* New lab order modal */}
      {orderOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(20,28,44,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => setOrderOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: E.card, borderRadius: 16, padding: 22, width: "100%", maxWidth: 420, boxShadow: "0 24px 60px rgba(20,28,44,0.25)" }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: E.ink }}>New Lab Order</div>
              <button onClick={() => setOrderOpen(false)} aria-label="Close" style={{ background: "none", border: "none", color: E.sub, padding: 4 }}><X size={18} /></button>
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
              <div>
                <FieldLabel>Test</FieldLabel>
                <select value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ ...inputStyle, appearance: "none" }}>
                  {TEST_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex" style={{ gap: 10, marginTop: 4 }}>
                <GhostBtn onClick={() => setOrderOpen(false)} style={{ flex: 1 }}>Cancel</GhostBtn>
                <PrimaryBtn onClick={placeOrder} style={{ flex: 1 }}>Place Order</PrimaryBtn>
              </div>
            </div>
          </div>
        </div>
      )}
    </VetShell>
  );
}
