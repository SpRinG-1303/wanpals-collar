import { useState, type ReactNode, type CSSProperties } from "react";
import AppShell, { TopBar } from "@/components/AppShell";
import { useLanguage, useT } from "@/context/LanguageContext";

/**
 * Premium Japanese health-tech IoT design system for all sense pages.
 * Soft, minimal, trustworthy. Sakura pink accents on a warm off-white canvas.
 */
export const SP = {
  // Backgrounds
  page: "#FAFAF9",
  card: "#FFFFFF",
  // Text
  sumi: "#1A1A2E",          // primary deep navy
  ink: "#4B5563",           // Japanese body
  usuzumi: "#6B7280",       // secondary
  muted: "#9CA3AF",          // tertiary
  divider: "#F3F4F6",
  // Rose / sakura accent
  rose: "#F43F72",
  roseSoft: "#FF6B8A",
  roseTint: "#FFF0F3",
  roseFaint: "rgba(244,63,114,0.08)",
  // Status
  ok: "#16A34A", okDot: "#22C55E", okBg: "#F0FDF4",
  warn: "#D97706", warnDot: "#F59E0B", warnBg: "#FFFBEB",
  danger: "#E11D48", dangerDot: "#F43F72", dangerBg: "#FFF1F2",
  // Legacy alias (kept so existing components compile without changes)
  sakura: "#F43F72",
  matcha: "#6BAF92",
  yuzu: "#D4A843",
  fuji: "#7B68C8",
  momiji: "#D4714E",
  sora: "#5B9BD5",
};

export const CARD_SHADOW = "0 2px 20px rgba(0,0,0,0.055)";
export const SAKURA_HEADER = "linear-gradient(180deg,#FFF5F7 0%,#FFE8EF 100%)";

export function SensorPage({
  titleJp,
  titleEn,
  // legacy props kept for compatibility — every page uses the global sakura
  // pink header now.
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
  return (
    <AppShell
      noPadding
      renderTopBar={() => (
        <TopBar showBack backTo="/home" />
      )}
    >
      <style>{`
        @keyframes spLiveDot { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.3);opacity:.55} }
        @keyframes spCardIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .sp-stack > * {
          opacity: 0;
          animation: spCardIn 320ms ease-out forwards;
        }
        .sp-stack > *:nth-child(1){animation-delay:40ms}
        .sp-stack > *:nth-child(2){animation-delay:140ms}
        .sp-stack > *:nth-child(3){animation-delay:240ms}
        .sp-stack > *:nth-child(4){animation-delay:340ms}
        .sp-stack > *:nth-child(5){animation-delay:440ms}
        .sp-stack > *:nth-child(6){animation-delay:540ms}
      `}</style>

      <div style={{ background: SP.page, minHeight: "100%", paddingBottom: 24 }}>
        {/* Header */}
        <div
          style={{
            background: SAKURA_HEADER,
            padding: "18px 18px 26px",
            position: "relative",
            minHeight: 100,
          }}
        >
          <div className="flex items-center justify-between">
            <Bi
              jp={titleJp}
              en={titleEn}
              jpStyle={{ fontSize: 17, fontWeight: 500, color: SP.sumi, letterSpacing: "0.01em", lineHeight: 1.2 }}
              enStyle={{ fontSize: 17, fontWeight: 500, color: SP.sumi, letterSpacing: "0.01em", lineHeight: 1.2 }}
            />
            <span
              className="flex items-center"
              style={{
                background: "#FFFFFF",
                color: SP.sumi,
                borderRadius: 50,
                padding: "4px 10px 4px 8px",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                gap: 6,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <span
                style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#E53935",
                  animation: "spLiveDot 1.5s ease-in-out infinite",
                }}
              />
              LIVE
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="sp-stack" style={{ padding: "16px", marginTop: -10 }}>
          {children}
        </div>
      </div>
    </AppShell>
  );
}

/**
 * Standard floating white card. The `accent` prop is kept for backward
 * compatibility but is no longer rendered — cards are clean white with a soft
 * shadow, no borders.
 */
export function Card({
  accent: _accent,
  children,
  style,
}: {
  accent?: string;
  children: ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: SP.card,
        borderRadius: 22,
        boxShadow: CARD_SHADOW,
        padding: 20,
        marginBottom: 14,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function TimeTabs({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const tabs = ["1d", "1w", "1m"];
  return (
    <div
      className="flex"
      style={{
        background: SP.divider,
        borderRadius: 50,
        padding: 4,
        gap: 4,
        marginBottom: 14,
      }}
    >
      {tabs.map((tab) => {
        const active = value === tab;
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            style={{
              flex: 1,
              height: 32,
              borderRadius: 50,
              fontSize: 13,
              fontWeight: active ? 600 : 500,
              background: active ? SP.rose : "transparent",
              color: active ? "#FFFFFF" : SP.muted,
              letterSpacing: "0.04em",
              transition: "all 200ms ease",
            }}
          >
            {tab.toUpperCase()}
          </button>
        );
      })}
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
 * Small uppercase rose-pink label with a 2px dot. Use at the top of every card.
 */
export function SectionLabel({ jp, en }: { jp: string; en: string }) {
  const t = useT();
  return (
    <div
      className="flex items-center"
      style={{
        gap: 6,
        marginBottom: 12,
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: SP.rose, flexShrink: 0 }} />
      <span
        style={{
          fontSize: 11,
          color: SP.rose,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {t(jp, en)}
      </span>
    </div>
  );
}

/**
 * AI Insight card — the ONLY card in the system with a left border.
 * 3px rose-pink translucent stripe on the left edge.
 */
export function AIInsightCard({
  jp,
  en,
  timestampJp = "今日 14:32",
  timestampEn = "Today 14:32",
}: {
  jp: string;
  en: string;
  timestampJp?: string;
  timestampEn?: string;
}) {
  const t = useT();
  return (
    <div
      style={{
        background: SP.card,
        borderRadius: 22,
        padding: 20,
        marginBottom: 14,
        boxShadow: CARD_SHADOW,
        borderLeft: "3px solid rgba(244,63,114,0.3)",
      }}
    >
      <div className="flex items-center" style={{ gap: 6 }}>
        <span style={{ color: SP.rose, fontSize: 13, lineHeight: 1 }}>✦</span>
        <span
          style={{
            fontSize: 11,
            color: SP.rose,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {t("AI インサイト", "AI Insight")}
        </span>
      </div>
      <div style={{ height: 1, background: SP.divider, margin: "10px 0 12px" }} />
      <Bi
        jp={jp}
        en={en}
        jpStyle={{ fontSize: 13, color: SP.ink, lineHeight: 1.7 }}
        enStyle={{ fontSize: 13, color: SP.ink, lineHeight: 1.7 }}
      />
      <div style={{ fontSize: 11, color: SP.muted, marginTop: 12 }}>
        {t(`最終更新 ${timestampJp}`, `Last updated: ${timestampEn}`)}
      </div>
    </div>
  );
}

/**
 * Status badge using the global system. Variant determines color + dot.
 */
export function StatusBadge({
  jp,
  en,
  variant = "ok",
}: {
  jp: string;
  en: string;
  variant?: "ok" | "warn" | "danger";
}) {
  const t = useT();
  const map = {
    ok: { bg: SP.okBg, color: SP.ok, dot: SP.okDot },
    warn: { bg: SP.warnBg, color: SP.warn, dot: SP.warnDot },
    danger: { bg: SP.dangerBg, color: SP.danger, dot: SP.dangerDot },
  }[variant];
  return (
    <span
      className="inline-flex items-center"
      style={{
        gap: 6,
        background: map.bg,
        color: map.color,
        borderRadius: 50,
        padding: "4px 12px",
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: map.dot }} />
      {t(jp, en)}
    </span>
  );
}

/**
 * Bilingual text that honours the global language switcher.
 *  - english  → renders only `en`
 *  - japanese → renders only `jp`
 *  - mixed    → JP on top, EN below in smaller style
 */
export function Bi({
  jp,
  en,
  jpStyle,
  enStyle,
  as: As = "div",
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
