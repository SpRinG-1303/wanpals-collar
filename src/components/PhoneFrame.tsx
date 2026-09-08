import type { ReactNode, CSSProperties } from "react";

export default function PhoneFrame({ children, innerStyle }: { children: ReactNode; innerStyle?: CSSProperties }) {
  return (
    <div
      style={{
        background: "var(--bg-outside)",
        minHeight: "100dvh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div
        className="pawsitive-frame jaipur-buti"
        style={{
          position: "relative",
          overflow: "hidden",
          width: "100%",
          maxWidth: 430,
          minHeight: "100dvh",
          backgroundColor: "var(--bg-page)",
          borderInline: "1px solid var(--border-subtle)",
          boxShadow: "0 24px 70px rgba(22,62,56,0.12)",
          ...innerStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
}
