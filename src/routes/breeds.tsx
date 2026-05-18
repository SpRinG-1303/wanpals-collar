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
  kana: string;
  rank: number | null;
  size: SizeKey;
  sizeJp: string;
  sizeEn: string;
  originJp: string;
  originEn: string;
  flag: string;
  // Rich profile data
  groupJp: string;
  groupEn: string;
  temperamentJp: string;
  temperamentEn: string;
  lifeSpan: string;
  diagnosticNoteJp: string;
  diagnosticNoteEn: string;
  // Banner styling
  bannerBg: string;
  rankBg: string;
  sizeBg: string;
  sizeText: string;
  kanji: string;
  kanjiSize: number;
  kanjiColor: string;
  Icon: ComponentType<LucideProps>;
  iconColor: string;
  animateGradient?: boolean;
  image?: string;
  // Detail extras
  stats: { energy: number; friendly: number; train: number; groom: number };
  health: { jp: string; en: string; level: "watch" | "concern" }[];
};

const BREEDS: Breed[] = [
  {
    jp: "柴犬", en: "Shiba Inu", kana: "シバイヌ", rank: 1, size: "small", sizeJp: "小型", sizeEn: "Small",
    originJp: "日本", originEn: "Japan", flag: "",
    groupJp: "非スポーティング", groupEn: "Non-Sporting",
    temperamentJp: "警戒心が強い・忠実・自信家", temperamentEn: "Alert, Faithful, Confident",
    lifeSpan: "12-15 years",
    diagnosticNoteJp: "活動量が多いため、不安を隠す行動に注意したベースライン調整が必要。",
    diagnosticNoteEn: "High activity telemetry requires careful baseline adjustment for anxiety hiding behaviors.",
    image: "https://images.unsplash.com/photo-1579213838429-c981f6f52bdf?w=400&q=80&auto=format&fit=crop",
    bannerBg: "linear-gradient(135deg, #FF9966, #FF6B35)",
    rankBg: "#CC4400", sizeBg: "#FFF0DC", sizeText: "#CC5500",
    kanji: "柴", kanjiSize: 64, kanjiColor: "rgba(255,255,255,0.25)",
    Icon: Dog, iconColor: "rgba(255,255,255,0.65)",
    stats: { energy: 80, friendly: 70, train: 75, groom: 60 },
    health: [{ jp: "膝蓋骨脱臼", en: "Patellar Luxation", level: "watch" }, { jp: "アレルギー", en: "Allergies", level: "watch" }],
  },
  {
    jp: "シーズー", en: "Shih Tzu", kana: "シーズー", rank: 10, size: "toy", sizeJp: "超小型", sizeEn: "Toy",
    originJp: "チベット", originEn: "Tibet", flag: "",
    groupJp: "トイ", groupEn: "Toy",
    temperamentJp: "愛情深い・遊び好き・賢い", temperamentEn: "Affectionate, Playful, Clever",
    lifeSpan: "10-16 years",
    diagnosticNoteJp: "短頭種のため、BarkSense AIによる呼吸器トラッキングが必須。",
    diagnosticNoteEn: "Brachycephalic respiratory tracking required via BarkSense AI.",
    image: "https://images.unsplash.com/photo-1591768793355-74d04bb6608f?w=400&q=80&auto=format&fit=crop",
    bannerBg: "linear-gradient(135deg, #F4C7AB, #C99280)",
    rankBg: "#8C5A46", sizeBg: "#FFF1E6", sizeText: "#8C5A46",
    kanji: "獅", kanjiSize: 60, kanjiColor: "rgba(255,255,255,0.28)",
    Icon: Crown, iconColor: "rgba(255,255,255,0.65)",
    stats: { energy: 50, friendly: 85, train: 60, groom: 95 },
    health: [{ jp: "短頭種症候群", en: "Brachycephalic Syndrome", level: "concern" }, { jp: "眼疾患", en: "Eye Issues", level: "watch" }],
  },
  {
    jp: "シベリアンハスキー", en: "Siberian Husky", kana: "シベリアンハスキー", rank: 11, size: "large", sizeJp: "大型", sizeEn: "Large",
    originJp: "シベリア", originEn: "Siberia", flag: "",
    groupJp: "ワーキング", groupEn: "Working",
    temperamentJp: "社交的・友好的・穏やか", temperamentEn: "Outgoing, Friendly, Gentle",
    lifeSpan: "12-14 years",
    diagnosticNoteJp: "寒冷地仕様のため、サーマルセンサーで体温変動を監視し熱中症を防ぐ。",
    diagnosticNoteEn: "Thrives in cold environments; thermal sensors monitor internal temperature variations against dangerous overheating.",
    image: "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400&q=80&auto=format&fit=crop",
    bannerBg: "linear-gradient(135deg, #A8D0E8, #5A8FB8)",
    rankBg: "#2E6B8A", sizeBg: "#E8F2FA", sizeText: "#2E6B8A",
    kanji: "雪", kanjiSize: 64, kanjiColor: "rgba(255,255,255,0.28)",
    Icon: Wind, iconColor: "rgba(255,255,255,0.65)",
    stats: { energy: 95, friendly: 85, train: 70, groom: 70 },
    health: [{ jp: "熱中症", en: "Heat Stroke", level: "concern" }, { jp: "眼疾患", en: "Eye Issues", level: "watch" }],
  },
  {
    jp: "トイプードル", en: "Toy Poodle", kana: "トイプードル", rank: 2, size: "toy", sizeJp: "超小型", sizeEn: "Toy",
    originJp: "フランス", originEn: "France", flag: "",
    groupJp: "トイ", groupEn: "Toy",
    temperamentJp: "賢い・活発・愛情深い", temperamentEn: "Intelligent, Active, Affectionate",
    lifeSpan: "12-15 years",
    diagnosticNoteJp: "外耳炎の傾向あり。耳道の湿度・温度トレンドの定期確認を推奨。",
    diagnosticNoteEn: "Ear-canal humidity & temperature trends should be reviewed regularly to flag early otitis.",
    image: "https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?w=400&q=80&auto=format&fit=crop",
    bannerBg: "linear-gradient(135deg, #9B72CF, #7B52AF)",
    rankBg: "#6B3AAF", sizeBg: "#F5F0FF", sizeText: "#7B52AF",
    kanji: "プー", kanjiSize: 44, kanjiColor: "rgba(255,255,255,0.22)",
    Icon: Sparkles, iconColor: "rgba(255,255,255,0.65)",
    stats: { energy: 70, friendly: 90, train: 95, groom: 80 },
    health: [{ jp: "外耳炎", en: "Ear Infections", level: "watch" }],
  },
  {
    jp: "チワワ", en: "Chihuahua", kana: "チワワ", rank: 3, size: "toy", sizeJp: "超小型", sizeEn: "Tiny",
    originJp: "メキシコ", originEn: "Mexico", flag: "",
    groupJp: "トイ", groupEn: "Toy",
    temperamentJp: "勇敢・機敏・愛情深い", temperamentEn: "Bold, Alert, Devoted",
    lifeSpan: "14-16 years",
    diagnosticNoteJp: "気管虚脱の兆候を検知するため、咳と呼吸音の継続モニタリングが重要。",
    diagnosticNoteEn: "Continuous cough & airway-sound monitoring helps detect early tracheal collapse signs.",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80&auto=format&fit=crop",
    bannerBg: "linear-gradient(135deg, #F6D365, #FDA085)",
    rankBg: "#E8820A", sizeBg: "#FFF8DC", sizeText: "#D4920A",
    kanji: "チ", kanjiSize: 64, kanjiColor: "rgba(255,255,255,0.28)",
    Icon: Heart, iconColor: "rgba(255,255,255,0.65)",
    stats: { energy: 60, friendly: 60, train: 55, groom: 40 },
    health: [{ jp: "気管虚脱", en: "Tracheal Collapse", level: "concern" }],
  },
  {
    jp: "ポメラニアン", en: "Pomeranian", kana: "ポメラニアン", rank: 4, size: "small", sizeJp: "小型", sizeEn: "Small",
    originJp: "ドイツ", originEn: "Germany", flag: "",
    groupJp: "トイ", groupEn: "Toy",
    temperamentJp: "活発・人懐っこい・知的", temperamentEn: "Lively, Friendly, Intelligent",
    lifeSpan: "12-16 years",
    diagnosticNoteJp: "気管虚脱に注意。吠え声パターンと呼吸変動を継続追跡。",
    diagnosticNoteEn: "Watch for tracheal weakness; continuously track bark patterns and breathing variability.",
    image: "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=400&q=80&auto=format&fit=crop",
    bannerBg: "linear-gradient(135deg, #FFECD2, #FCB69F)",
    rankBg: "#C47040", sizeBg: "#FFF4EC", sizeText: "#C47040",
    kanji: "ポメ", kanjiSize: 42, kanjiColor: "rgba(180,90,40,0.22)",
    Icon: Wind, iconColor: "rgba(180,90,40,0.45)",
    stats: { energy: 75, friendly: 75, train: 65, groom: 85 },
    health: [{ jp: "気管虚脱", en: "Tracheal Collapse", level: "watch" }],
  },
  {
    jp: "ゴールデンレトリバー", en: "Golden Retriever", kana: "ゴールデンレトリバー", rank: 5, size: "large", sizeJp: "大型", sizeEn: "Large",
    originJp: "イギリス", originEn: "UK", flag: "",
    groupJp: "スポーティング", groupEn: "Sporting",
    temperamentJp: "知的・優しい・信頼できる", temperamentEn: "Intelligent, Kind, Trustworthy",
    lifeSpan: "10-12 years",
    diagnosticNoteJp: "早期関節症の素因あり。GaitSense AIが微細な歩行劣化を追跡。",
    diagnosticNoteEn: "High predisposition to early-stage arthritis; GaitSense AI tracks subtle mobility degradation.",
    image: "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400&q=80&auto=format&fit=crop",
    bannerBg: "linear-gradient(135deg, #F7971E, #FFD200)",
    rankBg: "#C48A00", sizeBg: "#FFF8DC", sizeText: "#C48A00",
    kanji: "金", kanjiSize: 64, kanjiColor: "rgba(255,255,255,0.25)",
    Icon: Sun, iconColor: "rgba(255,255,255,0.55)",
    stats: { energy: 90, friendly: 95, train: 90, groom: 70 },
    health: [{ jp: "股関節形成不全", en: "Hip Dysplasia", level: "concern" }, { jp: "熱中症", en: "Heat Stroke", level: "concern" }],
  },
  {
    jp: "ミニチュアダックス", en: "Mini Dachshund", kana: "ミニチュアダックスフンド", rank: 6, size: "small", sizeJp: "小型", sizeEn: "Small",
    originJp: "ドイツ", originEn: "Germany", flag: "",
    groupJp: "ハウンド", groupEn: "Hound",
    temperamentJp: "勇敢・好奇心旺盛・友好的", temperamentEn: "Spunky, Curious, Friendly",
    lifeSpan: "12-16 years",
    diagnosticNoteJp: "椎間板ヘルニアの高リスク。背中の姿勢と歩行を継続監視。",
    diagnosticNoteEn: "High IVDD risk; spine posture and gait require continuous monitoring.",
    image: "https://images.unsplash.com/photo-1612195583950-b8fd34c87093?w=400&q=80&auto=format&fit=crop",
    bannerBg: "linear-gradient(135deg, #C4714E, #A0522D)",
    rankBg: "#7A3A1E", sizeBg: "#FFF0DC", sizeText: "#A0522D",
    kanji: "ダックス", kanjiSize: 32, kanjiColor: "rgba(255,255,255,0.22)",
    Icon: Minus, iconColor: "rgba(255,255,255,0.55)",
    stats: { energy: 70, friendly: 75, train: 60, groom: 50 },
    health: [{ jp: "椎間板ヘルニア", en: "IVDD (Back Issues)", level: "concern" }],
  },
  {
    jp: "フレンチブルドッグ", en: "French Bulldog", kana: "フレンチブルドッグ", rank: 7, size: "small", sizeJp: "小型", sizeEn: "Small",
    originJp: "フランス", originEn: "France", flag: "",
    groupJp: "非スポーティング", groupEn: "Non-Sporting",
    temperamentJp: "順応性・遊び好き・賢い", temperamentEn: "Adaptable, Playful, Smart",
    lifeSpan: "10-12 years",
    diagnosticNoteJp: "突発的な咳パターンと呼吸異常を検知。",
    diagnosticNoteEn: "Prone to sudden respiratory cough patterns and breathing anomalies.",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&q=80&auto=format&fit=crop",
    bannerBg: "linear-gradient(135deg, #4FACFE, #00F2FE)",
    rankBg: "#0080CC", sizeBg: "#E8F4FF", sizeText: "#0080CC",
    kanji: "フレブル", kanjiSize: 32, kanjiColor: "rgba(255,255,255,0.22)",
    Icon: Zap, iconColor: "rgba(255,255,255,0.55)",
    stats: { energy: 55, friendly: 85, train: 65, groom: 50 },
    health: [{ jp: "短頭種症候群", en: "Brachycephalic Syndrome", level: "concern" }],
  },
  {
    jp: "ヨークシャテリア", en: "Yorkshire Terrier", kana: "ヨークシャーテリア", rank: 8, size: "toy", sizeJp: "超小型", sizeEn: "Tiny",
    originJp: "イギリス", originEn: "UK", flag: "",
    groupJp: "トイ", groupEn: "Toy",
    temperamentJp: "勇敢・愛情深い・活発", temperamentEn: "Brave, Affectionate, Energetic",
    lifeSpan: "13-16 years",
    diagnosticNoteJp: "歯周病に注意。咀嚼パターンと口腔音の追跡を推奨。",
    diagnosticNoteEn: "Dental disease prone; chew patterns and oral sounds should be tracked.",
    image: "https://images.unsplash.com/photo-1516148806338-702cf5f65c41?w=400&q=80&auto=format&fit=crop",
    bannerBg: "linear-gradient(135deg, #A18CD1, #FBC2EB)",
    rankBg: "#7B52AF", sizeBg: "#F8F0FF", sizeText: "#7B52AF",
    kanji: "ヨーキー", kanjiSize: 32, kanjiColor: "rgba(255,255,255,0.24)",
    Icon: Crown, iconColor: "rgba(255,255,255,0.55)",
    stats: { energy: 70, friendly: 70, train: 75, groom: 90 },
    health: [{ jp: "歯周病", en: "Dental Issues", level: "watch" }],
  },
  {
    jp: "ミックス犬", en: "Mixed Breed", kana: "ミックスケン", rank: null, size: "various", sizeJp: "様々", sizeEn: "Various",
    originJp: "世界", originEn: "Global", flag: "",
    groupJp: "様々", groupEn: "Various",
    temperamentJp: "個体差あり・ユニーク", temperamentEn: "Varies, Unique to each dog",
    lifeSpan: "10-18 years",
    diagnosticNoteJp: "個体差が大きいため、Pawsitive AIが独自のベースラインを学習。",
    diagnosticNoteEn: "High individual variance; Pawsitive AI learns a personalized baseline per dog.",
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

  const fuse = useMemo(
    () =>
      new Fuse(BREEDS, {
        threshold: 0.4,
        keys: [
          { name: "name_jp", getFn: (b) => b.jp },
          { name: "name_en", getFn: (b) => b.en },
          { name: "name_kana", getFn: (b) => b.kana },
          { name: "country_jp", getFn: (b) => b.originJp },
          { name: "country_en", getFn: (b) => b.originEn },
          { name: "size_jp", getFn: (b) => b.sizeJp },
          { name: "size_en", getFn: (b) => b.sizeEn },
          { name: "group_jp", getFn: (b) => b.groupJp },
          { name: "group_en", getFn: (b) => b.groupEn },
          { name: "temperament_jp", getFn: (b) => b.temperamentJp },
          { name: "temperament_en", getFn: (b) => b.temperamentEn },
          { name: "lifespan", getFn: (b) => b.lifeSpan },
          { name: "diagnostic_jp", getFn: (b) => b.diagnosticNoteJp },
          { name: "diagnostic_en", getFn: (b) => b.diagnosticNoteEn },
        ],
        includeScore: true,
        includeMatches: true,
        minMatchCharLength: 1,
        ignoreLocation: true,
      }),
    []
  );

  const q = query.trim();
  const hasQuery = q.length > 0;

  const { filtered, matchesByKey } = useMemo(() => {
    let list: Breed[] = BREEDS;
    const matches = new Map<string, readonly FuseResultMatch[]>();
    if (hasQuery) {
      const ql = q.toLowerCase();
      // 1) Prefix matches scoped to NAME fields (jp / en / kana) so partial
      //    phrases like "Shi" instantly float Shih Tzu / Shiba Inu to the top.
      const prefixFields = (b: Breed) => [b.jp, b.en, b.kana];
      const prefixHits: Breed[] = [];
      const prefixSet = new Set<string>();
      for (const b of BREEDS) {
        if (prefixFields(b).some((v) => v && v.toLowerCase().startsWith(ql))) {
          prefixHits.push(b);
          prefixSet.add(b.en);
        }
      }
      // 2) Fallback: out-of-order multi-word fuzzy match via Fuse.
      const tokens = ql.split(/\s+/).filter(Boolean);
      const fieldNames = [
        "name_jp", "name_en", "name_kana",
        "country_jp", "country_en", "size_jp", "size_en",
        "group_jp", "group_en", "temperament_jp", "temperament_en",
        "lifespan", "diagnostic_jp", "diagnostic_en",
      ] as const;
      const fuzzyResults =
        tokens.length > 1
          ? fuse.search({
              $and: tokens.map((tok) => ({
                $or: fieldNames.map((f) => ({ [f]: tok })),
              })),
            })
          : fuse.search(q);
      const fuzzyHits: Breed[] = [];
      fuzzyResults.forEach((r) => {
        if (r.matches) matches.set(r.item.en, r.matches);
        if (!prefixSet.has(r.item.en)) fuzzyHits.push(r.item);
      });
      list = [...prefixHits, ...fuzzyHits];
    }
    if (filter === "popular") {
      list = [...list].filter((b) => b.rank !== null).sort((a, b) => a.rank! - b.rank!);
    } else if (filter !== "all") {
      list = list.filter((b) => b.size === filter);
    }
    return { filtered: list, matchesByKey: matches };
  }, [filter, q, hasQuery, fuse]);

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
          {hasQuery ? (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              style={{
                width: 28, height: 28, borderRadius: "50%", background: "#FFE4EC",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "none", cursor: "pointer",
              }}
            >
              <X size={14} color="#E8829A" strokeWidth={2.5} />
            </button>
          ) : (
            <div style={{
              width: 34, height: 34, borderRadius: "50%", background: "#F0ECFF",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <SlidersHorizontal size={16} color="#7B68C8" strokeWidth={2} />
            </div>
          )}
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

      {/* TODAY'S BREED — hidden during active search */}
      {!hasQuery && (
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
      )}

      {/* RESULT COUNT */}
      {hasQuery && filtered.length > 0 && (
        <div style={{ padding: "10px 20px 0", fontSize: 12, fontWeight: 700, color: "#8A8A8A" }}>
          {language === "english"
            ? `${filtered.length} ${filtered.length === 1 ? "breed" : "breeds"} found`
            : language === "japanese"
            ? `${filtered.length}件の犬種`
            : `${filtered.length}件の犬種 / ${filtered.length} found`}
        </div>
      )}

      {/* RESULTS — rich single-column profile cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "12px 16px 24px" }}>
        {filtered.map((b) => (
          <BreedCard
            key={b.en}
            breed={b}
            onOpen={() => setOpenBreed(b)}
            language={language}
            t={t}
            matches={matchesByKey.get(b.en)}
          />
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px", gap: 12 }}>
            <SadDog />
            <div style={{ fontSize: 15, fontWeight: 800, color: "#2C2C2C", textAlign: "center" }}>
              {t("見つかりませんでした", "No breeds found")}
            </div>
            <div style={{ fontSize: 12, color: "#8A8A8A", textAlign: "center" }}>
              {t("別のキーワードで試してください", "Try a different keyword")}
            </div>
            <button
              onClick={() => { setQuery(""); setFilter("all"); }}
              style={{
                marginTop: 4, height: 38, padding: "0 22px", borderRadius: 20,
                background: "linear-gradient(135deg, #E8829A, #C86882)",
                color: "white", fontSize: 12, fontWeight: 700, border: "none",
                boxShadow: "0 4px 12px rgba(232,130,154,0.32)", cursor: "pointer",
              }}
            >
              {t("すべて表示", "Show All")}
            </button>
          </div>
        )}
      </div>

      {openBreed && <BreedDetail breed={openBreed} onClose={() => setOpenBreed(null)} />}
    </AppShell>
  );
}

/* ─────────────────────────────────────── Highlight & Empty State ─────────────────────────────────────── */

function Highlight({
  text, matches, keyName,
}: { text: string; matches?: readonly FuseResultMatch[]; keyName: string }) {
  const m = matches?.find((x) => x.key === keyName);
  if (!m || !m.indices?.length) return <>{text}</>;
  // Merge & sort indices
  const ranges = [...m.indices].sort((a, b) => a[0] - b[0]);
  const out: ReactNode[] = [];
  let cursor = 0;
  ranges.forEach(([start, end], i) => {
    if (start > cursor) out.push(<span key={`p${i}`}>{text.slice(cursor, start)}</span>);
    out.push(
      <span key={`h${i}`} style={{ color: "#E8829A", background: "rgba(232,130,154,0.14)", borderRadius: 3, padding: "0 1px" }}>
        {text.slice(start, end + 1)}
      </span>
    );
    cursor = end + 1;
  });
  if (cursor < text.length) out.push(<span key="t">{text.slice(cursor)}</span>);
  return <>{out}</>;
}

function SadDog() {
  return (
    <svg width="84" height="84" viewBox="0 0 84 84" fill="none" aria-hidden>
      <ellipse cx="42" cy="74" rx="26" ry="4" fill="#F0E6E0" />
      <path d="M20 38 L14 22 L28 30 Z" fill="#C99280" />
      <path d="M64 38 L70 22 L56 30 Z" fill="#C99280" />
      <ellipse cx="42" cy="46" rx="26" ry="22" fill="#E8B8A0" />
      <ellipse cx="42" cy="56" rx="18" ry="14" fill="#F5D4C0" />
      <circle cx="33" cy="44" r="2.5" fill="#2C2C2C" />
      <circle cx="51" cy="44" r="2.5" fill="#2C2C2C" />
      <path d="M30 50 Q33 52 36 50" stroke="#7A4A3A" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M48 50 Q51 52 54 50" stroke="#7A4A3A" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <ellipse cx="42" cy="55" rx="3" ry="2" fill="#2C2C2C" />
      <path d="M37 62 Q42 58 47 62" stroke="#2C2C2C" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <circle cx="58" cy="36" r="1.2" fill="#7BB3E0" opacity="0.8" />
      <circle cx="61" cy="40" r="0.8" fill="#7BB3E0" opacity="0.6" />
    </svg>
  );
}

/* ─────────────────────────────────────── Card ─────────────────────────────────────── */

function BreedCard({ breed, onOpen, language, t, matches }: { breed: Breed; onOpen: () => void; language: string; t: (jp: string, en: string) => string; matches?: readonly FuseResultMatch[] }) {
  const Icon = breed.Icon;
  const primaryName = language === "english" ? breed.en : breed.jp;
  const primaryKey = language === "english" ? "name_en" : "name_jp";
  const showSecondary = language !== "japanese" && primaryName !== breed.en;

  const rows: { jp: string; en: string; valueJp: string; valueEn: string; keyJp?: string; keyEn?: string }[] = [
    { jp: "グループ", en: "GROUP", valueJp: breed.groupJp, valueEn: breed.groupEn, keyJp: "group_jp", keyEn: "group_en" },
    { jp: "原産国", en: "ORIGIN", valueJp: breed.originJp, valueEn: breed.originEn, keyJp: "country_jp", keyEn: "country_en" },
    { jp: "性格", en: "TEMPERAMENT", valueJp: breed.temperamentJp, valueEn: breed.temperamentEn, keyJp: "temperament_jp", keyEn: "temperament_en" },
    { jp: "寿命", en: "LIFE SPAN", valueJp: breed.lifeSpan, valueEn: breed.lifeSpan, keyJp: "lifespan", keyEn: "lifespan" },
  ];

  return (
    <button
      onClick={onOpen}
      style={{
        background: "#FFFFFF", borderRadius: 22, overflow: "hidden",
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)", textAlign: "left",
        display: "flex", flexDirection: "column", border: "1px solid #EFEAE3",
      }}
    >
      {/* HERO BANNER */}
      <div style={{ position: "relative", height: 132, overflow: "hidden" }}>
        <BreedImage breed={breed}>
          <Icon
            size={22}
            color="rgba(255,255,255,0.95)"
            strokeWidth={2}
            style={{ position: "absolute", top: 12, left: 12, filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))" }}
          />
          {breed.rank !== null && (
            <div style={{
              position: "absolute", top: 0, right: 0,
              background: breed.rankBg, color: "white",
              padding: "5px 12px", height: 28,
              fontSize: 11, fontWeight: 800,
              borderRadius: "0 22px 0 12px",
              display: "flex", alignItems: "center",
            }}>
              #{breed.rank}
            </div>
          )}
          {/* Name overlay */}
          <div style={{ position: "absolute", left: 14, right: 14, bottom: 12, color: "white" }}>
            <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.01em", textShadow: "0 1px 4px rgba(0,0,0,0.45)" }}>
              <Highlight text={primaryName} matches={matches} keyName={primaryKey} />
            </div>
            {showSecondary && (
              <div style={{ fontSize: 11, opacity: 0.9, marginTop: 2, textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
                <Highlight text={breed.en} matches={matches} keyName="name_en" />
              </div>
            )}
          </div>
          {/* Size pill */}
          <span style={{
            position: "absolute", top: 12, right: 12,
            ...(breed.rank !== null ? { top: "auto", bottom: 12 } : {}),
            background: "rgba(255,255,255,0.92)", color: breed.sizeText,
            fontSize: 10, fontWeight: 800, padding: "4px 10px", borderRadius: 20,
            letterSpacing: "0.04em",
          }}>
            {t(breed.sizeJp, breed.sizeEn).toUpperCase()}
          </span>
        </BreedImage>
      </div>

      {/* PROFILE BODY */}
      <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {rows.map((r) => (
          <div key={r.en} style={{ display: "grid", gridTemplateColumns: "92px 1fr", gap: 10, alignItems: "baseline" }}>
            <div style={{
              fontSize: 9, fontWeight: 800, color: "#A89A8B",
              letterSpacing: "0.14em", textTransform: "uppercase",
            }}>
              {t(r.jp, r.en)}
            </div>
            <div style={{ fontSize: 12.5, color: "#2C2C2C", fontWeight: 600, lineHeight: 1.35 }}>
              {language === "japanese" ? (
                <Highlight text={r.valueJp} matches={matches} keyName={r.keyJp ?? ""} />
              ) : (
                <Highlight text={r.valueEn} matches={matches} keyName={r.keyEn ?? ""} />
              )}
            </div>
          </div>
        ))}

        {/* DIAGNOSTIC NOTE */}
        <div style={{
          marginTop: 4, padding: "10px 12px",
          background: "linear-gradient(135deg, #FFF6F4, #FCEEEA)",
          border: "1px solid #F5D9D2", borderRadius: 12,
          display: "flex", gap: 10, alignItems: "flex-start",
        }}>
          <AlertTriangle size={14} color="#E8829A" strokeWidth={2.4} style={{ marginTop: 2, flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: 9, fontWeight: 800, color: "#C86882",
              letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 2,
            }}>
              {t("診断ノート", "Diagnostic Note")}
            </div>
            <div style={{ fontSize: 11.5, color: "#5A3D45", fontWeight: 500, lineHeight: 1.4 }}>
              {language === "japanese" ? (
                <Highlight text={breed.diagnosticNoteJp} matches={matches} keyName="diagnostic_jp" />
              ) : (
                <Highlight text={breed.diagnosticNoteEn} matches={matches} keyName="diagnostic_en" />
              )}
            </div>
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
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
      onClick={onClose}
    >
      <div
        className="w-full max-h-[92dvh] overflow-y-auto"
        style={{ background: "#FAFAF8", borderRadius: "24px 24px 0 0", maxWidth: 430 }}
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
