import { createFileRoute, useNavigate } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { useEffect, useState } from "react";
import { ChevronRight, Sun, Moon, Crown } from "lucide-react";

export const Route = createFileRoute("/settings")({ component: Settings });

function Settings() {
  const nav = useNavigate();
  const [dark, setDark] = useState(false);
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

  return (
    <AppShell title="⚙️ 設定 / Settings">
      <div className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-3">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sakura to-secondary flex items-center justify-center text-3xl">👤</div>
          <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs">✏️</button>
        </div>
        <div>
          <div className="font-bold">田中花子</div>
          <div className="text-xs text-muted-foreground">tanaka@example.jp</div>
        </div>
      </div>

      <Section title="プロフィール / Profile">
        <Row label="メールを変更 / Change Email"/>
        <Row label="名前を変更 / Change Name"/>
        <Row label="パスワード変更 / Change Password"/>
      </Section>

      <Section title="表示 / Appearance">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold">{dark ? <Moon className="w-4 h-4"/> : <Sun className="w-4 h-4"/>} {dark ? "ダークモード" : "ライトモード"}</div>
          <button onClick={() => toggleDark(!dark)} className={`w-14 h-8 rounded-full relative ${dark ? "bg-primary" : "bg-muted"}`}>
            <span className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${dark ? "left-7" : "left-1"}`}/>
          </button>
        </div>
      </Section>

      <Section title="言語 / Language">
        <button onClick={() => nav({ to: "/language" })} className="w-full text-left text-sm flex items-center justify-between"><span>言語を変更 / Change Language</span><ChevronRight className="w-4 h-4 text-muted-foreground"/></button>
      </Section>

      <Section title="通知 / Notifications">
        <NotifRow label="🚨 緊急アラート" sub="Always On" locked/>
        <NotifRow label="📊 デイリーインサイト"/>
        <NotifRow label="💬 コミュニティ返信"/>
        <NotifRow label="🏥 獣医リマインダー"/>
      </Section>

      <Section title="データ / Data">
        <Row label="📤 データをエクスポート"/>
        <Row label="🔒 プライバシー設定"/>
      </Section>

      <div className="mt-4 bg-gradient-to-br from-warning to-sakura rounded-2xl p-5 shadow-card text-primary">
        <div className="flex items-center gap-2"><Crown className="w-5 h-5"/><div className="font-black">プロプランにアップグレード</div></div>
        <div className="text-xs mt-1 opacity-80">Upgrade to WanCare Pro</div>
        <ul className="mt-3 text-xs space-y-1">
          <li>✓ 無制限AI診断</li>
          <li>✓ 24時間獣医チャット</li>
          <li>✓ 詳細レポート</li>
          <li>✓ 複数ペット対応</li>
        </ul>
        <button className="mt-3 w-full bg-primary text-primary-foreground rounded-xl py-3 font-bold text-sm">月額 ¥980 / month →</button>
      </div>

      <div className="mt-6 border-t border-border pt-4">
        <button className="w-full text-destructive font-bold text-sm py-3">アカウントを削除 / Delete Account</button>
      </div>
    </AppShell>
  );
}

function Section({ title, children }: any) {
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
      <button disabled={locked} onClick={() => setOn(!on)} className={`w-12 h-7 rounded-full relative ${on ? "bg-success" : "bg-muted"} ${locked ? "opacity-60" : ""}`}>
        <span className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${on ? "left-6" : "left-1"}`}/>
      </button>
    </div>
  );
}
