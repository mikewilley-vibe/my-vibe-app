export function cronAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const provided = new URL(req.url).searchParams.get("secret");
  if (provided && provided === secret) return true;
  const header = req.headers.get("authorization");
  return header === `Bearer ${secret}`;
}
