import type { ReactNode } from "react";

/** Shared placeholder shown wherever real sensor data hasn't arrived yet.
 *  The app never displays invented readings — only what the collar reports. */
export function NoData({ title, hint, icon }: { title?: string; hint?: string; icon?: ReactNode }) {
  return (
    <div
      style={{
        padding: "18px 14px",
        borderRadius: 16,
        background: "var(--bg-page)",
        border: "1px dashed color-mix(in oklab, var(--acc-strong) 30%, transparent)",
        textAlign: "center",
      }}
    >
      {icon ? <div style={{ marginBottom: 6, opacity: 0.7 }}>{icon}</div> : null}
      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
        {title ?? "No sensor data yet"}
      </div>
      <div style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 4, lineHeight: 1.5 }}>
        {hint ?? "Connect your collar — readings will appear here as your sensors report them."}
      </div>
    </div>
  );
}

/** Dash placeholder for a single unknown value. */
export const DASH = "—";

export default NoData;
