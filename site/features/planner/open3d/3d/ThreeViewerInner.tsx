/**
 * Inner 3D Viewer — lazy-loaded Three.js scene rebuilt from Open3dProject.
 * Document model is source of truth; meshes tagged with entity ids.
 */

import { useEffect, useRef, useState } from "react";
import type { Open3dFloor } from "../model/types";
import styles from "./threeViewerInner.module.css";
import type {
  Group,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";

import type * as THREE from "three";
import { shouldLoadGlb } from "@/features/planner/lib/glbAssetPolicy";
import { readThreeThemeColor } from "../shared/readThemeColor";
import { buildOpen3dSceneNodes } from "./buildOpen3dSceneNodes";
import {
  addNodesToGroup,
  disposeAndRemoveObject,
} from "./createSceneObjectFromNode";
import {
  createDefaultGltfUrlLoader,
  loadGeneratedGlbObject,
  type GltfUrlLoader,
} from "./loadGeneratedGlbObject";

type ThreeModule = typeof THREE;

function toErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

interface ThreeViewerInnerProps {
  projectData?: {
    id: string;
    name: string;
    floors: Open3dFloor[];
    activeFloorId?: string;
  };
  enableShadows?: boolean;
  enableControls?: boolean;
  backgroundColor?: string;
  onReady?: () => void;
}

function clearContentGroup(group: Group, THREE: ThreeModule): void {
  while (group.children.length > 0) {
    const child = group.children[0];
    group.remove(child);
    child.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.geometry.dispose();
      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];
      materials.forEach((material) => material.dispose());
    });
  }
}

export function ThreeViewerInner({
  projectData,
  enableShadows = true,
  enableControls: _enableControls,
  backgroundColor = readThreeThemeColor("--surface-page", "#ffffff"),
  onReady,
}: ThreeViewerInnerProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentGroupRef = useRef<Group | null>(null);
  const [threeLoaded, setThreeLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [three, setThree] = useState<ThreeModule | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadThree() {
      try {
        const threeModule = await import("three");
        if (!cancelled) {
          setThree(threeModule);
          setThreeLoaded(true);
          onReady?.();
        }
      } catch (err) {
        if (!cancelled) {
          setError(toErrorMessage(err, "Failed to load Three.js"));
        }
      }
    }

    loadThree();

    return () => {
      cancelled = true;
    };
  }, [onReady]);

  // Scene shell (once)
  useEffect(() => {
    if (!three || !containerRef.current) return;

    let animationId: number;
    let renderer: WebGLRenderer | null = null;
    let scene: Scene | null = null;
    let camera: PerspectiveCamera | null = null;

    try {
      const THREE = three;
      scene = new THREE.Scene();
      scene.background = new THREE.Color(backgroundColor);

      const container = containerRef.current;
      const aspect = container.clientWidth / Math.max(container.clientHeight, 1);
      camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 500);
      camera.position.set(4, 6, 8);
      camera.lookAt(0, 0, 0);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      if (enableShadows) {
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      }
      container.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.85);
      directionalLight.position.set(5, 12, 5);
      if (enableShadows) {
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
      }
      scene.add(directionalLight);

      const gridHelper = new THREE.GridHelper(20, 20, 0x888888, 0xcccccc);
      scene.add(gridHelper);

      const floorGeometry = new THREE.PlaneGeometry(20, 20);
      const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0xf5f5f5,
        side: THREE.DoubleSide,
      });
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = enableShadows;
      scene.add(floor);

      const content = new THREE.Group();
      content.name = "open3d-document-content";
      scene.add(content);
      contentGroupRef.current = content;

      function animate() {
        animationId = requestAnimationFrame(animate);
        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      }
      animate();

      function handleResize() {
        if (!containerRef.current || !renderer || !camera) return;
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        camera.aspect = width / Math.max(height, 1);
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(animationId);
        contentGroupRef.current = null;
        if (renderer) {
          renderer.dispose();
          container?.removeChild(renderer.domElement);
        }
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
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sync init catch must surface to UI; owner: hard-path 3d; removal: error boundary
      setError(toErrorMessage(err, "Failed to initialize Three.js"));
    }
  }, [three, backgroundColor, enableShadows]);

  // Rebuild document meshes when project changes.
  // Procedural meshes first; then async policy-allowed generated GLB replace.
  useEffect(() => {
    if (!three || !contentGroupRef.current || !projectData) return;
    let cancelled = false;
    const THREE = three;
    const group = contentGroupRef.current;
    clearContentGroup(group, THREE);

    const nodes = buildOpen3dSceneNodes({
      floors: projectData.floors,
      activeFloorId:
        projectData.activeFloorId ?? projectData.floors[0]?.id ?? "",
    });
    // Immediate procedural path (modular | box) — default when no URL or load fails.
    addNodesToGroup(THREE, group, nodes, enableShadows);

    const nodesNeedingGlb = nodes.filter(
      (node) =>
        node.kind === "furniture" && shouldLoadGlb(node.generatedGlbUrl),
    );

    if (nodesNeedingGlb.length === 0) {
      return () => {
        cancelled = true;
      };
    }

    void (async () => {
      let loadGltf: GltfUrlLoader;
      try {
        loadGltf = await createDefaultGltfUrlLoader();
      } catch {
        // Keep procedural meshes if loader cannot be constructed.
        return;
      }
      if (cancelled) return;

      for (const node of nodesNeedingGlb) {
        if (cancelled) return;
        const glbObject = await loadGeneratedGlbObject(
          THREE,
          node,
          enableShadows,
          loadGltf,
        );
        if (cancelled || glbObject == null) continue;

        const existing = group.children.find(
          (child) => child.userData.entityId === node.id,
        );
        if (existing) {
          disposeAndRemoveObject(THREE, existing);
        }
        group.add(glbObject);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [three, projectData, enableShadows]);

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
      <div className={styles.loadingState}>Initializing 3D...</div>
    );
  }

  return (
    <div className={styles.container} data-testid="three-viewer-container">
      <div ref={containerRef} className={styles.viewerRoot} />
    </div>
  );
}
