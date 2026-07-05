/**
 * @deprecated Use Drizzle via `@/lib/catalog/catalogDrizzle` and `productsDb`.
 * Kept temporarily for routes not yet migrated off Supabase REST.
 */
import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedSupabase: SupabaseClient | null = null;

/** @deprecated Prefer `isProductsDatabaseConfigured()` from `@/platform/drizzle/databaseUrls`. */
export function hasSupabasePublicEnv(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  );
}

function getSupabaseClient(): SupabaseClient {
  if (cachedSupabase) return cachedSupabase;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing in environment variables.");
  }

  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!anonKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is missing in environment variables.");
  }

  cachedSupabase = createClient(url, anonKey);
  return cachedSupabase;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, property, receiver) {
    const client = getSupabaseClient();
    const value = Reflect.get(client, property, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
