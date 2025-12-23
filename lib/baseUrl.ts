// lib/baseUrl.ts (or lib/baseUrl.ts / lib/baseUrl.tsx wherever it is)
import { headers } from "next/headers";

export async function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;

  const h = await headers(); // ✅ this is the fix
  const proto = h.get("x-forwarded-proto") ?? "https";
  const host = h.get("x-forwarded-host") ?? h.get("host");
  return `${proto}://${host}`;
}