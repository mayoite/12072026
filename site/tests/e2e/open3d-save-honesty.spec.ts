/**
 * W5 browser proof — place furniture → flush save → hard reload → same wall + furniture UUIDs.
 * Evidence: results/planner/world-standard-wave/06-save-honesty/save-reload/
 *
 * Continuity gate (not catalog identity): entity id set equality after hard reload.
 * Uses one-shot in-page storage clear (not init-script wipe) so page.reload keeps IDB.
 */
import { expect, test, type Page } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import {
  clearPlannerStorageInPage,
  enterGuestPlannerWorkspace,
} from "./guestProjectSetup";
import {
  getFurnitureCount,
  placeSeatsFromConfigurator,
  waitForPlannerCanvas,
} from "./plannerCanvasHelpers";

test.describe.configure({ mode: "serial", timeout: 120_000 });

const SITE_ROOT = path.resolve(__dirname, "../..");
const REPO_ROOT = path.resolve(SITE_ROOT, "..");
const EVIDENCE = path.join(
  REPO_ROOT,
  "results",
  "planner",
  "world-standard-wave",
  "06-save-honesty",
  "save-reload",
);

const PROJECT_NAME = "W5 save-reload";
const GUEST_PROJECT_ID = "planner-guest-local";

type EntityIds = { wallIds: string[]; furnitureIds: string[] };

/** Wait until autosave / explicit Save reports local saved (TopBar or status bar). */
async function waitForSavedLocally(page: Page): Promise<void> {
  await expect
    .poll(
      async () => {
        const body = await page.locator("body").innerText();
        if (/Saved locally|Draft saved locally/i.test(body)) return "saved";
        return "pending";
      },
      { timeout: 25_000 },
    )
    .toBe("saved");
}

/**
 * Inventory mounts configurator collapsed (`defaultOpen={false}`).
 * Expand before batch place so Place N seats is actionable.
 */
async function expandWorkstationConfigurator(page: Page): Promise<void> {
  const configurator = page.getByRole("region", {
    name: "Workstation systems configurator",
  });
  await expect(configurator).toBeVisible({ timeout: 15_000 });
  const header = configurator.getByRole("button", {
    name: /Systems configurator/i,
  });
  const expanded = await header.getAttribute("aria-expanded");
  if (expanded !== "true") {
    await header.click();
  }
  await expect(header).toHaveAttribute("aria-expanded", "true", {
    timeout: 5_000,
  });
}

/**
 * Read open3d-1 (or legacy raw project) envelope entity ids from IndexedDB
 * `planner-workspace-db` → projects → snapshot.
 */
async function readEntityIdsFromIdb(page: Page): Promise<EntityIds> {
  return page.evaluate(async (projectId) => {
    const openDb = () =>
      new Promise<IDBDatabase>((resolve, reject) => {
        const req = indexedDB.open("planner-workspace-db");
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error ?? new Error("indexedDB.open failed"));
      });

    const db = await openDb();
    try {
      const snapshot = await new Promise<string | null>((resolve, reject) => {
        const tx = db.transaction("projects", "readonly");
        const getReq = tx.objectStore("projects").get(projectId);
        getReq.onsuccess = () => {
          const row = getReq.result as { snapshot?: string } | undefined;
          resolve(row?.snapshot ?? null);
        };
        getReq.onerror = () => reject(getReq.error ?? new Error("projects.get failed"));
      });

      if (!snapshot?.trim()) {
        return { wallIds: [], furnitureIds: [] };
      }

      const parsed = JSON.parse(snapshot) as {
        project?: {
          floors?: Array<{
            walls?: Array<{ id: string }>;
            furniture?: Array<{ id: string }>;
          }>;
        };
        floors?: Array<{
          walls?: Array<{ id: string }>;
          furniture?: Array<{ id: string }>;
        }>;
      };

      // open3d-1 envelope: { version, engine, project } — legacy: raw project
      const project = parsed.project ?? parsed;
      const floors = project.floors ?? [];
      const wallIds = floors.flatMap((f) => (f.walls ?? []).map((w) => w.id).filter(Boolean));
      const furnitureIds = floors.flatMap((f) =>
        (f.furniture ?? []).map((u) => u.id).filter(Boolean),
      );
      return { wallIds, furnitureIds };
    } finally {
      db.close();
    }
  }, GUEST_PROJECT_ID);
}

function sortedCopy(ids: string[]): string[] {
  return [...ids].sort();
}

function setsEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sa = sortedCopy(a);
  const sb = sortedCopy(b);
  return sa.every((id, i) => id === sb[i]);
}

test.describe("W5 save honesty / hard reload (browser)", () => {
  test("place furniture, save, hard reload preserves wall + furniture UUIDs", async ({
    page,
  }) => {
    mkdirSync(EVIDENCE, { recursive: true });

    // Origin + one-shot clear — no addInitScript so reload preserves planner-workspace-db.
    await page.goto("/planner/guest/?plannerDevTools=1", {
      waitUntil: "domcontentloaded",
    });
    await clearPlannerStorageInPage(page);

    await enterGuestPlannerWorkspace(page, {
      projectName: PROJECT_NAME,
      preservePlannerState: true,
    });
    await waitForPlannerCanvas(page);

    const furnitureBefore = await getFurnitureCount(page);
    expect(furnitureBefore).toBeGreaterThanOrEqual(0);

    // Proven place path (systems v0 batch) — catalog+canvas was flaky (W4 notes).
    // W5 is continuity of entity ids, not catalog SKU identity.
    await expandWorkstationConfigurator(page);
    await placeSeatsFromConfigurator(page, 4);

    await expect
      .poll(async () => getFurnitureCount(page), { timeout: 25_000 })
      .toBe(furnitureBefore + 4);

    const afterPlaceCount = await getFurnitureCount(page);
    await page.screenshot({ path: path.join(EVIDENCE, "01-before-save.png") });

    // Explicit Save draft → flushPersist (not 5s debounce alone).
    await page.getByRole("button", { name: /Save draft|Save/i }).first().click();
    await waitForSavedLocally(page);
    await page.screenshot({ path: path.join(EVIDENCE, "02-saved-local.png") });

    // Capture entity UUIDs from IDB snapshot BEFORE hard reload.
    await expect
      .poll(
        async () => {
          const ids = await readEntityIdsFromIdb(page);
          return ids.furnitureIds.length > 0 && ids.wallIds.length > 0
            ? "ready"
            : "empty";
        },
        { timeout: 15_000 },
      )
      .toBe("ready");

    const beforeReload = await readEntityIdsFromIdb(page);
    expect(beforeReload.furnitureIds.length).toBeGreaterThan(0);
    expect(beforeReload.wallIds.length).toBeGreaterThan(0);
    expect(beforeReload.furnitureIds.length).toBe(afterPlaceCount);

    const beforeFurnitureSorted = sortedCopy(beforeReload.furnitureIds);
    const beforeWallsSorted = sortedCopy(beforeReload.wallIds);

    // Hard reload — same origin storage (IDB + setup flags).
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator(".pw-topbar")).toBeVisible({ timeout: 25_000 });
    await waitForPlannerCanvas(page);

    // Restore is async after first paint of default room — poll furniture count (secondary).
    await expect
      .poll(async () => getFurnitureCount(page), { timeout: 25_000 })
      .toBe(afterPlaceCount);

    // Poll IDB until wall + furniture id sets match pre-reload (continuity).
    await expect
      .poll(
        async () => {
          const after = await readEntityIdsFromIdb(page);
          return setsEqual(after.furnitureIds, beforeFurnitureSorted) &&
            setsEqual(after.wallIds, beforeWallsSorted)
            ? "match"
            : "pending";
        },
        { timeout: 25_000 },
      )
      .toBe("match");

    const afterReload = await readEntityIdsFromIdb(page);
    const afterFurnitureSorted = sortedCopy(afterReload.furnitureIds);
    const afterWallsSorted = sortedCopy(afterReload.wallIds);

    // Primary: UUID set equality
    expect(afterFurnitureSorted).toEqual(beforeFurnitureSorted);
    expect(afterWallsSorted).toEqual(beforeWallsSorted);

    // Secondary: furniture count
    const restoredCount = await getFurnitureCount(page);
    expect(restoredCount).toBe(afterPlaceCount);
    expect(restoredCount).toBeGreaterThan(furnitureBefore);
    expect(restoredCount).toBe(afterFurnitureSorted.length);

    await page.screenshot({ path: path.join(EVIDENCE, "03-after-hard-reload.png") });

    const run = {
      schemaVersion: 1,
      gate: "W5",
      result: "pass" as const,
      exitCode: 0,
      route: "/planner/guest/?plannerDevTools=1",
      cloudEnabled: false,
      projectId: GUEST_PROJECT_ID,
      idChannel: "indexeddb-projects-snapshot",
      placePath: "configurator-batch",
      wallIdsBefore: beforeWallsSorted,
      wallIdsAfter: afterWallsSorted,
      furnitureIdsBefore: beforeFurnitureSorted,
      furnitureIdsAfter: afterFurnitureSorted,
      wallCountBefore: beforeWallsSorted.length,
      wallCountAfter: afterWallsSorted.length,
      furnitureCountBefore: beforeFurnitureSorted.length,
      furnitureCountAfter: afterFurnitureSorted.length,
      furnitureCountUiBeforePlace: furnitureBefore,
      furnitureCountUiAfterPlace: afterPlaceCount,
      furnitureCountUiAfterReload: restoredCount,
      wallsMatch: setsEqual(beforeWallsSorted, afterWallsSorted),
      furnitureMatch: setsEqual(beforeFurnitureSorted, afterFurnitureSorted),
      browser: "playwright",
      evidenceDir: "results/planner/world-standard-wave/06-save-honesty/save-reload",
      screenshots: [
        "01-before-save.png",
        "02-saved-local.png",
        "03-after-hard-reload.png",
      ],
      timestamp: new Date().toISOString(),
    };

    writeFileSync(
      path.join(EVIDENCE, "06-browser-run.json"),
      JSON.stringify(run, null, 2),
      "utf8",
    );
  });
});
