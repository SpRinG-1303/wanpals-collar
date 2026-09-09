import { createFileRoute } from "@tanstack/react-router";
import { SensorPage } from "@/components/SensorPage";
import { LiveSensorBody } from "@/components/LiveSensorBody";

export const Route = createFileRoute("/light-sense")({ component: LightSensePage });

function LightSensePage() {
  return (
    <SensorPage
      titleEn="LightSense AI"
      subtitleEn="LightSense AI"
      descriptorEn="Ambient light monitoring"
      bannerGradient="linear-gradient(135deg,var(--bg-card) 0%,var(--acc-pale) 100%)"
      bannerSubtitleColor="var(--acc-strong)"
    >
      <LiveSensorBody
        sensor="light"
        labelEn="Ambient Light"
        unitLabel="lux"
        decimals={0}
        note="Reported directly by the collar's light sensor."
      />
    </SensorPage>
  );
}
