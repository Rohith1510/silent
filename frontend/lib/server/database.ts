import "server-only";
import { createClient } from "@supabase/supabase-js";
import { HttpError, required } from "./config";
export function database() {
  return createClient(
    required("SUPABASE_URL"),
    required("SUPABASE_SECRET_KEY"),
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );
}
export function checked<T>({
  data,
  error,
}: {
  data: T;
  error: unknown;
}): NonNullable<T> {
  if (error)
    throw new HttpError(
      503,
      "Database unavailable. Apply the silent migration and verify server credentials.",
    );
  return data as NonNullable<T>;
}
export async function rateLimit(bucket: string, max: number, seconds: number) {
  const allowed = checked(
    await database().rpc("silent_rate_limit", {
      p_bucket: bucket,
      p_max: max,
      p_seconds: seconds,
    }),
  );
  if (!allowed)
    throw new HttpError(429, "Too many requests. Please try again later.");
}
