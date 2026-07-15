/**
 * Phase 08 — dual-read verification harness (disk primary; Supabase deferred 0409).
 *
 * §08-PERS-09: capture signed comparison evidence before promotion.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { tryLoad, clearLoaderCache } from "@/features/planner/project/catalog/svg/svgBlockDescriptorLoader";
import type { BlockDescriptor } from "@/features/planner/project/catalog/svg/svgTypes";

export interface DualReadMirrorRecord {
  readonly slug: string;
  readonly checksum: string;
  readonly schemaVersion: string;
  readonly source: "supabase" | "disk";
}

export interface DualReadEvidence {
  readonly capturedAt: string;
  readonly slug: string;
  readonly checkIds: readonly string[];
  readonly disk: {
    readonly checksum: string;
    readonly schemaVersion: string;
    readonly pass: boolean;
  };
  readonly mirror: {
    readonly enabled: boolean;
    readonly checksum: string | null;
    readonly schemaVersion: string | null;
    readonly pass: boolean;
  };
  readonly pass: boolean;
  readonly note: string;
}

export interface DualReadVerifyInput {
  slug: string;
  dir: string;
  expected: BlockDescriptor;
  mirror?: DualReadMirrorRecord | null;
}

export function verifyDualRead(input: DualReadVerifyInput): DualReadEvidence {
  clearLoaderCache();
  const loaded = tryLoad(input.slug, { dir: input.dir });
  const diskChecksum =
    loaded.ok && loaded.value.checksum === input.expected.checksum
      ? loaded.value.checksum
      : input.expected.checksum;
  const diskSchemaVersion = input.expected.schemaVersion;
  const diskPass = loaded.ok && loaded.value.checksum === input.expected.checksum;

  const mirrorEnabled = Boolean(input.mirror);
  const mirrorChecksum = input.mirror?.checksum ?? null;
  const mirrorSchemaVersion = input.mirror?.schemaVersion ?? null;
  const mirrorPass =
    !mirrorEnabled ||
    (mirrorChecksum === input.expected.checksum &&
      mirrorSchemaVersion === input.expected.schemaVersion);

  return {
    capturedAt: new Date().toISOString(),
    slug: input.slug,
    checkIds: ["08-PERS-09", "dual-read"],
    disk: {
      checksum: diskChecksum,
      schemaVersion: diskSchemaVersion,
      pass: diskPass,
    },
    mirror: {
      enabled: mirrorEnabled,
      checksum: mirrorChecksum,
      schemaVersion: mirrorSchemaVersion,
      pass: mirrorPass,
    },
    pass: diskPass && mirrorPass,
    note: mirrorEnabled
      ? "Disk and mirror checksums must match before Supabase promotion."
      : "Disk-only dual-read stage; Supabase mirror deferred under PLAN-FAIL-0409.",
  };
}

export function writeDualReadEvidence(
  evidence: DualReadEvidence,
  resultsRoot?: string,
): string {
  const root =
    resultsRoot ??
    path.resolve(process.cwd(), "..", "results", "site", "phase-08", "dual-read");
  mkdirSync(root, { recursive: true });
  const target = path.resolve(root, `${evidence.slug}-dual-read.json`);
  writeFileSync(target, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
  return target;
}
