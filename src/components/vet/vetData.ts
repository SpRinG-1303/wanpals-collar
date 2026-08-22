import type { BreedKey } from "@/components/DogAvatar";

/* ================= Patients ================= */

export type SizeClass = "toy" | "small" | "medium" | "large" | "giant";

export type RiskTone = "red" | "amber" | "blue";

export type VetPatient = {
  id: string;
  name: string;
  breed: string;
  breedKey: BreedKey;
  size: SizeClass;
  age: string;
  weightKg: number;
  owner: string;
  gender: "male" | "female";
  conditions: string[];
};

export const VET_PATIENTS: VetPatient[] = [
  {
    id: "p1",
    name: "Bruno",
    breed: "Indian Pariah Dog",
    breedKey: "mixed",
    size: "medium",
    age: "3y 4m",
    weightKg: 24,
    owner: "Priya Sharma",
    gender: "male",
    conditions: ["Flea allergy dermatitis (2025)"],
  },
  {
    id: "p2",
    name: "Coco",
    breed: "Pug",
    breedKey: "frenchie",
    size: "small",
    age: "5y 1m",
    weightKg: 8,
    owner: "Rahul Mehta",
    gender: "female",
    conditions: ["BOAS grade II", "Corneal ulcer (2024)"],
  },
  {
    id: "p3",
    name: "Simba",
    breed: "Golden Retriever",
    breedKey: "golden",
    size: "large",
    age: "7y 8m",
    weightKg: 30,
    owner: "Ananya Iyer",
    gender: "male",
    conditions: ["Early hip dysplasia", "Hypothyroidism"],
  },
  {
    id: "p4",
    name: "Sheru",
    breed: "German Shepherd",
    breedKey: "shiba",
    size: "large",
    age: "4y 0m",
    weightKg: 34,
    owner: "Vikram Singh",
    gender: "male",
    conditions: [],
  },
  {
    id: "p5",
    name: "Milo",
    breed: "Chihuahua",
    breedKey: "chihuahua",
    size: "toy",
    age: "2y 2m",
    weightKg: 2.4,
    owner: "Sana Qureshi",
    gender: "male",
    conditions: ["Patellar luxation grade I"],
  },
];

/* ================= Breed-specific risk tags ================= */

export type RiskTag = { label: string; tone: RiskTone };

const BREED_RISKS: Record<string, RiskTag[]> = {
  Pug: [
    { label: "Respiratory Risk", tone: "red" },
    { label: "Heat Sensitivity", tone: "red" },
    { label: "Eye Ulcer Prone", tone: "amber" },
  ],
  "French Bulldog": [
    { label: "Respiratory Risk", tone: "red" },
    { label: "Heat Sensitivity", tone: "amber" },
    { label: "Skin Fold Dermatitis", tone: "amber" },
  ],
  "Golden Retriever": [
    { label: "Hip Dysplasia", tone: "amber" },
    { label: "Cancer Watch", tone: "red" },
  ],
  "Labrador Retriever": [
    { label: "Hip Dysplasia", tone: "amber" },
    { label: "Obesity Risk", tone: "amber" },
  ],
  "German Shepherd": [
    { label: "Hip Dysplasia", tone: "amber" },
    { label: "Bloat (GDV) Risk", tone: "red" },
  ],
  Chihuahua: [
    { label: "Dental Disease", tone: "amber" },
    { label: "Patellar Luxation", tone: "amber" },
  ],
  Dachshund: [{ label: "IVDD / Back Risk", tone: "red" }],
  "Indian Pariah Dog": [{ label: "Tick-Borne Disease", tone: "amber" }],
};

export function riskTagsFor(patient: VetPatient): RiskTag[] {
  const tags = BREED_RISKS[patient.breed] ?? [];
  const extra: RiskTag[] = [];
  if (isMdr1Sensitive(patient.breed)) extra.push({ label: "MDR1 Sensitivity", tone: "red" });
  if (tags.length === 0 && extra.length === 0) return [{ label: "General Wellness", tone: "blue" }];
  return [...tags, ...extra];
}

/* ================= Size-adjusted vital baselines ================= */

export type VitalBaseline = { hr: [number, number]; temp: [number, number]; rr: [number, number] };

export const VITAL_BASELINES: Record<SizeClass, VitalBaseline> = {
  toy: { hr: [100, 140], temp: [38.3, 39.2], rr: [18, 34] },
  small: { hr: [100, 140], temp: [38.3, 39.2], rr: [18, 34] },
  medium: { hr: [80, 120], temp: [38.3, 39.2], rr: [15, 30] },
  large: { hr: [60, 100], temp: [38.0, 39.0], rr: [12, 24] },
  giant: { hr: [60, 90], temp: [38.0, 39.0], rr: [12, 24] },
};

export const SIZE_LABEL: Record<SizeClass, string> = {
  toy: "Toy breed",
  small: "Small breed",
  medium: "Medium breed",
  large: "Large breed",
  giant: "Giant breed",
};

/* Current collar vitals (mock live feed) — keyed by patient id */
export const CURRENT_VITALS: Record<string, { hr: number; temp: number; rr: number }> = {
  p1: { hr: 96, temp: 38.5, rr: 22 },
  p2: { hr: 118, temp: 39.1, rr: 36 },
  p3: { hr: 72, temp: 38.4, rr: 18 },
  p4: { hr: 78, temp: 38.6, rr: 20 },
  p5: { hr: 122, temp: 38.7, rr: 28 },
};

/* ================= Collar behaviour telemetry ================= */

export type ScratchDay = { day: string; events: number };

export const SCRATCH_SHAKE_WEEK: Record<string, ScratchDay[]> = {
  p1: [
    { day: "Mon", events: 4 }, { day: "Tue", events: 5 }, { day: "Wed", events: 3 },
    { day: "Thu", events: 6 }, { day: "Fri", events: 9 }, { day: "Sat", events: 12 },
    { day: "Today", events: 18 },
  ],
  p2: [
    { day: "Mon", events: 7 }, { day: "Tue", events: 6 }, { day: "Wed", events: 8 },
    { day: "Thu", events: 7 }, { day: "Fri", events: 9 }, { day: "Sat", events: 8 },
    { day: "Today", events: 10 },
  ],
  p3: [
    { day: "Mon", events: 3 }, { day: "Tue", events: 2 }, { day: "Wed", events: 4 },
    { day: "Thu", events: 3 }, { day: "Fri", events: 3 }, { day: "Sat", events: 2 },
    { day: "Today", events: 4 },
  ],
};

export const DEFAULT_SCRATCH_WEEK: ScratchDay[] = [
  { day: "Mon", events: 4 }, { day: "Tue", events: 5 }, { day: "Wed", events: 4 },
  { day: "Thu", events: 6 }, { day: "Fri", events: 5 }, { day: "Sat", events: 6 },
  { day: "Today", events: 7 },
];

export function scratchWeekFor(patientId: string): ScratchDay[] {
  return SCRATCH_SHAKE_WEEK[patientId] ?? DEFAULT_SCRATCH_WEEK;
}

/** Spike = today is >1.8x the week's baseline average */
export function scratchSpike(week: ScratchDay[]): { spike: boolean; pct: number } {
  const base = week.slice(0, -1);
  const avg = base.reduce((s, d) => s + d.events, 0) / Math.max(base.length, 1);
  const today = week[week.length - 1].events;
  const pct = avg > 0 ? Math.round(((today - avg) / avg) * 100) : 0;
  return { spike: today > avg * 1.8, pct };
}

/* Thermal panting correlator */
export type PantingFeed = { ambientC: number; pantingPerMin: number };
export const PANTING_FEED: Record<string, PantingFeed> = {
  p1: { ambientC: 34, pantingPerMin: 214 },
  p2: { ambientC: 33, pantingPerMin: 240 },
  p3: { ambientC: 29, pantingPerMin: 90 },
  p4: { ambientC: 30, pantingPerMin: 120 },
  p5: { ambientC: 27, pantingPerMin: 60 },
};
export const DEFAULT_PANTING: PantingFeed = { ambientC: 30, pantingPerMin: 110 };

export function heatStressRisk(feed: PantingFeed): "high" | "moderate" | "low" {
  if (feed.ambientC >= 32 && feed.pantingPerMin >= 180) return "high";
  if (feed.ambientC >= 30 && feed.pantingPerMin >= 120) return "moderate";
  return "low";
}

/* Gait asymmetry — % of body weight borne per leg */
export type GaitReading = { leg: string; pct: number };
export const GAIT_FEED: Record<string, GaitReading[]> = {
  p3: [
    { leg: "Front L", pct: 31 },
    { leg: "Front R", pct: 30 },
    { leg: "Hind L", pct: 20 },
    { leg: "Hind R", pct: 19 },
  ],
};
export const DEFAULT_GAIT: GaitReading[] = [
  { leg: "Front L", pct: 27 },
  { leg: "Front R", pct: 27 },
  { leg: "Hind L", pct: 23 },
  { leg: "Hind R", pct: 23 },
];
export const GAIT_IDEAL = 25;

export function gaitAsymmetry(readings: GaitReading[]): { flag: boolean; worst: GaitReading; deficit: number } {
  let worst = readings[0];
  for (const r of readings) if (Math.abs(r.pct - GAIT_IDEAL) > Math.abs(worst.pct - GAIT_IDEAL)) worst = r;
  const deficit = Math.round(((GAIT_IDEAL - worst.pct) / GAIT_IDEAL) * 100);
  return { flag: deficit >= 12, worst, deficit };
}

/* ================= Body map ================= */

export type BodyZone = {
  id: string;
  label: string;
  cx: number;
  cy: number;
  r: number;
  issues: string[];
};

export const BODY_ZONES: BodyZone[] = [
  { id: "ear", label: "Left Ear", cx: 44, cy: 26, r: 11, issues: ["Otitis externa", "Ear mites", "Yeast infection", "Aural hematoma"] },
  { id: "eye", label: "Eye", cx: 30, cy: 34, r: 7, issues: ["Conjunctivitis", "Corneal ulcer", "Cherry eye"] },
  { id: "mouth", label: "Mouth", cx: 14, cy: 46, r: 8, issues: ["Gingivitis", "Broken tooth", "Oral foreign body"] },
  { id: "neck", label: "Neck", cx: 62, cy: 52, r: 11, issues: ["Collar dermatitis", "Lymph node swelling", "Hot spot"] },
  { id: "chest", label: "Chest", cx: 86, cy: 78, r: 13, issues: ["Bronchitis / cough", "Cardiac murmur", "Kennel cough"] },
  { id: "abdomen", label: "Abdomen", cx: 122, cy: 82, r: 13, issues: ["Gastritis", "Bloat (GDV) watch", "Diarrhea", "Foreign body"] },
  { id: "flank", label: "Flank", cx: 148, cy: 62, r: 12, issues: ["Hot spot", "Flea allergy dermatitis", "Skin mass"] },
  { id: "frontpaw", label: "Front Paw", cx: 76, cy: 126, r: 9, issues: ["Pad tear", "Interdigital cyst", "Torn dewclaw"] },
  { id: "hindpaw", label: "Hind Paw", cx: 152, cy: 126, r: 9, issues: ["Pad tear", "Interdigital cyst", "ACL tear watch"] },
  { id: "tail", label: "Tail", cx: 186, cy: 40, r: 10, issues: ["Tail tip injury", "Anal gland impaction"] },
];

/** SkinSense AI uploads projected onto the model (patientId → zones with findings) */
export const SKIN_HISTORY_PINS: Record<string, { zoneId: string; note: string }[]> = {
  p1: [{ zoneId: "flank", note: "Hot spot photo — SkinSense AI, 2 days ago" }],
  p2: [{ zoneId: "ear", note: "Ear redness photo — SkinSense AI, last week" }],
};

/* ================= e-Prescription: Toxic-Check Engine ================= */

export const MDR1_BREEDS = [
  "Collie",
  "Australian Shepherd",
  "Shetland Sheepdog",
  "Border Collie",
  "Old English Sheepdog",
  "German Shepherd",
];

export function isMdr1Sensitive(breed: string): boolean {
  return MDR1_BREEDS.some((b) => breed.toLowerCase().includes(b.toLowerCase()));
}

export type Medication = {
  id: string;
  name: string;
  category: string;
  mdr1Risk: boolean;
  notes: string;
};

export const MEDICATIONS: Medication[] = [
  { id: "m1", name: "Ivermectin", category: "Antiparasitic", mdr1Risk: true, notes: "Neurotoxic in MDR1-mutant breeds even at low doses." },
  { id: "m2", name: "Loperamide", category: "Antidiarrheal", mdr1Risk: true, notes: "CNS depression risk in MDR1-mutant breeds." },
  { id: "m3", name: "Apomorphine", category: "Emetic", mdr1Risk: true, notes: "Use reduced dose in MDR1-mutant breeds." },
  { id: "m4", name: "Carprofen", category: "NSAID", mdr1Risk: false, notes: "Avoid with kidney/liver disease; give with food." },
  { id: "m5", name: "Apoquel (Oclacitinib)", category: "Antipruritic", mdr1Risk: false, notes: "Not for dogs under 12 months." },
  { id: "m6", name: "Amoxicillin-Clavulanate", category: "Antibiotic", mdr1Risk: false, notes: "Broad spectrum; complete full course." },
  { id: "m7", name: "Prednisolone", category: "Corticosteroid", mdr1Risk: false, notes: "Do not combine with NSAIDs." },
];

export type SafetyFlag = { level: "danger" | "caution" | "ok"; text: string };

export function checkMedication(med: Medication, patient: VetPatient): SafetyFlag[] {
  const flags: SafetyFlag[] = [];
  if (med.mdr1Risk && isMdr1Sensitive(patient.breed)) {
    flags.push({
      level: "danger",
      text: `${patient.breed} may carry the MDR1 gene mutation — ${med.name} can be neurotoxic. Choose an alternative or genetic-test first.`,
    });
  } else if (med.mdr1Risk) {
    flags.push({ level: "caution", text: `${med.name}: MDR1 risk not indicated for ${patient.breed}, but confirm no herding-breed ancestry.` });
  }
  if (med.id === "m4" && patient.conditions.some((c) => c.toLowerCase().includes("kidney"))) {
    flags.push({ level: "danger", text: "NSAID contraindicated with renal history." });
  }
  if (med.id === "m5" && patient.age.startsWith("0")) {
    flags.push({ level: "caution", text: "Apoquel is not licensed for dogs under 12 months." });
  }
  if (flags.length === 0) {
    flags.push({ level: "ok", text: `No breed or drug-interaction conflicts for ${patient.name}. Safe to prescribe.` });
  }
  return flags;
}

/* ================= Toxicity calculator ================= */

export type Toxin = {
  id: string;
  name: string;
  unit: "g" | "pieces";
  unitLabel: string;
  mgPerUnit: number; // active toxin mg per gram (or per piece)
  thresholds: { mild: number; moderate: number; severe: number }; // mg/kg
  hint: string;
};

export const TOXINS: Toxin[] = [
  { id: "t1", name: "Dark chocolate", unit: "g", unitLabel: "grams", mgPerUnit: 15, thresholds: { mild: 20, moderate: 40, severe: 60 }, hint: "Theobromine ≈ 15 mg/g" },
  { id: "t2", name: "Milk chocolate", unit: "g", unitLabel: "grams", mgPerUnit: 2.3, thresholds: { mild: 20, moderate: 40, severe: 60 }, hint: "Theobromine ≈ 2.3 mg/g" },
  { id: "t3", name: "Grapes / raisins", unit: "pieces", unitLabel: "pieces", mgPerUnit: 500, thresholds: { mild: 50, moderate: 100, severe: 150 }, hint: "Even small amounts can cause kidney failure" },
  { id: "t4", name: "Xylitol (gum)", unit: "pieces", unitLabel: "pieces", mgPerUnit: 1000, thresholds: { mild: 75, moderate: 150, severe: 500 }, hint: "≈ 1 g xylitol per piece of gum" },
  { id: "t5", name: "Onion / garlic", unit: "g", unitLabel: "grams", mgPerUnit: 200, thresholds: { mild: 3000, moderate: 4500, severe: 6000 }, hint: "Toxic at ~15–30 g per kg body weight" },
];

export type ToxicityResult = {
  doseMgKg: number;
  level: "minimal" | "mild" | "moderate" | "severe";
  advice: string;
};

export function calcToxicity(toxin: Toxin, amount: number, weightKg: number): ToxicityResult {
  const doseMgKg = weightKg > 0 ? (amount * toxin.mgPerUnit) / weightKg : 0;
  let level: ToxicityResult["level"] = "minimal";
  if (doseMgKg >= toxin.thresholds.severe) level = "severe";
  else if (doseMgKg >= toxin.thresholds.moderate) level = "moderate";
  else if (doseMgKg >= toxin.thresholds.mild) level = "mild";

  const advice =
    level === "severe"
      ? "EMERGENCY — Induce vomiting immediately (if <2h since ingestion) and start IV fluids. Refer to a 24×7 hospital now."
      : level === "moderate"
        ? "High risk — Induce vomiting if within 2 hours, give activated charcoal, monitor vitals every 30 min."
        : level === "mild"
          ? "Mild exposure — Likely GI upset only. Monitor for vomiting, tremors or lethargy for 12–24 hours."
          : "Below toxic threshold — No treatment needed. Reassure the owner and log the exposure.";

  return { doseMgKg: Math.round(doseMgKg * 10) / 10, level, advice };
}

/* ================= Today's consult queue ================= */

export type Appointment = { patientId: string; time: string; reason: string; type: "Video" | "Clinic" };

export const APPOINTMENTS: Appointment[] = [
  { patientId: "p2", time: "10:30", reason: "Breathing difficulty follow-up", type: "Video" },
  { patientId: "p1", time: "12:00", reason: "Scratching & ear odour", type: "Clinic" },
  { patientId: "p3", time: "15:30", reason: "Limping — hind left leg", type: "Video" },
];
