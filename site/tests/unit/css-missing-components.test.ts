import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const siteRoot = resolve(__dirname, "../..");
const cssPath = resolve(siteRoot, "app/css/core/components/missing-components.css");
const indexPath = resolve(siteRoot, "app/css/index.css");

const css = readFileSync(cssPath, "utf8");
const indexCss = readFileSync(indexPath, "utf8");

describe("missing shared component CSS", () => {
  it("is imported by the global CSS entry after existing component imports", () => {
    const customImport = '@import "./core/components/custom.css";';
    const missingImport = '@import "./core/components/missing-components.css";';

    expect(indexCss).toContain(missingImport);
    expect(indexCss.indexOf(missingImport)).toBeGreaterThan(indexCss.indexOf(customImport));
  });

  it("defines all shared selectors required by product gallery, contact teaser, and compare dock", () => {
    [
      ".product-gallery",
      ".product-gallery__thumbs",
      ".product-gallery__main",
      ".product-gallery__count",
      ".product-gallery__thumb--active",
      ".contact-teaser__shell",
      ".contact-teaser__layout",
      ".contact-teaser__intro",
      ".contact-teaser__form",
      ".contact-teaser__mini-grid",
      ".contact-teaser__hint",
      ".contact-teaser__field",
      ".contact-teaser__field--brief",
      ".contact-teaser__input",
      ".contact-teaser__input--textarea",
      ".contact-teaser__cta-stack",
      ".contact-teaser__support-row",
      ".contact-teaser__support-link",
      ".contact-teaser__support-link--whatsapp",
      ".contact-teaser__support-link-icon",
      ".contact-teaser__status",
      ".contact-teaser__status--success",
      ".contact-teaser__status--error",
      ".shell-card",
    ].forEach((selector) => {
      expect(css).toContain(selector);
    });
  });

  it("keeps mobile inputs at 1rem and interactive controls at a 44px touch target", () => {
    expect(css).toMatch(/\.contact-teaser__input\s*\{[\s\S]*font-size:\s*1rem;/);
    expect(css).toMatch(/\.contact-teaser__input\s*\{[\s\S]*min-height:\s*44px;/);
    expect(css).toMatch(/\.contact-teaser__support-link\s*\{[\s\S]*min-height:\s*44px;/);
    expect(css).toMatch(/\.contact-teaser__cta-stack \.btn-primary\s*\{[\s\S]*min-height:\s*44px;/);
  });
});
