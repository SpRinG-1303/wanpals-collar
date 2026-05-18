import { useState, type ReactNode, type CSSProperties } from "react";
import AppShell, { TopBar } from "@/components/AppShell";
import { useLanguage, useT } from "@/context/LanguageContext";

export const SP = {
  sumi: "#2D2D2D",
  usuzumi: "#6B7280",
  card: "#FFFFFF",
  divider: "#F5F0EC",
  sakura: "#E8829A",
  rose: "#F43F72",
  roseSoft: "#FFF0F3",
  matcha: "#6BAF92",
  yuzu: "#D4A843",
  fuji: "#7B68C8",
  momiji: "#D4714E",
  sora: "#5B9BD5",
};

export const CARD_SHADOW = "0 2px 16px rgba(0,0,0,0.06)";
export const SAKURA_HEADER = "linear-gradient(135deg,#FFF0F3 0%,#FFE4EC 100%)";

export function SensorPage({
  titleJp,
  titleEn,
  // legacy props kept for compatibility but ignored — every page uses the
  // global sakura pink header now.
  headerGradient: _headerGradient,
  accent: _accent,
  children,
}: {
  titleJp: string;
  titleEn: string;
  headerGradient?: string;
  accent?: string;
  children: ReactNode;
}) {
  const t = useT();
  return (
    <AppShell
      noPadding
      renderTopBar={({ menuOpen, onMenuClick }) => (
        <TopBar onMenuClick={onMenuClick} menuOpen={menuOpen} showBack backTo="/home" />
      )}
    >
      <div
        style={{
          background: SAKURA_HEADER,
          padding: "16px 16px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="flex items-center justify-end" style={{ marginBottom: 12 }}>
          <span className="flex items-center" style={{
            background: "rgba(255,255,255,0.85)", color: SP.sumi,
            borderRadius: 999, padding: "5px 11px 5px 9px", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
            gap: 6, boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}>
            <span style={{ position: "relative", width: 7, height: 7 }}>
              <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#E53935" }} />
              <span style={{ position: "absolute", inset: -3, borderRadius: "50%", background: "#E53935", opacity: 0.4, animation: "pulseRed 1.6s infinite" }} />
            </span>
            LIVE
          </span>
        </div>
        <Bi
          jp={titleJp}
          en={titleEn}
          jpStyle={{ fontSize: 20, fontWeight: 500, color: SP.sumi, letterSpacing: "0.01em" }}
          enStyle={{ fontSize: 12, color: SP.sumi, opacity: 0.6, marginTop: 2, fontWeight: 400 }}
        />
        <span className="sr-only">{t("", "")}</span>
      </div>
      <div style={{ padding: "16px", marginTop: -12 }}>{children}</div>
    </AppShell>
  );
}

// `accent` prop kept for backward compatibility but no longer rendered as a
// colored left border — all sensor cards are now clean white with a soft shadow.
export function Card({ accent: _accent, children, style }: { accent?: string; children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: SP.card, borderRadius: 20,
      boxShadow: CARD_SHADOW, padding: 20, marginBottom: 12, ...style,
    }}>{children}</div>
  );
}

export function TimeTabs({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const tabs = ["1d", "1w", "1m"];
  return (
    <div className="flex" style={{
      background: "#F4F0EE", borderRadius: 999, padding: 4, gap: 4, marginBottom: 12,
    }}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          style={{
            flex: 1, height: 32, borderRadius: 999, fontSize: 12, fontWeight: 600,
            background: value === tab ? SP.rose : "transparent",
            color: value === tab ? "#FFFFFF" : SP.usuzumi,
            letterSpacing: "0.04em",
            transition: "all 0.2s",
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
    <Bi
      jp={jp}
      en={en}
      jpStyle={{ fontSize: 13, fontWeight: 600, color: SP.sumi, lineHeight: 1.2 }}
      enStyle={{ fontSize: 10, color: SP.usuzumi, marginTop: 1 }}
    />
  );
}

/**
 * Section label — small, rose-pink, light, uppercase tracking.
 * Use at the top of any card section.
 */
export function SectionLabel({ jp, en }: { jp: string; en: string }) {
  const t = useT();
  return (
    <div style={{
      fontSize: 10, color: SP.rose, fontWeight: 500,
      letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 10,
    }}>
      {t(jp, en)}
    </div>
  );
}

/**
 * AI Insight card — consistent design across all sense pages.
 * Rose-pink sparkle, label, thin divider, body text.
 */
export function AIInsightCard({ jp, en }: { jp: string; en: string }) {
  const t = useT();
  return (
    <div style={{
      background: SP.card, borderRadius: 20, padding: 20, marginBottom: 12,
      boxShadow: CARD_SHADOW,
    }}>
      <div className="flex items-center" style={{ gap: 6 }}>
        <span style={{ color: SP.rose, fontSize: 13, lineHeight: 1 }}>✦</span>
        <span style={{ fontSize: 11, color: SP.rose, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase" }}>
          {t("AIインサイト / AI Insight", "AI Insight")}
        </span>
      </div>
      <div style={{ height: 1, background: "#FAE0E8", margin: "10px 0 12px" }} />
      <div style={{ fontSize: 13, color: SP.sumi, lineHeight: 1.6 }}>{t(jp, en)}</div>
    </div>
  );
}

/**
 * Bilingual text that honours the global language switcher.
 *  - english  → renders only `en` (with `enStyle` if provided, else `jpStyle`)
 *  - japanese → renders only `jp` (with `jpStyle`)
 *  - mixed    → JP on top, EN below in smaller style
 */
export function Bi({
  jp, en, jpStyle, enStyle, as: As = "div",
}: {
  jp: ReactNode;
  en: ReactNode;
  jpStyle?: CSSProperties;
  enStyle?: CSSProperties;
  as?: "div" | "span";
}) {
  const { language } = useLanguage();
  if (language === "english") return <As style={enStyle ?? jpStyle}>{en}</As>;
  if (language === "japanese") return <As style={jpStyle}>{jp}</As>;
  return (
    <>
      <As style={jpStyle}>{jp}</As>
      <As style={enStyle}>{en}</As>
    </>
  );
}
