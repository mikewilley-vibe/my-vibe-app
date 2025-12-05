// import { Resend } from "resend";

export async function POST(request: Request) {
  // Temporarily disable email sending for Vercel
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}