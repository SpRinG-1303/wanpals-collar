import { PawLogo } from "@/components/PawLogo";

export function HeroIllustration({ compact = false }: { compact?: boolean }) {
  const H = compact ? 220 : 260;
  const logo = compact ? 56 : 72;
  const titleSize = compact ? 22 : 24;
  const tagSize = compact ? 11 : 12;
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height: H,
        background: "linear-gradient(160deg, #FFF0F5 0%, #F5F0FF 50%, #F0F5FF 100%)",
      }}
    >
      <div
        className="absolute -top-16 -right-16 rounded-full"
        style={{ width: 200, height: 200, background: "#FFD4E8", opacity: 0.5, filter: "blur(40px)" }}
      />
      {[
        { l: "20%", t: "30%", s: 8, c: "#FFB7C5", d: 0 },
        { l: "70%", t: "20%", s: 10, c: "#FFD4DC", d: 1 },
        { l: "85%", t: "55%", s: 6, c: "#FFB7C5", d: 2 },
        { l: "15%", t: "65%", s: 9, c: "#FFD4DC", d: 3 },
        { l: "55%", t: "75%", s: 7, c: "#FFB7C5", d: 1.5 },
      ].map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: p.l, top: p.t, width: p.s, height: p.s * 1.4,
            background: p.c, transform: `rotate(${i * 35}deg)`,
            animation: `petalFall 10s ease-in-out ${p.d}s infinite`,
          }}
        />
      ))}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div
          className="rounded-full bg-white flex items-center justify-center"
          style={{ width: logo, height: logo, border: "2px solid #FFE4EC", boxShadow: "0 8px 24px rgba(232,130,154,0.2)" }}
        >
          <PawLogo size={logo * 0.55} color="#E8829A" />
        </div>
        <div className="mt-2 font-bold leading-none" style={{ color: "#2C2C2C", fontSize: titleSize, letterSpacing: "0.05em" }}>
          Pawsitive
        </div>
        <div className="mt-2 italic text-center" style={{ color: "#8A8A8A", fontSize: tagSize }}>
          Closer to your beloved dog.
        </div>
      </div>
    </div>
  );
}
