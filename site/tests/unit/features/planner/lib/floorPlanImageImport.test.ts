import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildLockedUnderlayFromFloorPlan,
  FLOOR_PLAN_ACCEPTED_MIME_TYPES,
  FLOOR_PLAN_MAX_BYTES,
  FLOOR_PLAN_MIN_EDGE_PX,
  isAcceptedFloorPlanImageType,
  readFloorPlanImageFile,
  validateFloorPlanImageFile,
} from "@/features/planner/lib/floorPlanImageImport";
import {
  DEFAULT_ASSUMED_ROOM_WIDTH_MM,
  reviveUnderlayScaleAfterReload,
  underlayScalePersistenceFields,
  UNDERLAY_KNOWN_WIDTH_5M_MM,
} from "@/features/planner/lib/underlayCalibrate";

describe("floorPlanImageImport", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("lists accepted MIME types including SVG", () => {
    expect(FLOOR_PLAN_ACCEPTED_MIME_TYPES).toContain("image/png");
    expect(FLOOR_PLAN_ACCEPTED_MIME_TYPES).toContain("image/svg+xml");
    expect(FLOOR_PLAN_MAX_BYTES).toBe(15 * 1024 * 1024);
    expect(FLOOR_PLAN_MIN_EDGE_PX).toBe(32);
  });

  it("accepts documented image types and rejects PDF", () => {
    expect(isAcceptedFloorPlanImageType("image/jpeg")).toBe(true);
    expect(isAcceptedFloorPlanImageType("image/png")).toBe(true);
    expect(isAcceptedFloorPlanImageType("image/svg+xml")).toBe(true);
    expect(isAcceptedFloorPlanImageType("application/pdf")).toBe(false);
  });

  it("validates file type and size without decoding", () => {
    const ok = validateFloorPlanImageFile(
      new File(["x"], "plan.png", { type: "image/png" }),
    );
    expect(ok).toEqual({ ok: true });

    const badType = validateFloorPlanImageFile(
      new File(["x"], "plan.pdf", { type: "application/pdf" }),
    );
    expect(badType.ok).toBe(false);
    if (!badType.ok) {
      expect(badType.error).toMatch(/JPG|PNG|SVG/i);
    }

    const huge = validateFloorPlanImageFile(
      new File([new Uint8Array(FLOOR_PLAN_MAX_BYTES + 1)], "big.png", {
        type: "image/png",
      }),
    );
    expect(huge.ok).toBe(false);
    if (!huge.ok) {
      expect(huge.error).toMatch(/15 MB/i);
    }
  });

  it("builds a locked underlay with default 10 m width scale", () => {
    const draft = buildLockedUnderlayFromFloorPlan({
      dataUrl: "data:image/png;base64,abc",
      width: 2000,
      height: 1000,
      fileName: "sketch.png",
    });
    expect(draft.locked).toBe(true);
    expect(draft.scale).toBe(1);
    expect(draft.imageWidthPx).toBe(2000);
    expect(draft.imageHeightPx).toBe(1000);
    expect(draft.mmPerPixel).toBe(DEFAULT_ASSUMED_ROOM_WIDTH_MM / 2000);
    expect(draft.opacity).toBe(0.4);
    expect(draft.position).toEqual({ x: 0, y: 0 });
  });

  it("buildLockedUnderlay scale survives JSON reload", () => {
    const draft = buildLockedUnderlayFromFloorPlan(
      {
        dataUrl: "data:image/png;base64,abc",
        width: 1000,
        height: 800,
        fileName: "plan.png",
      },
      { assumeRoomWidthMm: UNDERLAY_KNOWN_WIDTH_5M_MM },
    );
    const persisted = underlayScalePersistenceFields({
      position: draft.position,
      imageWidthPx: draft.imageWidthPx,
      imageHeightPx: draft.imageHeightPx,
      mmPerPixel: draft.mmPerPixel,
      scale: draft.scale,
    });
    const cloned = JSON.parse(JSON.stringify(persisted)) as typeof persisted;
    const revived = reviveUnderlayScaleAfterReload(cloned);
    expect(revived.mmPerPixel).toBe(5);
    expect(revived.footprint.widthMm).toBe(5000);
    expect(revived.footprint.depthMm).toBe(4000);
  });

  it("readFloorPlanImageFile rejects bad type before decode", async () => {
    await expect(
      readFloorPlanImageFile(
        new File(["x"], "notes.txt", { type: "text/plain" }),
      ),
    ).rejects.toThrow(/JPG|PNG|SVG/i);
  });

  it("readFloorPlanImageFile returns payload when Image decodes", async () => {
    vi.spyOn(globalThis, "Image").mockImplementation(function MockImage(
      this: HTMLImageElement,
    ) {
      Object.defineProperty(this, "naturalWidth", { get: () => 640 });
      Object.defineProperty(this, "naturalHeight", { get: () => 480 });
      Object.defineProperty(this, "src", {
        set() {
          queueMicrotask(() => {
            this.onload?.call(this, new Event("load"));
          });
        },
        get: () => "",
      });
      return this;
    } as unknown as typeof Image);

    const file = new File([new Uint8Array([1, 2, 3])], "floor.png", {
      type: "image/png",
    });
    const payload = await readFloorPlanImageFile(file);
    expect(payload.width).toBe(640);
    expect(payload.height).toBe(480);
    expect(payload.fileName).toBe("floor.png");
    expect(payload.dataUrl.startsWith("data:")).toBe(true);
  });

  it("readFloorPlanImageFile rejects images below min edge", async () => {
    vi.spyOn(globalThis, "Image").mockImplementation(function MockImage(
      this: HTMLImageElement,
    ) {
      Object.defineProperty(this, "naturalWidth", { get: () => 16 });
      Object.defineProperty(this, "naturalHeight", { get: () => 16 });
      Object.defineProperty(this, "src", {
        set() {
          queueMicrotask(() => {
            this.onload?.call(this, new Event("load"));
          });
        },
        get: () => "",
      });
      return this;
    } as unknown as typeof Image);

    await expect(
      readFloorPlanImageFile(
        new File([new Uint8Array([1])], "tiny.png", { type: "image/png" }),
      ),
    ).rejects.toThrow(/too small/i);
  });
});
