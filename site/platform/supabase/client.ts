import { createBrowserClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { getOptionalPublicSupabaseEnv, getPublicSupabaseEnv } from "./env";

export type { Database };

export function createClient() {
  const { url, anonKey } = getPublicSupabaseEnv();
  return createBrowserClient<Database>(url, anonKey);
}

export function createOptionalClient() {
  const env = getOptionalPublicSupabaseEnv();
  if (!env) return null;
  return createBrowserClient<Database>(env.url, env.anonKey);
}

export function createRawClient() {
  const { url, anonKey } = getPublicSupabaseEnv();
  return createSupabaseClient<Database>(url, anonKey);
}

export async function getBrowserSessionUser(
  client = createClient(),
) {
  const { data, error } = await client.auth.getUser();
  if (error) {
    throw error;
  }
  return data.user ?? null;
}