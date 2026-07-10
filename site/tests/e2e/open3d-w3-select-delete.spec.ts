/**
 * W3 browser proof — select furniture → Delete → undo (open3d native chrome).
 * Evidence: results/planner/world-standard-wave/03-select-delete/
 *
 * Fabric OFF hard gate: do not set NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE for this run.
 * Unset before Playwright (PowerShell):
 *   Remove-Item Env:NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE -EA SilentlyContinue
 * W3 proves open3d native select/delete/undo — fabric furniture path must stay off.
 */
import { expect, test, type Page } from "@playwright/test";
import path from "node:path";

import { enterGuestPlannerWorkspace } from "./guestProjectSetup";
import {
  clickOnCanvas,
  placeSeatsFromConfigurator,
  selectPlannerTool,
  waitForPlannerCanvas,
} from "./plannerCanvasHelpers";

test.describe.configure({ mode: "serial", timeout: 120_000 });

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
  if (/Wall selected|\d+\s+walls?\s+selected/i.test(body) && !/Furniture selected|\d+\s+furniture\s+selected/i.test(body)) {
    return false;
  }
  if (/Furniture selected|\d+\s+furniture\s+selected/i.test(body)) {
    return true;
  }
  if (/Workstation \(systems v0\)|ws-v0|L-shape|Linear/i.test(body)) {
    // Properties/status still showing systems furniture context after select.
    const noSelection = await page.getByRole("heading", { name: /No Selection/i }).count();
    return noSelection === 0;
  }
  // Properties header entity type "Furniture" (entityType span next to name).
  const furnitureType = page.locator(".pw-properties, [class*='properties'], aside, [class*='panel']").getByText(
    /^Furniture$/,
    { exact: true },
  );
  if ((await furnitureType.count()) > 0) {
    return true;
  }
  return false;
}

test.describe("W3 select / delete / undo (browser)", () => {
  test("place furniture, select, Delete removes, Ctrl+Z restores", async ({ page }) => {
    // Runner-side fabric OFF (process env). Server must also start without the flag.
    expect(
      process.env.NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE,
      "Fabric furniture env must be unset for W3 hard gate",
    ).toBeFalsy();

    await enterGuestPlannerWorkspace(page, { projectName: "W3 select-delete" });
    await waitForPlannerCanvas(page);

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

    // Select tool is under Navigation tools (open3d Canvas tools rail) — helper scopes both.
    await selectPlannerTool(page, "Select");
    await clickOnCanvas(page, 0.5, 0.5);

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
