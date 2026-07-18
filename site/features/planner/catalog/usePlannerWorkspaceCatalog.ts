"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";

import { PlannerCatalogClient } from "./catalogClient";
import type { PlannerCatalogItem } from "./catalogTypes";
import { filterGuestInventoryCatalogItems } from "./catalogBuyerVisibility";
import { loadPlannerCatalog, PLANNER_CATALOG_QUERY_KEY } from "./catalogQuery";

// Catalogue-first (BP-06 / design §9-10 / REC-04 / phase-06 / 0419): loader primary via client for descriptors.
// Empty remote → honest empty list (no demo-sofa / OFL pollution — P18/BQ4).
// Guest list = oando-* brand heroes only (P10).

export type PlannerWorkspaceCatalogStatus =
  | "loading"
  | "ready"
  | "fallback"
  | "stale"
  | "offline"
  | "error";

export function usePlannerWorkspaceCatalog() {
  const clientRef = useRef<PlannerCatalogClient | null>(null);
  if (clientRef.current === null) {
    clientRef.current = new PlannerCatalogClient();
  }
  const client = clientRef.current;

  const query = useQuery({
    queryKey: PLANNER_CATALOG_QUERY_KEY,
    queryFn: (context) => loadPlannerCatalog(client, context),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
  const items = useMemo(() => {
    const remoteItems = query.data?.items ?? [];
    // Never merge PLANNER_DEMO_CATALOG_ITEMS — demo seed is tests/offline only (P18).
    return filterGuestInventoryCatalogItems(remoteItems);
  }, [query.data?.items]);
  const offline = typeof navigator !== "undefined" && navigator.onLine === false;
  const status: PlannerWorkspaceCatalogStatus = offline
    ? "offline"
    : query.isError
      ? "error"
      : query.isPending
        ? "loading"
        : query.isFetching
          ? "stale"
          : query.data?.source === "fallback"
            ? "fallback"
            : "ready";

  const resolveItem = useCallback(
    (id: string): PlannerCatalogItem | undefined =>
      clientRef.current?.getById(id) ?? items.find((item) => item.id === id),
    [items],
  );

  // TTL stale UX (06-INV): background refresh when catalog data is past half TTL.
  useEffect(() => {
    if (typeof window === "undefined" || offline) return;
    const client = clientRef.current;
    if (!client) return;

    const tick = () => {
      if (client.shouldRevalidate() && !query.isFetching) {
        void query.refetch();
      }
    };

    tick();
    const intervalId = window.setInterval(tick, 60_000);
    return () => window.clearInterval(intervalId);
  }, [offline, query]);

  return {
    items,
    status,
    resolveItem,
    isLoading: query.isPending,
    isStale: query.isStale,
    error: query.error,
    retry: query.refetch,
  };
}

/** Phase 06 plan alias — catalogue-first SVG descriptor consumer hook. */
export const usePlannerSvgCatalog = usePlannerWorkspaceCatalog;
