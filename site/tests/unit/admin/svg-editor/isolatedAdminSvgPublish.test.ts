import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { createIsolatedAdminSvgWorkspace } from "../../../e2e/helpers/isolatedAdminSvgPublish";

describe("isolated Admin SVG publish worker", () => {
  it("terminates a worker that exceeds its bound and permits finally cleanup", async () => {
    const workspace = createIsolatedAdminSvgWorkspace("side-table-001", {
      workerPath: path.resolve(
        __dirname,
        "fixtures/hangingIsolatedPublishWorker.ts",
      ),
      workerTimeoutMs: 50,
    });

    try {
      await expect(workspace.publish(workspace.load())).rejects.toThrow(
        /timed out after 50ms/,
      );
    } finally {
      workspace.cleanup();
    }

    expect(existsSync(workspace.root)).toBe(false);
  });
});
