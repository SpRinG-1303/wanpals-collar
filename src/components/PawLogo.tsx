import pawLogo from "@/assets/paw-logo.webp";

export function PawLogo({ size = 32, color = "#E87090" }: { size?: number; color?: string }) {
  return (
    <span
      aria-hidden
      style={{
        display: "inline-block",
        width: size,
        height: size,
        background: color,
        WebkitMaskImage: `url(${pawLogo})`,
        maskImage: `url(${pawLogo})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}

export default PawLogo;
