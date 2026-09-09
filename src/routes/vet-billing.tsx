import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Receipt, IndianRupee, Printer, Check } from "lucide-react";
import { toast } from "sonner";
import VetShell from "@/components/vet/VetShell";
import { Card, Chip, E, GhostBtn } from "@/components/vet/ehr";
import { INVOICES, patientById } from "@/components/vet/vetData";

export const Route = createFileRoute("/vet-billing")({
  head: () => ({
    meta: [
      { title: "Billing — MOooMENTUM Veterinary" },
      { name: "description", content: "Clinic invoices, pending payments and revenue summary." },
      { property: "og:title", content: "Billing — MOooMENTUM Veterinary" },
      { property: "og:description", content: "Clinic invoices and payments." },
    ],
  }),
  component: VetBilling,
});

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function VetBilling() {
  const [paid, setPaid] = useState<string[]>([]);

  const invoices = INVOICES.map((inv) => (paid.includes(inv.id) ? { ...inv, status: "Paid" as const } : inv));
  const totals = useMemo(() => {
    const collected = invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
    const pending = invoices.filter((i) => i.status === "Pending").reduce((s, i) => s + i.amount, 0);
    const overdue = invoices.filter((i) => i.status === "Overdue").reduce((s, i) => s + i.amount, 0);
    return { collected, pending, overdue };
  }, [invoices]);

  const markPaid = (id: string) => {
    setPaid((p) => [...p, id]);
    toast.success(`Payment recorded for ${id}.`);
  };

  return (
    <VetShell title="Billing" subtitle="Invoices and payments for this branch">
      {/* Summary */}
      <div className="grid grid-cols-3" style={{ gap: 10, marginBottom: 14 }}>
        {[
          { label: "Collected", value: totals.collected, fg: E.green, bg: E.greenSoft },
          { label: "Pending", value: totals.pending, fg: E.amber, bg: E.amberSoft },
          { label: "Overdue", value: totals.overdue, fg: E.red, bg: E.redSoft },
        ].map((s) => (
          <Card key={s.label} style={{ padding: "12px 13px" }}>
            <span className="flex items-center justify-center" style={{ width: 28, height: 28, borderRadius: 8, background: s.bg, color: s.fg, marginBottom: 8 }}>
              <IndianRupee size={14} />
            </span>
            <div style={{ fontSize: 16, fontWeight: 800, color: E.ink, fontVariantNumeric: "tabular-nums" }}>{inr(s.value)}</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: E.sub, letterSpacing: "0.05em", textTransform: "uppercase", marginTop: 2 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Invoices */}
      <Card style={{ overflow: "hidden" }}>
        <div style={{ padding: "13px 16px", fontSize: 13.5, fontWeight: 700, color: E.ink, borderBottom: `1px solid ${E.borderSubtle}` }}>Recent Invoices</div>
        {invoices.map((inv, i) => {
          const p = patientById(inv.patientId);
          return (
            <div key={inv.id} className="flex items-center" style={{ gap: 11, padding: "12px 16px", borderTop: i === 0 ? "none" : `1px solid ${E.borderSubtle}` }}>
              <span className="flex items-center justify-center" style={{ width: 36, height: 36, borderRadius: 10, background: E.pale, color: E.accent, flexShrink: 0 }}>
                <Receipt size={16} />
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 13, fontWeight: 700, color: E.ink }}>
                  {inv.id} <span style={{ fontWeight: 500, color: E.sub }}>· {inv.owner}</span>
                </span>
                <span style={{ display: "block", fontSize: 11.5, color: E.sub, marginTop: 1 }}>
                  {p?.name} · {inv.date}
                </span>
              </span>
              <span style={{ fontSize: 13.5, fontWeight: 800, color: E.ink, fontVariantNumeric: "tabular-nums" }}>{inr(inv.amount)}</span>
              <Chip tone={inv.status === "Paid" ? "green" : inv.status === "Pending" ? "amber" : "red"} dot>{inv.status}</Chip>
              {inv.status !== "Paid" ? (
                <GhostBtn style={{ height: 30, fontSize: 11.5, padding: "0 11px" }} onClick={() => markPaid(inv.id)}>
                  <Check size={13} /> Mark Paid
                </GhostBtn>
              ) : (
                <GhostBtn style={{ height: 30, fontSize: 11.5, padding: "0 11px" }} onClick={() => toast.info(`Printing ${inv.id}…`)}>
                  <Printer size={13} />
                </GhostBtn>
              )}
            </div>
          );
        })}
      </Card>
    </VetShell>
  );
}
