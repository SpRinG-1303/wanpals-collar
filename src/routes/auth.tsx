import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, PawPrint, Check } from "lucide-react";
import { useT } from "@/context/LanguageContext";
import { HeroIllustration } from "@/routes/language";
import PhoneFrame from "@/components/PhoneFrame";

export const Route = createFileRoute("/auth")({ component: Auth });

function Auth() {
  const t = useT();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const nav = useNavigate();

  return (
    <PhoneFrame>
    <div className="min-h-screen flex flex-col" style={{ background: "#FAFAF8" }}>
      <HeroIllustration compact />

      <div
        className="flex-1 -mt-6 w-full px-6 pb-10 pt-7"
        style={{
          background: "#FFFFFF",
          borderRadius: "32px 32px 0 0",
          boxShadow: "0 -8px 32px rgba(0,0,0,0.06)",
        }}
      >
        {/* Drag indicator */}
        <div className="mx-auto mb-5 rounded-full" style={{ width: 32, height: 4, background: "#E8E0DC" }} />

        {/* Tab switcher */}
        <div className="relative flex p-1 rounded-xl" style={{ background: "#F5F0EC" }}>
          {(["login", "signup"] as const).map((tb) => {
            const active = tab === tb;
            return (
              <button
                key={tb}
                onClick={() => setTab(tb)}
                className="flex-1 h-9 rounded-[10px] text-sm transition-all"
                style={{
                  background: active ? "#FFFFFF" : "transparent",
                  color: active ? "#E8829A" : "#8A8A8A",
                  fontWeight: active ? 700 : 500,
                  boxShadow: active ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {tb === "login" ? t("ログイン", "Login") : t("登録", "Sign Up")}
              </button>
            );
          })}
        </div>

        {tab === "login" ? (
          <div className="mt-6 space-y-3">
            <JField icon={<Mail className="w-4 h-4" />} placeholder={t("メールアドレス", "Email")} type="email" autoComplete="email" />
            <PasswordField placeholder={t("パスワード", "Password")} />
            <div className="flex justify-end">
              <button className="text-[12px]" style={{ color: "#E8829A" }}>{t("パスワードを忘れた？", "Forgot Password?")}</button>
            </div>
            <PrimaryButton onClick={() => nav({ to: "/onboarding/avatar" })}>
              {t("ログイン", "Login")}
            </PrimaryButton>

            <Divider label={t("または", "OR")} />
            <SocialButtons />
            <p className="text-center text-[12px] mt-4" style={{ color: "#8A8A8A" }}>
              {t("アカウントをお持ちでない？", "Don't have an account?")}{" "}
              <button onClick={() => setTab("signup")} className="font-semibold" style={{ color: "#E8829A" }}>
                {t("登録", "Sign Up")} →
              </button>
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            <JField icon={<User className="w-4 h-4" />} placeholder={t("お名前", "Your Name")} autoComplete="name" />
            <JField icon={<Mail className="w-4 h-4" />} placeholder={t("メールアドレス", "Email")} type="email" autoComplete="email" />
            <PasswordField placeholder={t("パスワード", "Password")} />
            <PasswordField placeholder={t("パスワード確認", "Confirm Password")} />

            <TermsCheckbox label={t("利用規約に同意します", "I agree to Terms")} />

            <PrimaryButton onClick={() => nav({ to: "/onboarding/avatar" })}>
              {t("アカウント作成", "Create Account")}
            </PrimaryButton>

            <Divider label={t("または", "OR")} />
            <SocialButtons />

            <p className="text-center text-[12px] mt-4" style={{ color: "#8A8A8A" }}>
              {t("すでにアカウントをお持ちですか？", "Already have account?")}{" "}
              <button onClick={() => setTab("login")} className="font-semibold" style={{ color: "#E8829A" }}>
                {t("ログイン", "Login")} →
              </button>
            </p>
          </div>
        )}

        <Link to="/language" className="block text-center text-[11px] mt-5" style={{ color: "#C4B8B4" }}>
          ← {t("言語選択へ戻る", "Back to language")}
        </Link>
      </div>
    </div>
  );
}

/* ──────────────────────── Reusable inputs ──────────────────────── */

export function JField({
  icon, placeholder, type = "text", autoComplete, right, value, onChange,
}: {
  icon: React.ReactNode; placeholder: string; type?: string; autoComplete?: string; right?: React.ReactNode;
  value?: string; onChange?: (v: string) => void;
}) {
  const [internal, setInternal] = useState("");
  const controlled = value !== undefined;
  const val = controlled ? value! : internal;
  const setVal = (v: string) => {
    if (!controlled) setInternal(v);
    onChange?.(v);
  };
  const [focus, setFocus] = useState(false);
  const active = focus || val.length > 0;
  return (
    <div
      className="relative h-[52px] rounded-[14px] flex items-center px-4 transition-all"
      style={{
        background: focus ? "#FFFAFB" : "#FAFAF8",
        border: `1.5px solid ${focus ? "#E8829A" : "#EDE8E4"}`,
        boxShadow: focus ? "0 0 0 3px rgba(232,130,154,0.1)" : "none",
      }}
    >
      <span className="mr-3" style={{ color: focus ? "#E8829A" : "#C4B8B4" }}>{icon}</span>
      <div className="relative flex-1">
        <label
          className="absolute left-0 pointer-events-none transition-all"
          style={{
            top: active ? -18 : "50%",
            transform: active ? "translateY(0)" : "translateY(-50%)",
            fontSize: active ? 11 : 15,
            color: active ? "#E8829A" : "#C4B8B4",
          }}
        >
          {placeholder}
        </label>
        <input
          type={type}
          autoComplete={autoComplete}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          className="w-full bg-transparent outline-none text-[15px]"
          style={{ color: "#2C2C2C" }}
        />
      </div>
      {right}
    </div>
  );
}

function PasswordField({ placeholder }: { placeholder: string }) {
  const [show, setShow] = useState(false);
  return (
    <JField
      icon={<Lock className="w-4 h-4" />}
      placeholder={placeholder}
      type={show ? "text" : "password"}
      autoComplete="current-password"
      right={
        <button onClick={() => setShow(!show)} style={{ color: "#C4B8B4" }}>
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      }
    />
  );
}

export function PrimaryButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full h-[52px] rounded-[14px] text-white font-bold text-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
      style={{
        background: "linear-gradient(135deg, #E8829A, #C86882)",
        boxShadow: "0 8px 20px rgba(232,130,154,0.35)",
      }}
    >
      <PawPrint className="w-4 h-4" strokeWidth={2.2} />
      {children}
    </button>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px" style={{ background: "#EDE8E4" }} />
      <span className="text-[12px]" style={{ color: "#C4B8B4" }}>{label}</span>
      <div className="flex-1 h-px" style={{ background: "#EDE8E4" }} />
    </div>
  );
}

function SocialButtons() {
  return (
    <div className="space-y-2">
      <button
        className="w-full h-12 rounded-[14px] text-white text-[14px] font-bold flex items-center justify-center gap-3"
        style={{ background: "#06C755", boxShadow: "0 4px 12px rgba(6,199,85,0.25)" }}
      >
        <span className="w-5 h-5 rounded-[4px] bg-white text-[#06C755] text-xs font-black flex items-center justify-center">L</span>
        LINEでログイン / Login with LINE
      </button>
      <button
        className="w-full h-12 rounded-[14px] text-[14px] flex items-center justify-center gap-3"
        style={{ background: "#FFFFFF", border: "1.5px solid #EDE8E4", color: "#2C2C2C" }}
      >
        <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black"
          style={{ background: "conic-gradient(from 0deg,#EA4335,#FBBC05,#34A853,#4285F4)", color: "white" }}>G</span>
        Googleでログイン / Login with Google
      </button>
      <button
        className="w-full h-12 rounded-[14px] text-white text-[14px] flex items-center justify-center gap-3"
        style={{ background: "#000000" }}
      >
        <span className="text-base"></span>
        Appleでログイン / Login with Apple
      </button>
    </div>
  );
}

function TermsCheckbox({ label }: { label: string }) {
  const [on, setOn] = useState(false);
  return (
    <label className="flex items-start gap-2 mt-1 cursor-pointer">
      <button
        onClick={() => setOn(!on)}
        className="mt-0.5 w-[18px] h-[18px] rounded-[6px] flex items-center justify-center transition-all"
        style={{
          background: on ? "#E8829A" : "#FFFFFF",
          border: on ? "none" : "1.5px solid #EDE8E4",
        }}
      >
        {on && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </button>
      <span className="text-[12px]" style={{ color: "#8A8A8A" }}>
        <span className="underline" style={{ color: "#E8829A" }}>利用規約</span>{" "}{label}
      </span>
    </label>
  );
}
