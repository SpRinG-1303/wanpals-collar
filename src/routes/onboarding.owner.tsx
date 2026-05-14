import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PREFECTURES } from "@/lib/mock";

export const Route = createFileRoute("/onboarding/owner")({ component: Step3 });

function Step3() {
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-background p-6 max-w-md mx-auto pb-32">
      <div className="flex justify-center gap-2 mt-2 text-2xl">
        <span>🐾</span><span>🐾</span><span>🐾</span>
      </div>
      <h1 className="text-2xl font-black mt-4">オーナー情報</h1>
      <p className="text-sm text-muted-foreground">About You</p>

      <div className="flex justify-center my-6">
        <div className="text-7xl">👩‍🦰🐕</div>
      </div>

      <div className="space-y-3">
        <div className="bg-card p-4 rounded-2xl shadow-soft">
          <label className="text-xs font-bold">オーナー名 / Your Name <span className="text-destructive">*</span></label>
          <input className="w-full mt-1 bg-transparent outline-none text-sm" placeholder="例: 田中花子"/>
        </div>
        <div className="bg-card p-4 rounded-2xl shadow-soft">
          <label className="text-xs font-bold flex justify-between">年齢 / Age <span className="text-muted-foreground font-normal">任意</span></label>
          <input className="w-full mt-1 bg-transparent outline-none text-sm" placeholder="32"/>
        </div>
        <div className="bg-card p-4 rounded-2xl shadow-soft">
          <label className="text-xs font-bold">都道府県 / Prefecture</label>
          <select className="w-full mt-1 bg-transparent outline-none text-sm">
            {PREFECTURES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 p-4 bg-background border-t border-border max-w-md mx-auto">
        <button onClick={() => nav({ to: "/home" })} className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl shadow-card">完了 / Complete Setup</button>
      </div>
    </div>
  );
}
