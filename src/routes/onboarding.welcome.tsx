import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import DogAvatar from "@/components/DogAvatar";
import PhoneFrame from "@/components/PhoneFrame";
import { PrimaryButton } from "@/routes/auth";
import { useT } from "@/context/LanguageContext";

export const Route = createFileRoute("/onboarding/welcome")({ component: Welcome });

function Welcome() {
  const nav = useNavigate();
  const t = useT();

  return (
    <PhoneFrame>
      <div
        className="min-h-screen flex flex-col px-6 pt-10 pb-10"
        style={{ background: "#F5EDE8", fontFamily: "'Nunito','Quicksand',system-ui,sans-serif" }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "#E8678A", color: "#FFF" }}
          >
            <PawIcon size={20} />
          </div>
          <div className="text-[22px] font-extrabold tracking-tight" style={{ color: "#3B2A23" }}>
            Pawsit<span style={{ position: "relative" }}>
              i
              <span
                style={{
                  position: "absolute",
                  top: -2, left: 2,
                  width: 6, height: 6,
                  background: "#E8678A",
                  borderRadius: 999,
                }}
              />
            </span>ve
          </div>
        </div>

        {/* Avatar */}
        <div className="flex-1 flex flex-col items-center justify-center mt-8">
          <div className="relative">
            <div
              className="rounded-full flex items-center justify-center"
              style={{
                width: 200, height: 200,
                background: "linear-gradient(135deg,#FFF1F4 0%,#FFE3E8 100%)",
                boxShadow: "0 10px 30px rgba(232,103,138,0.18), inset 0 0 0 3px rgba(255,255,255,0.7)",
              }}
            >
              <DogAvatar breed="shiba" size={170} ring={false} />
            </div>
            <div
              className="absolute flex items-center justify-center"
              style={{
                right: 6, bottom: 6,
                width: 44, height: 44, borderRadius: 999,
                background: "linear-gradient(135deg,#FFD86B,#FF9F6B)",
                boxShadow: "0 6px 16px rgba(255,158,107,0.45)",
              }}
            >
              <Sparkles className="w-5 h-5" color="#FFF" strokeWidth={2.5} />
            </div>
          </div>

          <h1
            className="text-center mt-8 text-[26px] font-extrabold leading-tight"
            style={{ color: "#3B2A23" }}
          >
            {t("Pawsitiveへようこそ！", "Welcome to Pawsitive!")}
          </h1>
          <p
            className="text-center mt-3 text-[14px] leading-relaxed max-w-[300px]"
            style={{ color: "#8A766C" }}
          >
            {t(
              "ワンちゃんのアバターを作って、スマート健康モニタリングを始めましょう。",
              "Create your dog's avatar and get started with smart health monitoring."
            )}
          </p>
        </div>

        {/* CTA */}
        <div className="mt-8">
          <PrimaryButton onClick={() => nav({ to: "/onboarding/avatar" })}>
            🐶 {t("マイドッグのアバターを作る", "Create My Dog's Avatar")}
          </PrimaryButton>
          <div className="text-center mt-4">
            <Link
              to="/onboarding/avatar"
              className="text-[13px] underline"
              style={{ color: "#A38B82" }}
            >
              {t("今はスキップ", "Skip for now")}
            </Link>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

function PawIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <ellipse cx="12" cy="16" rx="5" ry="4.5" />
      <ellipse cx="6" cy="10" rx="2.2" ry="2.8" />
      <ellipse cx="18" cy="10" rx="2.2" ry="2.8" />
      <ellipse cx="9" cy="5.5" rx="1.8" ry="2.4" />
      <ellipse cx="15" cy="5.5" rx="1.8" ry="2.4" />
    </svg>
  );
}
