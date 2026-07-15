"use client";

import { useEffect, useRef } from "react";

import {
  createHostMessage,
  createRequestId,
  isEditorMessage,
  type SvgEditorBridgeMessage,
} from "./svgEditorBridgeMessages";

interface BridgeControllerOptions {
  readonly expectedOrigin: string;
  readonly expectedFrameSrc: string;
  readonly getFrameWindow: () => Window | null;
  readonly postTimeoutMs?: number;
}

interface PendingRequest {
  readonly checksum: string;
  readonly resolve: (message: SvgEditorBridgeMessage) => void;
  readonly reject: (error: Error) => void;
  readonly timeout: ReturnType<typeof setTimeout>;
}

export function createSvgEditBridgeController(options: BridgeControllerOptions) {
  const pending = new Map<string, PendingRequest>();
  let currentChecksum: string | null = null;

  function request(type: "read" | "apply", checksum: string, payload: Record<string, unknown> = {}) {
    const frame = options.getFrameWindow();
    if (!frame) return Promise.reject(new Error("SVG-Edit iframe is unavailable"));
    const requestId = createRequestId();
    const message = createHostMessage(type, requestId, { checksum, ...payload });
    return new Promise<SvgEditorBridgeMessage>((resolve, reject) => {
      const timeout = setTimeout(() => {
        pending.delete(requestId);
        reject(new Error("SVG editor bridge request timed out"));
      }, options.postTimeoutMs ?? 5_000);
      pending.set(requestId, { checksum, resolve, reject, timeout });
      frame.postMessage(message, options.expectedOrigin);
    });
  }

  return {
    read(checksum: string) {
      currentChecksum = checksum;
      return request("read", checksum);
    },
    apply(svg: string, baseChecksum: string, checksum: string) {
      if (currentChecksum !== null && baseChecksum !== currentChecksum) {
        return Promise.reject(new Error("Stale checksum; reload the current document before applying"));
      }
      return request("apply", checksum, { svg, baseChecksum });
    },
    receiveMessage(event: MessageEvent) {
      if (event.origin !== options.expectedOrigin || event.source !== options.getFrameWindow()) return;
      if (!isEditorMessage(event.data)) return;
      const item = pending.get(event.data.requestId);
      if (!item) return;
      pending.delete(event.data.requestId);
      clearTimeout(item.timeout);
      if (event.data.type === "editor:error") {
        item.reject(new Error(typeof event.data.message === "string" ? event.data.message : "SVG editor error"));
        return;
      }
      currentChecksum = event.data.checksum;
      item.resolve(event.data);
    },
    pendingCount: () => pending.size,
    reset() {
      for (const item of pending.values()) {
        clearTimeout(item.timeout);
        item.reject(new Error("SVG-Edit iframe reloaded"));
      }
      pending.clear();
      currentChecksum = null;
    },
  };
}

export function SvgEditFrameHost({ title = "SVG-Edit iframe" }: { readonly title?: string }) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const controllerRef = useRef<ReturnType<typeof createSvgEditBridgeController> | null>(null);
  if (!controllerRef.current && origin) {
    controllerRef.current = createSvgEditBridgeController({
      expectedOrigin: origin,
      expectedFrameSrc: `${origin}/vendor/svgedit/index.html`,
      getFrameWindow: () => frameRef.current?.contentWindow ?? null,
    });
  }
  useEffect(() => {
    const controller = controllerRef.current;
    if (!controller) return;
    const receive = (event: MessageEvent) => controller.receiveMessage(event);
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, []);
  return (
    <iframe
      ref={frameRef}
      aria-label={title}
      className="svg-editor-v2__frame"
      src="/vendor/svgedit/index.html"
      title={title}
      onLoad={() => controllerRef.current?.reset()}
    />
  );
}
