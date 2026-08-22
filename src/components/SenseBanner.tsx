/**
 * Shared sense-page banner. Soft pastel gradient, dark navy title,
 * white LIVE pill. Flat bottom edge, 186px tall.
 */
export function SenseBanner({
  subtitleEn,
  titleEn,
  descriptorEn,
  bgGradient,
  subtitleColor,
}: {
  subtitleEn: string;
  titleEn: string;
  descriptorEn: string;
  bgGradient: string;
  subtitleColor: string;
}) {
  return (
    <>
      <style>{`
        @keyframes sbLiveDot { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.3);opacity:.55} }
      `}</style>
      <div
        style={{
          position: "relative",
          zIndex: 1,
          height: 186,
          padding: "20px 20px 36px 20px",
          background: bgGradient,
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: subtitleColor,
                letterSpacing: "0.08em",
                lineHeight: 1.2,
                textTransform: "uppercase",
              }}
            >
              {subtitleEn}
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: "var(--text-primary)",
                lineHeight: 1.15,
                marginTop: 4,
                letterSpacing: "-0.01em",
              }}
            >
              {titleEn}
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 400,
                color: "var(--text-secondary)",
                marginTop: 6,
                lineHeight: 1.3,
              }}
            >
              {descriptorEn}
            </div>
          </div>
          <span
            className="inline-flex items-center"
            style={{
              flexShrink: 0,
              background: "#FFFFFF",
              color: "var(--text-primary)",
              borderRadius: 50,
              padding: "5px 11px 5px 9px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              gap: 6,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#E53935",
                animation: "sbLiveDot 1.5s ease-in-out infinite",
              }}
            />
            LIVE
          </span>
        </div>
      </div>
    </>
  );
}
