/**
 * Admin P06 — append-only audit trail for publish / rollback / lifecycle changes.
 */

import { appendFileSync, copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { BLOCK_DESCRIPTORS_DIR_DEFAULT } from "@/features/planner/project/catalog/svg/svgBlockDescriptorLoader";
import { ADMIN_CATALOG_OPS_DIR_DEFAULT } from "@/lib/paths/adminCatalogOps";

export type DescriptorAuditAction =
  | "publish"
  | "rollback"
  | "lifecycle_change"
  | "bulk_import"
  | "approve";

export type DescriptorAuditEntry = {
  readonly id: string;
  readonly at: string;
  readonly actorId: string;
  readonly slug: string;
  readonly action: DescriptorAuditAction;
  readonly detail: Record<string, string | number | boolean | null>;
};

const AUDIT_LOG_NAME = "_descriptor-audit.jsonl";

export function descriptorAuditLogPath(dir: string = ADMIN_CATALOG_OPS_DIR_DEFAULT): string {
  return path.resolve(dir, AUDIT_LOG_NAME);
}

function maybeMigrateLegacyAuditLog(
  opsDir: string = ADMIN_CATALOG_OPS_DIR_DEFAULT,
): void {
  const opsPath = descriptorAuditLogPath(opsDir);
  if (existsSync(opsPath)) return;
  const legacyPath = path.resolve(BLOCK_DESCRIPTORS_DIR_DEFAULT, AUDIT_LOG_NAME);
  if (!existsSync(legacyPath)) return;
  mkdirSync(opsDir, { recursive: true });
  copyFileSync(legacyPath, opsPath);
}

export function appendDescriptorAudit(
  entry: Omit<DescriptorAuditEntry, "id" | "at">,
  dir: string = ADMIN_CATALOG_OPS_DIR_DEFAULT,
): DescriptorAuditEntry {
  mkdirSync(dir, { recursive: true });
  const full: DescriptorAuditEntry = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    at: new Date().toISOString(),
  };
  appendFileSync(descriptorAuditLogPath(dir), `${JSON.stringify(full)}\n`, "utf8");
  return full;
}

export function readDescriptorAuditForSlug(
  slug: string,
  dir: string = ADMIN_CATALOG_OPS_DIR_DEFAULT,
  limit = 50,
): DescriptorAuditEntry[] {
  maybeMigrateLegacyAuditLog(dir);
  const logPath = descriptorAuditLogPath(dir);
  if (!existsSync(logPath)) return [];
  const lines = readFileSync(logPath, "utf8").split(/\r?\n/).filter(Boolean);
  const out: DescriptorAuditEntry[] = [];
  for (let i = lines.length - 1; i >= 0 && out.length < limit; i--) {
    try {
      const parsed = JSON.parse(lines[i]) as DescriptorAuditEntry;
      if (parsed.slug === slug) out.push(parsed);
    } catch {
      // skip corrupt line
    }
  }
  return out;
}
