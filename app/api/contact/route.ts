import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  console.log("CONTACT FORM SUBMISSION:", body);

  return NextResponse.json({ ok: true, message: "Form received!" });
}