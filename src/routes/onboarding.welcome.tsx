import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import DogAvatar from "@/components/DogAvatar";
import PhoneFrame from "@/components/PhoneFrame";
import { PrimaryButton } from "@/components/PrimaryButton";
import pawLogoAsset from "@/assets/paw-logo.png.asset.json";
import { useT } from "@/context/LanguageContext";

export const Route = createFileRoute("/onboarding/welcome")({ component: Welcome });

function Welcome() {
  const nav = useNavigate();
  const t = useT();

  return (
    <PhoneFrame>
      <div
        className="min-h-screen flex flex-col px-6 pt-10 pb-10"
        style={{ background: "var(--bg-page)", fontFamily: "var(--font-sans)" }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <img src={pawLogoAsset.url} alt="Pawsitive Diagnostics logo" style={{ width: 72, height: 72, objectFit: "contain" }} />
          <div className="text-[22px] font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
            Pawsit<span style={{ position: "relative" }}>
              i
              <span
                style={{
                  position: "absolute",
                  top: -2, left: 2,
                  width: 6, height: 6,
                  background: "var(--accent-sakura)",
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
                background: "linear-gradient(135deg,var(--bg-card) 0%,var(--acc2-pale) 100%)",
                boxShadow: "0 10px 30px color-mix(in oklab, var(--acc-strong) 18.0%, transparent), inset 0 0 0 3px rgba(255,255,255,0.7)",
              }}
            >
              <DogAvatar breed="shiba" size={170} ring={false} />
            </div>
          </div>

          <h1
            className="text-center mt-8 text-[26px] font-extrabold leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {t("Pawsitive Diagnosticsへようこそ！", "Welcome to Pawsitive Diagnostics!")}
          </h1>
          <p
            className="text-center mt-3 text-[14px] leading-relaxed max-w-[300px]"
            style={{ color: "var(--text-secondary)" }}
          >
            {t(
              "ワンちゃんのアバターを作って、スマート健康モニタリングを始めましょう。",
              "Create your pet's avatar and get started with smart health monitoring."
            )}
          </p>
        </div>

        {/* CTA */}
        <div className="mt-8">
          <PrimaryButton onClick={() => nav({ to: "/onboarding/dog" })}>
             {t("マイドッグのアバターを作る", "Create My Pet's Avatar")}
          </PrimaryButton>
          <div className="text-center mt-4">
            <Link
              to="/onboarding/dog"
              className="text-[13px] underline"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("今はスキップ", "Skip for now")}
            </Link>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

