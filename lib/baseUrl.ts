export function getBaseUrl() {
  // Vercel production / preview
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Local dev
  return "http://localhost:3000";
}