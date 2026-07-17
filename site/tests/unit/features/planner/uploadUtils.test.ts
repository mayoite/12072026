import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  uploadBackgroundImage,
  uploadSketchImage,
  uploadAndCreateBackground,
  createBackgroundImageFromUpload,
  generatePreview,
  uploadWithProgress,
  validateUpload,
  formatFileSize,
  revokeObjectUrl,
} from "@/features/planner/shared/export/uploadUtils";

const PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
const PNG_DATA_URL = `data:image/png;base64,${PNG_BASE64}`;

function makePngFile(name = "floorplan.png"): File {
  const bytes = Uint8Array.from(atob(PNG_BASE64), (char) => char.charCodeAt(0));
  return new File([bytes], name, { type: "image/png" });
}

function installImageAndReaderMocks(): void {
  class MockFileReader {
    result: string | ArrayBuffer | null = PNG_DATA_URL;
    onload: ((event: ProgressEvent<FileReader>) => void) | null = null;
    readAsDataURL(): void {
      queueMicrotask(() => {
        this.onload?.({ target: this } as unknown as ProgressEvent<FileReader>);
      });
    }
  }

  vi.stubGlobal("FileReader", MockFileReader);

  vi.spyOn(globalThis, "Image").mockImplementation(function MockImage(this: HTMLImageElement) {
    queueMicrotask(() => {
      Object.defineProperty(this, "width", { value: 1, configurable: true });
      Object.defineProperty(this, "height", { value: 1, configurable: true });
      this.onload?.({} as Event);
    });
    return this;
  });
}

describe("upload utilities", () => {
  beforeEach(() => {
    installImageAndReaderMocks();
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
      drawImage: vi.fn(),
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "high",
    } as unknown as CanvasRenderingContext2D);
    vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue(
      `data:image/jpeg;base64,${PNG_BASE64}`,
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("rejects invalid background uploads", async () => {
    const badFile = new File(["bad"], "notes.txt", { type: "text/plain" });
    const result = await uploadBackgroundImage(badFile);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("uploads a background image client-side and builds a background object", async () => {
    const file = makePngFile();
    const upload = await uploadBackgroundImage(file, {
      position: { x: 100, y: 200 },
      opacity: 0.5,
      rotation: 15,
    });

    expect(upload.success).toBe(true);
    expect(upload.dataUrl).toContain("data:image");
    expect(upload.dimensions?.width).toBeGreaterThan(0);

    const background = createBackgroundImageFromUpload(upload, {
      position: { x: 100, y: 200 },
      locked: true,
    });
    expect(background?.position).toEqual({ x: 100, y: 200 });
    expect(background?.locked).toBe(true);
    expect(createBackgroundImageFromUpload({ success: false })).toBeNull();
  });

  it("uploads sketch images and completes the background workflow", async () => {
    const file = makePngFile("sketch.png");
    const sketch = await uploadSketchImage(file, {
      previewMaxWidth: 200,
      previewMaxHeight: 200,
    });
    expect(sketch.success).toBe(true);
    expect(sketch.preview).toContain("data:image");

    const workflow = await uploadAndCreateBackground(file, { scale: 2 });
    expect(workflow.error).toBeNull();
    expect(workflow.backgroundImage?.scale).toBe(2);
  });

  it("uploads to configured endpoints", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          url: "https://cdn.example.com/bg.png",
          dimensions: { width: 1, height: 1 },
          preview: "https://cdn.example.com/bg-thumb.png",
        }),
      })),
    );

    const file = makePngFile();
    const serverUpload = await uploadBackgroundImage(file, {
      uploadEndpoint: "/api/upload",
    });
    expect(serverUpload.success).toBe(true);
    expect(serverUpload.url).toContain("cdn.example.com");

    const aiSketch = await uploadSketchImage(file, {
      processEndpoint: "/api/sketch",
    });
    expect(aiSketch.success).toBe(true);
  });

  it("generates scaled previews from data URLs", async () => {
    const preview = await generatePreview(PNG_DATA_URL, 50, 50);
    expect(preview).toContain("data:image");
  });

  it("falls back when preview image fails to load", async () => {
    vi.spyOn(globalThis, "Image").mockImplementation(function BrokenImage(this: HTMLImageElement) {
      queueMicrotask(() => {
        this.onerror?.({} as Event);
      });
      return this;
    });
    const preview = await generatePreview(PNG_DATA_URL, 50, 50);
    expect(preview).toBe(PNG_DATA_URL);
  });

  it("validates uploads and formats file sizes", () => {
    const file = makePngFile();
    expect(validateUpload(file).valid).toBe(true);
    expect(formatFileSize(512)).toBe("512 B");
    expect(formatFileSize(2048)).toBe("2.0 KB");
  });

  it("rejects invalid upload types and oversized files", () => {
    const badType = new File(["x"], "notes.txt", { type: "text/plain" });
    expect(validateUpload(badType).valid).toBe(false);

    const huge = new File([new Uint8Array(2048)], "big.png", { type: "image/png" });
    expect(validateUpload(huge, { maxFileSizeBytes: 1024 }).valid).toBe(false);
  });

  it("handles server upload failures and AI processing fallbacks", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
        status: 500,
        statusText: "Server Error",
      })),
    );
    const file = makePngFile();
    const failedUpload = await uploadBackgroundImage(file, { uploadEndpoint: "/api/upload" });
    expect(failedUpload.success).toBe(false);

    const aiFallback = await uploadSketchImage(file, { processEndpoint: "/api/sketch" });
    expect(aiFallback.success).toBe(true);
    expect(aiFallback.error).toContain("AI processing failed");
  });

  it("uploads with XHR progress and handles network errors", async () => {
    class MockXHR {
      upload = { onprogress: null as ((event: ProgressEvent) => void) | null };
      status = 200;
      responseText = JSON.stringify({ url: "https://cdn.example.com/bg.png", dimensions: { width: 1, height: 1 } });
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      open = vi.fn();
      send = vi.fn(() => {
        this.upload.onprogress?.({ lengthComputable: true, loaded: 50, total: 100 } as ProgressEvent);
        this.onload?.();
      });
    }

    vi.stubGlobal("XMLHttpRequest", MockXHR as unknown as typeof XMLHttpRequest);
    const progress: number[] = [];
    const ok = await uploadWithProgress(makePngFile(), "/api/upload", (value) => progress.push(value));
    expect(ok.success).toBe(true);
    expect(progress).toEqual([50]);

    class ErrorXHR extends MockXHR {
      send = vi.fn(() => {
        this.onerror?.();
      });
    }
    vi.stubGlobal("XMLHttpRequest", ErrorXHR as unknown as typeof XMLHttpRequest);
    const failed = await uploadWithProgress(makePngFile(), "/api/upload");
    expect(failed.success).toBe(false);
  });

  it("revokes blob URLs only", () => {
    const revoke = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
    revokeObjectUrl("blob:temp");
    expect(revoke).toHaveBeenCalledWith("blob:temp");
    revokeObjectUrl("https://example.com/image.png");
    expect(revoke).toHaveBeenCalledTimes(1);
  });

  it("handles upload network failures and invalid XHR responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("network down");
      }),
    );
    const failed = await uploadBackgroundImage(makePngFile(), { uploadEndpoint: "/api/upload" });
    expect(failed.success).toBe(false);
    expect(failed.error).toContain("network down");

    class BadResponseXHR {
      upload = { onprogress: null as ((event: ProgressEvent) => void) | null };
      status = 200;
      responseText = "not-json";
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      open = vi.fn();
      send = vi.fn(() => {
        this.onload?.();
      });
    }
    vi.stubGlobal("XMLHttpRequest", BadResponseXHR as unknown as typeof XMLHttpRequest);
    const invalid = await uploadWithProgress(makePngFile(), "/api/upload");
    expect(invalid.success).toBe(false);
    expect(invalid.error).toBe("Invalid response");

    class BadStatusXHR extends BadResponseXHR {
      status = 503;
    }
    vi.stubGlobal("XMLHttpRequest", BadStatusXHR as unknown as typeof XMLHttpRequest);
    const rejected = await uploadWithProgress(makePngFile(), "/api/upload");
    expect(rejected.error).toContain("503");
  });

  it("returns preview fallback when canvas context is unavailable", async () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    const preview = await generatePreview(PNG_DATA_URL, 50, 50);
    expect(preview).toBe(PNG_DATA_URL);
  });

  it("reports AI processing catch errors while keeping local preview", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw "boom";
      }),
    );
    const sketch = await uploadSketchImage(makePngFile(), { processEndpoint: "/api/sketch" });
    expect(sketch.success).toBe(true);
    expect(sketch.error).toBeDefined();
  });

  it("returns an error when image loading fails client-side", async () => {
    vi.spyOn(globalThis, "Image").mockImplementation(function BrokenImage(this: HTMLImageElement) {
      queueMicrotask(() => {
        this.onerror?.({} as Event);
      });
      return this;
    });

    const failed = await uploadBackgroundImage(makePngFile());
    expect(failed.success).toBe(false);
    expect(failed.error).toBeDefined();
  });

  it("creates background images with optional scale and opacity", () => {
    const bg = createBackgroundImageFromUpload(
      { success: true, dataUrl: PNG_DATA_URL },
      { scale: 2, opacity: 0.25 },
    );
    expect(bg?.scale).toBe(2);
    expect(bg?.opacity).toBe(0.25);
  });

  it("scales previews using width and height constraints", async () => {
    vi.spyOn(globalThis, "Image").mockImplementation(function TallImage(this: HTMLImageElement) {
      queueMicrotask(() => {
        Object.defineProperty(this, "width", { value: 500, configurable: true });
        Object.defineProperty(this, "height", { value: 2000, configurable: true });
        this.onload?.({} as Event);
      });
      return this;
    });

    const preview = await generatePreview(PNG_DATA_URL, 50, 50);
    expect(preview).toContain("data:image");
  });

  it("handles thrown fetch errors during server upload", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("network down");
      }),
    );
    const failed = await uploadBackgroundImage(makePngFile(), { uploadEndpoint: "/api/upload" });
    expect(failed.success).toBe(false);
    expect(failed.error).toContain("network down");
  });
});
