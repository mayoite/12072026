// @vitest-environment node
/**
 * Name-mirror: scripts/sync-hi-wave1-messages.mjs
 */
import { describe, expect, it } from "vitest";
import {
  HI_OVERRIDES,
  buildHiWave1Messages,
  deepMerge,
} from "../../../scripts/sync-hi-wave1-messages.mjs";

describe("sync-hi-wave1-messages (name-mirror)", () => {
  it("deep-merges nested Hindi overrides without dropping en leaves", () => {
    const base = { title: "EN", hero: { kicker: "EN-k", extra: "keep" } };
    const merged = deepMerge(base, { title: "HI", hero: { kicker: "HI-k" } });
    expect(merged.title).toBe("HI");
    expect(merged.hero.kicker).toBe("HI-k");
    expect(merged.hero.extra).toBe("keep");
  });

  it("applies wave1 overrides for home hero CTAs", () => {
    const en = {
      home: {
        title: "Platform",
        subtitle: "Tools",
        getStarted: "Start",
        hero: {
          kicker: "EN",
          primaryCta: { label: "Products", href: "/products" },
          secondaryCta: { label: "Quote", href: "/#contact" },
        },
        footer: "stay",
      },
      about: { heroTitle: "About", heroSubtitle: "Sub" },
      contact: { heroTitle: "Contact", heroSubtitle: "Sub" },
      products: { headlineLead: "A", headlineAccent: "B", heroSubtitle: "C" },
      solutions: {
        heroTitleLead: "A",
        heroTitleAccent: "B",
        heroSubtitle: "C",
      },
    };
    const hi = { other: true };
    const next = buildHiWave1Messages(en, hi);
    expect(next.other).toBe(true);
    expect(next.home.title).toBe(HI_OVERRIDES.home.title);
    expect(next.home.footer).toBe("stay");
    expect(next.home.hero.primaryCta.href).toBe("/products");
    expect(next.about.heroTitle).toBe(HI_OVERRIDES.about.heroTitle);
  });
});
