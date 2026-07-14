"use client";

import { AdminCatalogListView } from "./AdminCatalogListView";

export default function ConfiguratorCatalogPageView() {
  return (
    <AdminCatalogListView
      title="Configurator catalog"
      description="Editable configurator SKU lane for parametric, discrete, and fixed products. Use advanced JSON only when workstation rules, size options, or default footprints need direct payload changes; standard managed products stay on Standard catalog."
      catalogType="configurator"
    />
  );
}
