"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowRight, CompassTool, SignIn } from "@phosphor-icons/react";

import { PlannerLaunchLink } from "@/components/ui/PlannerLaunchLink";
import { DEFAULT_HERO_FALLBACK } from "@/features/site/data/homepage";
import { PRODUCT_SUITE } from "@/features/site/data/productSuite";
import { buildPlannerEntryHref } from "@/lib/analytics/plannerEntry";

interface ChooseProductPageProps {
  guestMode: boolean;
  authenticated: boolean;
}

const PLANNER = PRODUCT_SUITE.planner;

const WORKFLOW_STEPS = [
  { id: "preview", label: "2D & 3D preview" },
  { id: "catalog", label: "Catalog placement" },
  { id: "boq", label: "BOQ export" },
] as const;

type WorkflowStepId = (typeof WORKFLOW_STEPS)[number]["id"];

export function ChooseProductPage({
  guestMode,
  authenticated,
}: ChooseProductPageProps) {
  const pathname = usePathname() || "/choose-product";
  const searchParams = useSearchParams();
  const siteProduct = searchParams.get("siteProduct") ?? undefined;
  const siteCategory = searchParams.get("siteCategory") ?? undefined;
  const siteSource = searchParams.get("siteSource") ?? pathname;

  const rawEntryHref =
    guestMode || !authenticated ? PLANNER.routes.guest : PLANNER.routes.canvas;
  const entryHref =
    guestMode || !authenticated
      ? buildPlannerEntryHref(rawEntryHref, {
          sourcePage: siteSource,
          productSlug: siteProduct,
          categoryId: siteCategory,
        })
      : rawEntryHref;
  const landingHref = PLANNER.routes.landing;
  const sessionLabel = guestMode
    ? "Guest session"
    : authenticated
      ? "Signed-in session"
      : "Sign-in required";

  const primaryLabel = guestMode
    ? "Open guest planner"
    : authenticated
      ? "Open workspace planner"
      : "Continue to guest planner";

  const stepLinks: Record<WorkflowStepId, { href: string; label: string }> = {
    preview: { href: landingHref, label: "View planner overview" },
    catalog: { href: "/products", label: "Browse products" },
    boq: authenticated
      ? { href: PLANNER.routes.portal, label: "Open portal" }
      : { href: "/planning", label: "BOQ planning service" },
  };

  return (
    <section className="choose-product-page" aria-labelledby="choose-product-heading">
      <div className="choose-product-split">
        <div className="choose-product-hero">
          <Image
            src={DEFAULT_HERO_FALLBACK}
            alt="Office furniture workspace layout preview in planning view"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 48vw"
            className="choose-product-hero__media"
          />
          <div className="choose-product-hero__scrim" aria-hidden="true" />
          <div className="choose-product-hero__copy">
            <p className="typ-label choose-product-hero__session">{sessionLabel}</p>
            <h1 id="choose-product-heading" className="home-heading choose-product-hero__title">
              Start planning office furniture{" "}
              <span className="text-accent-italic-on-dark">for real spaces.</span>
            </h1>
            <p className="page-copy choose-product-hero__body">
              {guestMode
                ? "Step 1 of planner: open the canvas, upload a floor plan (JPG/PNG/SVG), place catalog furniture, and export a BOQ. Guest drafts stay in this browser until you sign in."
                : authenticated
                  ? "Open the member planner for local drafts, catalog furniture, 3D review, and branded BOQ export."
                  : "Sign in or continue as guest to place office furniture, review layouts, and prepare a BOQ."}
            </p>
            {guestMode ? (
              <p
                className="typ-label choose-product-hero__guest-note"
                data-testid="choose-product-guest-step"
              >
                Guest path · no account required
              </p>
            ) : null}
          </div>
        </div>

        <div className="choose-product-panel">
          <div className="choose-product-panel__inner">
            <div className="choose-product-intro">
              <p className="typ-label choose-product-intro__eyebrow">Workspace entry</p>
              <h2 className="home-heading choose-product-intro__title">
                Choose how you enter the planner.
              </h2>
              <p className="page-copy-sm choose-product-intro__copy">
                One workspace for layout, catalog furniture (including systems from brands we
                supply), and BOQ handoff to Oando.
              </p>
            </div>

            <PlannerLaunchLink
              href={entryHref}
              surface="choose-product"
              label={PLANNER.label}
              aria-label={`${primaryLabel}: ${PLANNER.label}`}
              data-testid="choose-product-planner-launch"
              className="choose-product-launch group"
            >
              <span className="choose-product-launch__icon">
                <CompassTool size={30} weight="light" aria-hidden="true" />
              </span>
              <span>
                <span className="typ-label choose-product-launch__kicker">{primaryLabel}</span>
                <span className="typ-h3 choose-product-launch__title">{PLANNER.label}</span>
                <span className="page-copy-sm choose-product-launch__desc">{PLANNER.description}</span>
              </span>
              <span className="choose-product-launch__arrow">
                <ArrowRight size={18} weight="bold" aria-hidden="true" />
              </span>
            </PlannerLaunchLink>

            <ul className="choose-product-steps">
              {WORKFLOW_STEPS.map((step, index) => {
                const link = stepLinks[step.id];
                return (
                  <li key={step.id} className="choose-product-step">
                    <p className="choose-product-step__index" aria-hidden="true">
                      0{index + 1}
                    </p>
                    <p className="page-copy-sm choose-product-step__label">{step.label}</p>
                    <Link href={link.href} className="choose-product-step__link">
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {!guestMode && !authenticated ? (
              <nav className="choose-product-auth-nav" aria-label="Account entry options">
                <Link
                  href="/access?next=%2Fchoose-product%3Fmode%3Dguest"
                  className="choose-product-auth-nav__link"
                >
                  <SignIn size={16} weight="bold" aria-hidden="true" />
                  Sign in
                </Link>
                <Link href="/choose-product?mode=guest" className="choose-product-auth-nav__link">
                  Continue as guest
                </Link>
              </nav>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
