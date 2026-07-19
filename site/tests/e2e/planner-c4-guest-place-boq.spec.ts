import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

import { expect, test, type Page } from "@playwright/test";

import { enterGuestPlannerWorkspace } from "./guestProjectSetup";
import {
  clickOnCanvas,
  ensurePlannerCanvasOnScreen,
  waitForPlannerCanvas,
  waitForPlannerCatalogReady,
} from "./plannerCanvasHelpers";
import {
  publishDeskAssemblyFromAdmin,
  type ParametricFactoryArtifact,
} from "./helpers/parametricFactoryJourney";

function inventorySearch(page: Page) {
  return page
    .getByRole("searchbox", { name: /Search inventory by name or SKU/i })
    .or(page.getByLabel(/Search inventory by name or SKU/i))
    .or(page.getByPlaceholder(/Search by name or SKU/i))
    .first();
}

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
  if (await search.isVisible().catch(() => false)) return;

  const placeStep = page.getByRole("button", { name: /2\.\s*Place/i });
  if (await placeStep.isVisible().catch(() => false)) await placeStep.click();

  const inventoryPanel = page.getByRole("region", { name: /Inventory panel/i });
  if (!(await inventoryPanel.isVisible().catch(() => false))) {
    const libraryTab = page
      .getByRole("tablist", { name: "Left panel" })
      .getByRole("tab", { name: /^Library$|^Inventory$/i });
    if (await libraryTab.isVisible().catch(() => false)) await libraryTab.click();
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

async function placeAssemblyFromInventory(
  page: Page,
  artifact: ParametricFactoryArtifact,
): Promise<void> {
  await waitForPlannerCatalogReady(page);
  await openGuestInventory(page);
  const search = inventorySearch(page);
  await search.fill(artifact.sku);
  const liveFurnitureCount = () =>
    page.evaluate(
      () =>
        (() => {
          const project = (
          window as unknown as {
              __plannerLiveProject?: {
                activeFloorId?: string;
                floors?: Array<{ id: string; furniture?: unknown[] }>;
              };
          }
          ).__plannerLiveProject;
          const floor =
            project?.floors?.find((candidate) => candidate.id === project.activeFloorId) ??
            project?.floors?.[0];
          return floor?.furniture?.length ?? 0;
        })(),
    );
  const objectCountBefore = await liveFurnitureCount();
  const add = page
    .getByRole("button", {
      name: /Place — Add .*Desk Assembly.*12.* to canvas/i,
    })
    .first();
  await expect(add).toBeVisible({ timeout: 45_000 });
  await add.click();

  const toast = page.getByTestId("planner-workspace-toast");
  await expect(toast.getByText(/Click canvas to place .*Desk Assembly/i)).toBeVisible({
    timeout: 15_000,
  });
  const dismissSidePanel = page.getByRole("button", {
    name: "Dismiss side panel",
  });
  if (await dismissSidePanel.isVisible().catch(() => false)) {
    await dismissSidePanel.click();
  }
  for (const point of [
    { rx: 0.5, ry: 0.48 },
    { rx: 0.55, ry: 0.52 },
    { rx: 0.45, ry: 0.45 },
  ] as const) {
    await ensurePlannerCanvasOnScreen(page);
    await clickOnCanvas(page, point.rx, point.ry);
    if (
      await toast
        .getByText(/Placed .*Desk Assembly/i)
        .isVisible()
        .catch(() => false)
    ) {
      break;
    }
  }
  await expect(toast.getByText(/Placed .*Desk Assembly/i)).toBeVisible({
    timeout: 20_000,
  });
  await expect
    .poll(liveFurnitureCount, { timeout: 15_000 })
    .toBe(objectCountBefore + 1);
  const identityPlaced = await page.evaluate(
    ({ slug, sku }) => {
      const project = (
        window as unknown as {
          __plannerLiveProject?: {
            activeFloorId?: string;
            floors?: Array<{
              id: string;
              furniture?: Array<{ sourceSlug?: string; sourceSku?: string }>;
            }>;
          };
        }
      ).__plannerLiveProject;
      const floor =
        project?.floors?.find((candidate) => candidate.id === project.activeFloorId) ??
        project?.floors?.[0];
      return Boolean(
        floor?.furniture?.some(
          (item) => item.sourceSlug === slug && item.sourceSku === sku,
        ),
      );
    },
    { slug: artifact.slug, sku: artifact.sku },
  );
  expect(identityPlaced).toBe(true);
}

async function openBoqAndAssertAssembly(
  page: Page,
  artifact: ParametricFactoryArtifact,
): Promise<void> {
  const more = page.getByTestId("planner-more-actions");
  await expect(more).toBeVisible({ timeout: 15_000 });
  await more.click();

  const boqJson = page.getByRole("menuitem", {
    name: /Download BOQ \(JSON\)|Export BOQ \(JSON\)|BOQ \(JSON\)/i,
  });
  const boqCsv = page.getByRole("menuitem", {
    name: /Download BOQ \(CSV\)|Export BOQ \(CSV\)|BOQ \(CSV\)/i,
  });
  const exportItem = (await boqJson.isVisible().catch(() => false))
    ? boqJson
    : boqCsv;
  if (await exportItem.isVisible().catch(() => false)) {
    const [download] = await Promise.all([
      page.waitForEvent("download", { timeout: 30_000 }),
      exportItem.click(),
    ]);
    const downloadPath = await download.path();
    expect(downloadPath).toEqual(expect.any(String));
    const text = await readFile(downloadPath!, "utf8");
    if (exportItem === boqJson) {
      const boq = JSON.parse(text) as {
        lines?: Array<{ name?: string; sku?: string; quantity?: number }>;
      };
      const matchingLines =
        boq.lines?.filter((line) => line.sku === artifact.sku) ?? [];
      expect(matchingLines).toEqual([
        expect.objectContaining({
          name: "Desk Assembly 12",
          sku: artifact.sku,
          quantity: 1,
        }),
      ]);
    } else {
      const matchingRows = text
        .split(/\r?\n/)
        .filter((line) => line.includes(artifact.sku));
      expect(matchingRows).toHaveLength(1);
      expect(matchingRows[0]).toMatch(
        /^furniture,Desk Assembly 12,[^,]+,OANDO-DSK-ASM-12,1,/,
      );
    }
    return;
  }
  throw new Error("No BOQ export path found");
}

async function assertCatalogArtifact(
  page: Page,
  artifact: ParametricFactoryArtifact,
): Promise<void> {
  const response = await page.request.get("/api/planner/catalog/svg-blocks/", {
    timeout: 60_000,
  });
  expect(response.ok()).toBe(true);
  const body = (await response.json()) as {
    items?: Array<{
      slug: string;
      sku?: string;
      assets?: { previewImageUrl?: string };
    }>;
  };
  const item = body.items?.find((candidate) => candidate.slug === artifact.slug);
  expect(item?.sku).toBe(artifact.sku);
  expect(item?.assets?.previewImageUrl).toBe(artifact.previewUrl);
  const preview = await page.request.get(item!.assets!.previewImageUrl!);
  expect(preview.ok()).toBe(true);
  const checksum = createHash("sha256")
    .update(Buffer.from(await preview.body()))
    .digest("hex");
  expect(checksum).toBe(artifact.svgChecksum);
}

async function runPlannerJourney(
  page: Page,
  viewport: { readonly width: number; readonly height: number },
): Promise<void> {
  await page.setViewportSize({ width: 1280, height: 720 });
  const artifact = await publishDeskAssemblyFromAdmin(page);
  await page.setViewportSize(viewport);

  const consoleErrors: string[] = [];
  const failedSvg: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("response", (response) => {
    const url = response.url();
    if (
      response.status() >= 400 &&
      (url.includes("svg-catalog") || url.includes("/api/planner/catalog/svg/"))
    ) {
      failedSvg.push(`${response.status()} ${url}`);
    }
  });

  await enterGuestPlannerWorkspace(page, {
    projectName: `C4 assembly ${viewport.width}`,
  });
  await waitForPlannerCanvas(page);
  await assertCatalogArtifact(page, artifact);
  await placeAssemblyFromInventory(page, artifact);
  await openBoqAndAssertAssembly(page, artifact);

  expect(failedSvg).toEqual([]);
  expect(
    consoleErrors.filter(
      (text) =>
        !/favicon|Download the React DevTools|hydration|third-party/i.test(text),
    ),
  ).toEqual([]);
}

test.describe("C4 dynamic parametric assembly place and BOQ", () => {
  test.describe.configure({ timeout: 180_000 });

  test("desktop 1280 consumes exact C3 artifact", async ({ page }) => {
    await runPlannerJourney(page, { width: 1280, height: 800 });
  });

  test("390 consumes exact C3 artifact", async ({ page }) => {
    await runPlannerJourney(page, { width: 390, height: 844 });
  });
});
