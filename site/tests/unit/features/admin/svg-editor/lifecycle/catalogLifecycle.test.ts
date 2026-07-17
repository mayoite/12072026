import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import path from "node:path";
import os from "node:os";

import {
  isBuyerVisibleSlug,
  loadBuyerVisibleDescriptors,
  readLifecycleManifest,
  setCatalogLifecycle,
} from "@/features/admin/svg-editor/lifecycle/catalogLifecycle";
import { bulkImportBlockDescriptors } from "@/features/admin/svg-editor/storage/bulkImportBlockDescriptors";

let workDir: string;

beforeEach(() => {
  workDir = mkdtempSync(path.join(os.tmpdir(), "catalog-lifecycle-"));
});

afterEach(() => {
  if (existsSync(workDir)) rmSync(workDir, { recursive: true, force: true });
});

describe("catalogLifecycle buyer visibility", () => {
  it("hides draft and retired slugs from buyer load", () => {
    bulkImportBlockDescriptors(
      `slug,sku,variant,width_mm,depth_mm,height_mm,lifecycle
buyer-live-001,OFL-L-001,fixed,600,600,750,live
buyer-draft-001,OFL-D-001,fixed,600,600,750,draft`,
      workDir,
    );

    const visible = loadBuyerVisibleDescriptors({ dir: workDir, forceReload: true }).map(
      (descriptor) => descriptor.slug,
    );
    expect(visible).toContain("buyer-live-001");
    expect(visible).not.toContain("buyer-draft-001");
  });

  it("retire removes buyer visibility without deleting descriptor", () => {
    bulkImportBlockDescriptors(
      `slug,sku,variant,width_mm,depth_mm,height_mm,lifecycle
buyer-retire-001,OFL-R-001,fixed,600,600,750,live`,
      workDir,
    );
    setCatalogLifecycle("buyer-retire-001", "retired", workDir);
    expect(isBuyerVisibleSlug("buyer-retire-001", readLifecycleManifest(workDir))).toBe(false);
  });

  it("draft → release (live) → retire → restore keeps buyer visibility honest", () => {
    const slug = "a4-lifecycle-path-001";
    const imported = bulkImportBlockDescriptors(
      `slug,sku,variant,width_mm,depth_mm,height_mm,lifecycle
${slug},OFL-A4-001,fixed,600,600,750,draft`,
      workDir,
    );
    expect(imported.ok).toBe(true);

    // Draft: not buyer-visible
    expect(readLifecycleManifest(workDir)[slug]?.state).toBe("draft");
    expect(isBuyerVisibleSlug(slug, readLifecycleManifest(workDir))).toBe(false);
    expect(
      loadBuyerVisibleDescriptors({ dir: workDir, forceReload: true }).some(
        (d) => d.slug === slug,
      ),
    ).toBe(false);

    // Release (= set live)
    const released = setCatalogLifecycle(slug, "live", workDir);
    expect(released.state).toBe("live");
    expect(typeof released.updatedAt).toBe("string");
    expect(isBuyerVisibleSlug(slug, readLifecycleManifest(workDir))).toBe(true);
    expect(
      loadBuyerVisibleDescriptors({ dir: workDir, forceReload: true }).some(
        (d) => d.slug === slug,
      ),
    ).toBe(true);

    // Retire: hides from buyers; descriptor file remains on disk via import dir
    setCatalogLifecycle(slug, "retired", workDir);
    expect(readLifecycleManifest(workDir)[slug]?.state).toBe("retired");
    expect(isBuyerVisibleSlug(slug, readLifecycleManifest(workDir))).toBe(false);
    expect(
      loadBuyerVisibleDescriptors({ dir: workDir, forceReload: true }).some(
        (d) => d.slug === slug,
      ),
    ).toBe(false);

    // Restore: live again
    setCatalogLifecycle(slug, "live", workDir);
    expect(readLifecycleManifest(workDir)[slug]?.state).toBe("live");
    expect(isBuyerVisibleSlug(slug, readLifecycleManifest(workDir))).toBe(true);
    expect(
      loadBuyerVisibleDescriptors({ dir: workDir, forceReload: true }).some(
        (d) => d.slug === slug,
      ),
    ).toBe(true);
  });
});