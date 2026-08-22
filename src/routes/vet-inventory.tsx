import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Package, AlertTriangle, PackagePlus } from "lucide-react";
import { toast } from "sonner";
import VetShell from "@/components/vet/VetShell";
import { Card, Chip, E, GhostBtn } from "@/components/vet/ehr";
import { INVENTORY, type StockLevel } from "@/components/vet/vetData";

export const Route = createFileRoute("/vet-inventory")({
  head: () => ({
    meta: [
      { title: "Inventory — Pawsitive Diagnostics Veterinary" },
      { name: "description", content: "Clinic pharmacy and consumables stock levels with low-stock alerts." },
      { property: "og:title", content: "Inventory — Pawsitive Diagnostics Veterinary" },
      { property: "og:description", content: "Clinic inventory and stock management." },
    ],
  }),
  component: VetInventory,
});

const LEVEL_META: Record<StockLevel, { label: string; tone: "green" | "amber" | "red" }> = {
  ok: { label: "In Stock", tone: "green" },
  low: { label: "Low", tone: "amber" },
  critical: { label: "Critical", tone: "red" },
};

function VetInventory() {
  const [restocked, setRestocked] = useState<string[]>([]);

  const items = INVENTORY.map((i) => (restocked.includes(i.id) ? { ...i, stock: i.stock + 50, level: "ok" as StockLevel } : i));
  const lowCount = items.filter((i) => i.level !== "ok").length;

  const restock = (id: string, name: string) => {
    setRestocked((r) => [...r, id]);
    toast.success(`Purchase order raised — ${name} restocked.`);
  };

  return (
    <VetShell title="Inventory" subtitle={`${items.length} items tracked · ${lowCount} need restocking`}>
      {lowCount > 0 && (
        <div className="flex items-start" style={{ gap: 9, background: E.amberSoft, borderRadius: 12, padding: "10px 13px", marginBottom: 14 }}>
          <AlertTriangle size={15} style={{ color: E.amber, flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 12, lineHeight: 1.5, fontWeight: 600, color: E.amber }}>
            {lowCount} item{lowCount > 1 ? "s are" : " is"} below par level — raise a purchase order before the weekend rush.
          </span>
        </div>
      )}

      <Card style={{ overflow: "hidden" }}>
        {items.map((item, i) => {
          const meta = LEVEL_META[item.level];
          return (
            <div key={item.id} className="flex items-center" style={{ gap: 11, padding: "12px 16px", borderTop: i === 0 ? "none" : `1px solid ${E.borderSubtle}` }}>
              <span className="flex items-center justify-center" style={{ width: 36, height: 36, borderRadius: 10, background: E.greySoft, color: E.grey, flexShrink: 0 }}>
                <Package size={16} />
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 13, fontWeight: 700, color: E.ink }}>{item.item}</span>
                <span style={{ display: "block", fontSize: 11.5, color: E.sub, marginTop: 1 }}>
                  {item.category} · <span style={{ fontWeight: 700, color: item.level === "ok" ? E.ink : meta.tone === "red" ? E.red : E.amber }}>{item.stock} {item.unit}</span> on hand
                </span>
              </span>
              <Chip tone={meta.tone} dot>{meta.label}</Chip>
              {item.level !== "ok" && (
                <GhostBtn style={{ height: 30, fontSize: 11.5, padding: "0 11px" }} onClick={() => restock(item.id, item.item)}>
                  <PackagePlus size={13} /> Restock
                </GhostBtn>
              )}
            </div>
          );
        })}
      </Card>
    </VetShell>
  );
}
