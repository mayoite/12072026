/**
 * Inner 3D Viewer Component
 * 
 * This is the actual 3D viewer implementation that gets lazy-loaded.
 * It uses Three.js for rendering but is only loaded when explicitly requested.
 */

import { useEffect, useRef, useState } from "react";
import type { Open3dFloor } from "../model/types";
import styles from "./threeViewerInner.module.css";
import type { PerspectiveCamera, Scene, WebGLRenderer } from "three";

import type * as THREE from "three";

type ThreeModule = typeof THREE;

/**
 * Inner 3D viewer props.
 */
interface ThreeViewerInnerProps {
  projectData?: {
    id: string;
    name: string;
    floors: Open3dFloor[];
  };
  enableShadows?: boolean;
  enableControls?: boolean;
  backgroundColor?: string;
  onReady?: () => void;
}

/**
 * ThreeViewerInner - The actual 3D viewer implementation.
 * 
 * This component is lazy-loaded and should not be imported directly.
 * Use Lazy3DViewer instead.
 */
export function ThreeViewerInner({
  projectData: _projectData,
  enableShadows = true,
  enableControls: _enableControls,
  backgroundColor = "#ffffff",
  onReady,
}: ThreeViewerInnerProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const [threeLoaded, setThreeLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [three, setThree] = useState<ThreeModule | null>(null);

  // Lazy load three.js
  useEffect(() => {
    let cancelled = false;

    async function loadThree() {
      try {
        // Dynamic import of three.js - only load when needed
        // Note: This requires three to be installed as a dependency
        const threeModule = await import("three");
        if (!cancelled) {
          setThree(threeModule);
          setThreeLoaded(true);
          onReady?.();
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load Three.js");
        }
      }
    }

    loadThree();

    return () => {
      cancelled = true;
    };
  }, [onReady]);

  // Initialize Three.js scene when loaded
  useEffect(() => {
    if (!three || !containerRef.current) return;

    let animationId: number;
    let renderer: WebGLRenderer | null = null;
    let scene: Scene | null = null;
    let camera: PerspectiveCamera | null = null;

    try {
      const THREE = three;

      // Create scene
      scene = new THREE.Scene();
      scene.background = new THREE.Color(backgroundColor);

      // Create camera
      const container = containerRef.current;
      const aspect = container.clientWidth / container.clientHeight;
      camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
      camera.position.set(0, 5, 10);
      camera.lookAt(0, 0, 0);

      // Create renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      
      if (enableShadows) {
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      }

      container.appendChild(renderer.domElement);

      // Add lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 10, 5);
      if (enableShadows) {
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
      }
      scene.add(directionalLight);

      // Add grid helper
      const gridHelper = new THREE.GridHelper(20, 20, 0x888888, 0xcccccc);
      scene.add(gridHelper);

      // Add placeholder floor
      const floorGeometry = new THREE.PlaneGeometry(20, 20);
      const floorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xf5f5f5,
        side: THREE.DoubleSide,
      });
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = enableShadows;
      scene.add(floor);

      // Simple animation loop
      function animate() {
        animationId = requestAnimationFrame(animate);
        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      }
      animate();

      // Handle resize
      function handleResize() {
        if (!containerRef.current || !renderer || !camera) return;
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(animationId);
        
        if (renderer) {
          renderer.dispose();
          container?.removeChild(renderer.domElement);
        }
        
        // Dispose geometries and materials
        if (scene) {
          scene.traverse((object) => {
            if (!(object instanceof THREE.Mesh)) return;
            object.geometry.dispose();
            const materials = Array.isArray(object.material)
              ? object.material
              : [object.material];
            materials.forEach((material) => material.dispose());
          });
        }
      };
    } catch (err) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError(err instanceof Error ? err.message : "Failed to initialize Three.js");
    }
  }, [three, backgroundColor, enableShadows]);

  if (error) {
    return (
      <div className={styles.errorState}>
        <div>
          <p className={styles.errorTitle}>3D Viewer Error</p>
          <p className={styles.errorDetail}>{error}</p>
        </div>
      </div>
    );
  }

  if (!threeLoaded) {
    return (
      <div className={styles.loadingState}>
        Initializing 3D...
      </div>
    );
  }

  return (
    <div ref={containerRef} className={styles.viewerRoot} />
  );
}
