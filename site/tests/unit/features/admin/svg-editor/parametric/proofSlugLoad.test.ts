import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";
import {
  clearLoaderCache,
  loadAll,
} from "@/features/planner/catalog/svg/svgBlockDescriptorLoader";
import { loadBuyerVisibleDescriptors } from "@/features/admin/svg-editor/lifecycle/catalogLifecycle";
import { readSvgArtifactStatus } from "@/features/admin/svg-editor/publish/svgArtifactStatus.server";

describe("proof slug load", () => {
  it("loads oando-param-proof from disk after C3 publish", () => {
    clearLoaderCache();
    const all = loadAll({ forceReload: true });
    const proofs = all.filter((d) => d.slug.startsWith("oando-param-proof"));
    const live = loadBuyerVisibleDescriptors({ forceReload: true });
    const liveProofs = live.filter((d) =>
      d.slug.startsWith("oando-param-proof"),
    );
    const sample = proofs[0] ?? liveProofs[0];
    const status = sample ? readSvgArtifactStatus(sample.slug) : null;
    // eslint-disable-next-line no-console
    console.log(
      JSON.stringify(
        {
          allCount: all.length,
          proofCount: proofs.length,
          liveProofCount: liveProofs.length,
          sampleSlug: sample?.slug,
          status: status?.state,
          svgExists: sample
            ? existsSync(
                path.join(
                  process.cwd(),
                  "public",
                  "svg-catalog",
                  `${sample.slug}.svg`,
                ),
              )
            : false,
        },
        null,
        2,
      ),
    );
    expect(proofs.length).toBeGreaterThan(0);
    expect(status?.state).toBe("published");
  });
});
