"use client";

import React, { useEffect, useRef, useState } from "react";
import { loadModelViewer } from "@/lib/ui/loadModelViewer";

export interface ModelViewerPreviewProps {
  /** The URL of the .glb file to preview */
  src: string;
  /** Callback fired when the model loads and bounding box is calculated */
  onModelLoaded?: (dimensions: { x: number; y: number; z: number }) => void;
  /** Optional alt text for accessibility */
  alt?: string;
}

interface ModelViewerElement extends HTMLElement {
  getDimensions: () => { x: number; y: number; z: number };
}

/** Typed custom element — avoids JSX intrinsic / SSR issues with model-viewer. */
const ModelViewerElementTag = "model-viewer" as unknown as React.ComponentType<
  React.HTMLAttributes<HTMLElement> & {
    ref?: React.Ref<ModelViewerElement>;
    src?: string;
    alt?: string;
    "camera-controls"?: boolean;
    "auto-rotate"?: boolean;
    "shadow-intensity"?: string;
    style?: React.CSSProperties;
  }
>;

const shellStyle: React.CSSProperties = {
  width: "100%",
  height: "400px",
  position: "relative",
  backgroundColor: "#f3f4f6",
  borderRadius: "8px",
  overflow: "hidden",
  border: "1px solid #e5e7eb",
};

const messageStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  padding: "16px",
  textAlign: "center",
  gap: "6px",
  boxSizing: "border-box",
};

/**
 * Admin-only GLB preview island.
 *
 * Loads model-viewer via browser script injection (`loadModelViewer`) — never
 * a top-level `@google/model-viewer` import (that hits `self is not defined` on SSR).
 * Pair with `next/dynamic(..., { ssr: false })` from EditView when embedding.
 */
export function ModelViewerPreview({
  src,
  onModelLoaded,
  alt = "A 3D model",
}: ModelViewerPreviewProps) {
  const modelRef = useRef<ModelViewerElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const trimmedSrc = typeof src === "string" ? src.trim() : "";

  useEffect(() => {
    if (typeof window === "undefined") return;
    // No GLB yet — skip library load (empty admin state is enough).
    if (!trimmedSrc) {
      return;
    }

    let cancelled = false;
    void loadModelViewer()
      .then(() => {
        if (!cancelled) {
          setError(null);
          setReady(true);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          console.error("ModelViewer load failed:", err);
          setReady(false);
          setError(
            "Could not load the 3D viewer library. Check network / self-hosted model-viewer assets, then retry.",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [trimmedSrc]);

  useEffect(() => {
    if (!ready || !trimmedSrc) return;
    const modelViewer = modelRef.current;
    if (!modelViewer) return;

    const handleLoad = () => {
      setError(null);
      try {
        const size = modelViewer.getDimensions();
        if (size && onModelLoaded) {
          onModelLoaded({
            x: size.x * 1000,
            y: size.y * 1000,
            z: size.z * 1000,
          });
        }
      } catch (err: unknown) {
        console.error("ModelViewer getDimensions failed:", err);
      }
    };

    const handleError = (e: Event) => {
      console.error("ModelViewer error:", e);
      setError(
        "Failed to load this GLB. Confirm the URL is reachable and is a valid .glb binary.",
      );
    };

    modelViewer.addEventListener("load", handleLoad);
    modelViewer.addEventListener("error", handleError);

    return () => {
      modelViewer.removeEventListener("load", handleLoad);
      modelViewer.removeEventListener("error", handleError);
    };
  }, [onModelLoaded, ready, trimmedSrc]);

  if (!trimmedSrc) {
    return (
      <div
        style={shellStyle}
        data-testid="model-viewer-preview-empty"
        role="status"
      >
        <div style={{ ...messageStyle, color: "#6b7280" }}>
          <strong style={{ color: "#374151" }}>No GLB to preview</strong>
          <span>
            Extrude an SVG first, or paste a generated GLB URL (system path under{" "}
            <code>catalog-assets/generated/</code>).
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={shellStyle}
      data-testid="model-viewer-preview"
      data-ready={ready ? "true" : "false"}
    >
      {error ? (
        <div
          style={{ ...messageStyle, color: "#b91c1c" }}
          data-testid="model-viewer-preview-error"
          role="alert"
        >
          <strong>3D preview unavailable</strong>
          <span>{error}</span>
        </div>
      ) : !ready ? (
        <div
          style={{ ...messageStyle, color: "#6b7280" }}
          data-testid="model-viewer-preview-loading"
          role="status"
        >
          Loading 3D viewer…
        </div>
      ) : (
        <ModelViewerElementTag
          ref={modelRef}
          src={trimmedSrc}
          alt={alt}
          camera-controls
          auto-rotate
          shadow-intensity="1"
          style={{ width: "100%", height: "100%" }}
          data-testid="model-viewer-element"
        />
      )}
    </div>
  );
}
