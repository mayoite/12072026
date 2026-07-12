/**
 * Admin P06 — restore a prior descriptor revision forward (history preserved).
 */

import { BLOCK_DESCRIPTORS_DIR_DEFAULT } from "@/features/planner/project/catalog/svg/svgBlockDescriptorLoader";
import { persistBlockDescriptor } from "./persistBlockDescriptor";
import { publishDescriptorWithPipeline } from "./publishDescriptorWithPipeline";
import { appendDescriptorAudit } from "./descriptorAuditLog";
import { readDescriptorAtVersion } from "./descriptorRevisionIndex";

export type RollbackSuccess = {
  readonly ok: true;
  readonly slug: string;
  readonly fromVersion: number;
  readonly newVersion: number;
};

export type RollbackFailure = {
  readonly ok: false;
  readonly error: string;
};

export type RollbackResult = RollbackSuccess | RollbackFailure;

export async function rollbackDescriptorToVersion(
  slug: string,
  fromVersion: number,
  actorId: string,
  dir: string = BLOCK_DESCRIPTORS_DIR_DEFAULT,
): Promise<RollbackResult> {
  const snapshot = readDescriptorAtVersion(slug, fromVersion, dir);
  if (!snapshot) {
    return { ok: false, error: `Revision ${fromVersion} not found for "${slug}"` };
  }

  const persisted = persistBlockDescriptor(snapshot, { dir });
  if (!persisted.ok) {
    return { ok: false, error: persisted.error.message };
  }

  const published = await publishDescriptorWithPipeline(snapshot);
  if (!published.success) {
    return { ok: false, error: published.error };
  }

  appendDescriptorAudit(
    {
      actorId,
      slug,
      action: "rollback",
      detail: {
        fromVersion,
        newVersion: persisted.version,
      },
    },
    dir,
  );

  return {
    ok: true,
    slug,
    fromVersion,
    newVersion: persisted.version,
  };
}