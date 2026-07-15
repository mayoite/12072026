"use client";

import { useMemo } from "react";
import Link from "next/link";
import { MagnifyingGlass as Search } from "@phosphor-icons/react";

import plannerCanvasConfig from "@/config/planner-canvas.json";
import { PLANNER_CATALOG_ITEMS } from "@/features/planner/catalog-api/workspaceCatalog";
import {
  formatCatalogDimensionsLabel,
  formatCatalogSeatFootprint,
  enrichCatalogItem,
} from "@/features/planner/catalog-api/catalogHierarchy";
import { useState } from "react";

export default function AdminWorkspaceCatalogPageView() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  const items = useMemo(() => {
    const enriched = PLANNER_CATALOG_ITEMS.map(enrichCatalogItem);
    const q = query.trim().toLowerCase();
    return enriched.filter((item) => {
      if (category && item.category !== category) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        (item.sku ?? "").toLowerCase().includes(q)
      );
    });
  }, [category, query]);

  const categories = useMemo(
    () => [...new Set(PLANNER_CATALOG_ITEMS.map((item) => item.category))].sort(),
    [],
  );

  return (
    <div className="mx-auto max-w-7xl md:p-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wide text-soft">Static ingest</p>
        <h1 className="text-2xl font-semibold text-strong">Workspace element library</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted">
          Read-only view of <code>workspaceCatalog</code>, the bundled static layer in the guest
          planner library. This route is for browse and audit only; editable products live in{" "}
          <Link href="/admin/catalog" className="text-primary hover:underline">
            Standard catalog
          </Link>{" "}
          and{" "}
          <Link href="/admin/planner-catalog" className="text-primary hover:underline">
            Configurator catalog
          </Link>
          . Live hydration also merges{" "}
          <Link href="/admin/planner-catalog" className="text-primary hover:underline">
            configurator SKUs
          </Link>{" "}
          and{" "}
          <Link href="/admin/catalog" className="text-primary hover:underline">
            managed products
          </Link>
          . Regenerate static items from CSV via{" "}
          <code className="rounded bg-subtle px-1">npx tsx scripts/ingest-planner-catalog.ts</code>.
        </p>
      </div>

      <div className="mb-4 flex flex-col gap-3 rounded-xl border border-soft bg-panel p-4 sm:flex-row sm:items-end">
        <label className="min-w-0 flex-1">
          <span className="mb-1 block text-xs font-medium text-muted">
            Search
          </span>
          <div className="relative">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-soft"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-lg border border-soft bg-panel py-2 pl-9 pr-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              placeholder="SKU, name, id…"
            />
          </div>
        </label>
        <label className="sm:w-56">
          <span className="mb-1 block text-xs font-medium text-muted">
            Category
          </span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-soft bg-panel px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mb-3 text-sm text-muted" aria-live="polite">
        {items.length} items
      </p>

      {items.length === 0 ? (
        <div
          className="rounded-xl border border-soft bg-panel p-6 text-center"
          role="status"
        >
          <p className="font-medium text-strong">
            No workspace items match these filters.
          </p>
          <p className="mt-1 text-sm text-muted">
            Change the search or category and try again.
          </p>
          <button
            type="button"
            className="mt-4 rounded-lg border border-soft px-3 py-2 text-sm font-medium text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onClick={() => {
              setQuery("");
              setCategory("");
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <ul
            className="grid gap-3 md:hidden"
            aria-label="Workspace catalog items"
          >
            {items.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-soft bg-panel p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-strong">
                      {item.shortName ?? item.name}
                    </p>
                    <p className="mt-1 break-all font-mono text-xs text-muted">
                      {item.sku ?? item.id}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-subtle px-2 py-1 text-xs text-muted">
                    {item.category}
                  </span>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div>
                    <dt className="text-xs text-soft">Seats</dt>
                    <dd className="mt-0.5 text-muted">
                      {item.seatCount ?? "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-soft">Footprint</dt>
                    <dd className="mt-0.5 text-muted">
                      {formatCatalogSeatFootprint(item)}
                    </dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-xs text-soft">Dimensions</dt>
                    <dd className="mt-0.5 text-muted">
                      {formatCatalogDimensionsLabel(item)}
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>

          <div className="hidden overflow-x-auto rounded-xl border border-soft bg-panel md:block">
            <table className="w-full min-w-[50rem] text-start text-sm">
              <thead className="border-b border-soft bg-subtle/50 text-xs uppercase tracking-wide text-soft">
                <tr>
                  <th className="px-4 py-3">SKU / ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Seats</th>
                  <th className="px-4 py-3">Footprint</th>
                  <th className="px-4 py-3">Raw fields</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-soft last:border-b-0">
                    <td className="px-4 py-3 font-mono text-xs text-muted">{item.sku ?? item.id}</td>
                    <td className="px-4 py-3 font-medium text-strong">{item.shortName ?? item.name}</td>
                    <td className="px-4 py-3 text-muted">{item.category}</td>
                    <td className="px-4 py-3 text-muted">{item.seatCount ?? "—"}</td>
                    <td className="px-4 py-3 text-muted">
                      <p>{formatCatalogSeatFootprint(item)}</p>
                      <p className="text-xs text-soft">{formatCatalogDimensionsLabel(item)}</p>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-soft">
                      w:{item.widthMm} d:{item.depthMm} h:{item.heightMm}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export function AdminCanvasConfigSection() {
  const config = plannerCanvasConfig;
  const rows: Array<{ group: string; key: string; value: string }> = [];

  for (const [group, values] of Object.entries(config)) {
    if (values && typeof values === "object") {
      for (const [key, value] of Object.entries(values as Record<string, unknown>)) {
        rows.push({ group, key, value: String(value) });
      }
    }
  }

  return (
    <section className="rounded-xl border border-soft bg-panel">
      <header className="border-b border-soft px-4 py-3">
        <h2 className="text-sm font-semibold text-strong">Canvas configuration</h2>
        <p className="mt-1 text-xs text-muted">
          From <code>config/planner-canvas.json</code> — edit in repo and redeploy to change bounds, scale, and viewport.
        </p>
      </header>
      <table className="text-sm">
        <thead className="border-b border-soft text-xs uppercase text-soft">
          <tr>
            <th className="px-4 py-2 text-start">Group</th>
            <th className="px-4 py-2 text-start">Parameter</th>
            <th className="px-4 py-2 text-start">Value</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.group}.${row.key}`} className="border-b border-soft last:border-b-0">
              <td className="px-4 py-2 text-muted">{row.group}</td>
              <td className="px-4 py-2 font-mono text-xs">{row.key}</td>
              <td className="px-4 py-2 font-medium text-strong">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
