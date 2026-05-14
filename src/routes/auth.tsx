import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useT } from "@/context/LanguageContext";

export const Route = createFileRoute("/auth")({ component: Auth });

function Auth() {
  const t = useT();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [show, setShow] = useState(false);
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-background paw-bg flex flex-col p-6 max-w-md mx-auto">
      <div className="flex bg-muted rounded-full p-1 mt-4">
        {(["login", "signup"] as const).map((tb) => (
          <button key={tb} onClick={() => setTab(tb)} className={`flex-1 py-2.5 text-sm font-bold rounded-full transition-all ${tab === tb ? "bg-card text-primary shadow-soft" : "text-muted-foreground"}`}>
            {tb === "login" ? t("ログイン", "Login") : t("登録", "Sign Up")}
          </button>
        ))}
      </div>

      {tab === "login" ? (
        <div className="mt-8 space-y-4">
          <h1 className="text-2xl font-black">{t("おかえりなさい", "Welcome Back")}</h1>
          <input className="w-full p-4 bg-card rounded-xl border border-border shadow-soft" placeholder={t("メール", "Email")} />
          <div className="relative">
            <input type={show ? "text" : "password"} className="w-full p-4 bg-card rounded-xl border border-border shadow-soft pr-12" placeholder={t("パスワード", "Password")} />
            <button onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {show ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
            </button>
          </div>
          <button onClick={() => nav({ to: "/onboarding/avatar" })} className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl shadow-card">{t("ログイン", "Login")}</button>
          <button className="text-sm text-sakura font-medium w-full">{t("パスワードを忘れた", "Forgot Password?")}</button>

          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-border"/>
            <span className="text-xs text-muted-foreground">{t("または", "OR")}</span>
            <div className="flex-1 h-px bg-border"/>
          </div>

          <button className="w-full bg-[#06C755] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-card">
            <span className="text-lg">💬</span> {t("LINEでログイン", "Login with LINE")}
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-card border border-border py-3 rounded-xl font-medium flex items-center justify-center gap-2">🔍 Google</button>
            <button className="bg-foreground text-background py-3 rounded-xl font-medium flex items-center justify-center gap-2"> Apple</button>
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          <h1 className="text-2xl font-black">{t("はじめまして", "Nice to Meet You")}</h1>
          <input className="w-full p-4 bg-card rounded-xl border border-border shadow-soft" placeholder={t("お名前", "Name")} />
          <input className="w-full p-4 bg-card rounded-xl border border-border shadow-soft" placeholder={t("メール", "Email")} />
          <input type="password" className="w-full p-4 bg-card rounded-xl border border-border shadow-soft" placeholder={t("パスワード", "Password")} />
          <input type="password" className="w-full p-4 bg-card rounded-xl border border-border shadow-soft" placeholder={t("パスワード確認", "Confirm Password")} />
          <button className="w-full bg-[#06C755] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-card">
            <span className="text-lg">💬</span> {t("LINEで登録", "Sign up with LINE")}
          </button>
          <label className="flex items-start gap-2 text-xs text-muted-foreground">
            <input type="checkbox" className="mt-1"/> {t("利用規約とプライバシーポリシーに同意します", "I agree to the Terms & Privacy Policy")}
          </label>
          <button onClick={() => nav({ to: "/onboarding/avatar" })} className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl shadow-card">{t("登録", "Register")}</button>
        </div>
      )}
      <Link to="/language" className="text-center text-xs text-muted-foreground mt-6">← {t("言語選択へ戻る", "Back to language")}</Link>
    </div>
  );
}
