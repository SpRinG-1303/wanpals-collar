import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const REPLICATE_BASE = "https://api.replicate.com/v1";

async function pollReplicate(pollUrl: string, key: string, timeoutMs = 120_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    await new Promise((r) => setTimeout(r, 2000));
    const res = await fetch(pollUrl, {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (!res.ok) continue;
    const data = (await res.json()) as {
      status: string;
      output: string | string[] | null;
      error?: string | null;
    };
    if (data.status === "succeeded") {
      const out = Array.isArray(data.output) ? data.output[0] : data.output;
      if (!out) throw new Error("Replicate returned empty output");
      return out;
    }
    if (data.status === "failed" || data.status === "canceled") {
      throw new Error(data.error || "Replicate step failed");
    }
  }
  throw new Error("Replicate step timed out");
}

async function startPrediction(
  model: string,
  input: Record<string, unknown>,
  key: string
) {
  const res = await fetch(`${REPLICATE_BASE}/models/${model}/predictions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ input }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Replicate start failed: ${res.status} ${text}`);
  }
  return (await res.json()) as { urls: { get: string } };
}

/** Step 1: Convert uploaded image to Ghibli-style image. */
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
    const prediction = await startPrediction(
      "aaronaftab/mirage-ghibli",
      { image: dataUrl },
      key
    );
    const url = await pollReplicate(prediction.urls.get, key, 120_000);
    return { url };
  });

/** Step 2: Animate a Ghibli image URL into a short looping video. */
export const animateImage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ imageUrl: z.string().url() }).parse(input)
  )
  .handler(async ({ data }) => {
    const key = process.env.REPLICATE_API_KEY;
    if (!key) throw new Error("Missing REPLICATE_API_KEY");
    const prediction = await startPrediction(
      "stability-ai/stable-video-diffusion",
      {
        input_image: data.imageUrl,
        motion_bucket_id: 80,
        fps: 12,
        decoding_chunk_size: 8,
      },
      key
    );
    const url = await pollReplicate(prediction.urls.get, key, 240_000);
    return { url };
  });
