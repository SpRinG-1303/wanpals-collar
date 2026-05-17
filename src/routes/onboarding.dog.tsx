import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Camera, Image as ImageIcon, RotateCcw } from "lucide-react";
import PhoneFrame from "@/components/PhoneFrame";
import DogAvatar from "@/components/DogAvatar";
import { Stepper, TopBar } from "@/routes/onboarding.avatar";
import { useT } from "@/context/LanguageContext";
import { usePet } from "@/context/PetContext";
import type { BreedKey, EarStyle, EyeStyle } from "@/components/DogAvatar";

export const Route = createFileRoute("/onboarding/dog")({ component: Step2 });

/**
 * STEP 2 — Ghibli photo upload.
 *
 * Backend pipeline (documented for handoff, not executed in app):
 *   1. User uploads dog + owner photos → POST to Replicate API
 *      Model: cjwbw/animegan2-pytorch (or Ghibli LoRA)
 *      Returns: Ghibli-style PNG
 *   2. PNG → vtracer worker (mode=spline, colormode=color,
 *      filter_speckle=4, color_precision=6, layer_difference=16,
 *      corner_threshold=60, segment_length=4.0) → SVG
 *   3. SVG stored at avatars/{user_id}/pose_{pose_id}.svg
 *   4. user.avatarStatus = "ready"
 *   5. App listens (Firebase onSnapshot / WebSocket) and replaces
 *      shimmer cards with rendered SVGs.
 */

type SheetTarget = null | "dog" | "owner";

function Step2() {
  const nav = useNavigate();
  const t = useT();
  const { language } = useLanguage();
  const { pet, updatePet } = usePet();

  const [dogUrl, setDogUrl] = useState<string | null>(pet.dogPhotoUrl);
  const [ownerUrl, setOwnerUrl] = useState<string | null>(pet.ownerPhotoUrl);
  const [dogLoading, setDogLoading] = useState(false);
  const [ownerLoading, setOwnerLoading] = useState(false);
  const [sheet, setSheet] = useState<SheetTarget>(null);

  const dogCamRef = useRef<HTMLInputElement>(null);
  const dogGalRef = useRef<HTMLInputElement>(null);
  const ownerCamRef = useRef<HTMLInputElement>(null);
  const ownerGalRef = useRef<HTMLInputElement>(null);

  const handleFile = (target: "dog" | "owner", file: File | undefined) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const setLoading = target === "dog" ? setDogLoading : setOwnerLoading;
    const setUrl = target === "dog" ? setDogUrl : setOwnerUrl;
    setLoading(true);
    // Simulated shimmer / Ghibli conversion delay
    setTimeout(() => {
      setUrl(url);
      setLoading(false);
      updatePet(
        target === "dog"
          ? { dogPhotoUrl: url, avatarStatus: "ghibli_pending" }
          : { ownerPhotoUrl: url, avatarStatus: "ghibli_pending" }
      );
    }, 900);
  };

  const openSheet = (target: "dog" | "owner") => setSheet(target);
  const closeSheet = () => setSheet(null);

  const triggerCamera = () => {
    if (sheet === "dog") dogCamRef.current?.click();
    else if (sheet === "owner") ownerCamRef.current?.click();
    closeSheet();
  };
  const triggerGallery = () => {
    if (sheet === "dog") dogGalRef.current?.click();
    else if (sheet === "owner") ownerGalRef.current?.click();
    closeSheet();
  };

  const bothReady = !!dogUrl && !!ownerUrl;

  const onGenerate = () => {
    updatePet({ avatarStatus: "ghibli_ready" });
    nav({ to: "/onboarding/owner" });
  };

  return (
    <PhoneFrame>
      <div
        className="min-h-screen pb-32"
        style={{ background: "#F5EDE8", fontFamily: "'Nunito','Quicksand',system-ui,sans-serif" }}
      >
        <div className="px-6 pt-4">
          <TopBar to="/onboarding/avatar" />
          <Stepper current={2} />

          <h1 className="text-[22px] font-extrabold text-center mt-2" style={{ color: "#3B2A23" }}>
            {t("ギブリ写真を追加", "Add Your Ghibli Photos")}
          </h1>
          <p className="text-center text-[13px] mt-2 leading-relaxed" style={{ color: "#8A766C" }}>
            {t(
              "ワンちゃんとあなたの写真をアップロード。美しいジブリ風のアート作品に変身させます ✨",
              "Upload photos of your dog and yourself. We'll transform them into a beautiful Ghibli-style art duo ✨"
            )}
          </p>

          {/* Upload pair */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <UploadCard
              label={t("ワンちゃん", "Your Dog")}
              placeholderEmoji="🐕"
              imageUrl={dogUrl}
              loading={dogLoading}
              onTap={() => openSheet("dog")}
              onRetake={() => { setDogUrl(null); openSheet("dog"); }}
            />
            <UploadCard
              label={t("オーナー", "You (Owner)")}
              placeholderEmoji="🧑"
              imageUrl={ownerUrl}
              loading={ownerLoading}
              onTap={() => openSheet("owner")}
              onRetake={() => { setOwnerUrl(null); openSheet("owner"); }}
            />
          </div>

          {/* Hidden file inputs */}
          <input ref={dogCamRef} type="file" accept="image/*" capture="environment"
            className="hidden" onChange={(e) => handleFile("dog", e.target.files?.[0])} />
          <input ref={dogGalRef} type="file" accept="image/*"
            className="hidden" onChange={(e) => handleFile("dog", e.target.files?.[0])} />
          <input ref={ownerCamRef} type="file" accept="image/*" capture="user"
            className="hidden" onChange={(e) => handleFile("owner", e.target.files?.[0])} />
          <input ref={ownerGalRef} type="file" accept="image/*"
            className="hidden" onChange={(e) => handleFile("owner", e.target.files?.[0])} />

          {/* Ghibli tip */}
          <div
            className="mt-5 p-4 rounded-2xl flex gap-3"
            style={{ background: "#FFF0F5", border: "1px solid #FBD9E1" }}
          >
            <div className="text-[20px] leading-none">🎨</div>
            <div className="text-[12px] leading-relaxed" style={{ color: "#6E4C53" }}>
              <span className="font-bold">{t("使い方：", "How it works: ")}</span>
              {t(
                "写真はジブリ風AIモデルに送信されます。結果は柔らかく絵画的なアニメ風イラストで、実写ではありません。明るく顔がはっきり写った写真がベストです。",
                "Your photos are sent to a Ghibli-style AI model. The result is a soft, painterly anime illustration — not a realistic photo. Best results with clear, well-lit face shots."
              )}
            </div>
          </div>

          {/* Integration note */}
          <div
            className="mt-3 p-3 rounded-2xl"
            style={{ background: "#FFF6E8", border: "1.5px dashed #E8B36B" }}
          >
            <div className="text-[10px] leading-relaxed font-mono" style={{ color: "#8A6535" }}>
              <span className="font-bold">Integration:</span> Replicate API → animegan2-pytorch.
              Returns Ghibli-style PNG. Silently converted to SVG via vtracer
              (color mode, spline curves) for crisp rendering at all sizes. SVG stored & served back.
            </div>
          </div>

          {/* Skip / fallback */}
          <div
            className="mt-5 p-4 rounded-2xl flex items-center gap-3"
            style={{ background: "#FFFFFF", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}
          >
            <DogAvatar
              breed={(pet.breed as BreedKey) || "shiba"}
              furColor={pet.avatar.furColor}
              earStyle={pet.avatar.earStyle as EarStyle}
              eyeStyle={pet.avatar.eyeStyle as EyeStyle}
              collarColor={pet.avatar.collarColor}
              size={56}
              ring={false}
            />
            <div className="flex-1">
              <div className="text-[12px] font-bold" style={{ color: "#3B2A23" }}>
                {t("または、アバターを使う", "Or skip & use your avatar")}
              </div>
              <div className="text-[10px] mt-0.5 leading-snug" style={{ color: "#A38B82" }}>
                {t(
                  "ステップ1のアバターをフォールバックとして使用します。",
                  "Step 1 avatar will be used as fallback."
                )}
              </div>
            </div>
            <button
              onClick={() => nav({ to: "/onboarding/owner" })}
              className="text-[11px] font-bold px-3 py-1.5 rounded-full"
              style={{ background: "#FFF0F5", color: "#E8678A" }}
            >
              {t("スキップ", "Skip")}
            </button>
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          className="fixed bottom-0 inset-x-0 mx-auto p-4"
          style={{
            maxWidth: 430,
            background: "linear-gradient(to top, #F5EDE8, rgba(245,237,232,0.9) 70%, transparent)",
          }}
        >
          <button
            onClick={onGenerate}
            disabled={!bothReady}
            className="w-full h-14 rounded-full text-[15px] font-bold transition-all"
            style={{
              background: bothReady
                ? "linear-gradient(135deg,#E8678A 0%,#F48BA9 100%)"
                : "#E5D5CC",
              color: "#FFFFFF",
              boxShadow: bothReady
                ? "0 8px 24px rgba(232,103,138,0.35)"
                : "none",
              animation: bothReady ? "pulseGlow 1.8s ease-in-out infinite" : "none",
              opacity: bothReady ? 1 : 0.7,
            }}
          >
            ✨ {t("ポーズを生成", "Generate Poses")} →
          </button>
        </div>

        <style>{`
          @keyframes pulseGlow {
            0%,100% { box-shadow: 0 8px 24px rgba(232,103,138,0.35); }
            50% { box-shadow: 0 8px 32px rgba(232,103,138,0.6), 0 0 0 6px rgba(232,103,138,0.08); }
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          @keyframes sheetUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        `}</style>
      </div>

      {/* Bottom sheet */}
      {sheet && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: "rgba(0,0,0,0.35)", animation: "fadeIn 0.2s ease" }}
          onClick={closeSheet}
        >
          <div
            className="w-full"
            style={{
              maxWidth: 430,
              background: "#FFFFFF",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              animation: "sheetUp 0.28s cubic-bezier(.2,.9,.3,1.2)",
              paddingBottom: 28,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 pb-2">
              <span style={{ width: 40, height: 4, borderRadius: 2, background: "#E5D5CC" }} />
            </div>
            <div className="px-5 pt-2 pb-2 text-[12px] font-bold" style={{ color: "#A38B82" }}>
              {sheet === "dog"
                ? t("ワンちゃんの写真を選ぶ", "Choose dog photo")
                : t("あなたの写真を選ぶ", "Choose your photo")}
            </div>
            <SheetRow
              icon={<Camera className="w-5 h-5" />}
              label={
                sheet === "dog"
                  ? t("ワンちゃんを撮影 🐕", "Take my dog's photo 🐕")
                  : t("セルフィーを撮る 🤳", "Take a selfie 🤳")
              }
              onClick={triggerCamera}
            />
            <SheetRow
              icon={<ImageIcon className="w-5 h-5" />}
              label={t("ギャラリーから選ぶ", "Choose from gallery")}
              onClick={triggerGallery}
            />
            <button
              onClick={closeSheet}
              className="w-full text-center py-4 text-[14px] font-medium"
              style={{ color: "#A38B82" }}
            >
              {t("キャンセル", "Cancel")}
            </button>
          </div>
        </div>
      )}
    </PhoneFrame>
  );
}

function SheetRow({
  icon, label, onClick,
}: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 px-6 py-4 text-left transition-colors"
      style={{ color: "#3B2A23" }}
    >
      <span
        className="flex items-center justify-center"
        style={{
          width: 40, height: 40, borderRadius: 999,
          background: "#FFF0F5", color: "#E8678A",
        }}
      >
        {icon}
      </span>
      <span className="text-[15px] font-bold">{label}</span>
    </button>
  );
}

function UploadCard({
  label, placeholderEmoji, imageUrl, loading, onTap, onRetake,
}: {
  label: string;
  placeholderEmoji: string;
  imageUrl: string | null;
  loading: boolean;
  onTap: () => void;
  onRetake: () => void;
}) {
  const t = useT();
  const hasImage = !!imageUrl && !loading;

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={onTap}
        className="w-full aspect-square rounded-3xl overflow-hidden flex items-center justify-center transition-all relative"
        style={{
          background: hasImage ? "#FFFFFF" : "#FFFAF7",
          border: hasImage
            ? "2px solid #E8678A"
            : "2px dashed #E5C8B8",
          boxShadow: hasImage
            ? "0 8px 20px rgba(232,103,138,0.18)"
            : "0 2px 10px rgba(0,0,0,0.04)",
        }}
      >
        {loading && (
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, #F5EDE8 0%, #FFF0F5 50%, #F5EDE8 100%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.4s linear infinite",
            }}
          />
        )}
        {!loading && imageUrl && (
          <img
            src={imageUrl}
            alt={label}
            className="w-full h-full object-cover"
            style={{ borderRadius: 22 }}
          />
        )}
        {!loading && !imageUrl && (
          <div className="flex flex-col items-center">
            <div className="text-[44px] leading-none">{placeholderEmoji}</div>
            <div
              className="text-[11px] font-medium mt-2 px-2 text-center"
              style={{ color: "#A38B82" }}
            >
              {t("タップして写真をアップロード", "Tap to upload photo")}
            </div>
          </div>
        )}
      </button>
      <div className="text-[12px] font-bold mt-2" style={{ color: "#3B2A23" }}>
        {label}
      </div>
      {hasImage && (
        <button
          onClick={onRetake}
          className="mt-1 flex items-center gap-1 text-[10px] font-medium"
          style={{ color: "#E8678A" }}
        >
          <RotateCcw className="w-3 h-3" />
          {t("撮り直し", "Retake")}
        </button>
      )}
    </div>
  );
}
