import { NodeIO } from "@gltf-transform/core";
import type { Document } from "@gltf-transform/core";

// ---------------------------------------------------------------------------
// FurnitureAsset type & registry
// ---------------------------------------------------------------------------

export interface FurnitureAsset {
  catalogId: string;
  glbUrl: string;
  thumbnailUrl?: string;
  boundingBox: { width: number; depth: number; height: number };
}

/**
 * Optional catalogId → asset metadata for ingest-time audits.
 * Empty until real GLBs are committed or resolved via R2/CDN.
 */
export const FURNITURE_ASSET_REGISTRY: Map<string, FurnitureAsset> = new Map();

export function getAssetForCatalogId(catalogId: string): FurnitureAsset | null {
  return FURNITURE_ASSET_REGISTRY.get(catalogId) ?? null;
}

// ---------------------------------------------------------------------------
// GLB validation using @gltf-transform/core
// ---------------------------------------------------------------------------

export interface GlbValidationResult {
  valid: boolean;
  errors: string[];
  nodeCount: number;
  triangleCount: number;
}

/**
 * Loads a GLB binary buffer and inspects its structure.
 * Returns validation info including node and triangle counts.
 */
export async function validateGlbAsset(
  buffer: ArrayBuffer,
): Promise<GlbValidationResult> {
  const errors: string[] = [];
  let nodeCount = 0;
  let triangleCount = 0;

  try {
    const io = new NodeIO();
    const document: Document = await io.readBinary(new Uint8Array(buffer));
    const root = document.getRoot();

    const nodes = root.listNodes();
    nodeCount = nodes.length;

    for (const mesh of root.listMeshes()) {
      for (const primitive of mesh.listPrimitives()) {
        const indices = primitive.getIndices();
        if (indices) {
          triangleCount += indices.getCount() / 3;
        }
      }
    }

    if (nodeCount === 0) {
      errors.push("GLB contains no nodes");
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    errors.push("Failed to parse GLB: " + message);
  }

  return {
    valid: errors.length === 0,
    errors,
    nodeCount,
    triangleCount,
  };
}
