import { createFileRoute } from "@tanstack/react-router";
import { SensorPage } from "@/components/SensorPage";
import { LiveSensorBody } from "@/components/LiveSensorBody";

export const Route = createFileRoute("/temp-sense")({ component: TempSensePage });

function TempSensePage() {
  return (
    <SensorPage
      titleEn="TempSense AI"
      subtitleEn="TempSense AI"
      descriptorEn="Body temperature monitoring"
      bannerGradient="linear-gradient(135deg,var(--bg-card) 0%,var(--acc-pale) 100%)"
      bannerSubtitleColor="var(--acc-strong)"
    >
      <LiveSensorBody
        sensor="temp"
        labelEn="Current Temperature"
        unitLabel="°C"
        note="Reported directly by the collar's temperature sensor."
      />
    </SensorPage>
  );
}
