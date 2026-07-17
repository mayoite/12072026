/**
 * Fail-closed publish: asset-engine compile (S1–S3) → disk pipeline (S4) → persist (S6).
 *
 * Mirrors POST /api/admin/svg-editor ordering so no authoring surface can report
 * success when compilation fails. Pure of Next server-action surface — injectable
 * deps for unit tests.
 *
 * Disk-path publish with optional Products DB dual-write (enabled ≠ cutover):
 * - Live authority: disk (`inventory/descriptors/`, `public/svg-catalog/`) until
 *   `SVG_RELEASE_AUTHORITY=db` is proven and flipped.
 * - ADM-PUB-03: success only after compile + S4 + persist; failures roll back.
 * - Optional `dbRepository` / `artifactStore` inject only when Products DB is
 *   configured **and** R2 is reachable (`resolveSvgPublishDualWriteDeps`). Dead R2
 *   skips dual-write and must not roll back disk. When dual-write **is** injected,
 *   DB/storage failure rolls back disk (fail-closed dual-write, not best-effort).
 * - Dual-write payload: real descriptor JSON + SVG + PNG (honest SHA-256, no PNG
 *   stub) + revision metadata; product pointer when a matching managed product exists.
 * - DB-SVG-07: prior SVG/descriptor restored when post-pipeline persist fails.
 * - DB-SVG-08: unchanged released SVG + descriptor short-circuits (no partial rewrite).
 *
 * GS: BP-03, anti-copy. No `any`.
 */

import { createHash } from "node:crypto";

import { Resvg } from "@resvg/resvg-js";

import type { BlockDescriptor } from "@/features/planner/catalog/svg/svgTypes";
import type { PlannerDescriptorError, PlannerResult } from "@/features/planner/catalog/svg/svgTypes";
import {
  parseAdminPayload,
  persistBlockDescriptor,
  type PersistResult,
} from "@/features/admin/svg-editor/storage/persistBlockDescriptor";
import {
  runSvgPipeline,
  type PipelineOptions,
  type PipelineResult,
} from "@/features/admin/svg-editor/publish/svgPipelineRunner";
import { compileSvgForPublish } from "@/features/planner/asset-engine/svg/compileSvgForPublish";
import type { SvgCompileStagesResult } from "@/features/planner/asset-engine/svg/runSvgCompileStages";
import {
  assertDescriptorPublishable,
  buildReleasedProductFromPublish,
} from "@/features/admin/svg-editor/publish/releasedCatalogPublishGate";
import type { ImmutableSvgRevisionRepository } from "@/features/admin/svg-editor/svgRevisionRepository.server";
import type { SvgBlockDefinitionV1 } from "@/features/admin/svg-editor/contracts/svgBlockSchemas";
import { SVG_RASTER_MASTER_WIDTH } from "@/features/planner/catalog/svg/svgPreviewAssets";

/** Rasterize published SVG to PNG with honest SHA-256 (no SVG-hash stub). */
export function rasterizePublishedSvgPng(svgMarkup: string): {
  readonly png: Buffer;
  readonly checksum: string;
} {
  const png = Buffer.from(
    new Resvg(svgMarkup, {
      fitTo: { mode: "width", value: SVG_RASTER_MASTER_WIDTH },
    })
      .render()
      .asPng(),
  );
  return {
    png,
    checksum: createHash("sha256").update(png).digest("hex"),
  };
}

export type PublishDescriptorSuccess = {
  readonly success: true;
  readonly descriptor: BlockDescriptor;
  /**
   * True when compile matched the already-released SVG + product fingerprint
   * and no disk rewrite ran (DB-SVG-08 disk path).
   */
  readonly idempotent?: boolean;
};

export type PublishDescriptorFailure = {
  readonly success: false;
  readonly error: string;
};

export type PublishDescriptorResult =
  | PublishDescriptorSuccess
  | PublishDescriptorFailure;

/**
 * Snapshot of the currently released product for idempotent republish detection.
 * Injected in tests; production may load live SVG + descriptor checksums.
 */
export type ReleasedPublishSnapshot = {
  /** SHA-256 hex of the live released SVG bytes. */
  readonly svgChecksum: string;
  /** Canonical descriptor checksum of the last published product JSON. */
  readonly descriptorChecksum: string;
};

export type PublishDescriptorWithPipelineDeps = {
  readonly parsePayload?: (
    input: unknown,
  ) => PlannerResult<BlockDescriptor, PlannerDescriptorError>;
  /**
   * Asset-engine authority (S1 normalize → S2 compile → S3 sanitize).
   * Fail-closed before S4 disk write.
   */
  readonly compileSvg?: (
    descriptor: BlockDescriptor,
  ) => Promise<SvgCompileStagesResult>;
  /**
   * S4 write public/svg-catalog. Publish passes `skipCompile` + `precompiledSvg`
   * from the prior compileSvg step so S1–S3 are not re-run.
   */
  readonly runPipeline?: (
    descriptor: BlockDescriptor,
    options?: PipelineOptions,
  ) => Promise<PipelineResult>;
  readonly persist?: (input: unknown) => PersistResult;
  /**
   * Optional live released snapshot. When present and matches the compiled
   * release, publish returns success without pipeline/persist (DB-SVG-08).
   */
  readonly readReleasedSnapshot?: (
    slug: string,
  ) => ReleasedPublishSnapshot | null;

  /**
   * Optional DB revision repository for dual-write (DB-SVG-01..05).
   * Injected only when Products DB + R2 are ready. When provided, revisions +
   * artifacts are written after disk commits; DB/storage failures fail the
   * publish and roll back disk so dual-write stays consistent. Disk remains
   * live read authority until SVG_RELEASE_AUTHORITY=db cutover is proven.
   */
  readonly dbRepository?: ImmutableSvgRevisionRepository;
  /** Immutable object storage used by DB-backed releases. */
  readonly artifactStore?: {
    putText(key: string, body: string, contentType: string): Promise<void>;
    putBytes?(
      key: string,
      body: Uint8Array | Buffer,
      contentType: string,
    ): Promise<void>;
  };
  /**
   * Optional PNG raster for dual-write tests. Production uses
   * {@link rasterizePublishedSvgPng}.
   */
  readonly rasterizePng?: (svgMarkup: string) => {
    readonly png: Buffer;
    readonly checksum: string;
  };
  /** Authenticated admin actor recorded on immutable database revisions. */
  readonly actorId?: string;
  /** Human-readable publication reason recorded with the revision. */
  readonly reason?: string;
};

const DEFAULT_DEPS: Required<
  Omit<
    PublishDescriptorWithPipelineDeps,
    | "readReleasedSnapshot"
    | "dbRepository"
    | "actorId"
    | "reason"
    | "artifactStore"
    | "rasterizePng"
  >
> & {
  readonly readReleasedSnapshot: (
    slug: string,
  ) => ReleasedPublishSnapshot | null;
  readonly dbRepository?: ImmutableSvgRevisionRepository;
} = {
  parsePayload: parseAdminPayload,
  compileSvg: compileSvgForPublish,
  runPipeline: runSvgPipeline,
  persist: persistBlockDescriptor,
  readReleasedSnapshot: () => null,
};

export function sha256Utf8(body: string): string {
  return createHash("sha256").update(body, "utf8").digest("hex");
}

export function buildReleaseRevisionId(
  descriptor: BlockDescriptor,
  svgMarkup: string,
): string {
  const fingerprint = sha256Utf8(
    `${descriptor.checksum}:${sha256Utf8(svgMarkup)}`,
  );
  return `${descriptor.slug}-r-${fingerprint.slice(0, 20)}`;
}

function safeDefinitionPartId(candidate: string | undefined, index: number): string {
  const normalized = candidate
    ?.trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
  return normalized && /^[a-z][a-z0-9-]{1,63}$/.test(normalized)
    ? normalized
    : `part-${index + 1}`;
}

export function blockDescriptorToDefinition(
  descriptor: BlockDescriptor,
  actorId: string,
): SvgBlockDefinitionV1 {
  const blocks = descriptor.blocks?.length
    ? descriptor.blocks
    : [
        {
          x: descriptor.viewBox.x,
          y: descriptor.viewBox.y,
          width: descriptor.geometry.widthMm,
          depth: descriptor.geometry.depthMm,
        },
      ];

  const parameters =
    descriptor.variant === "parametric"
      ? descriptor.parametric.parameterSchema.map((parameter, index) => {
          const id = safeDefinitionPartId(parameter.key, index);
          if (parameter.kind === "select") {
            const values = parameter.options?.filter((value) => value.length > 0) ?? [];
            return {
              id,
              kind: "enum" as const,
              label: parameter.label,
              customerEditable: true,
              defaultValue:
                typeof parameter.default === "string"
                  ? parameter.default
                  : (values[0] ?? "default"),
              values: values.length > 0 ? values : ["default"],
            };
          }
          if (parameter.kind === "boolean") {
            return {
              id,
              kind: "boolean" as const,
              label: parameter.label,
              customerEditable: true,
              defaultValue:
                typeof parameter.default === "boolean" ? parameter.default : false,
            };
          }
          return {
            id,
            kind: "number" as const,
            label: parameter.label,
            customerEditable: true,
            defaultValue:
              typeof parameter.default === "number" ? parameter.default : 0,
            ...(parameter.bounds
              ? { minimum: parameter.bounds[0], maximum: parameter.bounds[1] }
              : {}),
          };
        })
      : [];

  return {
    schemaVersion: 1,
    typeId: descriptor.slug,
    name: descriptor.slug,
    ...(descriptor.sku ? { sku: descriptor.sku } : {}),
    category: "uncategorized",
    tags: [descriptor.variant, descriptor.sourceProvenance],
    lifecycle: {
      status: "published",
      ownerId: actorId,
    },
    viewBox: descriptor.viewBox,
    physicalDimensionsMm: {
      width: descriptor.geometry.widthMm,
      depth: descriptor.geometry.depthMm,
      height: descriptor.geometry.heightMm,
    },
    parts: blocks.map((block, index) => ({
      kind: "rect" as const,
      id: safeDefinitionPartId(block.id, index),
      visible: true,
      x: block.x,
      y: block.y,
      width: block.width,
      height: block.depth,
      customerEditable: false,
    })),
    parameters,
    actions: [],
    constraints: [],
    variants: [],
    mounting: descriptor.mounting.map((plane) => ({
      plane,
      anchor: { x: 0, y: 0 },
      rotationDegrees: 0,
    })),
    accessibility: { title: descriptor.slug },
  };
}

function runAllBestEffort(...operations: ReadonlyArray<(() => void) | undefined>): string[] {
  const errors: string[] = [];
  for (const operation of operations) {
    try { operation?.(); } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }
  return errors;
}

function withRecoveryErrors(error: string, recoveryErrors: readonly string[]): string {
  return recoveryErrors.length === 0
    ? error
    : `${error} (rollback incomplete: ${recoveryErrors.join("; ")})`;
}

/**
 * Validate → compileSvgForPublish (S1–S3) → runSvgPipeline S4-only → persist (S6).
 * Compile or pipeline failure aborts before descriptor persist.
 *
 * S4 is invoked with `skipCompile` + `precompiledSvg` from the compile step so
 * publish does not double-run S1–S3 (compileSvgForPublish already validated).
 *
 * If S4 succeeds and persist fails, SVG artifacts may already exist on
 * disk (or under fixtures) even though the descriptor JSON was not committed.
 */
export async function publishDescriptorWithPipeline(
  descriptorInput: unknown,
  deps: PublishDescriptorWithPipelineDeps = {},
): Promise<PublishDescriptorResult> {
  const parsePayload = deps.parsePayload ?? DEFAULT_DEPS.parsePayload;
  const compileSvg = deps.compileSvg ?? DEFAULT_DEPS.compileSvg;
  const runPipeline = deps.runPipeline ?? DEFAULT_DEPS.runPipeline;
  const persist = deps.persist ?? DEFAULT_DEPS.persist;
  const readReleasedSnapshot =
    deps.readReleasedSnapshot ?? DEFAULT_DEPS.readReleasedSnapshot;
  const actorId = deps.actorId?.trim() || "system";
  const reason = deps.reason?.trim() || "publish";

  const parsed = parsePayload(descriptorInput);
  if (!parsed.ok) {
    return {
      success: false,
      error: `${parsed.error.code}: ${parsed.error.message}`,
    };
  }

  const descriptor = parsed.value;

  // Phase 2: incomplete / contradictory products cannot publish.
  const contractGate = assertDescriptorPublishable(descriptor);
  if (!contractGate.ok) {
    return { success: false, error: contractGate.error };
  }

  // S1–S3: asset-engine authority (normalize + pipelineCore + sanitize)
  let compile: SvgCompileStagesResult;
  try {
    compile = await compileSvg(descriptor);
  } catch (err) {
    const details = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      error: `compiler_exception: A fatal error occurred during SVG compilation. ${details}`,
    };
  }

  if (!compile.ok) {
    return {
      success: false,
      error: `compiler_failed: Backend SVG compilation failed. ${compile.error} (failedAt=${compile.failedAt})`,
    };
  }

  const revisionId = buildReleaseRevisionId(descriptor, compile.svg);
  const publishedAt = new Date().toISOString();
  const released = buildReleasedProductFromPublish({
    descriptor,
    svgMarkup: compile.svg,
    revisionId,
    publishedAt,
    availability: "available",
  });
  if (!released.ok) {
    return { success: false, error: released.error };
  }

  // DB-SVG-08: the content-derived revision ID makes unchanged publication
  // deterministic. Resolve it before any disk write. A matching immutable
  // revision is a successful no-op; a collision fails closed.
  if (deps.dbRepository) {
    try {
      const existing = await deps.dbRepository.load(revisionId);
      if (existing) {
        const checksums = existing.revision.artifactChecksums;
        if (
          checksums.descriptor !== descriptor.checksum ||
          checksums.svg !== released.product.svg.checksum
        ) {
          return {
            success: false,
            error: `500.db: Immutable revision collision for ${revisionId}.`,
          };
        }
        await deps.dbRepository.updateProductPointer(descriptor.slug, revisionId);
        return { success: true, descriptor, idempotent: true };
      }
    } catch (dbError) {
      const details =
        dbError instanceof Error ? dbError.message : String(dbError);
      return {
        success: false,
        error: `500.db: Products DB revision lookup failed. ${details}`,
      };
    }
  }

  // DB-SVG-08 (disk path): unchanged released SVG + descriptor → no rewrite.
  // Success without pipeline/persist — cannot leave a partial dual-write.
  const live = readReleasedSnapshot(descriptor.slug);
  if (
    live &&
    live.svgChecksum === released.product.svg.checksum &&
    live.descriptorChecksum === descriptor.checksum
  ) {
    return {
      success: true,
      descriptor,
      idempotent: true,
    };
  }

  // S4: disk write only — reuse validated SVG from compileSvgForPublish (no S1–S3 recompile)
  let pipeline: PipelineResult;
  try {
    pipeline = await runPipeline(descriptor, {
      skipCompile: true,
      precompiledSvg: compile.svg,
    });
  } catch (err) {
    const details = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      error: `compiler_exception: A fatal error occurred during SVG compilation. ${details}`,
    };
  }

  if (!pipeline.ok) {
    return {
      success: false,
      error: `compiler_failed: Backend SVG compilation failed. ${pipeline.error}`,
    };
  }

  // Persist only after successful compilation + disk write. If this fails, SVG
  // may already be on disk from the pipeline step — surface the write error;
  // do not claim publish success.
  let persistResult: PersistResult;
  try {
    persistResult = persist(descriptor);
  } catch (err) {
    const details = err instanceof Error ? err.message : String(err);
    const recoveryErrors = runAllBestEffort(pipeline.rollback, pipeline.cleanup);
    return { success: false, error: withRecoveryErrors(`500.io: Descriptor persistence threw. ${details}`, recoveryErrors) };
  }
  if (!persistResult.ok) {
    const recoveryErrors = runAllBestEffort(
      persistResult.rollback,
      pipeline.rollback,
      persistResult.cleanup,
      pipeline.cleanup,
    );
    return {
      success: false,
      error: withRecoveryErrors(`${persistResult.error.code}: ${persistResult.error.message}`, recoveryErrors),
    };
  }

  try {
    pipeline.commit?.();
  } catch (err) {
    const details = err instanceof Error ? err.message : String(err);
    const recoveryErrors = runAllBestEffort(
      persistResult.rollback,
      pipeline.rollback,
      persistResult.cleanup,
      pipeline.cleanup,
    );
    return { success: false, error: withRecoveryErrors(`500.io: Publication commit failed. ${details}`, recoveryErrors) };
  }

  // DB-SVG-01..05 dual-write path: when deps are injected, DB/storage failure must
  // fail publish and roll back disk. This is dual-write consistency — not cutover.
  // Disk remains live release authority until SVG_RELEASE_AUTHORITY=db is proven.
  if (deps.dbRepository) {
    const compiledSvgChecksum = sha256Utf8(compile.svg);
    const definitionChecksum = descriptor.checksum;
    const definitionVersion = persistResult.version;
    const releasedForDatabase = buildReleasedProductFromPublish({
      descriptor,
      svgMarkup: compile.svg,
      revisionId,
      definitionVersion,
      publishedAt,
      availability: "available",
    });
    if (!releasedForDatabase.ok) {
      const recoveryErrors = runAllBestEffort(
        persistResult.rollback,
        pipeline.rollback,
        persistResult.cleanup,
        pipeline.cleanup,
      );
      return {
        success: false,
        error: withRecoveryErrors(
          `500.db: Released product mapping failed. ${releasedForDatabase.error}`,
          recoveryErrors,
        ),
      };
    }

    if (!deps.artifactStore) {
      const recoveryErrors = runAllBestEffort(
        persistResult.rollback,
        pipeline.rollback,
        persistResult.cleanup,
        pipeline.cleanup,
      );
      return {
        success: false,
        error: withRecoveryErrors(
          "500.storage: Immutable SVG artifact storage is not configured.",
          recoveryErrors,
        ),
      };
    }

    const descriptorStorageKey = `svg-revisions/${revisionId}/descriptor.json`;
    const svgStorageKey = `svg-revisions/${revisionId}/symbol.svg`;
    const pngStorageKey = `svg-revisions/${revisionId}/master.png`;

    let pngArtifact: { readonly png: Buffer; readonly checksum: string };
    try {
      pngArtifact = (deps.rasterizePng ?? rasterizePublishedSvgPng)(compile.svg);
    } catch (rasterError) {
      const details =
        rasterError instanceof Error ? rasterError.message : String(rasterError);
      const recoveryErrors = runAllBestEffort(
        persistResult.rollback,
        pipeline.rollback,
        persistResult.cleanup,
        pipeline.cleanup,
      );
      return {
        success: false,
        error: withRecoveryErrors(
          `500.storage: PNG rasterization failed. ${details}`,
          recoveryErrors,
        ),
      };
    }

    if (!deps.artifactStore.putBytes) {
      const recoveryErrors = runAllBestEffort(
        persistResult.rollback,
        pipeline.rollback,
        persistResult.cleanup,
        pipeline.cleanup,
      );
      return {
        success: false,
        error: withRecoveryErrors(
          "500.storage: Immutable binary artifact storage (putBytes) is not configured.",
          recoveryErrors,
        ),
      };
    }

    try {
      await Promise.all([
        deps.artifactStore.putText(
          descriptorStorageKey,
          `${JSON.stringify(descriptor)}\n`,
          "application/json",
        ),
        deps.artifactStore.putText(
          svgStorageKey,
          compile.svg,
          "image/svg+xml",
        ),
        deps.artifactStore.putBytes(
          pngStorageKey,
          pngArtifact.png,
          "image/png",
        ),
      ]);
    } catch (storageError) {
      const details =
        storageError instanceof Error ? storageError.message : String(storageError);
      const recoveryErrors = runAllBestEffort(
        persistResult.rollback,
        pipeline.rollback,
        persistResult.cleanup,
        pipeline.cleanup,
      );
      return {
        success: false,
        error: withRecoveryErrors(
          `500.storage: Immutable artifact upload failed. ${details}`,
          recoveryErrors,
        ),
      };
    }

    try {
      await deps.dbRepository.publish(
        {
          schemaVersion: 1,
          revisionId,
          definitionTypeId: descriptor.slug,
          definitionVersion,
          compilerVersion: "oando-asset-engine-v1",
          sourceRevision: Math.max(0, definitionVersion - 1),
          artifactChecksums: {
            descriptor: definitionChecksum,
            svg: compiledSvgChecksum,
            png: pngArtifact.checksum,
            thumbnails: {},
          },
          validation: {
            valid: true,
            diagnostics: [],
          },
          actorId,
          publishedAt,
          reason,
        },
        blockDescriptorToDefinition(descriptor, actorId),
        [
          {
            revisionId,
            kind: "descriptor",
            checksum: definitionChecksum,
            storageKey: descriptorStorageKey,
          },
          {
            revisionId,
            kind: "svg",
            checksum: compiledSvgChecksum,
            storageKey: svgStorageKey,
          },
          {
            revisionId,
            kind: "png",
            checksum: pngArtifact.checksum,
            storageKey: pngStorageKey,
          },
        ],
        descriptor,
        releasedForDatabase.product,
      );
    } catch (dbError) {
      const details =
        dbError instanceof Error ? dbError.message : String(dbError);
      const recoveryErrors = runAllBestEffort(
        persistResult.rollback,
        pipeline.rollback,
        persistResult.cleanup,
        pipeline.cleanup,
      );
      return {
        success: false,
        error: withRecoveryErrors(
          `500.db: Products DB publish failed. ${details}`,
          recoveryErrors,
        ),
      };
    }
  }

  const cleanupErrors = runAllBestEffort(persistResult.cleanup, pipeline.cleanup);
  if (cleanupErrors.length > 0) {
    return {
      success: false,
      error: `500.io: Publication committed but cleanup incomplete: ${cleanupErrors.join("; ")}`,
    };
  }

  return { success: true, descriptor: persistResult.descriptor };
}
