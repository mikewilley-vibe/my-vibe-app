// lib/baseUrl.ts
import { headers } from "next/headers";

/**
 * Returns the absolute origin for server-side fetches.
 * Prefers NEXT_PUBLIC_SITE_URL in production.
 */
export async function getBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");

  const h = await headers(); // ✅ IMPORTANT (Next 15/16)
  const proto = h.get("x-forwarded-proto") ?? "https";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}