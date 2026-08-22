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
        style={{
          position: "relative",
          overflow: "hidden",
          width: "100%",
          maxWidth: 430,
          minHeight: "100dvh",
          background: "var(--bg-page)",
          boxShadow: "0 0 40px color-mix(in oklab, var(--acc-deep) 10.0%, transparent)",
          ...innerStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
}
