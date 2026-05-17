import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Camera, Heart, Calendar, Scale, Plus, Minus, ChevronLeft } from "lucide-react";
import { useT } from "@/context/LanguageContext";
import { usePet } from "@/context/PetContext";
import { PrimaryButton, JField } from "@/routes/auth";
import { Stepper } from "@/routes/onboarding.avatar";
import PhoneFrame from "@/components/PhoneFrame";

export const Route = createFileRoute("/onboarding/dog")({ component: Step2 });

function Step2() {
  const nav = useNavigate();
  const t = useT();
  const { pet, updatePet } = usePet();
  const [name, setName] = useState(pet.name);
  const [age, setAge] = useState<number>(pet.age ?? 3);
  const [weight, setWeight] = useState<string>(pet.weight != null ? String(pet.weight) : "");
  const [gender, setGender] = useState<"male" | "female">(pet.gender ?? "female");
  const [vacc, setVacc] = useState(pet.vaccinated);

  const handleNext = () => {
    updatePet({
      name: name.trim(),
      age,
      weight: weight ? Number(weight) : null,
      gender,
      vaccinated: vacc,
    });
    nav({ to: "/onboarding/owner" });
  };

  return (
    <PhoneFrame>
    <div className="min-h-screen pb-32 relative overflow-hidden" style={{ background: "var(--bg-page)" }}>
      {/* Watercolor paw trail */}
      <PawTrail />

      <div className="px-6 pt-4 relative">
        <div className="flex items-center mb-4">
          <Link to="/onboarding/avatar" style={{ color: "var(--text-primary)" }}>
            <ChevronLeft className="w-6 h-6" />
          </Link>
        </div>
        <Stepper current={2} />

        <h1 className="text-[20px] font-bold text-center mt-2" style={{ color: "var(--text-primary)" }}>
          {t("ワンちゃんの情報", "Dog Details")}
        </h1>

        {/* Photo upload */}
        <div className="flex justify-center my-6">
          <button
            className="w-[100px] h-[100px] rounded-full flex flex-col items-center justify-center"
            style={{ background: "#FFF0F5", border: "2px dashed #E8829A" }}
          >
            <Camera className="w-7 h-7" style={{ color: "#E8829A" }} strokeWidth={1.8} />
            <span className="text-[11px] mt-1 font-medium" style={{ color: "#E8829A" }}>
              {t("写真を追加", "Add Photo")}
            </span>
          </button>
        </div>

        <div className="space-y-3">
          <FormCard>
            <FieldLabel icon={<Heart className="w-3.5 h-3.5" />} color="#E8829A" required>
              {t("名前", "Name")}
            </FieldLabel>
            <JField
              icon={<Heart className="w-4 h-4" />}
              placeholder={t("例: ハナ", "e.g. Hana")}
              value={name}
              onChange={(v) => { setName(v); updatePet({ name: v }); }}
            />
          </FormCard>

          <FormCard>
            <FieldLabel icon={<Calendar className="w-3.5 h-3.5" />} color="#D4A843" optional>
              {t("年齢", "Age")}
            </FieldLabel>
            <Stepper2
              value={age}
              onChange={setAge}
              suffix={t("歳", "yrs")}
              accent="#D4A843"
            />
          </FormCard>

          <FormCard>
            <FieldLabel icon={<Scale className="w-3.5 h-3.5" />} color="#5B9BD5" optional>
              {t("体重", "Weight")}
            </FieldLabel>
            <JField
              icon={<Scale className="w-4 h-4" />}
              placeholder="8.5"
              type="number"
              value={weight}
              onChange={setWeight}
              right={<span className="text-[13px]" style={{ color: "var(--text-secondary)" }}>kg</span>}
            />
          </FormCard>

          <FormCard>
            <FieldLabel color="#7B68C8">{t("性別", "Gender")}</FieldLabel>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {(["male", "female"] as const).map((g) => {
                const sel = gender === g;
                const isM = g === "male";
                return (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className="h-12 rounded-xl text-[13px] font-semibold transition-all"
                    style={{
                      background: sel ? (isM ? "#E8F2FF" : "#FFF0F5") : "#FAFAF8",
                      border: sel
                        ? `1.5px solid ${isM ? "#5B9BD5" : "#E8829A"}`
                        : "1.5px solid var(--border-card)",
                      color: sel ? (isM ? "#5B9BD5" : "#E8829A") : "#8A8A8A",
                    }}
                  >
                    {isM ? t("♂ オス", "♂ Male") : t("♀ メス", "♀ Female")}
                  </button>
                );
              })}
            </div>
          </FormCard>

          <FormCard>
            <div className="flex items-center justify-between">
              <FieldLabel color="#6BAF92">{t("ワクチン接種済", "Vaccinated")}</FieldLabel>
              <div className="flex items-center gap-2">
                {vacc && <span className="text-[12px] font-medium" style={{ color: "#6BAF92" }}>{t("はい", "Yes")}</span>}
                <button
                  onClick={() => setVacc(!vacc)}
                  className="w-12 h-7 rounded-full relative transition-colors"
                  style={{ background: vacc ? "#6BAF92" : "var(--border-card)" }}
                >
                  <span
                    className="absolute top-0.5 w-6 h-6 bg-white rounded-full transition-all"
                    style={{ left: vacc ? 22 : 2, boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}
                  />
                </button>
              </div>
            </div>
          </FormCard>
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 mx-auto p-4" style={{ maxWidth: 430, background: "linear-gradient(to top, #FAFAF8, rgba(250,250,248,0.9) 70%, transparent)" }}>
        <PrimaryButton onClick={handleNext}>
          {t("次へ", "Next")} →
        </PrimaryButton>
      </div>
    </div>
    </PhoneFrame>
  );
}

function PawTrail() {
  const paws = [
    { l: "8%", t: 60, s: 22, r: -18 },
    { l: "28%", t: 100, s: 18, r: 12 },
    { l: "70%", t: 50, s: 26, r: 25 },
    { l: "85%", t: 110, s: 16, r: -10 },
    { l: "50%", t: 30, s: 20, r: 5 },
  ];
  return (
    <div className="absolute inset-x-0 top-0 pointer-events-none" style={{ height: 160 }}>
      {paws.map((p, i) => (
        <svg
          key={i}
          width={p.s} height={p.s} viewBox="0 0 24 24"
          className="absolute"
          style={{ left: p.l, top: p.t, opacity: 0.15, transform: `rotate(${p.r}deg)`, color: "#FFB7C5" }}
          fill="currentColor"
        >
          <circle cx="6" cy="9" r="2.5" /><circle cx="12" cy="6" r="2.5" />
          <circle cx="18" cy="9" r="2.5" /><ellipse cx="12" cy="16" rx="5" ry="4.5" />
        </svg>
      ))}
    </div>
  );
}

export function FormCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-4" style={{ background: "var(--bg-card)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
      {children}
    </div>
  );
}

export function FieldLabel({
  icon, color, required, optional, children,
}: { icon?: React.ReactNode; color: string; required?: boolean; optional?: boolean; children: React.ReactNode }) {
  const t = useT();
  return (
    <div className="flex items-center justify-between mb-1">
      <span className="text-[12px] font-semibold flex items-center gap-1.5" style={{ color: "var(--text-primary)" }}>
        {icon && <span style={{ color }}>{icon}</span>}
        {children}
        {required && <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#E8829A" }} />}
      </span>
      {optional && (
        <span
          className="text-[10px] px-2 py-0.5 rounded-full"
          style={{ background: "#FFF8DC", color: "#D4A843" }}
        >
          {t("任意", "Optional")}
        </span>
      )}
    </div>
  );
}

function Stepper2({ value, onChange, suffix }: { value: number; onChange: (n: number) => void; suffix: string; accent?: string }) {
  return (
    <div className="flex items-center gap-3 h-[44px]">
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-9 h-9 rounded-full flex items-center justify-center"
        style={{ background: "#F5F0F0", color: "#E8829A" }}
        aria-label="decrease"
      >
        <Minus className="w-4 h-4" />
      </button>
      <div className="flex-1 text-center text-[18px] font-bold tabular-nums" style={{ color: "var(--text-primary)" }}>
        {value}<span className="text-[12px] ml-1" style={{ color: "var(--text-secondary)" }}>{suffix}</span>
      </div>
      <button
        onClick={() => onChange(value + 1)}
        className="w-9 h-9 rounded-full flex items-center justify-center"
        style={{ background: "#E8829A", color: "white" }}
        aria-label="increase"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
