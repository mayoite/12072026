"use client";

import React, { useRef, useState, useEffect } from "react";
import type { ShapePath } from "three";

/**
 * Browser binary SVG→GLB extrude (admin island).
 *
 * Three.js is loaded only inside `useEffect` (dynamic import) so this module
 * never evaluates `three` / `three-stdlib` during SSR (`self is not defined`).
 * Pure plan/path metadata (no THREE): asset-engine/mesh/extrudeSvgPlan.ts
 * (buildExtrudeSvgPlan / exportExtrudeSvgToGeneratedAssetPath).
 *
 * Pair with `next/dynamic(..., { ssr: false })` from EditView when embedding.
 */

export interface GlbExtruderPreviewProps {
  /** The SVG path data or raw SVG string */
  svgString: string;
  /** Thickness of the extrusion in mm */
  thicknessMm?: number;
  /** Hex color for the material */
  color?: string;
  /** Callback fired when the GLB blob is generated */
  onGlbGenerated?: (blob: Blob) => void;
}

type ExtrudeStatus = "idle" | "loading-engine" | "processing" | "ready" | "error";

const panelStyle: React.CSSProperties = {
  padding: 12,
  borderRadius: 4,
  display: "flex",
  flexDirection: "column",
  gap: 6,
  fontSize: 13,
};

/**
 * Dynamically imports three + three-stdlib and extrudes SVG paths to a GLB blob.
 * Headless (no canvas) — binary export only.
 */
export function GlbExtruderPreview({
  svgString,
  thicknessMm = 30,
  color = "#ffffff",
  onGlbGenerated,
}: GlbExtruderPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<ExtrudeStatus>("idle");
  const trimmedSvg = typeof svgString === "string" ? svgString.trim() : "";

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!trimmedSvg) {
      return;
    }

    let cancelled = false;

    const run = async () => {
      setStatus("loading-engine");
      setError(null);

      try {
        // Browser-only: never top-level import three (SSR / RSC crash).
        const [THREE, stdlib] = await Promise.all([
          import("three"),
          import("three-stdlib"),
        ]);

        if (cancelled) return;

        setStatus("processing");

        const { SVGLoader, GLTFExporter } = stdlib;
        const scene = new THREE.Scene();
        const loader = new SVGLoader();
        const svgData = loader.parse(trimmedSvg);

        if (!svgData.paths || svgData.paths.length === 0) {
          if (!cancelled) {
            setError(
              "No drawable paths found in the SVG. Use path/shape content (not only text or raster).",
            );
            setStatus("error");
          }
          return;
        }

        const material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(color),
          roughness: 0.5,
          metalness: 0.1,
          side: THREE.DoubleSide,
        });

        const group = new THREE.Group();
        let meshCount = 0;

        for (const path of svgData.paths) {
          // SVGLoader path shapes — ShapePath cast matches three-stdlib typings.
          const shapes = SVGLoader.createShapes(path as unknown as ShapePath);

          for (const shape of shapes) {
            const geometry = new THREE.ExtrudeGeometry(shape, {
              depth: thicknessMm,
              bevelEnabled: true,
              bevelThickness: 1,
              bevelSize: 1,
              bevelSegments: 2,
            });

            // SVG Y-down → Three Y-up
            geometry.scale(1, -1, 1);
            geometry.center();

            const mesh = new THREE.Mesh(geometry, material);
            group.add(mesh);
            meshCount += 1;
          }
        }

        if (meshCount === 0) {
          if (!cancelled) {
            setError(
              "SVG parsed but produced zero meshes. Check that paths define closed shapes.",
            );
            setStatus("error");
          }
          material.dispose();
          return;
        }

        scene.add(group);

        const exporter = new GLTFExporter();
        await new Promise<void>((resolve, reject) => {
          exporter.parse(
            scene,
            (gltf) => {
              if (cancelled) {
                resolve();
                return;
              }
              if (gltf instanceof ArrayBuffer) {
                const blob = new Blob([gltf], { type: "model/gltf-binary" });
                onGlbGenerated?.(blob);
                setStatus("ready");
                resolve();
                return;
              }
              reject(new Error("GLTFExporter returned a non-binary result."));
            },
            (err) => {
              reject(err instanceof Error ? err : new Error(String(err)));
            },
            { binary: true },
          );
        });

        // Dispose after export so GPU resources are not held in admin UI.
        group.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.geometry?.dispose();
            const mat = obj.material;
            if (Array.isArray(mat)) {
              mat.forEach((m) => m.dispose());
            } else {
              mat?.dispose();
            }
          }
        });
      } catch (err: unknown) {
        if (cancelled) return;
        console.error("Extrusion Error:", err);
        const message =
          err instanceof Error ? err.message : "Unknown extrusion failure.";
        setError(
          `Failed to extrude SVG to GLB. ${message} Try a simpler path SVG or check console.`,
        );
        setStatus("error");
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [trimmedSvg, thicknessMm, color, onGlbGenerated]);

  if (!trimmedSvg) {
    return (
      <div
        style={{
          ...panelStyle,
          border: "1px dashed #d1d5db",
          color: "#6b7280",
          background: "#f9fafb",
        }}
        data-testid="glb-extruder-empty"
        role="status"
      >
        <strong style={{ color: "#374151" }}>No SVG loaded</strong>
        <span>
          Choose an SVG file above to extrude a system-generated GLB (admin
          only — not a designer static asset).
        </span>
      </div>
    );
  }

  if (status === "error" && error) {
    return (
      <div
        style={{
          ...panelStyle,
          border: "1px solid #fecaca",
          color: "#b91c1c",
          background: "#fef2f2",
        }}
        data-testid="glb-extruder-error"
        role="alert"
      >
        <strong>Extrusion failed</strong>
        <span>{error}</span>
      </div>
    );
  }

  if (status === "loading-engine" || status === "processing") {
    return (
      <div
        style={{
          ...panelStyle,
          border: "1px dashed #d1d5db",
          color: "#4b5563",
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
        data-testid="glb-extruder-processing"
        role="status"
      >
        <div
          aria-hidden="true"
          style={{
            width: 16,
            height: 16,
            border: "2px solid #d1d5db",
            borderTopColor: "#111827",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            flexShrink: 0,
          }}
        />
        <span>
          {status === "loading-engine"
            ? "Loading 3D engine (Three.js)…"
            : "Extruding SVG to GLB…"}
        </span>
      </div>
    );
  }

  if (status === "ready") {
    return (
      <div
        style={{
          ...panelStyle,
          border: "1px solid #bbf7d0",
          color: "#166534",
          background: "#f0fdf4",
        }}
        data-testid="glb-extruder-ready"
        role="status"
      >
        <strong>GLB generated</strong>
        <span>
          Binary ready for preview / upload. Pair with Model Viewer when a
          non-blob URL is available.
        </span>
        {/* Headless mount point kept for stability / future canvas debug */}
        <div ref={containerRef} style={{ display: "none" }} aria-hidden="true" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ display: "none" }}
      aria-hidden="true"
      data-testid="glb-extruder-idle"
    />
  );
}
