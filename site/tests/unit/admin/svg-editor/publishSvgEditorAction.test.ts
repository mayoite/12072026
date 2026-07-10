/**
 * Unit tests for publishSvgEditorAction (admin SVG editor server action).
 *
 * Covers:
 *   - slug "new" → default descriptor → pipeline
 *   - missing slug → { success:false, error:"not found" }, no pipeline
 *   - valid side-table-001 → tryLoad → pipeline (mocked)
 *
 * Pipeline is mocked so this seat does not re-test compile/persist.
 */

import { beforeEach, describe, expect, it, vi } from "vitest";

const { publishDescriptorWithPipeline } = vi.hoisted(() => ({
  publishDescriptorWithPipeline: vi.fn(),
}));

vi.mock("@/features/planner/admin/svg-editor/publishDescriptorWithPipeline", () => ({
  publishDescriptorWithPipeline,
}));

import { publishSvgEditorAction } from "@/features/planner/admin/svg-editor/publishSvgEditorAction";
import type { PuckDataShape } from "@/features/planner/admin/svg-editor/puckBlockRegistry";

/** Minimal Puck publish payload — only content[0].props is read by the action. */
function puckData(slug: string, propOverrides: Record<string, unknown> = {}): PuckDataShape {
  return {
    root: { props: { title: slug } },
    content: [
      {
        type: "BlockFixed",
        props: {
          id: "block-0",
          slug,
          ...propOverrides,
        },
      },
    ],
  } as unknown as PuckDataShape;
}

describe("publishSvgEditorAction", () => {
  beforeEach(() => {
    publishDescriptorWithPipeline.mockReset();
    publishDescriptorWithPipeline.mockResolvedValue({
      success: true,
      descriptor: {
        slug: "mock-published",
      },
    });
  });

  it('slug "new" builds a default descriptor and calls publishDescriptorWithPipeline', async () => {
    const data = puckData("new-block");
    const result = await publishSvgEditorAction("new", data);

    expect(result).toEqual({
      success: true,
      descriptor: { slug: "mock-published" },
    });
    expect(publishDescriptorWithPipeline).toHaveBeenCalledTimes(1);

    const input = publishDescriptorWithPipeline.mock.calls[0]?.[0] as Record<
      string,
      unknown
    >;
    expect(input).toBeDefined();
    expect(input.slug).toBe("new-block");
    expect(input.schemaVersion).toBe("2026-07-04.v2");
    expect(input.variant).toBe("fixed");
    expect(input.sourceProvenance).toBe("native");
    // freeze/persist recomputes checksum — action strips it via puck merge
    expect(input.checksum).toBeUndefined();
    // pipeline is not given deps from the action (defaults on the pipeline side)
    expect(publishDescriptorWithPipeline.mock.calls[0]?.[1]).toBeUndefined();
  });

  it("missing slug returns not found and does not call the pipeline", async () => {
    const missingSlug = "missing-block-xyz-999";
    const result = await publishSvgEditorAction(missingSlug, puckData(missingSlug));

    expect(result).toEqual({ success: false, error: "not found" });
    expect(publishDescriptorWithPipeline).not.toHaveBeenCalled();
  });

  it("valid side-table-001 loads the descriptor and publishes via pipeline", async () => {
    publishDescriptorWithPipeline.mockResolvedValue({
      success: true,
      descriptor: { slug: "side-table-001" },
    });

    const result = await publishSvgEditorAction(
      "side-table-001",
      puckData("side-table-001"),
    );

    expect(result).toEqual({
      success: true,
      descriptor: { slug: "side-table-001" },
    });
    expect(publishDescriptorWithPipeline).toHaveBeenCalledTimes(1);

    const input = publishDescriptorWithPipeline.mock.calls[0]?.[0] as Record<
      string,
      unknown
    >;
    expect(input).toBeDefined();
    expect(input.slug).toBe("side-table-001");
    expect(input.id).toBe("f81e3a1b-16f4-4000-8000-000000000003");
    expect(input.sku).toBe("OFL-TBL-001");
    expect(input.variant).toBe("fixed");
    expect(input.checksum).toBeUndefined();
  });

  it("propagates pipeline failure for a valid existing slug", async () => {
    publishDescriptorWithPipeline.mockResolvedValue({
      success: false,
      error: "compiler_failed: empty blocks",
    });

    const result = await publishSvgEditorAction(
      "side-table-001",
      puckData("side-table-001"),
    );

    expect(result).toEqual({
      success: false,
      error: "compiler_failed: empty blocks",
    });
    expect(publishDescriptorWithPipeline).toHaveBeenCalledTimes(1);
  });
});
