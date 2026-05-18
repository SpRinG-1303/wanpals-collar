import { createFileRoute } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { useMemo, useState, useEffect, type ComponentType, type CSSProperties, type ReactNode } from "react";
import Fuse, { type FuseResultMatch } from "fuse.js";
import {
  Search, SlidersHorizontal, BookOpen, ArrowRight, ArrowLeft, X,
  AlertTriangle, MessageCircle, Dog, Sparkles, Heart, Wind, Sun, Minus, Zap, Crown, Shuffle,
  type LucideProps,
} from "lucide-react";
import { useT, useLanguage, T } from "@/context/LanguageContext";
import { POSTS } from "@/lib/mock";

export const Route = createFileRoute("/breeds")({ component: Breeds });

type SizeKey = "toy" | "small" | "medium" | "large" | "various";
type Breed = {
  jp: string;
  en: string;
  rank: number | null;
  size: SizeKey;
  sizeJp: string;
  sizeEn: string;
  originJp: string;
  originEn: string;
  flag: string;
  // Banner styling
  bannerBg: string;        // CSS background for top banner
  rankBg: string;          // popularity pill colour
  sizeBg: string;          // size pill background
  sizeText: string;        // size pill text colour
  kanji: string;           // big faded character(s) in banner
  kanjiSize: number;       // px
  kanjiColor: string;      // rgba(...)
  Icon: ComponentType<LucideProps>;
  iconColor: string;
  animateGradient?: boolean;
  image?: string;          // real breed photo (Unsplash)
  // Detail extras
  stats: { energy: number; friendly: number; train: number; groom: number };
  health: { jp: string; en: string; level: "watch" | "concern" }[];
};

const BREEDS: Breed[] = [
  {
    jp: "柴犬", en: "Shiba Inu", rank: 1, size: "small", sizeJp: "小型", sizeEn: "Small",
    originJp: "日本", originEn: "Japan", flag: "",
    image: "https://images.unsplash.com/photo-1579213838429-c981f6f52bdf?w=400&q=80&auto=format&fit=crop",
    bannerBg: "linear-gradient(135deg, #FF9966, #FF6B35)",
    rankBg: "#CC4400", sizeBg: "#FFF0DC", sizeText: "#CC5500",
    kanji: "柴", kanjiSize: 64, kanjiColor: "rgba(255,255,255,0.25)",
    Icon: Dog, iconColor: "rgba(255,255,255,0.65)",
    stats: { energy: 80, friendly: 70, train: 75, groom: 60 },
    health: [{ jp: "膝蓋骨脱臼", en: "Patellar Luxation", level: "watch" }, { jp: "アレルギー", en: "Allergies", level: "watch" }],
  },
  {
    jp: "トイプードル", en: "Toy Poodle", rank: 2, size: "toy", sizeJp: "超小型", sizeEn: "Toy",
    originJp: "フランス", originEn: "France", flag: "",
    image: "https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?w=400&q=80&auto=format&fit=crop",
    bannerBg: "linear-gradient(135deg, #9B72CF, #7B52AF)",
    rankBg: "#6B3AAF", sizeBg: "#F5F0FF", sizeText: "#7B52AF",
    kanji: "プー", kanjiSize: 44, kanjiColor: "rgba(255,255,255,0.22)",
    Icon: Sparkles, iconColor: "rgba(255,255,255,0.65)",
    stats: { energy: 70, friendly: 90, train: 95, groom: 80 },
    health: [{ jp: "外耳炎", en: "Ear Infections", level: "watch" }],
  },
  {
    jp: "チワワ", en: "Chihuahua", rank: 3, size: "toy", sizeJp: "超小型", sizeEn: "Tiny",
    originJp: "メキシコ", originEn: "Mexico", flag: "",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80&auto=format&fit=crop",
    bannerBg: "linear-gradient(135deg, #F6D365, #FDA085)",
    rankBg: "#E8820A", sizeBg: "#FFF8DC", sizeText: "#D4920A",
    kanji: "チ", kanjiSize: 64, kanjiColor: "rgba(255,255,255,0.28)",
    Icon: Heart, iconColor: "rgba(255,255,255,0.65)",
    stats: { energy: 60, friendly: 60, train: 55, groom: 40 },
    health: [{ jp: "気管虚脱", en: "Tracheal Collapse", level: "concern" }],
  },
  {
    jp: "ポメラニアン", en: "Pomeranian", rank: 4, size: "small", sizeJp: "小型", sizeEn: "Small",
    originJp: "ドイツ", originEn: "Germany", flag: "",
    image: "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=400&q=80&auto=format&fit=crop",
    bannerBg: "linear-gradient(135deg, #FFECD2, #FCB69F)",
    rankBg: "#C47040", sizeBg: "#FFF4EC", sizeText: "#C47040",
    kanji: "ポメ", kanjiSize: 42, kanjiColor: "rgba(180,90,40,0.22)",
    Icon: Wind, iconColor: "rgba(180,90,40,0.45)",
    stats: { energy: 75, friendly: 75, train: 65, groom: 85 },
    health: [{ jp: "気管虚脱", en: "Tracheal Collapse", level: "watch" }],
  },
  {
    jp: "ゴールデンレトリバー", en: "Golden Retriever", rank: 5, size: "large", sizeJp: "大型", sizeEn: "Large",
    originJp: "イギリス", originEn: "UK", flag: "",
    image: "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400&q=80&auto=format&fit=crop",
    bannerBg: "linear-gradient(135deg, #F7971E, #FFD200)",
    rankBg: "#C48A00", sizeBg: "#FFF8DC", sizeText: "#C48A00",
    kanji: "金", kanjiSize: 64, kanjiColor: "rgba(255,255,255,0.25)",
    Icon: Sun, iconColor: "rgba(255,255,255,0.55)",
    stats: { energy: 90, friendly: 95, train: 90, groom: 70 },
    health: [{ jp: "股関節形成不全", en: "Hip Dysplasia", level: "concern" }, { jp: "熱中症", en: "Heat Stroke", level: "concern" }],
  },
  {
    jp: "ミニチュアダックス", en: "Mini Dachshund", rank: 6, size: "small", sizeJp: "小型", sizeEn: "Small",
    originJp: "ドイツ", originEn: "Germany", flag: "",
    image: "https://images.unsplash.com/photo-1612195583950-b8fd34c87093?w=400&q=80&auto=format&fit=crop",
    bannerBg: "linear-gradient(135deg, #C4714E, #A0522D)",
    rankBg: "#7A3A1E", sizeBg: "#FFF0DC", sizeText: "#A0522D",
    kanji: "ダックス", kanjiSize: 32, kanjiColor: "rgba(255,255,255,0.22)",
    Icon: Minus, iconColor: "rgba(255,255,255,0.55)",
    stats: { energy: 70, friendly: 75, train: 60, groom: 50 },
    health: [{ jp: "椎間板ヘルニア", en: "IVDD (Back Issues)", level: "concern" }],
  },
  {
    jp: "フレンチブルドッグ", en: "French Bulldog", rank: 7, size: "small", sizeJp: "小型", sizeEn: "Small",
    originJp: "フランス", originEn: "France", flag: "",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&q=80&auto=format&fit=crop",
    bannerBg: "linear-gradient(135deg, #4FACFE, #00F2FE)",
    rankBg: "#0080CC", sizeBg: "#E8F4FF", sizeText: "#0080CC",
    kanji: "フレブル", kanjiSize: 32, kanjiColor: "rgba(255,255,255,0.22)",
    Icon: Zap, iconColor: "rgba(255,255,255,0.55)",
    stats: { energy: 55, friendly: 85, train: 65, groom: 50 },
    health: [{ jp: "短頭種症候群", en: "Brachycephalic Syndrome", level: "concern" }],
  },
  {
    jp: "ヨークシャテリア", en: "Yorkshire Terrier", rank: 8, size: "toy", sizeJp: "超小型", sizeEn: "Tiny",
    originJp: "イギリス", originEn: "UK", flag: "",
    image: "https://images.unsplash.com/photo-1516148806338-702cf5f65c41?w=400&q=80&auto=format&fit=crop",
    bannerBg: "linear-gradient(135deg, #A18CD1, #FBC2EB)",
    rankBg: "#7B52AF", sizeBg: "#F8F0FF", sizeText: "#7B52AF",
    kanji: "ヨーキー", kanjiSize: 32, kanjiColor: "rgba(255,255,255,0.24)",
    Icon: Crown, iconColor: "rgba(255,255,255,0.55)",
    stats: { energy: 70, friendly: 70, train: 75, groom: 90 },
    health: [{ jp: "歯周病", en: "Dental Issues", level: "watch" }],
  },
  {
    jp: "ミックス犬", en: "Mixed Breed", rank: null, size: "various", sizeJp: "様々", sizeEn: "Various",
    originJp: "世界", originEn: "Global", flag: "",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&q=80&auto=format&fit=crop",
    bannerBg: "linear-gradient(135deg, #FF9966, #9B72CF, #4FACFE, #F7971E)",
    rankBg: "#6BAF92", sizeBg: "linear-gradient(135deg,#FFE4D0,#E8D6FF,#D6EEFF,#FFF4CC)", sizeText: "#7B52AF",
    kanji: "∞", kanjiSize: 56, kanjiColor: "rgba(255,255,255,0.4)",
    Icon: Shuffle, iconColor: "rgba(255,255,255,0.55)",
    animateGradient: true,
    stats: { energy: 75, friendly: 85, train: 75, groom: 60 },
    health: [{ jp: "個体差あり", en: "Varies by mix", level: "watch" }],
  },
];

/* ─────────────────────────────────────── Breed Image (with fallback) ─────────────────────────────────────── */

function BreedImage({
  breed, style, children, overlay = "linear-gradient(to bottom, rgba(0,0,0,0.10), rgba(0,0,0,0.45))",
}: { breed: Breed; style?: CSSProperties; children?: ReactNode; overlay?: string | false }) {
  const [failed, setFailed] = useState(false);
  const showImage = !!breed.image && !failed;
  return (
    <div style={{ position: "absolute", inset: 0, ...style }}>
      {/* Fallback layer: gradient + kanji (always present underneath) */}
      <div style={{
        position: "absolute", inset: 0,
        background: breed.bannerBg,
        backgroundSize: breed.animateGradient ? "300% 300%" : undefined,
        animation: breed.animateGradient ? "breedGradientShift 6s ease infinite" : undefined,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: breed.kanjiSize, fontWeight: 900, color: breed.kanjiColor,
        letterSpacing: "-0.02em", lineHeight: 1, userSelect: "none",
      }}>
        {!showImage && breed.kanji}
      </div>
      {showImage && (
        <img
          src={breed.image}
          alt={breed.en}
          loading="lazy"
          onError={() => setFailed(true)}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      )}
      {showImage && overlay && (
        <div style={{ position: "absolute", inset: 0, background: overlay, pointerEvents: "none" }} />
      )}
      {children}
    </div>
  );
}

/* ─────────────────────────────────────── Filter Chips ─────────────────────────────────────── */

type FilterKey = "all" | "toy" | "small" | "large" | "various" | "popular";
const FILTERS: { key: FilterKey; jp: string; en: string }[] = [
  { key: "all", jp: "すべて", en: "All" },
  { key: "toy", jp: "超小型", en: "Toy" },
  { key: "small", jp: "小型", en: "Small" },
  { key: "large", jp: "大型", en: "Large" },
  { key: "various", jp: "ミックス", en: "Mixed" },
  { key: "popular", jp: "人気順", en: "Popular" },
];

/* ─────────────────────────────────────── Page ─────────────────────────────────────── */

function Breeds() {
  const t = useT();
  const { language } = useLanguage();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [openBreed, setOpenBreed] = useState<Breed | null>(null);
  const [focused, setFocused] = useState(false);

  const filtered = useMemo(() => {
    let list = BREEDS;
    if (filter === "popular") list = [...list].filter((b) => b.rank !== null).sort((a, b) => a.rank! - b.rank!);
    else if (filter !== "all") list = list.filter((b) => b.size === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((b) => b.jp.toLowerCase().includes(q) || b.en.toLowerCase().includes(q));
    }
    return list;
  }, [filter, query]);

  const featured = BREEDS[0];

  return (
    <AppShell noPadding>
      {/* Local keyframes for animated mixed gradient */}
      <style>{`
        @keyframes breedGradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* HERO BANNER */}
      <div style={{
        position: "relative", height: 110, overflow: "hidden",
        background: "linear-gradient(135deg, #FFF0F5 0%, #F5F0FF 50%, #FFF8DC 100%)",
        borderRadius: "0 0 24px 24px",
      }}>
        <div style={{ position: "absolute", left: 20, top: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#E8829A", fontSize: 13, letterSpacing: "0.1em", fontWeight: 600 }}>
            <BookOpen size={14} strokeWidth={2} />
            <span>犬種図鑑</span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#2C2C2C", marginTop: 2, letterSpacing: "-0.01em" }}>
            {t("犬種図鑑", "Breed Encyclopedia")}
          </div>
          <div style={{ fontSize: 12, color: "#8A8A8A", marginTop: 2 }}>
            {t("200以上の犬種", "200+ breeds")}
          </div>
        </div>

        {/* Right: stacked size pills (small/medium/large suggestion) */}
        <div style={{ position: "absolute", right: 22, top: 32, display: "flex", flexDirection: "column", gap: 6, opacity: 0.5 }}>
          <div style={{ width: 20, height: 8, borderRadius: 4, background: "#FFB7C5", alignSelf: "flex-end" }} />
          <div style={{ width: 28, height: 8, borderRadius: 4, background: "#C8C0F0", alignSelf: "flex-end" }} />
          <div style={{ width: 36, height: 8, borderRadius: 4, background: "#A8D0E8", alignSelf: "flex-end" }} />
        </div>
      </div>

      {/* SEARCH BAR */}
      <div style={{ margin: "16px 16px 12px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10, height: 52,
          background: "#FFFFFF", borderRadius: 16, padding: "0 12px 0 16px",
          border: `1.5px solid ${focused ? "#E8829A" : "#EDE8E4"}`,
          boxShadow: focused ? "0 4px 20px rgba(232,130,154,0.18)" : "0 4px 16px rgba(0,0,0,0.06)",
          transition: "all 200ms",
        }}>
          <Search size={18} color="#E8829A" strokeWidth={2} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={t("どんな犬種でも検索", "Search any breed")}
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "#2C2C2C" }}
          />
          <div style={{
            width: 34, height: 34, borderRadius: "50%", background: "#F0ECFF",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <SlidersHorizontal size={16} color="#7B68C8" strokeWidth={2} />
          </div>
        </div>
      </div>

      {/* FILTER CHIPS — text only, no emoji */}
      <div className="scrollbar-hide" style={{ display: "flex", gap: 8, overflowX: "auto", padding: "4px 16px 8px" }}>
        {FILTERS.map((f) => {
          const sel = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                flexShrink: 0,
                height: 34, padding: "0 16px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                background: sel ? "linear-gradient(135deg, #E8829A, #C86882)" : "#FFFFFF",
                border: sel ? "1.5px solid transparent" : "1.5px solid #EDE8E4",
                color: sel ? "#FFFFFF" : "#8A8A8A",
                boxShadow: sel ? "0 4px 12px rgba(232,130,154,0.28)" : "0 2px 6px rgba(0,0,0,0.04)",
                transition: "all 180ms",
                whiteSpace: "nowrap",
              }}
            >
              {t(f.jp, f.en)}
            </button>
          );
        })}
      </div>

      {/* TODAY'S BREED — clean text-based banner */}
      <div style={{ padding: "8px 16px 4px" }}>
        <button
          onClick={() => setOpenBreed(featured)}
          style={{
            position: "relative",
            width: "100%", height: 72,
            borderRadius: 16, overflow: "hidden",
            boxShadow: "0 4px 16px rgba(255,107,53,0.25)",
            textAlign: "left",
            border: "none", padding: 0,
          }}
        >
          <BreedImage breed={featured} overlay="linear-gradient(90deg, rgba(0,0,0,0.55), rgba(0,0,0,0.15))" />
          <div style={{ position: "relative", height: "100%", display: "flex", alignItems: "center", padding: "0 20px", gap: 12 }}>
            <div style={{ flex: 1, color: "white" }}>
              <span style={{
                display: "inline-block",
                background: "#FFFFFF", color: "#FF6B35",
                fontSize: 9, fontWeight: 800, letterSpacing: "0.08em",
                padding: "3px 8px", borderRadius: 10, marginBottom: 4,
              }}>
                {t("今日の犬種", "TODAY'S BREED")}
              </span>
              <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.1, textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>
                {language === "english" ? "Shiba Inu" : language === "japanese" ? "柴犬" : "柴犬 · Shiba Inu"}
              </div>
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 4,
              background: "#FFFFFF", color: "#FF6B35",
              fontSize: 12, fontWeight: 800,
              padding: "6px 14px", borderRadius: 20,
            }}>
              <span>{t("詳しく", "More")}</span>
              <ArrowRight size={12} strokeWidth={2.8} />
            </div>
          </div>
        </button>
      </div>

      {/* GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: "12px 16px 24px" }}>
        {filtered.map((b) => (
          <BreedCard key={b.en} breed={b} onOpen={() => setOpenBreed(b)} language={language} t={t} />
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40, color: "#8A8A8A", fontSize: 13 }}>
            {t("結果が見つかりません", "No breeds found")}
          </div>
        )}
      </div>

      {openBreed && <BreedDetail breed={openBreed} onClose={() => setOpenBreed(null)} />}
    </AppShell>
  );
}

/* ─────────────────────────────────────── Card ─────────────────────────────────────── */

function BreedCard({ breed, onOpen, language, t }: { breed: Breed; onOpen: () => void; language: string; t: (jp: string, en: string) => string }) {
  const Icon = breed.Icon;
  const nameSize = breed.jp.length > 8 ? 11 : breed.jp.length > 6 ? 13 : 15;
  return (
    <button
      onClick={onOpen}
      style={{
        background: "#FFFFFF", borderRadius: 20, overflow: "hidden",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)", textAlign: "left",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* TOP IMAGE BANNER */}
      <div style={{ position: "relative", height: 100, overflow: "hidden" }}>
        <BreedImage breed={breed}>
          {/* Small icon top-left */}
          <Icon
            size={22}
            color="rgba(255,255,255,0.95)"
            strokeWidth={2}
            style={{ position: "absolute", top: 10, left: 10, filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))" }}
          />

          {/* Popularity badge top-right */}
          {breed.rank !== null && (
            <div style={{
              position: "absolute", top: 0, right: 0,
              background: breed.rankBg, color: "white",
              padding: "4px 10px", height: 28,
              fontSize: 11, fontWeight: 800,
              borderRadius: "0 20px 0 12px",
              display: "flex", alignItems: "center",
            }}>
              #{breed.rank}
            </div>
          )}
        </BreedImage>
      </div>

      {/* BOTTOM INFO */}
      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
        <div>
          <div style={{ fontSize: nameSize, fontWeight: 800, color: "#2C2C2C", lineHeight: 1.2 }}>
            {language === "english" ? breed.en : breed.jp}
          </div>
          <div style={{ fontSize: 11, color: "#8A8A8A", marginTop: 2 }}>
            {language === "japanese" ? breed.en : breed.en}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4 }}>
          <span style={{
            background: breed.sizeBg, color: breed.sizeText,
            fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 20,
            whiteSpace: "nowrap",
          }}>
            {t(breed.sizeJp, breed.sizeEn)}
          </span>
          <span style={{ fontSize: 10, color: "#8A8A8A", whiteSpace: "nowrap" }}>
            {breed.flag} {t(breed.originJp, breed.originEn)}
          </span>
        </div>
      </div>
    </button>
  );
}

/* ─────────────────────────────────────── Detail Sheet ─────────────────────────────────────── */

function BreedDetail({ breed, onClose }: { breed: Breed; onClose: () => void }) {
  const t = useT();
  const { language } = useLanguage();
  const [animated, setAnimated] = useState(false);
  const Icon = breed.Icon;

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const bars = [
    { jp: "エネルギー", en: "Energy", v: breed.stats.energy, color: "#E8829A" },
    { jp: "友好性", en: "Friendliness", v: breed.stats.friendly, color: "#6BAF92" },
    { jp: "訓練性", en: "Trainability", v: breed.stats.train, color: "#7B68C8" },
    { jp: "手入れ", en: "Grooming", v: breed.stats.groom, color: "#D4A843" },
  ];

  const relatedPosts = POSTS.slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end" onClick={onClose}>
      <div
        className="w-full max-h-[92vh] overflow-y-auto"
        style={{ background: "#FAFAF8", borderRadius: "24px 24px 0 0" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HERO BANNER */}
        <div style={{
          position: "relative", height: 240, overflow: "hidden",
          borderRadius: "24px 24px 0 0",
        }}>
          <BreedImage
            breed={breed}
            overlay="linear-gradient(to bottom, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.10) 55%, rgba(0,0,0,0.55) 100%)"
          />

          <button onClick={onClose} style={{
            position: "absolute", top: 16, left: 16, width: 36, height: 36,
            borderRadius: "50%", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)", zIndex: 2,
          }}>
            <ArrowLeft size={18} color="#2C2C2C" />
          </button>

          {breed.rank !== null && (
            <div style={{
              position: "absolute", top: 16, right: 16, zIndex: 2,
              background: breed.rankBg, color: "white",
              padding: "6px 12px", fontSize: 12, fontWeight: 800, borderRadius: 14,
              boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            }}>
              #{breed.rank} {t("人気", "Popular")}
            </div>
          )}

          <div className="w-12 h-1.5 rounded-full" style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", background: "rgba(255,255,255,0.55)", zIndex: 2 }} />
        </div>

        {/* NAME */}
        <div style={{ padding: "20px 20px 8px" }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#2C2C2C", letterSpacing: "-0.01em" }}>
            {language === "english" ? breed.en : breed.jp}
          </div>
          {language !== "japanese" && (
            <div style={{ fontSize: 14, color: "#8A8A8A", marginTop: 2 }}>{breed.en}</div>
          )}
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            <span style={{ background: breed.sizeBg, color: breed.sizeText, fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 12 }}>
              {t(breed.sizeJp, breed.sizeEn)}
            </span>
            <span style={{ background: "#FFFFFF", border: "1px solid #EDE8E4", fontSize: 11, fontWeight: 600, color: "#2C2C2C", padding: "5px 10px", borderRadius: 12 }}>
              {breed.flag} {t(breed.originJp, breed.originEn)}
            </span>
          </div>
        </div>

        {/* STATS */}
        <div style={{ padding: "20px", margin: "12px 16px 0", background: "#FFFFFF", borderRadius: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#2C2C2C", marginBottom: 14 }}>
            {t("犬種特性", "Breed Traits")}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {bars.map((b) => (
              <div key={b.en}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: "#2C2C2C", fontWeight: 600 }}>{t(b.jp, b.en)}</span>
                  <span style={{ color: b.color, fontWeight: 700 }}>{b.v}%</span>
                </div>
                <div style={{ height: 8, background: "#F0ECE8", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: animated ? `${b.v}%` : "0%",
                    background: `linear-gradient(90deg, ${b.color}, ${b.color}CC)`,
                    borderRadius: 4, transition: "width 800ms cubic-bezier(0.4,0,0.2,1)",
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HEALTH */}
        <div style={{ padding: "20px", margin: "12px 16px 0", background: "#FFFFFF", borderRadius: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#2C2C2C", marginBottom: 12 }}>
            {t("健康注意事項", "Health Notes")}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {breed.health.map((h, i) => {
              const isConcern = h.level === "concern";
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: 12,
                  background: isConcern ? "#FFEEEC" : "#FFF8E0",
                  border: `1px solid ${isConcern ? "#F5C0BC" : "#F0DCA0"}`,
                }}>
                  <AlertTriangle size={16} color={isConcern ? "#E53935" : "#D4A843"} strokeWidth={2} />
                  <div style={{ fontSize: 12, color: "#2C2C2C", fontWeight: 600 }}>
                    {t(h.jp, h.en)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COMMUNITY */}
        <div style={{ padding: "20px", margin: "12px 16px 24px", background: "#FFFFFF", borderRadius: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#2C2C2C" }}>
              {t("コミュニティ投稿", "Community Posts")}
            </div>
            <a href="/community" style={{ fontSize: 11, color: "#E8829A", fontWeight: 700 }}>
              {t("もっと見る →", "See More →")}
            </a>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {relatedPosts.map((p) => (
              <div key={p.id} style={{ padding: "10px 12px", background: "#FAFAF8", borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: breed.bannerBg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                  fontSize: 11, fontWeight: 900, color: "rgba(255,255,255,0.85)",
                }}>
                  {breed.kanji.slice(0, 1)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#2C2C2C", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    <T jp={p.titleJp} en={p.titleEn} />
                  </div>
                  <div style={{ fontSize: 10, color: "#8A8A8A", marginTop: 2, display: "flex", gap: 8 }}>
                    <span>{p.user}</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                      <MessageCircle size={10} /> {p.com}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
