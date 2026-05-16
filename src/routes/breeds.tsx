import { createFileRoute } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { useMemo, useState, useEffect, type CSSProperties, type ReactNode } from "react";
import { Search, SlidersHorizontal, BookOpen, ArrowRight, ArrowLeft, AlertTriangle, MessageCircle } from "lucide-react";
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
  traits: { icon: string; jp: string; en: string }[];
  gradient: string;
  accent: string;
  rankBg: string;
  sizeBg: string;
  sizeText: string;
  stats: { energy: number; friendly: number; train: number; groom: number };
  health: { jp: string; en: string; level: "watch" | "concern" }[];
  Illustration: () => ReactNode;
};

/* ─────────────────────────────────────── Illustrations ─────────────────────────────────────── */

const dot = (size: number, color: string, style: CSSProperties = {}): CSSProperties => ({
  position: "absolute",
  width: size,
  height: size,
  borderRadius: "50%",
  background: color,
  ...style,
});

function Stage({ children, scale = 1 }: { children: ReactNode; scale?: number }) {
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative", width: 120, height: 100, transform: `scale(${scale})` }}>{children}</div>
    </div>
  );
}

const ShibaArt = () => (
  <Stage>
    {/* ears */}
    <div style={{ position: "absolute", left: 20, top: 8, width: 0, height: 0, borderLeft: "12px solid transparent", borderRight: "12px solid transparent", borderBottom: "20px solid #D4714E", transform: "rotate(-15deg)" }} />
    <div style={{ position: "absolute", right: 20, top: 8, width: 0, height: 0, borderLeft: "12px solid transparent", borderRight: "12px solid transparent", borderBottom: "20px solid #D4714E", transform: "rotate(15deg)" }} />
    {/* face */}
    <div style={dot(60, "#E8956D", { left: 30, top: 22 })} />
    <div style={dot(7, "#2C2C2C", { left: 46, top: 44 })} />
    <div style={dot(7, "#2C2C2C", { left: 67, top: 44 })} />
    <div style={{ position: "absolute", left: 55, top: 60, width: 10, height: 7, borderRadius: "50%", background: "#2C2C2C" }} />
  </Stage>
);

const PoodleArt = () => (
  <Stage>
    {/* fluffy outer */}
    {[
      [22, 28], [82, 28], [18, 58], [86, 58], [30, 18], [70, 18], [30, 78], [70, 78],
    ].map(([l, t], i) => (
      <div key={i} style={dot(16, "#C8B8E8", { left: l, top: t })} />
    ))}
    {/* ears */}
    <div style={dot(20, "#B8A8D8", { left: 10, top: 48 })} />
    <div style={dot(20, "#B8A8D8", { left: 90, top: 48 })} />
    {/* head */}
    <div style={dot(55, "#C8B8E8", { left: 32, top: 24 })} />
    <div style={dot(5, "#2C2C2C", { left: 48, top: 46 })} />
    <div style={dot(5, "#2C2C2C", { left: 67, top: 46 })} />
    <div style={{ position: "absolute", left: 54, top: 60, width: 12, height: 6, borderBottom: "2px solid #2C2C2C", borderRadius: "0 0 50% 50%" }} />
  </Stage>
);

const ChihuahuaArt = () => (
  <Stage>
    {/* big ears */}
    <div style={dot(26, "#C4986A", { left: 12, top: 14 })} />
    <div style={dot(26, "#C4986A", { left: 82, top: 14 })} />
    {/* head */}
    <div style={dot(52, "#D4A87A", { left: 34, top: 26 })} />
    {/* big eyes */}
    <div style={dot(10, "#2C2C2C", { left: 46, top: 46 })} />
    <div style={dot(10, "#2C2C2C", { left: 64, top: 46 })} />
    <div style={dot(6, "#2C2C2C", { left: 57, top: 64 })} />
  </Stage>
);

const PomArt = () => (
  <Stage>
    {/* outer fluff */}
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return <div key={i} style={dot(10, "#D4A843", { left: 55 + Math.cos(a) * 42, top: 45 + Math.sin(a) * 36 })} />;
    })}
    {/* inner fluff */}
    {Array.from({ length: 8 }).map((_, i) => {
      const a = (i / 8) * Math.PI * 2;
      return <div key={i} style={dot(14, "#E8B860", { left: 53 + Math.cos(a) * 28, top: 43 + Math.sin(a) * 24 })} />;
    })}
    <div style={dot(50, "#F0C870", { left: 35, top: 25 })} />
    {/* tiny ears */}
    <div style={{ position: "absolute", left: 38, top: 18, width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderBottom: "10px solid #D4A843" }} />
    <div style={{ position: "absolute", right: 38, top: 18, width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderBottom: "10px solid #D4A843" }} />
    <div style={dot(4, "#2C2C2C", { left: 50, top: 48 })} />
    <div style={dot(4, "#2C2C2C", { left: 66, top: 48 })} />
  </Stage>
);

const GoldenArt = () => (
  <Stage>
    {/* floppy ears */}
    <div style={{ position: "absolute", left: 18, top: 24, width: 18, height: 32, background: "#C4983A", borderRadius: "12px 12px 14px 14px" }} />
    <div style={{ position: "absolute", right: 18, top: 24, width: 18, height: 32, background: "#C4983A", borderRadius: "12px 12px 14px 14px" }} />
    {/* head */}
    <div style={dot(65, "#D4A843", { left: 28, top: 18 })} />
    <div style={dot(7, "#2C2C2C", { left: 46, top: 42 })} />
    <div style={dot(7, "#2C2C2C", { left: 67, top: 42 })} />
    {/* smile */}
    <div style={{ position: "absolute", left: 48, top: 60, width: 24, height: 12, borderBottom: "2.5px solid #2C2C2C", borderRadius: "0 0 50% 50%" }} />
  </Stage>
);

const DachshundArt = () => (
  <Stage>
    {/* long body */}
    <div style={{ position: "absolute", left: 12, top: 42, width: 80, height: 32, background: "#C47840", borderRadius: 16 }} />
    {/* head */}
    <div style={dot(34, "#D48850", { left: 78, top: 28 })} />
    {/* ear */}
    <div style={{ position: "absolute", left: 80, top: 38, width: 14, height: 24, background: "#A05828", borderRadius: "8px 8px 10px 10px" }} />
    {/* legs */}
    {[20, 38, 60, 78].map((l, i) => (
      <div key={i} style={{ position: "absolute", left: l, top: 72, width: 6, height: 14, background: "#A05828", borderRadius: 3 }} />
    ))}
    <div style={dot(4, "#2C2C2C", { left: 92, top: 42 })} />
    <div style={dot(4, "#2C2C2C", { left: 100, top: 50, background: "#2C2C2C" })} />
  </Stage>
);

const FrenchieArt = () => (
  <Stage>
    {/* bat ears */}
    <div style={{ position: "absolute", left: 26, top: 4, width: 0, height: 0, borderLeft: "14px solid transparent", borderRight: "14px solid transparent", borderBottom: "26px solid #7090B8" }} />
    <div style={{ position: "absolute", right: 26, top: 4, width: 0, height: 0, borderLeft: "14px solid transparent", borderRight: "14px solid transparent", borderBottom: "26px solid #7090B8" }} />
    {/* face */}
    <div style={{ position: "absolute", left: 28, top: 24, width: 65, height: 55, background: "#8AAAC8", borderRadius: 18 }} />
    {/* wrinkles */}
    <div style={{ position: "absolute", left: 40, top: 44, width: 40, height: 1.5, background: "#7090B8", borderRadius: 2 }} />
    <div style={{ position: "absolute", left: 42, top: 48, width: 36, height: 1.5, background: "#7090B8", borderRadius: 2 }} />
    {/* nose */}
    <div style={{ position: "absolute", left: 50, top: 58, width: 20, height: 10, background: "#2C2C2C", borderRadius: 8 }} />
    <div style={dot(5, "#2C2C2C", { left: 40, top: 36 })} />
    <div style={dot(5, "#2C2C2C", { left: 75, top: 36 })} />
  </Stage>
);

const YorkieArt = () => (
  <Stage>
    {/* silky hair strands */}
    {[
      [30, "#C4986A"], [38, "#B898D8"], [46, "#C4986A"], [54, "#B898D8"],
      [62, "#C4986A"], [70, "#B898D8"], [78, "#C4986A"],
    ].map(([l, c], i) => (
      <div key={i} style={{ position: "absolute", left: l as number, top: 48, width: 4, height: 36, background: c as string, borderRadius: 2 }} />
    ))}
    {/* head */}
    <div style={dot(45, "#C8A8E8", { left: 38, top: 18 })} />
    {/* perky ears */}
    <div style={{ position: "absolute", left: 38, top: 10, width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderBottom: "12px solid #B898D8" }} />
    <div style={{ position: "absolute", right: 38, top: 10, width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderBottom: "12px solid #B898D8" }} />
    <div style={dot(4, "#2C2C2C", { left: 50, top: 36 })} />
    <div style={dot(4, "#2C2C2C", { left: 66, top: 36 })} />
    <div style={dot(4, "#D4A870", { left: 58, top: 46 })} />
  </Stage>
);

const MixedArt = () => (
  <Stage>
    <div style={{ position: "absolute", left: 30, top: 12, width: 60, height: 60, borderRadius: "50%", overflow: "hidden", display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr" }}>
      <div style={{ background: "#FFE4EC" }} />
      <div style={{ background: "#E8F5EE" }} />
      <div style={{ background: "#E8F2FF" }} />
      <div style={{ background: "#FFF8DC" }} />
    </div>
    <div style={{ position: "absolute", left: 47, top: 26, fontSize: 28, fontWeight: 800, color: "#8A8A8A" }}>?</div>
    <div style={dot(4, "#2C2C2C", { left: 46, top: 50 })} />
    <div style={dot(4, "#2C2C2C", { left: 70, top: 50 })} />
  </Stage>
);

/* ─────────────────────────────────────── Data ─────────────────────────────────────── */

const BREEDS: Breed[] = [
  {
    jp: "柴犬", en: "Shiba Inu", rank: 1, size: "small", sizeJp: "小型", sizeEn: "Small",
    traits: [{ icon: "⚡", jp: "活発", en: "Active" }, { icon: "🧠", jp: "賢い", en: "Smart" }],
    gradient: "linear-gradient(135deg, #FFF0DC, #FFE4BC)", accent: "#E8956D",
    rankBg: "#D4A843", sizeBg: "#FFF0DC", sizeText: "#E8956D",
    stats: { energy: 80, friendly: 70, train: 75, groom: 60 },
    health: [{ jp: "膝蓋骨脱臼", en: "Patellar Luxation", level: "watch" }, { jp: "アレルギー", en: "Allergies", level: "watch" }],
    Illustration: ShibaArt,
  },
  {
    jp: "トイプードル", en: "Toy Poodle", rank: 2, size: "toy", sizeJp: "超小型", sizeEn: "Toy",
    traits: [{ icon: "🌟", jp: "優しい", en: "Gentle" }, { icon: "🎓", jp: "賢い", en: "Trainable" }],
    gradient: "linear-gradient(135deg, #F5F0FF, #EDE0FF)", accent: "#7B68C8",
    rankBg: "#7B68C8", sizeBg: "#F5F0FF", sizeText: "#7B68C8",
    stats: { energy: 70, friendly: 90, train: 95, groom: 80 },
    health: [{ jp: "外耳炎", en: "Ear Infections", level: "watch" }],
    Illustration: PoodleArt,
  },
  {
    jp: "チワワ", en: "Chihuahua", rank: 3, size: "toy", sizeJp: "超小型", sizeEn: "Tiny",
    traits: [{ icon: "💪", jp: "勇敢", en: "Brave" }, { icon: "🏠", jp: "室内", en: "Indoor" }],
    gradient: "linear-gradient(135deg, #FFF8DC, #FFF0CC)", accent: "#D4A843",
    rankBg: "#D4A843", sizeBg: "#FFF8DC", sizeText: "#C49633",
    stats: { energy: 60, friendly: 60, train: 55, groom: 40 },
    health: [{ jp: "気管虚脱", en: "Tracheal Collapse", level: "concern" }],
    Illustration: ChihuahuaArt,
  },
  {
    jp: "ポメラニアン", en: "Pomeranian", rank: 4, size: "small", sizeJp: "小型", sizeEn: "Small",
    traits: [{ icon: "🎭", jp: "陽気", en: "Playful" }, { icon: "✨", jp: "ふわふわ", en: "Fluffy" }],
    gradient: "linear-gradient(135deg, #FFF8E8, #FFF0D0)", accent: "#D4A843",
    rankBg: "#D4A843", sizeBg: "#FFF8E8", sizeText: "#C49633",
    stats: { energy: 75, friendly: 75, train: 65, groom: 85 },
    health: [{ jp: "気管虚脱", en: "Tracheal Collapse", level: "watch" }],
    Illustration: PomArt,
  },
  {
    jp: "ゴールデンレトリバー", en: "Golden Retriever", rank: 5, size: "large", sizeJp: "大型", sizeEn: "Large",
    traits: [{ icon: "❤️", jp: "親しみ", en: "Friendly" }, { icon: "🏊", jp: "活発", en: "Active" }],
    gradient: "linear-gradient(135deg, #FFF8DC, #FFE8A0)", accent: "#D4A843",
    rankBg: "#D4A843", sizeBg: "#FFF8DC", sizeText: "#C49633",
    stats: { energy: 90, friendly: 95, train: 90, groom: 70 },
    health: [{ jp: "股関節形成不全", en: "Hip Dysplasia", level: "concern" }, { jp: "熱中症", en: "Heat Stroke", level: "concern" }],
    Illustration: GoldenArt,
  },
  {
    jp: "ミニチュアダックス", en: "Mini Dachshund", rank: 6, size: "small", sizeJp: "小型", sizeEn: "Small",
    traits: [{ icon: "🌈", jp: "好奇心", en: "Curious" }, { icon: "💚", jp: "忠実", en: "Loyal" }],
    gradient: "linear-gradient(135deg, #FFE8D6, #FFD4BC)", accent: "#D4714E",
    rankBg: "#D4714E", sizeBg: "#FFE8D6", sizeText: "#B05828",
    stats: { energy: 70, friendly: 75, train: 60, groom: 50 },
    health: [{ jp: "椎間板ヘルニア", en: "IVDD (Back Issues)", level: "concern" }],
    Illustration: DachshundArt,
  },
  {
    jp: "フレンチブルドッグ", en: "French Bulldog", rank: null, size: "small", sizeJp: "小型", sizeEn: "Small",
    traits: [{ icon: "😎", jp: "クール", en: "Cool" }, { icon: "🏙️", jp: "都会", en: "Urban" }],
    gradient: "linear-gradient(135deg, #E8F2FF, #D6EEFF)", accent: "#5B9BD5",
    rankBg: "#5B9BD5", sizeBg: "#E8F2FF", sizeText: "#5B9BD5",
    stats: { energy: 55, friendly: 85, train: 65, groom: 50 },
    health: [{ jp: "短頭種症候群", en: "Brachycephalic Syndrome", level: "concern" }],
    Illustration: FrenchieArt,
  },
  {
    jp: "ヨークシャテリア", en: "Yorkshire Terrier", rank: null, size: "toy", sizeJp: "超小型", sizeEn: "Tiny",
    traits: [{ icon: "💅", jp: "上品", en: "Elegant" }, { icon: "⚡", jp: "活発", en: "Feisty" }],
    gradient: "linear-gradient(135deg, #F8F0FF, #EEE0FF)", accent: "#A87FD0",
    rankBg: "#A87FD0", sizeBg: "#F8F0FF", sizeText: "#A87FD0",
    stats: { energy: 70, friendly: 70, train: 75, groom: 90 },
    health: [{ jp: "歯周病", en: "Dental Issues", level: "watch" }],
    Illustration: YorkieArt,
  },
  {
    jp: "ミックス犬", en: "Mixed Breed", rank: null, size: "various", sizeJp: "様々", sizeEn: "Various",
    traits: [{ icon: "🌈", jp: "個性", en: "Unique" }, { icon: "❤️", jp: "特別", en: "Special" }],
    gradient: "linear-gradient(135deg, #F0F5FF, #E8F5EE)", accent: "#6BAF92",
    rankBg: "#6BAF92", sizeBg: "#E8F5EE", sizeText: "#6BAF92",
    stats: { energy: 75, friendly: 85, train: 75, groom: 60 },
    health: [{ jp: "個体差あり", en: "Varies by mix", level: "watch" }],
    Illustration: MixedArt,
  },
];

/* ─────────────────────────────────────── Filter Chips ─────────────────────────────────────── */

type FilterKey = "all" | "toy" | "small" | "medium" | "large" | "various" | "popular";
const FILTERS: { key: FilterKey; jp: string; en: string; bg: string; border: string; text: string; dot?: number; icon?: string }[] = [
  { key: "all", jp: "すべて", en: "All", bg: "linear-gradient(135deg,#E8829A,#C86882)", border: "transparent", text: "#FFFFFF", icon: "🐾" },
  { key: "toy", jp: "超小型", en: "Toy", bg: "#FFF0F5", border: "#E8829A", text: "#E8829A", dot: 3 },
  { key: "small", jp: "小型犬", en: "Small", bg: "#FFF8DC", border: "#D4A843", text: "#C49633", dot: 5 },
  { key: "large", jp: "大型犬", en: "Large", bg: "#E8F2FF", border: "#5B9BD5", text: "#5B9BD5", dot: 7 },
  { key: "various", jp: "ミックス", en: "Mixed", bg: "#F0ECFF", border: "#7B68C8", text: "#7B68C8" },
  { key: "popular", jp: "🇯🇵 人気順", en: "Popular", bg: "#E8F5EE", border: "#6BAF92", text: "#6BAF92" },
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
    if (filter === "popular") list = [...list].filter(b => b.rank !== null).sort((a, b) => (a.rank! - b.rank!));
    else if (filter !== "all") list = list.filter(b => b.size === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(b => b.jp.toLowerCase().includes(q) || b.en.toLowerCase().includes(q));
    }
    return list;
  }, [filter, query]);

  const featured = BREEDS[0];

  return (
    <AppShell noPadding>
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
        {/* decorative silhouettes */}
        <div style={{ position: "absolute", right: 24, top: 30, opacity: 0.4 }}>
          <div style={{ ...dot(36, "#FFB7C5", { position: "relative" as const }), display: "inline-block" }} />
        </div>
        <div style={{ position: "absolute", right: 70, top: 18, opacity: 0.4 }}>
          <div style={{ ...dot(22, "#C8C0F0", { position: "relative" as const }), display: "inline-block" }} />
        </div>
        <div style={{ position: "absolute", right: 14, top: 70, opacity: 0.4 }}>
          <div style={{ ...dot(16, "#FFD4A8", { position: "relative" as const }), display: "inline-block" }} />
        </div>
        <div style={{ position: "absolute", right: 56, top: 60, opacity: 0.4 }}>
          <div style={{ width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderBottom: "14px solid #FFB7C5" }} />
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

      {/* FILTER CHIPS */}
      <div className="scrollbar-hide" style={{ display: "flex", gap: 8, overflowX: "auto", padding: "4px 16px 8px" }}>
        {FILTERS.map((f) => {
          const sel = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                flexShrink: 0, display: "flex", alignItems: "center", gap: 6,
                height: 36, padding: "0 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                background: sel ? f.bg : "#FFFFFF",
                border: sel ? `1.5px solid ${f.border}` : "1.5px solid #EDE8E4",
                color: sel ? f.text : "#8A8A8A",
                boxShadow: sel ? "0 4px 12px rgba(0,0,0,0.08)" : "0 2px 6px rgba(0,0,0,0.04)",
                transition: "all 180ms",
                whiteSpace: "nowrap",
              }}
            >
              {f.icon && <span>{f.icon}</span>}
              {sel && f.dot && (
                <span style={{ width: f.dot, height: f.dot, borderRadius: "50%", background: f.text, display: "inline-block" }} />
              )}
              <span>{t(f.jp, f.en)}</span>
            </button>
          );
        })}
      </div>

      {/* FEATURED BREED OF THE DAY */}
      <div style={{ padding: "8px 16px 4px" }}>
        <button
          onClick={() => setOpenBreed(featured)}
          style={{
            width: "100%", height: 90, display: "flex", alignItems: "center",
            background: "linear-gradient(135deg, #FFF0DC, #FFE4BC)",
            borderRadius: 20, padding: "0 12px",
            boxShadow: "0 4px 16px rgba(232,149,109,0.22)",
            textAlign: "left",
          }}
        >
          <div style={{ width: 80, height: 78, position: "relative", flexShrink: 0 }}>
            <div style={{ transform: "scale(0.65)", transformOrigin: "center", position: "absolute", inset: 0 }}>
              <ShibaArt />
            </div>
          </div>
          <div style={{ flex: 1, marginLeft: 4 }}>
            <div style={{ fontSize: 10, color: "#E8956D", fontWeight: 600, letterSpacing: "0.08em" }}>
              {t("今日の犬種", "BREED OF THE DAY")}
            </div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#2C2C2C", marginTop: 1 }}>
              {language === "english" ? "Shiba Inu" : language === "japanese" ? "柴犬" : "柴犬 / Shiba Inu"}
            </div>
            <div style={{ fontSize: 11, color: "#8A8A8A", marginTop: 1 }}>
              {t("日本で最も人気", "Most popular in Japan")}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#E8956D", fontSize: 12, fontWeight: 700, marginRight: 4 }}>
            <span>{t("詳しく", "More")}</span>
            <ArrowRight size={14} strokeWidth={2.5} />
          </div>
        </button>
      </div>

      {/* GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "12px 16px 24px" }}>
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
  const { Illustration } = breed;
  const nameFontJp = breed.jp.length > 8 ? 12 : 14;
  return (
    <button
      onClick={onOpen}
      style={{
        background: "#FFFFFF", borderRadius: 20, overflow: "hidden",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)", textAlign: "left",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* Illustration */}
      <div style={{ position: "relative", height: 120, background: breed.gradient }}>
        <Illustration />
        {breed.rank !== null && (
          <div style={{
            position: "absolute", top: 0, right: 0,
            background: breed.rankBg, color: "white",
            padding: "4px 10px", fontSize: 11, fontWeight: 800,
            borderRadius: "0 20px 0 12px",
          }}>
            #{breed.rank}
          </div>
        )}
      </div>
      {/* Info */}
      <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 6 }}>
        <div>
          <div style={{ fontSize: nameFontJp, fontWeight: 800, color: "#2C2C2C", lineHeight: 1.2 }}>
            {language === "english" ? breed.en : breed.jp}
          </div>
          {language === "mixed" && (
            <div style={{ fontSize: 10, color: "#8A8A8A", marginTop: 2 }}>{breed.en}</div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4 }}>
          <span style={{
            background: breed.sizeBg, color: breed.sizeText,
            fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 10,
            whiteSpace: "nowrap",
          }}>
            {t(breed.sizeJp, breed.sizeEn)}
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            {breed.traits.map((tr, i) => (
              <div key={i} title={t(tr.jp, tr.en)} style={{ fontSize: 12 }}>
                {tr.icon}
              </div>
            ))}
          </div>
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
  const { Illustration } = breed;

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
        {/* HERO */}
        <div style={{ position: "relative", height: 200, background: breed.gradient, borderRadius: "24px 24px 0 0" }}>
          <button onClick={onClose} style={{
            position: "absolute", top: 16, left: 16, width: 36, height: 36,
            borderRadius: "50%", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(10px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}>
            <ArrowLeft size={18} color="#2C2C2C" />
          </button>
          <div style={{ position: "absolute", inset: 0, transform: "scale(1.5)", transformOrigin: "center" }}>
            <Illustration />
          </div>
          {breed.rank !== null && (
            <div style={{
              position: "absolute", top: 16, right: 16,
              background: breed.rankBg, color: "white",
              padding: "6px 12px", fontSize: 12, fontWeight: 800, borderRadius: 14,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}>
              #{breed.rank} {t("人気", "Popular")}
            </div>
          )}
          <div className="w-12 h-1.5 rounded-full" style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.15)" }} />
        </div>

        {/* NAME */}
        <div style={{ padding: "20px 20px 8px" }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#2C2C2C", letterSpacing: "-0.01em" }}>
            {language === "english" ? breed.en : breed.jp}
          </div>
          {language !== "japanese" && (
            <div style={{ fontSize: 14, color: "#8A8A8A", marginTop: 2 }}>{breed.en}</div>
          )}
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <span style={{ background: breed.sizeBg, color: breed.sizeText, fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 12 }}>
              {t(breed.sizeJp, breed.sizeEn)}
            </span>
            {breed.traits.map((tr, i) => (
              <span key={i} style={{ background: "#FFFFFF", border: "1px solid #EDE8E4", fontSize: 11, fontWeight: 600, color: "#2C2C2C", padding: "5px 10px", borderRadius: 12 }}>
                {tr.icon} {t(tr.jp, tr.en)}
              </span>
            ))}
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
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: breed.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
                  🐕
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
