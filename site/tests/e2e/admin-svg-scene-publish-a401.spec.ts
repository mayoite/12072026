import { expect, test } from "@playwright/test";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

const SITE_ROOT = path.resolve(__dirname, "../..");
const REPO_ROOT = path.resolve(SITE_ROOT, "..");
const EVIDENCE_DIR = path.join(
  REPO_ROOT,
  "results",
  "admin",
  "no-code-svg-studio",
  "a4-0-1-scene-publish-proof",
);
const DESCRIPTOR_PATH = path.join(
  SITE_ROOT,
  "block-descriptors",
  "side-table-001.json",
);
const SVG_PATH = path.join(
  SITE_ROOT,
  "public",
  "svg-catalog",
  "side-table-001.svg",
);
const RECT_SIGNATURE = "225 225 L 225 375 L 375 375 L 375 225";

test.describe("A4.0.1 scene publish authority", () => {
  test.beforeAll(() => {
    mkdirSync(EVIDENCE_DIR, { recursive: true });
  });

  test("canvas rectangle reaches the published artifact on disk", async ({
    page,
  }) => {
    test.skip(
      !existsSync(DESCRIPTOR_PATH) || !existsSync(SVG_PATH),
      "side-table-001 fixtures missing",
    );

    const originalDescriptor = readFileSync(DESCRIPTOR_PATH, "utf8");
    const originalSvg = readFileSync(SVG_PATH, "utf8");

    try {
      expect(originalSvg.includes(RECT_SIGNATURE)).toBe(false);

      await page.goto("/admin/svg-editor/side-table-001", {
        waitUntil: "domcontentloaded",
      });
      await expect(page).toHaveURL(/\/admin\/svg-editor\/side-table-001/);
      await expect(
        page.getByRole("region", { name: "Visual authoring studio" }),
      ).toBeVisible();

      await page.screenshot({
        path: path.join(EVIDENCE_DIR, "01-before-rect.png"),
        fullPage: true,
        caret: "initial",
      });

      await page.getByRole("button", { name: "Rect", exact: true }).click();
      await expect(page.getByRole("button", { name: /Rectangle rect/i })).toBeVisible();

      await page.screenshot({
        path: path.join(EVIDENCE_DIR, "02-after-rect.png"),
        fullPage: true,
        caret: "initial",
      });

      const beforeBytes = statSync(SVG_PATH).size;

      const [response] = await Promise.all([
        page.waitForResponse(
          (candidate) =>
            candidate.request().method() === "POST" &&
            candidate.url().includes("/admin/svg-editor/side-table-001"),
        ),
        page.getByRole("button", { name: "Publish", exact: true }).click(),
      ]);

      await expect(page.getByRole("status")).toContainText(
        "Published",
      );

      expect(response.ok(), `publish failed: ${response.status()}`).toBe(true);

      const publishedSvg = readFileSync(SVG_PATH, "utf8");
      const afterBytes = statSync(SVG_PATH).size;
      const publishedDescriptor = readFileSync(DESCRIPTOR_PATH, "utf8");
      writeFileSync(
        path.join(EVIDENCE_DIR, "03-run.json"),
        `${JSON.stringify(
          {
            status: response.status(),
            beforeBytes,
            afterBytes,
            rectSignature: RECT_SIGNATURE,
            hasRectSignature: publishedSvg.includes(RECT_SIGNATURE),
            descriptorChanged: publishedDescriptor !== originalDescriptor,
          },
          null,
          2,
        )}\n`,
        "utf8",
      );
      writeFileSync(
        path.join(EVIDENCE_DIR, "04-published-snippet.txt"),
        `${publishedSvg}\n`,
        "utf8",
      );
      expect(publishedSvg.includes(RECT_SIGNATURE)).toBe(true);
      expect(afterBytes).toBeGreaterThan(beforeBytes);
    } finally {
      writeFileSync(DESCRIPTOR_PATH, originalDescriptor, "utf8");
      writeFileSync(SVG_PATH, originalSvg, "utf8");
    }
  });
});
