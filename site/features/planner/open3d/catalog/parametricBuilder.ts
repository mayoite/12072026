import * as THREE from "three";
import type { BlockDescriptorParametric } from "./svg/svgTypes";

/**
 * Phase 2C: The Client-Side Parametric Engine
 * Generates both 2D SVG footprints and 3D WebGL meshes using pure client-side math.
 */
export const ParametricBuilder = {
  /**
   * Reads a parametric BlockDescriptor and returns a top-down 2D SVG path.
   * Useful for the Open3D Feasibility (2D) canvas.
   */
  generate2DFootprint(descriptor: BlockDescriptorParametric): string {
    const { widthMm, depthMm } = descriptor.geometry;
    
    // In SVG, 0,0 is top-left, but we center the origin in our planner
    const halfW = widthMm / 2;
    const halfD = depthMm / 2;
    
    // Return a simple SVG path representing the box footprint
    return `M -${halfW} -${halfD} L ${halfW} -${halfD} L ${halfW} ${halfD} L -${halfW} ${halfD} Z`;
  },

  /**
   * Reads a parametric BlockDescriptor and returns a generated Three.js Mesh.
   * Useful for the Open3D WebGL (3D) canvas.
   */
  generate3DMesh(descriptor: BlockDescriptorParametric): THREE.Mesh {
    const { widthMm, heightMm, depthMm } = descriptor.geometry;
    
    // Scale everything down to Planner units (typically meters, where 1 unit = 1m)
    // If the planner expects MM, we just use MM directly. Assuming MM for now.
    const geometry = new THREE.BoxGeometry(widthMm, heightMm, depthMm);
    
    // We can extract a selected color or texture from the parametric schema
    // if the user configured it, but default to standard wood/white.
    const material = new THREE.MeshStandardMaterial({ 
      color: "#f9fafb", // Off-white cabinet color
      roughness: 0.8,
      metalness: 0.1
    });

    const mesh = new THREE.Mesh(geometry, material);
    
    // Elevate the mesh so it sits perfectly on the floor (Y = height / 2)
    mesh.position.y = heightMm / 2;
    
    return mesh;
  }
};
