// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";

import {
  SVG_EDITOR_BRIDGE_VERSION,
  createHostMessage,
  createRequestId,
  isEditorMessage,
  parseBridgeMessage,
  serializeBridgeMessage,
} from "@/features/admin/svg-editor-v2/bridge/svgEditorBridgeMessages";
import { createSvgEditBridgeController } from "@/features/admin/svg-editor-v2/bridge/SvgEditFrameHost";
import { SvgEditRuntimeBridge } from "@/features/admin/svg-editor-v2/runtime/SvgEditRuntimeBridge";

const checksum = "a".repeat(64);

describe("SVG editor V2 iframe bridge", () => {
  it("defines bounded versioned host and editor messages", () => {
    expect(SVG_EDITOR_BRIDGE_VERSION).toBe(1);
    const requestId = createRequestId();
    const load = createHostMessage("load", requestId, {
      svg: "<svg />",
      checksum,
      focusElementIds: [],
    });
    const serialized = serializeBridgeMessage(load);

    expect(parseBridgeMessage(serialized)).toEqual(load);
    expect(load).toMatchObject({ version: 1, type: "host:load", requestId, checksum });
    expect(isEditorMessage({
      version: 1,
      type: "editor:ready",
      requestId,
      checksum,
      href: "/vendor/svgedit/index.html",
    })).toBe(true);
    expect(() => parseBridgeMessage("x".repeat(200_001))).toThrow(/message size/i);
    expect(() => parseBridgeMessage(JSON.stringify({ ...load, version: 999 }))).toThrow(/unknown bridge version/i);
  });

  it("rejects spoofed origins, wrong windows, duplicate responses, timeouts, and stale applies", async () => {
    vi.useFakeTimers();
    const iframeWindow = { postMessage: vi.fn() } as unknown as Window;
    const controller = createSvgEditBridgeController({
      expectedOrigin: "https://admin.example.test",
      expectedFrameSrc: "https://admin.example.test/vendor/svgedit/index.html",
      getFrameWindow: () => iframeWindow,
      postTimeoutMs: 100,
    });
    const pending = controller.read(checksum);
    const pendingRequestId = iframeWindow.postMessage.mock.calls[0]?.[0]?.requestId as string;

    controller.receiveMessage({
      origin: "https://evil.example.test",
      source: iframeWindow,
      data: { version: 1, type: "editor:document", requestId: pendingRequestId, checksum, svg: "<svg />" },
    } as MessageEvent);
    controller.receiveMessage({
      origin: "https://admin.example.test",
      source: {} as Window,
      data: { version: 1, type: "editor:document", requestId: pendingRequestId, checksum, svg: "<svg />" },
    } as MessageEvent);
    expect(controller.pendingCount()).toBe(1);

    controller.receiveMessage({
      origin: "https://admin.example.test",
      source: iframeWindow,
      data: { version: 1, type: "editor:document", requestId: pendingRequestId, checksum, svg: "<svg />" },
    } as MessageEvent);
    await expect(pending).resolves.toMatchObject({ svg: "<svg />" });
    controller.receiveMessage({
      origin: "https://admin.example.test",
      source: iframeWindow,
      data: { version: 1, type: "editor:document", requestId: pendingRequestId, checksum, svg: "<svg>duplicate</svg>" },
    } as MessageEvent);
    expect(controller.pendingCount()).toBe(0);

    const timeout = controller.read(checksum);
    vi.advanceTimersByTime(101);
    await expect(timeout).rejects.toThrow(/timed out/i);
    await expect(controller.apply("<svg />", "b".repeat(64), checksum)).rejects.toThrow(/stale checksum/i);
    vi.useRealTimers();
  });

  it("runtime bridge rejects stale applies without modifying editor state", () => {
    const runtime = new SvgEditRuntimeBridge({ href: "/vendor/svgedit/index.html" });
    runtime.load("<svg><rect id=\"a\" /></svg>", checksum);
    const result = runtime.apply("<svg><circle id=\"b\" /></svg>", "b".repeat(64), "c".repeat(64));

    expect(result.ok).toBe(false);
    expect(runtime.read().svg).toContain("rect");
  });
});
