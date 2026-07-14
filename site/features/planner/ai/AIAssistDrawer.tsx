"use client";

import { useCallback, useRef, useState } from "react";
import { CaretDown as ChevronDown, CircleNotch as Loader2, Chat as MessageSquare, Sparkle as Sparkles, MagicWand as Wand2 } from "@phosphor-icons/react";


import { CatalogBlockPreview } from "@/features/planner/catalog-api/CatalogBlockPreview";
import { PLANNER_CATALOG_ITEMS } from "@/features/planner/catalog-api/workspaceCatalog";

import {
  PLANNER_PRIMARY_PURPOSE_OPTIONS,
  type PlannerPrimaryPurpose,
} from "@/features/planner/onboarding/projectSetup";
import { usePlannerWorkspaceStore } from "@/features/planner/cloud-store/workspaceStore";

import { AiAdvisorChatPane } from "./AiAdvisorChatPane";
import { applySuggestedLayout } from "./applySuggestedLayout";
import {
  CATALOG_TIER_LABELS,
  resolveSpaceSuggestDefaults,
} from "./aiAdvisorConfig";
import { matchCatalogForPlacements } from "./catalogMatch";
import { LayoutPreviewSvg } from "./LayoutPreviewSvg";
import { suggestLayout, suggestLayoutGridPack } from "./spaceSuggest";
import type { PlannerProjectMetadata } from "@/features/planner/onboarding/projectSetup";
import type { AIProviderClassification } from "./aiStatus";

import type { CatalogMatchResult, SuggestedLayoutJson } from "./types";
import type { WorkspaceAiBridge } from "./workspaceAiBridge";

type AiAssistTab = "suggest-layout" | "match-catalog" | "chat";

export type AIAssistDrawerProps = {
  editor?: null;
  /** When false, only the header row is shown until expanded. */
  defaultExpanded?: boolean;
  embedded?: boolean;
  defaultTab?: AiAssistTab;
  /** Live document bridge — required for place/scan against editor project. */
  workspaceBridge?: WorkspaceAiBridge;
  /** Fills a workspace shell panel — no extra drawer chrome. */
  panelFill?: boolean;
};

export function AIAssistDrawer({
  editor,
  defaultExpanded = true,
  embedded = true,
  defaultTab = "suggest-layout",
  workspaceBridge,
  panelFill = false,
}: AIAssistDrawerProps) {
  const projectMetadata = usePlannerWorkspaceStore((s) => s.projectMetadata);

  const [expanded, setExpanded] = useState(defaultExpanded);
  const [tab, setTab] = useState<AiAssistTab>(defaultTab);
  const placementCount = workspaceBridge?.placementCount ?? 0;

  const [matchBusy, setMatchBusy] = useState(false);
  const [matchResults, setMatchResults] = useState<CatalogMatchResult[]>([]);
  const [matchScanned, setMatchScanned] = useState(false);

  const handleScanCanvas = useCallback(() => {
    setMatchBusy(true);
    const placements = workspaceBridge?.getPlacements() ?? [];
    setMatchResults(matchCatalogForPlacements(placements));
    setMatchScanned(true);
    setMatchBusy(false);
  }, [workspaceBridge]);

  const handleApplyCatalogMatch = useCallback(
    (shapeId: string, catalogItemId: string) => {
      workspaceBridge?.replaceCatalogMatch(shapeId, catalogItemId);
    },
    [workspaceBridge],
  );

  const emptyCanvasHint = placementCount === 0;

  const showBody = embedded || expanded;

  return (
    <section
      className={`pw-ai-drawer${embedded ? " pw-ai-drawer--embedded" : ""}${panelFill ? " pw-ai-drawer--panel-fill" : ""}`}
      data-expanded={showBody}
      aria-label="AI Assist"
    >
      {!embedded ? (
        <header className="pw-ai-drawer-header">
          <button
            type="button"
            className="pw-ai-drawer-toggle"
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
          >
            <Sparkles size={14} strokeWidth={2} aria-hidden />
            <span>AI Assist</span>
            <ChevronDown
              size={14}
              strokeWidth={2}
              aria-hidden
              className="pw-ai-drawer-chevron"
            />
          </button>
        </header>
      ) : null}

      {showBody ? (
        <div className="pw-ai-drawer-body">
          <div className="pw-segment pw-ai-drawer-tabs" role="tablist" aria-label="AI Assist modes">
            <button
              type="button"
              role="tab"
              className="pw-segment-btn"
              data-active={tab === "suggest-layout"}
              aria-selected={tab === "suggest-layout"}
              onClick={() => setTab("suggest-layout")}
            >
              Suggest
            </button>
            <button
              type="button"
              role="tab"
              className="pw-segment-btn"
              data-active={tab === "match-catalog"}
              aria-selected={tab === "match-catalog"}
              onClick={() => setTab("match-catalog")}
            >
              Match
            </button>
            <button
              type="button"
              role="tab"
              className="pw-segment-btn"
              data-active={tab === "chat"}
              aria-selected={tab === "chat"}
              onClick={() => setTab("chat")}
            >
              <MessageSquare size={12} aria-hidden />
              Chat
            </button>
          </div>

          {tab === "suggest-layout" ? (
            <SuggestLayoutPane
              key={[
                projectMetadata?.completedAt ?? "pending-setup",
                projectMetadata?.seatTarget,
                projectMetadata?.primaryPurpose,
                projectMetadata?.floorAreaSqFt,
              ].join(":")}
              _editor={editor}
              projectMetadata={projectMetadata}
              onApplyLayout={workspaceBridge?.applyLayout}
              onFitCanvas={workspaceBridge?.fitCanvas}
            />
          ) : tab === "match-catalog" ? (
            <div className="pw-ai-drawer-pane" role="tabpanel">
              <p className="pw-ai-drawer-lead">
                Scan furniture on the canvas and get the closest catalog SKU in each price tier.
              </p>

              <button
                type="button"
                className="pw-ai-drawer-primary"
                disabled={matchBusy}
                onClick={handleScanCanvas}
              >
                {matchBusy ? (
                  <Loader2 size={14} className="pw-ai-spin" aria-hidden />
                ) : (
                  <Sparkles size={14} aria-hidden />
                )}
                {matchBusy ? "Scanning…" : "Match catalog"}
              </button>

              {matchScanned && emptyCanvasHint ? (
                <p className="pw-ai-drawer-note">
                  No workstations, chairs, or storage on the canvas yet. Place items from the
                  library first.
                </p>
              ) : null}

              {matchResults.length > 0 ? (
                <ul className="pw-ai-match-list">
                  {matchResults.map((result) => (
                    <li key={result.placement.shapeId} className="pw-ai-match-card">
                      <div className="pw-ai-match-card-head">
                        <strong>{result.placement.label}</strong>
                        <span className="pw-ai-match-kind">{result.placement.kind}</span>
                      </div>
                      <ul className="pw-ai-match-tiers">
                        {result.matches.map((match) => {
                          const catalogItem = PLANNER_CATALOG_ITEMS.find(
                            (item) => item.id === match.catalogItemId,
                          );
                          return (
                            <li key={`${result.placement.shapeId}-${match.catalogItemId}`}>
                              <div className="pw-ai-match-tier">
                                <span className="pw-ai-match-tier-label">
                                  {CATALOG_TIER_LABELS[match.tier]}
                                </span>
                                <div className="pw-ai-match-tier-body">
                                  {catalogItem ? (
                                    <span className="pw-ai-match-thumb" aria-hidden>
                                      <CatalogBlockPreview item={catalogItem} />
                                    </span>
                                  ) : null}
                                  <span className="pw-ai-match-name">{match.name}</span>
                                </div>
                              </div>
                              <button
                                type="button"
                                className="pw-ai-drawer-link"
                                onClick={() =>
                                  handleApplyCatalogMatch(
                                    result.placement.shapeId,
                                    match.catalogItemId,
                                  )
                                }
                              >
                                Use this SKU
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  ))}
                </ul>
              ) : matchScanned && !emptyCanvasHint ? (
                <p className="pw-ai-drawer-note">No matching catalog entries found.</p>
              ) : null}
            </div>
          ) : (
            <AiAdvisorChatPane
              key={projectMetadata?.completedAt ?? "pending-setup"}
              editor={editor}
              projectMetadata={projectMetadata}
              currentShapeCount={placementCount}
            />
          )}
        </div>
      ) : null}
    </section>
  );
}

function SuggestLayoutPane({
  _editor,
  projectMetadata,
  onApplyLayout,
  onFitCanvas,
}: {
  _editor?: null;
  projectMetadata: PlannerProjectMetadata | null;
  onApplyLayout?: (layout: SuggestedLayoutJson) => void;
  onFitCanvas?: () => void;
}) {
  const defaults = resolveSpaceSuggestDefaults(projectMetadata);
  const [seatCount, setSeatCount] = useState(defaults.seatCount);
  const [purpose, setPurpose] = useState<PlannerPrimaryPurpose>(defaults.purpose);
  const [floorAreaSqFt, setFloorAreaSqFt] = useState(defaults.floorAreaSqFt);
  const [layoutBusy, setLayoutBusy] = useState(false);
  const [layoutError, setLayoutError] = useState<string | null>(null);
  const [previewLayout, setPreviewLayout] = useState<SuggestedLayoutJson | null>(null);
  const [aiStatus, setAiStatus] = useState<AIProviderClassification | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const userActionTimestampRef = useRef<number>(0);

  const handleCancelLayout = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const handleSuggestLayout = useCallback(async () => {
    if (!Number.isFinite(seatCount) || seatCount < 1) {
      setLayoutError("Enter how many people you need to seat.");
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    userActionTimestampRef.current = Date.now();
    setLayoutBusy(true);
    setLayoutError(null);
    setAiStatus(null);

    try {
      const { layout, usedFallback, status, requestTimestamp } = await suggestLayout(
        {
          seatCount: Math.round(seatCount),
          purpose,
          floorAreaSqFt: floorAreaSqFt > 0 ? Math.round(floorAreaSqFt) : undefined,
        },
        controller.signal,
      );

      setAiStatus(status);

      if (requestTimestamp < userActionTimestampRef.current) {
        setLayoutError("Request was cancelled or superseded by newer action.");
        return;
      }

      setPreviewLayout(layout);
      if (usedFallback) {
        setLayoutError(
          status.kind === "degraded_fallback"
            ? `AI ${status.provider} unavailable — showing grid-packed layout.`
            : status.kind === "invalid_response"
              ? "AI returned invalid layout data — showing grid-packed layout."
            : "AI unavailable — showing grid-packed layout.",
        );
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setLayoutError("Cancelled.");
        setAiStatus({ kind: "request_aborted", reason: "User cancelled", timestamp: Date.now() });
      } else {
        setPreviewLayout(
          suggestLayoutGridPack({
            seatCount: Math.round(seatCount),
            purpose,
            floorAreaSqFt: floorAreaSqFt > 0 ? Math.round(floorAreaSqFt) : undefined,
          }),
        );
        setLayoutError("AI was unavailable — showing a grid-packed starter layout instead.");
        setAiStatus({
          kind: "hard_failure",
          error: err instanceof Error ? err.message : "Unknown error",
          timestamp: Date.now(),
        });
      }
    } finally {
      abortRef.current = null;
      setLayoutBusy(false);
    }
  }, [floorAreaSqFt, purpose, seatCount]);

  const handleApplyLayout = useCallback(() => {
    if (!previewLayout) return;
    if (onApplyLayout) {
      onApplyLayout(previewLayout);
      onFitCanvas?.();
    } else {
      applySuggestedLayout(null, previewLayout);
    }
    setLayoutError(null);
  }, [onApplyLayout, onFitCanvas, previewLayout]);

  return (
    <div className="pw-ai-drawer-pane" role="tabpanel">
      <p className="pw-ai-drawer-lead">
        Describe your support office and we will place walls, zones, and furniture on the canvas.
        Values start from your project setup.
      </p>

      <div className="pw-ai-form-group">
        <label className="pw-ai-form-label" htmlFor="ai-seat-count">
          Seat count
        </label>
        <input
          id="ai-seat-count"
          className="pw-ai-form-input"
          type="number"
          min={1}
          max={500}
          value={seatCount}
          onChange={(event) => setSeatCount(Number(event.target.value))}
        />
      </div>

      <div className="pw-ai-form-group">
        <label className="pw-ai-form-label" htmlFor="ai-room-purpose">
          Room purpose
        </label>
        <select
          id="ai-room-purpose"
          className="pw-ai-form-select"
          value={purpose}
          onChange={(event) => setPurpose(event.target.value as PlannerPrimaryPurpose)}
        >
          {PLANNER_PRIMARY_PURPOSE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="pw-ai-form-group">
        <label className="pw-ai-form-label" htmlFor="ai-floor-area">
          Floor area (sq ft)
        </label>
        <input
          id="ai-floor-area"
          className="pw-ai-form-input"
          type="number"
          min={100}
          value={floorAreaSqFt}
          onChange={(event) => setFloorAreaSqFt(Number(event.target.value))}
        />
      </div>

      {layoutError ? <p className="pw-ai-drawer-note pw-ai-drawer-note--warn">{layoutError}</p> : null}

      {aiStatus ? (
        <p className="pw-ai-drawer-note pw-ai-drawer-note--status">
          {aiStatus.kind === "live_success" && `Live success from ${aiStatus.provider}`}
          {aiStatus.kind === "degraded_fallback" && `Degraded: ${aiStatus.reason}`}
          {aiStatus.kind === "request_aborted" && `Aborted: ${aiStatus.reason}`}
          {aiStatus.kind === "invalid_response" && `Invalid response: ${aiStatus.error}`}
          {aiStatus.kind === "hard_failure" && `Hard failure: ${aiStatus.error}`}
        </p>
      ) : null}

      <button
        type="button"
        className="pw-ai-drawer-primary"
        disabled={false}
        onClick={() => layoutBusy ? handleCancelLayout() : void handleSuggestLayout()}
        aria-busy={layoutBusy}
      >
        {layoutBusy ? (
          <Loader2 size={14} className="pw-ai-spin" aria-hidden />
        ) : (
          <Wand2 size={14} aria-hidden />
        )}
        {layoutBusy ? "Cancel" : "Suggest layout"}
      </button>

      {previewLayout ? (
        <div className="pw-ai-drawer-result">
          <LayoutPreviewSvg layout={previewLayout} />
          <p className="pw-ai-drawer-summary">{previewLayout.summary}</p>
          <p className="pw-ai-drawer-meta">
            {previewLayout.furniture.length} furniture · {previewLayout.zones.length} zones ·{" "}
            {previewLayout.source === "llm" ? "AI" : "grid pack"}
          </p>
          <button
            type="button"
            className="pw-ai-drawer-secondary"
            disabled={!previewLayout}
            onClick={handleApplyLayout}
          >
            Apply to canvas
          </button>
        </div>
      ) : null}
    </div>
  );
}
