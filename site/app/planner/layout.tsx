import type { Viewport } from "next";

import "@/app/(site)/globals.css";
import "@/app/css/core/locked/site/index.css";
import { PlannerLayoutShell } from "@/features/planner/components/PlannerLayoutShell";
import { SITE_VIEWPORT } from "@/lib/siteViewport";

/** Shared mobile viewport for all /planner/** routes (marketing + workspace). */
export const viewport: Viewport = SITE_VIEWPORT;

/**
 * Planner segment root. Client shell owns chrome, theme, and error boundary.
 * Marketing CSS loads only under `(marketing)/layout.tsx`.
 * Workspace CSS loads only under `(workspace)/layout.tsx`.
 */
export default function PlannerRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PlannerLayoutShell>{children}</PlannerLayoutShell>;
}
