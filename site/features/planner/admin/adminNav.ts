import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Boxes,
  ClipboardList,
  FileText,
  Flag,
  FolderKanban,
  LayoutDashboard,
  Map,
  Package,
  Palette,
  PenSquare,
  Settings,
  Shapes,
  Users,
  Library,
} from "lucide-react";

import {
  CRM_CLIENTS_PATH,
  CRM_PROJECTS_PATH,
  CRM_QUOTES_PATH,
} from "@/features/crm/crmRoutes";

export type AdminNavItem = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

export type AdminNavGroup = {
  title: string;
  items: AdminNavItem[];
};

const DASHBOARD: AdminNavItem = {
  href: "/admin",
  label: "Dashboard",
  description: "Admin hub and quick links",
  icon: LayoutDashboard,
};

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    title: "Overview",
    items: [DASHBOARD],
  },
  {
    title: "Planner",
    items: [
      {
        href: "/admin/plans",
        label: "Plans",
        description: "Review saved planner documents",
        icon: ClipboardList,
      },
      {
        href: "/admin/features",
        label: "Toolbar & features",
        description: "Planner toolbar and capability toggles",
        icon: Flag,
      },
      {
        href: "/admin/analytics",
        label: "Analytics",
        description: "Planner usage and export metrics",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Catalog Assets",
    items: [
      {
        href: "/admin/catalog",
        label: "Standard catalog",
        description: "Editable managed products for planner catalog",
        icon: Package,
      },
      {
        href: "/admin/planner-catalog",
        label: "Configurator catalog",
        description: "Editable parametric, discrete, and fixed SKU payloads",
        icon: Shapes,
      },
      {
        href: "/admin/workspace-catalog",
        label: "Workspace library",
        description: "Static workspace element library (read-only browse)",
        icon: Library,
      },
      {
        href: "/admin/svg-editor",
        label: "SVG block editor",
        description:
          "Puck-managed block descriptors (fixed, configurable, parametric) — Phase 04",
        icon: PenSquare,
      },
    ],
  },
  {
    title: "CRM",
    items: [
      {
        href: CRM_CLIENTS_PATH,
        label: "Clients",
        description: "Client records and contact context",
        icon: Users,
      },
      {
        href: CRM_PROJECTS_PATH,
        label: "Projects",
        description: "Active deals and linked planner documents",
        icon: FolderKanban,
      },
      {
        href: CRM_QUOTES_PATH,
        label: "Quotes",
        description: "Quote drafts and follow-up status",
        icon: FileText,
      },
    ],
  },
  {
    title: "Ops",
    items: [
      {
        href: "/admin/customer-queries",
        label: "Customer queries",
        description: "Inbound contact form queue and follow-ups",
        icon: Boxes,
      },
    ],
  },
  {
    title: "Platform",
    items: [
      {
        href: "/admin/settings",
        label: "Settings",
        description: "Canvas bounds, flags, env reference",
        icon: Settings,
      },
      {
        href: "/admin/themes",
        label: "Themes",
        description: "Block theme tokens and publish pipeline",
        icon: Palette,
      },
      {
        href: "/admin/inventory",
        label: "Route inventory",
        description: "App routes, APIs, and layer map",
        icon: Map,
      },
    ],
  },
];

// Canonical admin svg-editor nav entry (PLAN-FAIL-0403/0417). GS cites: plans/2026-07-04/benchmark.md BP-04, design §11, I-D module paths (no drift). Locked per min scaffold.

export const ADMIN_NAV_ITEMS: AdminNavItem[] = ADMIN_NAV_GROUPS.flatMap((group) => group.items);

export const ADMIN_HUB_SECTIONS: { title: string; items: AdminNavItem[] }[] = [
  {
    title: "Planner operations",
    items: ADMIN_NAV_GROUPS.find((g) => g.title === "Planner")?.items ?? [],
  },
  {
    title: "Catalog assets",
    items: ADMIN_NAV_GROUPS.find((g) => g.title === "Catalog Assets")?.items ?? [],
  },
  {
    title: "CRM & ops",
    items: [
      ...(ADMIN_NAV_GROUPS.find((g) => g.title === "CRM")?.items ?? []),
      ...(ADMIN_NAV_GROUPS.find((g) => g.title === "Ops")?.items ?? []),
    ],
  },
  {
    title: "Platform",
    items: ADMIN_NAV_GROUPS.find((g) => g.title === "Platform")?.items ?? [],
  },
];

/** @deprecated Use ADMIN_HUB_SECTIONS */
export const ADMIN_HUB_CARDS = ADMIN_HUB_SECTIONS.flatMap((section) => section.items);
