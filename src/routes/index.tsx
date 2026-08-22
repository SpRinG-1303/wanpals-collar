import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { PawPrint } from "lucide-react";
import logoUrl from "@/assets/logo.png";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pawsitive — AI Smart Dog Collar" },
      { name: "description", content: "Pawsitive: AI-powered smart dog collar app for pet parents and vets across India." },
      { property: "og:title", content: "Pawsitive — AI Smart Dog Collar" },
      { property: "og:description", content: "AI-powered smart dog collar app for pet parents and vets across India." },
    ],
  }),
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();
  const { session, hydrated } = useAuth();

  useEffect(() => {
    if (!hydrated) return;
    const id = setTimeout(() => {
      navigate({ to: session ? "/home" : "/auth", replace: true });
    }, 1700);
    return () => clearTimeout(id);
  }, [hydrated, session, navigate]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{ background: "linear-gradient(160deg,#FFF5F8 0%,#FAFAF8 45%,#F0F6FF 100%)" }}
    >
      <style>{`
        @keyframes splashPop { 0% { transform: scale(0.6); opacity: 0; } 60% { transform: scale(1.08); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes splashPulse { 0%,100% { transform: scale(1); opacity: 0.25; } 50% { transform: scale(1.5); opacity: 0; } }
        @keyframes splashDot { 0%,100% { transform: translateY(0); opacity: 0.4; } 50% { transform: translateY(-5px); opacity: 1; } }
        @keyframes splashFadeUp { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>

      <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
        <span
          className="absolute inset-0"
          style={{ borderRadius: "50%", background: "#E8829A", animation: "splashPulse 1.8s ease-out infinite" }}
        />
        <div
          className="flex items-center justify-center"
          style={{
            width: 96, height: 96, borderRadius: "50%", background: "#FFFFFF",
            border: "3px solid #E8829A", boxShadow: "0 12px 32px rgba(232,130,154,0.3)",
            animation: "splashPop 0.7s cubic-bezier(0.34,1.56,0.64,1) both",
          }}
        >
          <img src={logoUrl} alt="Pawsitive logo" style={{ width: 60, height: 60, objectFit: "contain" }} />
        </div>
      </div>

      <div
        style={{
          marginTop: 22, fontSize: 30, fontWeight: 900, color: "#2C2C2C", letterSpacing: "-0.02em",
          animation: "splashFadeUp 0.5s ease 0.25s both", fontFamily: "'Nunito', sans-serif",
        }}
      >
        Pawsitive
      </div>
      <div
        className="flex items-center"
        style={{ gap: 6, marginTop: 6, color: "#8A8A8A", fontSize: 13, fontWeight: 600, animation: "splashFadeUp 0.5s ease 0.4s both" }}
      >
        <PawPrint size={13} style={{ color: "#E8829A" }} />
        Smart Dog Care for India
      </div>

      <div className="flex" style={{ gap: 8, marginTop: 34 }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 8, height: 8, borderRadius: "50%", background: "#E8829A",
              animation: `splashDot 1s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
