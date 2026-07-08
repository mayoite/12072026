"use client";

import React, { useEffect, useRef, useState } from "react";
// Import the web component registry for TS support
import "@google/model-viewer";

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

export function ModelViewerPreview({
  src,
  onModelLoaded,
  alt = "A 3D model",
}: ModelViewerPreviewProps) {
  const modelRef = useRef<ModelViewerElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const modelViewer = modelRef.current;
    if (!modelViewer) return;

    const handleLoad = () => {
      setError(null);
      
      // Calculate the actual dimensions using model-viewer's API
      const size = modelViewer.getDimensions();
      if (size && onModelLoaded) {
        onModelLoaded({
          x: size.x * 1000, // Convert meters to mm for the planner
          y: size.y * 1000,
          z: size.z * 1000,
        });
      }
    };

    const handleError = (e: Event) => {
      console.error("ModelViewer error:", e);
      setError("Failed to load 3D model.");
    };

    modelViewer.addEventListener("load", handleLoad);
    modelViewer.addEventListener("error", handleError);

    return () => {
      modelViewer.removeEventListener("load", handleLoad);
      modelViewer.removeEventListener("error", handleError);
    };
  }, [onModelLoaded]);

  return (
    <div style={{ width: "100%", height: "400px", position: "relative", backgroundColor: "#f3f4f6", borderRadius: "8px", overflow: "hidden" }}>
      {error ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "red" }}>
          {error}
        </div>
      ) : (
        /* @ts-expect-error - React doesn't fully support custom web components typings yet; removal when @types/model-viewer provide JSX support */
        <model-viewer
          ref={modelRef}
          src={src}
          alt={alt}
          camera-controls
          auto-rotate
          shadow-intensity="1"
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </div>
  );
}
