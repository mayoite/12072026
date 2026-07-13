/**
 * Client-safe catalog lifecycle types + pure resolvers (no node:fs).
 */

export type CatalogArtifactState = "published" | "missing" | "invalid";

export type CatalogLifecycleState = "live" | "draft" | "retired";

export const CATALOG_LIFECYCLE_MANIFEST = "_catalog-lifecycle.json";

export interface CatalogLifecycleEntry {
  readonly state: CatalogLifecycleState;
  readonly updatedAt: string;
}

export type CatalogLifecycleManifest = Record<string, CatalogLifecycleEntry>;

export function inferLifecycleFromArtifact(
  artifactState: CatalogArtifactState | undefined,
): CatalogLifecycleState {
  if (artifactState === "published") return "live";
  return "draft";
}

export function resolveCatalogLifecycle(
  slug: string,
  artifactState: CatalogArtifactState | undefined,
  manifest: CatalogLifecycleManifest,
): CatalogLifecycleState {
  const entry = manifest[slug];
  if (entry) return entry.state;
  return inferLifecycleFromArtifact(artifactState);
}

export function isBuyerVisibleLifecycle(state: CatalogLifecycleState): boolean {
  return state === "live";
}

/** Legacy descriptors without a manifest entry remain buyer-visible until explicitly set. */
export function isBuyerVisibleSlug(
  slug: string,
  manifest: CatalogLifecycleManifest,
): boolean {
  const entry = manifest[slug];
  if (!entry) return true;
  return entry.state === "live";
}