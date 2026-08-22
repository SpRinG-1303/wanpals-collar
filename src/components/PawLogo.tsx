export function PawLogo({ size = 32, color = "#1A1A1A" }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden
      style={{ display: "block" }}
    >
      {/* Toe pads */}
      <ellipse cx="19" cy="38" rx="9.5" ry="12.5" fill={color} transform="rotate(-16 19 38)" />
      <ellipse cx="39" cy="20" rx="10" ry="13" fill={color} transform="rotate(-6 39 20)" />
      <ellipse cx="63" cy="19" rx="10" ry="13" fill={color} transform="rotate(6 63 19)" />
      <ellipse cx="83" cy="36" rx="9.5" ry="12.5" fill={color} transform="rotate(16 83 36)" />
      {/* Main pad */}
      <circle cx="52" cy="67" r="26" fill={color} />
      {/* Heartbeat / ECG line across pad */}
      <path
        d="M29 71 L38 71 L44 63 L50 77 L56 51 L62 79 L66 66 L75 59"
        stroke="#FFFFFF"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export default PawLogo;
