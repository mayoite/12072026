import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { LenisProvider } from "@/app/(site)/providers/LenisProvider";

const { mockLenisConstructor, lenisInstances } = vi.hoisted(() => ({
  mockLenisConstructor: vi.fn(),
  lenisInstances: [] as Array<{
    raf: ReturnType<typeof vi.fn>;
    destroy: ReturnType<typeof vi.fn>;
  }>,
}));

vi.mock("lenis", () => {
  class MockLenis {
    raf = vi.fn();
    destroy = vi.fn();

    constructor(options: unknown) {
      mockLenisConstructor(options);
      lenisInstances.push(this);
    }
  }

  return { default: MockLenis };
});

describe("LenisProvider", () => {
  let requestAnimationFrameMock: ReturnType<typeof vi.fn>;
  let cancelAnimationFrameMock: ReturnType<typeof vi.fn>;
  let lastRafCallback: FrameRequestCallback | null = null;

  beforeEach(() => {
    vi.clearAllMocks();
    lastRafCallback = null;
    lenisInstances.length = 0;
    requestAnimationFrameMock = vi.fn((cb: FrameRequestCallback) => {
      lastRafCallback = cb;
      return 17;
    });
    cancelAnimationFrameMock = vi.fn();
    vi.stubGlobal("requestAnimationFrame", requestAnimationFrameMock);
    vi.stubGlobal("cancelAnimationFrame", cancelAnimationFrameMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("initializes Lenis, schedules RAF, and cleans up on unmount", () => {
    const { unmount, getByTestId } = render(
      <LenisProvider>
        <div data-testid="child">Scroll Content</div>
      </LenisProvider>,
    );

    expect(getByTestId("child")).toBeInTheDocument();
    expect(mockLenisConstructor).toHaveBeenCalledWith(
      expect.objectContaining({
        duration: 1.1,
        smoothWheel: true,
      }),
    );
    expect(requestAnimationFrameMock).toHaveBeenCalledTimes(1);

    lastRafCallback?.(0);
    expect(lenisInstances[0]?.raf).toHaveBeenCalledWith(0);

    unmount();

    expect(cancelAnimationFrameMock).toHaveBeenCalledWith(17);
    expect(lenisInstances[0]?.destroy).toHaveBeenCalledTimes(1);
  });
});
