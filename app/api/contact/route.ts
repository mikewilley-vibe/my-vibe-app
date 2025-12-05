import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, message } = body;

  console.log("📥 New contact message:", { name, email, message });

  // In the future you could send an email here using Resend, SES, etc.
  return NextResponse.json({ ok: true });
}