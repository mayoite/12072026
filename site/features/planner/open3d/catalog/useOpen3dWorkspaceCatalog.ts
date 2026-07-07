"use client";

import { useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";

import { Open3dCatalogClient } from "./catalogClient";
import type { Open3dCatalogItem } from "./catalogTypes";
import { OPEN3D_DEMO_CATALOG_ITEMS } from "../editor/demoCatalogItems";
import { loadOpen3dCatalog, OPEN3D_CATALOG_QUERY_KEY } from "./catalogQuery";

// Catalogue-first (BP-06 / design §9-10 / REC-04 / phase-06 / 0419): loader primary via client for descriptors (fallback to API/demo).
// Resolver blocks wired through catalogClient.loadDescriptorsFromLoader + resolveBlocks.
// Search parity (cursor, license/animated/staffPicked etc) flows to inventory.
// GS: BP-06 + design §9 (catalogue-first, resolver), §10. Full Phase 06 integration.

export type Open3dWorkspaceCatalogStatus =
  | "loading"
  | "ready"
  | "fallback"
  | "stale"
  | "offline"
  | "error";

export function useOpen3dWorkspaceCatalog() {
  const clientRef = useRef<Open3dCatalogClient | null>(null);
  if (clientRef.current === null) {
    clientRef.current = new Open3dCatalogClient();
  }

  const query = useQuery({
    queryKey: OPEN3D_CATALOG_QUERY_KEY,
    queryFn: (context) => loadOpen3dCatalog(clientRef.current!, context),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
  const remoteItems = query.data?.items ?? [];
  const items =
    remoteItems.length > 0
      ? [
          ...remoteItems,
          ...OPEN3D_DEMO_CATALOG_ITEMS.filter(
            (seed) => !remoteItems.some((item) => item.id === seed.id),
          ),
        ]
      : OPEN3D_DEMO_CATALOG_ITEMS;
  const offline = typeof navigator !== "undefined" && navigator.onLine === false;
  const status: Open3dWorkspaceCatalogStatus = offline
    ? "offline"
    : query.isError
      ? "error"
      : query.isPending
        ? "loading"
        : query.isFetching
          ? "stale"
          : query.data.source === "fallback"
            ? "fallback"
            : "ready";

  const resolveItem = useCallback(
    (id: string): Open3dCatalogItem | undefined =>
      clientRef.current?.getById(id) ?? items.find((item) => item.id === id),
    [items],
  );

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
