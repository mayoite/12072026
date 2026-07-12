/**
 * W3 browser proof — select furniture → Delete → undo on live Fabric sole host.
 * Evidence: results/planner/world-standard-wave/03-select-delete/
 *
 * Host: PlannerFabricStage (`data-testid="planner-fabric-stage"`).
 * No Fabric-OFF / Feasibility downgrade theater.
 */
import { expect, test, type Page } from "@playwright/test";
import path from "node:path";

import { enterGuestPlannerWorkspace } from "./guestProjectSetup";
import {
  firstFurnitureCenter,
  placeSeatsFromConfigurator,
  PLANNER_FABRIC_STAGE,
  selectPlannerTool,
  tapAtPoint,
  waitForPlannerCanvas,
} from "./plannerCanvasHelpers";

/** Batch place size used throughout this proof (Place N seats). */
const SEATS_PLACED = 4;
/** Delete must remove exactly one furniture item. */
const FURNITURE_REMOVED_ON_DELETE = 1;

const EVIDENCE = path.join(
  process.cwd(),
  "..",
  "results",
  "planner",
  "world-standard-wave",
  "03-select-delete",
);

async function furnitureCount(page: Page): Promise<number> {
  const text = await page
    .locator(".pw-status-bar, [class*='status']")
    .filter({ hasText: /\d+\s+furniture/i })
    .first()
    .textContent()
    .catch(() => null);
  // status may be a single line: "4 objects 4 walls 0 furniture ..."
  const body = text ?? (await page.locator("body").innerText());
  const match = body.match(/(\d+)\s+furniture/i);
  return match ? Number.parseInt(match[1], 10) : -1;
}

/**
 * True when selection is furniture (not wall-only / empty).
 * Prefer status "Furniture selected" / multi furniture; also Properties type label
 * or workstation systems-v0 copy. Wall-only selection is rejected.
 */
async function isFurnitureSelection(page: Page): Promise<boolean> {
  const body = await page.locator("body").innerText();
  if (
    /Wall selected|\d+\s+walls?\s+selected/i.test(body) &&
    !/Furniture selected|\d+\s+furniture\s+selected/i.test(body)
  ) {
    return false;
  }
  if (/Furniture selected|\d+\s+furniture\s+selected/i.test(body)) {
    return true;
  }
  if (/Workstation \(systems v0\)|ws-v0|L-shape|Linear/i.test(body)) {
    // Properties/status still showing systems furniture context after select.
    const noSelection = await page
      .getByRole("heading", { name: /No Selection/i })
      .count();
    return noSelection === 0;
  }
  // Properties header entity type "Furniture" (entityType span next to name).
  const furnitureType = page
    .locator(".pw-properties, [class*='properties'], aside, [class*='panel']")
    .getByText(/^Furniture$/, { exact: true });
  if ((await furnitureType.count()) > 0) {
    return true;
  }
  return false;
}

test.describe("W3 select / delete / undo (browser, Fabric sole)", () => {
  test.describe.configure({ mode: "serial", timeout: 120_000 });

  test("place furniture, select, Delete removes, Ctrl+Z restores", async ({
    page,
  }) => {
    await enterGuestPlannerWorkspace(page, { projectName: "W3 select-delete" });
    await waitForPlannerCanvas(page);

    // Live host must be Fabric stage — archive Feasibility testid must not mount.
    await expect(page.locator(PLANNER_FABRIC_STAGE)).toBeVisible({
      timeout: 15_000,
    });
    await expect(
      page.locator('[data-testid="planner-2d-canvas"]'),
    ).toHaveCount(0);

    const furnitureBefore = await furnitureCount(page);
    expect(furnitureBefore).toBeGreaterThanOrEqual(0);

    // Proven place path (systems v0 batch) — catalog+canvas was flaky (W4 notes).
    await placeSeatsFromConfigurator(page, SEATS_PLACED);

    await expect
      .poll(async () => furnitureCount(page), { timeout: 25_000 })
      .toBe(furnitureBefore + SEATS_PLACED);

    const afterPlace = await furnitureCount(page);
    expect(afterPlace).toBe(furnitureBefore + SEATS_PLACED);
    await page.screenshot({ path: path.join(EVIDENCE, "01-placed.png") });

    // Select tool is under Navigation tools (open3d Canvas tools rail).
    await selectPlannerTool(page, "Select");

    // Hit real furniture via Fabric scene hook (center of plan may miss seats).
    const furniturePoint = await firstFurnitureCenter(page);
    expect(
      furniturePoint,
      "expected __plannerFabricView furniture center after batch place",
    ).not.toBeNull();
    await tapAtPoint(page, furniturePoint!);

    // Not merely "No Selection" gone — must be furniture selection, count unchanged until Delete.
    await expect(
      page.getByRole("heading", { name: /No Selection/i }),
    ).toHaveCount(0, { timeout: 10_000 });
    await expect
      .poll(async () => isFurnitureSelection(page), { timeout: 10_000 })
      .toBe(true);
    expect(await furnitureCount(page)).toBe(afterPlace);
    await page.screenshot({ path: path.join(EVIDENCE, "02-selected.png") });

    await page.keyboard.press("Delete");
    await expect
      .poll(async () => furnitureCount(page), { timeout: 15_000 })
      .toBe(afterPlace - FURNITURE_REMOVED_ON_DELETE);
    await page.screenshot({ path: path.join(EVIDENCE, "03-deleted.png") });

    const afterDelete = await furnitureCount(page);
    expect(afterDelete).toBe(afterPlace - FURNITURE_REMOVED_ON_DELETE);

    await page.keyboard.press("Control+z");
    await expect
      .poll(async () => furnitureCount(page), { timeout: 15_000 })
      .toBe(afterPlace);
    expect(await furnitureCount(page)).toBe(afterPlace);
    await page.screenshot({ path: path.join(EVIDENCE, "04-undone.png") });
  });
});
