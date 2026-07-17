/**
 * Client-safe place + G5 + public write + stamp for planner inventory.
 *
 * Node `writeGeneratedGlbToPublic` cannot run in the browser; this path POSTs
 * bytes to `/api/planner/generated-glb` (server writes under site/public), then
 * stamps the same relativePath so G8 can fetch `/catalog-assets/generated/…`.
 *
 * Only used when `shouldPlaceModularWithGeneratedGlb(item)` (cabinet-v0).
 */

import {
  placeModularWithGeneratedGlbCore,
  type PlaceModularWithGeneratedGlbCoreResult,
} from "@/features/planner/asset-engine/mesh/placeModularWithGeneratedGlbCore";
import type { PlacementOptions } from "@/features/planner/catalog/placementAction";
import type {
  PlannerCatalogItem,
  PlannerCatalogVariant,
} from "@/features/planner/catalog/catalogTypes";
import type { PlannerProject } from "@/features/planner/model/types";

export const GENERATED_GLB_WRITE_API_PATH = "/api/planner/generated-glb";

export type PlaceModularWithGeneratedGlbBrowserOptions = {
  variant?: PlannerCatalogVariant | null;
  placedFrom?: PlacementOptions["placedFrom"];
  rotation?: number;
  scale?: PlacementOptions["scale"];
  materialOverride?: string;
  colorOverride?: string;
  locked?: boolean;
  /**
   * When false, stamp after G5 without calling the write API.
   * Default true (G8 needs fetchable bytes under public/).
   */
  writeToPublic?: boolean;
  /** Override write endpoint (tests). Default GENERATED_GLB_WRITE_API_PATH. */
  writeApiPath?: string;
  /** Injectable fetch (tests). Default globalThis.fetch. */
  fetchImpl?: typeof fetch;
};

export type PlaceModularWithGeneratedGlbBrowserResult =
  PlaceModularWithGeneratedGlbCoreResult;

type WriteApiSuccess = {
  readonly ok: true;
  readonly relativePath: string;
  readonly publicUrlPath: string;
  readonly byteLength: number;
};

function isWriteApiSuccess(body: unknown): body is WriteApiSuccess {
  if (body === null || typeof body !== "object") return false;
  const rec = body as Record<string, unknown>;
  return (
    rec.ok === true &&
    typeof rec.relativePath === "string" &&
    typeof rec.publicUrlPath === "string"
  );
}

/**
 * Write generated GLB via planner API (server uses writeGeneratedGlbToPublic).
 */
export async function writeGeneratedGlbViaApi(
  buffer: ArrayBuffer,
  relativePath: string,
  options?: {
    writeApiPath?: string;
    fetchImpl?: typeof fetch;
  },
): Promise<{ absolutePath: string | null; publicUrlPath: string | null }> {
  const fetchFn = options?.fetchImpl ?? globalThis.fetch;
  if (typeof fetchFn !== "function") {
    throw new Error("writeGeneratedGlbViaApi requires fetch");
  }
  const path = options?.writeApiPath ?? GENERATED_GLB_WRITE_API_PATH;
  // Prefer CSRF-aware browser fetch when available (planner client).
  let response: Response;
  if (options?.fetchImpl) {
    response = await options.fetchImpl(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        "X-Generated-Glb-Relative-Path": relativePath,
      },
      body: buffer,
    });
  } else {
    const { browserApiFetch } = await import("@/lib/api/browserApi");
    response = await browserApiFetch(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        "X-Generated-Glb-Relative-Path": relativePath,
      },
      body: buffer,
    });
  }
  if (!response.ok) {
    throw new Error(
      `writeGeneratedGlbViaApi failed: HTTP ${response.status}`,
    );
  }
  const json: unknown = await response.json();
  if (!isWriteApiSuccess(json)) {
    throw new Error("writeGeneratedGlbViaApi: invalid success body");
  }
  return {
    absolutePath: null,
    // Prefer public URL for fetch; fall back to relative path for policy stamp.
    publicUrlPath: json.publicUrlPath || json.relativePath,
  };
}

/**
 * Browser place path equivalent to placeModularWithGeneratedGlbPlan
 * (writeToPublic true → API write then stamp).
 */
export async function placeModularWithGeneratedGlbBrowser(
  project: PlannerProject,
  item: PlannerCatalogItem,
  position: { x: number; y: number },
  options?: PlaceModularWithGeneratedGlbBrowserOptions,
): Promise<PlaceModularWithGeneratedGlbBrowserResult> {
  const writeToPublic = options?.writeToPublic === true;
  return placeModularWithGeneratedGlbCore(project, item, position, {
    variant: options?.variant,
    placedFrom: options?.placedFrom ?? "click",
    rotation: options?.rotation,
    scale: options?.scale,
    materialOverride: options?.materialOverride,
    colorOverride: options?.colorOverride,
    locked: options?.locked,
    writeToPublic,
    writeBytes: writeToPublic
      ? (buffer, relativePath) =>
          writeGeneratedGlbViaApi(buffer, relativePath, {
            writeApiPath: options?.writeApiPath,
            fetchImpl: options?.fetchImpl,
          })
      : undefined,
  });
}
