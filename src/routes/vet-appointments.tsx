import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Video, X, Check, Stethoscope, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import VetShell from "@/components/vet/VetShell";
import { Card, Chip, E, FieldLabel, GhostBtn, PatientAvatar, PrimaryBtn, inputStyle } from "@/components/vet/ehr";
import { APPOINTMENTS, APPT_STATUS_META, VET_PATIENTS, patientById, type ApptStatus, type Appointment } from "@/components/vet/vetData";

export const Route = createFileRoute("/vet-appointments")({
  head: () => ({
    meta: [
      { title: "Appointments — MOooMENTUM Veterinary" },
      { name: "description", content: "Clinic appointment schedule: check patients in, start consultations and manage the daily queue." },
      { property: "og:title", content: "Appointments — MOooMENTUM Veterinary" },
      { property: "og:description", content: "Clinic appointment schedule and consultation queue." },
    ],
  }),
  component: VetAppointments,
});

type Filter = "all" | "Clinic" | "Video";

const NEXT_STATUS: Partial<Record<ApptStatus, { to: ApptStatus; label: string }>> = {
  scheduled: { to: "checked-in", label: "Check In" },
  "checked-in": { to: "waiting", label: "Mark Waiting" },
};

function VetAppointments() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>("all");
  const [overrides, setOverrides] = useState<Record<string, ApptStatus>>({});
  const [added, setAdded] = useState<Appointment[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ patientId: VET_PATIENTS[0].id, time: "18:00", reason: "", type: "Clinic" as Appointment["type"] });

  const all = useMemo(
    () =>
      [...APPOINTMENTS, ...added]
        .map((a) => ({ ...a, status: overrides[a.id] ?? a.status }))
        .sort((a, b) => a.time.localeCompare(b.time)),
    [overrides, added]
  );
  const shown = all.filter((a) => filter === "all" || a.type === filter);

  const setStatus = (id: string, status: ApptStatus, msg: string) => {
    setOverrides((o) => ({ ...o, [id]: status }));
    toast.success(msg);
  };

  const saveAppointment = () => {
    if (!form.reason.trim()) {
      toast.error("Enter a reason for the visit.");
      return;
    }
    const p = patientById(form.patientId)!;
    setAdded((x) => [...x, { id: `a-new-${Date.now()}`, patientId: p.id, time: form.time, reason: form.reason.trim(), type: form.type, status: "scheduled" }]);
    setAddOpen(false);
    setForm({ ...form, reason: "" });
    toast.success(`Appointment booked — ${p.name} at ${form.time}.`);
  };

  return (
    <VetShell
      title="Appointments"
      subtitle={`${all.length} appointments today · ${all.filter((a) => a.status !== "completed").length} remaining`}
      actions={<PrimaryBtn onClick={() => setAddOpen(true)}><Plus size={15} /> New Appointment</PrimaryBtn>}
    >
      {/* Type filter */}
      <div className="flex" style={{ gap: 7, marginBottom: 14 }}>
        {(["all", "Clinic", "Video"] as Filter[]).map((f) => {
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                height: 32, padding: "0 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                border: active ? "none" : `1px solid ${E.border}`,
                background: active ? E.accent : E.card, color: active ? "#fff" : E.sub,
              }}
            >
              {f === "all" ? "All" : f}
            </button>
          );
        })}
      </div>

      <Card style={{ overflow: "hidden" }}>
        {shown.map((a, i) => {
          const p = patientById(a.patientId)!;
          const meta = APPT_STATUS_META[a.status];
          const next = NEXT_STATUS[a.status];
          return (
            <div key={a.id} style={{ padding: "13px 16px", borderTop: i === 0 ? "none" : `1px solid ${E.borderSubtle}` }}>
              <button
                onClick={() => navigate({ to: "/vet-patient/$id", params: { id: p.id } })}
                className="w-full flex items-center text-left"
                style={{ gap: 11, border: "none", background: "transparent", padding: 0 }}
              >
                <span style={{ width: 44, flexShrink: 0, fontSize: 13.5, fontWeight: 800, color: E.ink, fontVariantNumeric: "tabular-nums" }}>{a.time}</span>
                <PatientAvatar patient={p} size={38} />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span className="flex items-center" style={{ gap: 6 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: E.ink }}>{p.name}</span>
                    {a.type === "Video" && <Video size={13} style={{ color: E.accent }} />}
                    {a.followUp && <Chip tone="grey" style={{ fontSize: 10 }}>Follow-up</Chip>}
                  </span>
                  <span style={{ display: "block", fontSize: 11.5, color: E.sub, marginTop: 1 }}>
                    {a.reason} · {p.owner}
                  </span>
                </span>
                <Chip tone={meta.tone} dot>{meta.label}</Chip>
              </button>
              {a.status !== "completed" && (
                <div className="flex" style={{ gap: 8, marginTop: 10, paddingLeft: 55 }}>
                  {next && (
                    <GhostBtn
                      style={{ height: 32, fontSize: 12, flex: 1 }}
                      onClick={() => setStatus(a.id, next.to, `${p.name} — ${APPT_STATUS_META[next.to].label.toLowerCase()}.`)}
                    >
                      <Check size={13} /> {next.label}
                    </GhostBtn>
                  )}
                  <PrimaryBtn
                    style={{ height: 32, fontSize: 12, flex: 1 }}
                    onClick={() => {
                      if (a.status === "scheduled") setOverrides((o) => ({ ...o, [a.id]: "in-consultation" }));
                      navigate({ to: "/vet-consult", search: { patient: p.id } });
                    }}
                  >
                    <Stethoscope size={13} /> Start Consultation
                  </PrimaryBtn>
                  {(a.status === "in-consultation" || a.status === "waiting") && (
                    <GhostBtn
                      style={{ height: 32, fontSize: 12, padding: "0 12px" }}
                      onClick={() => setStatus(a.id, "completed", `${p.name}'s visit marked completed.`)}
                    >
                      Done
                    </GhostBtn>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {shown.length === 0 && (
          <div style={{ padding: "36px 16px", textAlign: "center", fontSize: 13, color: E.sub }}>
            <CalendarDays size={22} style={{ color: E.faint, margin: "0 auto 8px" }} />
            No {filter === "all" ? "" : filter.toLowerCase()} appointments today.
          </div>
        )}
      </Card>

      {/* New appointment modal */}
      {addOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(20,28,44,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => setAddOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: E.card, borderRadius: 16, padding: 22, width: "100%", maxWidth: 420, boxShadow: "0 24px 60px rgba(20,28,44,0.25)" }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: E.ink }}>Schedule Appointment</div>
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
                  <FieldLabel>Time</FieldLabel>
                  <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <FieldLabel>Type</FieldLabel>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Appointment["type"] })} style={{ ...inputStyle, appearance: "none" }}>
                    <option value="Clinic">Clinic visit</option>
                    <option value="Video">Video consult</option>
                  </select>
                </div>
              </div>
              <div>
                <FieldLabel>Reason for visit *</FieldLabel>
                <input autoFocus value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="e.g. Annual vaccination" style={inputStyle} />
              </div>
              <div className="flex" style={{ gap: 10, marginTop: 4 }}>
                <GhostBtn onClick={() => setAddOpen(false)} style={{ flex: 1 }}>Cancel</GhostBtn>
                <PrimaryBtn onClick={saveAppointment} style={{ flex: 1 }}>Book Appointment</PrimaryBtn>
              </div>
            </div>
          </div>
        </div>
      )}
    </VetShell>
  );
}
