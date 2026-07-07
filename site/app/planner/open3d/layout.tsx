import type { Metadata } from "next";

import "@/app/css/core/locked/planner/open3d-workspace.css";

export const metadata: Metadata = {
  title: "Open3D Planner | One&Only",
  robots: { index: false, follow: false },
};

/**
 * Thin open3d layout. Auth/CSRF/SW/ErrorBoundary preserved by parent
 * app/planner/layout.tsx (applies to /planner/open3d direct nav + refresh).
 */
export default function Open3dPlannerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
