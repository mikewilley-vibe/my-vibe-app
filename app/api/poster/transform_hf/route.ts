import { NextRequest, NextResponse } from "next/server";

type ImageStyle = "cartoon" | "anime" | "oil-painting" | "watercolor" | "sketch";

const STYLE_PROMPTS: Record<ImageStyle, string> = {
  cartoon: "Convert this image into a vibrant cartoon style with bold outlines and bright colors",
  anime: "Transform this image into anime art style with large expressive eyes and detailed cel-shaded rendering",
  "oil-painting": "Create an oil painting version of this image with visible brush strokes and rich texture",
  watercolor: "Transform this into a delicate watercolor painting with soft washes and bleeding edges",
  sketch: "Convert this image into a pencil sketch with detailed line work and hatching",
};

async function fetchImageBuffer(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`);
  const ab = await res.arrayBuffer();
  return new Uint8Array(ab);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageUrl, style, model: modelOverride } = body;

    if (!imageUrl || !style) {
      return NextResponse.json({ error: "imageUrl and style are required" }, { status: 400 });
    }

    if (!STYLE_PROMPTS[style as ImageStyle]) {
      return NextResponse.json(
        { error: `Invalid style. Choose from: ${Object.keys(STYLE_PROMPTS).join(", ")}` },
        { status: 400 }
      );
    }

    const hfKey = process.env.HUGGING_FACE_API_KEY;
    if (!hfKey) {
      return NextResponse.json({ error: "Missing HUGGING_FACE_API_KEY" }, { status: 500 });
    }

    // Download the image
    const imageBuf = await fetchImageBuffer(imageUrl);

    // Build prompt
    const prompt = STYLE_PROMPTS[style as ImageStyle];

    // Use the Hugging Face Inference API. This attempts an image-edit/inpainting style request by sending
    // multipart/form-data with the image file and a prompt. Different HF models vary in support — this endpoint
    // provides a best-effort fallback for image->image style transforms.
    // Allow request to override model for testing (body.model) or fall back to env / default
    const model = modelOverride || process.env.HUGGING_FACE_MODEL || "prunaai/flux-2-turbo"; // default to a fast image model

    const formData = new FormData();
    // Convert Uint8Array -> Blob
    const blob = new Blob([imageBuf], { type: "application/octet-stream" });
    formData.append("image", blob, "input.png");
    formData.append("inputs", prompt);

    // The legacy api-inference.huggingface.co is deprecated; use the Router API endpoint.
    const hfRes = await fetch(`https://router.huggingface.co/api/models/${model}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${hfKey}`,
        // NOTE: Do not set Content-Type; fetch + FormData will set the multipart boundary
      } as Record<string, string>,
      body: formData as unknown as BodyInit,
    });

    if (!hfRes.ok) {
      const text = await hfRes.text();
      console.error("Hugging Face error:", hfRes.status, text);
      try {
        return NextResponse.json(JSON.parse(text), { status: hfRes.status });
      } catch (e) {
        return NextResponse.json({ error: text }, { status: hfRes.status });
      }
    }

    // HF may return binary image bytes. Convert to base64 data URL and return.
    const contentType = hfRes.headers.get("content-type") || "image/png";
    const arrayBuffer = await hfRes.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);
    const b64 = Buffer.from(uint8).toString("base64");
    const dataUrl = `data:${contentType};base64,${b64}`;

    return NextResponse.json({ transformedImageDataUrl: dataUrl });
  } catch (err: any) {
    console.error("HF transform error:", err);
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
