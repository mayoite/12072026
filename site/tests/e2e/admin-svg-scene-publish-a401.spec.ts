import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { addNode } from "@/features/admin/svg-editor/scene/svgSceneDocument";
import { sceneFromDescriptor } from "@/features/admin/svg-editor/sceneFromDescriptor";
import { serializeSceneToDefinition } from "@/features/admin/svg-editor/scene/svgSceneSerializer";
import {
  descriptorToFormState,
  formStateToDescriptorInput,
} from "@/features/admin/svg-editor/svgEditorFormAdapters";
import {
  canonicalSvgPaths,
  createIsolatedAdminSvgWorkspace,
  sha256File,
} from "./helpers/isolatedAdminSvgPublish";

const SLUG = "side-table-001";
const RECT_SIGNATURE = "100 200 L 100 250 L 150 250 L 150 200";

test.describe("A4.0.1 scene publish authority", () => {
  test("canvas rectangle reaches an isolated published artifact", async ({
    page,
  }) => {
    const canonical = canonicalSvgPaths(SLUG);
    const descriptorHashBefore = sha256File(canonical.descriptor);
    const svgHashBefore = sha256File(canonical.svg);
    const workspace = createIsolatedAdminSvgWorkspace(SLUG);

    try {
      await page.goto(`/admin/svg-editor/${SLUG}`, {
        waitUntil: "domcontentloaded",
      });
      await expect(page).toHaveURL(new RegExp(`/admin/svg-editor/${SLUG}`));
      await expect(
        page.getByRole("region", { name: "Visual authoring studio" }),
      ).toBeVisible();
      await expect(
        page.getByRole("toolbar", { name: "Canvas tools" }),
      ).toBeVisible({ timeout: 45_000 });

      await page.locator(".svg-studio__stage").waitFor({ state: "visible", timeout: 45_000 });
      await page.getByRole("button", { name: "Add rectangle" }).click();
      await expect
        .poll(
          async () =>
            page
              .locator('[data-testid="admin-svg-engine-shell"]')
              .getAttribute("data-studio-node-count"),
          { timeout: 20_000 },
        )
        .toMatch(/^[6-9]\d*$/);


      const descriptor = workspace.load();
      const form = descriptorToFormState(descriptor);
      const scene = sceneFromDescriptor(descriptor);
      const withRect = addNode(scene, {
        kind: "rect",
        id: "rect-isolation-proof",
        name: "Rectangle",
        locked: false,
        hidden: false,
        style: {
          fillToken: "var(--color-surface-raised)",
          strokeToken: "currentColor",
          lineWeight: 2,
        },
        x: 100,
        y: 200,
        width: 50,
        height: 50,
      });
      const definition = serializeSceneToDefinition(withRect);
      const input = formStateToDescriptorInput(descriptor, {
        ...form,
        sceneViewBox: definition.viewBox,
        sceneParts: definition.parts,
      });
      const result = await workspace.publish(input);
      expect(result).toMatchObject({ success: true });

      const publishedSvg = readFileSync(workspace.svgPath, "utf8");
      expect(publishedSvg.includes(RECT_SIGNATURE)).toBe(true);
    } finally {
      workspace.cleanup();
      expect(sha256File(canonical.descriptor)).toBe(descriptorHashBefore);
      expect(sha256File(canonical.svg)).toBe(svgHashBefore);
    }
  });
});
