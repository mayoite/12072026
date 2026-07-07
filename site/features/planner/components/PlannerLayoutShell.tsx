"use client";

import { Suspense, type ReactNode } from "react";

import QueryProvider from "@/app/(site)/providers/QueryProvider";
import { RouteChrome } from "@/components/site/RouteChrome";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import { PlannerBodyTheme } from "@/features/planner/components/PlannerBodyTheme";
import { PlannerErrorBoundary } from "@/features/planner/editor/PlannerErrorBoundary";

/** Single client boundary for planner root layout (avoids broken RSC lazy refs). */
export function PlannerLayoutShell({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <PlannerBodyTheme />
        <Suspense fallback={null}>
          <RouteChrome position="top" />
        </Suspense>
        <main id="main-content">
          <PlannerErrorBoundary label="Planner">{children}</PlannerErrorBoundary>
        </main>
        <Suspense fallback={null}>
          <RouteChrome position="bottom" />
        </Suspense>
      </ThemeProvider>
    </QueryProvider>
  );
}