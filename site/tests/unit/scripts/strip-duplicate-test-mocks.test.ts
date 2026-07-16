// @vitest-environment node
/**
 * Name-mirror: scripts/strip-duplicate-test-mocks.mjs
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { describe, expect, it } from "vitest";
import {
  stripDuplicateMocks,
  stripDuplicateMocksInTree,
} from "../../../scripts/strip-duplicate-test-mocks.mjs";

describe("strip-duplicate-test-mocks (name-mirror)", () => {
  it("removes next/image and next/link vi.mock blocks", () => {
    const source = [
      'import { describe } from "vitest";',
      "vi.mock(\"next/image\", () => ({",
      "  default: (props: { alt?: string }) => props.alt,",
      "}));",
      "",
      "vi.mock('next/link', () => ({",
      "  default: ({ children }: { children: unknown }) => children,",
      "}));",
      "",
      'describe("x", () => {});',
      "",
    ].join("\n");

    const stripped = stripDuplicateMocks(source);
    expect(stripped).not.toContain("next/image");
    expect(stripped).not.toContain("next/link");
    expect(stripped).toContain('describe("x"');
  });

  it("updates matching test files in a temp tree", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "strip-mocks-"));
    try {
      const file = path.join(tmp, "Demo.test.tsx");
      fs.writeFileSync(
        file,
        'vi.mock("next/image", () => ({ default: () => null }));\nexport {};\n',
        "utf8",
      );
      const changed = stripDuplicateMocksInTree(tmp, { dryRun: false });
      expect(changed).toBe(1);
      expect(fs.readFileSync(file, "utf8")).not.toContain("next/image");
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });
});
