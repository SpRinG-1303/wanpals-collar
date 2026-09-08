import type { CSSProperties } from "react";

/* ============================================================
   Jaipur fresco motifs — hand-painted wall art translated to SVG.
   All artwork uses currentColor so it inherits the role theme.
   ============================================================ */

/** Symmetrical floral medallion (ceiling mandala). Use as a soft watermark. */
export function Mandala({ size = 220, style }: { size?: number; style?: CSSProperties }) {
  const petals = Array.from({ length: 12 });
  const buds = Array.from({ length: 16 });
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden
      style={style}
    >
      {/* outer ring of diamonds */}
      {buds.map((_, i) => {
        const a = (i / 16) * Math.PI * 2;
        const x = 100 + Math.cos(a) * 92;
        const y = 100 + Math.sin(a) * 92;
        return (
          <rect
            key={`d${i}`}
            x={x - 3.4}
            y={y - 3.4}
            width={6.8}
            height={6.8}
            fill="currentColor"
            transform={`rotate(45 ${x} ${y})`}
          />
        );
      })}
      {/* ring of blossoms */}
      {petals.map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const x = 100 + Math.cos(a) * 70;
        const y = 100 + Math.sin(a) * 70;
        return (
          <g key={`f${i}`} transform={`translate(${x} ${y}) rotate(${(i / 12) * 360})`}>
            {Array.from({ length: 8 }).map((__, j) => {
              const b = (j / 8) * Math.PI * 2;
              return (
                <ellipse
                  key={j}
                  cx={Math.cos(b) * 5}
                  cy={Math.sin(b) * 5}
                  rx={3.2}
                  ry={1.9}
                  fill="currentColor"
                  transform={`rotate(${(j / 8) * 360} ${Math.cos(b) * 5} ${Math.sin(b) * 5})`}
                />
              );
            })}
            <circle r={2.1} fill="currentColor" />
          </g>
        );
      })}
      {/* inner scrolling vine */}
      {petals.slice(0, 6).map((_, i) => (
        <path
          key={`v${i}`}
          d="M100 100 C 112 88, 128 88, 130 74 C 131 64, 122 60, 118 68 C 115 74, 122 78, 126 74"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(${i * 60} 100 100)`}
        />
      ))}
      {/* central lotus */}
      {Array.from({ length: 10 }).map((_, i) => (
        <ellipse
          key={`c${i}`}
          cx={100}
          cy={86}
          rx={4.4}
          ry={12}
          fill="currentColor"
          transform={`rotate(${i * 36} 100 100)`}
        />
      ))}
      <circle cx={100} cy={100} r={5.5} fill="currentColor" />
    </svg>
  );
}

/** Corner arabesque scroll (navy vine corners of a mural panel). */
export function CornerScroll({
  size = 64,
  flipX = false,
  flipY = false,
  style,
}: {
  size?: number;
  flipX?: boolean;
  flipY?: boolean;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
      style={{
        transform: `scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})`,
        ...style,
      }}
    >
      <g stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" fill="none">
        <path d="M4 60 C 4 30, 18 8, 50 4" />
        <path d="M10 52 C 14 34, 26 20, 44 15 C 52 13, 55 20, 49 24 C 44 27, 40 21, 45 18" />
        <path d="M18 44 C 24 36, 30 32, 36 31 C 42 30, 43 36, 38 37 C 34 38, 33 33, 37 32" />
        <path d="M8 34 C 14 33, 18 37, 16 42 C 14 46, 8 45, 8 40" />
        <path d="M28 14 C 30 8, 36 6, 40 9" />
      </g>
      <circle cx={52} cy={9} r={3} fill="currentColor" />
      <circle cx={9} cy={53} r={3} fill="currentColor" />
    </svg>
  );
}

/** Scalloped Mughal arch outline — draw behind a hero/header block. */
export function ScallopArch({
  width = 398,
  height = 150,
  style,
}: {
  width?: number;
  height?: number;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 150"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden
      style={style}
    >
      <path
        d="M10 150 V70 Q10 58 22 58 Q34 58 34 46 Q34 32 48 32 Q62 32 66 20
           Q72 6 88 10 Q104 14 116 6 Q132 -4 148 6 Q166 17 184 8 Q200 0 216 8
           Q234 17 252 6 Q268 -4 284 6 Q296 14 312 10 Q328 6 334 20 Q338 32 352 32
           Q366 32 366 46 Q366 58 378 58 Q390 58 390 70 V150"
        stroke="currentColor"
        strokeWidth={2}
        fill="none"
        opacity={0.55}
      />
      <path
        d="M20 150 V72 Q20 64 30 64 Q42 64 42 50 Q42 40 54 40 Q68 40 72 28
           Q78 16 92 19 Q106 22 118 15 Q133 6 148 15 Q166 25 184 17 Q200 10 216 17
           Q234 25 252 15 Q267 6 282 15 Q294 22 308 19 Q322 16 328 28 Q332 40 346 40
           Q358 40 358 50 Q358 64 370 64 Q380 64 380 72 V150"
        stroke="currentColor"
        strokeWidth={1}
        fill="none"
        opacity={0.3}
      />
    </svg>
  );
}

/** Peacock silhouette in the Jaipur mural style — a small decorative accent. */
export function Peacock({ size = 72, style }: { size?: number; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none" aria-hidden style={style}>
      <g stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" fill="none">
        {/* tail plumes */}
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M34 34 C ${26 - i * 4} ${40 + i * 4}, ${18 - i * 3} ${52 + i * 3}, ${12 - i * 2} ${62 + i * 2}`} />
        ))}
        {/* body + neck */}
        <path d="M34 34 C 40 30, 44 24, 42 18 C 41 13, 45 10, 49 13 C 52 15, 51 19, 47 19" />
        <path d="M34 34 C 42 36, 48 32, 50 26" />
        {/* crest */}
        <path d="M49 11 V6 M52 12 L55 8 M46 12 L44 8" />
      </g>
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse
          key={`e${i}`}
          cx={12 - i * 2}
          cy={62 + i * 2}
          rx={3}
          ry={4.2}
          fill="currentColor"
          opacity={0.85}
        />
      ))}
      <circle cx={50} cy={15} r={1.4} fill="currentColor" />
    </svg>
  );
}

/** Repeating floral vine strip — the painted border band on a wall panel. */
export function VineBand({ height = 18, style }: { height?: number; style?: CSSProperties }) {
  return (
    <div
      className="jaipur-vine"
      aria-hidden
      style={{ height, width: "100%", ...style }}
    />
  );
}

/** Painted palace landscape used behind the location area. */
export function PalaceLandscape({ style }: { style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 430 132" fill="none" aria-hidden style={style} preserveAspectRatio="none">
      <path d="M0 112 44 91l26 10 37-30 30 28 36-45 34 38 31-28 38 33 37-45 31 38 34-24 52 37v29H0Z" fill="var(--acc-pale)" opacity=".72" />
      <path d="M0 118 55 102l29 11 44-23 37 22 44-20 36 23 46-31 42 27 44-13 43 14v20H0Z" fill="var(--bg-card-mint)" opacity=".92" />
      {[44, 92, 160, 245, 286, 356].map((x, index) => (
        <g key={x} transform={`translate(${x} ${78 + (index % 2) * 12})`} stroke="var(--acc-soft)" strokeWidth="1.5">
          <path d="M0 40V5" />
          <path d="M0 11c-11 3-12 12 0 13M0 17c11 3 12 12 0 13M0 27c-9 2-10 9 0 10" />
        </g>
      ))}
      <g transform="translate(342 43)" stroke="var(--accent-yuzu)" fill="var(--bg-page)" opacity=".8">
        <path d="M8 69h61M15 69V36h47v33M21 36V22h35v14M27 22 38 6l12 16M38 6V0" />
        <path d="M25 69V45h10v24M43 69V45h10v24M18 36h41M13 69h53" />
        <path d="M38 2c8 5 10 10 0 16-10-6-8-11 0-16Z" fill="var(--accent-yuzu)" />
      </g>
      <g stroke="var(--acc-soft)" strokeWidth="1.4" strokeLinecap="round" opacity=".75">
        <path d="M245 43q6-7 12 0M265 32q6-7 12 0M286 49q6-7 12 0" />
      </g>
    </svg>
  );
}

/** Botanical corner flourish matching the painted frame around the reference. */
export function BotanicalSprig({ flip = false, style }: { flip?: boolean; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 74 128" fill="none" aria-hidden style={{ transform: flip ? "scaleX(-1)" : undefined, ...style }}>
      <path d="M5 126C14 91 32 67 58 34" stroke="var(--acc-strong)" strokeWidth="2" strokeLinecap="round" />
      <g fill="var(--acc-soft)">
        <ellipse cx="14" cy="102" rx="5" ry="13" transform="rotate(-38 14 102)"/><ellipse cx="25" cy="82" rx="5" ry="13" transform="rotate(36 25 82)"/>
        <ellipse cx="34" cy="66" rx="5" ry="12" transform="rotate(-38 34 66)"/><ellipse cx="47" cy="48" rx="5" ry="12" transform="rotate(35 47 48)"/>
        <ellipse cx="54" cy="30" rx="4" ry="10" transform="rotate(-28 54 30)"/>
      </g>
      <g fill="var(--acc2-strong)">
        <circle cx="18" cy="91" r="4"/><circle cx="22" cy="87" r="4"/><circle cx="26" cy="92" r="4"/>
        <circle cx="42" cy="55" r="4"/><circle cx="47" cy="52" r="4"/><circle cx="48" cy="58" r="4"/>
      </g>
      <g fill="var(--accent-yuzu)"><circle cx="22" cy="90" r="2"/><circle cx="46" cy="55" r="2"/></g>
    </svg>
  );
}

/** Full hand-painted livestock frieze that crowns the bottom navigation. */
export function AnimalFrieze({ style }: { style?: CSSProperties }) {
  const animals = [
    { x: 22, body: "M0 22c4-10 25-10 30-1l-2 15h-4l-1-10H9L8 36H4L3 25", head: "M28 18l8-6 4 6-5 7" },
    { x: 93, body: "M0 22c5-11 27-11 33-1l-2 15h-4l-1-10H10L9 36H5L4 25", head: "M31 18l9-7 3 7-5 8" },
    { x: 168, body: "M0 21c5-9 24-9 29 0l-2 15h-4l-1-10H9L8 36H4L3 24", head: "M27 18l7-5 5 4-4 8" },
    { x: 239, body: "M0 22c4-10 25-10 30-1l-2 15h-4l-1-10H9L8 36H4L3 25", head: "M28 18l8-6 4 6-5 7" },
    { x: 310, body: "M0 21c5-9 24-9 29 0l-2 15h-4l-1-10H9L8 36H4L3 24", head: "M27 18l7-5 5 4-4 8" },
    { x: 379, body: "M4 36V20c0-9 16-11 21-3l3 19h-4l-3-12H10L8 36Z", head: "M22 15l4-8 4 7-3 8" },
  ];
  return (
    <svg viewBox="0 0 430 58" fill="none" aria-hidden style={style} preserveAspectRatio="none">
      <path d="M0 47h430" stroke="var(--acc-strong)" strokeWidth="1.5"/>
      <path d="M0 52h430" stroke="var(--accent-yuzu)" strokeWidth="2" strokeDasharray="3 3"/>
      {animals.map((animal, i) => (
        <g key={animal.x} transform={`translate(${animal.x} 7)`} fill={i % 3 === 1 ? "var(--acc-soft)" : i % 3 === 2 ? "var(--accent-yuzu)" : "var(--bg-card-yellow)"} stroke="var(--acc-deep)" strokeWidth="1.2" strokeLinejoin="round">
          <path d={animal.body}/><path d={animal.head}/>
        </g>
      ))}
      {[63, 141, 216, 288, 360].map((x, i) => <g key={x} transform={`translate(${x} 33)`}><path d="M0 15V2" stroke="var(--acc-strong)"/><path d="m0 5-5-4M0 8l6-5" stroke="var(--acc-strong)"/><circle cy="1" r="4" fill={i % 2 ? "var(--accent-yuzu)" : "var(--acc2-strong)"}/></g>)}
    </svg>
  );
}
