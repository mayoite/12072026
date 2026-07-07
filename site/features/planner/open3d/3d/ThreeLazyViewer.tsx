/**
 * Lazy 3D Viewer Module
 * 
 * This module provides lazy loading for the 3D viewer to avoid eager mounting
 * on default planner load. The 3D view is only loaded when explicitly requested.
 */

import React, { lazy, Suspense } from "react";
import type { ReactNode } from "react";
import type { Open3dProject } from "../model/types";
import styles from "./threeLazyViewer.module.css";
import { readThreeThemeColor } from "../shared/readThemeColor";

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
  projectData?: Pick<Open3dProject, "id" | "name" | "floors">;
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
 * import { Lazy3DViewer } from "./three-lazy/Lazy3DViewer";
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
    enableControls = true,
    backgroundColor,
  } = props;

  const resolvedBg = backgroundColor ?? readThreeThemeColor("--surface-page", "#ffffff");
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
            backgroundColor={backgroundColor}
            onReady={onReady}
          />
        </Suspense>
      </ViewerErrorBoundary>
    </div>
  );
}

// isWebGLSupported / isDeviceCapable / checkCanLoad3D + PreloadCheckResult removed (dead exports, never called in prod). Clean for PLAN-FAIL-0408.
