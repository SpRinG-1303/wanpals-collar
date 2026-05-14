import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Camera } from "lucide-react";

export const Route = createFileRoute("/onboarding/dog")({ component: Step2 });

function Step2() {
  const nav = useNavigate();
  const [gender, setGender] = useState<"male" | "female">("female");
  const [vacc, setVacc] = useState(true);
  return (
    <div className="min-h-screen bg-background p-6 max-w-md mx-auto pb-32">
      <div className="flex justify-center gap-2 mt-2 text-2xl">
        <span>🐾</span><span>🐾</span><span className="opacity-30">🐾</span>
      </div>
      <h1 className="text-2xl font-black mt-4">ワンちゃんの情報</h1>
      <p className="text-sm text-muted-foreground">Dog Details</p>

      <div className="flex justify-center mt-6">
        <button className="w-28 h-28 rounded-full border-2 border-dashed border-sakura bg-sakura-soft flex flex-col items-center justify-center text-sakura">
          <Camera className="w-8 h-8"/>
          <span className="text-xs mt-1 font-bold">写真 / Photo</span>
        </button>
      </div>

      <div className="mt-6 space-y-3">
        <Field label="名前 / Name" req placeholder="例: ハナ" />
        <Field label="年齢 / Age" placeholder="3" optional />
        <Field label="体重 / Weight (kg)" placeholder="8.5" optional />
        <Field label="犬種 / Breed" placeholder="柴犬" />

        <div className="bg-card p-4 rounded-2xl shadow-soft">
          <div className="text-xs font-bold mb-2">性別 / Gender</div>
          <div className="grid grid-cols-2 gap-2">
            {(["male", "female"] as const).map((g) => (
              <button key={g} onClick={() => setGender(g)} className={`py-3 rounded-xl font-bold text-sm ${gender === g ? "bg-sakura text-primary" : "bg-muted text-muted-foreground"}`}>
                {g === "male" ? "♂ オス Male" : "♀ メス Female"}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-card p-4 rounded-2xl shadow-soft flex items-center justify-between">
          <div>
            <div className="text-sm font-bold">ワクチン接種済</div>
            <div className="text-xs text-muted-foreground">Vaccinated</div>
          </div>
          <button onClick={() => setVacc(!vacc)} className={`w-14 h-8 rounded-full relative transition-colors ${vacc ? "bg-success" : "bg-muted"}`}>
            <span className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${vacc ? "left-7" : "left-1"}`}/>
          </button>
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 p-4 bg-background border-t border-border max-w-md mx-auto">
        <button onClick={() => nav({ to: "/onboarding/owner" })} className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl shadow-card">次へ / Next</button>
      </div>
    </div>
  );
}

function Field({ label, placeholder, req, optional }: { label: string; placeholder: string; req?: boolean; optional?: boolean }) {
  return (
    <div className="bg-card p-4 rounded-2xl shadow-soft">
      <label className="text-xs font-bold flex items-center justify-between">
        <span>{label} {req && <span className="text-destructive">*</span>}</span>
        {optional && <span className="text-muted-foreground font-normal">任意 Optional</span>}
      </label>
      <input className="w-full mt-1 bg-transparent outline-none text-sm" placeholder={placeholder} />
    </div>
  );
}
