import { createFileRoute } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useState } from "react";
import { QrCode, FileDown } from "lucide-react";
import { useT, useLanguage } from "@/context/LanguageContext";

export const Route = createFileRoute("/report")({ component: Report });

const score = Array.from({ length: 14 }, (_, i) => ({ d: `${i + 1}`, v: 70 + Math.round(Math.sin(i / 2) * 8 + i) }));
const temp = Array.from({ length: 14 }, (_, i) => ({ d: `${i + 1}`, v: 38.2 + Math.sin(i) * 0.4 }));

function Report() {
  const t = useT();
  const { language } = useLanguage();
  const [tab, setTab] = useState("1w");

  const stepDays = language === "english"
    ? ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
    : ["月","火","水","木","金","土","日"];
  const steps = stepDays.map((d) => ({ d, v: 1500 + Math.round(Math.random() * 2500) }));

  return (
    <AppShell titleJp="📊 健康レポート" titleEn="📊 Health Report">
      <div className="flex gap-1 bg-muted p-1 rounded-full">
        {["1d","1w","1m","3m","6m","4y"].map((tb) => (
          <button key={tb} onClick={() => setTab(tb)} className={`flex-1 py-2 text-xs font-bold rounded-full ${tab === tb ? "bg-card text-primary shadow-soft" : "text-muted-foreground"}`}>{tb}</button>
        ))}
      </div>

      <Card jp="健康スコア推移" en="Health Score Timeline">
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={score}><Line type="monotone" dataKey="v" stroke="#4CAF82" strokeWidth={3} dot={false}/><XAxis dataKey="d" tick={{fontSize:10}}/><YAxis hide domain={[60,100]}/><Tooltip/></LineChart>
        </ResponsiveContainer>
      </Card>

      <Card jp="体温履歴 · 平均 38.5°C" en="Temperature History · Avg 38.5°C">
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={temp}><Line type="monotone" dataKey="v" stroke="#F4A623" strokeWidth={3} dot={false}/><XAxis dataKey="d" tick={{fontSize:10}}/><YAxis hide domain={[37,40]}/><Tooltip/></LineChart>
        </ResponsiveContainer>
      </Card>

      <Card jp="運動量" en="Activity / Steps">
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={steps}><Bar dataKey="v" fill="#FFB7C5" radius={[8,8,0,0]}/><XAxis dataKey="d" tick={{fontSize:10}}/><YAxis hide/><Tooltip/></BarChart>
        </ResponsiveContainer>
      </Card>

      <Card jp="ワクチン記録" en="Vaccination Records">
        <ul className="text-sm space-y-2">
          {([
            ["狂犬病", "Rabies", "2025/04/15", true],
            ["混合ワクチン", "Combination", "2025/03/02", true],
            ["フィラリア予防", "Heartworm", "2026/01/20", true],
            ["ノミ・ダニ予防", "Flea & Tick", t("次回予定 2026年06月", "Next: June 2026"), false],
          ] as const).map(([jp, en, d, c]) => (
            <li key={en} className="flex items-center justify-between">
              <span className="flex items-center gap-2"><input type="checkbox" defaultChecked={c as boolean} className="accent-success"/>{t(jp, en)}</span>
              <span className="text-xs text-muted-foreground">{d}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card jp="最終受診" en="Last Vet Visit">
        <div className="text-sm">{t("渋谷動物病院 — 2026年04月20日", "Shibuya Animal Hospital — Apr 20, 2026")}</div>
        <div className="text-xs text-muted-foreground">{t("健康診断: 異常なし ✓", "Health check: All clear ✓")}</div>
      </Card>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="bg-card rounded-2xl p-4 shadow-card text-center">
          <QrCode className="w-12 h-12 mx-auto text-primary"/>
          <div className="text-xs font-bold mt-2">📱 {t("獣医用QRコード", "Vet QR Code")}</div>
          <div className="text-[10px] text-muted-foreground">{t("毎回新しいQR生成", "New QR every time")}</div>
          <button className="mt-2 w-full bg-primary text-primary-foreground rounded-xl py-2 text-xs font-bold">{t("生成", "Generate")}</button>
        </div>
        <div className="bg-gradient-to-br from-warning/30 to-sakura-soft rounded-2xl p-4 shadow-card">
          <div className="text-xs font-bold">💰 {t("レポート販売", "Sell Report")}</div>
          <ul className="text-[10px] space-y-0.5 mt-2">
            <li>① {t("ワクチン履歴", "Vaccination history")}</li>
            <li>② {t("最終健診", "Last checkup")}</li>
            <li>③ {t("年間データ", "Annual data")}</li>
          </ul>
          <button className="mt-2 w-full bg-primary text-primary-foreground rounded-xl py-2 text-xs font-bold flex items-center justify-center gap-1"><FileDown className="w-3 h-3"/> {t("PDF書出し", "PDF Export")}</button>
        </div>
      </div>
    </AppShell>
  );
}

function Card({ jp, en, children }: { jp: string; en: string; children: React.ReactNode }) {
  const { language } = useLanguage();
  return (
    <div className="mt-3 bg-card rounded-2xl p-4 shadow-card">
      <div className="text-sm font-bold">{language === "english" ? en : jp}</div>
      {language === "mixed" && <div className="text-[10px] text-muted-foreground mb-2">{en}</div>}
      {children}
    </div>
  );
}
