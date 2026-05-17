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
    updatePet({ avatarStatus: "ghibli_ready", path: "A" });
    nav({ to: "/onboarding/owner" });
  };

  const onBuildOwn = () => {
    updatePet({ path: "B" });
    nav({ to: "/onboarding/avatar" });
  };

  return (
    <PhoneFrame>
      <div
        className="min-h-screen pb-32"
        style={{ background: "#F5EDE8", fontFamily: "'Nunito','Quicksand',system-ui,sans-serif" }}
      >
        <div className="px-6 pt-4">
          <TopBar to="/onboarding/welcome" />
          <Stepper current={1} path={pet.path} />

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

          {/* Animation display field */}
          <AnimationField
            ghibliUrl={dogUrl}
            onRetake={() => { setDogUrl(null); openSheet("dog"); }}
          />

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
                🎨 {t("自分で作りたい？", "Prefer to build it yourself?")}
              </div>
              <div className="text-[10px] mt-0.5 leading-snug" style={{ color: "#A38B82" }}>
                {t(
                  "写真をスキップしてアバターをカスタマイズ。",
                  "Skip photos and customise your avatar"
                )}
              </div>
            </div>
            <button
              onClick={onBuildOwn}
              className="text-[11px] font-bold px-3 py-1.5 rounded-full"
              style={{ background: "#FFF0F5", color: "#E8678A", border: "1.5px solid #E8678A" }}
            >
              {t("自分で作る", "Build My Own")} →
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

/* ============================================================ */
/*  Animation Display Field                                     */
/* ============================================================ */

function AnimationField({
  ghibliUrl,
  onRetake,
}: {
  ghibliUrl: string | null;
  onRetake: () => void;
}) {
  const t = useT();
  const [showTransition, setShowTransition] = useState(false);
  const prevUrl = useRef<string | null>(null);

  useEffect(() => {
    if (ghibliUrl && !prevUrl.current) {
      setShowTransition(true);
      const id = setTimeout(() => setShowTransition(false), 650);
      prevUrl.current = ghibliUrl;
      return () => clearTimeout(id);
    }
    if (!ghibliUrl) prevUrl.current = null;
  }, [ghibliUrl]);

  return (
    <div
      className="mt-5 relative overflow-hidden"
      style={{
        minHeight: 240,
        borderRadius: 24,
        background: "#FFFFFF",
        border: "1px solid #F4C0D1",
        boxShadow: "0 4px 18px rgba(232,103,138,0.06)",
      }}
    >
      {!ghibliUrl && <AnimatedKawaiiDog />}

      {ghibliUrl && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ animation: "afSlideIn 0.6s cubic-bezier(0.34,1.56,0.64,1)" }}
        >
          {/* Orbiting sparkles */}
          <div className="absolute inset-0 pointer-events-none">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  top: "50%", left: "50%",
                  width: 180, height: 180, marginLeft: -90, marginTop: -90,
                  animation: `afOrbit ${6 + i * 2}s linear infinite`,
                  animationDelay: `${i * -2}s`,
                }}
              >
                <Sparkle
                  style={{
                    position: "absolute", top: -6, left: "50%", marginLeft: -6,
                    transform: `rotate(${i * 120}deg)`,
                  }}
                />
              </div>
            ))}
          </div>

          <div
            className="relative"
            style={{
              animation: "afBreathe 3s ease-in-out infinite",
            }}
          >
            <img
              src={ghibliUrl}
              alt="Ghibli"
              style={{
                width: 168, height: 168, objectFit: "cover",
                borderRadius: 20,
                boxShadow: "0 0 0 4px #FFF0F5, 0 10px 28px rgba(232,103,138,0.28)",
              }}
            />
            <span
              className="absolute"
              style={{
                top: -8, right: -8,
                background: "#E8678A", color: "#fff",
                fontSize: 11, fontWeight: 700,
                padding: "5px 10px", borderRadius: 999,
                boxShadow: "0 4px 10px rgba(232,103,138,0.4)",
              }}
            >
              ✨ Ghibli-fied!
            </span>
          </div>

          <button
            onClick={onRetake}
            className="absolute"
            style={{
              bottom: 12, left: "50%", transform: "translateX(-50%)",
              fontSize: 11, color: "#E8678A", fontWeight: 600,
            }}
          >
            ↺ {t("撮り直し", "Retake")}
          </button>
        </div>
      )}

      {showTransition && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {[0, 60, 120, 180, 240, 300].map((deg, i) => (
            <span
              key={i}
              style={{
                position: "absolute",
                width: 14, height: 14,
                transform: `rotate(${deg}deg) translateY(-40px)`,
                animation: "afBurst 0.5s ease-out forwards",
                animationDelay: `${i * 0.03}s`,
              }}
            >
              <Sparkle />
            </span>
          ))}
        </div>
      )}

      <style>{`
        @keyframes afSlideIn {
          0% { transform: translateX(-40%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes afBreathe {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes afOrbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes afBurst {
          0% { opacity: 0; transform: scale(0.2) rotate(var(--r,0deg)); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: scale(1.6) rotate(var(--r,0deg)) translateY(-60px); }
        }
      `}</style>
    </div>
  );
}

function Sparkle({ style }: { style?: React.CSSProperties }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" style={style}>
      <path d="M6 0 L7 5 L12 6 L7 7 L6 12 L5 7 L0 6 L5 5 Z" fill="#F48BA9" />
    </svg>
  );
}

function AnimatedKawaiiDog() {
  // Single 3.7s master timeline:
  //  0  -21.6% running
  // 21.6-37.8% jump
  // 37.8-59.5% spin
  // 59.5-73%   land bounce
  // 73 -100%   sit + wag
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Ground line */}
      <div
        style={{
          position: "absolute", bottom: 36, left: 24, right: 24, height: 1,
          background: "linear-gradient(90deg,transparent,#F4C0D1,transparent)",
        }}
      />

      {/* Floating heart (sit phase) */}
      <svg width="14" height="14" viewBox="0 0 14 14"
        style={{
          position: "absolute", top: "50%", left: "50%",
          marginLeft: -7, marginTop: -60,
          animation: "kdHeart 3.7s ease-out infinite",
          opacity: 0,
        }}
      >
        <path d="M7 12 C2 8 0 5 2 3 C4 1 6 3 7 4 C8 3 10 1 12 3 C14 5 12 8 7 12 Z" fill="#F48BA9" />
      </svg>

      {/* Speed lines (run phase) */}
      <div
        style={{
          position: "absolute", top: "50%", left: 30, marginTop: 0,
          width: 30, height: 24,
          animation: "kdSpeed 3.7s linear infinite",
          opacity: 0,
        }}
      >
        {[0, 8, 16].map((y) => (
          <span key={y} style={{
            position: "absolute", top: y, left: 0,
            width: 24, height: 2, borderRadius: 2, background: "#F4C0D1",
          }} />
        ))}
      </div>

      {/* Dust puff (land phase) */}
      {[-1, 1].map((dir) => (
        <span key={dir}
          style={{
            position: "absolute", bottom: 30, left: "50%",
            marginLeft: dir * 14 - 4,
            width: 8, height: 8, borderRadius: "50%",
            background: "#F5EDE8",
            animation: "kdDust 3.7s ease-out infinite",
            opacity: 0,
          }}
        />
      ))}

      {/* Dog container — translate + rotate over the timeline */}
      <div
        style={{
          position: "absolute", top: "50%", left: "50%",
          width: 100, height: 100, marginLeft: -50, marginTop: -50,
          animation: "kdMove 3.7s cubic-bezier(0.34,1.56,0.64,1) infinite",
        }}
      >
        <div
          id="anim-dog-spin"
          style={{
            width: "100%", height: "100%",
            animation: "kdSpin 3.7s cubic-bezier(0.34,1.56,0.64,1) infinite",
            transformOrigin: "50% 50%",
          }}
        >
          <KawaiiDogSVG />
        </div>
      </div>

      <style>{`
        /* Master translate across the field + landing squish */
        @keyframes kdMove {
          0%   { transform: translateX(-100px) translateY(0) scale(1,1); }   /* run start */
          21.6%{ transform: translateX(50px) translateY(0) scale(1,1); }     /* run end / takeoff */
          30%  { transform: translateX(60px) translateY(-46px) scale(1,1); } /* peak jump */
          37.8%{ transform: translateX(40px) translateY(-50px) scale(1,1); } /* spin start */
          59.5%{ transform: translateX(10px) translateY(-44px) scale(1,1); } /* spin end */
          66%  { transform: translateX(0) translateY(0) scale(1.2,0.8); }    /* land squish */
          73%  { transform: translateX(0) translateY(0) scale(1,1); }        /* recovered */
          100% { transform: translateX(0) translateY(0) scale(1,1); }        /* sit + wag */
        }
        /* 360 rotation during the spin window */
        @keyframes kdSpin {
          0%, 37.8% { transform: rotate(0deg); }
          59.5%     { transform: rotate(360deg); }
          100%      { transform: rotate(360deg); }
        }
        @keyframes kdHeart {
          0%, 80% { opacity: 0; transform: translateY(0); }
          85% { opacity: 1; transform: translateY(-6px); }
          100% { opacity: 0; transform: translateY(-30px); }
        }
        @keyframes kdSpeed {
          0%, 22% { opacity: 0; transform: translateX(0); }
          5% { opacity: 1; }
          18% { opacity: 0.8; transform: translateX(-12px); }
          22.1%, 100% { opacity: 0; }
        }
        @keyframes kdDust {
          0%, 64% { opacity: 0; transform: scale(0.4); }
          68% { opacity: 1; transform: scale(1.2); }
          74% { opacity: 0; transform: scale(1.6); }
          100% { opacity: 0; }
        }
        /* Tail wag accelerates during sit phase */
        @keyframes kdTail {
          0%, 73% { transform: rotate(-10deg); }
          76% { transform: rotate(30deg); }
          80% { transform: rotate(-25deg); }
          84% { transform: rotate(30deg); }
          88% { transform: rotate(-25deg); }
          92% { transform: rotate(30deg); }
          96% { transform: rotate(-25deg); }
          100% { transform: rotate(-10deg); }
        }
        /* Head tilt during sit phase */
        @keyframes kdHead {
          0%, 73% { transform: rotate(0deg); }
          80% { transform: rotate(-12deg); }
          88% { transform: rotate(12deg); }
          100% { transform: rotate(0deg); }
        }
        /* Legs alternate during run */
        @keyframes kdLegA {
          0% { transform: rotate(-25deg); }
          10% { transform: rotate(25deg); }
          21.6% { transform: rotate(-25deg); }
          30% { transform: translateY(2px) rotate(20deg); }   /* tucked */
          59.5% { transform: translateY(2px) rotate(20deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes kdLegB {
          0% { transform: rotate(25deg); }
          10% { transform: rotate(-25deg); }
          21.6% { transform: rotate(25deg); }
          30% { transform: translateY(2px) rotate(-20deg); }
          59.5% { transform: translateY(2px) rotate(-20deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes kdEarFlap {
          0% { transform: rotate(0deg); }
          10% { transform: rotate(-20deg); }
          21.6% { transform: rotate(0deg); }
          30% { transform: rotate(-30deg); }
          73% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
        /* Eyes close (^_^) during jump */
        @keyframes kdEye {
          0%, 21.6% { transform: scaleY(1); }
          25% { transform: scaleY(0.1); }
          37% { transform: scaleY(0.1); }
          40% { transform: scaleY(1); }
          100% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}

function KawaiiDogSVG() {
  const FUR = "#C17D4A";
  const FUR_D = "#A66838";
  const CREAM = "#F0D0A0";
  const BLUSH = "#F48BA9";
  const OUTLINE = "#2B1810";
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: "visible" }}>
      {/* Tail */}
      <g id="anim-dog-tail" style={{ transformOrigin: "32px 58px", animation: "kdTail 3.7s ease-in-out infinite" }}>
        <path d="M32 58 Q22 50 24 40 Q26 36 30 38" fill={FUR} stroke={OUTLINE} strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Back legs */}
      <g id="anim-dog-leg-back-left"
        style={{ transformOrigin: "40px 70px", animation: "kdLegA 3.7s ease-in-out infinite" }}>
        <rect x="36" y="68" width="8" height="14" rx="4" fill={FUR} stroke={OUTLINE} strokeWidth="2" />
      </g>
      <g id="anim-dog-leg-back-right"
        style={{ transformOrigin: "48px 70px", animation: "kdLegB 3.7s ease-in-out infinite" }}>
        <rect x="44" y="68" width="8" height="14" rx="4" fill={FUR_D} stroke={OUTLINE} strokeWidth="2" />
      </g>

      {/* Body */}
      <ellipse id="anim-dog-body" cx="52" cy="60" rx="22" ry="14" fill={FUR} stroke={OUTLINE} strokeWidth="2" />
      <ellipse cx="56" cy="62" rx="14" ry="8" fill={CREAM} opacity="0.7" />

      {/* Front legs */}
      <g id="anim-dog-leg-front-left"
        style={{ transformOrigin: "60px 70px", animation: "kdLegB 3.7s ease-in-out infinite" }}>
        <rect x="56" y="68" width="8" height="14" rx="4" fill={FUR} stroke={OUTLINE} strokeWidth="2" />
      </g>
      <g id="anim-dog-leg-front-right"
        style={{ transformOrigin: "68px 70px", animation: "kdLegA 3.7s ease-in-out infinite" }}>
        <rect x="64" y="68" width="8" height="14" rx="4" fill={FUR_D} stroke={OUTLINE} strokeWidth="2" />
      </g>

      {/* Head group (tilts during sit) */}
      <g id="anim-dog-head" style={{ transformOrigin: "68px 42px", animation: "kdHead 3.7s ease-in-out infinite" }}>
        {/* Ears */}
        <g id="anim-dog-ear-left"
          style={{ transformOrigin: "60px 32px", animation: "kdEarFlap 3.7s ease-in-out infinite" }}>
          <path d="M58 32 Q54 22 62 24 L64 34 Z" fill={FUR_D} stroke={OUTLINE} strokeWidth="2" strokeLinejoin="round" />
        </g>
        <g id="anim-dog-ear-right"
          style={{ transformOrigin: "76px 32px", animation: "kdEarFlap 3.7s ease-in-out infinite", animationDelay: "0.05s" }}>
          <path d="M76 32 Q80 22 72 24 L70 34 Z" fill={FUR_D} stroke={OUTLINE} strokeWidth="2" strokeLinejoin="round" />
        </g>

        {/* Head */}
        <circle cx="68" cy="42" r="16" fill={FUR} stroke={OUTLINE} strokeWidth="2" />
        {/* Muzzle */}
        <ellipse cx="74" cy="48" rx="10" ry="7" fill={CREAM} stroke={OUTLINE} strokeWidth="2" />
        {/* Nose */}
        <ellipse cx="80" cy="46" rx="2.5" ry="2" fill={OUTLINE} />
        {/* Blush */}
        <circle cx="62" cy="48" r="2.5" fill={BLUSH} opacity="0.7" />
        <circle cx="82" cy="52" r="2.5" fill={BLUSH} opacity="0.7" />
        {/* Eyes */}
        <g id="anim-dog-eye-left" style={{ transformOrigin: "64px 40px", animation: "kdEye 3.7s ease-in-out infinite" }}>
          <circle cx="64" cy="40" r="2" fill={OUTLINE} />
          <circle cx="64.5" cy="39.5" r="0.6" fill="#fff" />
        </g>
        <g id="anim-dog-eye-right" style={{ transformOrigin: "74px 40px", animation: "kdEye 3.7s ease-in-out infinite" }}>
          <circle cx="74" cy="40" r="2" fill={OUTLINE} />
          <circle cx="74.5" cy="39.5" r="0.6" fill="#fff" />
        </g>
        {/* Tongue */}
        <path id="anim-dog-tongue" d="M77 50 Q79 54 81 50 Z" fill={BLUSH} stroke={OUTLINE} strokeWidth="1" />
      </g>
    </svg>
  );
}
