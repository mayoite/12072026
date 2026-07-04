/**
 * GET /api/planner/catalog
 *
 * Public read of active planner-managed catalog products for the workspace library.
 * Uses the public SSR Supabase client and public rate limiting.
 */

import type { NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { enforcePublicApiRateLimit } from "@/app/api/_lib/public";
import { isMissingTableError } from "@/app/api/admin/_lib/server";
import { success, error } from "@/lib/api/apiResponse";
import { ApiError, API_ERROR_CODES } from "@/lib/api/ApiError";
import {
  managedProductRowToCatalogItem,
} from "@/features/planner/catalog/managedProductCatalogBridge";
import { normalizePlannerManagedProductRow } from "@/features/planner/catalog/plannerManagedProductsShared";
import { applyPlannerRouteTelemetry } from "@/lib/api/routeObservability";

export async function GET(req: NextRequest) {
  const rateError = await enforcePublicApiRateLimit(req, "planner-catalog:get", 30);
  if (rateError) return rateError;

  const startedAt = performance.now();
  const routeName = "api/planner/catalog";
  const queryShape = "planner-catalog-active-list";
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
    console.error("[api/planner/catalog] failed to create public client:", err);
    return applyPlannerRouteTelemetry(
      success({ items: [], source: "none", total: 0 }),
      { ...telemetry(), rowCount: 0, source: "none" },
    );
  }

  const { data, error: dbError } = await supabase
    .from("planner_managed_products")
    .select(
      [
        "id",
        "legacy_product_id",
        "slug",
        "planner_source_slug",
        "name",
        "description",
        "category",
        "category_id",
        "category_name",
        "series_id",
        "series_name",
        "price",
        "flagship_image",
        "images",
        "specs",
        "metadata",
        "active",
        "created_by",
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
        success({ items: [], source: "planner_managed_products", total: 0 }),
        { ...telemetry(), rowCount: 0, source: "planner_managed_products" },
      );
    }
    return applyPlannerRouteTelemetry(
      error(
        new ApiError(500, API_ERROR_CODES.DATABASE_ERROR, "Failed to load planner catalog"),
      ),
      { ...telemetry(), rowCount: 0, source: "planner_managed_products" },
    );
  }

  const rows = (data ?? []).map((row) => normalizePlannerManagedProductRow(row));
  const items = rows
    .map((row) => managedProductRowToCatalogItem(row))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return applyPlannerRouteTelemetry(
    success({
      items,
      total: items.length,
      source: "planner_managed_products",
    }),
    { ...telemetry(), rowCount: items.length, source: "planner_managed_products" },
  );
}
