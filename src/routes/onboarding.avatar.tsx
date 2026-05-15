import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, Edit3, Check } from "lucide-react";
import { BREEDS } from "@/lib/mock";
import { useT, useLanguage } from "@/context/LanguageContext";
import { usePet } from "@/context/PetContext";
import { PrimaryButton } from "@/routes/auth";
import DogAvatar, { BREED_KEY_BY_JP, type BreedKey, type EarStyle, type EyeStyle } from "@/components/DogAvatar";

export const Route = createFileRoute("/onboarding/avatar")({ component: Step1 });

const FUR: { c: string; jp: string; en: string }[] = [
  { c: "#C4813A", jp: "茶色", en: "Brown" },
  { c: "#F5D5A0", jp: "クリーム", en: "Cream" },
  { c: "#F5F5F0", jp: "白", en: "White" },
  { c: "#2C1810", jp: "黒", en: "Black" },
  { c: "#9A8A80", jp: "グレー", en: "Gray" },
  { c: "#D4A843", jp: "ゴールド", en: "Gold" },
];
const COLLAR = ["#E8829A", "#7B68C8", "#6BAF92", "#5B9BD5", "#D4A843", "#E53935"];
const EARS: { id: EarStyle; jp: string; en: string }[] = [
  { id: "upright", jp: "立ち耳", en: "Upright" },
  { id: "floppy", jp: "垂れ耳", en: "Floppy" },
  { id: "round", jp: "丸耳", en: "Round" },
];
const EYES: { id: EyeStyle; glyph: string; jp: string; en: string }[] = [
  { id: "round", glyph: "◉◉", jp: "まんまる", en: "Round" },
  { id: "happy", glyph: "◡◡", jp: "ニコニコ", en: "Happy" },
  { id: "sparkle", glyph: "✦✦", jp: "キラキラ", en: "Sparkle" },
  { id: "soft", glyph: "◔◔", jp: "やさしい", en: "Soft" },
];

function Step1() {
  const nav = useNavigate();
  const t = useT();
  const { language } = useLanguage();
  const { pet, updatePet, updateAvatar } = usePet();
  const [breedJp, setBreedJp] = useState(pet.breedJp || "柴犬");
  const [fur, setFur] = useState<string | undefined>(pet.avatar.furColor);
  const [ear, setEar] = useState<EarStyle | undefined>(pet.avatar.earStyle as EarStyle | undefined);
  const [eye, setEye] = useState<EyeStyle>((pet.avatar.eyeStyle as EyeStyle) || "round");
  const [collar, setCollar] = useState(pet.avatar.collarColor || COLLAR[0]);

  const breedKey: BreedKey = BREED_KEY_BY_JP[breedJp] ?? "mixed";

  const selectBreed = (jp: string) => {
    setBreedJp(jp);
    const b = BREEDS.find((x) => x.jp === jp);
    updatePet({
      breedJp: jp,
      breedEn: b?.en ?? jp,
      breed: BREED_KEY_BY_JP[jp] ?? "mixed",
    });
  };
  const selectFur = (c: string) => { setFur(c); updateAvatar({ furColor: c }); };
  const selectEar = (e: EarStyle) => { setEar(e); updateAvatar({ earStyle: e }); };
  const selectEye = (e: EyeStyle) => { setEye(e); updateAvatar({ eyeStyle: e }); };
  const selectCollar = (c: string) => { setCollar(c); updateAvatar({ collarColor: c }); };

  const breedLabel = (jp: string, en: string) =>
    language === "english" ? en : language === "japanese" ? jp : `${jp} / ${en}`;

  return (
    <div className="min-h-screen pb-32" style={{ background: "#FAFAF8" }}>
      <div className="max-w-md mx-auto px-6 pt-4">
        <TopBar />
        <Stepper current={1} />

        <h1 className="text-[20px] font-bold text-center mt-2" style={{ color: "#2C2C2C" }}>
          {t("あなたのワンちゃんを作ろう！", "Create Your Dog's Avatar")}
        </h1>

        {/* Avatar preview */}
        <div className="flex flex-col items-center mt-5">
          <DogAvatar
            breed={breedKey}
            furColor={fur}
            earStyle={ear}
            eyeStyle={eye}
            collarColor={collar}
            size={160}
            onTap={() => {}}
          />
          <button className="mt-2 flex items-center gap-1 text-[11px]" style={{ color: "#C4B8B4" }}>
            <Edit3 className="w-3 h-3" />
            {t("タップしてカスタマイズ", "Tap to customize")}
          </button>
        </div>

        {/* Breed selector */}
        <Section title={t("犬種を選ぶ", "Choose Breed")} />
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-6 px-6 pb-2 pt-1 mt-2 snap-x">
          {BREEDS.map((b) => {
            const sel = breedJp === b.jp;
            const key = BREED_KEY_BY_JP[b.jp] ?? "mixed";
            return (
              <button
                key={b.jp}
                onClick={() => setBreedJp(b.jp)}
                className="shrink-0 flex flex-col items-center justify-start snap-start transition-all px-1.5 pt-2 pb-2"
                style={{
                  width: 80, height: 110,
                  borderRadius: 18,
                  background: sel ? "linear-gradient(135deg, #FFF0F5, #FFFAFB)" : "#FFFFFF",
                  border: sel ? "2px solid #E8829A" : "2px solid transparent",
                  boxShadow: sel ? "0 4px 16px rgba(232,130,154,0.2)" : "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                <DogAvatar breed={key} size={42} ring={false} showCollar={false} showCheeks={false} />
                <span
                  className="font-bold mt-1 text-center leading-tight"
                  style={{ color: "#2C2C2C", fontSize: b.jp.length > 8 ? 9 : 11 }}
                >
                  {language === "english" ? b.en : b.jp}
                </span>
                {language === "mixed" && (
                  <span className="text-[9px] text-center leading-tight" style={{ color: "#8A8A8A" }}>
                    {b.en}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Customize panel */}
        <div
          className="mt-5 p-5 rounded-3xl"
          style={{ background: "#FFFFFF", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}
        >
          <h3 className="text-[14px] font-semibold" style={{ color: "#2C2C2C" }}>
            {t("カスタマイズ", "Customize")}
          </h3>

          <Section title={t("毛色", "Fur Colour")} small />
          <div className="flex flex-wrap gap-3 mt-2">
            {FUR.map((f) => (
              <div key={f.c} className="flex flex-col items-center" style={{ width: 44 }}>
                <Swatch color={f.c} selected={fur === f.c} onClick={() => setFur(f.c)} />
                <span className="text-[8px] mt-1 text-center leading-tight" style={{ color: "#8A8A8A" }}>
                  {breedLabel(f.jp, f.en)}
                </span>
              </div>
            ))}
          </div>

          <Section title={t("耳", "Ears")} small />
          <div className="grid grid-cols-3 gap-2 mt-2">
            {EARS.map((e) => {
              const sel = ear === e.id;
              return (
                <button
                  key={e.id}
                  onClick={() => setEar(e.id)}
                  className="h-12 rounded-xl text-[12px] font-medium transition-all"
                  style={{
                    background: sel ? "#FFF0F5" : "#FAFAF8",
                    border: sel ? "1.5px solid #E8829A" : "1.5px solid #EDE8E4",
                    color: sel ? "#E8829A" : "#2C2C2C",
                  }}
                >
                  {language === "english" ? e.en : e.jp}
                </button>
              );
            })}
          </div>

          <Section title={t("目", "Eyes")} small />
          <div className="grid grid-cols-4 gap-2 mt-2">
            {EYES.map((e) => {
              const sel = eye === e.id;
              return (
                <button
                  key={e.id}
                  onClick={() => setEye(e.id)}
                  className="h-12 rounded-xl text-[14px] font-bold transition-all"
                  style={{
                    background: sel ? "#FFF0F5" : "#FAFAF8",
                    border: sel ? "1.5px solid #E8829A" : "1.5px solid #EDE8E4",
                    color: sel ? "#E8829A" : "#2C2C2C",
                  }}
                  aria-label={language === "english" ? e.en : e.jp}
                >
                  {e.glyph}
                </button>
              );
            })}
          </div>

          <Section title={t("カラーの色", "Collar Colour")} small />
          <div className="flex gap-3 mt-2">
            {COLLAR.map((c) => (
              <Swatch key={c} color={c} selected={collar === c} onClick={() => setCollar(c)} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 inset-x-0 max-w-md mx-auto p-4" style={{ background: "linear-gradient(to top, #FAFAF8, rgba(250,250,248,0.9) 70%, transparent)" }}>
        <p className="text-center text-[11px] mb-2" style={{ color: "#C4B8B4" }}>
          {t("あとで変更できます", "You can change this later")}
        </p>
        <PrimaryButton onClick={() => nav({ to: "/onboarding/dog" })}>
          {t("次へ", "Next")} →
        </PrimaryButton>
      </div>
    </div>
  );
}

/* ──────────────────────── Shared onboarding bits ──────────────────────── */

export function TopBar() {
  return (
    <div className="flex items-center mb-4">
      <Link to="/auth" className="flex items-center" style={{ color: "#2C2C2C" }}>
        <ChevronLeft className="w-6 h-6" />
      </Link>
    </div>
  );
}

export function Stepper({ current }: { current: 1 | 2 | 3 }) {
  const t = useT();
  const labels = [
    t("ワンちゃんのアバター", "Dog Avatar"),
    t("ワンちゃんの情報", "Dog Details"),
    t("オーナー情報", "About You"),
  ];
  return (
    <div className="mb-3">
      <div className="flex items-center justify-center gap-0">
        {[1, 2, 3].map((n, i) => {
          const completed = n < current;
          const active = n === current;
          const bg = completed ? "#6BAF92" : active ? "#E8829A" : "#EDE8E4";
          const color = completed || active ? "#FFFFFF" : "#C4B8B4";
          return (
            <div key={n} className="flex items-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-all"
                style={{
                  background: bg,
                  color,
                  boxShadow: active ? "0 0 0 4px rgba(232,130,154,0.2)" : "none",
                }}
              >
                {completed ? <Check className="w-4 h-4" strokeWidth={3} /> : n}
              </div>
              {i < 2 && (
                <div className="w-10 h-[2px]" style={{ background: n < current ? "#6BAF92" : "#EDE8E4" }} />
              )}
            </div>
          );
        })}
      </div>
      <p className="text-[12px] text-center mt-2" style={{ color: "#8A8A8A" }}>
        {t(`ステップ ${current} / 3`, `Step ${current} of 3`)} · {labels[current - 1]}
      </p>
    </div>
  );
}

function Section({ title, small }: { title: string; small?: boolean }) {
  return (
    <h3 className={`font-semibold ${small ? "text-[12px] mt-4" : "text-[13px] mt-6"}`} style={{ color: "#2C2C2C" }}>
      {title}
    </h3>
  );
}

function Swatch({ color, selected, onClick }: { color: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-9 h-9 rounded-full transition-all"
      style={{
        background: color,
        boxShadow: selected
          ? `0 0 0 3px #FFFFFF, 0 0 0 5px rgba(232,130,154,0.5)`
          : "0 1px 3px rgba(0,0,0,0.12)",
      }}
    />
  );
}
