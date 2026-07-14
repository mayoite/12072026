import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { createIsolatedAdminSvgWorkspace } from "../../../../e2e/helpers/isolatedAdminSvgPublish";

describe("isolated Admin SVG publish worker", () => {
  it("terminates a worker that exceeds its bound and permits finally cleanup", async () => {
    const workspace = createIsolatedAdminSvgWorkspace("side-table-001", {
      workerPath: path.resolve(
        __dirname,
        "fixtures/hangingIsolatedPublishWorker.ts",
      ),
      workerTimeoutMs: 1_000,
    });

    try {
      await expect(workspace.publish(workspace.load())).rejects.toThrow(
        /timed out after 1000ms/,
      );
      // The worker may or may not have written "worker-started" before
      // being killed (timing-dependent on Windows). "worker-survived"
      // is written at 1500ms, so it MUST NOT exist at 1000ms kill.
      await new Promise((resolve) => setTimeout(resolve, 1_750));
      expect(existsSync(path.join(workspace.root, "worker-survived"))).toBe(
        false,
      );
    } finally {
      workspace.cleanup();
    }

    expect(existsSync(workspace.root)).toBe(false);
  });
});
