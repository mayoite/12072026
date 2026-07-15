export const SVG_EDITOR_BRIDGE_VERSION = 1 as const;

const MAX_BRIDGE_MESSAGE_BYTES = 200_000;

type HostMessageType = "load" | "read" | "apply" | "focus-elements";
type EditorMessageType = "ready" | "document" | "changed" | "selection" | "error";

export interface SvgEditorBridgeMessage {
  readonly version: typeof SVG_EDITOR_BRIDGE_VERSION;
  readonly type: `host:${HostMessageType}` | `editor:${EditorMessageType}`;
  readonly requestId: string;
  readonly checksum: string;
  readonly [key: string]: unknown;
}

export function createRequestId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `svg-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createHostMessage(
  type: HostMessageType,
  requestId: string,
  payload: Record<string, unknown> & { checksum: string },
): SvgEditorBridgeMessage {
  return {
    version: SVG_EDITOR_BRIDGE_VERSION,
    type: `host:${type}`,
    requestId,
    ...payload,
  };
}

function isBridgeMessage(value: unknown): value is SvgEditorBridgeMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as Record<string, unknown>;
  return message.version === SVG_EDITOR_BRIDGE_VERSION
    && typeof message.type === "string"
    && typeof message.requestId === "string"
    && typeof message.checksum === "string";
}

export function isEditorMessage(value: unknown): value is SvgEditorBridgeMessage {
  return isBridgeMessage(value) && value.type.startsWith("editor:");
}

export function serializeBridgeMessage(message: SvgEditorBridgeMessage): string {
  const serialized = JSON.stringify(message);
  if (new TextEncoder().encode(serialized).byteLength > MAX_BRIDGE_MESSAGE_BYTES) {
    throw new Error("SVG editor bridge message size exceeds the allowed limit");
  }
  return serialized;
}

export function parseBridgeMessage(serialized: string): SvgEditorBridgeMessage {
  if (new TextEncoder().encode(serialized).byteLength > MAX_BRIDGE_MESSAGE_BYTES) {
    throw new Error("SVG editor bridge message size exceeds the allowed limit");
  }
  const value: unknown = JSON.parse(serialized);
  if (value && typeof value === "object" && "version" in value
      && (value as { version: unknown }).version !== SVG_EDITOR_BRIDGE_VERSION) {
    throw new Error("Unknown bridge version");
  }
  if (!isBridgeMessage(value)) throw new Error("Invalid SVG editor bridge message");
  return value;
}
