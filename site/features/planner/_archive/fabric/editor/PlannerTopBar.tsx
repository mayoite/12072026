"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FileArrowUp as FileUp, FolderOpen, Question as HelpCircle, Layout as LayoutTemplate, List as Menu, DotsThree as MoreHorizontal, DotsThreeVertical as MoreVertical, FloppyDisk as Save, Sparkle as Sparkles } from "@phosphor-icons/react";

import { PlannerThemeToggle } from "@/features/planner/components/PlannerThemeToggle";
import { useTheme } from "@/features/planner/components/WorkspaceThemeProvider";
import { OneAndOnlyLogo } from "@/components/ui/Logo";
import type { PlannerSaveStatus } from "@/features/planner/hooks/usePlannerAutosave";
import type { PlannerEnvelopeStatus } from "@/features/planner/hooks/usePlannerFabricAutosave";
import { PlannerSaveIndicator } from "@/features/planner/ui/PlannerSaveIndicator";
import { PlannerStepBar } from "@/features/planner/editor/PlannerStepBar";
import type { PlannerStep } from "@/features/planner/editor/plannerStep";
import { Tooltip } from "@/features/planner/ui/Tooltip";

const TOOLBAR_BUTTON_CLASS = "pw-icon-btn min-w-[var(--pw-touch-target)] min-h-[var(--pw-touch-target)] focus-visible:ring-2 focus-visible:ring-primary";

interface PlannerTopBarProps {
  guestMode: boolean;
  planName: string;
  plannerStep: PlannerStep;
  disabledSteps: Partial<Record<PlannerStep, boolean>>;
  onPlannerStepChange: (step: PlannerStep) => void;
  saveStatus: PlannerSaveStatus;
  saveEnvelopeStatus?: PlannerEnvelopeStatus;
  lastSavedAt: string | null;
  onRetrySave: () => void;
  onOpenSession: () => void;
  onSaveDraft: () => void;
  onImport: () => void;
  onUploadFloorPlan?: () => void;
  onOpenTemplates: () => void;
  onOpenAi: () => void;
  isOnline?: boolean;
}

export function PlannerTopBar({
  guestMode,
  planName,
  plannerStep,
  disabledSteps,
  onPlannerStepChange,
  saveStatus,
  saveEnvelopeStatus,
  lastSavedAt,
  onRetrySave,
  onOpenSession,
  onSaveDraft,
  onImport,
  onUploadFloorPlan,
  onOpenTemplates,
  onOpenAi,
  isOnline = true,
}: PlannerTopBarProps) {
  const { resolvedTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [menuOpen]);

  return (
    <header className="pw-topbar h-12 min-h-12 md:h-auto md:min-h-[var(--pw-topbar-h)]" aria-label="Planner workspace">
      <div className="md:hidden h-12 border-b border-soft bg-panel px-2">
        <Tooltip content="Open plan menu" side="bottom">
          <button
            type="button"
            className={`inline-flex ${TOOLBAR_BUTTON_CLASS}`}
            onClick={onOpenSession}
            aria-label="Open plan menu"
          >
            <Menu size={20} aria-hidden />
          </button>
        </Tooltip>
        <p className="truncate max-w-[8.75rem] text-sm font-medium">{planName.trim() || "Workspace Planner"}</p>
        <div className="gap-1" ref={menuRef}>
          <Tooltip content="Save draft" side="bottom">
            <button
              type="button"
              className="min-w-[var(--pw-touch-target)] min-h-[var(--pw-touch-target)] rounded-lg bg-primary px-3 py-1.5 text-sm text-inverse transition-colors focus-visible:ring-2 focus-visible:ring-primary"
              onClick={onSaveDraft}
            >
              Save
            </button>
          </Tooltip>
          <Tooltip content="More actions" side="bottom">
            <button
              type="button"
              className={`inline-flex ${TOOLBAR_BUTTON_CLASS}`}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              aria-label="More actions"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <MoreVertical size={20} aria-hidden />
            </button>
          </Tooltip>
          {menuOpen && (
            <div className="pw-topbar-menu-panel" role="menu">
              <button type="button" role="menuitem" className={`pw-menu-item ${TOOLBAR_BUTTON_CLASS}`} onClick={() => { onOpenTemplates(); setMenuOpen(false); }}>
                Templates
              </button>
              <button type="button" role="menuitem" className={`pw-menu-item ${TOOLBAR_BUTTON_CLASS}`} onClick={() => { onOpenAi(); setMenuOpen(false); }}>
                AI advisor
              </button>
              <button type="button" role="menuitem" className={`pw-menu-item ${TOOLBAR_BUTTON_CLASS}`} onClick={() => { onImport(); setMenuOpen(false); }}>
                Import JSON
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="md:contents">
      <div className="pw-topbar-brand">
        <Link href="/" className="pw-topbar-logo-link" aria-label="One&Only — home">
          <OneAndOnlyLogo
            variant={resolvedTheme === "dark" ? "white" : "orange"}
            className="pw-topbar-logo"
          />
        </Link>
        <div className="">
          <p className="pw-topbar-title">{planName.trim() || "Workspace Planner"}</p>
          <p className="pw-topbar-sub">
            {guestMode ? "Guest session — saves in this browser" : "Your layout workspace"}
          </p>
        </div>
        {guestMode && <span className="pw-badge">Guest</span>}
      </div>

      <div className="pw-topbar-center">
        <PlannerStepBar
          current={plannerStep}
          disabledSteps={disabledSteps}
          onChange={onPlannerStepChange}
          compact
          showIntro={false}
        />
      </div>

      <div className="pw-topbar-actions">
        <div className="pw-topbar-actions-primary gap-2">
          {!isOnline && (
            <span className="inline-flex gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 typ-caption font-semibold uppercase tracking-[0.1em] text-amber-600 dark:text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              Offline
            </span>
          )}
          <PlannerThemeToggle />
          <PlannerSaveIndicator
            status={saveStatus}
            envelopeStatus={saveEnvelopeStatus}
            lastSavedAt={lastSavedAt}
            onRetry={onRetrySave}
          />
          <Tooltip content="Open layout templates" side="bottom">
            <button
              type="button"
              data-coach="templates"
              onClick={onOpenTemplates}
              className={`pw-icon-btn pw-icon-btn--labeled ${TOOLBAR_BUTTON_CLASS}`}
              aria-label="Open layout templates"
            >
              <LayoutTemplate size={14} aria-hidden />
              <span>Templates</span>
            </button>
          </Tooltip>
          <Tooltip content="Open AI advisor" side="bottom">
            <button
              type="button"
              data-coach="ai-advisor"
              onClick={onOpenAi}
              className={`pw-icon-btn pw-icon-btn--labeled ${TOOLBAR_BUTTON_CLASS}`}
              aria-label="Open AI advisor"
            >
              <Sparkles size={14} aria-hidden />
              <span>AI</span>
            </button>
          </Tooltip>
        </div>

        <div className="pw-topbar-actions-wide">
          <Tooltip content="Open planner help" side="bottom">
            <Link
              href="/planner/help/"
              data-coach="help-link"
              className={`pw-icon-btn pw-icon-btn--labeled ${TOOLBAR_BUTTON_CLASS}`}
              aria-label="Open planner help"
            >
              <HelpCircle size={14} aria-hidden />
              <span>Help</span>
            </Link>
          </Tooltip>
          <Tooltip content="Open plan sessions" side="bottom">
            <button
              type="button"
              className={`pw-icon-btn pw-icon-btn--labeled ${TOOLBAR_BUTTON_CLASS}`}
              onClick={onOpenSession}
              aria-label="Open plan sessions"
            >
              <FolderOpen size={14} aria-hidden />
              <span>Plan Sessions</span>
            </button>
          </Tooltip>
          <Tooltip content="Save local draft" side="bottom">
            <button
              type="button"
              className={`pw-icon-btn pw-icon-btn--labeled ${TOOLBAR_BUTTON_CLASS}`}
              onClick={onSaveDraft}
              aria-label="Save local draft"
            >
              <Save size={14} aria-hidden />
              <span>Save Draft</span>
            </button>
          </Tooltip>
          <Tooltip content="Import planner JSON" side="bottom">
            <button
              type="button"
              className={`pw-icon-btn pw-icon-btn--labeled ${TOOLBAR_BUTTON_CLASS}`}
              onClick={onImport}
              aria-label="Import planner JSON"
            >
              <FileUp size={14} aria-hidden />
              <span>Import</span>
            </button>
          </Tooltip>
        </div>

        <div className="pw-topbar-menu" ref={menuRef}>
          <Tooltip content="More actions" side="bottom">
            <button
              type="button"
              className={`pw-icon-btn ${TOOLBAR_BUTTON_CLASS}`}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              aria-label="More actions"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <MoreHorizontal size={16} aria-hidden />
            </button>
          </Tooltip>
          {menuOpen && (
            <div className="pw-topbar-menu-panel" role="menu">
              <button type="button" role="menuitem" className={`pw-menu-item ${TOOLBAR_BUTTON_CLASS}`} onClick={() => { onOpenTemplates(); setMenuOpen(false); }}>
                Templates
              </button>
              <button type="button" role="menuitem" className={`pw-menu-item ${TOOLBAR_BUTTON_CLASS}`} onClick={() => { onOpenAi(); setMenuOpen(false); }}>
                AI advisor
              </button>
              <button type="button" role="menuitem" className={`pw-menu-item ${TOOLBAR_BUTTON_CLASS}`} onClick={() => { onOpenSession(); setMenuOpen(false); }}>
                Plan sessions
              </button>
              <button type="button" role="menuitem" className={`pw-menu-item ${TOOLBAR_BUTTON_CLASS}`} onClick={() => { onSaveDraft(); setMenuOpen(false); }}>
                Save draft
              </button>
              <button type="button" role="menuitem" className={`pw-menu-item ${TOOLBAR_BUTTON_CLASS}`} onClick={() => { onImport(); setMenuOpen(false); }}>
                Import JSON
              </button>
              {onUploadFloorPlan ? (
                <button
                  type="button"
                  role="menuitem"
                  className={`pw-menu-item ${TOOLBAR_BUTTON_CLASS}`}
                  onClick={() => {
                    onUploadFloorPlan();
                    setMenuOpen(false);
                  }}
                >
                  Upload reference image
                </button>
              ) : null}
              <Link href="/planner/help/" role="menuitem" className="pw-menu-item" onClick={() => setMenuOpen(false)}>
                Help
              </Link>
            </div>
          )}
        </div>
      </div>
      </div>
    </header>
  );
}
