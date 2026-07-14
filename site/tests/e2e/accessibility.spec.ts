import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { enterGuestPlannerWorkspace } from "./guestProjectSetup";

async function dismissOnboardingIfVisible(page: Page): Promise<void> {
  const skip = page.getByRole("button", { name: /Skip onboarding/i });
  if (await skip.isVisible({ timeout: 3000 }).catch(() => false)) {
    await skip.click();
  }
}

test.describe("Accessibility baseline", () => {
  test("should not have any automatically detectable accessibility issues in guest planner", async ({ page }) => {
    await enterGuestPlannerWorkspace(page, { projectName: "A11y Test" });
    await dismissOnboardingIfVisible(page);

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should not have any accessibility issues in export modal", async ({ page }) => {
    await enterGuestPlannerWorkspace(page, { projectName: "A11y Test" });
    await dismissOnboardingIfVisible(page);

    await page.getByRole("button", { name: /^Export$/ }).click();
    await expect(page.getByRole("dialog", { name: /Export your plan/i })).toBeVisible({ timeout: 10000 });

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include(".pwx-modal-root")
      .analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
