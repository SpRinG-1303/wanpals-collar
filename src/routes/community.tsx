import { createFileRoute } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { POSTS } from "@/lib/mock";
import { useMemo, useState } from "react";
import {
  PenLine,
  ArrowUp,
  MessageCircle,
  Share2,
  Bookmark,
  Flame,
  PawPrint,
  FileText,
  Users as UsersIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useT, useLanguage } from "@/context/LanguageContext";

export const Route = createFileRoute("/community")({ component: Community });

// ── Flair → colour theme ───────────────────────────────────────
type Theme = {
  key: string;
  jp: string;
  en: string;
  accent: string; // border / text
  soft: string; // soft bg
  ring: string; // border-tint
  gradFrom: string;
  gradTo: string;
  emoji: string;
};

const FLAIR_THEMES: Record<string, Theme> = {
  健康: { key: "健康", jp: "健康", en: "Health", accent: "#6BAF92", soft: "#E8F5EE", ring: "#C8E5D7", gradFrom: "#6BAF92", gradTo: "#A8D4BE", emoji: "" },
  "獣医Q&A": { key: "獣医Q&A", jp: "獣医Q&A", en: "Vet Q&A", accent: "#5B9BD5", soft: "#E8F2FF", ring: "#C8E0F8", gradFrom: "#5B9BD5", gradTo: "#8BBDE8", emoji: "" },
  迷子: { key: "迷子", jp: "迷子", en: "Lost", accent: "#D4A843", soft: "#FFF8DC", ring: "#F0E4A0", gradFrom: "#D4A843", gradTo: "#E8C470", emoji: "" },
  日常: { key: "日常", jp: "日常", en: "Daily", accent: "#E8829A", soft: "#FFF0F5", ring: "#FFD0DC", gradFrom: "#E8829A", gradTo: "#F0A8B8", emoji: "" },
  しつけ: { key: "しつけ", jp: "しつけ", en: "Training", accent: "#7B68C8", soft: "#F0ECFF", ring: "#DDD4F8", gradFrom: "#7B68C8", gradTo: "#9B88D8", emoji: "" },
};

function themeFor(flair: string): Theme {
  return FLAIR_THEMES[flair] ?? FLAIR_THEMES["日常"];
}

// ── Categories ────────────────────────────────────────────────
type Cat = { jp: string; en: string; emoji: string; accent: string; soft: string; gradFrom?: string; gradTo?: string };
const CATS: Cat[] = [
  { jp: "すべて", en: "All", emoji: "", accent: "#FFFFFF", soft: "linear-gradient(135deg,#E8829A,#C86882)", gradFrom: "#E8829A", gradTo: "#C86882" },
  { jp: "柴犬部", en: "Shiba Club", emoji: "", accent: "#E8829A", soft: "#FFF0F3" },
  { jp: "プードル部", en: "Poodle Club", emoji: "", accent: "#7B68C8", soft: "#F5F0FF" },
  { jp: "迷子情報", en: "Lost Pets", emoji: "", accent: "#D4A843", soft: "#FFF3CC" },
  { jp: "獣医Q&A", en: "Vet Q&A", emoji: "", accent: "#6BAF92", soft: "#E8F5EE" },
  { jp: "東京", en: "Tokyo", emoji: "", accent: "#5B9BD5", soft: "#E8F2FF" },
  { jp: "大阪", en: "Osaka", emoji: "", accent: "#E8829A", soft: "#FFF0F3" },
];

// ── Username → avatar colour ──────────────────────────────────
function avatarPalette(name: string) {
  const c = (name?.trim()?.[0] ?? "A").toUpperCase().charCodeAt(0);
  if (c >= 65 && c <= 68) return { bg: "#FFE4EC", fg: "#C45478" };
  if (c >= 69 && c <= 72) return { bg: "#EDE0FF", fg: "#6B57B8" };
  if (c >= 73 && c <= 76) return { bg: "#D6EEFF", fg: "#3F7BB8" };
  if (c >= 77 && c <= 80) return { bg: "#FFF3CC", fg: "#A88128" };
  if (c >= 81 && c <= 84) return { bg: "#D4F0E8", fg: "#3F8C72" };
  if (c >= 85 && c <= 90) return { bg: "#FFE8D6", fg: "#B8784A" };
  // Non-latin (Japanese names) → derive from charcode
  const palettes = [
    { bg: "#FFE4EC", fg: "#C45478" },
    { bg: "#EDE0FF", fg: "#6B57B8" },
    { bg: "#D6EEFF", fg: "#3F7BB8" },
    { bg: "#FFF3CC", fg: "#A88128" },
    { bg: "#D4F0E8", fg: "#3F8C72" },
    { bg: "#FFE8D6", fg: "#B8784A" },
  ];
  return palettes[c % palettes.length];
}

const BREED_EMOJI: Record<string, string> = {
  柴犬: "", トイプードル: "", チワワ: "", ポメラニアン: "",
  ゴールデンレトリバー: "", ミニチュアダックスフンド: "",
  フレンチブルドッグ: "", ヨークシャーテリア: "", ミックス犬: "",
};

function Community() {
  const t = useT();
  const { language } = useLanguage();
  const [sub, setSub] = useState(0);
  const [open, setOpen] = useState<string | null>(null);
  const [upvoted, setUpvoted] = useState<Record<string, boolean>>({});
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});
  const [burst, setBurst] = useState<string | null>(null);
  const post = POSTS.find((p) => p.id === open);

  const trending = useMemo(() => POSTS.slice().sort((a, b) => b.up - a.up).slice(0, 4), []);

  return (
    <AppShell noPadding>
      {/* ── Header Banner ─────────────────────────────────────── */}
      <div className="relative">
        <div
          className="relative overflow-hidden"
          style={{
            height: 120,
            background: "linear-gradient(135deg,#FFF0F5 0%,#F5F0FF 50%,#EEF5FF 100%)",
            borderRadius: "0 0 28px 28px",
          }}
        >
          {/* Decorative orb */}
          <div style={{ position: "absolute", right: -20, top: -10, width: 120, height: 120, borderRadius: "50%", background: "#FFE4EC", opacity: 0.35, filter: "blur(20px)" }} />
          {/* Torii */}
          <svg width="64" height="56" viewBox="0 0 64 56" style={{ position: "absolute", right: 24, top: 22, opacity: 0.35 }}>
            <rect x="4" y="12" width="56" height="6" rx="2" fill="#FFD4E8" />
            <rect x="2" y="6" width="60" height="5" rx="2" fill="#FFD4E8" />
            <rect x="12" y="18" width="6" height="34" rx="2" fill="#FFD4E8" />
            <rect x="46" y="18" width="6" height="34" rx="2" fill="#FFD4E8" />
          </svg>
          {/* Floating petals */}
          {[
            { l: 60, t: 40, d: 0 },
            { l: 130, t: 18, d: 1.2 },
            { l: 200, t: 70, d: 2.4 },
            { l: 30, t: 80, d: 0.6 },
          ].map((p, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: p.l,
                top: p.t,
                width: 8,
                height: 12,
                background: "#FFB7C5",
                opacity: 0.5,
                borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                animation: `petalFall 6s ${p.d}s ease-in-out infinite`,
              }}
            />
          ))}

          {/* Left content */}
          <div style={{ position: "absolute", left: 20, top: 20, right: 96 }}>
            <div style={{ fontSize: 13, color: "#E8829A", letterSpacing: "0.1em", fontWeight: 600 }}>コミュニティ</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#2C2C2C", lineHeight: 1.1, marginTop: 2 }}>
              {t("コミュニティ", "Community")}
            </div>
            <div style={{ fontSize: 12, color: "#8A8A8A", marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
              <PawPrint size={12} style={{ color: "#E8829A" }} />
              <span>{t("1,648 ワンちゃん家族", "1,648 dog families")}</span>
            </div>
          </div>
        </div>

        {/* Overlapping create button */}
        <button
          className="flex items-center gap-2"
          style={{
            position: "absolute",
            left: "50%",
            bottom: -20,
            transform: "translateX(-50%)",
            background: "linear-gradient(135deg,#E8829A,#C86882)",
            color: "#fff",
            fontSize: 14,
            fontWeight: 700,
            borderRadius: 20,
            padding: "10px 24px",
            boxShadow: "0 6px 16px rgba(232,130,154,0.35)",
            whiteSpace: "nowrap",
          }}
        >
          <PenLine size={16} />
          {t("投稿する", "Create Post")}
        </button>
      </div>

      {/* ── Stats Bar ─────────────────────────────────────────── */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 16,
          margin: "32px 16px 8px",
          padding: "12px 20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          display: "grid",
          gridTemplateColumns: "1fr 1px 1fr 1px 1fr",
          alignItems: "center",
        }}
      >
        {[
          { icon: <UsersIcon size={14} style={{ color: "#E8829A" }} />, n: "1,648", jp: "メンバー", en: "Members" },
          { icon: <FileText size={14} style={{ color: "#7B68C8" }} />, n: "3,420", jp: "投稿", en: "Posts" },
          { icon: <PawPrint size={14} style={{ color: "#6BAF92" }} />, n: "892", jp: "ワンちゃん", en: "Dogs" },
        ].map((s, i, arr) => (
          <span key={s.en} style={{ display: "contents" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                {s.icon}
                <span style={{ fontSize: 18, fontWeight: 800, color: "#2C2C2C" }} className="tabular-nums">{s.n}</span>
              </div>
              <div style={{ fontSize: 10, color: "#8A8A8A", marginTop: 2 }}>{t(s.jp, s.en)}</div>
            </div>
            {i < arr.length - 1 && <div style={{ width: 1, height: 28, background: "#F0ECE8" }} />}
          </span>
        ))}
      </div>

      {/* ── Category chips ────────────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide" style={{ padding: "12px 16px", scrollSnapType: "x mandatory" }}>
        {CATS.map((c, i) => {
          const active = sub === i;
          const isAll = i === 0;
          const style: React.CSSProperties = active
            ? isAll
              ? { background: c.soft, color: "#fff", border: "1.5px solid transparent", boxShadow: "0 4px 12px rgba(232,130,154,0.35)" }
              : { background: c.soft, color: c.accent, border: `1.5px solid ${c.accent}`, boxShadow: `0 2px 8px ${c.accent}22` }
            : { background: "#FFFFFF", color: "#8A8A8A", border: "1.5px solid #EDE8E4", boxShadow: "0 2px 6px rgba(0,0,0,0.05)" };
          return (
            <button
              key={c.en}
              onClick={() => setSub(i)}
              className="shrink-0 flex items-center gap-1.5"
              style={{
                ...style,
                borderRadius: 20,
                padding: "8px 14px",
                height: 36,
                fontSize: 13,
                fontWeight: 600,
                scrollSnapAlign: "start",
                transition: "all 0.2s ease",
              }}
            >
              <span style={{ fontSize: 14 }}>{c.emoji}</span>
              <span>{t(c.jp, c.en)}</span>
            </button>
          );
        })}
      </div>

      {/* ── Trending row ─────────────────────────────────────── */}
      <div style={{ padding: "4px 16px 8px" }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
          <div className="flex items-center gap-1.5" style={{ fontSize: 13, fontWeight: 600, color: "#2C2C2C" }}>
            <Flame size={14} style={{ color: "#E8829A" }} />
            {t("トレンド", "Trending")}
          </div>
          <button style={{ fontSize: 12, color: "#E8829A", fontWeight: 600 }}>
            {t("すべて見る →", "See all →")}
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4">
          {trending.map((p) => {
            const th = themeFor(p.flair);
            return (
              <button
                key={p.id}
                onClick={() => setOpen(p.id)}
                className="shrink-0 text-left flex flex-col justify-between"
                style={{
                  width: 160,
                  height: 100,
                  borderRadius: 16,
                  padding: 12,
                  background: `linear-gradient(135deg, ${th.gradFrom}, ${th.gradTo})`,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  color: "#fff",
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {language === "english" ? p.titleEn : p.titleJp}
                </div>
                <div className="flex items-center justify-between" style={{ fontSize: 10, opacity: 0.95 }}>
                  <span className="flex items-center gap-1">
                    <PawPrint size={10} />
                    {p.up}
                  </span>
                  <span style={{ background: "rgba(255,255,255,0.25)", padding: "2px 6px", borderRadius: 10, fontWeight: 600 }}>
                    #{language === "english" ? th.en : th.jp}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Feed ──────────────────────────────────────────────── */}
      <div style={{ paddingTop: 8, paddingBottom: 24 }}>
        {POSTS.map((p) => {
          const th = themeFor(p.flair);
          const pal = avatarPalette(p.user);
          const initial = p.user.trim()[0] ?? "?";
          const breedEmoji = BREED_EMOJI[p.breed] ?? "";
          const isLost = p.flair === "迷子";
          const up = p.up + (upvoted[p.id] ? 1 : 0);
          return (
            <motion.div
              key={p.id}
              whileTap={{ scale: 0.99 }}
              style={{
                background: "#FFFFFF",
                borderRadius: 20,
                margin: "0 16px 12px",
                boxShadow: "0 2px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
                borderLeft: `4px solid ${th.accent}`,
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* Top strip */}
              <div style={{ height: 6, background: `linear-gradient(90deg, ${th.gradFrom}, ${th.gradTo})` }} />

              <button onClick={() => setOpen(p.id)} className="w-full text-left" style={{ padding: 16 }}>
                {/* Top row */}
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div
                    className="relative shrink-0 flex items-center justify-center"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: pal.bg,
                      border: `2px solid ${th.accent}`,
                      color: pal.fg,
                      fontSize: 16,
                      fontWeight: 800,
                    }}
                  >
                    {initial}
                    <span
                      style={{
                        position: "absolute",
                        bottom: -2,
                        right: -2,
                        fontSize: 10,
                        background: "#fff",
                        borderRadius: "50%",
                        width: 16,
                        height: 16,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                      }}
                    >
                      {breedEmoji}
                    </span>
                  </div>
                  {/* User info */}
                  <div className="flex-1 min-w-0">
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#2C2C2C" }}>{p.user}</div>
                    <div className="flex items-center gap-1.5" style={{ marginTop: 3 }}>
                      <span
                        style={{
                          background: th.soft,
                          color: th.accent,
                          fontSize: 10,
                          fontWeight: 600,
                          borderRadius: 20,
                          padding: "2px 8px",
                        }}
                      >
                        {p.breed}
                      </span>
                      <span style={{ fontSize: 11, color: "#C4B8B4" }}>·</span>
                      <span style={{ fontSize: 11, color: "#C4B8B4" }}>
                        {p.time}
                        {language === "mixed" && <span style={{ marginLeft: 4, opacity: 0.7 }}>(3h ago)</span>}
                      </span>
                    </div>
                  </div>
                  {/* Flair */}
                  <div
                    className="flex items-center gap-1 shrink-0"
                    style={{
                      background: th.soft,
                      border: `1px solid ${th.ring}`,
                      borderRadius: 20,
                      padding: "4px 10px",
                      color: th.accent,
                      fontSize: 11,
                      fontWeight: 700,
                      boxShadow: `0 2px 6px ${th.accent}1f`,
                    }}
                  >
                    <span>{th.emoji}</span>
                    <span>#{language === "english" ? th.en : th.jp}</span>
                  </div>
                </div>

                {/* Lost badge */}
                {isLost && (
                  <div
                    className="pulse-red"
                    style={{
                      position: "absolute",
                      top: 14,
                      right: 14,
                      background: "#E53935",
                      color: "#fff",
                      fontSize: 10,
                      fontWeight: 800,
                      padding: "3px 8px",
                      borderRadius: 12,
                      letterSpacing: "0.05em",
                    }}
                  >
                     {t("迷子", "LOST")}
                  </div>
                )}

                {/* Title */}
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#2C2C2C",
                    lineHeight: 1.4,
                    margin: "10px 0 6px",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {language === "english" ? p.titleEn : p.titleJp}
                </div>
                {language === "mixed" && (
                  <div style={{ fontSize: 13, color: "#8A8A8A", lineHeight: 1.5 }}>{p.titleEn}</div>
                )}
              </button>

              {/* Action bar */}
              <div style={{ padding: "0 16px 14px" }}>
                <div style={{ height: 1, background: "#F5F0EC", marginBottom: 12 }} />
                <div className="flex items-center gap-2">
                  {/* Upvote */}
                  <motion.button
                    whileTap={{ scale: 1.08 }}
                    onClick={() => {
                      setUpvoted((u) => ({ ...u, [p.id]: !u[p.id] }));
                      setBurst(p.id);
                      setTimeout(() => setBurst(null), 600);
                    }}
                    className="relative flex items-center gap-1.5"
                    style={{
                      background: upvoted[p.id] ? "#E8829A" : "#FFF0F5",
                      border: `1px solid ${upvoted[p.id] ? "#E8829A" : "#FFD0DC"}`,
                      borderRadius: 20,
                      padding: "6px 12px",
                      height: 32,
                      color: upvoted[p.id] ? "#fff" : "#E8829A",
                    }}
                  >
                    <ArrowUp size={14} />
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{up}</span>
                    <AnimatePresence>
                      {burst === p.id && (
                        <>
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              initial={{ y: 0, opacity: 1, x: 0 }}
                              animate={{ y: -28 - i * 4, opacity: 0, x: (i - 1) * 10 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.6 }}
                              style={{ position: "absolute", left: "50%", top: 0, fontSize: 12, pointerEvents: "none" }}
                            >
                              
                            </motion.span>
                          ))}
                        </>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  {/* Comment */}
                  <button
                    onClick={() => setOpen(p.id)}
                    className="flex items-center gap-1.5"
                    style={{
                      background: "#EEF5FF",
                      border: "1px solid #C8E0F8",
                      borderRadius: 20,
                      padding: "6px 12px",
                      height: 32,
                      color: "#5B9BD5",
                    }}
                  >
                    <MessageCircle size={14} />
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{p.com}</span>
                  </button>

                  {/* Share */}
                  <button
                    aria-label="share"
                    className="flex items-center justify-center"
                    style={{
                      background: "#F5F5F5",
                      border: "1px solid #EDE8E4",
                      borderRadius: "50%",
                      width: 32,
                      height: 32,
                      color: "#8A8A8A",
                    }}
                  >
                    <Share2 size={14} />
                  </button>

                  <div className="flex-1" />

                  {/* Bookmark */}
                  <button
                    onClick={() => setBookmarked((b) => ({ ...b, [p.id]: !b[p.id] }))}
                    aria-label="bookmark"
                    className="flex items-center justify-center"
                    style={{
                      background: "#FFFBCC",
                      border: "1px solid #F0E4A0",
                      borderRadius: "50%",
                      width: 32,
                      height: 32,
                      color: "#D4A843",
                    }}
                  >
                    <Bookmark size={14} fill={bookmarked[p.id] ? "#D4A843" : "none"} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Load more */}
        <div className="flex justify-center" style={{ padding: "8px 16px 16px" }}>
          <button
            className="flex items-center gap-2"
            style={{
              background: "#FFFFFF",
              border: "1.5px solid #E8829A",
              color: "#E8829A",
              borderRadius: 20,
              padding: "10px 24px",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
             {t("もっと見る", "See More")}
          </button>
        </div>
      </div>

      {/* Floating compose button */}
      <button
        aria-label={t("投稿する", "Create post")}
        className="flex items-center justify-center"
        style={{
          position: "fixed",
          right: 16,
          bottom: 80,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "linear-gradient(135deg,#E8829A,#C86882)",
          color: "#fff",
          boxShadow: "0 8px 24px rgba(232,130,154,0.4)",
          zIndex: 30,
          animation: "pulseRed 2.4s infinite",
        }}
      >
        <PenLine size={22} />
      </button>

      {/* Post detail sheet */}
      {post && (() => {
        const th = themeFor(post.flair);
        return (
          <div className="fixed inset-0 z-50 flex items-end" style={{ background: "rgba(0,0,0,0.5)" }} onClick={() => setOpen(null)}>
            <motion.div
              initial={{ y: 80 }}
              animate={{ y: 0 }}
              className="w-full max-w-md mx-auto overflow-y-auto"
              style={{ background: "#FAFAF8", maxHeight: "90vh", borderRadius: "28px 28px 0 0", padding: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ width: 48, height: 5, borderRadius: 999, background: "#EDE8E4", margin: "0 auto 16px" }} />
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center"
                  style={{ width: 44, height: 44, borderRadius: "50%", background: avatarPalette(post.user).bg, color: avatarPalette(post.user).fg, border: `2px solid ${th.accent}`, fontWeight: 800 }}
                >
                  {post.user.trim()[0]}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#2C2C2C" }}>{post.user}</div>
                  <div style={{ fontSize: 11, color: "#C4B8B4" }}>{post.time} · #{language === "english" ? th.en : th.jp}</div>
                </div>
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#2C2C2C", marginTop: 14, lineHeight: 1.3 }}>
                {language === "english" ? post.titleEn : post.titleJp}
              </h2>
              {language === "mixed" && <p style={{ fontSize: 12, color: "#8A8A8A", marginTop: 4 }}>{post.titleEn}</p>}
              <p style={{ fontSize: 14, color: "#3a3a3a", marginTop: 14, lineHeight: 1.6 }}>
                {t(
                  "こんにちは皆さん。最近うちの柴犬の体温が38.8℃と少し高めです。Pawsitiveのセンサーで継続的にモニタリングしていますが、心配です。皆さんならどうしますか？",
                  "Hi everyone. My Shiba's temperature has been a little high lately at 38.8°C. Pawsitive's sensors are monitoring continuously, but I'm worried. What would you do?",
                )}
              </p>

              <div style={{ marginTop: 16, background: "#F5F0FF", border: "1px solid #DDD4F8", borderRadius: 16, padding: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#7B68C8" }}> {t("共有センサーデータ", "Collar Data Shared")}</div>
                <div className="flex justify-between" style={{ marginTop: 8, fontSize: 12 }}>
                  <div><div style={{ fontWeight: 800, color: "#2C2C2C" }}>38.8°C</div><div style={{ fontSize: 10, color: "#8A8A8A" }}>{t("体温", "Temp")}</div></div>
                  <div><div style={{ fontWeight: 800, color: "#2C2C2C" }}>{t("2,100歩", "2,100 steps")}</div><div style={{ fontSize: 10, color: "#8A8A8A" }}>{t("運動", "Activity")}</div></div>
                  <div><div style={{ fontWeight: 800, color: "#2C2C2C" }}>82</div><div style={{ fontSize: 10, color: "#8A8A8A" }}>{t("スコア", "Score")}</div></div>
                </div>
              </div>

              <h3 style={{ marginTop: 18, fontSize: 13, fontWeight: 700, color: "#2C2C2C" }}> {t("コメント", "Comments")} ({post.com})</h3>
              <div style={{ marginTop: 8 }} className="space-y-2">
                {[
                  { uJp: "獣医ヤマダ", uEn: "Vet Yamada", cJp: "少し高めですが正常範囲内です。様子を見てください。", cEn: "A little high but within normal range. Please monitor." },
                  { uJp: "柴犬ファン", uEn: "ShibaFan", cJp: "うちも夏場は同じくらいです！", cEn: "Mine is the same in summer!" },
                ].map((c) => {
                  const pal = avatarPalette(c.uEn);
                  return (
                    <div key={c.uEn} style={{ background: "#fff", borderRadius: 14, padding: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center" style={{ width: 28, height: 28, borderRadius: "50%", background: pal.bg, color: pal.fg, fontSize: 12, fontWeight: 800 }}>
                          {c.uEn[0]}
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#2C2C2C" }}>{t(c.uJp, c.uEn)}</div>
                      </div>
                      <div style={{ fontSize: 13, color: "#3a3a3a", marginTop: 6 }}>{t(c.cJp, c.cEn)}</div>
                    </div>
                  );
                })}
              </div>

              <button
                className="w-full"
                style={{
                  marginTop: 18,
                  background: "linear-gradient(135deg,#E8829A,#C86882)",
                  color: "#fff",
                  borderRadius: 20,
                  padding: "14px 0",
                  fontSize: 14,
                  fontWeight: 700,
                  boxShadow: "0 6px 16px rgba(232,130,154,0.35)",
                }}
              >
                 {t("プロに聞く", "Ask a Pro Vet")}
              </button>
            </motion.div>
          </div>
        );
      })()}
    </AppShell>
  );
}
