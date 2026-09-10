import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import pawLogoAsset from "@/assets/paw-logo.png.asset.json";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pawsitive Diagnostics — AI Smart Animal Collar" },
      { name: "description", content: "Pawsitive Diagnostics: AI-powered smart animal collar app for pet parents and vets across India." },
      { property: "og:title", content: "Pawsitive Diagnostics — AI Smart Animal Collar" },
      { property: "og:description", content: "AI-powered smart animal collar app for pet parents and vets across India." },
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
    <div style={{ background: "var(--bg-outside)", minHeight: "100dvh", display: "flex", justifyContent: "center" }}>
      <div
        className="flex flex-col items-center justify-center"
        style={{
          width: "100%", maxWidth: 430, minHeight: "100dvh",
          background: "var(--bg-page)",
          fontFamily: "var(--font-sans)",
        }}
      >
        <style>{`
          @keyframes splashFadeUp { from { transform: translateY(8px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
          @keyframes splashDot { 0%,100% { transform: translateY(0); opacity: 0.35; } 50% { transform: translateY(-4px); opacity: 1; } }
        `}</style>

        <img
          src={pawLogoAsset.url}
          alt="Pawsitive Diagnostics logo"
          style={{ width: 84, height: 84, objectFit: "contain", animation: "splashFadeUp 0.5s ease both" }}
        />
        <div
          style={{
            marginTop: 18, fontSize: 30, fontWeight: 500, color: "var(--text-primary)", letterSpacing: "-0.01em",
            animation: "splashFadeUp 0.5s ease 0.15s both", fontFamily: "var(--font-display)",
          }}
        >
          Pawsitive Diagnostics
        </div>
        <div
          style={{
            marginTop: 6, color: "var(--text-secondary)", fontSize: 13, fontWeight: 500, letterSpacing: "0.02em",
            animation: "splashFadeUp 0.5s ease 0.3s both",
          }}
        >
          Smart animal care, made simple
        </div>

        <div className="flex" style={{ gap: 7, marginTop: 36 }}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: 7, height: 7, borderRadius: "50%", background: "var(--accent-sakura)",
                animation: `splashDot 1s ease-in-out ${i * 0.15}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
