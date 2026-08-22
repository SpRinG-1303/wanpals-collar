export type Intent = "emergency" | "findVet" | "vaccines" | "healthCheck" | "general";

const EMERGENCY = ["emergency","sos","help","urgent","danger","緊急","助けて","危険","やばい","具合が悪い","倒れた","blood","bleeding","不調","痙攣","seizure"];
const FIND_VET = ["vet","clinic","hospital","doctor","find vet","find clinic","獣医","動物病院","クリニック","病院","近く","nearby","where"];
const VACCINES = ["vaccine","vaccination","shot","immunize","immunization","ワクチン","予防接種","注射","接種","rabies","狂犬病","フィラリア","heartworm"];
const HEALTH = ["health","check","sensor","temperature","健康","体温","センサー","スコア","how is","元気","健康状態","データ"];

export function detectIntent(message: string): Intent {
  const m = message.toLowerCase();
  const hit = (list: string[]) => list.some((k) => m.includes(k.toLowerCase()));
  if (hit(EMERGENCY)) return "emergency";
  if (hit(VACCINES)) return "vaccines";
  if (hit(FIND_VET)) return "findVet";
  if (hit(HEALTH)) return "healthCheck";
  return "general";
}

export const NEARBY_CLINICS = [
  { jp: "Bandra Pet Hospital", en: "Bandra Pet Hospital", km: 0.8, rating: 4.6, em: true, phone: "+91-22-4890-1234" },
  { jp: "Juhu Veterinary Clinic", en: "Juhu Veterinary Clinic", km: 1.2, rating: 4.4, em: false, phone: "+91-22-4890-5678" },
  { jp: "Andheri 24x7 Animal Medical", en: "Andheri 24x7 Animal Medical", km: 2.1, rating: 4.8, em: true, phone: "+91-22-4890-9012" },
];

export const VACCINE_RECORDS = [
  { jp: "狂犬病", en: "Rabies", last: "2024-03-15", next: "2025-03-15", status: "ok" as const },
  { jp: "混合ワクチン", en: "Combined", last: "2024-01-10", next: "2025-01-10", status: "ok" as const },
  { jp: "フィラリア", en: "Heartworm", last: "2023-05-01", next: "2024-05-01", status: "overdue" as const },
];
