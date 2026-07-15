/**
 * Unit tests for useDebouncedCompile (A4 live preview debounce).
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { makeNewBlockDescriptorStub } from "@/features/admin/svg-editor/publish/newBlockDescriptorStub";
import { descriptorToFormState } from "@/features/admin/svg-editor/form/svgEditorFormAdapters";
import type { SvgEditorFormState } from "@/features/admin/svg-editor/form/svgEditorFormState";
import type { SvgPreviewResult } from "@/features/admin/svg-editor/publish/previewSvgEditorAction";

const { previewSvgEditorAction } = vi.hoisted(() => ({
  previewSvgEditorAction: vi.fn(),
}));

vi.mock("@/features/admin/svg-editor/publish/previewSvgEditorAction", () => ({
  previewSvgEditorAction,
}));

import { useDebouncedCompile } from "@/features/admin/svg-editor/publish/useDebouncedCompile";

function formFixture(): SvgEditorFormState {
  return descriptorToFormState(makeNewBlockDescriptorStub());
}

describe("useDebouncedCompile", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    previewSvgEditorAction.mockReset();
    previewSvgEditorAction.mockResolvedValue({
      ok: true,
      phase: "ok",
      svg: "<svg></svg>",
      issues: [],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts pending after delay and stores the latest preview result", async () => {
    let resolvePreview: ((value: SvgPreviewResult) => void) | undefined;
    previewSvgEditorAction.mockImplementation(
      () =>
        new Promise<SvgPreviewResult>((resolve) => {
          resolvePreview = resolve;
        }),
    );

    const form = formFixture();
    const { result } = renderHook(() =>
      useDebouncedCompile("new", form, { delayMs: 50 }),
    );

    expect(result.current.pending).toBe(false);
    expect(result.current.result).toBeNull();

    await act(async () => {
      vi.advanceTimersByTime(50);
    });

    expect(result.current.pending).toBe(true);
    expect(previewSvgEditorAction).toHaveBeenCalledWith("new", form);

    await act(async () => {
      resolvePreview?.({
        ok: true,
        phase: "ok",
        svg: "<svg></svg>",
        issues: [],
      });
      await Promise.resolve();
    });

    expect(result.current.pending).toBe(false);
    expect(result.current.result).toEqual({
      ok: true,
      phase: "ok",
      svg: "<svg></svg>",
      issues: [],
    });
  });

  it("ignores stale responses after unmount / dispose", async () => {
    let resolvePreview: ((value: {
      ok: boolean;
      phase: string;
      svg?: string;
      issues: readonly never[];
    }) => void) | undefined;
    previewSvgEditorAction.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePreview = resolve;
        }),
    );

    const form = formFixture();
    const { result, unmount } = renderHook(() =>
      useDebouncedCompile("new", form, { delayMs: 10 }),
    );

    await act(async () => {
      vi.advanceTimersByTime(10);
    });
    expect(result.current.pending).toBe(true);

    unmount();

    await act(async () => {
      resolvePreview?.({
        ok: true,
        phase: "ok",
        svg: "<svg>stale</svg>",
        issues: [],
      });
      await Promise.resolve();
    });

    // Unmounted hook must not throw; no further assertion on result state.
    expect(previewSvgEditorAction).toHaveBeenCalledTimes(1);
  });

  it("maps rejected preview promises to compile-phase error result", async () => {
    previewSvgEditorAction.mockRejectedValue(new Error("network down"));
    const form = formFixture();
    const { result } = renderHook(() =>
      useDebouncedCompile("side-table-001", form, { delayMs: 20 }),
    );

    await act(async () => {
      vi.advanceTimersByTime(20);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(result.current.pending).toBe(false);
    expect(result.current.result).toEqual({
      ok: false,
      phase: "compile",
      issues: [],
      error: "network down",
    });
  });

  it("cancels pending timer when form changes before delay", async () => {
    const formA = formFixture();
    const formB = { ...formFixture(), sku: "CHANGED" };
    const { rerender } = renderHook(
      ({ form }: { form: SvgEditorFormState }) =>
        useDebouncedCompile("new", form, { delayMs: 100 }),
      { initialProps: { form: formA } },
    );

    await act(async () => {
      vi.advanceTimersByTime(50);
    });
    expect(previewSvgEditorAction).not.toHaveBeenCalled();

    rerender({ form: formB });

    await act(async () => {
      vi.advanceTimersByTime(50);
    });
    expect(previewSvgEditorAction).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(50);
      await Promise.resolve();
    });
    expect(previewSvgEditorAction).toHaveBeenCalledTimes(1);
    expect(previewSvgEditorAction).toHaveBeenCalledWith("new", formB);
  });
});
