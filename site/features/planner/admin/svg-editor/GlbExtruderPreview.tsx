"use client";

import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { SVGLoader } from "three-stdlib";
import { GLTFExporter } from "three-stdlib";
import type { ShapePath } from "three";
import type { SVGResult } from "three-stdlib";

/**
 * Browser binary SVG→GLB extrude (admin island).
 * Pure plan/path metadata (no THREE): asset-engine/mesh/extrudeSvgPlan.ts
 * (buildExtrudeSvgPlan / exportExtrudeSvgToGeneratedAssetPath).
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

export function GlbExtruderPreview({
  svgString,
  thicknessMm = 30,
  color = "#ffffff",
  onGlbGenerated,
}: GlbExtruderPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!svgString || !containerRef.current) return;
    
    setIsProcessing(true);
    setError(null);

    try {
      // 1. Initialize headless scene
      const scene = new THREE.Scene();
      
      // 2. Parse SVG
      const loader = new SVGLoader();
      const svgData: SVGResult = loader.parse(svgString);
      
      // 3. Create Material
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        roughness: 0.5,
        metalness: 0.1,
        side: THREE.DoubleSide
      });

      // 4. Extrude Paths
      const group = new THREE.Group();
      
      for (const path of svgData.paths) {
        const shapes = SVGLoader.createShapes(path as unknown as ShapePath);
        
        for (const shape of shapes) {
          const geometry = new THREE.ExtrudeGeometry(shape, {
            depth: thicknessMm,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 1,
            bevelSegments: 2,
          });
          
          // SVGLoader imports paths upside down by default (Y down in SVG, Y up in Three)
          geometry.scale(1, -1, 1);
          geometry.center(); // Center geometry around origin
          
          const mesh = new THREE.Mesh(geometry, material);
          group.add(mesh);
        }
      }
      
      scene.add(group);

      // 5. Export to GLB
      const exporter = new GLTFExporter();
      exporter.parse(
        scene,
        (gltf) => {
          if (gltf instanceof ArrayBuffer) {
            const blob = new Blob([gltf], { type: "model/gltf-binary" });
            if (onGlbGenerated) {
              onGlbGenerated(blob);
            }
            setIsProcessing(false);
          }
        },
        (err) => {
          console.error("GLTF Export Error:", err);
          setTimeout(() => {
            setError("Failed to export GLB.");
            setIsProcessing(false);
          }, 0);
        },
        { binary: true } // Export as .glb
      );

    } catch (err) {
      console.error("Extrusion Error:", err);
      setTimeout(() => {
        setError("Failed to parse SVG for extrusion.");
        setIsProcessing(false);
      }, 0);
    }

  }, [svgString, thicknessMm, color, onGlbGenerated]);

  if (error) {
    return (
      <div style={{ padding: 12, border: "1px solid red", color: "red", borderRadius: 4 }}>
        <p>Extrusion Error: {error}</p>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div style={{ padding: 12, border: "1px dashed #ccc", borderRadius: 4, display: "flex", alignItems: "center", gap: 8 }}>
        <div className="spinner" style={{ width: 16, height: 16, border: "2px solid #ccc", borderTopColor: "#000", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <span>Extruding SVG to 3D...</span>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ display: "none" }} aria-hidden="true">
      {/* Headless component, no canvas needed for pure export */}
    </div>
  );
}
