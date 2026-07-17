import "@/app/css/core/locked/planner/marketing.css";

/**
 * Marketing-only CSS for /planner, /planner/help, /planner/features/**.
 * Pass-through shell — chrome comes from PlannerLayoutShell (RouteChrome).
 */
export default function PlannerMarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

