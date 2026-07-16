// @vitest-environment node
/**
 * Name-mirror: scripts/sync-deferred-locale-messages.mjs
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { describe, expect, it } from "vitest";
import {
  marketingSubtree,
  mergePreserveTranslations,
  syncDeferredLocaleMessages,
} from "../../../scripts/sync-deferred-locale-messages.mjs";

describe("sync-deferred-locale-messages (name-mirror)", () => {
  it("preserves non-empty translated strings and fills missing keys from en", () => {
    const en = { title: "Hello", body: "World", nested: { a: "A", b: "B" } };
    const existing = { title: "Hola", nested: { a: "Á" } };
    const merged = mergePreserveTranslations(existing, en);
    expect(merged.title).toBe("Hola");
    expect(merged.body).toBe("World");
    expect(merged.nested.a).toBe("Á");
    expect(merged.nested.b).toBe("B");
  });

  it("rebuilds arrays when length drifts from en source", () => {
    const merged = mergePreserveTranslations(["old"], ["one", "two"]);
    expect(merged).toEqual(["one", "two"]);
  });

  it("extracts marketing subtree namespaces only", () => {
    const messages = {
      home: { title: "Home" },
      about: { title: "About" },
      unrelated: { title: "No" },
    };
    const sub = marketingSubtree(messages, ["home", "about"]);
    expect(Object.keys(sub).sort()).toEqual(["about", "home"]);
    expect(sub).not.toHaveProperty("unrelated");
  });

  it("writes deferred locale files without clobbering translations", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "deferred-i18n-"));
    try {
      const enSource = {
        home: { title: "Home", cta: "Go" },
        about: { title: "About" },
      };
      fs.writeFileSync(
        path.join(tmp, "de.json"),
        JSON.stringify({ home: { title: "Start" } }, null, 2),
        "utf8",
      );
      const results = syncDeferredLocaleMessages({
        messagesDir: tmp,
        locales: ["de"],
        enSource,
        namespaces: ["home", "about"],
        write: true,
      });
      expect(results).toHaveLength(1);
      expect(results[0].merged.home.title).toBe("Start");
      expect(results[0].merged.home.cta).toBe("Go");
      expect(results[0].merged.about.title).toBe("About");
      const onDisk = JSON.parse(fs.readFileSync(path.join(tmp, "de.json"), "utf8"));
      expect(onDisk.home.title).toBe("Start");
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });
});
