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
  ChevronLeft,
  Clock,
  CornerUpRight,
  Flag,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
          size={11}
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
  const [dirFor, setDirFor] = useState<(typeof CLINICS)[number] | null>(null);

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

  return (
    <AppShell noPadding>

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
          <Search size={17} strokeWidth={2} style={{ color: "var(--text-placeholder)", flexShrink: 0 }} />
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
            width: 52, height: 52, borderRadius: 15, flexShrink: 0,
            background: "var(--accent-sakura)",
            boxShadow: "0 4px 12px color-mix(in oklab, var(--accent-sakura) 30%, transparent)",
            color: "#FFFFFF",
          }}
          aria-label={t("絞り込み", "Filters")}
        >
          <SlidersHorizontal size={18} strokeWidth={2.2} />
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
                padding: "0 14px",
                height: 38,
                gap: 6,
                boxShadow: sel ? "0 4px 12px color-mix(in oklab, var(--accent-sakura) 28%, transparent)" : "none",
                transition: "all 0.18s ease",
              }}
            >
              <Icon size={12} style={{ color: sel ? "#FFFFFF" : "var(--text-placeholder)" }} fill={sel && c.en === "Top Rated" ? "#FFFFFF" : "none"} />
              {t(c.jp, c.en)}
            </button>
          );
        })}
      </div>

      {/* ── Emergency card ─────────────────────────────────── */}
      <SectionLabel jp="緊急対応" en="Emergency" />
      <div
        className="flex items-center justify-between"
        style={{
          margin: "0 20px",
          background: "linear-gradient(135deg,#F25449,#E53935)",
          borderRadius: 20,
          padding: "16px 20px",
          color: "#fff",
          boxShadow: "0 6px 18px rgba(229,57,53,0.25)",
          gap: 12,
        }}
      >
        <div className="min-w-0">
          <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.85)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            {t("緊急の場合", "In Emergency")}
          </div>
          <div style={{ fontSize: 17, fontWeight: 800, lineHeight: 1.25, marginTop: 2 }}>
            {t("最寄りの24時間病院", "Nearest 24H Hospital")}
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.9)", marginTop: 4 }}>
            {language === "english" ? emergencyClinic.en : emergencyClinic.jp} · {emergencyClinic.km}km · ★ {emergencyClinic.rating}
          </div>
        </div>
        <a
          href="tel:+919820001234"
          className="flex items-center gap-1.5 shrink-0"
          style={{
            background: "#fff", color: "#E53935",
            borderRadius: 999, padding: "10px 18px",
            fontSize: 13, fontWeight: 800,
            boxShadow: "0 4px 10px rgba(0,0,0,0.18)",
          }}
        >
          <Phone size={12} />
          {t("電話", "Call")}
        </a>
      </div>

      {/* ── Video consultation ─────────────────────────────── */}
      <button
        onClick={bookVideoConsult}
        className="w-full text-left flex items-center gap-3 active:scale-[0.98] transition-transform"
        style={{
          margin: "16px 20px 0",
          width: "calc(100% - 32px)",
          background: "#FFFFFF",
          boxShadow: CARD_SHADOW,
          borderRadius: 20,
          padding: "14px 16px",
        }}
      >
        <div
          className="shrink-0 flex items-center justify-center"
          style={{ width: 50, height: 50, borderRadius: "50%", background: "var(--bg-card-lavender)" }}
        >
          <Video size={22} style={{ color: "var(--accent-fuji)" }} />
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
          style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--accent-sakura)", color: "#fff" }}
        >
          <ChevronRight size={16} />
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
                margin: "0 20px 12px",
                boxShadow: CARD_SHADOW,
                overflow: "hidden",
              }}
            >
              {/* Header — profile row: icon + name + bookmark */}
              <div className="flex items-start" style={{ padding: "16px 16px 0", gap: 12 }}>
                  <div
                    className="flex items-center justify-center"
                    style={{ width: 46, height: 46, borderRadius: "50%", background: th.soft, flexShrink: 0 }}
                  >
                    <HeartPulse size={20} style={{ color: th.accent }} />
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
                  style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--bg-page)", flexShrink: 0 }}
                >
                  <Bookmark
                    size={12}
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
                  <Clock size={10} />
                  {t("月-金 9:00-18:00", "Mon–Fri 9–6pm")}
                </div>

                {/* Actions — big solid CTA + outlined secondary */}
                <div className="flex gap-2" style={{ marginTop: 14 }}>
                  <button
                    onClick={() => setDirFor(c)}
                    className="flex items-center justify-center gap-1.5"
                    style={{
                      flex: "1 1 auto", height: 42, borderRadius: 13,
                      background: "linear-gradient(135deg, var(--accent-sakura), var(--accent-sakura-dark))",
                      color: "#fff", fontSize: 13, fontWeight: 700,
                      boxShadow: "0 6px 16px color-mix(in oklab, var(--accent-sakura) 35%, transparent)",
                    }}
                  >
                    <Navigation size={13} /> {t("道案内", "Get Directions")}
                  </button>
                  <a
                    href="tel:+919820001234"
                    className="flex items-center justify-center gap-1.5"
                    style={{
                      flex: "0 0 92px", height: 42, borderRadius: 13,
                      background: "#FFFFFF", border: "1.5px solid var(--accent-sakura)",
                      color: "var(--accent-sakura)", fontSize: 13, fontWeight: 700,
                    }}
                  >
                    <Phone size={13} /> {t("電話", "Call")}
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

      {/* ── In-app directions with animated route ──────────── */}
      <AnimatePresence>
        {dirFor && <DirectionsView clinic={dirFor} onClose={() => setDirFor(null)} />}
      </AnimatePresence>
    </AppShell>
  );
}

/* ── Directions view — plays the route out to the clinic ────── */
function DirectionsView({ clinic, onClose }: { clinic: (typeof CLINICS)[number]; onClose: () => void }) {
  const [playKey, setPlayKey] = useState(0);
  const mins = Math.max(4, Math.round(clinic.km * 12));
  const routeD = "M 46 252 C 110 246, 128 196, 176 176 S 268 116, 336 58";

  const steps = [
    { icon: <Navigation size={13} />, text: "Head north on Linking Rd", dist: "400 m" },
    { icon: <CornerUpRight size={13} />, text: "Turn right onto Waterfield Rd", dist: `${(clinic.km * 0.6).toFixed(1)} km` },
    { icon: <Flag size={13} />, text: `Arrive at ${clinic.en}`, dist: `${(clinic.km * 0.3).toFixed(1)} km` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-[130] flex justify-center"
      style={{ background: "var(--bg-page)" }}
    >
      <div className="w-full max-w-md flex flex-col" style={{ height: "100%" }}>
        {/* Header */}
        <div className="flex items-center gap-3" style={{ padding: "14px 16px 10px" }}>
          <button
            onClick={onClose}
            aria-label="Back"
            className="flex items-center justify-center shrink-0"
            style={{ width: 34, height: 34, borderRadius: "50%", background: "#FFFFFF", boxShadow: CARD_SHADOW }}
          >
            <ChevronLeft size={17} style={{ color: "var(--text-primary)" }} />
          </button>
          <div className="min-w-0">
            <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)", fontFamily: "Fraunces, serif" }}>Directions</div>
            <div style={{ fontSize: 11, color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              to {clinic.en}
            </div>
          </div>
          <span
            className="shrink-0"
            style={{ marginLeft: "auto", background: "var(--accent-sakura-soft)", color: "var(--accent-sakura-dark)", fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 999 }}
          >
            {mins} min
          </span>
        </div>

        {/* Map with animated route */}
        <div style={{ margin: "4px 16px 0", borderRadius: 22, overflow: "hidden", boxShadow: CARD_SHADOW, position: "relative", background: "#F3F0FA" }}>
          <svg key={playKey} viewBox="0 0 390 280" style={{ width: "100%", display: "block" }}>
            {/* streets */}
            <g stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round">
              <path d="M -10 90 H 400" />
              <path d="M -10 190 H 400" />
              <path d="M 90 -10 V 290" />
              <path d="M 230 -10 V 290" />
              <path d="M 320 -10 V 290" />
              <path d="M -10 140 C 120 130, 260 160, 400 120" />
            </g>
            <g stroke="#E7E1F4" strokeWidth="2">
              <path d="M -10 40 H 400" />
              <path d="M -10 240 H 400" />
              <path d="M 160 -10 V 290" />
              <path d="M 280 -10 V 290" />
            </g>
            {/* park blocks */}
            <rect x="108" y="106" width="52" height="30" rx="8" fill="#DFF0E4" />
            <rect x="248" y="206" width="56" height="34" rx="8" fill="#DFF0E4" />

            {/* route glow + draw-on animation */}
            <path d={routeD} fill="none" stroke="var(--accent-sakura)" strokeWidth="10" strokeLinecap="round" opacity="0.18" />
            <motion.path
              d={routeD}
              fill="none"
              stroke="var(--accent-sakura)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="1 0"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.2, ease: "easeInOut" }}
            />
            {/* moving dot along the route */}
            <circle r="7" fill="#FFFFFF" stroke="var(--accent-sakura-dark)" strokeWidth="4">
              <animateMotion dur="4.5s" repeatCount="indefinite" path={routeD} />
            </circle>

            {/* origin pin (you) */}
            <circle cx="46" cy="252" r="9" fill="var(--accent-sora)" stroke="#fff" strokeWidth="3" />
            {/* destination pin (clinic) */}
            <g>
              <circle cx="336" cy="58" r="12" fill="var(--accent-sakura)" stroke="#fff" strokeWidth="3" />
              <circle cx="336" cy="58" r="4" fill="#fff" />
            </g>
          </svg>

          {/* ETA card */}
          <div
            className="flex items-center justify-between"
            style={{
              position: "absolute", left: 12, right: 12, bottom: 12,
              background: "rgba(255,255,255,0.94)", backdropFilter: "blur(8px)",
              borderRadius: 16, padding: "10px 14px",
              boxShadow: "0 6px 18px rgba(0,0,0,0.10)",
            }}
          >
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>{mins} min · {clinic.km} km</div>
              <div style={{ fontSize: 10, color: "var(--text-secondary)", marginTop: 1 }}>Fastest route · light traffic</div>
            </div>
            <span className="flex items-center gap-1" style={{ fontSize: 10, fontWeight: 700, color: clinic.open ? "var(--accent-matcha)" : "#E53935" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }} />
              {clinic.open ? "Open now" : "Closed"}
            </span>
          </div>
        </div>

        {/* Turn-by-turn steps */}
        <div style={{ margin: "14px 16px 0", background: "#FFFFFF", borderRadius: 20, boxShadow: CARD_SHADOW, padding: "6px 14px" }}>
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-3" style={{ padding: "11px 0", borderBottom: i < steps.length - 1 ? "1px solid var(--bg-elevated)" : "none" }}>
              <span className="flex items-center justify-center shrink-0" style={{ width: 30, height: 30, borderRadius: "50%", background: i === steps.length - 1 ? "var(--accent-sakura-soft)" : "var(--bg-page)", color: i === steps.length - 1 ? "var(--accent-sakura-dark)" : "var(--text-secondary)" }}>
                {s.icon}
              </span>
              <span className="flex-1 min-w-0" style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.text}</span>
              <span style={{ fontSize: 11, color: "var(--text-placeholder)", flexShrink: 0 }}>{s.dist}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2" style={{ margin: "14px 16px 20px" }}>
          <button
            onClick={() => {
              setPlayKey((k) => k + 1);
              toast.success("Navigation started", { description: `Guiding you to ${clinic.en} · ${mins} min away`, duration: 2500 });
            }}
            className="flex items-center justify-center gap-1.5 active:scale-[0.97] transition-transform"
            style={{
              flex: 1, height: 44, borderRadius: 14,
              background: "linear-gradient(135deg, var(--accent-sakura), var(--accent-sakura-dark))",
              color: "#fff", fontSize: 13, fontWeight: 700,
              boxShadow: "0 6px 16px color-mix(in oklab, var(--accent-sakura) 35%, transparent)",
            }}
          >
            <Navigation size={13} /> Start Navigation
          </button>
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                window.open(`https://maps.google.com/?q=${encodeURIComponent(clinic.en)}`, "_blank");
              }
            }}
            style={{ height: 44, padding: "0 16px", borderRadius: 14, background: "#FFFFFF", border: "1.5px solid var(--border-card)", color: "var(--text-secondary)", fontSize: 12, fontWeight: 700 }}
          >
            Google Maps
          </button>
        </div>
      </div>
    </motion.div>
  );
}
