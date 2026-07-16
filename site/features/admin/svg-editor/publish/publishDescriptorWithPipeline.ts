/**
 * Fail-closed publish: asset-engine compile (S1–S3) → disk pipeline (S4) → persist (S6).
 *
 * Mirrors POST /api/admin/svg-editor ordering so no authoring surface can report
 * success when compilation fails. Pure of Next server-action surface — injectable
 * deps for unit tests.
 *
 * Phase 2 disk-path mapping (not full Products DB transaction yet):
 * - ADM-PUB-03 / dual-write: success only after compile + S4 + persist; failures roll back.
 * - DB-SVG-07: prior SVG/descriptor restored when post-pipeline persist fails.
 * - DB-SVG-08: unchanged released SVG + descriptor short-circuits (no partial rewrite).
 *
 * GS: BP-03, anti-copy. No `any`.
 */

import { createHash } from "node:crypto";

import type { BlockDescriptor } from "@/features/planner/project/catalog/svg/svgTypes";
import type { PlannerDescriptorError, PlannerResult } from "@/features/planner/project/catalog/svg/svgTypes";
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
   * When provided, revisions + artifacts are also persisted to the Products DB
   * after the disk pipeline commits. DB failures fail the publish and trigger
   * rollback so DB-configured environments are not disk-authoritative.
   */
  readonly dbRepository?: ImmutableSvgRevisionRepository;
};

const DEFAULT_DEPS: Required<
  Omit<PublishDescriptorWithPipelineDeps, "readReleasedSnapshot" | "dbRepository">
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

  const released = buildReleasedProductFromPublish({
    descriptor,
    svgMarkup: compile.svg,
    revisionId: `${descriptor.slug}-r1`,
    publishedAt: new Date().toISOString(),
    availability: "available",
  });
  if (!released.ok) {
    return { success: false, error: released.error };
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

  // DB-SVG-01..05 minimal cutover: when DB publish is enabled, DB failure must
  // fail the overall publish so disk cannot silently become the authority.
  if (deps.dbRepository) {
    try {
      const compiledSvgChecksum = sha256Utf8(compile.svg);
      const definitionChecksum = descriptor.checksum;
      const now = new Date().toISOString();
      await deps.dbRepository.publish(
        {
          schemaVersion: 1,
          revisionId: `${descriptor.slug}-r1`,
          definitionTypeId: descriptor.slug,
          definitionVersion: 1,
          compilerVersion: "oando-asset-engine-v1",
          sourceRevision: 0,
          artifactChecksums: {
            descriptor: definitionChecksum,
            svg: compiledSvgChecksum,
            png: compiledSvgChecksum,
            thumbnails: {},
          },
          validation: {
            valid: true,
            diagnostics: [],
          },
          actorId: "system",
          publishedAt: now,
          reason: "publish",
        },
        {
          schemaVersion: 1,
          typeId: descriptor.slug,
          name: descriptor.slug,
          category: "uncategorized",
          tags: [],
          lifecycle: {
            status: "published",
            ownerId: "system",
          },
          viewBox: {
            x: 0,
            y: 0,
            width: descriptor.geometry.widthMm,
            height: descriptor.geometry.depthMm,
          },
          physicalDimensionsMm: {
            width: descriptor.geometry.widthMm,
            depth: descriptor.geometry.depthMm,
            height: descriptor.geometry.heightMm,
          },
          parts: [
            {
              kind: "rect" as const,
              id: "root",
              visible: true,
              x: 0,
              y: 0,
              width: descriptor.geometry.widthMm,
              height: descriptor.geometry.depthMm,
              customerEditable: false,
            },
          ],
          parameters: [],
          actions: [],
          constraints: [],
          variants: [],
          mounting: [{ plane: "floor" as const, anchor: { x: 0, y: 0 }, rotationDegrees: 0 }],
          accessibility: { title: descriptor.slug },
        },
        [
          {
            revisionId: `${descriptor.slug}-r1`,
            kind: "descriptor",
            checksum: definitionChecksum,
            storageKey: `descriptors/${descriptor.slug}/${descriptor.slug}.json`,
          },
          {
            revisionId: `${descriptor.slug}-r1`,
            kind: "svg",
            checksum: compiledSvgChecksum,
            storageKey: `svg-catalog/${descriptor.slug}.svg`,
          },
        ],
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
