import { describe, expect, it } from "vitest";
import path from "node:path";

import { ADMIN_CATALOG_OPS_DIR_DEFAULT } from "@/lib/paths/adminCatalogOps";
import { descriptorAuditLogPath } from "@/features/admin/svg-editor/descriptorAuditLog";
import { lifecycleManifestPath } from "@/features/admin/svg-editor/catalogLifecycle";

describe("admin catalog ops paths", () => {
  it("defaults lifecycle and audit under results/admin/catalog-ops", () => {
    expect(ADMIN_CATALOG_OPS_DIR_DEFAULT).toMatch(
      /results[\\/]admin[\\/]catalog-ops$/,
    );
    expect(lifecycleManifestPath()).toBe(
      path.join(ADMIN_CATALOG_OPS_DIR_DEFAULT, "_catalog-lifecycle.json"),
    );
    expect(descriptorAuditLogPath()).toBe(
      path.join(ADMIN_CATALOG_OPS_DIR_DEFAULT, "_descriptor-audit.jsonl"),
    );
  });
});
