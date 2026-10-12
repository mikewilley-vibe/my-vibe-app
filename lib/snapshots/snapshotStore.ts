import { supabaseServer } from "@/lib/supabaseServer";

export const UVA_SNAPSHOT_KEY = "uva-schedules";
export const HOLIDAY_SNAPSHOT_KEY = "holiday-official";

export type SnapshotStore = {
  read<T>(key: string): Promise<T | null>;
  write(key: string, payload: unknown): Promise<boolean>;
};

const memory = new Map<string, unknown>();

function supabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/** Last successful payload. A failed write leaves the stored row untouched. */
export function createSnapshotStore(): SnapshotStore {
  return {
    async read<T>(key: string): Promise<T | null> {
      if (supabaseConfigured()) {
        try {
          const supabase = supabaseServer();
          const { data, error } = await supabase
            .from("app_snapshots")
            .select("payload")
            .eq("key", key)
            .maybeSingle();
          if (!error && data?.payload) {
            memory.set(key, data.payload);
            return data.payload as T;
          }
        } catch {
          /* Fall through to the in-process copy. */
        }
      }
      return (memory.get(key) as T | undefined) ?? null;
    },
    async write(key: string, payload: unknown): Promise<boolean> {
      if (!supabaseConfigured()) return false;
      try {
        const supabase = supabaseServer();
        const { error } = await supabase.from("app_snapshots").upsert({
          key,
          payload,
          updated_at: new Date().toISOString(),
        });
        if (error) return false;
        memory.set(key, payload);
        return true;
      } catch {
        return false;
      }
    },
  };
}

export function memorySnapshotStore(seed?: Record<string, unknown>): SnapshotStore {
  const local = new Map<string, unknown>(Object.entries(seed ?? {}));
  return {
    async read<T>(key: string) {
      return (local.get(key) as T | undefined) ?? null;
    },
    async write(key: string, payload: unknown) {
      local.set(key, payload);
      return true;
    },
  };
}
