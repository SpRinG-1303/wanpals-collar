import { createFileRoute, useNavigate } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { useEffect, useState } from "react";
import { ChevronRight, Sun, Moon, Crown, User, X } from "lucide-react";
import { toast } from "sonner";
import { useT, useLanguage, type Language } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export const Route = createFileRoute("/settings")({ component: Settings });

function Settings() {
  const nav = useNavigate();
  const t = useT();
  const { language, setLanguage } = useLanguage();
  const { session, signOut, updateProfile } = useAuth();
  const [dark, setDark] = useState(false);
  const [editField, setEditField] = useState<"name" | "email" | "password" | null>(null);
  const [editValue, setEditValue] = useState("");
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [shareData, setShareData] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function saveEdit() {
    if (!editField) return;
    const v = editValue.trim();
    if (editField !== "password" && !v) { toast.error("Please enter a value."); return; }
    if (editField === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { toast.error("Please enter a valid email."); return; }
    if (editField === "password" && v.length < 6) { toast.error("Password must be at least 6 characters."); return; }
    const err = updateProfile({ [editField]: v });
    if (err) { toast.error(err); return; }
    toast.success("Profile updated.");
    setEditField(null);
    setEditValue("");
  }

  function exportData() {
    const data: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith("pawsitive") || k.startsWith("wancare"))) {
        try { data[k] = JSON.parse(localStorage.getItem(k) ?? ""); } catch { data[k] = localStorage.getItem(k); }
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "pawsitive-data.json";
    a.click();
    URL.revokeObjectURL(a.href);
    toast.success("Your data has been downloaded.");
  }

  function deleteAccount() {
    try {
      localStorage.removeItem("pawsitive_session");
      localStorage.removeItem("pawsitive_users");
    } catch {}
    signOut();
    setConfirmDelete(false);
    toast.success("Account deleted.");
    nav({ to: "/auth" });
  }
  useEffect(() => {
    if (typeof window === "undefined") return;
    const d = localStorage.getItem("wancare-theme") === "dark";
    setDark(d);
    document.documentElement.classList.toggle("dark", d);
  }, []);
  const toggleDark = (v: boolean) => {
    setDark(v);
    document.documentElement.classList.toggle("dark", v);
    if (typeof window !== "undefined") localStorage.setItem("wancare-theme", v ? "dark" : "light");
  };

  const langLabel: Record<Language, string> = {
    english: "English",
    japanese: "English",
    mixed: "English",
  };

  return (
    <AppShell titleJp=" 設定" titleEn=" Settings">
      <div className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-3">
        <div className="relative">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "var(--accent-sakura-soft)", border: "1.5px solid var(--acc-soft)" }}>
            <User size={26} style={{ color: "var(--accent-sakura)" }} />
          </div>
        </div>
        <div>
          <div className="font-bold">{session?.name || "Pet Parent"}</div>
          <div className="text-xs text-muted-foreground">{session?.email || "Signed in"}</div>
        </div>
      </div>

      <Section title={t("プロフィール", "Profile")}>
        <Row label={t("メールを変更", "Change Email")}/>
        <Row label={t("名前を変更", "Change Name")}/>
        <Row label={t("パスワード変更", "Change Password")}/>
      </Section>

      <Section title={t("表示", "Appearance")}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold">
            {dark
              ? <Moon className="w-5 h-5" style={{ color: "var(--acc-strong)" }} />
              : <Sun className="w-5 h-5" style={{ color: "var(--accent-yuzu)" }} />}
            <span>{dark ? t("ダークモード", "Dark Mode") : t("ライトモード", "Light Mode")}</span>
          </div>
          <button
            onClick={() => toggleDark(!dark)}
            aria-label="Toggle dark mode"
            style={{
              width: 52, height: 28, borderRadius: 14, position: "relative",
              background: dark ? "var(--accent-fuji)" : "var(--border-card)",
              transition: "background 0.3s ease",
            }}
          >
            <span
              style={{
                position: "absolute", top: 3, left: dark ? 27 : 3,
                width: 22, height: 22, borderRadius: "50%",
                background: "#FFFFFF",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                transition: "left 0.3s ease",
              }}
            />
          </button>
        </div>
      </Section>

      <Section title={t("言語", "Language")}>
        <LanguageSwitcher variant="panel" />
        <button onClick={() => nav({ to: "/language" })} className="w-full text-left text-sm flex items-center justify-between mt-3">
          <span>{t("言語を変更", "Change Language")}</span><ChevronRight className="w-4 h-4 text-muted-foreground"/>
        </button>
      </Section>

      <Section title={t("通知", "Notifications")}>
        <NotifRow label={` ${t("緊急アラート", "Emergency Alerts")}`} sub={t("常にON", "Always On")} locked/>
        <NotifRow label={` ${t("デイリーインサイト", "Daily Insights")}`}/>
        <NotifRow label={` ${t("コミュニティ返信", "Community Replies")}`}/>
        <NotifRow label={` ${t("獣医リマインダー", "Vet Reminders")}`}/>
      </Section>

      <Section title={t("データ", "Data")}>
        <Row label={` ${t("データをエクスポート", "Export Data")}`}/>
        <Row label={` ${t("プライバシー設定", "Privacy Settings")}`}/>
      </Section>

      <div className="mt-4 bg-gradient-to-br from-warning to-sakura rounded-2xl p-5 shadow-card text-primary">
        <div className="flex items-center gap-2"><Crown className="w-5 h-5"/><div className="font-black">{t("プロプランにアップグレード", "Upgrade to Pawsitive Pro")}</div></div>
        <ul className="mt-3 text-xs space-y-1">
          <li>✓ {t("無制限AI診断", "Unlimited AI diagnosis")}</li>
          <li>✓ {t("24時間獣医チャット", "24h vet chat")}</li>
          <li>✓ {t("詳細レポート", "Detailed reports")}</li>
          <li>✓ {t("複数ペット対応", "Multiple pets")}</li>
        </ul>
        <button className="mt-3 w-full bg-primary text-primary-foreground rounded-xl py-3 font-bold text-sm">{t("月額 ¥980", "¥980 / month")} →</button>
      </div>

      <div className="mt-6 border-t border-border pt-4">
        <button className="w-full text-destructive font-bold text-sm py-3">{t("アカウントを削除", "Delete Account")}</button>
      </div>
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide px-2 mb-1">{title}</div>
      <div className="bg-card rounded-2xl p-4 shadow-card space-y-3">{children}</div>
    </div>
  );
}
function Row({ label }: { label: string }) {
  return <button className="w-full text-left text-sm flex items-center justify-between"><span>{label}</span><ChevronRight className="w-4 h-4 text-muted-foreground"/></button>;
}
function NotifRow({ label, sub, locked }: { label: string; sub?: string; locked?: boolean }) {
  const [on, setOn] = useState(true);
  return (
    <div className="flex items-center justify-between">
      <div><div className="text-sm font-medium">{label}</div>{sub && <div className="text-[10px] text-muted-foreground">{sub}</div>}</div>
      <button disabled={locked} onClick={() => setOn(!on)} className={`w-12 h-7 rounded-full relative ${on ? "" : "bg-muted"} ${locked ? "opacity-60" : ""}`} style={on ? { background: "var(--acc-strong)" } : undefined}>
        <span className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${on ? "left-6" : "left-1"}`}/>
      </button>
    </div>
  );
}
