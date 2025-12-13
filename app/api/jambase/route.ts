// app/api/jambase/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function yyyymmdd(d: Date) {
  return d.toISOString().slice(0, 10);
}

export async function GET() {
  try {
    const apiKey = process.env.JAMBASE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing JAMBASE_API_KEY in environment" },
        { status: 500 }
      );
    }

    // 🔧 tweak these defaults anytime
    const zipCode = process.env.JAMBASE_ZIP ?? "23219"; // Richmond
    const radius = process.env.JAMBASE_RADIUS ?? "50";
    const perPage = process.env.JAMBASE_PER_PAGE ?? "50";
    const page = process.env.JAMBASE_PAGE ?? "1";

    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 30);

    const params = new URLSearchParams({
      apikey: apiKey,
      zipCode,
      radius,
      startDate: yyyymmdd(start),
      endDate: yyyymmdd(end),
      perPage,
      page,
    });

    // ✅ JamBase JSON API (NOT /concerts/finder)
    const url = `https://www.jambase.com/jb-api/v1/events?${params.toString()}`;

    const res = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    const contentType = res.headers.get("content-type") || "";
    const text = await res.text();

    if (!res.ok) {
      return NextResponse.json(
        {
          error: "JamBase request failed",
          status: res.status,
          statusText: res.statusText,
          contentType,
          preview: text.slice(0, 300),
          url,
        },
        { status: 502 }
      );
    }

    // If JamBase gives back HTML, this will help you see it instantly
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        {
          error: "JamBase response was not JSON",
          contentType,
          preview: text.slice(0, 300),
          url,
        },
        { status: 502 }
      );
    }

    let raw: any = null;
    try {
      raw = JSON.parse(text);
    } catch {
      return NextResponse.json(
        {
          error: "JamBase JSON parse failed",
          contentType,
          preview: text.slice(0, 300),
          url,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      fetchedAt: new Date().toISOString(),
      query: {
        zipCode,
        radius,
        startDate: yyyymmdd(start),
        endDate: yyyymmdd(end),
        perPage,
        page,
      },
      raw,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Server error calling JamBase",
        message: (err as Error).message,
      },
      { status: 500 }
    );
  }
}