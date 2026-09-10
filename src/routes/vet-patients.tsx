import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Plus, ChevronRight, Phone, X } from "lucide-react";
import { toast } from "sonner";
import VetShell from "@/components/vet/VetShell";
import { Card, Chip, E, FieldLabel, GhostBtn, PatientAvatar, PrimaryBtn, inputStyle } from "@/components/vet/ehr";
import { VET_PATIENTS, type Species, type VetPatient } from "@/components/vet/vetData";

type Search = { q?: string };

export const Route = createFileRoute("/vet-patients")({
  validateSearch: (s: Record<string, unknown>): Search => ({ q: typeof s.q === "string" ? s.q : undefined }),
  head: () => ({
    meta: [
      { title: "Patients — Pawsitive Diagnostics Veterinary" },
      { name: "description", content: "Veterinary patient directory: search by name, owner, phone, microchip or medical record number." },
      { property: "og:title", content: "Patients — Pawsitive Diagnostics Veterinary" },
      { property: "og:description", content: "Veterinary patient directory and medical records." },
    ],
  }),
  component: VetPatients,
});

const SPECIES_FILTERS: { id: Species | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "dog", label: "Dogs" },
  { id: "cat", label: "Cats" },
  { id: "other", label: "Other" },
];

function VetPatients() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const [query, setQuery] = useState(q ?? "");
  const [species, setSpecies] = useState<Species | "all">("all");
  const [addOpen, setAddOpen] = useState(false);
  const [extra, setExtra] = useState<VetPatient[]>([]);
  const [form, setForm] = useState({ name: "", species: "dog" as Species, breed: "", owner: "", phone: "" });

  const all = useMemo(() => [...VET_PATIENTS, ...extra], [extra]);
  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    return all
      .filter((p) => species === "all" || p.species === species)
      .filter((p) => !term || [p.name, p.owner, p.microchip, p.patientCode, p.ownerPhone].join(" ").toLowerCase().includes(term));
  }, [all, query, species]);

  const savePatient = () => {
    if (!form.name.trim() || !form.owner.trim()) {
      toast.error("Patient name and owner name are required.");
      return;
    }
    const np: VetPatient = {
      id: `p-new-${Date.now()}`,
      name: form.name.trim(),
      species: form.species,
      breed: form.breed.trim() || (form.species === "cat" ? "Domestic Shorthair" : "Mixed Breed"),
      breedKey: "mixed",
      size: "medium",
      age: "—",
      weightKg: 0,
      gender: "male",
      owner: form.owner.trim(),
      ownerPhone: form.phone.trim() || "—",
      patientCode: `PT-${10360 + extra.length}`,
      microchip: "—",
      status: "Active Patient",
      conditions: [],
      allergies: [],
      currentMeds: [],
      vaccinationStatus: "Due soon",
      lastVisit: "—",
      nextFollowUp: "—",
      tempC: 38.5,
    };
    setExtra((x) => [...x, np]);
    setAddOpen(false);
    setForm({ name: "", species: "dog", breed: "", owner: "", phone: "" });
    toast.success(`${np.name} registered — record ${np.patientCode} created.`);
    navigate({ to: "/vet-patient/$id", params: { id: np.id } });
  };

  return (
    <VetShell
      title="Patients"
      subtitle={`${all.length} registered patients at this clinic`}
      actions={<PrimaryBtn onClick={() => setAddOpen(true)}><Plus size={15} /> New Patient</PrimaryBtn>}
    >
      {/* Search + filters */}
      <Card style={{ padding: 14, marginBottom: 14 }}>
        <div className="flex items-center flex-wrap" style={{ gap: 10 }}>
          <div className="flex items-center" style={{ gap: 9, height: 40, borderRadius: 10, border: `1px solid ${E.border}`, background: E.bg, padding: "0 13px", flex: 1, minWidth: 220 }}>
            <Search size={16} style={{ color: E.faint, flexShrink: 0 }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search patient, owner, microchip ID…"
              style={{ flex: 1, minWidth: 0, border: "none", background: "transparent", outline: "none", fontSize: 13.5, color: E.ink }}
            />
          </div>
          <div className="flex" style={{ gap: 7 }}>
            {SPECIES_FILTERS.map((f) => {
              const active = species === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setSpecies(f.id)}
                  style={{
                    height: 32, padding: "0 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                    border: active ? "none" : `1px solid ${E.border}`,
                    background: active ? E.accent : E.card, color: active ? "#fff" : E.sub,
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Directory */}
      <Card style={{ overflow: "hidden" }}>
        {results.length === 0 ? (
          <div style={{ padding: "36px 16px", textAlign: "center", fontSize: 13, color: E.sub }}>
            No patients match “{query}”.
          </div>
        ) : (
          results.map((p, i) => (
            <button
              key={p.id}
              onClick={() => navigate({ to: "/vet-patient/$id", params: { id: p.id } })}
              className="w-full flex items-center text-left"
              style={{ gap: 13, padding: "13px 16px", borderTop: i === 0 ? "none" : `1px solid ${E.borderSubtle}`, border: "none", background: "transparent" }}
            >
              <PatientAvatar patient={p} size={44} />
              <span style={{ flex: "1 1 0", minWidth: 0 }}>
                <span className="flex items-center" style={{ gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: E.ink }}>{p.name}</span>
                  <Chip tone={p.status === "Active Patient" ? "green" : "grey"} dot>{p.status}</Chip>
                </span>
                <span style={{ display: "block", fontSize: 12, color: E.sub, marginTop: 2 }}>
                  {p.breed} · {p.gender === "female" ? "Female" : "Male"} · {p.age}{p.weightKg > 0 ? ` · ${p.weightKg} kg` : ""}
                </span>
              </span>
              <span className="hidden" style={{ width: 190, flexShrink: 0 }}>
                <span style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: E.ink }}>{p.owner}</span>
                <span className="flex items-center" style={{ gap: 4, fontSize: 11.5, color: E.sub, marginTop: 2 }}>
                  <Phone size={11} /> {p.ownerPhone}
                </span>
              </span>
              <span className="hidden" style={{ width: 170, flexShrink: 0 }}>
                <span style={{ display: "block", fontSize: 12, color: E.sub }}>ID {p.patientCode}</span>
                <span style={{ display: "block", fontSize: 11, color: E.faint, marginTop: 2 }}>Chip {p.microchip}</span>
              </span>
              <span className="hidden" style={{ width: 110, flexShrink: 0 }}>
                <span style={{ display: "block", fontSize: 10.5, fontWeight: 600, color: E.faint, letterSpacing: "0.04em", textTransform: "uppercase" }}>Last visit</span>
                <span style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: E.ink, marginTop: 2 }}>{p.lastVisit}</span>
              </span>
              <ChevronRight size={17} style={{ color: E.faint, flexShrink: 0 }} />
            </button>
          ))
        )}
      </Card>

      {/* New patient modal */}
      {addOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(20,28,44,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => setAddOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: E.card, borderRadius: 16, padding: 22, width: "100%", maxWidth: 420, boxShadow: "0 24px 60px rgba(20,28,44,0.25)" }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: E.ink }}>Register New Patient</div>
              <button onClick={() => setAddOpen(false)} aria-label="Close" style={{ background: "none", border: "none", color: E.sub, padding: 4 }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <FieldLabel>Patient name *</FieldLabel>
                <input autoFocus value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Rocky" style={inputStyle} />
              </div>
              <div className="grid grid-cols-2" style={{ gap: 10 }}>
                <div>
                  <FieldLabel>Species</FieldLabel>
                  <select value={form.species} onChange={(e) => setForm({ ...form, species: e.target.value as Species })} style={{ ...inputStyle, appearance: "none" }}>
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <FieldLabel>Breed</FieldLabel>
                  <input value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })} placeholder="Breed" style={inputStyle} />
                </div>
              </div>
              <div>
                <FieldLabel>Owner name *</FieldLabel>
                <input value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} placeholder="Owner full name" style={inputStyle} />
              </div>
              <div>
                <FieldLabel>Owner phone</FieldLabel>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 …" style={inputStyle} />
              </div>
              <div className="flex" style={{ gap: 10, marginTop: 4 }}>
                <GhostBtn onClick={() => setAddOpen(false)} style={{ flex: 1 }}>Cancel</GhostBtn>
                <PrimaryBtn onClick={savePatient} style={{ flex: 1 }}>Register Patient</PrimaryBtn>
              </div>
            </div>
          </div>
        </div>
      )}
    </VetShell>
  );
}
