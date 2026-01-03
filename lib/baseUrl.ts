// lib/baseUrl.ts
import { headers } from "next/headers";

export async function getBaseUrl() {
  // Prefer explicit env var
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "https";
  const host = h.get("x-forwarded-host") ?? h.get("host");

  return `${proto}://${host}`.replace(/\/$/, "");
}