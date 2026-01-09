// app/api/poster-captions/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { keywords } = await req.json();

    const prompt = `
Generate 5 poster caption ideas as JSON:
[
  { "title": "Big Title", "subtitle": "Short subtitle" }
]
Each title < 40 chars. Subtitle < 80 chars.
Keywords: ${keywords || "none"}
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    const raw = completion.choices[0]?.message?.content?.trim() || "[]";

    let ideas = [];
    try {
      ideas = JSON.parse(raw);
    } catch {
      ideas = [{ title: "Poster Idea", subtitle: raw.slice(0, 60) }];
    }

    return NextResponse.json({ ideas });
  } catch (err: any) {
    console.error("Caption API error:", err);

    // Special message for quota issues
    const isQuota =
      err?.status === 429 ||
      err?.code === "insufficient_quota" ||
      err?.response?.status === 429;

    return NextResponse.json(
      {
        error: isQuota
          ? "AI caption quota is exhausted for this API key."
          : "Failed to generate captions",
      },
      { status: 500 }
    );
  }
}