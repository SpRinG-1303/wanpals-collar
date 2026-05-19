import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Generate a flat, illustrated avatar from a user-uploaded photo using
 * Replicate. Two-step pipeline:
 *   1. Background removal (851-labs/background-remover, rembg-style)
 *   2. Stylisation into a colourful cartoon avatar (stability-ai/sdxl img2img)
 *
 * The REPLICATE_API_KEY is read inside the handler so it stays server-side.
 */

type ReplicatePrediction = {
  id: string;
  status: "starting" | "processing" | "succeeded" | "failed" | "canceled";
  output: unknown;
  error?: string | null;
  urls?: { get?: string };
};

async function runReplicate(
  model: string,
  input: Record<string, unknown>,
  key: string,
): Promise<unknown> {
  const start = await fetch(
    `https://api.replicate.com/v1/models/${model}/predictions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "wait=60",
      },
      body: JSON.stringify({ input }),
    },
  );

  if (!start.ok) {
    const text = await start.text();
    throw new Error(`Replicate ${model} request failed: ${start.status} ${text}`);
  }

  let pred = (await start.json()) as ReplicatePrediction;
  const getUrl =
    pred.urls?.get ?? `https://api.replicate.com/v1/predictions/${pred.id}`;
  const startedAt = Date.now();

  while (
    pred.status !== "succeeded" &&
    pred.status !== "failed" &&
    pred.status !== "canceled"
  ) {
    if (Date.now() - startedAt > 120_000) {
      throw new Error(`Replicate ${model} timed out`);
    }
    await new Promise((r) => setTimeout(r, 1500));
    const poll = await fetch(getUrl, {
      headers: { Authorization: `Bearer ${key}` },
    });
    pred = (await poll.json()) as ReplicatePrediction;
  }

  if (pred.status !== "succeeded") {
    throw new Error(`Replicate ${model} ${pred.status}: ${pred.error ?? "unknown error"}`);
  }
  return pred.output;
}

function firstImageUrl(out: unknown): string | null {
  if (typeof out === "string") return out;
  if (Array.isArray(out) && out.length > 0 && typeof out[0] === "string") return out[0];
  if (out && typeof out === "object") {
    const o = out as Record<string, unknown>;
    if (typeof o.image === "string") return o.image;
    if (typeof o.output === "string") return o.output;
  }
  return null;
}

export const generateAvatar = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        base64: z.string().min(1),
        mime: z.string().default("image/jpeg"),
        subject: z.enum(["dog", "person"]).default("dog"),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const key = process.env.REPLICATE_API_KEY;
    if (!key) throw new Error("Missing REPLICATE_API_KEY");

    const dataUrl = `data:${data.mime};base64,${data.base64}`;

    // Step 1 — background removal
    const bgOut = await runReplicate(
      "851-labs/background-remover",
      { image: dataUrl, format: "png" },
      key,
    );
    const cleanUrl = firstImageUrl(bgOut);
    if (!cleanUrl) throw new Error("Background removal returned no image");

    // Step 2 — flat cartoon avatar stylisation (img2img)
    const subjectDesc =
      data.subject === "dog" ? "dog character" : "person character";
    const prompt =
      `flat colorful illustrated ${subjectDesc} avatar, full body, ` +
      `clean vector lines, vibrant cheerful colors, modern cartoon sticker style, ` +
      `friendly expression, soft pastel highlights, transparent background, centered composition`;

    const styleOut = await runReplicate(
      "stability-ai/sdxl",
      {
        image: cleanUrl,
        prompt,
        negative_prompt:
          "photo, photorealistic, 3d render, blurry, dark, scary, text, watermark, frame, border",
        prompt_strength: 0.7,
        num_inference_steps: 30,
        refine: "no_refiner",
      },
      key,
    );
    const finalUrl = firstImageUrl(styleOut);
    if (!finalUrl) throw new Error("Stylisation returned no image");

    return { url: finalUrl, cleanUrl };
  });
