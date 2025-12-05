// TEMPORARILY DISABLED CONTACT API
// This placeholder prevents build failures on Vercel.

export async function POST() {
  return new Response(
    JSON.stringify({
      ok: true,
      message: "Contact API temporarily disabled on Vercel.",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}