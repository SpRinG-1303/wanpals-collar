import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useLanguage, type Language } from "@/context/LanguageContext";
import { PawPrint } from "lucide-react";

export const Route = createFileRoute("/language")({ component: LanguagePicker });

const opts: { id: Language; flag: string; jp: string; en: string; subJp: string; subEn: string }[] = [
  { id: "english", flag: "🇬🇧", jp: "English Only", en: "English", subJp: "英語のみ", subEn: "English only" },
  { id: "japanese", flag: "🇯🇵", jp: "日本語のみ", en: "Japanese Only", subJp: "日本語", subEn: "Japanese only" },
  { id: "mixed", flag: "🌐", jp: "ミックス", en: "Mixed", subJp: "英語・日本語", subEn: "English + Japanese" },
];

function LanguagePicker() {
  const { language, setLanguage } = useLanguage();
  const [sel, setSel] = useState<Language>(language);
  const nav = useNavigate();
  const choose = () => { setLanguage(sel); nav({ to: "/auth" }); };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FAFAF8" }}>
      <HeroIllustration />
      <div className="flex-1 px-6 pb-8 max-w-md mx-auto w-full">
        <h1 className="text-base font-semibold text-center mt-2" style={{ color: "#2C2C2C" }}>
          言語を選択してください<br/>
          <span className="text-xs font-normal" style={{ color: "#8A8A8A" }}>Please select your language</span>
        </h1>
        <div className="mt-6 space-y-3">
          {opts.map((o) => {
            const selected = sel === o.id;
            return (
              <button
                key={o.id}
                onClick={() => setSel(o.id)}
                className="w-full h-16 rounded-2xl flex items-center justify-between px-5 transition-all"
                style={{
                  background: selected ? "#FFFAFB" : "#FFFFFF",
                  border: selected ? "2px solid #E8829A" : "2px solid transparent",
                  borderLeft: selected ? "4px solid #E8829A" : "2px solid transparent",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{o.flag}</span>
                  <div className="text-left">
                    <div className="text-[15px] font-semibold" style={{ color: "#2C2C2C" }}>{o.jp}</div>
                    <div className="text-[12px]" style={{ color: "#8A8A8A" }}>{o.en} · {o.subJp}</div>
                  </div>
                </div>
                <div
                  className="w-[22px] h-[22px] rounded-full flex items-center justify-center"
                  style={{
                    background: selected ? "#E8829A" : "#FFFFFF",
                    border: selected ? "none" : "1.5px solid #EDE8E4",
                  }}
                >
                  {selected && <span className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>
        <button
          onClick={choose}
          className="w-full mt-8 h-[52px] rounded-[14px] text-white font-bold text-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          style={{
            background: "linear-gradient(135deg, #E8829A, #C86882)",
            boxShadow: "0 8px 20px rgba(232,130,154,0.35)",
          }}
        >
          <PawPrint className="w-4 h-4" strokeWidth={2.2} />
          続ける / Continue →
        </button>
      </div>
    </div>
  );
}

export function HeroIllustration() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height: "35vh",
        minHeight: 240,
        background: "linear-gradient(160deg, #FFF0F5 0%, #F5F0FF 50%, #F0F5FF 100%)",
      }}
    >
      {/* Soft glow orb */}
      <div
        className="absolute -top-16 -right-16 rounded-full"
        style={{ width: 200, height: 200, background: "#FFD4E8", opacity: 0.5, filter: "blur(40px)" }}
      />
      {/* Sakura branch top-left */}
      <svg className="absolute top-3 left-3" width="90" height="60" viewBox="0 0 90 60" style={{ opacity: 0.25 }}>
        <path d="M2 8 Q 30 18, 60 12 T 88 22" stroke="#9A6B6B" strokeWidth="1.2" fill="none" />
        <circle cx="20" cy="14" r="4" fill="#FFB7C5" />
        <circle cx="38" cy="16" r="3" fill="#FFB7C5" />
        <circle cx="55" cy="12" r="3.5" fill="#FFB7C5" />
        <circle cx="72" cy="18" r="3" fill="#FFB7C5" />
      </svg>
      {/* Floating petals */}
      {[
        { l: "20%", t: "30%", s: 8, c: "#FFB7C5", d: 0 },
        { l: "70%", t: "20%", s: 10, c: "#FFD4DC", d: 1 },
        { l: "85%", t: "55%", s: 6, c: "#FFB7C5", d: 2 },
        { l: "15%", t: "65%", s: 9, c: "#FFD4DC", d: 3 },
        { l: "55%", t: "75%", s: 7, c: "#FFB7C5", d: 1.5 },
      ].map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: p.l, top: p.t, width: p.s, height: p.s * 1.4,
            background: p.c, transform: `rotate(${i * 35}deg)`,
            animation: `petalFall 10s ease-in-out ${p.d}s infinite`,
          }}
        />
      ))}
      {/* Logo */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div
          className="w-[72px] h-[72px] rounded-full bg-white flex items-center justify-center"
          style={{ border: "2px solid #FFE4EC", boxShadow: "0 8px 24px rgba(232,130,154,0.2)" }}
        >
          <PawPrint className="w-8 h-8" strokeWidth={2} style={{ color: "#E8829A" }} />
        </div>
        <div className="mt-3 text-[24px] font-bold leading-none" style={{ color: "#2C2C2C", letterSpacing: "0.05em" }}>
          WanCare
        </div>
        <div className="mt-1 text-[14px]" style={{ color: "#8A8A8A", letterSpacing: "0.05em" }}>ワンケア</div>
        <div className="mt-2 text-[12px] italic text-center" style={{ color: "#8A8A8A" }}>
          あなたの愛犬を、もっと近くに。<br/>
          <span className="not-italic">Closer to your beloved dog.</span>
        </div>
      </div>
    </div>
  );
}
