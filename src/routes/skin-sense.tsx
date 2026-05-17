import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Camera, Upload, Sparkles, Check, AlertTriangle, Stethoscope } from "lucide-react";
import { SensorPage, Card, Bi, SP } from "@/components/SensorPage";
import { useT } from "@/context/LanguageContext";

export const Route = createFileRoute("/skin-sense")({ component: SkinSensePage });

type Severity = "mild" | "moderate" | "severe";

const SEVERITY: Record<Severity, { jp: string; en: string; color: string; bg: string }> = {
  mild:     { jp: "軽度", en: "Mild",     color: "#6BAF92", bg: "#E8F5EE" },
  moderate: { jp: "中度", en: "Moderate", color: "#D4A843", bg: "#FFF8DC" },
  severe:   { jp: "重度", en: "Severe",   color: "#D4714E", bg: "#FFE8DC" },
};

const HISTORY = [
  { date: "2025-05-12", jp: "正常", en: "Normal", score: 94, sev: "mild" as Severity, hue: "#FFE4EC" },
  { date: "2025-04-28", jp: "軽い乾燥", en: "Mild Dryness", score: 78, sev: "mild" as Severity, hue: "#FFF8DC" },
  { date: "2025-04-10", jp: "正常", en: "Normal", score: 91, sev: "mild" as Severity, hue: "#E8F5EE" },
];

function ScoreRing({ value, color }: { value: number; color: string }) {
  const r = 42, c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <svg width={110} height={110} viewBox="0 0 110 110">
      <circle cx={55} cy={55} r={r} fill="none" stroke="#F5F0EC" strokeWidth={9} />
      <circle
        cx={55} cy={55} r={r} fill="none" stroke={color} strokeWidth={9}
        strokeDasharray={c} strokeDashoffset={off}
        strokeLinecap="round"
        transform="rotate(-90 55 55)"
        style={{ transition: "stroke-dashoffset 1.2s ease" }}
      />
      <text x={55} y={58} textAnchor="middle" fontSize={24} fontWeight={800} fill={SP.sumi}>{value}</text>
      <text x={55} y={74} textAnchor="middle" fontSize={9} fill={SP.usuzumi}>/ 100</text>
    </svg>
  );
}

function SkinSensePage() {
  const t = useT();
  const [photo, setPhoto] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  const result = {
    score: 82,
    sev: "mild" as Severity,
    condJp: "軽い乾燥",
    condEn: "Mild Dryness",
    color: "#E8829A",
  };
  const sev = SEVERITY[result.sev];

  function onFile(file: File | undefined) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhoto(url);
    setDone(false);
  }

  function analyze() {
    setAnalyzing(true);
    setTimeout(() => { setAnalyzing(false); setDone(true); }, 1600);
  }

  return (
    <SensorPage
      titleJp="皮膚センサー"
      titleEn="SkinSense AI — Skin Health Analysis"
      accent={SP.sakura}
      headerGradient="linear-gradient(135deg,#FFE4EC 0%,#FFF0F5 100%)"
    >
      {/* Upload area */}
      <Card accent={SP.sakura}>
        <Bi
          jp="写真をアップロード"
          en="Upload Photo"
          jpStyle={{ fontSize: 14, fontWeight: 700, color: SP.sumi }}
          enStyle={{ fontSize: 10, color: SP.usuzumi, marginBottom: 10 }}
        />

        {!photo ? (
          <label
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault(); setDrag(false);
              onFile(e.dataTransfer.files?.[0]);
            }}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              padding: "32px 16px",
              border: `2px dashed ${drag ? SP.sakura : "#E8C8D4"}`,
              borderRadius: 16,
              background: drag ? "#FFF0F5" : "#FFF8FA",
              cursor: "pointer",
              transition: "all 0.2s ease",
              marginTop: 10,
            }}
          >
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "linear-gradient(135deg,#FFE4EC,#FFD0DC)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 12,
            }}>
              <Camera size={26} color={SP.sakura} />
            </div>
            <Bi
              jp="ワンちゃんの写真をアップロードしてAI皮膚分析"
              en="Upload your dog's photo for AI skin analysis"
              jpStyle={{ fontSize: 13, fontWeight: 600, color: SP.sumi, textAlign: "center", lineHeight: 1.4 }}
              enStyle={{ fontSize: 11, color: SP.usuzumi, textAlign: "center", marginTop: 4 }}
            />
            <div className="flex items-center" style={{ gap: 6, marginTop: 12, fontSize: 11, color: SP.sakura, fontWeight: 600 }}>
              <Upload size={12} /> {t("タップまたはドラッグ", "Tap or drag to upload")}
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => onFile(e.target.files?.[0] ?? undefined)}
            />
          </label>
        ) : (
          <div>
            <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
              <img src={photo} alt="upload" style={{ width: "100%", display: "block", aspectRatio: "4/3", objectFit: "cover" }} />
            </div>
            <div className="flex" style={{ gap: 8, marginTop: 12 }}>
              <button
                onClick={() => { setPhoto(null); setDone(false); }}
                style={{
                  flex: 1, padding: "12px", borderRadius: 12, background: "#F5F0EC",
                  fontSize: 13, fontWeight: 700, color: SP.usuzumi,
                }}
              >{t("やり直す", "Retake")}</button>
              <button
                onClick={analyze}
                disabled={analyzing}
                style={{
                  flex: 2, padding: "12px", borderRadius: 12,
                  background: "linear-gradient(135deg,#E8829A,#FFB7C5)",
                  color: "#FFFFFF", fontSize: 14, fontWeight: 800,
                  boxShadow: "0 4px 14px rgba(232,130,154,0.4)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  opacity: analyzing ? 0.7 : 1,
                }}
              >
                <Sparkles size={16} />
                {analyzing ? t("分析中...", "Analyzing...") : t("分析する", "Analyze")}
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Results */}
      {done && photo && (
        <>
          <Card accent={result.color}>
            <Bi
              jp="分析結果"
              en="Analysis Results"
              jpStyle={{ fontSize: 14, fontWeight: 700, color: SP.sumi }}
              enStyle={{ fontSize: 10, color: SP.usuzumi, marginBottom: 10 }}
            />
            <div className="flex items-center" style={{ gap: 14, marginTop: 10 }}>
              <ScoreRing value={result.score} color={result.color} />
              <div className="flex-1">
                <Bi
                  jp={result.condJp}
                  en={result.condEn}
                  jpStyle={{ fontSize: 20, fontWeight: 800, color: SP.sumi, lineHeight: 1.1 }}
                  enStyle={{ fontSize: 12, color: SP.usuzumi, marginTop: 2 }}
                />
                <div style={{ marginTop: 8 }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    background: sev.bg, color: sev.color,
                    padding: "4px 10px", borderRadius: 999,
                    fontSize: 11, fontWeight: 700, letterSpacing: "0.05em",
                  }}>
                    <AlertTriangle size={11} />
                    {t(sev.jp, sev.en)}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Detailed guide */}
          <Card accent={SP.fuji}>
            <Bi
              jp="詳細ガイド"
              en="Detailed Guide"
              jpStyle={{ fontSize: 14, fontWeight: 700, color: SP.sumi }}
              enStyle={{ fontSize: 10, color: SP.usuzumi, marginBottom: 10 }}
            />
            <div style={{ display: "grid", gap: 12, marginTop: 10 }}>
              <GuideSection
                titleJp="この症状について"
                titleEn="About this condition"
                jp="軽い乾燥は、湿度の低下や入浴後の保湿不足によって起こる一般的な皮膚状態です。フケや痒みを伴うことがあります。"
                en="Mild dryness is a common skin condition caused by low humidity or lack of moisturising after bathing. It can be accompanied by flakes and mild itching."
              />
              <GuideSection
                titleJp="考えられる原因"
                titleEn="Possible causes"
                jp="・低湿度の環境\n・頻繁すぎる入浴\n・食事中の必須脂肪酸不足\n・季節の変わり目"
                en="• Low humidity environment\n• Bathing too frequently\n• Lack of essential fatty acids in diet\n• Seasonal change"
              />
              <GuideSection
                titleJp="推奨される対応"
                titleEn="Recommended action"
                jp="保湿シャンプーを使用し、入浴は週1回程度に抑える。オメガ3を含むサプリメントを検討し、加湿器の使用も有効。"
                en="Use a moisturising shampoo and limit bathing to about once a week. Consider an omega-3 supplement and a humidifier."
              />
              <div style={{
                display: "flex", alignItems: "flex-start", gap: 8,
                padding: 12, borderRadius: 12,
                background: "#FFF8DC", border: "1px solid #F0E2A8",
              }}>
                <Stethoscope size={16} color="#C4920A" style={{ marginTop: 2 }} />
                <div>
                  <Bi
                    jp="獣医に相談すべき時"
                    en="When to see a vet"
                    jpStyle={{ fontSize: 12, fontWeight: 700, color: "#7A5A0A" }}
                    enStyle={{ fontSize: 10, color: "#A07A1F", marginTop: 1 }}
                  />
                  <Bi
                    jp="2週間以上改善が見られない、強い痒み、赤みや脱毛がある場合"
                    en="If no improvement after 2 weeks, intense itching, redness or hair loss"
                    jpStyle={{ fontSize: 12, color: "#3C3020", lineHeight: 1.5, marginTop: 4 }}
                    enStyle={{ fontSize: 10, color: SP.usuzumi, marginTop: 3 }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Similar conditions */}
          <Card accent={SP.matcha}>
            <Bi
              jp="類似する症状の例"
              en="Similar Conditions"
              jpStyle={{ fontSize: 14, fontWeight: 700, color: SP.sumi }}
              enStyle={{ fontSize: 10, color: SP.usuzumi, marginBottom: 10 }}
            />
            <div className="flex" style={{ gap: 10, marginTop: 10, overflowX: "auto" }}>
              {[
                { jp: "乾燥肌", en: "Dry Skin", hue: "#FFE4EC" },
                { jp: "フケ", en: "Dandruff", hue: "#FFF8DC" },
                { jp: "軽度湿疹", en: "Mild Eczema", hue: "#E8F5EE" },
                { jp: "季節性痒み", en: "Seasonal Itch", hue: "#E8F2FF" },
              ].map((c) => (
                <div key={c.en} style={{ minWidth: 96, flex: "0 0 auto" }}>
                  <div style={{
                    width: 96, height: 72, borderRadius: 12,
                    background: `linear-gradient(135deg, ${c.hue}, #FFFFFF)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 28,
                  }}>🐶</div>
                  <Bi
                    jp={c.jp}
                    en={c.en}
                    jpStyle={{ fontSize: 11, fontWeight: 600, color: SP.sumi, marginTop: 6, textAlign: "center" }}
                    enStyle={{ fontSize: 9, color: SP.usuzumi, textAlign: "center", marginTop: 1 }}
                  />
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {/* History */}
      <Card accent={SP.yuzu}>
        <Bi
          jp="過去の分析履歴"
          en="Analysis History"
          jpStyle={{ fontSize: 14, fontWeight: 700, color: SP.sumi }}
          enStyle={{ fontSize: 10, color: SP.usuzumi, marginBottom: 10 }}
        />
        <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
          {HISTORY.map((h) => {
            const s = SEVERITY[h.sev];
            return (
              <div key={h.date} className="flex items-center" style={{
                gap: 12, padding: 10, borderRadius: 12, background: "#FAFAF8",
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 10,
                  background: `linear-gradient(135deg, ${h.hue}, #FFFFFF)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22,
                }}>🐕</div>
                <div className="flex-1 min-w-0">
                  <Bi
                    jp={h.jp}
                    en={h.en}
                    jpStyle={{ fontSize: 13, fontWeight: 700, color: SP.sumi }}
                    enStyle={{ fontSize: 10, color: SP.usuzumi, marginTop: 1 }}
                  />
                  <div style={{ fontSize: 10, color: SP.usuzumi, marginTop: 3, fontVariantNumeric: "tabular-nums" }}>
                    {h.date}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: SP.sumi, fontVariantNumeric: "tabular-nums" }}>{h.score}</div>
                  <span style={{
                    fontSize: 9, fontWeight: 700, color: s.color, background: s.bg,
                    padding: "2px 6px", borderRadius: 999,
                  }}>{t(s.jp, s.en)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </SensorPage>
  );
}

function GuideSection({ titleJp, titleEn, jp, en }: { titleJp: string; titleEn: string; jp: string; en: string }) {
  return (
    <div>
      <div className="flex items-center" style={{ gap: 6, marginBottom: 4 }}>
        <Check size={12} color={SP.fuji} />
        <Bi
          jp={titleJp}
          en={titleEn}
          jpStyle={{ fontSize: 12, fontWeight: 700, color: SP.fuji }}
          enStyle={{ fontSize: 9, color: SP.usuzumi, marginLeft: 4 }}
          as="span"
        />
      </div>
      <Bi
        jp={jp}
        en={en}
        jpStyle={{ fontSize: 12, color: "#3C3020", lineHeight: 1.6, whiteSpace: "pre-line" }}
        enStyle={{ fontSize: 10, color: SP.usuzumi, lineHeight: 1.5, whiteSpace: "pre-line", marginTop: 4 }}
      />
    </div>
  );
}
