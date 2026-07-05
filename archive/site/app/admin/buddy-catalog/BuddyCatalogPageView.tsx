"use client";

import { AdminCatalogListView } from "./AdminCatalogListView";

/** @deprecated Archived 2026-06-26 — use ConfiguratorCatalogPageView / `/admin/planner-catalog`. */
export default function BuddyCatalogPageView() {
  return (
    <AdminCatalogListView
      title="Buddy catalog"
      description="Same configurator API as Planner catalog — parametric product CRUD with all sizing fields."
      catalogType="buddy"
    />
  );
}
