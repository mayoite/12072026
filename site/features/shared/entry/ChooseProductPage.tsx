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
  // Carry Site continuity into guest canvas after this chooser step.
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

  return (
    <section className="bg-[var(--surface-page)] pt-16" aria-labelledby="choose-product-heading">
      <div className="grid lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative flex min-h-[30rem] items-end overflow-hidden bg-[var(--surface-inverse)] px-7 py-10 text-[var(--text-inverse)] md:min-h-[34rem] md:px-12 lg:min-h-full">
          <Image
            src={DEFAULT_HERO_FALLBACK}
            alt="Office furniture workspace layout preview in planning view"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 48vw"
            className="object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" aria-hidden="true" />
          <div className="relative z-10 max-w-xl">
            <p className="typ-label mb-5 text-[var(--color-bronze-300)]">{sessionLabel}</p>
            <h1
              id="choose-product-heading"
              className="home-heading !text-[clamp(2.4rem,5vw,4.5rem)] !text-[var(--text-inverse)]"
            >
              Start planning office furniture{" "}
              <span className="text-accent-italic-on-dark">for real spaces.</span>
            </h1>
            <p className="page-copy mt-6 max-w-lg text-[var(--text-inverse-body)]">
              {guestMode
                ? "Step 1 of planner: open the canvas, upload a floor plan (JPG/PNG/SVG), place catalog furniture, and export a BOQ. Guest drafts stay in this browser until you sign in."
                : authenticated
                  ? "Open the member planner for local drafts, catalog furniture, 3D review, and branded BOQ export."
                  : "Sign in or continue as guest to place office furniture, review layouts, and prepare a BOQ."}
            </p>
            {guestMode ? (
              <p
                className="typ-label mt-4 text-[var(--color-bronze-300)]"
                data-testid="choose-product-guest-step"
              >
                Guest path · no account required
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex items-center px-7 py-12 md:px-12 lg:px-16">
          <div className="w-full max-w-2xl">
            <div className="border-b border-[var(--border-soft)] pb-8">
              <p className="typ-label text-[var(--color-bronze-500)]">Workspace entry</p>
              <h2 className="home-heading mt-4">Choose how you enter the planner.</h2>
              <p className="page-copy-sm mt-4 text-body">
                One workspace for layout, catalog furniture (including systems from brands we supply), and BOQ handoff to Oando.
              </p>
            </div>

            <PlannerLaunchLink
              href={entryHref}
              surface="choose-product"
              label={PLANNER.label}
              aria-label={`${primaryLabel}: ${PLANNER.label}`}
              data-testid="choose-product-planner-launch"
              className="group mt-8 grid min-h-[5.5rem] gap-6 border border-[var(--border-soft)] bg-[var(--surface-page)] p-6 transition-colors hover:bg-[var(--surface-soft)] md:grid-cols-[4rem_1fr_auto] md:items-center"
            >
              <span className="flex h-16 w-16 items-center justify-center border border-[var(--border-soft)] text-[var(--color-bronze-500)]">
                <CompassTool size={30} weight="light" aria-hidden="true" />
              </span>
              <span>
                <span className="typ-label text-[var(--color-bronze-500)]">{primaryLabel}</span>
                <span className="typ-h3 mt-2 block text-strong">{PLANNER.label}</span>
                <span className="page-copy-sm mt-3 block text-body">{PLANNER.description}</span>
              </span>
              <span className="flex h-11 min-h-11 min-w-11 w-11 items-center justify-center border border-[var(--border-soft)] text-strong transition-transform group-hover:translate-x-1">
                <ArrowRight size={18} weight="bold" aria-hidden="true" />
              </span>
            </PlannerLaunchLink>

            <ul className="mt-8 grid list-none gap-4 p-0 md:grid-cols-3">
              {[
                "2D edit and 3D preview",
                "Catalog furniture placement",
                "BOQ-ready export path",
              ].map((item, index) => (
                <li key={item} className="border-t border-[var(--border-soft)] pt-4">
                  <p className="text-[var(--color-bronze-500)]" aria-hidden="true">
                    0{index + 1}
                  </p>
                  <p className="page-copy-sm mt-2 text-body">{item}</p>
                </li>
              ))}
            </ul>

            <nav className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2" aria-label="Related workspace links">
              <Link href={landingHref} className="typ-body-sm text-primary hover:underline min-h-11 inline-flex items-center">
                View planner overview
              </Link>
              {authenticated ? (
                <Link href="/portal" className="typ-body-sm text-primary hover:underline min-h-11 inline-flex items-center">
                  Open portal
                </Link>
              ) : (
                <Link
                  href="/access?next=%2Fchoose-product%3Fmode%3Dguest"
                  className="typ-body-sm text-primary hover:underline min-h-11 inline-flex items-center gap-1.5"
                >
                  <SignIn size={16} weight="bold" aria-hidden="true" />
                  Sign in
                </Link>
              )}
              {!guestMode && !authenticated ? (
                <Link
                  href="/choose-product?mode=guest"
                  className="typ-body-sm text-primary hover:underline min-h-11 inline-flex items-center"
                >
                  Continue as guest
                </Link>
              ) : null}
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
