// @vitest-environment node
/**
 * Name-mirror: scripts/translate-deferred-marketing.mjs
 */
import { describe, expect, it } from "vitest";
import {
  deepMergeStructure,
  namespaceLooksTranslated,
  parseJsonResponse,
} from "../../../scripts/translate-deferred-marketing.mjs";

describe("translate-deferred-marketing (name-mirror)", () => {
  it("parses raw and fenced JSON model responses", () => {
    expect(parseJsonResponse('{"a":1}')).toEqual({ a: 1 });
    expect(parseJsonResponse("```json\n{\"b\":2}\n```")).toEqual({ b: 2 });
  });

  it("deep-merges translated overrides onto en structure", () => {
    const base = { title: "EN", hero: { a: "1", b: "2" } };
    const merged = deepMergeStructure(base, { title: "DE", hero: { a: "eins" } });
    expect(merged.title).toBe("DE");
    expect(merged.hero.a).toBe("eins");
    expect(merged.hero.b).toBe("2");
  });

  it("detects translated namespaces via probe keys and legal privacy title", () => {
    expect(
      namespaceLooksTranslated(
        "about",
        { heroTitle: "Über uns" },
        { heroTitle: "About us" },
      ),
    ).toBe(true);
    expect(
      namespaceLooksTranslated(
        "about",
        { heroTitle: "About us" },
        { heroTitle: "About us" },
      ),
    ).toBe(false);
    expect(
      namespaceLooksTranslated(
        "legal",
        { privacy: { title: "Datenschutz" } },
        { privacy: { title: "Privacy" } },
      ),
    ).toBe(true);
    expect(
      namespaceLooksTranslated(
        "home",
        { hero: { title: ["Willkommen"] } },
        { hero: { title: ["Welcome"] } },
      ),
    ).toBe(true);
  });
});
