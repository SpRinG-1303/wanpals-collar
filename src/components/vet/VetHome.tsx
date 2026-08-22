import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays, Hourglass, Stethoscope, RotateCcw, AlertTriangle,
  Search, Video, ChevronRight, CalendarPlus, Pill, FlaskConical,
  BellRing, type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import VetShell from "./VetShell";
import { Card, Chip, E, PatientAvatar } from "./ehr";
import {
  APPOINTMENTS, APPT_STATUS_META, CLINICAL_ALERTS, FOLLOW_UPS,
  VET_PATIENTS, patientById, type Species,
} from "./vetData";
import { useAuth } from "@/context/AuthContext";

const SPECIES_FILTERS: { id: Species | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "dog", label: "Dogs" },
  { id: "cat", label: "Cats" },
  { id: "other", label: "Other" },
];

function SummaryCard({ Icon, label, value, tone }: { Icon: LucideIcon; label: string; value: number; tone: "blue" | "amber" | "green" | "grey" }) {
  const toneMap = {
    blue: { fg: E.blue, bg: E.blueSoft },
    amber: { fg: E.amber, bg: E.amberSoft },
    green: { fg: E.green, bg: E.greenSoft },
    grey: { fg: E.grey, bg: E.greySoft },
  }[tone];
  return (
    <Card style={{ padding: "14px 16px" }}>
      <div className="flex items-center" style={{ gap: 11 }}>
        <span className="flex items-center justify-center" style={{ width: 36, height: 36, borderRadius: 10, background: toneMap.bg, color: toneMap.fg, flexShrink: 0 }}>
          <Icon size={17} strokeWidth={2} />
        </span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: E.ink, lineHeight: 1.1, fontVariantNumeric: "tabular-nums" }}>{value}</div>
          <div style={{ fontSize: 10.5, fontWeight: 600, color: E.sub, letterSpacing: "0.05em", textTransform: "uppercase", marginTop: 2 }}>{label}</div>
        </div>
      </div>
    </Card>
  );
}

export default function VetHome() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [species, setSpecies] = useState<Species | "all">("all");

  // Compute time-based greeting only after mount — server (UTC) and client
  // (local timezone) clocks differ and would break hydration.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);
  const hour = (now ?? new Date(0)).getHours();
  const greet = now ? (hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening") : "Hello";
  const drName = session?.name ? (session.name.startsWith("Dr") ? session.name : `Dr. ${session.name}`) : "Dr. Sharma";
  const today = now ? now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "";

  const waiting = APPOINTMENTS.filter((a) => a.status === "waiting" || a.status === "checked-in").length;
  const inConsult = APPOINTMENTS.filter((a) => a.status === "in-consultation").length;

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    return VET_PATIENTS.filter((p) => species === "all" || p.species === species)
      .filter((p) => !term || [p.name, p.owner, p.microchip, p.patientCode, p.ownerPhone].join(" ").toLowerCase().includes(term))
      .slice(0, 5);
  }, [q, species]);

  return (
    <VetShell>
      {/* Greeting */}
      <div className="flex items-end justify-between flex-wrap" style={{ gap: 8, marginBottom: 18 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: E.ink, letterSpacing: "-0.015em", margin: 0 }}>
            {greet}, {drName}
          </h1>
          <div style={{ fontSize: 13, color: E.sub, marginTop: 3 }}>Here's your clinic overview for today · {today}</div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2" style={{ gap: 12, marginBottom: 20 }}>
        <SummaryCard Icon={CalendarDays} label="Today's Appointments" value={APPOINTMENTS.length} tone="blue" />
        <SummaryCard Icon={Hourglass} label="Waiting" value={waiting} tone="amber" />
        <SummaryCard Icon={Stethoscope} label="In Consultation" value={inConsult} tone="green" />
        <SummaryCard Icon={RotateCcw} label="Follow-ups" value={FOLLOW_UPS.length} tone="grey" />
      </div>

      <div className="grid grid-cols-1" style={{ gap: 16, alignItems: "start" }}>
        {/* ===== Center column ===== */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
          {/* Today's appointments */}
          <Card style={{ overflow: "hidden" }}>
            <div className="flex items-center justify-between" style={{ padding: "14px 16px", borderBottom: `1px solid ${E.borderSubtle}` }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: E.ink }}>Today's Appointments</div>
              <Link to="/vet-patients" style={{ fontSize: 12, fontWeight: 700, color: E.accent, textDecoration: "none" }}>
                View patients →
              </Link>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", minWidth: 620, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: E.bg }}>
                    {["Time", "Patient", "Owner", "Reason", "Status", ""].map((h) => (
                      <th key={h} style={{ textAlign: "left", fontSize: 10.5, fontWeight: 700, color: E.sub, letterSpacing: "0.05em", textTransform: "uppercase", padding: "9px 12px" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {APPOINTMENTS.map((a) => {
                    const p = patientById(a.patientId)!;
                    const meta = APPT_STATUS_META[a.status];
                    return (
                      <tr
                        key={a.id}
                        onClick={() => navigate({ to: "/vet-patient/$id", params: { id: p.id } })}
                        style={{ borderTop: `1px solid ${E.borderSubtle}`, cursor: "pointer" }}
                        className="group"
                      >
                        <td style={{ padding: "11px 12px", fontSize: 13, fontWeight: 700, color: E.ink, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{a.time}</td>
                        <td style={{ padding: "11px 12px" }}>
                          <div className="flex items-center" style={{ gap: 9 }}>
                            <PatientAvatar patient={p} size={30} />
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 700, color: E.ink, whiteSpace: "nowrap" }}>{p.name}</div>
                              <div style={{ fontSize: 11, color: E.sub, whiteSpace: "nowrap" }}>{p.breed}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "11px 12px", fontSize: 12.5, color: E.ink, whiteSpace: "nowrap" }}>{p.owner}</td>
                        <td style={{ padding: "11px 12px", fontSize: 12.5, color: E.sub }}>
                          <span className="flex items-center" style={{ gap: 6 }}>
                            {a.reason}
                            {a.type === "Video" && <Video size={13} style={{ color: E.accent, flexShrink: 0 }} />}
                          </span>
                        </td>
                        <td style={{ padding: "11px 12px" }}>
                          <Chip tone={meta.tone} dot>{meta.label}</Chip>
                        </td>
                        <td style={{ padding: "11px 12px", textAlign: "right", whiteSpace: "nowrap" }}>
                          {(a.status === "waiting" || a.status === "in-consultation" || a.status === "checked-in") && (
                            <Link
                              to="/vet-consult"
                              search={{ patient: p.id }}
                              onClick={(e) => e.stopPropagation()}
                              style={{ fontSize: 12, fontWeight: 700, color: E.accent, textDecoration: "none" }}
                            >
                              Start →
                            </Link>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Patient search */}
          <Card style={{ padding: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: E.ink }}>Patient Search</div>
            <div style={{ fontSize: 12, color: E.sub, marginTop: 2, marginBottom: 12 }}>Search by patient name, owner, phone, microchip or record number.</div>
            <div className="flex items-center" style={{ gap: 9, height: 42, borderRadius: 10, border: `1px solid ${E.border}`, background: E.bg, padding: "0 13px" }}>
              <Search size={16} style={{ color: E.faint, flexShrink: 0 }} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search patient, owner, microchip ID…"
                style={{ flex: 1, minWidth: 0, border: "none", background: "transparent", outline: "none", fontSize: 13.5, color: E.ink }}
              />
            </div>
            <div className="flex" style={{ gap: 7, marginTop: 10, flexWrap: "wrap" }}>
              {SPECIES_FILTERS.map((f) => {
                const active = species === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setSpecies(f.id)}
                    style={{
                      height: 30, padding: "0 13px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                      border: active ? "none" : `1px solid ${E.border}`,
                      background: active ? E.accent : E.card, color: active ? "#fff" : E.sub,
                    }}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
            <div style={{ marginTop: 10 }}>
              {results.length === 0 ? (
                <div style={{ fontSize: 12.5, color: E.sub, padding: "10px 2px" }}>No patients match your search.</div>
              ) : (
                results.map((p, i) => (
                  <Link
                    key={p.id}
                    to="/vet-patient/$id"
                    params={{ id: p.id }}
                    className="flex items-center"
                    style={{ gap: 11, padding: "9px 4px", borderTop: i === 0 ? "none" : `1px solid ${E.borderSubtle}`, textDecoration: "none" }}
                  >
                    <PatientAvatar patient={p} size={36} />
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: "block", fontSize: 13.5, fontWeight: 700, color: E.ink }}>
                        {p.name} <span style={{ fontWeight: 500, color: E.sub }}>· {p.breed} · {p.gender === "female" ? "Female" : "Male"} · {p.age}</span>
                      </span>
                      <span style={{ display: "block", fontSize: 11.5, color: E.sub, marginTop: 1 }}>
                        {p.owner} · {p.ownerPhone} · {p.patientCode}
                      </span>
                    </span>
                    <ChevronRight size={16} style={{ color: E.faint, flexShrink: 0 }} />
                  </Link>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* ===== Right rail ===== */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
          {/* Clinical alerts */}
          <Card style={{ padding: 16 }}>
            <div className="flex items-center" style={{ gap: 8, marginBottom: 12 }}>
              <AlertTriangle size={15} style={{ color: E.amber }} />
              <div style={{ fontSize: 13.5, fontWeight: 700, color: E.ink }}>Clinical Alerts</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {CLINICAL_ALERTS.map((a, i) => (
                <button
                  key={i}
                  onClick={() => a.patientId && navigate({ to: "/vet-patient/$id", params: { id: a.patientId } })}
                  className="flex items-start text-left"
                  style={{
                    gap: 9, padding: "9px 11px", borderRadius: 10, border: "none", width: "100%",
                    background: a.level === "red" ? E.redSoft : E.amberSoft,
                  }}
                >
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: a.level === "red" ? E.red : E.amber, flexShrink: 0, marginTop: 5 }} />
                  <span style={{ fontSize: 12, lineHeight: 1.45, fontWeight: 600, color: a.level === "red" ? E.red : E.amber }}>{a.text}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Follow-ups */}
          <Card style={{ padding: 16 }}>
            <div className="flex items-center" style={{ gap: 8, marginBottom: 12 }}>
              <BellRing size={15} style={{ color: E.accent }} />
              <div style={{ fontSize: 13.5, fontWeight: 700, color: E.ink }}>Upcoming Follow-ups</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {FOLLOW_UPS.map((f, i) => {
                const p = patientById(f.patientId)!;
                return (
                  <button
                    key={f.id}
                    onClick={() => navigate({ to: "/vet-patient/$id", params: { id: p.id } })}
                    className="flex items-center text-left"
                    style={{ gap: 10, padding: "9px 0", borderTop: i === 0 ? "none" : `1px solid ${E.borderSubtle}`, border: "none", background: "transparent", width: "100%" }}
                  >
                    <PatientAvatar patient={p} size={30} />
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: E.ink }}>{p.name} — {f.reason}</span>
                      <span style={{ display: "block", fontSize: 11, color: E.sub, marginTop: 1 }}>{f.date}{f.remindOwner ? " · Owner reminder on" : ""}</span>
                    </span>
                    <Chip tone={f.status === "Overdue" ? "red" : "green"}>{f.status}</Chip>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Quick actions */}
          <Card style={{ padding: 16 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: E.ink, marginBottom: 12 }}>Quick Actions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { Icon: CalendarPlus, label: "New Consultation", run: () => navigate({ to: "/vet-consult" }) },
                { Icon: Pill, label: "New Prescription", run: () => navigate({ to: "/vet-rx" }) },
                { Icon: FlaskConical, label: "Find Patient", run: () => navigate({ to: "/vet-patients" }) },
              ].map(({ Icon, label, run }) => (
                <button
                  key={label}
                  onClick={() => { run(); }}
                  className="flex items-center active:scale-[0.98] transition-transform"
                  style={{ gap: 10, height: 40, padding: "0 12px", borderRadius: 10, border: `1px solid ${E.border}`, background: E.card, fontSize: 13, fontWeight: 600, color: E.ink }}
                >
                  <span className="flex items-center justify-center" style={{ width: 26, height: 26, borderRadius: 8, background: E.pale, color: E.accent }}>
                    <Icon size={14} />
                  </span>
                  {label}
                  <ChevronRight size={15} style={{ color: E.faint, marginLeft: "auto" }} />
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </VetShell>
  );
}
