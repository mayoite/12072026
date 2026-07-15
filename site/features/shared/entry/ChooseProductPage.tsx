"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CompassTool } from "@phosphor-icons/react";
import { motion } from "framer-motion";

import { PlannerLaunchLink } from "@/components/ui/PlannerLaunchLink";
import { PRODUCT_SUITE } from "@/features/site/data/productSuite";

interface ChooseProductPageProps {
  guestMode: boolean;
  authenticated: boolean;
}

const PLANNER = PRODUCT_SUITE.planner;

export function ChooseProductPage({
  guestMode,
  authenticated,
}: ChooseProductPageProps) {
  const entryHref = guestMode ? PLANNER.routes.guest : PLANNER.routes.canvas;
  const landingHref = PLANNER.routes.landing;
  const accessLabel = guestMode
    ? "Guest access"
    : authenticated
      ? "Member access"
      : "Access check";

  return (
    <section className="bg-[var(--surface-page)] pt-16">
      <div className="grid lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative flex min-h-[30rem] items-end overflow-hidden bg-[var(--surface-inverse)] px-7 py-10 text-[var(--text-inverse)] md:min-h-[34rem] md:px-12 lg:min-h-full">
          <Image
            src="/images/hero/tvs-patna-enhanced.webp"
            alt="Workspace planning preview"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 48vw"
            className="object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative z-10 max-w-xl"
          >
            <p className="typ-label mb-5 text-[var(--color-bronze-300)]">{accessLabel}</p>
            <h1 className="home-heading !text-[clamp(2.4rem,5vw,4.5rem)] !text-[var(--text-inverse)]">
              Choose the right <span className="text-accent-italic-on-dark">planning entry.</span>
            </h1>
            <p className="page-copy mt-6 max-w-lg text-[var(--text-inverse-body)]">
              {guestMode
                ? "Open the live canvas for layout, catalog placement, 3D review, and export. Guest saves stay restricted until sign-in."
                : "Continue into the member workspace with saved plans, export history, and dashboard continuity."}
            </p>
          </motion.div>
        </div>

        <div className="flex items-center px-7 py-12 md:px-12 lg:px-16">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-2xl"
          >
            <div className="border-b border-[var(--border-soft)] pb-8">
              <p className="typ-label text-[var(--color-bronze-500)]">Planner launch</p>
              <h2 className="home-heading mt-4">Start with the path that matches the session.</h2>
            </div>

            <PlannerLaunchLink
              href={entryHref}
              surface="choose-product"
              label={PLANNER.label}
              className="group mt-8 grid gap-6 border border-[var(--border-soft)] bg-[var(--surface-page)] p-6 transition-colors hover:bg-[var(--surface-soft)] md:grid-cols-[4rem_1fr_auto] md:items-center"
            >
              <span className="flex h-16 w-16 items-center justify-center border border-[var(--border-soft)] text-[var(--color-bronze-500)]">
                <CompassTool size={30} weight="light" aria-hidden="true" />
              </span>
              <span>
                <span className="typ-label text-[var(--color-bronze-500)]">Unified workspace</span>
                <span className="typ-h3 mt-2 block text-strong">{PLANNER.label}</span>
                <span className="page-copy-sm mt-3 block text-body">{PLANNER.description}</span>
              </span>
              <span className="flex h-11 w-11 items-center justify-center border border-[var(--border-soft)] text-strong transition-transform group-hover:translate-x-1">
                <ArrowRight size={18} weight="bold" aria-hidden="true" />
              </span>
            </PlannerLaunchLink>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                "2D edit and 3D preview",
                "Catalog furniture placement",
                "BOQ-ready export path",
              ].map((item, index) => (
                <div key={item} className="border-t border-[var(--border-soft)] pt-4">
                  <p className="text-[var(--color-bronze-500)]">0{index + 1}</p>
                  <p className="page-copy-sm mt-2 text-body">{item}</p>
                </div>
              ))}
            </div>

            <p className="typ-body-sm mt-8 text-muted">
              <Link href={landingHref} className="text-primary hover:underline">
                View planner overview
              </Link>
              {authenticated ? (
                <>
                  {" / "}
                  <Link href="/portal" className="text-primary hover:underline">
                    Open portal
                  </Link>
                </>
              ) : null}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
