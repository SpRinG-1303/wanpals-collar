import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { BarChart3, CalendarDays, IndianRupee, Syringe, Download } from "lucide-react";
import { toast } from "sonner";
import VetShell from "@/components/vet/VetShell";
import { Card, E, GhostBtn } from "@/components/vet/ehr";
import { APPOINTMENTS, INVOICES, PATIENT_RECORDS, VET_PATIENTS } from "@/components/vet/vetData";

export const Route = createFileRoute("/vet-reports")({
  head: () => ({
    meta: [
      { title: "Reports — MOooMENTUM Veterinary" },
      { name: "description", content: "Clinic performance reports: appointments, revenue, common diagnoses and vaccination coverage." },
      { property: "og:title", content: "Reports — MOooMENTUM Veterinary" },
      { property: "og:description", content: "Clinic analytics and reports." },
    ],
  }),
  component: VetReports,
});

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function VetReports() {
  const revenue = INVOICES.reduce((s, i) => s + i.amount, 0);
  const videoShare = Math.round((APPOINTMENTS.filter((a) => a.type === "Video").length / APPOINTMENTS.length) * 100);

  const topDiagnoses = useMemo(() => {
    const counts = new Map<string, number>();
    Object.values(PATIENT_RECORDS).forEach((r) => r.diagnoses.forEach((d) => counts.set(d.name, (counts.get(d.name) ?? 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, []);
  const maxDx = topDiagnoses[0]?.[1] ?? 1;

  const kpis = [
    { Icon: CalendarDays, label: "Appointments today", value: String(APPOINTMENTS.length), sub: `${videoShare}% video consults` },
    { Icon: IndianRupee, label: "Revenue (30 days)", value: inr(revenue), sub: "across all branches" },
    { Icon: Syringe, label: "Vaccination coverage", value: `${Math.round((VET_PATIENTS.filter((p) => p.vaccinationStatus === "Up to date").length / VET_PATIENTS.length) * 100)}%`, sub: "of active patients" },
    { Icon: BarChart3, label: "Active patients", value: String(VET_PATIENTS.filter((p) => p.status === "Active Patient").length), sub: "at this clinic" },
  ];

  return (
    <VetShell
      title="Reports"
      subtitle="Clinic performance at a glance"
      actions={<GhostBtn onClick={() => toast.success("Monthly report export started — PDF will download shortly.")}><Download size={14} /> Export</GhostBtn>}
    >
      {/* KPI cards */}
      <div className="grid grid-cols-2" style={{ gap: 10, marginBottom: 14 }}>
        {kpis.map(({ Icon, label, value, sub }) => (
          <Card key={label} style={{ padding: "13px 14px" }}>
            <span className="flex items-center justify-center" style={{ width: 30, height: 30, borderRadius: 9, background: E.pale, color: E.accent, marginBottom: 8 }}>
              <Icon size={15} />
            </span>
            <div style={{ fontSize: 18, fontWeight: 800, color: E.ink, fontVariantNumeric: "tabular-nums" }}>{value}</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: E.sub, letterSpacing: "0.05em", textTransform: "uppercase", marginTop: 2 }}>{label}</div>
            <div style={{ fontSize: 10.5, color: E.faint, marginTop: 2 }}>{sub}</div>
          </Card>
        ))}
      </div>

      {/* Top diagnoses */}
      <Card style={{ padding: 16 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: E.ink, marginBottom: 14 }}>Most Common Diagnoses</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {topDiagnoses.map(([name, count]) => (
            <div key={name}>
              <div className="flex items-center justify-between" style={{ marginBottom: 5 }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: E.ink }}>{name}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: E.sub, fontVariantNumeric: "tabular-nums" }}>{count} case{count > 1 ? "s" : ""}</span>
              </div>
              <div style={{ height: 7, borderRadius: 4, background: E.greySoft, overflow: "hidden" }}>
                <div style={{ width: `${(count / maxDx) * 100}%`, height: "100%", borderRadius: 4, background: E.accent }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </VetShell>
  );
}
