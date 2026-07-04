"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Open3dCatalogClient } from "./catalogClient";
import type { Open3dCatalogItem } from "./catalogTypes";
import { OPEN3D_DEMO_CATALOG_ITEMS } from "../editor/demoCatalogItems";

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

    void client
      .loadFromApi("configurator", 200)
      .then((loaded) => {
        if (cancelled) return;
        setItems(loaded.length > 0 ? loaded : OPEN3D_DEMO_CATALOG_ITEMS);
        setStatus(loaded.length > 0 ? "ready" : "fallback");
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
