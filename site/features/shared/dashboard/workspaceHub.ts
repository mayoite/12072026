import type { Icon } from "@phosphor-icons/react";
import { Compass, SquaresFour as LayoutDashboard, UserCircle } from "@phosphor-icons/react";

export type WorkspaceHubItem = {
  href: string;
  label: string;
  description: string;
  icon: Icon;
};

export type WorkspaceHubSection = {
  title: string;
  summary: string;
  items: WorkspaceHubItem[];
};

/** Member workspace hub only — admin tools live under `/admin` (see `adminNav.ts`). */
export const WORKSPACE_HUB_SECTIONS: WorkspaceHubSection[] = [
  {
    title: "Planner & workspace",
    summary: "Layout, catalog furniture, 3D review, and export.",
    items: [
      {
        href: "/planner",
        label: "Planner home",
        description: "Marketing landing, templates, and entry to the canvas.",
        icon: Compass,
      },
      {
        href: "/planner/canvas",
        label: "Open canvas",
        description: "Jump straight into the signed-in planner workspace.",
        icon: LayoutDashboard,
      },
      {
        href: "/portal",
        label: "Member portal",
        description: "Review shared plans and member project context.",
        icon: UserCircle,
      },
    ],
  },
];
