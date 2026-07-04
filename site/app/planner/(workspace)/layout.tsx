import type { Metadata } from "next";

import "@/app/css/core/planner/bundles/open3d-workspace.css";
import "@/app/css/core/planner/open3d.css";

export const metadata: Metadata = {
  title: "Planner Workspace | One&Only",
  robots: { index: false, follow: false },
};

export default function PlannerWorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
