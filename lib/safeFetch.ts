export type SafeFetchResult<T> = {
  ok: boolean;
  status?: number;
  data: T | null;
  error?: string;
};

export async function safeFetch<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<SafeFetchResult<T>> {
  try {
    const res = await fetch(input, init);

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        data: null,
        error: `HTTP ${res.status}`,
      };
    }

    const data = (await res.json()) as T;
    return { ok: true, status: res.status, data };
  } catch (err: any) {
    return {
      ok: false,
      data: null,
      error: err?.message ?? "Network error",
    };
  }
}