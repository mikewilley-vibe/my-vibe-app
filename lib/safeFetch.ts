export type SafeFetchResult<T> = {
  ok: boolean;
  status?: number;
  data: T | null;
};

export async function safeFetch<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<SafeFetchResult<T>> {
  try {
    const res = await fetch(input, init);

    if (!res.ok) {
      console.error("safeFetch non-OK", {
        url: typeof input === "string" ? input : input.toString(),
        status: res.status,
      });

      return { ok: false, status: res.status, data: null };
    }

    const data = (await res.json()) as T;
    return { ok: true, status: res.status, data };
  } catch (err) {
    console.error("safeFetch error", err);
    return { ok: false, data: null };
  }
}