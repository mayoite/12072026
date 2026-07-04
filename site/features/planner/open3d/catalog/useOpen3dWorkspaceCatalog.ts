"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Open3dCatalogClient } from "./catalogClient";
import type { Open3dCatalogItem } from "./catalogTypes";
import { OPEN3D_DEMO_CATALOG_ITEMS } from "../editor/demoCatalogItems";

// Catalogue-first (BP-06 / design §9-10 / REC-04 / phase-06 / 0419): loader primary via client for descriptors (fallback to API/demo).
// Resolver blocks wired through catalogClient.loadDescriptorsFromLoader + resolveBlocks.
// Search parity (cursor, license/animated/staffPicked etc) flows to inventory.
// GS: BP-06 + design §9 (catalogue-first, resolver), §10. Full Phase 06 integration.

export type Open3dWorkspaceCatalogStatus = "loading" | "ready" | "fallback";

export function useOpen3dWorkspaceCatalog() {
  const clientRef = useRef<Open3dCatalogClient | null>(null);
  if (clientRef.current === null) {
    clientRef.current = new Open3dCatalogClient();
  }

  const [items, setItems] = useState<Open3dCatalogItem[]>(OPEN3D_DEMO_CATALOG_ITEMS);
  const [status, setStatus] = useState<Open3dWorkspaceCatalogStatus>("loading");

  useEffect(() => {
    const client = clientRef.current;
    if (!client) return;

    let cancelled = false;

    // Catalogue-first: try loader primary descriptors first (populates client items for search); fallback API/demo.
    // Address client [] return: always check getAll() after loadDescriptors (preloaded or server path sets items); primary functional.
    void client.loadDescriptorsFromLoader()
      .then(() => {
        if (cancelled) return;
        const fromDesc = client.getAll();
        if (fromDesc.length > 0) {
          setItems(fromDesc);
          setStatus("ready");
          return;
        }
        // fallback to API
        return client.loadFromApi("configurator", 200).then((loaded) => {
          if (cancelled) return;
          setItems(loaded.length > 0 ? loaded : OPEN3D_DEMO_CATALOG_ITEMS);
          setStatus(loaded.length > 0 ? "ready" : "fallback");
        });
      })
      .catch(() => {
        if (cancelled) return;
        client.load(OPEN3D_DEMO_CATALOG_ITEMS, "configurator");
        setItems(OPEN3D_DEMO_CATALOG_ITEMS);
        setStatus("fallback");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const resolveItem = useCallback(
    (id: string): Open3dCatalogItem | undefined =>
      clientRef.current?.getById(id) ?? items.find((item) => item.id === id),
    [items],
  );

  return {
    items,
    status,
    resolveItem,
    isLoading: status === "loading",
  };
}
