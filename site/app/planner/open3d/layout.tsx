import type { Metadata } from "next";

import "@/app/css/core/planner/bundles/open3d-workspace.css";

export const metadata: Metadata = {
  title: "Open3D Planner | One&Only",
  robots: { index: false, follow: false },
};

export default function Open3dPlannerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
