import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, User, Calendar, MapPin, Search, Check, X, Home } from "lucide-react";
import { PREFECTURES } from "@/lib/mock";
import { useT } from "@/context/LanguageContext";
import { usePet } from "@/context/PetContext";
import { JField } from "@/routes/auth";
import { Stepper, } from "@/routes/onboarding.avatar";
import { FormCard, FieldLabel } from "@/routes/onboarding.dog";
import PhoneFrame from "@/components/PhoneFrame";

export const Route = createFileRoute("/onboarding/owner")({ component: Step3 });

function Step3() {
  const nav = useNavigate();
  const t = useT();
  const { pet, updatePet } = usePet();
  const [ownerName, setOwnerName] = useState(pet.ownerName);
  const [ownerAge, setOwnerAge] = useState<string>(pet.ownerAge != null ? String(pet.ownerAge) : "");
  const [pref, setPref] = useState(pet.prefecture || "東京都");
  const [sheet, setSheet] = useState(false);
  const [burst, setBurst] = useState(false);

  const finish = () => {
    updatePet({
      ownerName: ownerName.trim(),
      ownerAge: ownerAge ? Number(ownerAge) : null,
      prefecture: pref,
    });
    setBurst(true);
    setTimeout(() => nav({ to: "/home" }), 700);
  };

  return (
    <PhoneFrame>
    <div className="min-h-screen pb-32" style={{ background: "#FAFAF8" }}>
      <div className="px-6 pt-4">
        <div className="flex items-center mb-4">
          <Link to="/onboarding/dog" style={{ color: "#2C2C2C" }}>
            <ChevronLeft className="w-6 h-6" />
          </Link>
        </div>
        <Stepper current={3} />

        {/* Warm welcome illustration */}
        <div className="relative h-[110px] flex items-center justify-center my-3">
          <div
            className="absolute rounded-full"
            style={{ width: 110, height: 110, background: "#FFF0F5", filter: "blur(1px)" }}
          />
          {/* sakura petals */}
          {[
            { l: "8%", t: "20%", s: 7 },
            { l: "82%", t: "15%", s: 9 },
            { l: "88%", t: "65%", s: 6 },
            { l: "6%", t: "70%", s: 8 },
          ].map((p, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{ left: p.l, top: p.t, width: p.s, height: p.s * 1.4, background: "#FFB7C5", transform: `rotate(${i * 40}deg)`, opacity: 0.7 }}
            />
          ))}
          <div className="relative w-[90px] h-[90px] rounded-full flex items-center justify-center" style={{ background: "#FFFFFF", boxShadow: "0 8px 20px rgba(232,130,154,0.18)" }}>
            <Home className="w-10 h-10" style={{ color: "#E8829A" }} strokeWidth={1.8} />
            <span className="absolute" style={{ bottom: 16, fontSize: 14 }}>🐾</span>
          </div>
        </div>

        <h1 className="text-[18px] font-bold text-center" style={{ color: "#2C2C2C" }}>
          {t("もう少しです！", "Almost there!")}
        </h1>
        <p className="text-[13px] text-center mt-1" style={{ color: "#8A8A8A" }}>
          {t("オーナー情報を教えてください", "Tell us about yourself")}
        </p>

        <div className="space-y-3 mt-6">
          <FormCard>
            <FieldLabel icon={<User className="w-3.5 h-3.5" />} color="#7B68C8" required>
              {t("お名前", "Your Name")}
            </FieldLabel>
            <JField icon={<User className="w-4 h-4" />} placeholder={t("例: 田中花子", "e.g. Hanako Tanaka")} autoComplete="name" value={ownerName} onChange={setOwnerName} />
          </FormCard>

          <FormCard>
            <FieldLabel icon={<Calendar className="w-3.5 h-3.5" />} color="#D4A843" optional>
              {t("年齢", "Age")}
            </FieldLabel>
            <JField icon={<Calendar className="w-4 h-4" />} placeholder="32" type="number" value={ownerAge} onChange={setOwnerAge} />
          </FormCard>

          <FormCard>
            <FieldLabel icon={<MapPin className="w-3.5 h-3.5" />} color="#6BAF92" required>
              {t("都道府県", "Prefecture")}
            </FieldLabel>
            <button
              onClick={() => setSheet(true)}
              className="w-full h-[52px] rounded-[14px] flex items-center px-4"
              style={{ background: "#FAFAF8", border: "1.5px solid #EDE8E4" }}
            >
              <MapPin className="w-4 h-4 mr-3" style={{ color: "#6BAF92" }} />
              <span className="text-[15px] flex-1 text-left" style={{ color: "#2C2C2C" }}>{pref}</span>
              <span className="text-[12px]" style={{ color: "#C4B8B4" }}>▾</span>
            </button>
          </FormCard>
        </div>

        <PrefectureSheet
          open={sheet}
          value={pref}
          onSelect={(p) => { setPref(p); setSheet(false); }}
          onClose={() => setSheet(false)}
        />
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 inset-x-0 max-w-md mx-auto p-4" style={{ background: "linear-gradient(to top, #FAFAF8, rgba(250,250,248,0.9) 70%, transparent)" }}>
        <div className="relative">
          <button
            onClick={finish}
            className="w-full h-14 rounded-2xl text-white text-[16px] font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #6BAF92, #4A9A7A)",
              boxShadow: "0 8px 24px rgba(107,175,146,0.4)",
            }}
          >
            <span>✨</span>
            {t("はじめましょう！", "Let's Start!")} 🐾
          </button>
          {burst && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              {Array.from({ length: 10 }).map((_, i) => {
                const angle = (i / 10) * Math.PI * 2;
                const dx = Math.cos(angle) * 80;
                const dy = Math.sin(angle) * 60;
                return (
                  <span
                    key={i}
                    className="absolute w-2.5 h-2.5 rounded-full"
                    style={{
                      background: i % 2 ? "#FFB7C5" : "#FFD4DC",
                      animation: `burst${i} 0.8s ease-out forwards`,
                    }}
                  />
                );
              })}
              <style>{`
                ${Array.from({ length: 10 }).map((_, i) => {
                  const a = (i / 10) * Math.PI * 2;
                  const dx = Math.cos(a) * 80, dy = Math.sin(a) * 60;
                  return `@keyframes burst${i}{from{transform:translate(0,0);opacity:1}to{transform:translate(${dx}px,${dy}px) scale(0.4);opacity:0}}`;
                }).join("\n")}
              `}</style>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PrefectureSheet({
  open, value, onSelect, onClose,
}: { open: boolean; value: string; onSelect: (p: string) => void; onClose: () => void }) {
  const t = useT();
  const [q, setQ] = useState("");
  if (!open) return null;
  const list = PREFECTURES.filter((p) => p.includes(q));
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(44,44,44,0.4)" }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md h-[70vh] flex flex-col"
        style={{ background: "#FFFFFF", borderRadius: "32px 32px 0 0", boxShadow: "0 -8px 32px rgba(0,0,0,0.1)" }}
      >
        <div className="mx-auto mt-3 mb-2 rounded-full" style={{ width: 32, height: 4, background: "#E8E0DC" }} />
        <div className="px-5 pb-3 flex items-center justify-between">
          <h3 className="text-[15px] font-semibold" style={{ color: "#2C2C2C" }}>{t("都道府県を選ぶ", "Choose Prefecture")}</h3>
          <button onClick={onClose}><X className="w-5 h-5" style={{ color: "#8A8A8A" }} /></button>
        </div>
        <div className="px-5 pb-3">
          <div className="h-11 rounded-xl flex items-center px-3" style={{ background: "#FAFAF8", border: "1.5px solid #EDE8E4" }}>
            <Search className="w-4 h-4 mr-2" style={{ color: "#C4B8B4" }} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("検索", "Search")}
              className="flex-1 bg-transparent outline-none text-[14px]"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-6">
          {list.map((p) => {
            const sel = value === p;
            return (
              <button
                key={p}
                onClick={() => onSelect(p)}
                className="w-full h-12 px-4 rounded-xl flex items-center justify-between"
                style={{ background: sel ? "#FFF0F5" : "transparent" }}
              >
                <div className="flex items-center gap-3">
                  {sel && <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#E8829A" }} />}
                  <span className="text-[14px]" style={{ color: sel ? "#E8829A" : "#2C2C2C", fontWeight: sel ? 600 : 400, marginLeft: sel ? 0 : 14 }}>{p}</span>
                </div>
                {sel && <Check className="w-4 h-4" style={{ color: "#E8829A" }} strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
