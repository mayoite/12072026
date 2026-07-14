"use client";

import { AdminCatalogListView } from "./AdminCatalogListView";

export default function AdminCatalogPageView() {
  return (
    <AdminCatalogListView
      title="Standard catalog"
      description="Editable lane for planner-managed products in `planner_managed_products`: dimensions, mesh type, pricing, and planner visibility. Use Workspace library for static read-only browse and Configurator catalog for parametric or footprint-driven SKUs."
      catalogType="standard"
    />
  );
}
