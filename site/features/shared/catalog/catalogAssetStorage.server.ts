/**
 * Server-side Supabase Storage for catalog symbols and planner exports.
 * Uses service role when available. Best-effort — never throws for missing config.
 */
import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const CATALOG_ASSETS_BUCKET = "catalog-assets";
export const PLANNER_SYMBOLS_PREFIX = "planner-symbols";
export const PLANNER_EXPORTS_PREFIX = "planner-exports";
/** System-generated modular/scene GLB objects (policy: catalog-assets/generated/). */
export const PLANNER_GENERATED_GLB_PREFIX = "generated";

export type CatalogStorageUploadResult =
  | { ok: true; path: string; publicUrl: string }
  | { ok: false; reason: string };

function tryCreateServiceClient(): SupabaseClient | null {
  const url =
    process.env.SUPABASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

export function plannerSymbolSvgPath(slug: string): string {
  return `${PLANNER_SYMBOLS_PREFIX}/${slug}/symbol.svg`;
}

export function plannerSymbolDescriptorPath(slug: string): string {
  return `${PLANNER_SYMBOLS_PREFIX}/${slug}/descriptor.json`;
}

export function publicCatalogAssetUrl(storagePath: string): string | null {
  const base =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    process.env.SUPABASE_URL?.trim() ||
    "";
  if (!base) return null;
  return `${base.replace(/\/$/, "")}/storage/v1/object/public/${CATALOG_ASSETS_BUCKET}/${storagePath}`;
}

export async function uploadCatalogAssetText(args: {
  path: string;
  body: string;
  contentType: string;
  upsert?: boolean;
}): Promise<CatalogStorageUploadResult> {
  const client = tryCreateServiceClient();
  if (!client) {
    return { ok: false, reason: "supabase_service_role_not_configured" };
  }

  const bytes = new TextEncoder().encode(args.body);
  const { error } = await client.storage
    .from(CATALOG_ASSETS_BUCKET)
    .upload(args.path, bytes, {
      contentType: args.contentType,
      upsert: args.upsert ?? true,
      cacheControl: "public, max-age=3600",
    });

  if (error) {
    return { ok: false, reason: error.message };
  }

  const publicUrl =
    publicCatalogAssetUrl(args.path) ||
    client.storage.from(CATALOG_ASSETS_BUCKET).getPublicUrl(args.path).data
      .publicUrl;

  return { ok: true, path: args.path, publicUrl };
}

/** Release Admin SVG + descriptor so Planner can load from Supabase Storage. */
export async function publishSymbolToSupabaseCatalog(args: {
  slug: string;
  svgMarkup: string;
  descriptorJson: string;
}): Promise<{
  svg: CatalogStorageUploadResult;
  descriptor: CatalogStorageUploadResult;
}> {
  const slug = args.slug.trim();
  const [svg, descriptor] = await Promise.all([
    uploadCatalogAssetText({
      path: plannerSymbolSvgPath(slug),
      body: args.svgMarkup,
      contentType: "image/svg+xml",
      upsert: true,
    }),
    uploadCatalogAssetText({
      path: plannerSymbolDescriptorPath(slug),
      body: args.descriptorJson.endsWith("\n")
        ? args.descriptorJson
        : `${args.descriptorJson}\n`,
      contentType: "application/json",
      upsert: true,
    }),
  ]);
  return { svg, descriptor };
}

/** Planner plan/BOQ export blob for cloud handoff. */
export async function publishPlannerExportToSupabase(args: {
  ownerId: string;
  planId: string;
  filename: string;
  body: string;
  contentType?: string;
}): Promise<CatalogStorageUploadResult> {
  const safeOwner = args.ownerId.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64);
  const safePlan = args.planId.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64);
  const safeName = args.filename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
  const path = `${PLANNER_EXPORTS_PREFIX}/${safeOwner}/${safePlan}/${Date.now()}-${safeName}`;
  return uploadCatalogAssetText({
    path,
    body: args.body,
    contentType: args.contentType ?? "application/json",
    upsert: false,
  });
}

/** Safe single path segment for generated GLB keys (no traversal / separators). */
function sanitizeGlbPathSegment(segment: string, maxLen = 80): string {
  return segment.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/^\.+/, "").slice(0, maxLen);
}

/**
 * Resolve a client-supplied generated GLB relative path into a storage object key.
 * - Rejects traversal, absolute paths, and non-generated prefixes.
 * - Namespaces by owner when provided (`generated/u/{owner}/…`).
 * - Guests (no owner) land under `generated/guest/{unique}-…` so shared product
 *   keys cannot be planted or overwritten.
 * Exported for unit tests.
 */
export function resolveGeneratedGlbStorageKey(args: {
  relativePath: string;
  ownerId?: string | null;
}):
  | { ok: true; storageKey: string; allowUpsert: boolean }
  | { ok: false; reason: string } {
  const raw = args.relativePath.trim().replace(/^\/+/, "").replace(/\\/g, "/");
  if (!raw || raw.includes("\0") || raw.includes("..")) {
    return { ok: false, reason: "invalid_generated_glb_path" };
  }

  // Accept catalog-assets/generated/foo.glb or generated/foo.glb
  const withoutBucketPrefix = raw.startsWith("catalog-assets/")
    ? raw.slice("catalog-assets/".length)
    : raw;

  if (
    !withoutBucketPrefix.startsWith(`${PLANNER_GENERATED_GLB_PREFIX}/`) ||
    !withoutBucketPrefix.toLowerCase().endsWith(".glb")
  ) {
    return { ok: false, reason: "invalid_generated_glb_path" };
  }

  const rest = withoutBucketPrefix.slice(`${PLANNER_GENERATED_GLB_PREFIX}/`.length);
  if (!rest || rest.includes("..") || rest.startsWith("/") || rest.includes("//")) {
    return { ok: false, reason: "invalid_generated_glb_path" };
  }

  const segments = rest.split("/").filter(Boolean);
  if (segments.length === 0 || segments.length > 4) {
    return { ok: false, reason: "invalid_generated_glb_path" };
  }
  if (segments.some((s) => s === "." || s === ".." || s.includes("\\"))) {
    return { ok: false, reason: "invalid_generated_glb_path" };
  }

  const basename = segments[segments.length - 1] ?? "";
  const safeBase = sanitizeGlbPathSegment(basename);
  if (!safeBase.toLowerCase().endsWith(".glb") || safeBase.length < 5) {
    return { ok: false, reason: "invalid_generated_glb_path" };
  }

  const owner = typeof args.ownerId === "string" ? args.ownerId.trim() : "";
  if (owner) {
    const safeOwner = sanitizeGlbPathSegment(owner, 64);
    if (!safeOwner) {
      return { ok: false, reason: "invalid_generated_glb_path" };
    }
    // Members may overwrite only within their own namespace.
    return {
      ok: true,
      storageKey: `${PLANNER_GENERATED_GLB_PREFIX}/u/${safeOwner}/${safeBase}`,
      allowUpsert: true,
    };
  }

  // Guests: unique key under generated/guest/ — never upsert shared product keys.
  const unique = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return {
    ok: true,
    storageKey: `${PLANNER_GENERATED_GLB_PREFIX}/guest/${unique}-${safeBase}`,
    allowUpsert: false,
  };
}

/**
 * Upload system-generated GLB bytes.
 * Storage object key is under `generated/` so the public URL path contains
 * `catalog-assets/generated/` (glbAssetPolicy allowlist).
 * Never writes under site/public.
 *
 * Security: guests cannot overwrite shared product keys (namespaced + upsert false).
 * Authenticated owners write under `generated/u/{ownerId}/` with upsert allowed.
 */
export async function publishGeneratedGlbToSupabase(args: {
  relativePath: string;
  body: ArrayBuffer | Uint8Array;
  /** Authenticated user id when available — namespaces storage key. */
  ownerId?: string | null;
}): Promise<CatalogStorageUploadResult> {
  const client = tryCreateServiceClient();
  if (!client) {
    return { ok: false, reason: "supabase_service_role_not_configured" };
  }

  const resolved = resolveGeneratedGlbStorageKey({
    relativePath: args.relativePath,
    ownerId: args.ownerId,
  });
  if (!resolved.ok) {
    return { ok: false, reason: resolved.reason };
  }

  const { storageKey, allowUpsert } = resolved;

  const bytes =
    args.body instanceof Uint8Array ? args.body : new Uint8Array(args.body);
  if (bytes.byteLength === 0) {
    return { ok: false, reason: "empty_glb_body" };
  }
  if (bytes.byteLength > 25 * 1024 * 1024) {
    return { ok: false, reason: "glb_too_large" };
  }

  const { error } = await client.storage
    .from(CATALOG_ASSETS_BUCKET)
    .upload(storageKey, bytes, {
      contentType: "model/gltf-binary",
      upsert: allowUpsert,
      cacheControl: "public, max-age=3600",
    });

  if (error) {
    return { ok: false, reason: error.message };
  }

  const publicUrl =
    publicCatalogAssetUrl(storageKey) ||
    client.storage.from(CATALOG_ASSETS_BUCKET).getPublicUrl(storageKey)
      .data.publicUrl;

  return {
    ok: true,
    path: `catalog-assets/${storageKey}`,
    publicUrl,
  };
}
