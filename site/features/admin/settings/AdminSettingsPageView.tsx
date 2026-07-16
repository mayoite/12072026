"use client";

import Link from "next/link";
import { ArrowSquareOut as ExternalLink } from "@phosphor-icons/react";

import { getAllFlagsGrouped, DEFAULT_FLAGS, type FeatureFlagName } from "@/features/planner/lib/featureFlags";
import { AdminCanvasConfigSection } from "../workspace-catalog/AdminWorkspaceCatalogPageView";

const ENV_HINTS = [
  { key: "NEXT_PUBLIC_SUPABASE_URL", purpose: "Supabase project URL for cloud saves and catalog" },
  { key: "SUPABASE_SERVICE_ROLE_KEY", purpose: "Server-side catalog CRUD (admin API)" },
  { key: "OPENAI_API_KEY / ANTHROPIC_API_KEY", purpose: "AI Assist layout suggestions" },
  { key: "SUPABASE_AUTH_DATABASE_URL", purpose: "Admin Postgres (planner saves, migrations)" },
] as const;

export default function AdminSettingsPageView() {
  const grouped = getAllFlagsGrouped();

  return (
    <div className="admin-page space-y-8">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">Platform parameters</p>
          <h1 className="admin-page__title">Settings & configuration</h1>
          <p className="admin-page__copy">
          Reference for planner canvas limits, feature-flag defaults, environment variables, and catalog data sources.
          Toggle live flags on the{" "}
          <Link href="/admin/features" className="text-primary underline underline-offset-2">
            Features
          </Link>{" "}
          page.
          </p>
        </div>
      </header>

      <AdminCanvasConfigSection />

      <section className="admin-panel">
        <header className="admin-panel__header">
          <h2 className="text-sm font-semibold text-strong">Feature flag defaults</h2>
          <p className="mt-1 text-xs text-muted">
            Shipped defaults from code. Runtime overrides may come from Supabase or local storage.
          </p>
        </header>
        <div className="divide-y divide-soft">
          {grouped.map((group) => (
            <div key={group.group} className="px-4 py-3">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-soft">{group.group}</h3>
              <ul className="space-y-1">
                {group.flags.map((flag) => (
                  <li key={flag.name} className="flex items-start justify-between gap-4 text-sm">
                    <span>
                      <code className="text-xs">{flag.name}</code>
                      <span className="ml-2 text-muted">{flag.description}</span>
                    </span>
                    <span
                      className={`admin-badge shrink-0 ${DEFAULT_FLAGS[flag.name as FeatureFlagName] ? "text-strong" : "admin-badge--hidden"}`}
                    >
                      {DEFAULT_FLAGS[flag.name as FeatureFlagName] ? "on" : "off"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-panel">
        <header className="admin-panel__header">
          <h2 className="text-sm font-semibold text-strong">Environment variables</h2>
          <p className="mt-1 text-xs text-muted">Set in Render dashboard or local <code>.env.local</code>.</p>
        </header>
        <ul className="divide-y divide-soft">
          {ENV_HINTS.map((hint) => (
            <li key={hint.key} className="px-4 py-3 text-sm">
              <code className="text-xs text-strong">{hint.key}</code>
              <p className="mt-0.5 text-muted">{hint.purpose}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="admin-panel p-4">
        <h2 className="text-sm font-semibold text-strong">Catalog data paths</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li>
            <Link href="/admin/workspace-catalog" className="text-primary underline underline-offset-2">
              Workspace library
            </Link>{" "}
            — read-only static ingest (<code>features/planner/catalog-api/workspaceCatalog</code>)
          </li>
          <li>
            <Link href="/admin/catalog" className="text-primary underline underline-offset-2">
              Standard catalog
            </Link>{" "}
            — editable managed products in <code>planner_managed_products</code>
          </li>
          <li>
            <Link href="/admin/planner-catalog" className="text-primary underline underline-offset-2">
              Configurator catalog
            </Link>{" "}
            — editable <code>configurator_products</code> payloads for parametric, discrete, and fixed SKUs
          </li>
          <li>
            Guest planner library — static + configurator + managed (hydrated at runtime)
          </li>
          <li>
            <Link href="/admin/inventory" className="inline-flex gap-1 text-primary underline underline-offset-2">
              Route inventory <ExternalLink size={12} />
            </Link>{" "}
            — app routes and API map (not product stock)
          </li>
        </ul>
      </section>
    </div>
  );
}
