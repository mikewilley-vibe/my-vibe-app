import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { title, style } = await req.json();

    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const prompt = `Generate a short, catchy tagline or subtitle for a poster with the title "${title}". 
Style: ${style || "creative and engaging"}
Keep it to 1-2 sentences max. Be witty and memorable.`;

    // Use Hugging Face free inference API
    const response = await fetch(
      "https://api-inference.huggingface.co/models/gpt2",
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt, parameters: { max_length: 100 } }),
      }
    );

    if (!response.ok) {
      console.error("HF API error:", response.status, await response.text());
      return NextResponse.json(
        { error: "Failed to generate tagline" },
        { status: 500 }
      );
    }

    const result = await response.json();
    const tagline = result[0]?.generated_text?.split("\n")[0] || "Your story awaits";

    return NextResponse.json({ tagline });
  } catch (error) {
    console.error("Tagline generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
