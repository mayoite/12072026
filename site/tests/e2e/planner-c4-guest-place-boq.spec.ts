/**
 * C4 browser ship gate — guest place brand parametric desk + BOQ identity.
 * Targets oando-linear-desk-1600 (revision API preview under db authority).
 * Evidence: console errors = 0, failed SVG requests = 0, furniture +1, BOQ line.
 */
import { expect, test, type Page } from "@playwright/test";

import { enterGuestPlannerWorkspace } from "./guestProjectSetup";
import {
  getObjectCount,
  placeArmedCatalogOnCanvas,
  waitForPlannerCanvas,
  waitForPlannerCatalogReady,
} from "./plannerCanvasHelpers";

const DESK_SLUG = "oando-linear-desk-1600";
const DESK_SKU = "OANDO-LINEAR-DSK-1600";
const DESK_SEARCH = "linear desk 1600";

function inventorySearch(page: Page) {
  return page
    .getByRole("searchbox", { name: /Search inventory by name or SKU/i })
    .or(page.getByLabel(/Search inventory by name or SKU/i))
    .or(page.getByPlaceholder(/Search by name or SKU/i))
    .first();
}

/** Onboarding coach modal blocks library — dismiss first. */
async function dismissOnboardingIfPresent(page: Page): Promise<void> {
  const skip = page.getByRole("button", { name: /Skip onboarding/i });
  if (await skip.isVisible().catch(() => false)) {
    await skip.click();
    await expect(skip).toBeHidden({ timeout: 10_000 }).catch(() => undefined);
  }
  const dialog = page.getByRole("dialog", { name: /Onboarding Guide/i });
  if (await dialog.isVisible().catch(() => false)) {
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden({ timeout: 10_000 }).catch(() => undefined);
  }
}

async function openGuestInventory(page: Page): Promise<void> {
  await dismissOnboardingIfPresent(page);

  const search = inventorySearch(page);
  if (await search.isVisible().catch(() => false)) {
    return;
  }

  // Workflow: 2. Place
  const placeStep = page.getByRole("button", { name: /2\.\s*Place/i });
  if (await placeStep.isVisible().catch(() => false)) {
    await placeStep.click();
  }

  // Library / Inventory left panel
  const inventoryPanel = page.getByRole("region", { name: /Inventory panel/i });
  if (!(await inventoryPanel.isVisible().catch(() => false))) {
    const libraryTab = page
      .getByRole("tablist", { name: "Left panel" })
      .getByRole("tab", { name: /^Library$|^Inventory$/i });
    if (await libraryTab.isVisible().catch(() => false)) {
      await libraryTab.click();
    }
    const toggle = page.getByRole("button", {
      name: /Toggle inventory panel|Inventory/i,
    });
    if (
      (await toggle.isVisible().catch(() => false)) &&
      !(await search.isVisible().catch(() => false))
    ) {
      await toggle.click();
    }
  }

  // Status bar CTA may open library
  const placeWorkstation = page.getByRole("button", {
    name: /place a workstation from the library|Place workstation/i,
  });
  if (
    (await placeWorkstation.isVisible().catch(() => false)) &&
    !(await search.isVisible().catch(() => false))
  ) {
    await placeWorkstation.click();
  }

  await expect(search).toBeVisible({ timeout: 45_000 });
}

async function placeLinearDeskFromInventory(page: Page): Promise<void> {
  await waitForPlannerCatalogReady(page);
  await openGuestInventory(page);

  const search = inventorySearch(page);
  await search.fill("");
  await search.fill(DESK_SEARCH);
  // Accessible name is aria-label: "Place — Add Linear Desk 1600 to canvas"
  const addBtn = page
    .getByRole("button", {
      name: /Place — Add Linear Desk 1600 to canvas|Place — Add .*1600.* to canvas|Add Linear Desk 1600 to canvas/i,
    })
    .first();

  await expect(addBtn).toBeVisible({ timeout: 45_000 });
  await addBtn.click();

  // Arm honesty: toast (not sr-only live region — avoid strict mode dual hit)
  const toast = page.getByTestId("planner-workspace-toast");
  await expect(toast.getByText(/Click canvas to place Linear Desk/i)).toBeVisible(
    { timeout: 15_000 },
  );

  // Canvas click — do not rely on status-bar "N furniture" (shell layout varies)
  const { clickOnCanvas, ensurePlannerCanvasOnScreen } = await import(
    "./plannerCanvasHelpers"
  );
  for (const point of [
    { rx: 0.5, ry: 0.48 },
    { rx: 0.55, ry: 0.52 },
    { rx: 0.45, ry: 0.45 },
  ] as const) {
    await ensurePlannerCanvasOnScreen(page);
    await clickOnCanvas(page, point.rx, point.ry);
    const placed = await toast
      .getByText(/Placed Linear Desk/i)
      .isVisible()
      .catch(() => false);
    if (placed) break;
  }
  await expect(toast.getByText(/Placed Linear Desk/i)).toBeVisible({
    timeout: 20_000,
  });
}

async function openBoqAndAssertDesk(page: Page): Promise<void> {
  // WorkspaceShell: File actions → More plan actions
  const more = page.getByTestId("planner-more-actions");
  await expect(more).toBeVisible({ timeout: 15_000 });
  await more.click();

  const boqJson = page.getByRole("menuitem", {
    name: /Download BOQ \(JSON\)|Export BOQ \(JSON\)|BOQ \(JSON\)/i,
  });
  const boqCsv = page.getByRole("menuitem", {
    name: /Download BOQ \(CSV\)|Export BOQ \(CSV\)|BOQ \(CSV\)/i,
  });

  if (await boqJson.isVisible().catch(() => false)) {
    const [download] = await Promise.all([
      page.waitForEvent("download", { timeout: 30_000 }),
      boqJson.click(),
    ]);
    const path = await download.path();
    expect(path).toBeTruthy();
    const fs = await import("node:fs/promises");
    const text = await fs.readFile(path!, "utf8");
    expect(text).toMatch(new RegExp(DESK_SKU, "i"));
    expect(text).toMatch(/Linear Desk 1600|linear-desk-1600/i);
    return;
  }

  if (await boqCsv.isVisible().catch(() => false)) {
    const [download] = await Promise.all([
      page.waitForEvent("download", { timeout: 30_000 }),
      boqCsv.click(),
    ]);
    const path = await download.path();
    expect(path).toBeTruthy();
    const fs = await import("node:fs/promises");
    const text = await fs.readFile(path!, "utf8");
    expect(text).toMatch(new RegExp(DESK_SKU, "i"));
    return;
  }

  // Workflow Quote step
  const quote = page.getByRole("button", { name: /3\.\s*Quote/i });
  if (await quote.isVisible().catch(() => false)) {
    await quote.click();
    await expect(page.getByText(new RegExp(DESK_SKU, "i")).first()).toBeVisible({
      timeout: 15_000,
    });
    return;
  }

  throw new Error("No BOQ export / Quote path found for C4 assert");
}

test.describe("C4 guest place brand desk + BOQ", () => {
  test.describe.configure({ timeout: 120_000 });

  test("desktop 1280: place oando-linear-desk-1600, SVG OK, BOQ has SKU", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    const consoleErrors: string[] = [];
    const failedSvg: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("response", (res) => {
      const url = res.url();
      if (
        res.status() >= 400 &&
        (url.includes("/svg-catalog/") ||
          url.includes("/api/planner/catalog/svg/"))
      ) {
        failedSvg.push(`${res.status()} ${url}`);
      }
    });

    await enterGuestPlannerWorkspace(page, {
      projectName: "C4 guest place desk",
    });
    await waitForPlannerCanvas(page);
    await dismissOnboardingIfPresent(page);

    // API must already list the brand desk (guest inventory truth)
    const api = await page.request.get("/api/planner/catalog/svg-blocks/", {
      timeout: 60_000,
    });
    expect(api.ok(), `svg-blocks status ${api.status()}`).toBe(true);
    const body = (await api.json()) as {
      items?: Array<{
        slug: string;
        sku?: string;
        assets?: { previewImageUrl?: string };
      }>;
    };
    const desk = body.items?.find((i) => i.slug === DESK_SLUG);
    expect(desk, "svg-blocks must include brand parametric desk").toBeDefined();
    expect(desk!.sku).toBe(DESK_SKU);
    expect(desk!.assets?.previewImageUrl).toBeTruthy();

    await placeLinearDeskFromInventory(page);
    await openBoqAndAssertDesk(page);

    expect(failedSvg, `failed SVG requests: ${failedSvg.join("; ")}`).toEqual(
      [],
    );
    const hardConsole = consoleErrors.filter(
      (t) =>
        !/favicon|Download the React DevTools|hydration|third-party/i.test(t),
    );
    expect(
      hardConsole,
      `console errors: ${hardConsole.join(" | ")}`,
    ).toEqual([]);
  });

  test("phone 390: inventory can find brand desk and place", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    const failedSvg: string[] = [];
    page.on("response", (res) => {
      const url = res.url();
      if (
        res.status() >= 400 &&
        (url.includes("/svg-catalog/") ||
          url.includes("/api/planner/catalog/svg/"))
      ) {
        failedSvg.push(`${res.status()} ${url}`);
      }
    });

    await enterGuestPlannerWorkspace(page, {
      projectName: "C4 phone place desk",
    });
    await waitForPlannerCanvas(page);
    await dismissOnboardingIfPresent(page);
    await placeLinearDeskFromInventory(page);

    expect(failedSvg, `failed SVG requests: ${failedSvg.join("; ")}`).toEqual(
      [],
    );
  });
});
