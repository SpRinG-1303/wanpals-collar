import { createFileRoute, useNavigate } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { CLINICS } from "@/lib/mock";
import {
  Search,
  SlidersHorizontal,
  Star,
  Navigation,
  Video,
  Phone,
  MapPin,
  
  Plus,
  HeartPulse,
  ThumbsUp,
  Microscope,
  Building2,
  Bookmark,
  ChevronRight,
  Clock,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useT, useLanguage } from "@/context/LanguageContext";

export const Route = createFileRoute("/clinics")({ component: Clinics });

/* Home-page card spec */
const CARD_SHADOW = "0 2px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)";

// ── Per-clinic themes ─────────────────────────────────────────
type Theme = { from: string; to: string; accent: string; soft: string };
const CLINIC_THEMES: Theme[] = [
  { from: "var(--acc-pale)", to: "var(--acc2-soft)", accent: "var(--accent-matcha)", soft: "var(--acc-pale)" }, // Shibuya mint
  { from: "var(--accent-sakura-soft)", to: "var(--bg-card-sakura)", accent: "var(--accent-sakura)", soft: "var(--accent-sakura-soft)" }, // Harajuku sakura
  { from: "var(--acc2-pale)", to: "var(--acc-pale)", accent: "var(--accent-sora)", soft: "var(--acc2-pale)" }, // Shinjuku blue
  { from: "var(--acc-pale)", to: "var(--acc-pale)", accent: "var(--accent-yuzu)", soft: "var(--acc-pale)" }, // Yoyogi yuzu
  { from: "var(--acc-pale)", to: "var(--acc-pale)", accent: "var(--accent-fuji)", soft: "var(--acc-pale)" }, // Meguro fuji
];

const SPECIALTIES = [
  { jp: "歯科", en: "Dental" },
  { jp: "外科", en: "Surgery" },
  { jp: "皮膚科", en: "Derm" },
  { jp: "内科", en: "Internal" },
];

const TYPE_LABEL = ["General", "Specialist", "General", "General", "Specialist"];

// ── Category tabs ─────────────────────────────────────────────
type Cat = { jp: string; en: string; Icon: typeof Star; accent: string; from: string; to: string };
const CATS: Cat[] = [
  { jp: "高評価", en: "Top Rated", Icon: Star, accent: "var(--accent-yuzu)", from: "var(--acc-pale)", to: "var(--acc-pale)" },
  { jp: "近く", en: "Nearby", Icon: MapPin, accent: "var(--accent-sora)", from: "var(--acc2-pale)", to: "#F0F7FF" },
  { jp: "おすすめ", en: "Recommended", Icon: ThumbsUp, accent: "var(--accent-matcha)", from: "var(--acc-pale)", to: "var(--acc2-pale)" },
  { jp: "専門", en: "Specialized", Icon: Microscope, accent: "var(--accent-fuji)", from: "var(--acc-pale)", to: "#F8F5FF" },
  { jp: "公立/私立", en: "Public/Private", Icon: Building2, accent: "var(--accent-sakura)", from: "var(--accent-sakura-soft)", to: "var(--bg-card)" },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center" style={{ gap: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          style={{ color: i <= Math.round(rating) ? "var(--accent-yuzu)" : "var(--border-card)" }}
          fill={i <= Math.round(rating) ? "var(--accent-yuzu)" : "var(--border-card)"}
        />
      ))}
    </div>
  );
}

function SectionLabel({ jp, en }: { jp: string; en: string }) {
  const t = useT();
  return (
    <div className="flex items-center justify-between" style={{ margin: "24px 20px 12px" }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text-secondary)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
        {t(jp, en)}
      </div>
    </div>
  );
}

function Clinics() {
  const t = useT();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [filter, setFilter] = useState(false);
  const [active, setActive] = useState(1);
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<Record<number, boolean>>({});
  const [minStars, setMinStars] = useState(4);
  const [distance, setDistance] = useState(5);
  const [openOnly, setOpenOnly] = useState(true);
  const [emOnly, setEmOnly] = useState(false);
  const [specSel, setSpecSel] = useState<Record<string, boolean>>({});
  const [applied, setApplied] = useState({ minStars: 0, distance: 50, openOnly: false, emOnly: false });
  const [visible, setVisible] = useState(3);
  const [videoBooking, setVideoBooking] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CLINICS.filter((c) => {
      if (q && !c.en.toLowerCase().includes(q) && !c.jp.includes(query.trim())) return false;
      if (c.rating < applied.minStars) return false;
      if (c.km > applied.distance) return false;
      if (applied.openOnly && !c.open) return false;
      if (applied.emOnly && !c.em) return false;
      return true;
    });
  }, [query, applied]);

  function bookVideoConsult() {
    if (videoBooking) return;
    setVideoBooking(true);
    toast.loading("Connecting you to the next available vet…", { id: "video-consult" });
    setTimeout(() => {
      setVideoBooking(false);
      toast.success("Booked! Dr. Mehta will video call you in ~5 minutes.", { id: "video-consult" });
    }, 1800);
  }

  const emergencyClinic = CLINICS.find((c) => c.em && c.open) ?? CLINICS[0];
  const openCount = CLINICS.filter((c) => c.open).length;
  const emCount = CLINICS.filter((c) => c.em).length;
  const avgRating = (CLINICS.reduce((a, c) => a + c.rating, 0) / CLINICS.length).toFixed(1);

  const openMaps = (name: string) => {
    if (typeof window !== "undefined") {
      window.open(`https://maps.google.com/?q=${encodeURIComponent(name)}`, "_blank");
    }
  };

  return (
    <AppShell noPadding>
      {/* ── Hero card ──────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{
          margin: "16px 20px 0",
          borderRadius: 24,
          background: "linear-gradient(135deg, var(--acc-pale) 0%, var(--accent-sakura-soft) 55%, var(--acc2-pale) 100%)",
          border: "1px solid var(--acc2-soft)",
          padding: "20px 20px 18px",
        }}
      >
        {/* Faint medical-cross pattern */}
        <div style={{ position: "absolute", right: 18, top: 16, width: 56, height: 56, opacity: 0.08, pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 21, top: 0, width: 14, height: 56, borderRadius: 6, background: "var(--acc-strong)" }} />
          <div style={{ position: "absolute", left: 0, top: 21, width: 56, height: 14, borderRadius: 6, background: "var(--acc-strong)" }} />
        </div>
        <div style={{ position: "absolute", right: 76, bottom: 14, width: 30, height: 30, opacity: 0.06, pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 11, top: 0, width: 8, height: 30, borderRadius: 4, background: "var(--acc-strong)" }} />
          <div style={{ position: "absolute", left: 0, top: 11, width: 30, height: 8, borderRadius: 4, background: "var(--acc-strong)" }} />
        </div>

        <div style={{ fontSize: 10, color: "var(--acc-strong)", letterSpacing: "0.16em", fontWeight: 800 }}>
          {t("動物病院", "ANIMAL CLINICS")}
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.15, marginTop: 6, fontFamily: "var(--font-display, inherit)" }}>
          {t("クリニックを探す", "Find Care")}
        </div>
        <div style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 2, fontWeight: 500 }}>
          {t("近くの動物病院", "Near You")}
        </div>
        <div
          className="inline-flex items-center gap-1"
          style={{
            marginTop: 12,
            background: "rgba(255,255,255,0.85)",
            border: "1px solid var(--acc2-soft)",
            borderRadius: 999,
            padding: "5px 12px",
            fontSize: 11,
            color: "var(--acc-strong)",
            fontWeight: 700,
          }}
        >
          <MapPin size={11} />
          {t("Bandra West, Mumbai", "Bandra West, Mumbai")}
        </div>
      </div>

      {/* ── Search bar ─────────────────────────────────────── */}
      <div className="flex items-center" style={{ margin: "16px 20px 0", gap: 12 }}>
        <div
          className="flex items-center flex-1"
          style={{
            background: "#FFFFFF",
            borderRadius: 16,
            height: 56,
            padding: "0 16px",
            gap: 10,
            minWidth: 0,
            border: `1.5px solid ${focused ? "var(--accent-sakura)" : "var(--border-card)"}`,
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            transition: "border 0.18s ease",
          }}
        >
          <Search size={19} strokeWidth={2} style={{ color: "var(--text-placeholder)", flexShrink: 0 }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="flex-1 bg-transparent outline-none"
            style={{ fontSize: 14, color: "var(--text-primary)", minWidth: 0, height: "100%", border: "none" }}
            placeholder={t("クリニックを検索", "Search clinics")}
          />
        </div>
        <button
          onClick={() => setFilter(true)}
          className="flex items-center justify-center"
          style={{
            width: 56, height: 56, borderRadius: 16, flexShrink: 0,
            background: "var(--accent-sakura)",
            boxShadow: "0 4px 12px color-mix(in oklab, var(--accent-sakura) 30%, transparent)",
            color: "#FFFFFF",
          }}
          aria-label={t("絞り込み", "Filters")}
        >
          <SlidersHorizontal size={20} strokeWidth={2.2} />
        </button>
      </div>

      {/* ── Quick stats — one card, three divided columns ──── */}
      <div
        className="grid grid-cols-3"
        style={{
          margin: "16px 20px 0",
          background: "#FFFFFF",
          borderRadius: 20,
          border: "1px solid var(--border-card)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          padding: "16px 0",
        }}
      >
        {[
          { n: String(CLINICS.length), jp: "近隣クリニック", en: "Clinics Nearby", color: "var(--accent-sakura)", Icon: Building2 },
          { n: avgRating, jp: "平均評価", en: "Avg Rating", color: "var(--accent-yuzu)", Icon: Star },
          { n: String(emCount), jp: "24時間対応", en: "24h Open", color: "var(--acc-strong)", Icon: Clock },
        ].map((s, i) => (
          <div
            key={s.en}
            className="flex flex-col items-center"
            style={{ gap: 4, borderLeft: i > 0 ? "1px solid var(--border-card)" : "none", padding: "0 8px" }}
          >
            <s.Icon size={16} style={{ color: s.color }} />
            <span className="tabular-nums" style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.1 }}>{s.n}</span>
            <div style={{ fontSize: 10, color: "var(--text-secondary)", lineHeight: 1.2, textAlign: "center", fontWeight: 500 }}>
              {t(s.jp, s.en)}
            </div>
          </div>
        ))}
      </div>

      {/* ── Map preview ────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{
          margin: "16px 20px 0",
          aspectRatio: "16 / 9",
          borderRadius: 20,
          border: "1px solid var(--border-card)",
          background:
            "linear-gradient(180deg,var(--acc-pale),var(--acc2-pale)), repeating-linear-gradient(0deg,transparent,transparent 22px,color-mix(in oklab, var(--acc-strong) 7.0%, transparent) 23px), repeating-linear-gradient(90deg,transparent,transparent 22px,color-mix(in oklab, var(--acc-strong) 7.0%, transparent) 23px)",
        }}
      >
        {/* Faux roads */}
        <div style={{ position: "absolute", top: "34%", left: 0, right: 0, height: 4, background: "rgba(255,255,255,0.75)" }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, left: "58%", width: 4, background: "rgba(255,255,255,0.75)" }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, left: "24%", width: 3, background: "rgba(255,255,255,0.55)" }} />
        {/* Pins */}
        {[
          { l: "16%", t: "18%", c: "var(--accent-matcha)" },
          { l: "44%", t: "14%", c: "var(--accent-sakura)" },
          { l: "72%", t: "22%", c: "var(--acc-strong)" },
          { l: "34%", t: "52%", c: "var(--accent-yuzu)" },
          { l: "80%", t: "56%", c: "var(--accent-sakura)" },
        ].map((p, i) => (
          <div
            key={i}
            style={{
              position: "absolute", left: p.l, top: p.t,
              width: 14, height: 14, borderRadius: "50%",
              background: p.c, border: "2px solid #fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
            }}
          />
        ))}
        <button
          onClick={() => navigate({ to: "/map" })}
          className="absolute"
          style={{
            left: "50%", bottom: 12, transform: "translateX(-50%)",
            background: "#fff", color: "var(--acc-strong)",
            borderRadius: 999, padding: "8px 18px",
            fontSize: 12, fontWeight: 700,
            border: "1px solid var(--acc2-soft)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
            display: "flex", alignItems: "center", gap: 6,
            whiteSpace: "nowrap",
          }}
        >
          <MapPin size={14} /> {t("地図で見る", "View on Map")}
        </button>
      </div>

      {/* ── Category tabs ──────────────────────────────────── */}
      <div className="flex overflow-x-auto scrollbar-hide" style={{ padding: "16px 20px 0", gap: 8 }}>
        {CATS.map((c, i) => {
          const sel = active === i;
          const Icon = c.Icon;
          return (
            <button
              key={c.en}
              onClick={() => setActive(i)}
              className="shrink-0 flex items-center"
              style={{
                background: sel ? "var(--accent-sakura)" : "#FFFFFF",
                border: `1.5px solid ${sel ? "var(--accent-sakura)" : "var(--border-card)"}`,
                color: sel ? "#FFFFFF" : "var(--text-secondary)",
                fontWeight: sel ? 700 : 500,
                fontSize: 12,
                borderRadius: 999,
                padding: "0 16px",
                height: 40,
                gap: 6,
                boxShadow: sel ? "0 4px 12px color-mix(in oklab, var(--accent-sakura) 28%, transparent)" : "none",
                transition: "all 0.18s ease",
              }}
            >
              <Icon size={14} style={{ color: sel ? "#FFFFFF" : "var(--text-placeholder)" }} fill={sel && c.en === "Top Rated" ? "#FFFFFF" : "none"} />
              {t(c.jp, c.en)}
            </button>
          );
        })}
      </div>

      {/* ── Emergency banner ───────────────────────────────── */}
      <SectionLabel jp="緊急対応" en="Emergency" />
      <motion.div
        animate={{ boxShadow: ["0 8px 24px rgba(229,57,53,0.3)", "0 8px 32px rgba(229,57,53,0.5)", "0 8px 24px rgba(229,57,53,0.3)"] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          margin: "0 16px 12px",
          background: "linear-gradient(135deg,#FF4444,#E53935)",
          borderRadius: 20,
          padding: "16px 20px",
          color: "#fff",
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">

            <div className="min-w-0">
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)" }}>
                {t("緊急の場合", "In Emergency")}
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.25 }}>
                {t("最寄りの24時間病院", "Nearest 24H Hospital")}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.9)", marginTop: 4 }}>
                {language === "english" ? emergencyClinic.en : emergencyClinic.jp} · {emergencyClinic.km}km · {emergencyClinic.rating}
              </div>
            </div>
          </div>
          <a
            href="tel:+81000000000"
            className="flex items-center gap-1.5 shrink-0"
            style={{
              background: "#fff", color: "#E53935",
              borderRadius: 20, padding: "8px 14px",
              fontSize: 13, fontWeight: 800,
              boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
            }}
          >
            <Phone size={14} />
            {t("電話", "Call")}
          </a>
        </div>
      </motion.div>

      {/* ── Video consultation ─────────────────────────────── */}
      <button
        onClick={bookVideoConsult}
        className="w-full text-left flex items-center gap-3 active:scale-[0.98] transition-transform"
        style={{
          margin: "0 16px 12px",
          width: "calc(100% - 32px)",
          background: "#FFFFFF",
          boxShadow: CARD_SHADOW,
          borderRadius: 20,
          padding: "14px 16px",
        }}
      >
        <div
          className="shrink-0 flex items-center justify-center"
          style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--bg-card-lavender)" }}
        >
          <Video size={26} style={{ color: "var(--accent-fuji)" }} />
        </div>
        <div className="flex-1 min-w-0">
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>
            {t("ビデオ診察", "Video Consultation")}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
            {t("今すぐ獣医と相談", "Consult a vet now")}
          </div>
          <span
            className="inline-block"
            style={{
              marginTop: 6, background: "var(--accent-sakura-soft)", color: "var(--accent-sakura)",
              fontSize: 10, fontWeight: 700,
              padding: "2px 8px", borderRadius: 20,
            }}
          >
            ● 24/7 Available
          </span>
        </div>
        <div
          className="shrink-0 flex items-center justify-center"
          style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--accent-sakura)", color: "#fff" }}
        >
          <ChevronRight size={18} />
        </div>
      </button>

      {/* ── Clinics list ───────────────────────────────────── */}
      <SectionLabel jp="近くのクリニック" en="Nearby" />
      <div style={{ paddingBottom: 24 }}>
        {filtered.slice(0, visible).map((c, i) => {
          const th = CLINIC_THEMES[i % CLINIC_THEMES.length];
          const isNew = i === 1;
          return (
            <div
              key={i}
              style={{
                background: "#FFFFFF",
                borderRadius: 20,
                margin: "0 16px 12px",
                boxShadow: CARD_SHADOW,
                overflow: "hidden",
              }}
            >
              {/* Header — profile row: icon + name + bookmark */}
              <div className="flex items-start" style={{ padding: "16px 16px 0", gap: 12 }}>
                <div
                  className="flex items-center justify-center"
                  style={{ width: 52, height: 52, borderRadius: "50%", background: th.soft, flexShrink: 0 }}
                >
                  <HeartPulse size={24} style={{ color: th.accent }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5" style={{ flexWrap: "wrap" }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.25 }}>
                      {language === "english" ? c.en : c.jp}
                    </span>
                    {isNew && (
                      <span style={{ background: "var(--accent-sakura)", color: "#fff", fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 10, letterSpacing: "0.1em" }}>
                        NEW
                      </span>
                    )}
                    {c.em && (
                      <span className="pulse-red" style={{ background: "#E53935", color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 10, letterSpacing: "0.05em" }}>
                        24H
                      </span>
                    )}
                  </div>
                  {language === "mixed" && (
                    <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>{c.en}</div>
                  )}
                  <div className="flex items-center gap-1.5" style={{ marginTop: 5 }}>
                    <span
                      style={{
                        width: 7, height: 7, borderRadius: "50%",
                        background: c.open ? "var(--accent-matcha)" : "var(--text-placeholder)",
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: 11, fontWeight: 600, color: c.open ? "var(--accent-matcha)" : "var(--text-secondary)" }}>
                      {c.open ? t("営業中", "Open Now") : t("閉院中", "Closed")}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSaved((s) => ({ ...s, [i]: !s[i] }))}
                  aria-label="save"
                  className="flex items-center justify-center"
                  style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--bg-page)", flexShrink: 0 }}
                >
                  <Bookmark
                    size={14}
                    style={{ color: saved[i] ? "var(--accent-sakura)" : "var(--text-placeholder)" }}
                    fill={saved[i] ? "var(--accent-sakura)" : "none"}
                  />
                </button>
              </div>

               {/* Body */}
              <div style={{ padding: "10px 16px 16px" }}>

                {/* Rating row */}
                <div className="flex items-center gap-2" style={{ marginTop: 8, flexWrap: "wrap" }}>
                  <Stars rating={c.rating} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent-yuzu)" }}>{c.rating}</span>
                  <span style={{ fontSize: 11, color: "var(--text-placeholder)" }}>(47)</span>
                  <span style={{ color: "var(--border-card)" }}>·</span>
                  <span className="flex items-center gap-1" style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                    <MapPin size={10} style={{ color: "var(--accent-sakura)" }} /> {c.km}km
                  </span>
                  <span style={{ color: "var(--border-card)" }}>·</span>
                  <span className="flex items-center gap-1" style={{ fontSize: 11, color: "var(--text-secondary)" }}>
                     {Math.round(c.km * 12)}{t("分", " min")}
                  </span>
                  <span
                    style={{
                      fontSize: 10, fontWeight: 700,
                      padding: "2px 8px", borderRadius: 20,
                      background: "var(--acc-pale)", color: "var(--accent-fuji)",
                    }}
                  >
                    {t(TYPE_LABEL[i % TYPE_LABEL.length].split(" / ")[0], TYPE_LABEL[i % TYPE_LABEL.length].split(" / ")[1])}
                  </span>
                </div>

                {/* Specialty tags */}
                <div className="flex flex-wrap gap-1.5" style={{ marginTop: 8 }}>
                  {SPECIALTIES.slice(0, 3 + (i % 2)).map((s) => (
                    <span
                      key={s.en}
                      style={{
                        background: "var(--bg-page)",
                        border: "1px solid var(--border-card)",
                        color: "var(--text-secondary)",
                        borderRadius: 20,
                        padding: "2px 8px",
                        fontSize: 10,
                      }}
                    >
                      {t(s.jp, s.en)}
                    </span>
                  ))}
                  <span
                    style={{
                      background: "var(--acc-pale)",
                      color: "var(--accent-matcha)",
                      borderRadius: 20,
                      padding: "2px 8px",
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  >
                    {t("保険対応", "Insurance OK")}
                  </span>
                </div>

                {/* Hours */}
                <div className="flex items-center gap-1" style={{ marginTop: 8, fontSize: 11, color: "var(--text-secondary)" }}>
                  <Clock size={11} />
                  {t("月-金 9:00-18:00", "Mon–Fri 9–6pm")}
                </div>

                {/* Actions — big solid CTA + outlined secondary */}
                <div className="flex gap-2" style={{ marginTop: 14 }}>
                  <button
                    onClick={() => openMaps(c.en)}
                    className="flex items-center justify-center gap-1.5"
                    style={{
                      flex: "1 1 auto", height: 46, borderRadius: 14,
                      background: "linear-gradient(135deg, var(--accent-sakura), var(--accent-sakura-dark))",
                      color: "#fff", fontSize: 14, fontWeight: 700,
                      boxShadow: "0 6px 16px color-mix(in oklab, var(--accent-sakura) 35%, transparent)",
                    }}
                  >
                    <Navigation size={15} /> {t("道案内", "Get Directions")}
                  </button>
                  <a
                    href="tel:+81000000000"
                    className="flex items-center justify-center gap-1.5"
                    style={{
                      flex: "0 0 96px", height: 46, borderRadius: 14,
                      background: "#FFFFFF", border: "1.5px solid var(--accent-sakura)",
                      color: "var(--accent-sakura)", fontSize: 14, fontWeight: 700,
                    }}
                  >
                    <Phone size={15} /> {t("電話", "Call")}
                  </a>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ padding: "24px 16px", textAlign: "center", fontSize: 13, color: "var(--text-secondary)" }}>
            No clinics match these filters.
          </div>
        )}
        {visible < filtered.length && (
          <div className="flex justify-center" style={{ padding: "8px 16px 16px" }}>
            <button
              onClick={() => setVisible((v) => v + 3)}
              className="flex items-center gap-2 active:scale-95 transition-transform"
              style={{
                background: "#FFFFFF",
                border: "1.5px solid var(--accent-sakura)",
                color: "var(--accent-sakura)",
                borderRadius: 20,
                padding: "10px 24px",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
               {t("もっと見る", "Load More")} · {filtered.length - visible}
            </button>
          </div>
        )}
      </div>

      {/* ── Filter bottom sheet ────────────────────────────── */}
      {filter && (
        <div className="fixed inset-0 z-[120] flex items-end" style={{ background: "rgba(0,0,0,0.5)" }} onClick={() => setFilter(false)}>
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="w-full max-w-md mx-auto"
            style={{ background: "var(--bg-page)", maxHeight: "85vh", overflowY: "auto", borderRadius: "28px 28px 0 0", padding: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ width: 48, height: 5, borderRadius: 999, background: "var(--border-card)", margin: "0 auto 16px" }} />
            <div className="flex items-center justify-between">
              <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)" }}>
                {t("絞り込み", "Filter")}
              </div>
              <button
                onClick={() => { setMinStars(0); setDistance(5); setOpenOnly(false); setEmOnly(false); setSpecSel({}); }}
                style={{ fontSize: 13, fontWeight: 700, color: "var(--accent-sakura)" }}
              >
                {t("リセット", "Reset")}
              </button>
            </div>

            {/* Distance */}
            <div style={{ marginTop: 20 }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{t("距離", "Distance")}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent-sakura)", background: "var(--accent-sakura-soft)", padding: "2px 10px", borderRadius: 20 }}>{distance}km</span>
              </div>
              <input
                type="range" min={1} max={10} step={1}
                value={distance}
                onChange={(e) => setDistance(parseInt(e.target.value))}
                className="w-full"
                style={{ accentColor: "var(--accent-sakura)" }}
              />
              <div className="flex justify-between" style={{ fontSize: 10, color: "var(--text-placeholder)", marginTop: 2 }}>
                <span>1km</span><span>3km</span><span>5km</span><span>10km</span>
              </div>
            </div>

            {/* Rating */}
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>{t("評価", "Rating")}</div>
              <div className="flex gap-2">
                {[5, 4, 3].map((n) => {
                  const sel = minStars === n;
                  return (
                    <button
                      key={n}
                      onClick={() => setMinStars(n)}
                      className="flex items-center gap-1 flex-1 justify-center"
                      style={{
                        background: sel ? "var(--acc-pale)" : "#fff",
                        border: `1.5px solid ${sel ? "var(--accent-yuzu)" : "var(--border-card)"}`,
                        borderRadius: 12, padding: "10px 0",
                        fontSize: 12, fontWeight: 700,
                        color: sel ? "var(--accent-yuzu)" : "var(--text-secondary)",
                      }}
                    >
                      <Star size={12} fill={sel ? "var(--accent-yuzu)" : "none"} /> {n}.0+
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Toggles */}
            <div style={{ marginTop: 20 }} className="space-y-3">
              {[
                { label: t("営業中のみ", "Open Now Only"), val: openOnly, set: setOpenOnly, color: "var(--accent-sakura)" },
                { label: t("24時間対応", "24H Emergency Only"), val: emOnly, set: setEmOnly, color: "#E53935" },
              ].map((tg) => (
                <label key={tg.label} className="flex items-center justify-between" style={{ background: "#fff", borderRadius: 14, padding: "12px 14px", border: "1px solid var(--border-card)" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{tg.label}</span>
                  <button
                    type="button"
                    onClick={() => tg.set(!tg.val)}
                    className="relative"
                    style={{
                      width: 44, height: 24, borderRadius: 999,
                      background: tg.val ? tg.color : "var(--border-card)",
                      transition: "background 0.18s",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute", top: 2, left: tg.val ? 22 : 2,
                        width: 20, height: 20, borderRadius: "50%",
                        background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                        transition: "left 0.18s",
                      }}
                    />
                  </button>
                </label>
              ))}
            </div>

            {/* Specialization */}
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>{t("専門分野", "Specialization")}</div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { jp: "歯科", en: "Dental" },
                  { jp: "外科", en: "Surgery" },
                  { jp: "皮膚科", en: "Derm" },
                  { jp: "内科", en: "Internal" },
                  { jp: "眼科", en: "Eye" },
                  { jp: "整形", en: "Ortho" },
                ].map((s) => {
                  const sel = specSel[s.en];
                  return (
                    <button
                      key={s.en}
                      onClick={() => setSpecSel((x) => ({ ...x, [s.en]: !x[s.en] }))}
                      style={{
                        background: sel ? "var(--accent-sakura-soft)" : "#fff",
                        border: `1.5px solid ${sel ? "var(--accent-sakura)" : "var(--border-card)"}`,
                        color: sel ? "var(--accent-sakura)" : "var(--text-secondary)",
                        fontWeight: 700, fontSize: 12,
                        borderRadius: 12, padding: "10px 0",
                      }}
                    >
                      {t(s.jp, s.en)}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => {
                setApplied({ minStars, distance, openOnly, emOnly });
                setVisible(3);
                setFilter(false);
                toast.success(t("フィルターを適用しました", "Filters applied"));
              }}
              className="w-full flex items-center justify-center gap-2"
              style={{
                marginTop: 24, marginBottom: 8,
                background: "linear-gradient(135deg,var(--accent-sakura),var(--accent-sakura-dark))",
                color: "#fff", borderRadius: 16,
                padding: "14px 0", fontSize: 14, fontWeight: 800,
                boxShadow: "0 6px 16px color-mix(in srgb, var(--accent-sakura) calc(0.35 * 100%), transparent)",
              }}
            >
              {t("適用する", "Apply Filters")} · {CLINICS.filter((c) => c.rating >= minStars && c.km <= distance && (!openOnly || c.open) && (!emOnly || c.em)).length}{t("件", " results")}
            </button>
            <button onClick={() => setFilter(false)} className="w-full flex items-center justify-center gap-1" style={{ fontSize: 12, color: "var(--text-secondary)", padding: "8px 0" }}>
              <X size={12} /> {t("キャンセル", "Cancel")}
            </button>
          </motion.div>
        </div>
      )}
    </AppShell>
  );
}
