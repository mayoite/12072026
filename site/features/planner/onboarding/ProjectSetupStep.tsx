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
  GUEST_DEFAULT_PROJECT_NAME,
  PLANNER_INDIAN_CITIES,
  PLANNER_PRIMARY_PURPOSE_OPTIONS,
  applyProjectSetup,
  createDefaultProjectSetupDraft,
  markProjectSetupCompleteInStorage,
  metadataToSpaceSuggestInput,
  resolveGuestSetupSubmit,
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
import styles from "@/app/css/core/locked/planner/project-setup.module.css";

export { GUEST_DEFAULT_PROJECT_NAME, resolveGuestSetupSubmit } from "./projectSetup";

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

export function ProjectSetupStep({ guestMode = false, planId: _planId, onComplete }: ProjectSetupStepProps) {
  const [draft, setDraft] = useState<PlannerProjectSetupDraft>(() =>
    createDefaultProjectSetupDraft({ guestMode }),
  );
  const [error, setError] = useState<string | null>(null);
  const [startingMode, setStartingMode] = useState<PlannerStartingMode>("template");
  const [isHydrated, setIsHydrated] = useState(false);
  const [guestShowDetails, setGuestShowDetails] = useState(false);

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

    let projectName: string;
    let floorAreaSqFt: number;
    let seatTarget: number;

    if (guestMode) {
      const resolved = resolveGuestSetupSubmit(draft);
      projectName = resolved.projectName;
      floorAreaSqFt = resolved.floorAreaSqFt;
      seatTarget = resolved.seatTarget;
    } else {
      projectName = draft.projectName.trim();
      if (!projectName) {
        setError("Add a project name so you can find this layout later.");
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

      floorAreaSqFt = Math.round(draft.floorAreaSqFt);
      seatTarget = Math.round(draft.seatTarget);
    }

    if (projectName.length > 255) {
      setError("Project name must be 255 characters or fewer.");
      return;
    }

    const projectedRoom = estimateRoomMm(seatTarget, floorAreaSqFt);
    if (projectedRoom.widthMm > PLANNER_MAX_CANVAS_MM || projectedRoom.depthMm > PLANNER_MAX_CANVAS_MM) {
      setError(
        `This floor size exceeds the planner canvas limit (${PLANNER_MAX_CANVAS_METERS} m per side). Reduce floor area or seat count.`,
      );
      return;
    }

    const metadata: PlannerProjectMetadata = {
      ...draft,
      projectName,
      floorAreaSqFt,
      seatTarget,
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

  const showDetailFields = !guestMode || guestShowDetails;
  const cardClass = guestMode ? `${styles.card} ${styles.cardGuest}` : `${styles.card} ${styles.cardFull}`;

  return (
    <div className={styles.overlay}>
      <div className={cardClass}>
        {!guestMode ? (
          <aside className={styles.aside}>
            <div>
              <p className="typ-eyebrow">Project setup</p>
              <h1 className="typ-h2 mt-3">
                Set up your space in <span className="text-accent-italic">30 seconds</span>
              </h1>
              <p className="page-copy-sm max-w-md">
                Add the basics once. We size the grid and tailor the planner to this layout.
              </p>
            </div>

            <ul className={styles.featureList}>
              <li className={styles.featureItem}>
                <span className={styles.featureIcon}>
                  <Building2 className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="typ-label">India-ready defaults</p>
                  <p className="typ-caption-lg">Local cities and seat counts.</p>
                </div>
              </li>
              <li className={styles.featureItem}>
                <span className={styles.featureIcon}>
                  <Ruler className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="typ-label">Scaled grid</p>
                  <p className="typ-caption-lg">Auto-tuned to your floor size.</p>
                </div>
              </li>
            </ul>
          </aside>
        ) : null}

        <form className={styles.form} onSubmit={handleSubmit} aria-label="Project setup" aria-busy={!isHydrated}>
          <div className={guestMode ? styles.formHeader : styles.formHeaderHiddenDesktop}>
            <p className="typ-eyebrow">{guestMode ? "Guest planner" : "Project setup"}</p>
            <h1 className="typ-h3 mt-2">
              {guestMode ? (
                <>
                  Open the canvas in <span className="text-accent-italic">one tap</span>
                </>
              ) : (
                <>
                  Set up in <span className="text-accent-italic">30 seconds</span>
                </>
              )}
            </h1>
            {guestMode ? (
              <p className="page-copy-sm mt-2">
                Defaults are ready ({GUEST_DEFAULT_PROJECT_NAME}, 1000 sq ft). Customize only if you need to.
              </p>
            ) : null}
          </div>

          <div className={styles.fieldShellInline}>
            <label className={styles.fieldLabel} htmlFor="project-setup-name">
              Project name{guestMode ? " (optional)" : ""}
            </label>
            <input
              id="project-setup-name"
              className={`${styles.fieldInput} ${styles.fieldInputEnd}`}
              placeholder={guestMode ? GUEST_DEFAULT_PROJECT_NAME : "TVS Bihar Office — 2nd Floor"}
              value={draft.projectName}
              onChange={(event) => updateDraft("projectName", event.target.value)}
              autoComplete="organization"
              autoFocus
              maxLength={255}
              aria-describedby={error ? "project-setup-error" : undefined}
            />
          </div>

          {guestMode && !guestShowDetails ? (
            <button
              type="button"
              className={`typ-caption-lg ${styles.customizeLink}`}
              onClick={() => setGuestShowDetails(true)}
            >
              Customize city, size, and start mode
            </button>
          ) : null}

          {showDetailFields ? (
            <>
              <div className={styles.detailGrid} data-testid="project-setup-detail-grid">
                <div className={styles.fieldShellStack}>
                  <label className={styles.fieldLabel} htmlFor="project-setup-city">
                    City
                  </label>
                  <div className={styles.fieldInputIconWrap}>
                    <MapPin className={styles.fieldIcon} aria-hidden="true" />
                    <select
                      id="project-setup-city"
                      className={`${styles.fieldInput} ${styles.fieldInputWithIcon}`}
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

                <div className={styles.detailCell}>
                  <div className={styles.fieldShellStack}>
                    <label className={styles.fieldLabel} htmlFor="project-setup-area">
                      Floor area (sq ft)
                    </label>
                    <input
                      id="project-setup-area"
                      className={styles.fieldInput}
                      type="number"
                      min={100}
                      step={50}
                      value={draft.floorAreaSqFt}
                      onChange={(event) => updateDraft("floorAreaSqFt", Number(event.target.value))}
                    />
                  </div>
                  <p className={`typ-caption ${styles.fieldHint}`}>Start with 1000 sq ft if unsure.</p>
                </div>

                <div className={styles.detailGridSpan2}>
                  <div className={styles.fieldShellStack}>
                    <label className={styles.fieldLabel} htmlFor="project-setup-seats">
                      People to seat
                    </label>
                    <input
                      id="project-setup-seats"
                      className={styles.fieldInput}
                      type="number"
                      min={1}
                      step={1}
                      value={draft.seatTarget}
                      onChange={(event) => updateDraft("seatTarget", Number(event.target.value))}
                    />
                  </div>
                  <p className={`typ-caption ${styles.fieldHint}`}>Used to size the room grid.</p>
                </div>
              </div>

              <fieldset className={styles.fieldset}>
                <legend id="project-setup-purpose-label" className={styles.legend}>
                  Primary purpose
                </legend>
                <div
                  className={styles.choiceGridPurpose}
                  role="radiogroup"
                  aria-labelledby="project-setup-purpose-label"
                >
                  {PLANNER_PRIMARY_PURPOSE_OPTIONS.map((option) => {
                    const selected = draft.primaryPurpose === option.value;
                    return (
                      <label
                        key={option.value}
                        className={styles.choiceCard}
                        data-selected={selected ? "true" : "false"}
                      >
                        <input
                          type="radio"
                          name="project-setup-purpose"
                          className={styles.srOnly}
                          checked={selected}
                          onChange={() => updateDraft("primaryPurpose", option.value as PlannerPrimaryPurpose)}
                        />
                        <span className="typ-label">{option.label}</span>
                        <span className="typ-caption mt-0.5">
                          {PURPOSE_SUMMARIES[option.value as PlannerPrimaryPurpose]}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <fieldset className={styles.fieldset} aria-labelledby="project-setup-start-label">
                <legend id="project-setup-start-label" className={styles.legend}>
                  Start with
                </legend>
                <div className={styles.choiceGridStart}>
                  {(
                    [
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
                    ] as const
                  ).map((option) => {
                    const selected = startingMode === option.value;
                    const Icon = option.icon;
                    return (
                      <label
                        key={option.value}
                        className={styles.choiceCard}
                        data-selected={selected ? "true" : "false"}
                      >
                        <input
                          type="radio"
                          name="project-starting-mode"
                          className={styles.srOnly}
                          checked={selected}
                          onChange={() => setStartingMode(option.value)}
                        />
                        <Icon className={styles.choiceIcon} aria-hidden="true" />
                        <span className="typ-label">{option.label}</span>
                        <span className="typ-caption mt-1">{option.description}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </>
          ) : null}

          {error ? (
            <p id="project-setup-error" className={`typ-caption-lg ${styles.error}`} role="alert" aria-live="assertive">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className={`btn-primary typ-cta ${styles.submit}`}
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
