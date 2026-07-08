"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronRight, ChevronLeft, Lightbulb, Sparkles, Armchair, Move, ZoomIn } from "lucide-react";
import { BottomSheet } from "@/features/planner/ui/BottomSheet";
import { useIsMobile } from "@/features/planner/hooks/useIsMobile";
import { Z } from "@/lib/z-index";

export type CoachStep = {
  id: string;
  title: string;
  description: string;
  target?: string;
  position?: "top" | "bottom" | "left" | "right";
};

const STORAGE_KEY = "oando-onboarding-complete";

interface OnboardingCoachProps {
  plannerType: "oando" | "buddy" | "planner" | "planner-guest";
  steps: CoachStep[];
  respectDismissal?: boolean;
}

export function OnboardingCoach({
  plannerType,
  steps,
  respectDismissal = true,
}: OnboardingCoachProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [spotlight, setSpotlight] = useState<DOMRect | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (respectDismissal) {
      const key = `${STORAGE_KEY}-${plannerType}`;
      const dismissed = localStorage.getItem(key) === "true";
      const t = setTimeout(() => {
        setIsDismissed(dismissed);
        setIsVisible(!dismissed);
      }, 0);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => setIsVisible(true), 0);
    return () => clearTimeout(t);
  }, [plannerType, respectDismissal]);

  const handleComplete = useCallback(() => {
    const key = `${STORAGE_KEY}-${plannerType}`;
    localStorage.setItem(key, "true");
    setIsVisible(false);
    setIsDismissed(true);
  }, [plannerType]);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      handleComplete();
    }
  }, [currentStep, steps.length, handleComplete]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  const handleSkip = useCallback(() => {
    handleComplete();
  }, [handleComplete]);

  const step = steps[currentStep];
  const spotlightTarget = isVisible && !isDismissed && step?.target ? step.target : null;

  useEffect(() => {
    if (!spotlightTarget) return;

    let cancelled = false;
    const updateSpotlight = () => {
      if (cancelled) return;
      const el = document.querySelector(`[data-coach="${spotlightTarget}"]`);
      setSpotlight(el ? el.getBoundingClientRect() : null);
    };

    const raf = requestAnimationFrame(updateSpotlight);
    window.addEventListener("resize", updateSpotlight);
    window.addEventListener("scroll", updateSpotlight, true);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateSpotlight);
      window.removeEventListener("scroll", updateSpotlight, true);
    };
  }, [spotlightTarget]);

  const displaySpotlight = spotlightTarget ? spotlight : null;

  if (!isVisible || isDismissed || steps.length === 0) return null;

  const mobileSteps = [
    {
      title: "Add furniture",
      description: "Open the catalog and add desks, seating, and storage to your plan.",
      Icon: Armchair,
    },
    {
      title: "Drag to arrange",
      description: "Move items directly on the canvas until the workspace feels right.",
      Icon: Move,
    },
    {
      title: "Pinch to zoom",
      description: "Use pinch gestures to inspect details or zoom out for the full floor.",
      Icon: ZoomIn,
    },
  ] as const;

  const isLast = currentStep === steps.length - 1;
  const isFirst = currentStep === 0;
  const mobileStepIndex = Math.min(currentStep, mobileSteps.length - 1);
  const mobileStep = mobileSteps[mobileStepIndex];
  const mobileLast = mobileStepIndex === mobileSteps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;
  const pad = 8;
  const spotlightStyle = displaySpotlight
    ? {
        boxShadow: `0 0 0 var(--radius-full) var(--scrim-black-20)`,
        left: displaySpotlight.left - pad,
        top: displaySpotlight.top - pad,
        width: displaySpotlight.width + pad * 2,
        height: displaySpotlight.height + pad * 2,
      }
    : undefined;

  if (isMobile) {
    const Icon = mobileStep.Icon;

    return (
      <BottomSheet open onClose={handleSkip} title={mobileStep.title}>
        <div className="min-h-[calc(90dvh-56px)] px-6 pb-6">
          <button
            type="button"
            onClick={handleSkip}
            className="right-4 top-4 text-sm text-muted"
            aria-label="Skip onboarding"
          >
            Skip
          </button>
          <div className="text-center">
            <div className="mb-5 h-12 w-12 rounded-2xl bg-blue-50 text-brand">
              <Icon size={48} strokeWidth={1.75} aria-hidden />
            </div>
            <h2 className="text-[1.125rem] font-bold text-heading">{mobileStep.title}</h2>
            <p className="mt-2 max-w-[16.25rem] text-sm leading-6 text-muted">{mobileStep.description}</p>
            <button
              type="button"
              onClick={mobileLast ? handleComplete : () => setCurrentStep((stepIndex) => stepIndex + 1)}
              className="mt-8 min-h-[2.75rem] rounded-lg bg-primary px-5 py-2 text-sm font-semibold"
            >
              {mobileLast ? "Get started" : "Next"}
            </button>
          </div>
          <div className="gap-1.5">
            {mobileSteps.map((item, index) => (
              <span
                key={item.title}
                className={`h-1.5 w-1.5 rounded-full ${index === mobileStepIndex ? "bg-primary" : "bg-gray-300"}`}
                aria-hidden
              />
            ))}
          </div>
        </div>
      </BottomSheet>
    );
  }

  return (
    <div className="pointer-events-none" style={{ zIndex: Z.sidebar }} aria-hidden={false}>
      {displaySpotlight ? (
        <div
          className="rounded-xl pointer-events-none ring-2 ring-[var(--color-primary)] ring-offset-2 ring-offset-transparent transition-all duration-300"
          style={spotlightStyle}
          aria-hidden
        />
      ) : null}

      <div
        className="bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto w-[26.25rem] max-w-[calc(100vw-2rem)] rounded-xl shadow-2xl bg-page border border-soft"
        role="dialog"
        aria-label="Onboarding Guide"
      >
        <div className="h-1 bg-muted">
          <div
            className="transition-all duration-300 bg-primary"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="px-5 py-4">
          <div className="items-start gap-3">
            <div className="w-8 h-8 rounded-lg flex-shrink-0 bg-primary text-inverse">
              <Lightbulb size={16} />
            </div>
            <div className="">
              <div className="">
                <h4 className="text-sm font-semibold text-strong">{step.title}</h4>
                <button
                  type="button"
                  onClick={handleSkip}
                  className="p-1 rounded text-muted bg-hover-soft"
                  aria-label="Skip onboarding"
                >
                  <X size={14} />
                </button>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-body">
                {step.description}
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-soft">
          <span className="text-xs text-subtle">
            {currentStep + 1} of {steps.length}
          </span>
          <div className="gap-2">
            {!isFirst && (
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous onboarding step"
                className="gap-1 px-3 py-1.5 text-xs rounded-lg border border-soft text-body bg-hover-soft transition-colors"
              >
                <ChevronLeft size={12} /> Back
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              aria-label={isLast ? "Finish onboarding" : "Next onboarding step"}
              className="gap-1 px-3 py-1.5 text-xs rounded-lg bg-primary text-inverse hover:bg-primary-hover transition-colors"
            >
              {isLast ? (
                <>
                  <Sparkles size={12} /> Get Started
                </>
              ) : (
                <>
                  Next <ChevronRight size={12} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const OANDO_ONBOARDING_STEPS: CoachStep[] = [
  {
    id: "welcome",
    title: "Welcome to One&Only Space Planner",
    description:
      "Design professional office layouts with architectural-grade precision. Draw walls, place furniture from our catalog, and export branded PDFs — all in your browser.",
  },
  {
    id: "tools",
    title: "Drawing Tools",
    description:
      "Use the toolbar on the left to draw walls, add doors/windows, place furniture, and create zones. Each tool has keyboard shortcuts shown in tooltips.",
    target: "toolbar",
  },
  {
    id: "catalog",
    title: "Furniture Catalog",
    description:
      "Browse 300+ furniture items organized by category. Drag items onto your canvas — dimensions are accurate to manufacturer specs.",
    target: "catalog",
  },
  {
    id: "3d-view",
    title: "3D Visualization",
    description:
      "Switch to 3D view anytime to see your layout in perspective. Changes sync bidirectionally between 2D and 3D.",
    target: "3d-toggle",
  },
  {
    id: "ai-advisor",
    title: "AI Layout Advisor",
    description:
      "Click the AI Advisor button (bottom-right) for intelligent suggestions on furniture placement, zone optimization, and ergonomic compliance.",
    target: "ai-advisor",
  },
  {
    id: "export",
    title: "Professional Export",
    description:
      "Export branded PDFs with Bill of Quantities, or download your plan as JSON for cross-planner import. Better than any competitor's output.",
    target: "export",
  },
];

export const BUDDY_ONBOARDING_STEPS: CoachStep[] = [
  {
    id: "welcome",
    title: "Welcome to Buddy Workspace Planner",
    description:
      "Plan collaborative workspaces with intelligent seat allocation. Drop elements, assign teams, and optimize your floorplate — faster than any other tool.",
  },
  {
    id: "element-library",
    title: "Element Library",
    description:
      "Open the left sidebar to browse desks, tables, rooms, and equipment. Each element type has accurate dimensions and configurable seat counts.",
    target: "element-library",
  },
  {
    id: "smart-wizard",
    title: "Smart Space Wizard",
    description:
      "Use Ctrl+K or the command palette to access the Smart Wizard — it generates optimized layouts based on team size and space constraints automatically.",
    target: "smart-wizard",
  },
  {
    id: "zones",
    title: "Zone Planning",
    description:
      "Create named zones (Open Plan, Executive, Meeting, etc.) to organize your space logically. Zones track utilization and show capacity metrics.",
    target: "zones",
  },
  {
    id: "ai-advisor",
    title: "AI Layout Advisor",
    description:
      "Get AI-powered suggestions for furniture placement, team adjacency, and space optimization. Click the sparkle button in the bottom-right corner.",
    target: "ai-advisor",
  },
  {
    id: "export-boq",
    title: "BOQ & Export",
    description:
      "Export a professional Bill of Quantities as branded PDF, CSV, or JSON. Your output will look better than SmartDraw's — guaranteed.",
    target: "export",
  },
];
