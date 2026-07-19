import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";

import { expect, type Page } from "@playwright/test";

import {
  readParametricFactoryLifecycle,
  resolveParametricFactoryE2eRoot,
} from "@/features/admin/svg-editor/parametric/parametricFactoryE2eRoot.server";
import type { BlockDescriptor } from "@/features/planner/catalog/svg/svgTypes";
import { parseBlockDescriptor } from "@/features/planner/catalog/svg/svgTypes";

export type ParametricFactoryArtifact = {
  readonly slug: string;
  readonly sku: string;
  readonly descriptor: BlockDescriptor;
  readonly svgPath: string;
  readonly svgBytes: Buffer;
  readonly svgChecksum: string;
  readonly previewUrl: string;
};

export async function publishDeskAssemblyFromAdmin(
  page: Page,
): Promise<ParametricFactoryArtifact> {
  const runtime = resolveParametricFactoryE2eRoot();
  if (!runtime) throw new Error("Parametric factory E2E runtime is not configured");

  if (!new URL(page.url()).pathname.startsWith("/admin/svg-editor")) {
    await page.goto("/admin/svg-editor?new=desk-assembly", {
      waitUntil: "domcontentloaded",
    });
  }
  await expect(page).not.toHaveURL(/\/access\//);
  await expect(page.getByTestId("parametric-product-editor")).toBeVisible();
  await expect(page.getByRole("button", { name: "Product type" })).toContainText(
    "Desk assembly",
  );

  await page.getByRole("button", { name: /Assembly layout/ }).click();
  await page.getByRole("option", { name: "U layout" }).click();
  const count = page.getByRole("textbox", { name: "Count" });
  await count.fill("3");
  await count.press("Tab");
  await expect(count).toHaveAttribute("aria-invalid", "true");
  await expect(count).toHaveAttribute("aria-describedby", /\S+/);
  await expect(page.getByText(/U layout requires at least four workstations/i)).toBeVisible();
  await count.fill("12");
  await count.press("Tab");
  const aisle = page.getByRole("textbox", { name: "Clearance (cm)" });
  await aisle.fill("120");
  await aisle.press("Tab");
  await expect(page.getByRole("heading", { name: /12 workstations/ })).toBeVisible();
  await expect(page.locator('[data-part-id^="workstation-"]')).toHaveCount(12);
  await expect(page.locator('[data-part-id="return-left"]')).toBeVisible();
  await expect(page.locator('[data-part-id="return-right"]')).toBeVisible();
  await expect(page.getByTestId("parametric-plan-measurements")).toHaveText(
    "6400 × 5200 mm",
  );
  const firstWorkstation = page.locator('[data-part-id="workstation-01"]').first();
  await firstWorkstation.focus();
  await firstWorkstation.press("Enter");
  await expect(firstWorkstation).toHaveAttribute("data-selected", "true");

  const publish = page.getByRole("button", { name: "Publish", exact: true });
  await publish.click();
  const dialog = page.getByRole("dialog", { name: "Publish product" });
  await expect(dialog).toBeVisible();
  for (let index = 0; index < 6; index += 1) await page.keyboard.press("Tab");
  expect(
    await page.locator(":focus").evaluate((element) =>
      Boolean(element.closest('[role="dialog"]')),
    ),
  ).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(publish).toBeFocused();

  await publish.click();
  const [actionResponse] = await Promise.all([
    page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        response.url().includes("/admin/svg-editor") &&
        !response.url().includes("/api/"),
      { timeout: 30_000 },
    ),
    dialog.getByRole("button", { name: "Publish", exact: true }).click(),
  ]);
  const slug = "oando-desk-assembly-12";
  const sku = "OANDO-DSK-ASM-12";
  try {
    await expect.poll(() => existsSync(runtime.descriptorPath(slug)), {
      timeout: 10_000,
      message: "published isolated descriptor",
    }).toBe(true);
  } catch {
    throw new Error(
      `Publish did not persist. Action ${actionResponse.status()}: ${await actionResponse.text()} Page: ${await page.locator("body").innerText()}`,
    );
  }
  await expect.poll(() => existsSync(runtime.svgPath(slug)), {
    timeout: 30_000,
    message: "published isolated SVG",
  }).toBe(true);
  const parsedDescriptor = parseBlockDescriptor(
    JSON.parse(readFileSync(runtime.descriptorPath(slug), "utf8")),
  );
  if (!parsedDescriptor.ok) {
    throw new Error(`Published descriptor failed validation: ${parsedDescriptor.error.message}`);
  }
  const descriptor: BlockDescriptor = parsedDescriptor.value;
  const svgPath = runtime.svgPath(slug);
  const svgBytes = readFileSync(svgPath);
  const svgChecksum = createHash("sha256").update(svgBytes).digest("hex");

  expect(descriptor.slug).toBe(slug);
  expect(descriptor.sku).toBe(sku);
  expect(readParametricFactoryLifecycle(runtime)[slug]?.state).toBe("live");
  expect(svgBytes.length).toBeGreaterThan(200);

  return {
    slug,
    sku,
    descriptor,
    svgPath,
    svgBytes,
    svgChecksum,
    previewUrl: runtime.previewUrl(slug),
  };
}
