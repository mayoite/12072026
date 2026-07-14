// @vitest-environment node
/**
 * Name-mirror: scripts/sync-missing-alt-text.ts
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  formatPatchSet,
  runAltTextSync,
} from "../../../scripts/sync-missing-alt-text";

describe("sync-missing-alt-text (name-mirror)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("formats patch sets as pretty JSON with update payload fields", () => {
    const text = formatPatchSet([
      {
        id: "p1",
        altText: "Chair front view",
        updatePayload: { alt_text: "Chair front view", metadata: { ai_alt_text: "Chair front view" } },
      },
    ]);
    const parsed = JSON.parse(text) as Array<Record<string, unknown>>;
    expect(parsed).toHaveLength(1);
    expect(parsed[0].id).toBe("p1");
    expect(parsed[0].alt_text).toBe("Chair front view");
  });

  it("dry-runs alt generation with fallback text when OpenAI is null", async () => {
    const rows = [
      {
        id: "1",
        name: "Ergo Chair",
        category_id: "oando-seating",
        description: null,
        alt_text: null,
        metadata: null,
      },
      {
        id: "2",
        name: "Has Alt",
        category_id: "desks",
        description: null,
        alt_text: "existing",
        metadata: null,
      },
    ];

    const order = vi.fn(async () => ({ data: rows, error: null }));
    const select = vi.fn(() => ({ order }));
    const from = vi.fn(() => ({ select }));
    const supabase = { from } as never;

    const logs: string[] = [];
    const result = await runAltTextSync({
      apply: false,
      supabase,
      openai: null,
      logger: {
        log: (msg: string) => logs.push(String(msg)),
        warn: () => undefined,
        error: () => undefined,
      },
      argv: ["node", "sync-missing-alt-text.ts"],
    });

    expect(result.updated).toBe(0);
    expect(result.patches).toHaveLength(1);
    expect(result.patches[0].id).toBe("1");
    expect(result.patches[0].altText.toLowerCase()).toContain("ergo chair");
    expect(result.patches[0].altText.toLowerCase()).toContain("seating");
    expect(logs.some((line) => line.includes("dry-run"))).toBe(true);
  });
});
