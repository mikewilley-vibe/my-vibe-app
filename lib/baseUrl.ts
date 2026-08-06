// lib/baseUrl.ts
import { headers } from "next/headers";

export async function getBaseUrl() {
  // Prefer explicit env var (set in Vercel environment)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  const h = await headers();
  const forwardedHost = h.get("x-forwarded-host");
  const host = h.get("host");

  // Prefer forwarded host (custom domain) over direct host
  const useHost = forwardedHost || host || "localhost:3000";
  const isLocal =
    useHost.includes("localhost") || useHost.startsWith("127.0.0.1");
  // Local Next doesn't terminate TLS; defaulting to https hangs self-fetches.
  const proto = h.get("x-forwarded-proto") ?? (isLocal ? "http" : "https");

  return `${proto}://${useHost}`.replace(/\/$/, "");
}