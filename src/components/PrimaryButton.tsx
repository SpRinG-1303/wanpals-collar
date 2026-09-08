import { PawPrint } from "lucide-react";

export function PrimaryButton({
  children,
  onClick,
  accent = "var(--accent-sakura)",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  accent?: string;
}) {
  const darker = accent === "var(--acc2-strong)" ? "var(--acc2-deep)" : "var(--accent-sakura-dark)";
  return (
    <button
      onClick={onClick}
      className="w-full h-[52px] rounded-2xl text-primary-foreground font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
      style={{
        fontSize: 15,
        background: `linear-gradient(135deg, ${accent}, ${darker})`,
        boxShadow: "0 10px 24px color-mix(in oklab, var(--acc-strong) 24%, transparent)",
      }}
    >
      <PawPrint className="w-4 h-4" strokeWidth={2.2} />
      {children}
    </button>
  );
}
