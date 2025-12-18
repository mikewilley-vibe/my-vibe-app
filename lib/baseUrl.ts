// lib/baseUrl.ts
import { headers } from "next/headers";

export async function getBaseUrl() {
  // Prefer an explicit env var if you set it
  const env =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_BASE_URL ||
    process.env.VERCEL_URL;

  if (env) {
    // VERCEL_URL is usually just the host (no protocol)
    if (env.startsWith("http")) return env;
    return `https://${env}`;
  }

  // Otherwise infer from request headers (dev + prod)
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = process.env.NODE_ENV === "development" ? "http" : "https";
  return `${proto}://${host}`;
}