import * as React from "react";
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

const canvasContextStub = {
  setTransform: vi.fn(),
  fillRect: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  setLineDash: vi.fn(),
  fillStyle: "#fff",
  strokeStyle: "#000",
  lineWidth: 1,
  lineCap: "butt",
} as unknown as CanvasRenderingContext2D;

if (typeof window !== "undefined" && typeof window.matchMedia !== "function") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

if (typeof window !== "undefined" && typeof window.requestAnimationFrame !== "function") {
  Object.defineProperty(window, "requestAnimationFrame", {
    writable: true,
    value: (callback: FrameRequestCallback) => window.setTimeout(() => callback(Date.now()), 0),
  });
}

if (typeof window !== "undefined" && typeof window.cancelAnimationFrame !== "function") {
  Object.defineProperty(window, "cancelAnimationFrame", {
    writable: true,
    value: (handle: number) => window.clearTimeout(handle),
  });
}

if (typeof globalThis.ResizeObserver === "undefined") {
  class ResizeObserverMock {
    private readonly callback: ResizeObserverCallback;

    constructor(callback: ResizeObserverCallback) {
      this.callback = callback;
    }

    observe(target: Element) {
      const rect = target.getBoundingClientRect();
      this.callback(
        [
          {
            target,
            contentRect: {
              x: 0,
              y: 0,
              top: 0,
              left: 0,
              right: rect.width,
              bottom: rect.height,
              width: rect.width || 1,
              height: rect.height || 1,
              toJSON: () => ({}),
            },
          } as ResizeObserverEntry,
        ],
        this as unknown as ResizeObserver,
      );
    }

    unobserve() {}

    disconnect() {}
  }

  Object.defineProperty(globalThis, "ResizeObserver", {
    writable: true,
    value: ResizeObserverMock,
  });
}

if (typeof HTMLCanvasElement !== "undefined") {
  Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
    writable: true,
    value: vi.fn(() => canvasContextStub),
  });
}

vi.mock("next/image", () => ({
  default: ({
    src,
    alt = "",
    ...props
  }: {
    src: string | { src: string };
    alt?: string;
    [key: string]: unknown;
  }) =>
    React.createElement("img", {
      ...props,
      src: typeof src === "string" ? src : src.src,
      alt,
    }),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
