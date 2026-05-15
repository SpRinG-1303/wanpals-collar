import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, Dog, Edit3, PawPrint, Check } from "lucide-react";
import { BREEDS } from "@/lib/mock";
import { useT, useLanguage } from "@/context/LanguageContext";
import { PrimaryButton } from "@/routes/auth";

export const Route = createFileRoute("/onboarding/avatar")({ component: Step1 });

const FUR = ["#C4813A", "#F5D5A0", "#F5F5F5", "#3D2B1A", "#A89080", "#E8C4A0"];
const COLLAR = ["#E8829A", "#7B68C8", "#6BAF92", "#5B9BD5", "#D4A843", "#E53935"];
const EARS = [
  { id: 0, label: "立ち耳", en: "Upright" },
  { id: 1, label: "垂れ耳", en: "Floppy" },
  { id: 2, label: "丸耳", en: "Round" },
];
const EYES = [
  { id: 0, glyph: "◉◉", label: "まんまる" },
  { id: 1, glyph: "◡◡", label: "ニコニコ" },
  { id: 2, glyph: "✦✦", label: "キラキラ" },
  { id: 3, glyph: "◔◔", label: "やさしい" },
];

function Step1() {
  const nav = useNavigate();
  const t = useT();
  const { language } = useLanguage();
  const [breed, setBreed] = useState("柴犬");
  const [fur, setFur] = useState(FUR[0]);
  const [ear, setEar] = useState(0);
  const [eye, setEye] = useState(0);
  const [collar, setCollar] = useState(COLLAR[0]);

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
          <div
            className="w-[140px] h-[140px] rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #FFF0F5, #F5F0FF)",
              border: "3px solid #FFD4E8",
              boxShadow: "0 8px 32px rgba(232,130,154,0.2)",
            }}
          >
            <div
              className="w-[108px] h-[108px] rounded-full flex flex-col items-center justify-center relative transition-all"
              style={{ background: fur, border: `3px solid ${collar}` }}
            >
              <span className="text-[28px] leading-none" style={{ color: fur === "#3D2B1A" ? "#FFF" : "#2C2C2C" }}>
                {EYES[eye].glyph}
              </span>
              <span className="text-[10px] mt-1 opacity-60">{EARS[ear].label}</span>
            </div>
          </div>
          <button className="mt-2 flex items-center gap-1 text-[11px]" style={{ color: "#C4B8B4" }}>
            <Edit3 className="w-3 h-3" />
            {t("タップしてカスタマイズ", "Tap to Customize")}
          </button>
        </div>

        {/* Breed selector */}
        <Section title={t("犬種を選ぶ", "Choose Breed")} />
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-6 px-6 pb-2 mt-2">
          {BREEDS.map((b) => {
            const sel = breed === b.jp;
            return (
              <button
                key={b.jp}
                onClick={() => setBreed(b.jp)}
                className="shrink-0 flex flex-col items-center justify-center transition-all"
                style={{
                  width: 72, height: 80,
                  borderRadius: 16,
                  background: sel ? "#FFF0F5" : "#FFFFFF",
                  border: sel ? "2px solid #E8829A" : "2px solid transparent",
                  boxShadow: sel ? "0 4px 12px rgba(232,130,154,0.2)" : "0 2px 8px rgba(0,0,0,0.06)",
                  transform: sel ? "scale(1.05)" : "scale(1)",
                }}
              >
                <Dog className="w-7 h-7" strokeWidth={1.6} style={{ color: sel ? "#E8829A" : "#8A8A8A" }} />
                <span className="text-[11px] font-bold mt-1" style={{ color: "#2C2C2C" }}>{b.jp}</span>
                <span className="text-[9px]" style={{ color: "#8A8A8A" }}>{b.en}</span>
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
          <div className="flex gap-3 mt-2">
            {FUR.map((c) => (
              <Swatch key={c} color={c} selected={fur === c} onClick={() => setFur(c)} />
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
                  {language === "english" ? e.en : e.label}
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
        ステップ {current} / 3 · {labels[current - 1]}
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
      className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
      style={{
        background: color,
        boxShadow: selected
          ? `0 0 0 3px #FFFFFF, 0 0 0 5px rgba(232,130,154,0.4)`
          : "0 1px 3px rgba(0,0,0,0.1)",
      }}
    />
  );
}
