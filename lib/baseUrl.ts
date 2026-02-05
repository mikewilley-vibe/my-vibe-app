// lib/baseUrl.ts
import { headers } from "next/headers";

export async function getBaseUrl() {
  // Prefer explicit env var (set in Vercel environment)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "https";
  const forwardedHost = h.get("x-forwarded-host");
  const host = h.get("host");

  // Prefer forwarded host (custom domain) over direct host
  const useHost = forwardedHost || host;

  return `${proto}://${useHost}`.replace(/\/$/, "");
}