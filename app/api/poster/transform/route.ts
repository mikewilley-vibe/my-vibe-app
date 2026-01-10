import { NextRequest, NextResponse } from "next/server";

type ImageStyle = "cartoon" | "anime" | "oil-painting" | "watercolor" | "sketch";

const STYLE_PROMPTS: Record<ImageStyle, string> = {
  cartoon: "Convert this image into a vibrant cartoon style with bold outlines and bright colors",
  anime: "Transform this image into anime art style with large expressive eyes and detailed shading",
  "oil-painting": "Create an oil painting version of this image with visible brush strokes",
  watercolor: "Transform this into a beautiful watercolor painting style",
  sketch: "Convert this image into a pencil sketch with detailed line work",
};

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, style } = await req.json();

    if (!imageUrl || !style) {
      return NextResponse.json(
        { error: "imageUrl and style are required" },
        { status: 400 }
      );
    }

    if (!STYLE_PROMPTS[style as ImageStyle]) {
      return NextResponse.json(
        { error: `Invalid style. Choose from: ${Object.keys(STYLE_PROMPTS).join(", ")}` },
        { status: 400 }
      );
    }

    // Use Replicate API for image transformation
    const versionId = process.env.REPLICATE_MODEL_VERSION || "47c060e80055269a615f9636df2d51fd50239dc439f5ecde465a7d513a0abda6"; // fallback to p-image latest public version

    const replicateResponse = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: versionId,
        input: {
          prompt: STYLE_PROMPTS[style as ImageStyle],
          image: imageUrl,
          num_outputs: 1,
          guidance_scale: 7.5,
          num_inference_steps: 30,
        },
      }),
    });

    if (!replicateResponse.ok) {
      const text = await replicateResponse.text();
      console.error("Replicate upstream error:", replicateResponse.status, text);
      try {
        const parsed = JSON.parse(text);
        return NextResponse.json(parsed, { status: replicateResponse.status });
      } catch (e) {
        return NextResponse.json({ error: text }, { status: replicateResponse.status });
      }
    }

    const prediction = await replicateResponse.json();

    // Poll for result
    let result = prediction;
    let attempts = 0;
    while (result.status === "processing" && attempts < 120) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
        headers: {
          "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
        },
      });

      if (!statusResponse.ok) {
        const text = await statusResponse.text();
        console.error("Replicate status error:", statusResponse.status, text);
        try {
          const parsed = JSON.parse(text);
          return NextResponse.json(parsed, { status: statusResponse.status });
        } catch (e) {
          return NextResponse.json({ error: text }, { status: statusResponse.status });
        }
      }

      result = await statusResponse.json();
      attempts++;
    }

    if (result.status === "succeeded" && result.output?.[0]) {
      return NextResponse.json({ transformedImageUrl: result.output[0] });
    }

    if (result.status === "failed") {
      console.error("Replicate prediction failed:", result);
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(
      { error: "Image transformation failed or timed out", details: result },
      { status: 500 }
    );
  } catch (error) {
    console.error("Image transformation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
