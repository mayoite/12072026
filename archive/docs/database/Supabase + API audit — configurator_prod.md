Supabase + API audit — configurator_products and planner catalog read path
Scope: validate every assumption in plans/merge-configurator-catalog.md against the live repo. Source files only; no DB or HTTP calls.
1. Supabase wiring
Server clients (two distinct paths)
- lib/supabase/server.ts:6 — createServerClient() — SSR, uses NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY, threads cookies. Used for user sessions / RLS-bound reads.
- app/api/admin/_lib/server.ts:22 — createAdminServiceClient() — uses SUPABASE_URL (or fallback NEXT_PUBLIC_SUPABASE_URL) + SUPABASE_SERVICE_ROLE_KEY, persistSession: false. Bypasses RLS. Returns null if env missing.
Env policy
- lib/supabase/env.ts:34 throws on missing public env; app/api/admin/_lib/server.ts:8 is non-throwing and returns null so routes can degrade gracefully.
- lib/supabase/types.ts is stale — contains only image_assets. Neither planner_managed_products nor configurator_products is typed. All catalog code uses untyped any casts (see lib/api/catalogAdminHandlers.ts:484,531,575,598,635).
Migrations
- site/platform/supabase/migrations/20260601120000_create_configurator_products.sql creates the table:
- PK id uuid, slug text unique not null, name, category, family, brand_name, sizing_type CHECK in ('parametric','discrete','fixed'), workstation jsonb, size_options jsonb default '[]', default_footprint jsonb, derived_rules jsonb, materials text[], thumbnail_url, model_3d_url, description, active boolean default true, created_at, updated_at.
- Indexes: (category), (active). Trigger touch_configurator_products_updated_at.
- RLS enabled. One policy: "configurator_products public read active" … using (active = true) for select. No write policy — writes only via service role.
- 20260620050600_add_missing_indexes.sql:76-81 adds (family), (created_at desc), (category, active).
- planner_managed_products table is referenced in code (38 hits) but no create table migration exists in site/platform/supabase/migrations/**. Either it was created by hand in the live DB, or its DDL lives outside the repo. This is a real gap — flag below.
- platform/drizzle/schema.ts only defines profiles, plans, teams, team_members, invites, audit_events. Drizzle is a parallel schema source that does not include either catalog table. Drizzle migrations live in platform/drizzle/migrations/ (0000_daffy_longshot.sql, 0001_add_missing_indexes.sql) — separate world from Supabase migrations.
2. API routes — what exists today
Public planner read (single, narrow)
- app/api/planner/catalog/route.ts — GET, no auth, uses createAdminServiceClient() (service role) to read planner_managed_products with active = true, maps via managedProductRowToCatalogItem → CatalogItem, returns { items, total, source }. Has applyPlannerRouteTelemetry instrumentation.
- No /api/planner/catalog/configurator exists. Confirms the plan's §6a gap.
Admin write surface (consolidated, behind withAuth)
- app/api/admin/catalogs/[type]/route.ts — GET / POST, role admin, rate-limited; dispatches via resolveCatalogType to:
- listStandardCatalog / createStandardCatalog (planner_managed_products)
- listConfiguratorCatalog / createConfiguratorCatalog (configurator_products)
- app/api/admin/catalogs/[type]/[id]/route.ts — PATCH / DELETE, includes active-only toggle path for configurator, and soft-archive on DELETE.
- Legacy shim: app/api/admin/catalog/route.ts — @deprecated, forwards to listStandardCatalog / createStandardCatalog.
- lib/api/catalogAdminHandlers.ts is the single implementation for all four catalog handlers; uses untyped any casts; conflict handling on 23505; soft-delete on configurator; hard-delete on standard.
Auth + service-role pattern
- Admin GET on configurator goes through withAuth → requireAdminSession (cookie-bound user must have role: admin in app_metadata or user_metadata) and uses createAdminServiceClient for the actual DB call. That means admin-list of configurator does work today, but anon read of configurator_products via the planner-public route does not exist even though the RLS policy explicitly permits it.
3. What's right in the plan
- Three catalogs, three types, only configurator has no planner reader — confirmed exactly.
- configurator_products RLS allows anon select where active = true — confirmed. So an unauthenticated route could use either the anon SSR client or the service-role admin client to read it. Plan §6a recommended service role; either works. Anon SSR is the cleaner choice given the policy is already public-active and matches the pattern that other public surfaces follow.
- Footprint unit mismatch (Product.* mm vs CatalogItem.* cm via /10) — confirmed; managedProductRowToCatalogItem:88-90,managedProductCatalogBridge.ts:42-44.
- mergeCatalogItems.ts currently 2-arg, keyed by id — confirmed. Plan §4's switch to layered + slug-keyed dedup is correct.
4. What's wrong or imprecise in the plan — corrections needed
4a. Dedup key
- Plan §4 says "dedup key is slug, not id". But the current mergeWorkspaceCatalogItems keys by id (mergeCatalogItems.ts:13) and managedProductRowToCatalogItem sets CatalogItem.id = row.id (uuid) while sku = row.slug. The planner CatalogItem type has no canonical slug field — only id and sku. So a slug-based merge requires either:
1. Adding slug to CatalogItem (extension; touches the type), or
2. Mapping Product.slug → CatalogItem.id in the new configurator bridge, accepting that the configurator row's uuid is lost on the planner side, and changing managedProductRowToCatalogItem to use row.slug as the id for consistency (regression risk: existing items already in the field have uuid ids in the recent-placement localStorage).
Recommendation: keep merge keyed by id, set configurator bridge's CatalogItem.id = product.slug; leave managed untouched. Conflict only happens if a managed row's uuid id literally equals a configurator slug — collision-free in practice. Drop the slug-precedence claim from the plan.
4b. Endpoint client choice
- Plan §6a says "uses the existing Supabase server client (same pattern as app/api/planner/catalog/route.ts)". That pattern is createAdminServiceClient (service role), not the anon SSR client. Either is fine, but the plan should say which. Recommendation: match the existing planner-catalog route — use createAdminServiceClient and treat null (env missing) as { items: [], source: "none" }, identical fallback behaviour to today.
4c. RLS confidence is grounded
- Plan §9 risk #6 ("RLS denies anon read") is resolved by the migration — policy "configurator_products public read active" exists. Downgrade this from "confirm before merging" to "verified in migration; runtime smoke still recommended".
4d. planner_managed_products schema gap
- The plan assumed both tables are first-class. In fact planner_managed_products has no migration file in this repo. This is unrelated to the merge but is a real reproducibility hole (can't supabase db reset to a working state for the planner catalog). Belongs in Failures.md regardless of the merge.
4e. Database type unused for these tables
- All catalog code uses as SupabaseClient<any> casts. Adding configurator support won't make this worse, but the typed Database in lib/supabase/types.ts is effectively dead for the catalog surface. Not a blocker. Flag.
5. Confirmed open questions still need answers
The six §10 questions in the plan are unchanged by this audit. The new audit-driven question:
7. Client choice for the new public configurator route. Anon SSR (matches RLS intent) or service role (matches the existing /api/planner/catalog pattern)?
6. New follow-ups (need to land in Failures.md)
- Missing migration: planner_managed_products has no create table SQL in site/platform/supabase/migrations/** despite being read/written by 9 files. Add or recover the DDL.
- Stale Supabase types: lib/supabase/types.ts lists only image_assets. Regenerate from the live DB (supabase gen types typescript) so the catalog handlers can drop their any casts.
- Drizzle ↔ Supabase drift: Drizzle schema knows nothing about either catalog table. Either back-fill Drizzle definitions or document that Drizzle owns app/auth state and Supabase migrations own catalog state.
7. Verdict on the merge plan
- Direction is sound. Read path, adapter shape, store integration, and test plan are correct.
- Two precise fixes required before execution:
1. Drop slug-based dedup; keep merge keyed by id; map Product.slug → CatalogItem.id in the new bridge.
2. Pick the client (anon SSR vs service role) and state it explicitly in §6a.
- Three new follow-ups land in Failures.md regardless of whether you proceed with the merge.