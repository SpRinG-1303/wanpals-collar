import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BREEDS } from "@/lib/mock";

export const Route = createFileRoute("/onboarding/avatar")({ component: Step1 });

const COLORS = ["#D2A86A", "#F5DEB3", "#3E2A1B", "#FFFFFF", "#A0522D", "#808080"];
const EARS = ["▲▲", "◣◢", "◐◑", "○○"];
const EYES = ["•ω•", "◕‿◕", "^_^", "•‿•"];

function Step1() {
  const nav = useNavigate();
  const [breed, setBreed] = useState("柴犬");
  const [color, setColor] = useState(COLORS[0]);
  const [ear, setEar] = useState(0);
  const [eye, setEye] = useState(0);
  const [collar, setCollar] = useState("#FFB7C5");

  return (
    <div className="min-h-screen bg-background p-6 max-w-md mx-auto pb-32">
      <div className="flex justify-center gap-2 mt-2 text-2xl">
        <span>🐾</span><span className="opacity-30">🐾</span><span className="opacity-30">🐾</span>
      </div>
      <h1 className="text-2xl font-black mt-4">ワンちゃんを作ろう</h1>
      <p className="text-sm text-muted-foreground">Create Your Dog</p>

      <div className="flex justify-center mt-6">
        <div className="w-32 h-32 rounded-full flex items-center justify-center shadow-card border-4" style={{ background: color, borderColor: collar }}>
          <span className="text-4xl">{EYES[eye]}</span>
        </div>
      </div>

      <h3 className="mt-6 font-bold text-sm">犬種 / Breed</h3>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-6 px-6 mt-2 pb-2">
        {BREEDS.map((b) => (
          <button key={b.jp} onClick={() => setBreed(b.jp)} className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold border ${breed === b.jp ? "bg-sakura border-sakura text-primary" : "bg-card border-border text-muted-foreground"}`}>
            {b.jp} <span className="opacity-60">{b.en}</span>
          </button>
        ))}
      </div>

      <h3 className="mt-6 font-bold text-sm">毛色 / Fur Color</h3>
      <div className="flex gap-3 mt-2">
        {COLORS.map((c) => (
          <button key={c} onClick={() => setColor(c)} className={`w-10 h-10 rounded-full border-2 ${color === c ? "border-sakura ring-2 ring-sakura/40" : "border-border"}`} style={{ background: c }} />
        ))}
      </div>

      <h3 className="mt-6 font-bold text-sm">耳 / Ears</h3>
      <div className="grid grid-cols-4 gap-2 mt-2">
        {EARS.map((e, i) => (
          <button key={i} onClick={() => setEar(i)} className={`p-3 rounded-xl text-xl font-bold ${ear === i ? "bg-sakura-soft border-2 border-sakura" : "bg-card border border-border"}`}>{e}</button>
        ))}
      </div>

      <h3 className="mt-6 font-bold text-sm">目 / Eyes</h3>
      <div className="grid grid-cols-4 gap-2 mt-2">
        {EYES.map((e, i) => (
          <button key={i} onClick={() => setEye(i)} className={`p-3 rounded-xl text-sm font-bold ${eye === i ? "bg-sakura-soft border-2 border-sakura" : "bg-card border border-border"}`}>{e}</button>
        ))}
      </div>

      <h3 className="mt-6 font-bold text-sm">首輪 / Collar</h3>
      <div className="flex gap-3 mt-2">
        {["#FFB7C5", "#1A2F5A", "#4CAF82", "#F4A623", "#E53935"].map((c) => (
          <button key={c} onClick={() => setCollar(c)} className={`w-10 h-10 rounded-full border-2 ${collar === c ? "border-foreground" : "border-border"}`} style={{ background: c }} />
        ))}
      </div>

      <div className="fixed bottom-0 inset-x-0 p-4 bg-background border-t border-border max-w-md mx-auto">
        <button onClick={() => nav({ to: "/onboarding/dog" })} className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl shadow-card">次へ / Next</button>
      </div>
    </div>
  );
}
