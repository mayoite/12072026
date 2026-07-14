// @vitest-environment node
/**
 * Name-mirror: scripts/sync-descriptor-svgs.ts
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadAll } from "@/features/planner/project/catalog/svg/svgBlockDescriptorLoader";
import { syncDescriptorSvgs } from "../../../scripts/sync-descriptor-svgs";

describe("sync-descriptor-svgs (name-mirror)", () => {
  it("compiles at least one real descriptor into an svg file", async () => {
    const descriptors = loadAll({ forceReload: true });
    expect(descriptors.length).toBeGreaterThan(0);
    const sample = descriptors.slice(0, 1);
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "descriptor-svgs-"));
    try {
      const result = await syncDescriptorSvgs({
        descriptors: sample,
        outDir: tmp,
        forceReload: false,
      });
      expect(result.ok + result.fail).toBe(1);
      if (result.ok === 1) {
        const out = path.join(tmp, `${sample[0].slug}.svg`);
        expect(fs.existsSync(out)).toBe(true);
        const svg = fs.readFileSync(out, "utf8");
        expect(svg).toContain("<svg");
      } else {
        expect(result.failures).toContain(sample[0].slug);
      }
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  }, 60_000);
});
