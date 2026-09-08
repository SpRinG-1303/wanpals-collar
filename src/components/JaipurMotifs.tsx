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

/** Inverted Rajput ogee boundary with a central lotus and faded edge botanicals. */
export function HeaderArchBoundary({ style }: { style?: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 430 126"
      preserveAspectRatio="none"
      aria-hidden
      style={style}
    >
      <defs>
        <linearGradient id="branchFadeLeft" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--acc-strong)" stopOpacity=".42" />
          <stop offset="1" stopColor="var(--acc-strong)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="branchFadeRight" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="var(--acc-strong)" stopOpacity=".42" />
          <stop offset="1" stopColor="var(--acc-strong)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0 0H430V60 C409 55 394 63 385 80 C368 70 350 72 338 89 C321 77 301 80 291 99 C271 87 247 92 237 111 C228 122 220 124 215 125 C210 124 202 122 193 111 C183 92 159 87 139 99 C129 80 109 77 92 89 C80 72 62 70 45 80 C36 63 21 55 0 60Z"
        fill="var(--bg-elevated)"
      />
      <path
        d="M0 60 C21 55 36 63 45 80 C62 70 80 72 92 89 C109 77 129 80 139 99 C159 87 183 92 193 111 C202 122 210 124 215 125 C220 124 228 122 237 111 C247 92 271 87 291 99 C301 80 321 77 338 89 C350 72 368 70 385 80 C394 63 409 55 430 60"
        fill="none"
        stroke="var(--accent-yuzu)"
        strokeWidth="1.15"
        opacity=".72"
      />
      <path
        d="M0 67 C20 62 32 69 41 87 M430 67 C410 62 398 69 389 87"
        fill="none"
        stroke="var(--accent-yuzu)"
        strokeWidth=".7"
        opacity=".38"
      />
      <g transform="translate(215 108)" fill="var(--accent-yuzu)" opacity=".78">
        <ellipse cx="0" cy="-4" rx="3.2" ry="8" />
        <ellipse cx="-6" cy="-2" rx="2.8" ry="7" transform="rotate(-45 -6 -2)" />
        <ellipse cx="6" cy="-2" rx="2.8" ry="7" transform="rotate(45 6 -2)" />
        <ellipse cx="-9" cy="3" rx="2.4" ry="6" transform="rotate(-68 -9 3)" />
        <ellipse cx="9" cy="3" rx="2.4" ry="6" transform="rotate(68 9 3)" />
        <circle cy="2" r="2" fill="var(--acc2-strong)" />
      </g>
      <g fill="none" stroke="url(#branchFadeLeft)" strokeWidth="1.4" strokeLinecap="round">
        <path d="M0 18 C18 24 23 39 30 59" />
        <path d="M10 27 C15 20 18 17 23 13 M17 38 C8 36 5 32 2 28 M24 49 C31 43 34 39 35 34" />
      </g>
      <g fill="var(--acc2-strong)" opacity=".5">
        <ellipse cx="22" cy="15" rx="5" ry="2.2" transform="rotate(-48 22 15)" />
        <ellipse cx="5" cy="28" rx="5" ry="2.2" transform="rotate(34 5 28)" />
        <ellipse cx="35" cy="35" rx="5" ry="2.2" transform="rotate(-57 35 35)" />
      </g>
      <g transform="translate(430 0) scale(-1 1)" fill="none" stroke="url(#branchFadeRight)" strokeWidth="1.4" strokeLinecap="round">
        <path d="M0 18 C18 24 23 39 30 59" />
        <path d="M10 27 C15 20 18 17 23 13 M17 38 C8 36 5 32 2 28 M24 49 C31 43 34 39 35 34" />
      </g>
    </svg>
  );
}

function Lotus({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 40)`}>
      <path d="M0 29 C-2 19 -1 9 0 1 M0 18 C-8 12 -11 8 -12 4 M0 21 C8 15 12 10 13 6" fill="none" stroke="var(--acc-strong)" strokeWidth="1.2" />
      <path d="M0 6 C-9 2 -11 -5 -8 -10 C-2 -9 1 -5 0 6Z M0 6 C9 2 11 -5 8 -10 C2 -9 -1 -5 0 6Z M0 4 C-4 -4 -2 -11 0 -14 C4 -9 5 -3 0 4Z" fill="var(--acc2-strong)" stroke="var(--acc2-deep)" strokeWidth=".7" />
      <ellipse cx="-10" cy="14" rx="6" ry="2.5" fill="var(--acc-soft)" transform="rotate(28 -10 14)" />
      <ellipse cx="10" cy="17" rx="6" ry="2.5" fill="var(--acc-soft)" transform="rotate(-28 10 17)" />
    </g>
  );
}

function MiniatureAnimal({ x, kind, color }: { x: number; kind: "dog" | "sheep" | "calf"; color: string }) {
  if (kind === "sheep") {
    return (
      <g transform={`translate(${x} 36)`} stroke="var(--text-secondary)" strokeWidth=".8" strokeLinecap="round">
        <path d="M3 12 C0 4 8 0 17 3 C24 0 32 5 29 13 C23 18 8 18 3 12Z" fill={color} />
        <path d="M28 8 C36 5 38 11 33 15 L28 14Z" fill="var(--accent-yuzu)" />
        <path d="M8 15V24 M23 15V24 M6 24H11 M21 24H26" fill="none" />
        <circle cx="34" cy="10" r=".8" fill="var(--text-primary)" stroke="none" />
      </g>
    );
  }
  if (kind === "calf") {
    return (
      <g transform={`translate(${x} 35)`} stroke="var(--text-secondary)" strokeWidth=".8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 7 C10 2 24 3 30 9 L28 18 H8 L4 12Z" fill={color} />
        <path d="M28 8 L36 5 L40 9 L35 13 L29 12 M36 5 L34 1 M38 6 L41 3" fill={color} />
        <path d="M9 17V26 M25 17V26 M7 26H12 M23 26H28 M4 9 C-2 5 0 1 2 0" fill="none" />
        <circle cx="37" cy="8" r=".8" fill="var(--text-primary)" stroke="none" />
      </g>
    );
  }
  return (
    <g transform={`translate(${x} 38)`} stroke="var(--text-secondary)" strokeWidth=".8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8 C9 3 21 3 27 8 L25 15 H8 L5 12Z" fill={color} />
      <path d="M25 8 L31 2 L36 5 L34 11 L27 12 M31 2 L30 -2 L34 1" fill={color} />
      <path d="M9 14V22 M23 14V22 M7 22H11 M21 22H25 M5 8 C0 5 0 1 2 0" fill="none" />
      <circle cx="33" cy="5" r=".8" fill="var(--text-primary)" stroke="none" />
    </g>
  );
}

/** Detailed miniature-painting animal garden and geometric band above navigation. */
export function AnimalFrieze({ style }: { style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 430 88" preserveAspectRatio="none" aria-hidden style={style}>
      <path d="M0 28 Q12 28 17 15 Q24 30 36 30 Q45 30 51 20 Q58 32 70 32 L70 88 H0Z" fill="var(--bg-elevated)" stroke="var(--accent-yuzu)" strokeWidth="1" />
      <path d="M70 32 Q84 32 91 18 Q99 31 112 31 Q126 31 135 13 Q144 31 158 31 Q172 31 182 19 Q190 32 204 32 Q216 32 225 14 Q234 32 248 32 Q262 32 271 19 Q280 31 294 31 Q308 31 317 13 Q326 31 340 31 Q353 31 361 18 Q368 32 382 32 Q397 32 405 15 Q411 28 430 28 V88 H70Z" fill="var(--bg-elevated)" stroke="var(--accent-yuzu)" strokeWidth="1" />
      <path d="M0 34 Q15 34 20 22 Q28 35 42 35 M388 35 Q402 35 410 22 Q416 34 430 34" fill="none" stroke="var(--accent-yuzu)" strokeWidth=".65" opacity=".55" />
      <Lotus x={46} /><Lotus x={132} /><Lotus x={218} /><Lotus x={304} /><Lotus x={390} />
      <MiniatureAnimal x={65} kind="dog" color="var(--accent-yuzu)" />
      <MiniatureAnimal x={148} kind="calf" color="var(--accent-fuji)" />
      <MiniatureAnimal x={239} kind="sheep" color="var(--acc-pale)" />
      <MiniatureAnimal x={323} kind="dog" color="var(--acc2-soft)" />
      <g transform="translate(0 72)">
        <rect width="430" height="16" fill="var(--bg-elevated)" />
        <path d="M0 1H430 M0 15H430" stroke="var(--accent-yuzu)" strokeWidth=".8" />
        {Array.from({ length: 29 }).map((_, i) => (
          <g key={i} transform={`translate(${i * 15 + 7.5} 8)`}>
            <rect x="-3.2" y="-3.2" width="6.4" height="6.4" rx=".5" transform="rotate(45)" fill={i % 2 ? "var(--acc2-strong)" : "var(--acc-strong)"} opacity=".82" />
            <circle cx="7.3" cy="0" r="1.35" fill="var(--accent-yuzu)" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Fine botanical flourish for the inside corners of white information cards. */
export function BotanicalCorner({ style }: { style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 54 54" aria-hidden style={style}>
      <g fill="none" stroke="var(--acc-soft)" strokeWidth="1.2" strokeLinecap="round" opacity=".42">
        <path d="M3 51 C8 29 22 13 49 4" />
        <path d="M12 35 C6 33 4 28 5 23 M20 24 C19 16 23 11 29 8 M29 17 C37 17 42 13 44 8" />
      </g>
      <g fill="var(--acc-pale)" opacity=".8">
        <ellipse cx="6" cy="23" rx="5" ry="2.2" transform="rotate(48 6 23)" />
        <ellipse cx="28" cy="8" rx="5" ry="2.2" transform="rotate(-55 28 8)" />
        <ellipse cx="44" cy="8" rx="5" ry="2.2" transform="rotate(-35 44 8)" />
      </g>
    </svg>
  );
}
