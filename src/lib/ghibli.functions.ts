import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Convert an uploaded image to Ghibli style via Replicate.
 * Input: base64-encoded image data (no data: prefix) + mime type.
 * Output: { url: string } of the generated PNG.
 */
export const convertToGhibli = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        base64: z.string().min(1),
        mime: z.string().default("image/jpeg"),
      })
      .parse(input)
  )
  .handler(async ({ data }) => {
    const key = process.env.REPLICATE_API_KEY;
    if (!key) throw new Error("Missing REPLICATE_API_KEY");

    const dataUrl = `data:${data.mime};base64,${data.base64}`;

    const startRes = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "a4a8bafd6089e1716b06057c42b19378250d008b",
        input: { image: dataUrl },
      }),
    });

    if (!startRes.ok) {
      const text = await startRes.text();
      throw new Error(`Replicate start failed: ${startRes.status} ${text}`);
    }

    const prediction = (await startRes.json()) as {
      urls: { get: string };
      status: string;
    };

    const pollUrl = prediction.urls.get;
    const start = Date.now();
    const TIMEOUT_MS = 90_000;

    while (Date.now() - start < TIMEOUT_MS) {
      await new Promise((r) => setTimeout(r, 2000));
      const pollRes = await fetch(pollUrl, {
        headers: { Authorization: `Token ${key}` },
      });
      if (!pollRes.ok) continue;
      const pollData = (await pollRes.json()) as {
        status: string;
        output: string | string[] | null;
        error?: string | null;
      };

      if (pollData.status === "succeeded") {
        const out = Array.isArray(pollData.output)
          ? pollData.output[0]
          : pollData.output;
        if (!out) throw new Error("Replicate returned empty output");
        return { url: out };
      }
      if (pollData.status === "failed" || pollData.status === "canceled") {
        throw new Error(pollData.error || "Conversion failed");
      }
    }

    throw new Error("Conversion timed out");
  });
