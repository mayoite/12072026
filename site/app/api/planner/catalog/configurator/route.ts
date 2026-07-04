/**
 * GET /api/planner/catalog/configurator
 *
 * Public read of active configurator catalog products for the workspace library.
 * Uses the public SSR Supabase client and public rate limiting.
 */

import type { NextRequest } from "next/server";

import { createServerClient } from "@/lib/supabase/server";
import { enforcePublicApiRateLimit } from "@/app/api/_lib/public";
import { isMissingTableError } from "@/app/api/admin/_lib/server";
import { productToCatalogItem } from "@/features/planner/catalog/configuratorProductCatalogBridge";
import { ApiError, API_ERROR_CODES } from "@/lib/api/ApiError";
import { success, error } from "@/lib/api/apiResponse";
import { applyPlannerRouteTelemetry } from "@/lib/api/routeObservability";
import { rowToProduct, type ConfiguratorProductRow } from "@/lib/catalog/configuratorCatalog";

export async function GET(req: NextRequest) {
  const rateError = await enforcePublicApiRateLimit(
    req,
    "planner-catalog-configurator:get",
    30,
  );
  if (rateError) return rateError;

  const startedAt = performance.now();
  const routeName = "api/planner/catalog/configurator";
  const queryShape = "planner-configurator-active-list";
  const telemetry = () => ({
    route: routeName,
    queryShape,
    durationMs: performance.now() - startedAt,
  });

  const url = new URL(req.url);
  const limit = Math.min(500, Math.max(1, Number(url.searchParams.get("limit") ?? 200)));

  let supabase;
  try {
    supabase = await createServerClient();
  } catch (err) {
    console.error(
      "[api/planner/catalog/configurator] failed to create public client:",
      err,
    );
    return applyPlannerRouteTelemetry(
      success({ items: [], source: "none", total: 0 }),
      { ...telemetry(), rowCount: 0, source: "none" },
    );
  }

  const { data, error: dbError } = await supabase
    .from("configurator_products")
    .select(
      [
        "slug",
        "name",
        "category",
        "family",
        "brand_name",
        "sizing_type",
        "workstation",
        "size_options",
        "default_footprint",
        "derived_rules",
        "materials",
        "thumbnail_url",
        "model_3d_url",
        "description",
        "active",
        "created_at",
        "updated_at",
      ].join(", "),
    )
    .eq("active", true)
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (dbError) {
    if (isMissingTableError(dbError.message)) {
      return applyPlannerRouteTelemetry(
        success({ items: [], source: "configurator_products", total: 0 }),
        { ...telemetry(), rowCount: 0, source: "configurator_products" },
      );
    }
    return applyPlannerRouteTelemetry(
      error(
        new ApiError(500, API_ERROR_CODES.DATABASE_ERROR, "Failed to load configurator catalog"),
      ),
      { ...telemetry(), rowCount: 0, source: "configurator_products" },
    );
  }

  const items = (data ?? [])
    .map((row) => productToCatalogItem(rowToProduct(row as ConfiguratorProductRow)))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return applyPlannerRouteTelemetry(
    success({
      items,
      total: items.length,
      source: "configurator_products",
    }),
    { ...telemetry(), rowCount: items.length, source: "configurator_products" },
  );
}
