import { expect, type Locator, type Page } from "@playwright/test";

export const PLANNER_PRIMARY_CANVAS = '[data-testid="planner-2d-canvas"] canvas';

async function primaryCanvas(page: Page): Promise<Locator> {
  return page.locator(PLANNER_PRIMARY_CANVAS);
}

async function canvasBox(page: Page) {
  const canvas = await primaryCanvas(page);
  await expect(canvas).toBeVisible({ timeout: 25_000 });
  const box = await canvas.boundingBox();
  if (!box) throw new Error("Planner canvas bounding box not found");
  return { canvas, box };
}

export async function waitForPlannerCanvas(page: Page): Promise<void> {
  await expect(page.locator(PLANNER_PRIMARY_CANVAS)).toBeVisible({ timeout: 25_000 });
}

function plannerToolNamePattern(toolName: string): RegExp {
  const escaped = toolName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^${escaped}(?: \\(|$)`);
}

export function plannerToolButton(page: Page, toolName: string): Locator {
  return page
    .getByRole("group", { name: "Drawing tools" })
    .getByRole("button", { name: plannerToolNamePattern(toolName) });
}

export async function canvasPoint(
  page: Page,
  relX: number,
  relY: number,
): Promise<{ x: number; y: number }> {
  const { box } = await canvasBox(page);
  return {
    x: box.x + box.width * relX,
    y: box.y + box.height * relY,
  };
}

/** Tap without drift — door/window tools finish on pointer up at the wall. */
export async function tapOnCanvas(page: Page, relX: number, relY: number): Promise<void> {
  const point = await canvasPoint(page, relX, relY);
  await page.mouse.move(point.x, point.y);
  await page.mouse.down();
  await page.waitForTimeout(120);
  await page.mouse.up();
}

/** Press and drag slightly along a wall to complete door/window placement. */
export async function placeOpeningOnCanvas(
  page: Page,
  from: { rx: number; ry: number },
  to: { rx: number; ry: number },
): Promise<void> {
  const start = await canvasPoint(page, from.rx, from.ry);
  const end = await canvasPoint(page, to.rx, to.ry);
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.waitForTimeout(80);
  await page.mouse.move(end.x, end.y, { steps: 4 });
  await page.waitForTimeout(80);
  await page.mouse.up();
}

/** Pointer down → slight move → up so canvas receives move + down/up (furniture needs this). */
export async function clickOnCanvas(page: Page, relX: number, relY: number): Promise<void> {
  const point = await canvasPoint(page, relX, relY);
  await page.mouse.move(point.x, point.y);
  await page.mouse.down();
  await page.mouse.move(point.x + 2, point.y + 2, { steps: 2 });
  await page.mouse.up();
}

export async function dragOnCanvas(
  page: Page,
  from: { rx: number; ry: number },
  to: { rx: number; ry: number },
): Promise<void> {
  const start = await canvasPoint(page, from.rx, from.ry);
  const end = await canvasPoint(page, to.rx, to.ry);
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(end.x, end.y, { steps: 16 });
  await page.mouse.up();
}

export async function selectPlannerTool(page: Page, toolName: string): Promise<void> {
  const button = plannerToolButton(page, toolName);
  await button.click();
  await expect(button).toHaveAttribute("aria-pressed", "true", { timeout: 5_000 });
  await waitForPlannerCanvas(page);
  await page.waitForTimeout(150);
}

export async function getObjectCount(page: Page): Promise<number> {
  const text = await page
    .locator(".pw-status-bar > span")
    .filter({ hasText: /^\d+ objects$/ })
    .textContent();
  const match = text?.match(/^(\d+)\s+objects/i);
  return match ? Number.parseInt(match[1], 10) : 0;
}

export async function getWallCount(page: Page): Promise<number> {
  const text = await page
    .locator(".pw-status-bar > span")
    .filter({ hasText: /^\d+ walls$/ })
    .textContent();
  const match = text?.match(/^(\d+)\s+walls/i);
  return match ? Number.parseInt(match[1], 10) : 0;
}

/** Status-bar furniture metric only — no body-text fallback (CP-07 / false-green bar). */
export async function getFurnitureCount(page: Page): Promise<number> {
  const text = await page
    .locator(".pw-status-bar > span")
    .filter({ hasText: /^\d+ furniture$/ })
    .textContent();
  const match = text?.match(/^(\d+)\s+furniture/i);
  return match ? Number.parseInt(match[1], 10) : 0;
}

/**
 * Open3d wall tool: two taps (start then end). Wall guidance is click-click;
 * micro-drag helpers can miss commit on some pointer paths.
 */
export async function drawWallByTwoClicks(
  page: Page,
  from: { rx: number; ry: number },
  to: { rx: number; ry: number },
): Promise<void> {
  await selectPlannerTool(page, "Wall");
  await tapOnCanvas(page, from.rx, from.ry);
  await page.waitForTimeout(200);
  await tapOnCanvas(page, to.rx, to.ry);
  await page.waitForTimeout(200);
}

export async function expectObjectCountAtLeast(page: Page, min: number): Promise<void> {
  await expect
    .poll(async () => getObjectCount(page), { timeout: 15_000 })
    .toBeGreaterThanOrEqual(min);
}

export async function setToolVisibilityMode(
  page: Page,
  mode: "Balanced" | "Step-focused" | "All tools",
): Promise<void> {
  const select = page.locator("#planner-tool-visibility-mode");
  await expect(select).toBeVisible({ timeout: 10_000 });
  await select.selectOption({ label: mode });
  await expect(select).toHaveValue(
    mode === "Balanced" ? "balanced" : mode === "Step-focused" ? "step" : "all",
  );
  await page.waitForTimeout(150);
}

export async function switchPlannerStep(page: Page, stepLabel: "Draw" | "Place" | "Review"): Promise<void> {
  const stepId = stepLabel.toLowerCase();
  const stepButton = page.locator(`.pw-step-bar__btn[data-step="${stepId}"]`);
  await expect(stepButton).toBeVisible({ timeout: 15_000 });
  await stepButton.click();
  await expect(page.locator(".pw-step-bar")).toHaveAttribute("data-current", stepId);
  await waitForPlannerCanvas(page);
  await page.waitForTimeout(250);
}

type FabricObjectHandle = {
  getCenterPoint?: () => { x: number; y: number };
  left?: number;
  top?: number;
  name?: string;
};
type FabricViewHandle = {
  getActiveObject?: () => FabricObjectHandle | undefined;
  getObjects?: () => FabricObjectHandle[];
  viewportTransform?: number[] | null;
  lowerCanvasEl?: HTMLElement;
};

const STRUCTURE_PREFIXES = [
  "WALL",
  "CORNER",
  "ROOM",
  "ROOM-LABEL",
  "DOOR",
  "WINDOW",
  "FLOORPLAN",
  "DRAW",
];

/**
 * Read the screen (page) coordinates of the first furniture object on the
 * canvas. Robust to zoom/pan because it reads the live viewportTransform.
 * Requires the `window.__plannerFabricView` test hook. Falls back to the
 * active object when no scan match is found.
 */
export async function firstFurnitureCenter(
  page: Page,
): Promise<{ x: number; y: number } | null> {
  const point = await page.evaluate(
    (prefixes: string[]) => {
      const w = (window as unknown as { __plannerFabricView?: FabricViewHandle })
        .__plannerFabricView;
      if (!w) return null;
      const objs = w.getObjects?.() ?? [];
      const isFurniture = (o: FabricObjectHandle) => {
        const name = String(o.name ?? "");
        if (!name) return true;
        return !prefixes.some((p) => name.startsWith(p));
      };
      const target = objs.find(isFurniture) ?? w.getActiveObject?.();
      if (!target) return null;
      const center =
        typeof target.getCenterPoint === "function"
          ? target.getCenterPoint()
          : { x: target.left ?? 0, y: target.top ?? 0 };
      const vt = w.viewportTransform ?? [1, 0, 0, 1, 0, 0];
      const px = center.x * vt[0] + center.y * vt[2] + vt[4];
      const py = center.x * vt[1] + center.y * vt[3] + vt[5];
      const el = w.lowerCanvasEl;
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return { x: rect.left + px, y: rect.top + py };
    },
    [...STRUCTURE_PREFIXES],
  );
  return point;
}

/**
 * Arm catalog placement ("Add … to canvas") then wait for Place tool pressed.
 * Status bar / sticky inventory chrome intercepts Playwright hit-tests — use a
 * DOM el.click() so React handlers fire without relying on hit-testing.
 * Catalog arms via React state; waiting for aria-pressed avoids racing canvas click
 * (workstation batch path uses a ref and does not need this).
 */
export async function clickCatalogAddToCanvas(
  page: Page,
  name: RegExp | string = /Add .* to canvas/i,
): Promise<Locator> {
  const catalog = page.getByRole("region", { name: "Catalog browser" });
  const btn = catalog.getByRole("button", { name }).first();
  await expect(btn).toBeVisible({ timeout: 15_000 });
  await btn.scrollIntoViewIfNeeded();
  await btn.evaluate((el: HTMLElement) => {
    el.click();
  });
  const placeTool = page
    .getByRole("group", { name: "Drawing tools" })
    .getByRole("button", { name: /^Place(?: \(|$)/i });
  // Retry once if React arm did not stick (virtual list re-render / intercept).
  try {
    await expect(placeTool).toHaveAttribute("aria-pressed", "true", {
      timeout: 2_000,
    });
  } catch {
    await btn.evaluate((el: HTMLElement) => {
      el.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
        }),
      );
    });
    await expect(placeTool).toHaveAttribute("aria-pressed", "true", {
      timeout: 8_000,
    });
  }
  return btn;
}

/** Catalog add (armed) + canvas click — open3d inventory place path. */
export async function placeCatalogOnCanvas(
  page: Page,
  relX: number,
  relY: number,
  name: RegExp | string = /Add .* to canvas/i,
): Promise<void> {
  await clickCatalogAddToCanvas(page, name);
  // Small settle so placement tool + pendingCatalogItemId commit.
  await page.waitForTimeout(150);
  await clickOnCanvas(page, relX, relY);
}

/**
 * Proven systems-v0 place path (W4 / batch-place): immediate furniture delta,
 * no catalog + canvas race.
 */
export async function placeSeatsFromConfigurator(
  page: Page,
  seats: 2 | 4 | 10 = 4,
): Promise<void> {
  const configurator = page.getByRole("region", {
    name: "Workstation systems configurator",
  });
  await expect(configurator).toBeVisible({ timeout: 15_000 });
  await configurator
    .getByRole("button", { name: `Place ${seats} seats` })
    .click();
}

/** Click at absolute page coordinates (down + micro-move + up). */
export async function clickAtPoint(
  page: Page,
  p: { x: number; y: number },
): Promise<void> {
  await page.mouse.move(p.x, p.y);
  await page.mouse.down();
  await page.mouse.move(p.x + 2, p.y + 2, { steps: 2 });
  await page.mouse.up();
}

/** Tap at absolute page coordinates (down + up, no drift). */
export async function tapAtPoint(
  page: Page,
  p: { x: number; y: number },
): Promise<void> {
  await page.mouse.move(p.x, p.y);
  await page.mouse.down();
  await page.waitForTimeout(120);
  await page.mouse.up();
}
