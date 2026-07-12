/**
 * Lazy 3D Viewer Module
 * 
 * This module provides lazy loading for the 3D viewer to avoid eager mounting
 * on default planner load. The 3D view is only loaded when explicitly requested.
 */

import React, { lazy, Suspense } from "react";
import type { ReactNode } from "react";
import type { PlannerProject } from "@/features/planner/project/model/types";
import styles from "./threeLazyViewer.module.css";
import { readThreeThemeColor } from "@/features/planner/project/shared/readThemeColor";
import { PLANNER_ORBIT_DEFAULT_ENABLED } from "./orbitDefaults";

export {
  PLANNER_ORBIT_DEFAULT_ENABLED,
  getPlannerViewerControlProps,
} from "./orbitDefaults";

/**
 * Loading fallback component for lazy-loaded 3D viewer.
 */
function ViewerLoadingFallback({ message = "Loading 3D viewer..." }: { message?: string }) {
  return (
    <div className={styles.loading}>
      {message}
    </div>
  );
}

/**
 * Error fallback when 3D viewer fails to load.
 */
function ViewerErrorFallback({
  error,
  onRetry,
}: {
  error: Error | null;
  onRetry?: () => void;
}) {
  return (
    <div className={styles.error}>
      <p>Failed to load 3D viewer</p>
      {error && <p className={styles.errorDetail}>{error.message}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          className={styles.retryButton}
        >
          Retry
        </button>
      )}
    </div>
  );
}

/**
 * Props for the Lazy3DViewer component.
 */
export interface Lazy3DViewerProps {
  /** The project data to render */
  projectData?: Pick<PlannerProject, "id" | "name" | "floors">;
  /** Optional CSS className */
  className?: string;
  /** Callback when 3D view is ready */
  onReady?: () => void;
  /** Callback when an error occurs */
  onError?: (error: Error) => void;
  /** Loading message */
  loadingMessage?: string;
  /** Enable shadows (default: true) */
  enableShadows?: boolean;
  /** Enable orbit controls (default: true) */
  enableControls?: boolean;
  /** Background color */
  backgroundColor?: string; // prefer semantic via readThreeThemeColor
}

// Lazy-loaded 3D viewer component
// In production, this would import from a real Three.js component
const Lazy3DViewerInner = lazy(() =>
  import(/* webpackChunkName: "three-viewer" */ "./ThreeViewerInner").then((mod) => ({
    default: mod.ThreeViewerInner,
  })),
);

/**
 * Error boundary state.
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary for catching 3D viewer errors.
 */
class ViewerErrorBoundary extends React.Component<
  { children: ReactNode; onError?: (error: Error) => void },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode; onError?: (error: Error) => void }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error): void {
    this.props.onError?.(error);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return <ViewerErrorFallback error={this.state.error} onRetry={() => this.setState({ hasError: false, error: null })} />;
    }
    return this.props.children;
  }
}

/**
 * Lazy3DViewer - A lazy-loading wrapper for the 3D viewer.
 * 
 * This component does NOT mount on default planner load. It must be
 * explicitly rendered when the user requests 3D view.
 * 
 * Usage:
 * ```tsx
 * import { Lazy3DViewer } from "@/features/planner/3d/ThreeLazyViewer";
 * 
 * // Only render when user clicks "View 3D" button
 * {show3DView && <Lazy3DViewer projectData={project} />}
 * ```
 */
export function Lazy3DViewer(props: Lazy3DViewerProps): React.JSX.Element {
  const {
    projectData,
    className,
    onReady,
    onError,
    loadingMessage = "Loading 3D viewer...",
    enableShadows = true,
    enableControls = PLANNER_ORBIT_DEFAULT_ENABLED,
    backgroundColor,
  } = props;

  // THREE.Color rejects CSS custom properties — always resolve to hex/rgb.
  const resolvedBg = (() => {
    if (!backgroundColor) {
      return readThreeThemeColor("--surface-page", "#ffffff");
    }
    if (backgroundColor.startsWith("--")) {
      return readThreeThemeColor(backgroundColor, "#ffffff");
    }
    if (backgroundColor.includes("var(")) {
      const token = backgroundColor.match(/var\(\s*(--[^,\s)]+)/)?.[1];
      return token
        ? readThreeThemeColor(token, "#ffffff")
        : readThreeThemeColor("--surface-page", "#ffffff");
    }
    return backgroundColor;
  })();
  return (
    <div
      className={`${styles.viewerRoot} ${className || ""}`}
      data-testid="planner-3d-canvas"
      style={{ backgroundColor: resolvedBg }}
    >
      <ViewerErrorBoundary onError={onError}>
        <Suspense fallback={<ViewerLoadingFallback message={loadingMessage} />}>
          <Lazy3DViewerInner
            projectData={projectData}
            enableShadows={enableShadows}
            enableControls={enableControls}
            backgroundColor={resolvedBg}
            onReady={onReady}
          />
        </Suspense>
      </ViewerErrorBoundary>
    </div>
  );
}

// Capability probes used by unit tests and preload guards.
export interface PreloadCheckResult {
  canLoad: boolean;
  reasons: string[];
}

export function isWebGLSupported(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") return false;

  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    return gl !== null && gl !== undefined;
  } catch {
    return false;
  }
}

export function isDeviceCapable(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;

  const cores = navigator.hardwareConcurrency ?? 0;
  if (cores < 2) return false;

  const memory = (navigator as { deviceMemory?: number }).deviceMemory ?? Infinity;
  if (memory < 2) return false;

  return true;
}

export function checkCanLoad3D(): PreloadCheckResult {
  const reasons: string[] = [];

  if (!isWebGLSupported()) {
    reasons.push("WebGL is not supported in this browser");
  }

  if (!isDeviceCapable()) {
    reasons.push("Device does not meet minimum requirements");
  }

  return {
    canLoad: reasons.length === 0,
    reasons,
  };
}
