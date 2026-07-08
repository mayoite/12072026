import type { Viewport } from "next";
import "@/app/(site)/globals.css";
import "@/app/css/core/locked/site/index.css";
import { SITE_VIEWPORT } from "@/lib/siteViewport";
import { PlannerLayoutShell } from "@/features/planner/components/PlannerLayoutShell";

export const viewport: Viewport = SITE_VIEWPORT;

export default function PlannerRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PlannerLayoutShell>{children}</PlannerLayoutShell>;
}
