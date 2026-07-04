"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";

import {
  feasibilityCommands,
  getFeasibilityCommand,
  type FeasibilityCommandId,
} from "../lib/commands/registry";
import {
  projectToScreen,
  screenToProject,
  snapDrawingPoint,
  zoomTransformAt,
  type CanvasTransform,
  type SnapKind,
} from "../lib/geometry/snapping";
import { createOpen3dProject } from "../model/project";
import type { Open3dPoint, Open3dProject } from "../model/types";
import type { Open3dCatalogItem, Open3dPlacedConfiguration } from "../catalog/catalogTypes";
import { addOpen3dWall } from "../model/actions/walls";
import { proofCatalogItem } from "../catalog/proofCatalog";

const INITIAL_TRANSFORM: CanvasTransform = {
  origin: { x: -4000, y: -2500 },
  scale: 0.1,
};

interface PanSession {
  pointerId: number;
  screen: Open3dPoint;
  origin: Open3dPoint;
}

export interface CanvasPlacement {
  item: Open3dCatalogItem;
  snapshot: Open3dPlacedConfiguration;
}

export interface FeasibilityCanvasProps {
  placedItems?: CanvasPlacement[];
}

type DrawingState = "ready" | "drawing" | "panning";
type DrawingOutcome = "none" | "started" | "committed" | "cancelled" | "ignored";

function canvasPoint(
  event: Pick<ReactPointerEvent<HTMLCanvasElement>, "clientX" | "clientY" | "currentTarget">,
): Open3dPoint {
  const rect = event.currentTarget.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

export function FeasibilityCanvas({ placedItems = [] }: FeasibilityCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerIdRef = useRef<number | null>(null);
  const panRef = useRef<PanSession | null>(null);
  const spacePressedRef = useRef(false);
  const latencySamples = useRef<number[]>([]);
  const [project, setProject] = useState<Open3dProject>(() =>
    createOpen3dProject({ name: "Feasibility project" }),
  );
  const [history, setHistory] = useState<Open3dProject[]>([]);
  const [start, setStart] = useState<Open3dPoint | null>(null);
  const [preview, setPreview] = useState<Open3dPoint | null>(null);
  const [snapKind, setSnapKind] = useState<SnapKind>("none");
  const [assetFailed, setAssetFailed] = useState(false);
  const [latencyP95, setLatencyP95] = useState<number | null>(null);
  const [transform, setTransform] = useState<CanvasTransform>(INITIAL_TRANSFORM);
  const [canvasSize, setCanvasSize] = useState({ width: 1, height: 1 });
  const [activeCommandId, setActiveCommandId] =
    useState<FeasibilityCommandId>("draw-wall");
  const [drawingState, setDrawingState] = useState<DrawingState>("ready");
  const [drawingOutcome, setDrawingOutcome] = useState<DrawingOutcome>("none");
  const [commandSearch, setCommandSearch] = useState("");

  const activeFloor = project.floors.find(
    (floor) => floor.id === project.activeFloorId,
  ) ?? project.floors[0];

  const commandResults = useMemo(() => {
    const query = commandSearch.trim().toLowerCase();
    if (!query) return feasibilityCommands;
    return feasibilityCommands.filter((command) =>
      command.label.toLowerCase().includes(query)
      || command.id.includes(query)
      || command.shortcut.toLowerCase().includes(query)
    );
  }, [commandSearch]);

  const releasePointer = useCallback(() => {
    const canvas = canvasRef.current;
    const pointerId = pointerIdRef.current;
    if (canvas && pointerId !== null && canvas.hasPointerCapture(pointerId)) {
      canvas.releasePointerCapture(pointerId);
    }
    pointerIdRef.current = null;
    panRef.current = null;
  }, []);

  const cancel = useCallback(() => {
    releasePointer();
    setStart(null);
    setPreview(null);
    setSnapKind("none");
    setDrawingState("ready");
    setDrawingOutcome("cancelled");
  }, [releasePointer]);

  const undo = useCallback(() => {
    const previous = history.at(-1);
    if (!previous) return false;
    setProject(previous);
    setHistory((past) => past.slice(0, -1));
    cancel();
    return true;
  }, [cancel, history]);

  const runCommand = useCallback((id: FeasibilityCommandId) => {
    const command = getFeasibilityCommand(id);
    const outcome = command.execute({
      activateDrawWall: () => {
        setActiveCommandId("draw-wall");
        cancel();
      },
      cancel,
      undo,
      zoomBy: (factor) => {
        const center = { x: canvasSize.width / 2, y: canvasSize.height / 2 };
        setTransform((current) => zoomTransformAt(current, center, factor));
      },
      resetZoom: () => setTransform(INITIAL_TRANSFORM),
    });
    if (outcome.status !== "unavailable" && id !== "cancel") {
      setDrawingOutcome("none");
    }
    canvasRef.current?.focus();
  }, [cancel, canvasSize, undo]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") spacePressedRef.current = true;
      if (event.key.toLowerCase() === "w" && !event.ctrlKey && !event.metaKey) {
        runCommand("draw-wall");
      }
      if (event.key === "Escape") runCommand("cancel");
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        runCommand("undo");
      }
      if (event.key === "0") runCommand("zoom-reset");
      if (event.key === "+" || event.key === "=") runCommand("zoom-in");
      if (event.key === "-") runCommand("zoom-out");
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === "Space") spacePressedRef.current = false;
    };
    const onBlur = () => {
      spacePressedRef.current = false;
      cancel();
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      cancel();
    };
  }, [cancel, runCommand]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(([entry]) => {
      setCanvasSize({
        width: Math.max(1, entry.contentRect.width),
        height: Math.max(1, entry.contentRect.height),
      });
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.round(canvasSize.width * ratio);
    canvas.height = Math.round(canvasSize.height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const tokens = getComputedStyle(canvas);
    context.fillStyle = tokens.getPropertyValue("--surface-page").trim();
    context.fillRect(0, 0, canvasSize.width, canvasSize.height);
    context.strokeStyle = tokens.getPropertyValue("--border-soft").trim();
    context.lineWidth = 1;
    const gridMm = 500;
    const topLeft = screenToProject({ x: 0, y: 0 }, transform);
    const firstX = Math.floor(topLeft.x / gridMm) * gridMm;
    const firstY = Math.floor(topLeft.y / gridMm) * gridMm;
    for (let x = firstX; ; x += gridMm) {
      const screenX = projectToScreen({ x, y: 0 }, transform).x;
      if (screenX > canvasSize.width) break;
      context.beginPath();
      context.moveTo(screenX, 0);
      context.lineTo(screenX, canvasSize.height);
      context.stroke();
    }
    for (let y = firstY; ; y += gridMm) {
      const screenY = projectToScreen({ x: 0, y }, transform).y;
      if (screenY > canvasSize.height) break;
      context.beginPath();
      context.moveTo(0, screenY);
      context.lineTo(canvasSize.width, screenY);
      context.stroke();
    }
    context.lineCap = "round";
    context.lineWidth = 5;
    context.strokeStyle = tokens.getPropertyValue("--color-block-wall").trim();
    for (const wall of activeFloor.walls) {
      const a = projectToScreen(wall.start, transform);
      const b = projectToScreen(wall.end, transform);
      context.beginPath();
      context.moveTo(a.x, a.y);
      context.lineTo(b.x, b.y);
      context.stroke();
    }
    if (start && preview) {
      const a = projectToScreen(start, transform);
      const b = projectToScreen(preview, transform);
      context.strokeStyle = tokens.getPropertyValue("--color-primary").trim();
      context.setLineDash([8, 6]);
      context.beginPath();
      context.moveTo(a.x, a.y);
      context.lineTo(b.x, b.y);
      context.stroke();
      context.setLineDash([]);
      context.fillStyle = tokens.getPropertyValue("--color-accent").trim();
      context.beginPath();
      context.arc(b.x, b.y, snapKind === "none" ? 4 : 7, 0, Math.PI * 2);
      context.fill();
    }
  }, [activeFloor.walls, canvasSize, preview, snapKind, start, transform]);

  const pointFromEvent = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const raw = screenToProject(canvasPoint(event), transform);
    const endpoints = activeFloor.walls.flatMap((wall) => [wall.start, wall.end]);
    const endpointTargets = activeFloor.walls.flatMap((wall) => [
      { id: `${wall.id}:start`, point: wall.start },
      { id: `${wall.id}:end`, point: wall.end },
    ]);
    return snapDrawingPoint({
      raw,
      start,
      endpoints,
      endpointTargets,
      zoom: transform.scale,
      suppress: event.altKey,
    });
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (pointerIdRef.current !== null) return;
    event.currentTarget.focus();
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerIdRef.current = event.pointerId;
    if (event.button === 1 || spacePressedRef.current) {
      panRef.current = {
        pointerId: event.pointerId,
        screen: canvasPoint(event),
        origin: transform.origin,
      };
      setDrawingState("panning");
      setDrawingOutcome("none");
      return;
    }
    if (event.button !== 0 || activeCommandId !== "draw-wall") {
      setDrawingOutcome("ignored");
      return;
    }
    const snapped = pointFromEvent(event);
    if (!start) {
      setStart(snapped.point);
      setPreview(snapped.point);
      setSnapKind(snapped.kind);
      setDrawingState("drawing");
      setDrawingOutcome("started");
      return;
    }
    if (Math.hypot(snapped.point.x - start.x, snapped.point.y - start.y) < 1) {
      setDrawingOutcome("ignored");
      return;
    }
    setHistory((past) => [...past, project]);
    setProject((current) =>
      addOpen3dWall(current, { start, end: snapped.point }, () => crypto.randomUUID()),
    );
    setStart(snapped.point);
    setPreview(snapped.point);
    setSnapKind(snapped.kind);
    setDrawingState("drawing");
    setDrawingOutcome("committed");
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const pan = panRef.current;
    if (pan?.pointerId === event.pointerId) {
      const screen = canvasPoint(event);
      setTransform((current) => ({
        ...current,
        origin: {
          x: pan.origin.x - (screen.x - pan.screen.x) / current.scale,
          y: pan.origin.y - (screen.y - pan.screen.y) / current.scale,
        },
      }));
      return;
    }
    if (!start) return;
    const startedAt = performance.now();
    const snapped = pointFromEvent(event);
    setPreview(snapped.point);
    setSnapKind(snapped.kind);
    requestAnimationFrame(() => {
      const samples = [...latencySamples.current, performance.now() - startedAt].slice(-60);
      latencySamples.current = samples;
      const ordered = [...samples].sort((left, right) => left - right);
      setLatencyP95(ordered[Math.max(0, Math.ceil(ordered.length * 0.95) - 1)]);
    });
  };

  const onPointerEnd = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (pointerIdRef.current !== event.pointerId) return;
    if (panRef.current) {
      setDrawingState(start ? "drawing" : "ready");
    }
    releasePointer();
  };

  const onWheel = (event: ReactWheelEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const screenPoint = canvasPoint(event);
    const factor = Math.exp(-event.deltaY * 0.0015);
    setTransform((current) => zoomTransformAt(current, screenPoint, factor));
  };

  return (
    <main className="feasibility-shell" aria-label="Open3D React feasibility editor">
      <header className="command-strip" aria-label="Drawing commands">
        <div className="proof-heading">
          <strong>React input proof</strong>
          <span>Internal · no production routes</span>
        </div>
        <div className="command-actions" role="toolbar" aria-label="Canvas tools">
          {feasibilityCommands.map((command) => (
            <button
              key={command.id}
              type="button"
              aria-pressed={command.id === "draw-wall"
                ? activeCommandId === "draw-wall"
                : undefined}
              disabled={command.id === "undo" && history.length === 0}
              onClick={() => runCommand(command.id)}
            >
              {command.label} <kbd>{command.shortcut}</kbd>
            </button>
          ))}
        </div>
        <div className="command-search" aria-label="Searchable commands">
          <label htmlFor="feasibility-command-search">Command</label>
          <input
            id="feasibility-command-search"
            type="search"
            aria-label="Search commands"
            value={commandSearch}
            onChange={(event) => setCommandSearch(event.currentTarget.value)}
            placeholder="Search commands"
          />
          <div className="command-results">
            {commandResults.map((command) => (
              <button
                key={command.id}
                type="button"
                aria-label={`${command.label} command result`}
                onClick={() => runCommand(command.id)}
              >
                {command.label}
              </button>
            ))}
          </div>
        </div>
      </header>
      <section className="canvas-region" aria-label="Drawing canvas">
        <canvas
          ref={canvasRef}
          tabIndex={0}
          aria-label="Floor plan drawing surface"
          aria-describedby="canvas-help canvas-status"
          aria-keyshortcuts="W Escape Control+Z Meta+Z 0 + -"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={(event) => {
            onPointerEnd(event);
            cancel();
          }}
          onLostPointerCapture={(event) => {
            if (pointerIdRef.current === event.pointerId) cancel();
          }}
          onWheel={onWheel}
          onContextMenu={(event) => {
            event.preventDefault();
            cancel();
          }}
        >
          Floor plan for {project.name}, with {activeFloor.walls.length} walls.
          Use the geometry summary following this canvas for exact coordinates.
        </canvas>
        {placedItems.length > 0 && (
          <div className="canvas-placement-layer" aria-label="Placed catalog items" aria-hidden="true">
            {placedItems.map(({ item, snapshot }) => {
              const screenPoint = projectToScreen(snapshot.position, transform);
              return (
                <div
                  key={snapshot.placementId}
                  className="canvas-placement-marker"
                  style={{
                    left: `${screenPoint.x}px`,
                    top: `${screenPoint.y}px`,
                  }}
                >
                  <span className="canvas-placement-marker__name">{item.shortName}</span>
                  <span className="canvas-placement-marker__meta">
                    {Math.round(snapshot.position.x)} / {Math.round(snapshot.position.y)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
        <p className="canvas-help" id="canvas-help">
          Click to draw. Hold Space or middle-drag to pan. Wheel to zoom. Alt bypasses snapping.
        </p>
        <details className="geometry-summary">
          <summary>
            Project geometry ({activeFloor.walls.length} {activeFloor.walls.length === 1 ? "wall" : "walls"})
          </summary>
          <div className="geometry-summary-content">
            <p>
              <strong>{project.name}</strong>
              <span>Active floor: {activeFloor.name}</span>
            </p>
            {activeFloor.walls.length === 0 ? (
              <p>No walls drawn.</p>
            ) : (
              <table>
                <caption className="sr-only">Wall coordinates in millimetres</caption>
                <thead>
                  <tr>
                    <th scope="col">Wall</th>
                    <th scope="col">Start X, Y</th>
                    <th scope="col">End X, Y</th>
                    <th scope="col">Length</th>
                  </tr>
                </thead>
                <tbody>
                  {activeFloor.walls.map((wall, index) => (
                    <tr key={wall.id}>
                      <th scope="row">{index + 1}</th>
                      <td>{Math.round(wall.start.x)}, {Math.round(wall.start.y)}</td>
                      <td>{Math.round(wall.end.x)}, {Math.round(wall.end.y)}</td>
                      <td>
                        {Math.round(Math.hypot(
                          wall.end.x - wall.start.x,
                          wall.end.y - wall.start.y,
                        ))} mm
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </details>
      </section>
      <aside className="diagnostics" aria-label="Feasibility diagnostics">
        <div id="canvas-status" aria-live="polite">
          <strong>{drawingState === "drawing" ? "Drawing wall" : drawingState === "panning" ? "Panning" : "Ready"}</strong>
          <span>Snap: {snapKind}</span>
          <span>Outcome: {drawingOutcome}</span>
          <span>Walls: {activeFloor.walls.length}</span>
          <span>Placed: {placedItems.length}</span>
          <span>Zoom: {Math.round(transform.scale * 1000)}%</span>
          <span>{canvasSize.width < 640 ? "Compact · pan/zoom enabled" : "Full workspace"}</span>
          <span>Pointer p95: {latencyP95 === null ? "—" : `${latencyP95.toFixed(1)} ms`}</span>
        </div>
        <figure>
          {assetFailed ? (
            <div className="asset-fallback" aria-label="Proof chair fallback" />
          ) : (
            <Image
              src={proofCatalogItem.previewUrl}
              alt="Proof chair catalog asset"
              width={36}
              height={36}
              unoptimized
              onError={() => setAssetFailed(true)}
            />
          )}
          <figcaption>{proofCatalogItem.id} · {proofCatalogItem.widthMm} mm</figcaption>
        </figure>
      </aside>
      <span className="sr-only">{getFeasibilityCommand("draw-wall").label} is active.</span>
    </main>
  );
}
