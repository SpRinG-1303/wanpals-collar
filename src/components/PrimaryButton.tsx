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
  const darker = accent === "#7BB5B0" ? "#5C9590" : "var(--accent-sakura-dark)";
  return (
    <button
      onClick={onClick}
      className="w-full h-[56px] rounded-[14px] text-white font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
      style={{
        fontSize: 17,
        background: `linear-gradient(135deg, ${accent}, ${darker})`,
        boxShadow: `0 8px 20px ${accent}59`,
      }}
    >
      <PawPrint className="w-4 h-4" strokeWidth={2.2} />
      {children}
    </button>
  );
}
