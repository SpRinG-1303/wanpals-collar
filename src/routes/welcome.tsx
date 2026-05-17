import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { PawPrint } from "lucide-react";
import PhoneFrame from "@/components/PhoneFrame";
import { useLanguage, type Language } from "@/context/LanguageContext";

export const Route = createFileRoute("/welcome")({ component: Welcome });

const LANGS: { id: Language; label: string }[] = [
  { id: "english", label: "English" },
  { id: "japanese", label: "日本語" },
  { id: "mixed", label: "Mix (英語/日本語)" },
];

function Welcome() {
  const nav = useNavigate();
  const { language, setLanguage } = useLanguage();
  const [sel, setSel] = useState<Language>(language ?? "mixed");

  const pick = (id: Language) => {
    setSel(id);
    setLanguage(id);
    if (typeof window !== "undefined") localStorage.setItem("preferredLanguage", id);
  };

  const go = () => {
    setLanguage(sel);
    if (typeof window !== "undefined") localStorage.setItem("preferredLanguage", sel);
    nav({ to: "/auth" });
  };

  return (
    <PhoneFrame>
      <div
        className="min-h-screen flex flex-col px-6 py-10"
        style={{ background: "linear-gradient(180deg, #FFFFEF 0%, #FFF5F2 55%, #FFE8EE 100%)" }}
      >
        {/* TOP */}
        <div className="flex flex-col items-center text-center pt-6">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-full bg-white flex items-center justify-center"
            style={{
              width: 96,
              height: 96,
              boxShadow: "0 12px 32px rgba(244,63,114,0.20)",
              border: "2px solid #FFE4EC",
            }}
          >
            <PawPrint style={{ width: 44, height: 44, color: "#F43F72" }} strokeWidth={2.2} />
          </motion.div>

          <h1
            className="mt-5 font-black tracking-tight"
            style={{ color: "#1F1F1F", fontSize: 26, letterSpacing: "-0.01em" }}
          >
            Pawsitive Diagnostics
          </h1>
          <div className="mt-1" style={{ color: "#8A6A72", fontSize: 14, fontWeight: 500 }}>
            ポジティブ診断
          </div>

          <p className="mt-4 leading-relaxed" style={{ color: "#5A4750", fontSize: 13 }}>
            あなたの愛犬の健康を、もっと身近に。
            <br />
            <span style={{ color: "#8A6A72", fontSize: 12 }}>
              Your dog's health, closer than ever.
            </span>
          </p>
        </div>

        {/* MIDDLE - language */}
        <div className="mt-10">
          <div
            className="text-center mb-3"
            style={{ color: "#8A6A72", fontSize: 12, fontWeight: 600, letterSpacing: "0.04em" }}
          >
            言語を選択 / Select Language
          </div>
          <div className="flex items-center justify-center gap-2">
            {LANGS.map((l) => {
              const active = sel === l.id;
              return (
                <button
                  key={l.id}
                  onClick={() => pick(l.id)}
                  className="transition-all active:scale-95"
                  style={{
                    height: 38,
                    padding: "0 14px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 700,
                    background: active ? "#F43F72" : "transparent",
                    color: active ? "#FFFFFF" : "#8A6A72",
                    border: active ? "1.5px solid #F43F72" : "1.5px solid #E5D4DA",
                    boxShadow: active ? "0 6px 14px rgba(244,63,114,0.30)" : "none",
                  }}
                >
                  {l.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* spacer */}
        <div className="flex-1" />

        {/* BOTTOM */}
        <div className="pb-2">
          <motion.button
            onClick={go}
            animate={{ boxShadow: [
              "0 10px 24px rgba(244,63,114,0.30)",
              "0 14px 32px rgba(244,63,114,0.45)",
              "0 10px 24px rgba(244,63,114,0.30)",
            ] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            whileTap={{ scale: 0.98 }}
            className="w-full text-white font-bold flex items-center justify-center gap-2"
            style={{
              height: 56,
              borderRadius: 50,
              background: "linear-gradient(135deg, #F43F72 0%, #E11D5A 100%)",
              fontSize: 16,
              letterSpacing: "0.01em",
            }}
          >
            <PawPrint className="w-4 h-4" strokeWidth={2.4} />
            はじめる / Get Started
          </motion.button>

          <div className="text-center mt-5" style={{ fontSize: 12, color: "#8A6A72" }}>
            すでにアカウントをお持ちですか？
            <br />
            <span style={{ fontSize: 11, opacity: 0.85 }}>Already have an account?</span>{" "}
            <Link
              to="/auth"
              style={{ color: "#F43F72", fontWeight: 700, textDecoration: "none" }}
            >
              ログイン / Login
            </Link>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
