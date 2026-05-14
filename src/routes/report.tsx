import { createFileRoute } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useState } from "react";
import { QrCode, FileDown } from "lucide-react";

export const Route = createFileRoute("/report")({ component: Report });

const score = Array.from({ length: 14 }, (_, i) => ({ d: `${i + 1}`, v: 70 + Math.round(Math.sin(i / 2) * 8 + i) }));
const temp = Array.from({ length: 14 }, (_, i) => ({ d: `${i + 1}`, v: 38.2 + Math.sin(i) * 0.4 }));
const steps = ["月","火","水","木","金","土","日"].map((d) => ({ d, v: 1500 + Math.round(Math.random() * 2500) }));

function Report() {
  const [tab, setTab] = useState("1w");
  return (
    <AppShell title="📊 健康レポート / Report">
      <div className="flex gap-1 bg-muted p-1 rounded-full">
        {["1d","1w","1m","3m","6m","4y"].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 text-xs font-bold rounded-full ${tab === t ? "bg-card text-primary shadow-soft" : "text-muted-foreground"}`}>{t}</button>
        ))}
      </div>

      <Card title="健康スコア推移" en="Health Score Timeline">
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={score}><Line type="monotone" dataKey="v" stroke="#4CAF82" strokeWidth={3} dot={false}/><XAxis dataKey="d" tick={{fontSize:10}}/><YAxis hide domain={[60,100]}/><Tooltip/></LineChart>
        </ResponsiveContainer>
      </Card>

      <Card title="体温履歴" en="Temperature History · 平均 38.5°C">
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={temp}><Line type="monotone" dataKey="v" stroke="#F4A623" strokeWidth={3} dot={false}/><XAxis dataKey="d" tick={{fontSize:10}}/><YAxis hide domain={[37,40]}/><Tooltip/></LineChart>
        </ResponsiveContainer>
      </Card>

      <Card title="運動量" en="Activity / Steps">
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={steps}><Bar dataKey="v" fill="#FFB7C5" radius={[8,8,0,0]}/><XAxis dataKey="d" tick={{fontSize:10}}/><YAxis hide/><Tooltip/></BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="ワクチン記録" en="Vaccination Records">
        <ul className="text-sm space-y-2">
          {[
            ["狂犬病", "2025年04月15日", true],
            ["混合ワクチン", "2025年03月02日", true],
            ["フィラリア予防", "2026年01月20日", true],
            ["ノミ・ダニ予防", "次回予定 2026年06月", false],
          ].map(([n,d,c]) => (
            <li key={n as string} className="flex items-center justify-between">
              <span className="flex items-center gap-2"><input type="checkbox" defaultChecked={c as boolean} className="accent-success"/>{n}</span>
              <span className="text-xs text-muted-foreground">{d}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="最終受診" en="Last Vet Visit">
        <div className="text-sm">渋谷動物病院 — 2026年04月20日</div>
        <div className="text-xs text-muted-foreground">健康診断: 異常なし ✓</div>
      </Card>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="bg-card rounded-2xl p-4 shadow-card text-center">
          <QrCode className="w-12 h-12 mx-auto text-primary"/>
          <div className="text-xs font-bold mt-2">📱 獣医用QRコード</div>
          <div className="text-[10px] text-muted-foreground">毎回新しいQR生成</div>
          <button className="mt-2 w-full bg-primary text-primary-foreground rounded-xl py-2 text-xs font-bold">生成 Generate</button>
        </div>
        <div className="bg-gradient-to-br from-warning/30 to-sakura-soft rounded-2xl p-4 shadow-card">
          <div className="text-xs font-bold">💰 レポート販売</div>
          <div className="text-[10px] text-muted-foreground mb-2">Sell Report</div>
          <ul className="text-[10px] space-y-0.5">
            <li>① ワクチン履歴</li>
            <li>② 最終健診</li>
            <li>③ 年間データ</li>
          </ul>
          <button className="mt-2 w-full bg-primary text-primary-foreground rounded-xl py-2 text-xs font-bold flex items-center justify-center gap-1"><FileDown className="w-3 h-3"/> PDF Export</button>
        </div>
      </div>
    </AppShell>
  );
}

function Card({ title, en, children }: any) {
  return (
    <div className="mt-3 bg-card rounded-2xl p-4 shadow-card">
      <div className="text-sm font-bold">{title}</div>
      <div className="text-[10px] text-muted-foreground mb-2">{en}</div>
      {children}
    </div>
  );
}
