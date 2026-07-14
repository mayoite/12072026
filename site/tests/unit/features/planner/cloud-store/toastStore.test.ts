import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useToastStore } from "@/features/planner/cloud-store/toastStore";

describe("toastStore", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useToastStore.setState({ toasts: [] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("adds toast with type and message", () => {
    useToastStore.getState().addToast("success", "Saved");
    const toasts = useToastStore.getState().toasts;
    expect(toasts).toHaveLength(1);
    expect(toasts[0]?.type).toBe("success");
    expect(toasts[0]?.message).toBe("Saved");
    expect(toasts[0]?.id).toMatch(/^toast-/);
  });

  it("removeToast removes by id", () => {
    useToastStore.getState().addToast("info", "One");
    useToastStore.getState().addToast("error", "Two");
    const id = useToastStore.getState().toasts[0]!.id;
    useToastStore.getState().removeToast(id);
    expect(useToastStore.getState().toasts).toHaveLength(1);
    expect(useToastStore.getState().toasts[0]?.message).toBe("Two");
  });

  it("auto-removes toast after 3s", () => {
    useToastStore.getState().addToast("warning", "Temp");
    expect(useToastStore.getState().toasts).toHaveLength(1);
    vi.advanceTimersByTime(3000);
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });
});
