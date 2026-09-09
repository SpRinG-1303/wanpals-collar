import { createFileRoute } from "@tanstack/react-router";
import { SensorPage } from "@/components/SensorPage";
import { LiveSensorBody } from "@/components/LiveSensorBody";

export const Route = createFileRoute("/pressure-sense")({ component: PressureSensePage });

function PressureSensePage() {
  return (
    <SensorPage
      titleEn="PressureSense AI"
      subtitleEn="PressureSense AI"
      descriptorEn="Collar pressure monitoring"
      bannerGradient="linear-gradient(135deg,var(--bg-card) 0%,var(--acc-pale) 100%)"
      bannerSubtitleColor="var(--acc-strong)"
    >
      <LiveSensorBody
        sensor="pressure"
        labelEn="Current Pressure"
        unitLabel="kPa"
        note="Reported directly by the collar's pressure sensor."
      />
    </SensorPage>
  );
}
