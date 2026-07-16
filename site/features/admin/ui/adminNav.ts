import type { Icon } from "@phosphor-icons/react";
import {
  ChartBar as BarChart3,
  Package as Boxes,
  ClipboardText as ClipboardList,
  FileText,
  Flag,
  Kanban as FolderKanban,
  SquaresFour as LayoutDashboard,
  MapTrifold as Map,
  Package,
  Palette,
  NotePencil as PenSquare,
  Gear as Settings,
  Polygon as Shapes,
  Users,
  Books as Library,
} from "@phosphor-icons/react";

import {
  CRM_CLIENTS_PATH,
  CRM_PROJECTS_PATH,
  CRM_QUOTES_PATH,
} from "@/features/crm/crmRoutes";

export type AdminNavItem = {
  href: string;
  label: string;
  description: string;
  icon: Icon;
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

/** Sidebar groups — short IA: Overview · Planner · Catalog · CRM · System */
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
        description: "Saved planner documents",
        icon: ClipboardList,
      },
      {
        href: "/admin/features",
        label: "Features",
        description: "Toolbar and capability toggles",
        icon: Flag,
      },
      {
        href: "/admin/analytics",
        label: "Analytics",
        description: "Usage volume and export activity",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Catalog",
    items: [
      {
        href: "/admin/catalog",
        label: "Products",
        description: "Editable managed products",
        icon: Package,
      },
      {
        href: "/admin/planner-catalog",
        label: "Configurator",
        description: "Parametric and discrete SKUs",
        icon: Shapes,
      },
      {
        href: "/admin/workspace-catalog",
        label: "Library",
        description: "Read-only static workspace elements",
        icon: Library,
      },
      {
        href: "/admin/svg-editor",
        label: "SVG symbols",
        description: "Draw, preview, and publish 2D symbols",
        icon: PenSquare,
      },
      {
        href: "/admin/price-books",
        label: "Prices",
        description: "BOQ price books draft → activate",
        icon: FileText,
      },
    ],
  },
  {
    title: "CRM",
    items: [
      {
        href: "/admin/crm",
        label: "Hub",
        description: "Pipeline overview and quick actions",
        icon: LayoutDashboard,
      },
      {
        href: CRM_CLIENTS_PATH,
        label: "Clients",
        description: "Contacts and companies",
        icon: Users,
      },
      {
        href: CRM_PROJECTS_PATH,
        label: "Projects",
        description: "Deals linked to planner docs",
        icon: FolderKanban,
      },
      {
        href: CRM_QUOTES_PATH,
        label: "Quotes",
        description: "Drafts, sent, approved",
        icon: FileText,
      },
      {
        href: "/admin/customer-queries",
        label: "Queries",
        description: "Inbound contact form queue",
        icon: Boxes,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        href: "/admin/settings",
        label: "Settings",
        description: "Canvas bounds and flags",
        icon: Settings,
      },
      {
        href: "/admin/themes",
        label: "Themes",
        description: "Planner material tokens",
        icon: Palette,
      },
      {
        href: "/admin/inventory",
        label: "Routes",
        description: "App pages and API map",
        icon: Map,
      },
    ],
  },
];

// GS-BP-04 · handover-routing.md · PLAN-FAIL-0403/0417

export const ADMIN_NAV_ITEMS: AdminNavItem[] = ADMIN_NAV_GROUPS.flatMap(
  (group) => group.items,
);

/** Hub dashboard sections (Dashboard omitted — user is already on it). */
export const ADMIN_HUB_SECTIONS: { title: string; items: AdminNavItem[] }[] = [
  {
    title: "Planner operations",
    items: ADMIN_NAV_GROUPS.find((g) => g.title === "Planner")?.items ?? [],
  },
  {
    title: "Catalog",
    items: ADMIN_NAV_GROUPS.find((g) => g.title === "Catalog")?.items ?? [],
  },
  {
    title: "CRM & ops",
    items: ADMIN_NAV_GROUPS.find((g) => g.title === "CRM")?.items ?? [],
  },
  {
    title: "System",
    items: ADMIN_NAV_GROUPS.find((g) => g.title === "System")?.items ?? [],
  },
];

/** Structural KPI shortcuts on the admin hub (no live counts — open the surface). */
export const ADMIN_HUB_KPIS: ReadonlyArray<{
  label: string;
  href: string;
  hint: string;
  tone: "info" | "success" | "warn" | "neutral";
}> = [
  {
    label: "Customer queries",
    href: "/admin/customer-queries",
    hint: "Open inbound queue",
    tone: "warn",
  },
  {
    label: "Quotes",
    href: CRM_QUOTES_PATH,
    hint: "Review drafts",
    tone: "info",
  },
  {
    label: "Plans",
    href: "/admin/plans",
    hint: "Saved layouts",
    tone: "neutral",
  },
  {
    label: "SVG symbols",
    href: "/admin/svg-editor",
    hint: "Publish pipeline",
    tone: "success",
  },
];



/** @deprecated Use ADMIN_HUB_SECTIONS */
export const ADMIN_HUB_CARDS = ADMIN_HUB_SECTIONS.flatMap((section) => section.items);

/** Resolve the best-matching nav item for a pathname (longest href wins). */
export function resolveAdminNavItem(pathname: string): AdminNavItem | null {
  const normalized = pathname.endsWith("/") && pathname.length > 1
    ? pathname.slice(0, -1)
    : pathname;
  let best: AdminNavItem | null = null;
  for (const item of ADMIN_NAV_ITEMS) {
    const href = item.href.endsWith("/") && item.href.length > 1
      ? item.href.slice(0, -1)
      : item.href;
    if (href === "/admin") {
      if (normalized === "/admin") best = item;
      continue;
    }
    if (normalized === href || normalized.startsWith(`${href}/`)) {
      if (!best || href.length > best.href.length) best = item;
    }
  }
  return best;
}
