import type { Metadata } from "next";

/* Locked entry filename is historical — do not rename without CSS unlock. */
import "@/app/css/core/locked/planner/index.css";

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
