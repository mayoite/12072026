import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptsDir, "..");
const repoRoot = path.resolve(siteRoot, "..");

/** @typedef {{ area: string, canonical: string, consumers: string, doNotDuplicate?: string }} OwnershipRow */

/** Repo-root folders (pnpm workspace). */
const repoFolders = {
  ".": {
    title: "Repository root (pnpm workspace)",
    why: "Thin wrapper: root package.json proxies scripts into site/ and tech-docs-generator/.",
    contains: [
      "site/ — Next.js app (oando-site)",
      "tech-docs-generator/ — Vite source for tech docs",
      "generated-documents/ — generated data, docs, and static site",
      "docs/ — reference documentation (architecture, api, database, audit)",
      "archive/ — historical outputs and archive/migrationdocs/",
      "plan/ — execution tracks",
      "pnpm-workspace.yaml, pnpm-lock.yaml, package.json",
      "AGENTS.md, Readme.md, CONTENTS.md (this file)",
      "Failures.md",
    ],
    see: ["Readme.md", "AGENTS.md", "DOC-MAP.md"],
    rules: ["Application code lives in site/, not at repo root"],
  },
  docs: {
    title: "Reference documentation",
    why: "Read-only specs and architecture — not live app code. Implementation is in site/.",
    contains: [
      "architecture/ — 01-MODULE-LAYOUT, 02-DOMAINS, 03-UI, 04-CSS, 05-DATA_FLOW",
      "api/ — README.md (contract source), ROUTE-INDEX.md",
      "database/ — schema, seeding, advisors, restore runbook",
      "audit/ — lane audits (pending only; see audit/README.md)",
    ],
    see: ["DOC-MAP.md", "site/app/api/"],
    rules: ["No phased plans here — use plans/", "Live ops log: Failures.md at repo root"],
  },
  archive: {
    title: "Historical artifacts",
    why: "Retired outputs, migration packets, and evidence — not imported by the live app.",
    contains: [
      "migrationdocs/ — migration playbook and handover (archived after merge)",
      "results/, outputs/, screenshots/ — test and audit history when present",
    ],
    rules: ["Prefer archive over delete", "Do not import from archive/ in site/"],
  },
  plans: {
    title: "Planning tracks",
    why: "Flat execution tracks and the shared quality bar.",
    contains: [
      "INDEX.md — active plan index",
      "00-QUALITY-BAR.md — shared product bar",
      "Planner-track/, Admin-track/, Site-track/, SEO-track/, Security-track/",
    ],
    see: ["DOC-MAP.md", "Failures.md"],
  },
  "tech-docs-generator": {
    title: "Tech stack docs (source)",
    why: "Vite + React mini-site in `tech-docs-generator/`; build output is written to `generated-documents/site/`.",
    contains: ["src/ — pages and data", "vite.config.ts — outDir `.tmp/generated-documents/site`"],
    see: ["README.md", "Readme_Techstack.md", "COVERAGE-REPORT.md"],
  },
};

/** Site package folders (under site/). */
const siteFolders = {
  ".": {
    title: "Next.js app (oando-site)",
    why: "All application source for oando.co.in. Root scripts proxy here via pnpm --filter oando-site.",
    contains: [
      "app/, features/, components/, lib/, tests/, scripts/, platform/, config/",
      "package.json, next.config.js, tsconfig.json",
    ],
    see: ["../Readme.md", "../AGENTS.md", "../DOC-MAP.md"],
  },
  app: {
    title: "Next.js App Router",
    why: "Routing layer only. Pages import from features/ and components/; business logic stays out of app/.",
    contains: [
      "(site)/ — public marketing routes",
      "planner/ — planner marketing + workspace routes",
      "api/ — Route handlers (server)",
      "css/ — shared FOCSS (tokens, bundles)",
      "admin/, crm/, ops/ — portal routes",
    ],
    rules: ["No heavy business logic in page files", "CSS tokens live in app/css/, not inline in routes"],
    see: ["docs/architecture/04-CSS-SOLUTION.md", "docs/architecture/02-DOMAINS.md"],
  },
  "app/(site)": {
    title: "Marketing site routes",
    why: "Public oando.co.in pages: home, products, catalog, contact, careers, legal, etc.",
    contains: ["One folder per route (page.tsx + route-local components)", "globals.css — imports app/css/index.css"],
    rules: ["Route folders mirror URL paths", "Reuse components/home, components/site, features/site"],
  },
  "app/api": {
    title: "API route handlers",
    why: "Server endpoints for catalog, planner saves, admin, AI, tracking — called from client or scripts.",
    contains: ["admin/ — admin portal APIs", "planner/ — planner persistence & AI", "products/, categories/ — catalog", "ai/, ai-advisor/, ai-assist/ — AI proxies"],
    rules: ["Use platform/supabase or platform/drizzle — never raw credentials in handlers"],
  },
  "app/css": {
    title: "Shared CSS (FOCSS)",
    why: "Single design system for site + planner. Tokens and bundles avoid hardcoded colors in TSX.",
    contains: ["core/theme.css, utilities.css, components.css", "core/locked/site|admin|planner — surface modules"],
    see: ["docs/architecture/04-CSS-SOLUTION.md", "docs/architecture/02-DOMAINS.md"],
  },
  "app/css/base": {
    title: "Global CSS primitives",
    why: "Low-level primitives imported before core tokens — animations, resets not tied to a route.",
    contains: ["animations.css and other cross-app primitives"],
  },
  "app/css/core": {
    title: "FOCSS core layers",
    why: "Tokens, utilities, chrome, and per-surface bundles (site vs planner).",
    contains: ["Flat base files at core/ root", "locked/ — site, admin, planner modules only"],
  },
  "app/css/core/locked/planner": {
    title: "Planner CSS (locked surface)",
    why: "Workspace-specific CSS for the planner editor — flat files under locked/planner/.",
    contains: [
      "marketing.css, open3d-workspace.css — layout entry bundles",
      "planner-tokens.css, planner-shell.css, open3d.css — workspace base leaves",
      "marketing-*, landing-* — marketing and landing leaf styles",
    ],
    rules: ["Import through marketing.css or open3d-workspace.css from layouts", "Keep planner-only selectors under .planner-workspace"],
  },
  "app/planner": {
    title: "Planner routes",
    why: "URL surface for the unified planner: marketing landing, guest workspace, authenticated canvas.",
    contains: ["(marketing)/ — landing, features, help", "(workspace)/canvas/, guest/ — editor entry points"],
    rules: ["Editor implementation is in features/planner/, not here"],
  },
  "app/admin": {
    title: "Admin portal routes",
    why: "Internal admin UI for catalog, plans, themes, analytics.",
    contains: ["analytics/, catalog/, planner-catalog/, plans/, themes/, features/"],
  },
  "app/crm": {
    title: "CRM routes",
    why: "Client and project management surfaces for sales/ops.",
    contains: ["clients/, projects/, quotes/"],
  },
  "app/ops": {
    title: "Ops portal routes",
    why: "Operational tools (e.g. customer queries) for internal staff.",
    contains: ["customer-queries/"],
  },
  features: {
    title: "Feature modules (domain logic)",
    why: "Feature-sliced design: each product area owns hooks, stores, and UI tied to its domain.",
    contains: [
      "planner/ — canonical workspace planner (editor, 3D, catalog, AI)",
      "catalog/ — product catalog domain (filters, resolvers, schemas)",
      "shared/ — auth UI, shell, cross-feature hooks",
      "admin/, ops/, crm/, site/ (data, assistant, advisor)",
    ],
    ownership: [
      {
        area: "Catalog filters & product resolution",
        canonical: "lib/catalog/site/",
        consumers: "app/(site)/products, components/products, features/planner/catalog-api",
        doNotDuplicate: "lib/catalog/ — SSG merge, blocks2d, seed scripts only",
      },
      {
        area: "Marketing copy & local catalog index",
        canonical: "features/site/data/",
        consumers: "lib/catalog/site, components/home, lib/helpers/seo",
        doNotDuplicate: "lib/catalog/site/ — no hardcoded nav/copy",
      },
      {
        area: "Auth UI & session types",
        canonical: "features/shared/auth/",
        consumers: "app/(site)/login, app/(site)/access",
        doNotDuplicate: "lib/auth/ — server session, cookies, redirects",
      },
      {
        area: "Marketing presentational sections",
        canonical: "components/home, components/site",
        consumers: "app/(site) routes",
        doNotDuplicate: "features/ — domain state belongs in features/, not components/",
      },
    ],
    rules: ["Planner code only in features/planner/", "Do not revive archive/ planner variants"],
  },
  "features/planner": {
    title: "Canonical planner",
    why: "Single source for /planner workspace: open3d editor, catalog placement, 3D viewer, persistence, AI assist.",
    contains: [
      "project/ — live canvas document host (model, store, catalog, export)",
      "editor/, canvas/, 3d/ — workspace UI",
      "catalog-api/ — panel UI, bridges, ingest",
      "cloud-store/ — cloud saves, review persistence, workspace stores",
      "landing/, onboarding/ — guest funnel",
      "shared/, lib/, hooks/ — cross-cutting helpers",
    ],
    ownership: [
      {
        area: "Canvas & workspace shell",
        canonical: "features/planner/editor/, features/planner/ui/",
        consumers: "app/planner/(workspace)/",
        doNotDuplicate: "app/planner/ — routes only, no editor logic",
      },
      {
        area: "Planner-specific React chrome",
        canonical: "features/planner/components/, features/planner/shared/components/",
        consumers: "features/planner/editor, features/planner/landing",
        doNotDuplicate: "components/ — marketing UI only",
      },
      {
        area: "Client state (Zustand)",
        canonical: "features/planner/cloud-store/",
        consumers: "editor, hooks, persistence",
        doNotDuplicate: "lib/store/ — site quote cart only",
      },
      {
        area: "Document schema & permissions",
        canonical: "features/planner/model/",
        consumers: "persistence, API /api/plans",
        doNotDuplicate: "platform/drizzle/ — DB row shape only",
      },
      {
        area: "Site product catalog",
        canonical: "lib/catalog/site/ + lib/catalog/",
        consumers: "features/planner/catalog-api via catalogBridge",
        doNotDuplicate: "Duplicate ingest in planner/catalog-api/ except placement adapters",
      },
    ],
    see: ["../../Readme.md", "../../Plans/Planner-track/BOARD.md"],
  },
  "features/planner/project": {
    title: "Live planner canvas host",
    why: "Plan document, placement catalog, workspace store, export — start here for canvas behavior.",
    contains: ["model/, store/, catalog/, persistence/, shared/document/"],
  },
  "features/planner/catalog-api": {
    title: "Planner catalog API",
    why: "Catalog panel, bridges, ingest — not the live canvas document host (see project/catalog/).",
    contains: ["ingest/", "CatalogPanel.tsx", "catalogStore.ts", "catalogBlockBridge.ts"],
    see: ["scripts/ingest-planner-catalog.ts", "features/planner/project/catalog/README.md"],
  },
  "features/planner/cloud-store": {
    title: "Planner cloud persistence",
    why: "Zustand stores, cloud saves, review persistence, offline queue.",
    contains: ["plannerPersistence, workspaceStore, plannerProjectStore, reviewPersistence, etc."],
  },
  "features/planner/3d": {
    title: "Planner 3D",
    why: "Three.js / R3F scene built from 2D document for preview and walkthrough.",
    contains: ["Scene types, mesh builders, camera presets"],
  },
  "features/planner/landing": {
    title: "Planner marketing UI",
    why: "Landing page sections and CTA flow into guest workspace.",
    contains: ["Hero, features grid, social proof blocks used by app/planner/(marketing)"],
  },
  "features/planner/persistence": {
    title: "Planner persistence",
    why: "Client drafts, autosave, cloud save adapters to API + Drizzle plans table.",
    contains: ["Draft types, save/load orchestration"],
  },
  "features/planner/shared": {
    title: "Planner shared kernel",
    why: "Code shared across editor, export, and 3D without circular imports.",
    contains: ["boq/ — quote cart bridge", "catalog/ — adapters", "export/ — PDF/BOQ", "document/, engine/, types/"],
  },
  "features/planner/ui": {
    title: "Planner shell UI",
    why: "Chrome around the canvas: top bar, panels, modals, responsive layout.",
    contains: ["InspectorPanel, catalog panel, project setup gate"],
  },
  "features/shared": {
    title: "Cross-feature shared code",
    why: "Auth, shell layout, analytics hooks used by site, planner, and admin.",
    contains: ["auth/ — AuthShell, session hooks", "components/ — GuestBadge, etc.", "shell/, entry/, dashboard/"],
  },
  "lib/catalog/site": {
    title: "Catalog domain",
    why: "Product filtering, schemas, and resolvers shared by site catalog and planner.",
    contains: ["Filter logic, category trees, product resolution"],
  },

  "features/site": {
    title: "Site product module",
    why: "Public marketing site behavior — copy, advisor, chat assistant.",
    contains: [
      "data/ — marketing copy, navigation, SEO, route classification",
      "assistant/ — marketing chat widget",
      "advisor/ — catalog advisor types and helpers",
    ],
  },
  "features/admin": {
    title: "Admin feature module",
    why: "Internal inventory tools — SVG editor, publish pipeline, pricing, catalog admin APIs.",
    contains: ["svg-editor/", "api/", "pricing/", "data/price-books/", "ui/ (legacy shell components)"],
  },
  "features/crm": {
    title: "CRM feature module",
    why: "Client/project quote flows for sales team.",
    contains: ["stores/ — CRM state"],
  },
  "features/ops": {
    title: "Ops feature module",
    why: "Internal ops surfaces (customer queries management).",
    contains: ["Ops page views and data hooks"],
  },
  "features/site/assistant": {
    title: "Site chat assistant",
    why: "Marketing site bot widget (AdvancedBot).",
    contains: ["Chat UI and message handling"],
  },
  components: {
    title: "Shared React components",
    why: "Presentational and composite UI reused across routes. No domain stores here — use features/.",
    contains: ["ui/ — primitives (buttons, dialogs)", "home/, site/ — marketing sections", "products/ — catalog cards", "shared/ — cross-page widgets"],
    ownership: [
      {
        area: "Marketing sections & chrome",
        canonical: "components/home/, components/site/, components/products/",
        consumers: "app/(site)/ routes",
        doNotDuplicate: "features/planner/ — planner workspace UI",
      },
      {
        area: "App-wide UI primitives",
        canonical: "components/ui/",
        consumers: "components/*, features/shared, app/",
        doNotDuplicate: "features/planner/shared/components/ — planner-only chrome",
      },
      {
        area: "Cross-route widgets (site)",
        canonical: "components/shared/",
        consumers: "marketing routes",
        doNotDuplicate: "features/shared/components/ — auth badges, shell pieces",
      },
      {
        area: "Auth & shell (stateful)",
        canonical: "features/shared/components/, features/shared/auth/components/",
        consumers: "login, access, dashboard layouts",
        doNotDuplicate: "components/ — keep dumb/presentational",
      },
    ],
    rules: ["Prefer features/ for stateful domain UI", "ui/ stays dumb and styled via FOCSS tokens"],
  },
  "components/ui": {
    title: "UI primitives",
    why: "Atomic components (Radix-based) shared app-wide.",
    contains: ["Button, Dialog, Tabs, Accordion wrappers"],
  },
  "components/home": {
    title: "Homepage components",
    why: "homepage-v2 sections: hero, collections, projects, contact.",
    contains: ["Section components imported by app/(site) home route"],
  },
  "components/site": {
    title: "Site chrome components",
    why: "Header, footer, mega menu, mobile drawer for marketing layout.",
    contains: ["Navigation, layout shells"],
  },
  "components/products": {
    title: "Product display components",
    why: "Catalog grids, product cards, filters UI for /products and /catalog.",
    contains: ["ProductCard, filter panels, compare UI"],
  },
  "components/shared": {
    title: "Misc shared components",
    why: "Widgets used on multiple marketing routes but not generic enough for ui/.",
    contains: ["Carousels, media blocks, reusable sections"],
  },
  lib: {
    title: "Shared libraries",
    why: "Pure utilities, clients, and helpers with no React views. Imported by features/ and app/.",
    contains: [
      "catalog/ — static params, product merge, blocks2d",
      "auth/, supabase/ — client-safe auth helpers",
      "ai/, analytics/, tracking/",
      "hooks/, helpers/, types/, ui/ (non-component helpers)",
    ],
    ownership: [
      {
        area: "Server session & route guards",
        canonical: "lib/auth/",
        consumers: "app/api, app/crm, app/admin, app/planner layouts",
        doNotDuplicate: "features/shared/auth/ — React providers and login UI",
      },
      {
        area: "Catalog SSG & merge pipeline",
        canonical: "lib/catalog/",
        consumers: "lib/catalog/site/getProducts, app/(site)/products",
        doNotDuplicate: "lib/catalog/site/ — filter UX and domain types",
      },
      {
        area: "Supabase browser client",
        canonical: "lib/supabase/",
        consumers: "features, components (client components)",
        doNotDuplicate: "platform/supabase/ — migrations, admin, edge functions",
      },
      {
        area: "Site quote cart",
        canonical: "lib/store/",
        consumers: "marketing quote flows",
        doNotDuplicate: "features/planner/cloud-store/ — planner Zustand only",
      },
    ],
  },
  platform: {
    title: "Infrastructure adapters",
    why: "Protected layer for DB and third-party SDKs. App code imports from here, not raw SDKs scattered in features/.",
    contains: ["supabase/ — clients, migrations, edge functions", "drizzle/ — schema, db.ts, migrations", "appwrite/ — legacy/alternate backend"],
    rules: ["Migrations live here only", "Never commit service-role keys"],
  },
  "platform/supabase": {
    title: "Supabase",
    why: "Primary backend: auth, storage, Postgres, RLS migrations.",
    contains: ["client.ts, server.ts, admin.ts", "migrations/, migrations.admin/", "functions/assistant-chat/"],
  },
  "platform/drizzle": {
    title: "Drizzle ORM",
    why: "Typed SQL access for planner plans and admin tables alongside Supabase.",
    contains: ["schema.ts, db.ts, drizzle.config.ts", "migrations/"],
  },
  "platform/appwrite": {
    title: "Appwrite client",
    why: "Legacy/alternate BaaS adapter kept for migration reference.",
    contains: ["appwrite.ts, client.ts"],
  },
  config: {
    title: "Configuration",
    why: "Build tooling, generated types, and deployment manifests — not runtime app code.",
    contains: ["build/ — eslint, tsconfig, playwright, postcss", "database/types/ — generated Supabase types", "deployment/, environment/", "route-contract.json — expected routes and classifications"],
  },
  "config/build": {
    title: "Build & test config",
    why: "Tooling configs referenced by package.json and CI.",
    contains: ["eslint.config.mjs, tsconfig.json (base), playwright.config.ts, postcss"],
  },
  "config/database": {
    title: "Database types",
    why: "Generated TypeScript types from Supabase schema.",
    contains: ["types/database.types.ts — regen via npm run db:types"],
  },
  "config/deployment": {
    title: "Deployment config",
    why: "Hosting manifests (DigitalOcean, Vercel-related templates).",
    contains: ["digitalocean/ — app spec templates"],
  },
  "config/environment": {
    title: "Environment templates",
    why: "Documented env var shapes and example configs.",
    contains: ["Env documentation and templates"],
  },
  "features/admin/data": {
    title: "Admin local runtime data",
    why: "Mutable dev/E2E files (price-book JSON + audit log). Seeds live in pricing/fixtures/.",
    contains: ["price-books/*.json", "price-books/_price-book-audit.jsonl"],
  },
  "features/site/data": {
    title: "Site static data",
    why: "Marketing copy, nav trees, and local catalog index for SSG.",
    contains: ["localCatalogIndex.json, navigation-data, homepage content modules"],
  },

  tests: {
    title: "All tests",
    why: "Single folder for Vitest unit tests and Playwright e2e/a11y specs.",
    contains: [
      "*.test.ts(x) — Vitest",
      "*.spec.ts — Playwright",
      "setup.ts, guestProjectSetup.ts — helpers",
      "INVENTORY.md — auto file list (pnpm run docs:sync)",
    ],
    see: ["../../Readme.md", "INVENTORY.md"],
    rules: ["No subfolders — flat layout with prefixed names", "No co-located tests in features/"],
  },
  scripts: {
    title: "CLI scripts",
    why: "One-off and recurring maintenance: seed, migrations, catalog ingest, audits, recovery, doc generation.",
    contains: [
      "TypeScript (.ts), Node (.mjs), Python (.py), shell deploy scripts",
      "generate-docs.mjs — CONTENTS.md + test inventory (+ optional coverage)",
    ],
    see: ["../../DOC-MAP.md"],
    rules: ["Wire recurring tasks to package.json", "Write outputs to results/"],
  },
  "results/tooling-docs": {
    title: "Tooling doc exports",
    why: "Snapshots from audit/render scripts (formerly tools/docs/).",
    contains: ["ops/ — external asset audits and similar JSON exports"],
  },
  "results/tooling-reports": {
    title: "Tooling reports",
    why: "Intermediate analysis outputs (formerly tools/reports/).",
    contains: ["Catalog asset arrangement and similar JSON reports"],
  },
  public: {
    title: "Static public assets",
    why: "Files served at / without bundling: images, fonts, 3D models, vendor CDN mirrors.",
    contains: ["images/, fonts/, models/, cdn/", "favicon and static downloads"],
    rules: ["Large assets prefer CDN/Supabase storage; public/ for essentials only"],
  },
  "public/images": {
    title: "Public images",
    why: "Static image assets referenced by URL in marketing and planner.",
    contains: ["Product placeholders, icons, marketing imagery"],
  },
  "public/models": {
    title: "3D models",
    why: "GLB/OBJ assets for planner 3D viewer and product previews.",
    contains: ["Furniture and scene models"],
  },
  results: {
    title: "Generated evidence",
    why: "Outputs from tests, audits, scripts — not source code. Safe to regenerate.",
    contains: [
      "audits/ — security, lighthouse, merge checklists",
      "screenshots/ — Playwright captures",
      "coverage/, docs-rendered/, project-tree.csv, repo-dir-tree.xlsx",
      "tooling-docs/, tooling-reports/ — legacy tools/ outputs",
    ],
    rules: ["Do not hand-edit as source of truth", "Commit selectively for handover evidence"],
  },
  "results/audits": {
    title: "Audit reports",
    why: "Human-readable audit outputs from quality, security, and database scripts.",
    contains: [
      "security-audit.md, lighthouse-audit.md, repo-merge-checklist.txt",
      "supabase-schema-audit.md, supabase-admin-schema-audit.md (+ json)",
      "missing-product-images-backfill-report.json, canonical-metadata-backfill-report.json",
      "slug-id-integrity-audit.json (npm run audit:slug-id)",
    ],
  },
  "results/screenshots": {
    title: "Screenshot evidence",
    why: "Visual regression and navigation smoke captures.",
    contains: ["Playwright and capture-*.mjs outputs"],
  },
};

function render({ title, why, contains, rules, see, ownership }) {
  const lines = [
    `# ${title}`,
    "",
    "## Why this folder exists",
    "",
    why,
    "",
    "## What is here",
    "",
    ...contains.map((c) => `- ${c}`),
  ];
  if (ownership?.length) {
    lines.push(
      "",
      "## Ownership",
      "",
      "| Area | Canonical owner | Typical consumers | Do not duplicate in |",
      "|------|-----------------|-------------------|---------------------|",
      ...ownership.map(
        (row) =>
          `| ${row.area} | \`${row.canonical}\` | ${row.consumers} | ${row.doNotDuplicate ?? "—"} |`,
      ),
    );
  }
  if (rules?.length) {
    lines.push("", "## Rules", "", ...rules.map((r) => `- ${r}`));
  }
  if (see?.length) {
    lines.push("", "## See also", "", ...see.map((s) => `- \`${s}\``));
  }
  lines.push("", "---", "*Generated by `site/scripts/generate-contents-md.mjs` — edit manifest, then `pnpm run docs:sync:all` from repo root.*", "");
  return lines.join("\n");
}

function writeContents(baseRoot, entries) {
  let count = 0;
  for (const [rel, meta] of Object.entries(entries)) {
    const dir = rel === "." ? baseRoot : path.join(baseRoot, rel);
    if (!fs.existsSync(dir)) continue;
    fs.writeFileSync(path.join(dir, "CONTENTS.md"), render(meta), "utf8");
    count += 1;
  }
  return count;
}

const written = writeContents(repoRoot, repoFolders) + writeContents(siteRoot, siteFolders);
console.log(`Wrote ${written} CONTENTS.md files (repo: ${repoRoot}, site: ${siteRoot})`);
