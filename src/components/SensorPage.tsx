import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState, type ReactNode, type CSSProperties } from "react";
import AppShell from "@/components/AppShell";
import { useLanguage, useT } from "@/context/LanguageContext";

export const SP = {
  sumi: "#2C2C2C",
  usuzumi: "#8A8A8A",
  card: "#FFFFFF",
  divider: "#F5F0EC",
  sakura: "#E8829A",
  matcha: "#6BAF92",
  yuzu: "#D4A843",
  fuji: "#7B68C8",
  momiji: "#D4714E",
  sora: "#5B9BD5",
};

export const CARD_SHADOW = "0 2px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)";

export function SensorPage({
  titleJp,
  titleEn,
  headerGradient,
  accent,
  children,
}: {
  titleJp: string;
  titleEn: string;
  headerGradient: string;
  accent: string;
  children: ReactNode;
}) {
  const t = useT();
  return (
    <AppShell hideTopBar noPadding>
      <div
        style={{
          background: headerGradient,
          padding: "16px 16px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
          <Link
            to="/home"
            className="flex items-center justify-center"
            style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "rgba(255,255,255,0.85)", color: SP.sumi,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
            aria-label="Back"
          >
            <ArrowLeft size={20} strokeWidth={2} />
          </Link>
          <span style={{
            background: "rgba(255,255,255,0.7)", color: accent,
            borderRadius: 999, padding: "4px 10px", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
          }}>LIVE</span>
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: SP.sumi, letterSpacing: "0.01em" }}>
          {titleJp}
        </div>
        <div style={{ fontSize: 13, color: SP.sumi, opacity: 0.65, marginTop: 2, fontWeight: 500 }}>
          {titleEn}
        </div>
        <span className="sr-only">{t("", "")}</span>
      </div>
      <div style={{ padding: "16px", marginTop: -12 }}>{children}</div>
    </AppShell>
  );
}

export function Card({ accent, children, style }: { accent: string; children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: SP.card, borderRadius: 18, borderLeft: `4px solid ${accent}`,
      boxShadow: CARD_SHADOW, padding: 16, marginBottom: 12, ...style,
    }}>{children}</div>
  );
}

export function TimeTabs({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const tabs = ["1d", "1w", "1m"];
  return (
    <div className="flex" style={{
      background: "#F5F0EC", borderRadius: 12, padding: 4, gap: 4, marginBottom: 12,
    }}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          style={{
            flex: 1, height: 32, borderRadius: 8, fontSize: 12, fontWeight: 700,
            background: value === tab ? "#FFFFFF" : "transparent",
            color: value === tab ? SP.sumi : SP.usuzumi,
            boxShadow: value === tab ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            letterSpacing: "0.04em",
          }}
        >{tab.toUpperCase()}</button>
      ))}
    </div>
  );
}

export function useTimeTab() {
  return useState<string>("1d");
}

export function BL({ jp, en }: { jp: string; en: string }) {
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: SP.sumi, lineHeight: 1.2 }}>{jp}</div>
      <div style={{ fontSize: 10, color: SP.usuzumi, marginTop: 1 }}>{en}</div>
    </div>
  );
}
