"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Buildings as Building2,
  FileArrowUp,
  Layout,
  MapPin,
  PencilSimpleLine,
  Ruler,
} from "@phosphor-icons/react";

import {
  PLANNER_INDIAN_CITIES,
  PLANNER_PRIMARY_PURPOSE_OPTIONS,
  applyProjectSetup,
  createDefaultProjectSetupDraft,
  markProjectSetupCompleteInStorage,
  metadataToSpaceSuggestInput,
  type PlannerProjectMetadata,
  type PlannerProjectSetupDraft,
  type PlannerPrimaryPurpose,
  type PlannerStartingMode,
  writePlannerStartupIntent,
} from "./projectSetup";
import {
  estimateRoomMm,
  suggestLayoutGridPack,
} from "@/features/planner/ai/spaceSuggest";
import { PLANNER_MAX_CANVAS_MM, PLANNER_MAX_CANVAS_METERS } from "@/features/planner/lib/canvasBounds";
import { usePlannerWorkspaceStore } from "@/features/planner/cloud-store/workspaceStore";



type ProjectSetupStepProps = {
  guestMode?: boolean;
  planId?: string;
  onComplete: (metadata: PlannerProjectMetadata) => void;
};

const PURPOSE_SUMMARIES: Record<PlannerPrimaryPurpose, string> = {
  workstations: "Open desk layout",
  "meeting-rooms": "Collab and conference",
  "executive-cabin": "Private office setup",
  mixed: "Balanced office mix",
};

/** Full-width row: label + control side-by-side (project name). */
const SETUP_FIELD_SHELL_INLINE =
  "flex min-h-[var(--planner-touch-target,2.75rem)] items-center gap-3 rounded-[var(--radius-sm)] border border-[color:var(--border-soft)] bg-[color:var(--surface-soft)] px-4 py-3 transition-[border-color,box-shadow] focus-within:border-[color:var(--color-primary)] focus-within:shadow-[0_0_0_2px_color-mix(in_srgb,var(--color-primary)_16%,transparent)]";
/**
 * Grid cells: label above control so long labels (e.g. Floor area) cannot
 * collapse the input to 0 width in 2–3 column layouts.
 */
const SETUP_FIELD_SHELL_STACK =
  "flex min-h-[var(--planner-touch-target,2.75rem)] min-w-0 flex-col gap-1.5 rounded-[var(--radius-sm)] border border-[color:var(--border-soft)] bg-[color:var(--surface-soft)] px-3 py-2.5 transition-[border-color,box-shadow] focus-within:border-[color:var(--color-primary)] focus-within:shadow-[0_0_0_2px_color-mix(in_srgb,var(--color-primary)_16%,transparent)]";
const SETUP_FIELD_LABEL =
  "shrink-0 text-[0.8125rem] font-semibold text-[color:var(--text-body)]";
const SETUP_FIELD_INPUT =
  "min-h-9 min-w-0 w-full flex-1 border-none bg-transparent text-start text-[0.9375rem] font-medium text-[color:var(--text-strong)] outline-none";
const SETUP_FIELDSET =
  "rounded-[var(--radius-md)] border border-[color:var(--border-soft)] bg-[color:var(--surface-soft)] p-4";

export function ProjectSetupStep({ guestMode = false, planId: _planId, onComplete }: ProjectSetupStepProps) {
  const [draft, setDraft] = useState<PlannerProjectSetupDraft>(() =>
    createDefaultProjectSetupDraft({ guestMode }),
  );
  const [error, setError] = useState<string | null>(null);
  // Template first — blank canvas is the weaker default for first-time guests (UI benchmark).
  const [startingMode, setStartingMode] = useState<PlannerStartingMode>("template");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      setIsHydrated(true);
    }, 0);

    return () => window.clearTimeout(hydrationTimer);
  }, []);

  const updateDraft = <K extends keyof PlannerProjectSetupDraft>(key: K, value: PlannerProjectSetupDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setError(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isHydrated) {
      return;
    }

    const projectName = draft.projectName.trim();
    if (!projectName) {
      setError("Add a project name so you can find this layout later.");
      return;
    }

    if (projectName.length > 255) {
      setError("Project name must be 255 characters or fewer.");
      return;
    }

    if (!Number.isFinite(draft.floorAreaSqFt) || draft.floorAreaSqFt < 100) {
      setError("Enter a floor area of at least 100 sq ft.");
      return;
    }

    if (!Number.isFinite(draft.seatTarget) || draft.seatTarget < 1) {
      setError("Enter how many people you need to seat.");
      return;
    }

    const projectedRoom = estimateRoomMm(Math.round(draft.seatTarget), Math.round(draft.floorAreaSqFt));
    if (projectedRoom.widthMm > PLANNER_MAX_CANVAS_MM || projectedRoom.depthMm > PLANNER_MAX_CANVAS_MM) {
      setError(
        `This floor size exceeds the planner canvas limit (${PLANNER_MAX_CANVAS_METERS} m per side). Reduce floor area or seat count.`,
      );
      return;
    }

    const metadata: PlannerProjectMetadata = {
      ...draft,
      projectName,
      floorAreaSqFt: Math.round(draft.floorAreaSqFt),
      seatTarget: Math.round(draft.seatTarget),
      completedAt: new Date().toISOString(),
    };

    try {
      applyProjectSetup(metadata);
      const { setPendingBootstrapLayout } = usePlannerWorkspaceStore.getState();
      setPendingBootstrapLayout(
        startingMode === "template"
          ? suggestLayoutGridPack(metadataToSpaceSuggestInput(metadata))
          : null,
      );
      writePlannerStartupIntent(startingMode, guestMode, _planId);
      markProjectSetupCompleteInStorage(guestMode, _planId);
    } catch (storageErr) {
      const message =
        storageErr instanceof DOMException && storageErr.name === "QuotaExceededError"
          ? "Your browser storage is full. Clear some space and try again."
          : "Unable to save setup. Please try again.";
      setError(message);
      return;
    }

    onComplete(metadata);
  };

  return (
    <div className="planner-setup-overlay bg-[color:var(--surface-inverse)]/88 backdrop-blur-sm">
      <div className="grid max-h-[min(100dvh,52rem)] max-w-5xl w-full overflow-y-auto rounded-[var(--radius-xl)] border border-[color:var(--border-soft)] bg-[color:var(--surface-panel-strong)] shadow-[var(--shadow-soft)] sm:max-h-none lg:grid-cols-[1fr_1.05fr]">
        <aside className="hidden flex-col gap-8 border-b border-[color:var(--border-soft)] bg-[color:var(--surface-accent-wash)] p-6 sm:flex sm:p-8 lg:border-b-0 lg:border-r">
          <div>
            <p className="typ-eyebrow text-[color:var(--color-bronze-500)]">Project setup</p>
            <h1 className="typ-h2 mt-3 text-[color:var(--text-strong)]">
              Set up your space in <span className="text-accent-italic">30 seconds</span>
            </h1>
            <p className="page-copy-sm max-w-md text-[color:var(--text-muted)]">
              Add the basics once. We size the grid and tailor the planner to this layout.
            </p>
          </div>

          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="scheme-accent-wash h-10 w-10 shrink-0 rounded-xl text-[color:var(--color-primary)]">
                <Building2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="typ-label text-[color:var(--text-strong)]">India-ready defaults</p>
                <p className="typ-caption-lg text-[color:var(--text-muted)]">Local cities and seat counts.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="scheme-accent-wash h-10 w-10 shrink-0 rounded-xl text-[color:var(--color-primary)]">
                <Ruler className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="typ-label text-[color:var(--text-strong)]">Scaled grid</p>
                <p className="typ-caption-lg text-[color:var(--text-muted)]">Auto-tuned to your floor size.</p>
              </div>
            </li>
          </ul>
        </aside>

        <form
          className="flex flex-col gap-4 p-4 sm:gap-5 sm:p-8"
          onSubmit={handleSubmit}
          aria-label="Project setup"
          aria-busy={!isHydrated}
        >
          <div className="sm:hidden">
            <p className="typ-eyebrow text-[color:var(--color-bronze-500)]">Project setup</p>
            <h1 className="typ-h3 mt-2 text-[color:var(--text-strong)]">
              Set up in <span className="text-accent-italic">30 seconds</span>
            </h1>
          </div>
          <div className={SETUP_FIELD_SHELL_INLINE}>
            <label className={SETUP_FIELD_LABEL} htmlFor="project-setup-name">
              Project name
            </label>
            <input
              id="project-setup-name"
              className={`${SETUP_FIELD_INPUT} text-end`}
              placeholder="TVS Bihar Office — 2nd Floor"
              value={draft.projectName}
              onChange={(event) => updateDraft("projectName", event.target.value)}
              autoComplete="organization"
              autoFocus
              maxLength={255}
              aria-describedby={error ? "project-setup-error" : undefined}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className={SETUP_FIELD_SHELL_STACK}>
              <label className={SETUP_FIELD_LABEL} htmlFor="project-setup-city">
                City
              </label>
              <div className="relative min-w-0 w-full">
                <MapPin
                  className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--text-muted)]"
                  aria-hidden="true"
                />
                <select
                  id="project-setup-city"
                  className={`${SETUP_FIELD_INPUT} pl-6`}
                  value={draft.city}
                  onChange={(event) => updateDraft("city", event.target.value)}
                >
                  {PLANNER_INDIAN_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="min-w-0">
              <div className={SETUP_FIELD_SHELL_STACK}>
                <label className={SETUP_FIELD_LABEL} htmlFor="project-setup-area">
                  Floor area (sq ft)
                </label>
                <input
                  id="project-setup-area"
                  className={SETUP_FIELD_INPUT}
                  type="number"
                  min={100}
                  step={50}
                  value={draft.floorAreaSqFt}
                  onChange={(event) => updateDraft("floorAreaSqFt", Number(event.target.value))}
                />
              </div>
              <p className="typ-caption mt-1 px-2 text-[color:var(--text-muted)]">Start with 1000 sq ft if unsure.</p>
            </div>

            <div className="min-w-0 sm:col-span-2 lg:col-span-1">
              <div className={SETUP_FIELD_SHELL_STACK}>
                <label className={SETUP_FIELD_LABEL} htmlFor="project-setup-seats">
                  People to seat
                </label>
                <input
                  id="project-setup-seats"
                  className={SETUP_FIELD_INPUT}
                  type="number"
                  min={1}
                  step={1}
                  value={draft.seatTarget}
                  onChange={(event) => updateDraft("seatTarget", Number(event.target.value))}
                />
              </div>
              <p className="typ-caption mt-1 px-2 text-[color:var(--text-muted)]">Used to size the room grid.</p>
            </div>
          </div>

          <fieldset className={SETUP_FIELDSET}>
            <legend id="project-setup-purpose-label" className="px-1 text-[0.8125rem] font-semibold text-[color:var(--text-body)]">
              Primary purpose
            </legend>
            <div
              className="mt-3 grid gap-3 sm:grid-cols-2"
              role="radiogroup"
              aria-labelledby="project-setup-purpose-label"
            >
              {PLANNER_PRIMARY_PURPOSE_OPTIONS.map((option) => {
                const selected = draft.primaryPurpose === option.value;
                return (
                    <label
                      key={option.value}
                      className={`flex flex-col items-start gap-1 cursor-pointer rounded-[var(--radius-lg)] border px-3 py-3 transition-[border-color,box-shadow] focus-within:shadow-[0_0_0_2px_color-mix(in_srgb,var(--color-primary)_30%,transparent)] ${ selected ? "border-[color:color-mix(in_srgb,var(--color-primary)_45%,var(--border-soft))] bg-[color:var(--surface-accent-wash)]" : "border-[color:var(--border-soft)] bg-[color:var(--surface-panel)]" }`}
                    >
                      <input
                        type="radio"
                        name="project-setup-purpose"
                        className="sr-only"
                        checked={selected}
                        onChange={() => updateDraft("primaryPurpose", option.value as PlannerPrimaryPurpose)}
                      />
                    <span className="typ-label text-[color:var(--text-strong)]">{option.label}</span>
                    <span className="typ-caption mt-0.5 text-[color:var(--text-muted)]">
                      {PURPOSE_SUMMARIES[option.value as PlannerPrimaryPurpose]}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <fieldset className={SETUP_FIELDSET} aria-labelledby="project-setup-start-label">
            <legend id="project-setup-start-label" className="px-1 text-[0.8125rem] font-semibold text-[color:var(--text-body)]">
              Start with
            </legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {([
                {
                  value: "template",
                  label: "Starter layout",
                  description: "Purpose-based desks and rooms you can edit.",
                  icon: Layout,
                },
                {
                  value: "scratch",
                  label: "Blank canvas",
                  description: "Empty room — draw walls yourself.",
                  icon: PencilSimpleLine,
                },
                {
                  value: "import-trace",
                  label: "Import / trace",
                  description: "Open the workspace, then import a plan.",
                  icon: FileArrowUp,
                },
              ] as const).map((option) => {
                const selected = startingMode === option.value;
                const Icon = option.icon;
                return (
                  <label
                    key={option.value}
                    className={`flex flex-col items-start gap-1 cursor-pointer rounded-[var(--radius-lg)] border p-3 transition-[border-color,box-shadow] focus-within:shadow-[0_0_0_2px_color-mix(in_srgb,var(--color-primary)_30%,transparent)] ${selected ? "border-[color:color-mix(in_srgb,var(--color-primary)_45%,var(--border-soft))] bg-[color:var(--surface-accent-wash)]" : "border-[color:var(--border-soft)] bg-[color:var(--surface-panel)]"}`}
                  >
                    <input
                      type="radio"
                      name="project-starting-mode"
                      className="sr-only"
                      checked={selected}
                      onChange={() => setStartingMode(option.value)}
                    />
                    <Icon className="mb-2 h-5 w-5 text-[color:var(--color-primary)]" aria-hidden="true" />
                    <span className="typ-label text-[color:var(--text-strong)]">{option.label}</span>
                    <span className="typ-caption mt-1 text-[color:var(--text-muted)]">{option.description}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {error ? (
            <p
              id="project-setup-error"
              className="typ-caption-lg text-[color:var(--color-danger,#dc2626)]"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="btn-primary typ-cta mt-auto inline-flex min-h-11 w-full items-center justify-center gap-2 px-6 py-3 sm:w-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-primary)]"
            disabled={!isHydrated}
            aria-label={isHydrated ? "Open planner" : "Preparing workspace"}
          >
            {isHydrated ? "Open planner" : "Preparing workspace..."}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  );
}
