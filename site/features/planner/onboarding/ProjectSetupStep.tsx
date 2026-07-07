"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Building2, MapPin, Ruler } from "lucide-react";

import {
  PLANNER_INDIAN_CITIES,
  PLANNER_PRIMARY_PURPOSE_OPTIONS,
  applyProjectSetup,
  createDefaultProjectSetupDraft,
  type PlannerProjectMetadata,
  type PlannerProjectSetupDraft,
  type PlannerPrimaryPurpose,
} from "./projectSetup";
import { estimateRoomMm } from "@/features/planner/ai/spaceSuggest";
import { PLANNER_MAX_CANVAS_MM, PLANNER_MAX_CANVAS_METERS } from "@/features/planner/lib/canvasBounds";
import { Z } from "@/lib/z-index";



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

const SETUP_FIELD_SHELL =
  "flex items-center gap-3 rounded-[var(--radius-sm)] border border-[color:var(--border-soft)] bg-[color:var(--surface-soft)] px-4 py-3 transition-[border-color,box-shadow] focus-within:border-[color:var(--color-primary)] focus-within:shadow-[0_0_0_2px_color-mix(in_srgb,var(--color-primary)_16%,transparent)]";
const SETUP_FIELD_LABEL =
  "shrink-0 text-[0.8125rem] font-semibold text-[color:var(--text-body)]";
const SETUP_FIELD_INPUT =
  "min-w-0 flex-1 border-none bg-transparent text-right text-[0.9375rem] font-medium text-[color:var(--text-strong)] outline-none";
const SETUP_FIELDSET =
  "rounded-[var(--radius-md)] border border-[color:var(--border-soft)] bg-[color:var(--surface-soft)] p-4";

export function ProjectSetupStep({ guestMode = false, planId: _planId, onComplete }: ProjectSetupStepProps) {
  const [draft, setDraft] = useState<PlannerProjectSetupDraft>(() =>
    createDefaultProjectSetupDraft({ guestMode }),
  );
  const [error, setError] = useState<string | null>(null);
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
    <div
      className="planner-setup-overlay fixed inset-0 flex items-center justify-center bg-[color:var(--surface-inverse)]/88 backdrop-blur-sm"
      style={{ zIndex: Z.panel }}
    >
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[var(--radius-xl)] border border-[color:var(--border-soft)] bg-[color:var(--surface-panel-strong)] shadow-[var(--shadow-soft)] lg:grid-cols-[1fr_1.05fr]">
        <aside className="flex flex-col justify-between gap-8 border-b border-[color:var(--border-soft)] bg-[color:var(--surface-accent-wash)] p-8 lg:border-b-0 lg:border-r">
          <div>
            <p className="typ-eyebrow text-[color:var(--color-bronze-500)]">Project setup</p>
            <h1 className="typ-h2 mt-3 text-[color:var(--text-strong)]">
              Set up your space in <span className="text-accent-italic">30 seconds</span>
            </h1>
            <p className="page-copy-sm mt-4 max-w-md text-[color:var(--text-muted)]">
              Add the basics once. We size the grid and tailor the planner to this layout.
            </p>
          </div>

          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="scheme-accent-wash flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[color:var(--color-primary)]">
                <Building2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="typ-label text-[color:var(--text-strong)]">India-ready defaults</p>
                <p className="typ-caption-lg text-[color:var(--text-muted)]">Local cities and seat counts.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="scheme-accent-wash flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[color:var(--color-primary)]">
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
          className="flex flex-col gap-5 p-8"
          onSubmit={handleSubmit}
          aria-label="Project setup"
          aria-busy={!isHydrated}
        >
          <div className={SETUP_FIELD_SHELL}>
            <label className={SETUP_FIELD_LABEL} htmlFor="project-setup-name">
              Project name
            </label>
            <input
              id="project-setup-name"
              className={SETUP_FIELD_INPUT}
              placeholder="TVS Bihar Office — 2nd Floor"
              value={draft.projectName}
              onChange={(event) => updateDraft("projectName", event.target.value)}
              autoComplete="organization"
              autoFocus
              maxLength={255}
              aria-describedby={error ? "project-setup-error" : undefined}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className={SETUP_FIELD_SHELL}>
              <label className={SETUP_FIELD_LABEL} htmlFor="project-setup-city">
                City
              </label>
              <div className="relative flex-1">
                <MapPin
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--text-muted)]"
                  aria-hidden="true"
                />
                <select
                  id="project-setup-city"
                  className={`${SETUP_FIELD_INPUT} pl-9`}
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

            <div>
              <div className={SETUP_FIELD_SHELL}>
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
                    className={`flex cursor-pointer flex-col rounded-[var(--radius-lg)] border px-3 py-3 transition-colors ${
                      selected
                        ? "border-[color:color-mix(in_srgb,var(--color-primary)_45%,var(--border-soft))] bg-[color:var(--surface-accent-wash)]"
                        : "border-[color:var(--border-soft)] bg-[color:var(--surface-panel)]"
                    }`}
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
            className="btn-primary typ-cta mt-auto inline-flex items-center justify-center gap-2 px-6 py-3"
            disabled={!isHydrated}
            aria-label={isHydrated ? "Start placing furniture" : "Preparing workspace"}
          >
            {isHydrated ? "Start placing furniture" : "Preparing workspace..."}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  );
}
