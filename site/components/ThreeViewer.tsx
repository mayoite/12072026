"use client";

import React, { Component, Suspense, useLayoutEffect, useRef, type ErrorInfo, type ReactNode } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import { logClientError } from "@/lib/errorLogger";
import type { PerspectiveCamera } from "three";

interface ThreeViewerProps {
  modelUrl: string;
  fallback?: React.ReactNode;
}

class ThreeErrorBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    void logClientError({
      error,
      label: "ThreeViewer-canvas",
      componentStack: errorInfo?.componentStack ?? "",
    });
  }
  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            className="flex h-full min-h-[20rem] flex-col items-center justify-center bg-inverse/5 text-subtle p-6 text-center border border-dashed border-muted rounded-xl"
            role="status"
          >
            <p className="text-sm font-semibold text-muted">3D Preview unavailable</p>
            <p className="text-xs text-muted mt-1">An error occurred loading the 3D model.</p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  // Clone to avoid mutation issues if rendered multiple times
  return <primitive object={scene.clone()} />;
}

function ResizeRenderer({ targetRef }: { targetRef: React.RefObject<HTMLDivElement | null> }) {
  const { gl, camera } = useThree();
  const cameraRef = useRef<PerspectiveCamera | null>(null);

  useLayoutEffect(() => {
    cameraRef.current = camera as PerspectiveCamera;
  }, [camera]);

  useLayoutEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const resize = () => {
      const { width, height } = target.getBoundingClientRect();
      if (width <= 0 || height <= 0) return;
      gl.setSize(width, height, false);
      const perspectiveCamera = cameraRef.current;
      if (!perspectiveCamera) return;
      perspectiveCamera.aspect = width / height;
      perspectiveCamera.updateProjectionMatrix();
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(target);
    return () => observer.disconnect();
  }, [gl, targetRef]);

  return null;
}

export default function ThreeViewer({ modelUrl, fallback }: ThreeViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  if (!modelUrl) return fallback || null;

  return (
    <div
      ref={mountRef}
      className="pdp-viewer-panel w-full h-full min-h-0"
      role="img"
      aria-label="Interactive 3D product preview"
    >
      <ThreeErrorBoundary fallback={fallback}>
        <Suspense
          fallback={
            <div
              className="absolute inset-0 flex items-center justify-center"
              role="status"
              aria-live="polite"
              aria-label="Loading 3D model"
            >
              <div className="pdp-viewer-spinner" aria-hidden="true"></div>
            </div>
          }
        >
          <Canvas camera={{ position: [0, 2, 5], fov: 50 }} aria-hidden="true">
            <ResizeRenderer targetRef={mountRef} />
            <ambientLight intensity={0.5} />
            <spotLight
              position={[10, 10, 10]}
              angle={0.15}
              penumbra={1}
              intensity={1}
              castShadow
            />
            <Environment preset="city" />

            <Model url={modelUrl} />

            <ContactShadows
              position={[0, -1, 0]}
              opacity={0.4}
              scale={10}
              blur={2}
              far={4}
            />
            <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} />
          </Canvas>
        </Suspense>
      </ThreeErrorBoundary>
    </div>
  );
}
