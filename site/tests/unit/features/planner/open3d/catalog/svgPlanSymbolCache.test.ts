/**
 * S7 — plan canvas SVG symbol cache (load + drawImage footprint).
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  clearSvgPlanSymbolCacheForTests,
  drawSvgPlanSymbol,
  getSvgPlanImage,
  isPublishedSvgPlanUrl,
} from "@/features/planner/open3d/catalog/svg/svgPlanSymbolCache";

type FakeImg = {
  decoding: string;
  src: string;
  onload: (() => void) | null;
  onerror: (() => void) | null;
};

const instances: FakeImg[] = [];
const OriginalImage = globalThis.Image;

function installFakeImage(): void {
  instances.length = 0;
  class FakeImage {
    decoding = "";
    src = "";
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    constructor() {
      instances.push(this as unknown as FakeImg);
    }
  }
  Object.defineProperty(globalThis, "Image", {
    configurable: true,
    writable: true,
    value: FakeImage,
  });
}

afterEach(() => {
  clearSvgPlanSymbolCacheForTests();
  Object.defineProperty(globalThis, "Image", {
    configurable: true,
    writable: true,
    value: OriginalImage,
  });
  vi.restoreAllMocks();
});

describe("isPublishedSvgPlanUrl", () => {
  it("accepts /svg-catalog/*.svg paths", () => {
    expect(isPublishedSvgPlanUrl("/svg-catalog/chaise-lounge-001.svg")).toBe(true);
    expect(isPublishedSvgPlanUrl("/svg-catalog/side-table-001.svg?v=1")).toBe(true);
  });

  it("rejects non-svg and empty", () => {
    expect(isPublishedSvgPlanUrl(undefined)).toBe(false);
    expect(isPublishedSvgPlanUrl(null)).toBe(false);
    expect(isPublishedSvgPlanUrl("/images/desk.jpg")).toBe(false);
    expect(isPublishedSvgPlanUrl("")).toBe(false);
  });
});

describe("getSvgPlanImage", () => {
  it("returns null while loading and delivers image after onload", () => {
    installFakeImage();
    const onLoaded = vi.fn();
    const url = "/svg-catalog/chaise-lounge-001.svg";
    expect(getSvgPlanImage(url, onLoaded)).toBeNull();
    expect(instances).toHaveLength(1);
    expect(instances[0]?.src).toBe(url);

    // still loading
    expect(getSvgPlanImage(url)).toBeNull();

    instances[0]?.onload?.();
    expect(onLoaded).toHaveBeenCalledTimes(1);

    const img = getSvgPlanImage(url);
    expect(img).toBeTruthy();
    expect(img).toBe(instances[0]);
  });

  it("remembers failed loads as null (Block2D fallback path)", () => {
    installFakeImage();
    const onLoaded = vi.fn();
    const url = "/svg-catalog/missing-broken.svg";
    expect(getSvgPlanImage(url, onLoaded)).toBeNull();
    instances[0]?.onerror?.();
    expect(onLoaded).toHaveBeenCalledTimes(1);
    expect(getSvgPlanImage(url)).toBeNull();
    // no second network attempt — cache holds null
    expect(getSvgPlanImage(url, vi.fn())).toBeNull();
    expect(instances).toHaveLength(1);
  });
});

describe("drawSvgPlanSymbol", () => {
  it("drawImage maps footprint centered at origin in mm space", () => {
    const drawImage = vi.fn();
    const save = vi.fn();
    const restore = vi.fn();
    const ctx = { drawImage, save, restore } as unknown as CanvasRenderingContext2D;
    const img = {} as HTMLImageElement;

    drawSvgPlanSymbol(ctx, img, 800, 1600);

    expect(save).toHaveBeenCalled();
    expect(restore).toHaveBeenCalled();
    expect(drawImage).toHaveBeenCalledWith(img, -400, -800, 800, 1600);
  });

  it("clamps zero/negative footprint to at least 1mm", () => {
    const drawImage = vi.fn();
    const ctx = {
      drawImage,
      save: vi.fn(),
      restore: vi.fn(),
    } as unknown as CanvasRenderingContext2D;
    drawSvgPlanSymbol(ctx, {} as HTMLImageElement, 0, -5);
    expect(drawImage).toHaveBeenCalledWith(expect.anything(), -0.5, -0.5, 1, 1);
  });
});
