import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const createClient = vi.fn();

vi.mock("@/platform/supabase/server", () => ({
  createClient: () => createClient(),
}));

import {
  deletePlannerManagedProduct,
  listPlannerManagedProductsForPlannerCatalog,
  upsertPlannerManagedProduct,
} from "@/features/planner/catalog-api/plannerManagedProducts";

const ISO = "2026-07-13T12:00:00.000Z";
const UUID = "a1b2c3d4-e5f6-4789-a012-3456789abcde";

function managedRow(overrides: Record<string, unknown> = {}) {
  return {
    id: UUID,
    slug: "managed-desk",
    planner_source_slug: "alpha-desk",
    name: "Alpha Desk",
    description: "Exec",
    category: "desk",
    category_id: "workstations",
    category_name: "Workstations",
    series_id: "executive",
    series_name: "Executive",
    price: 85000,
    flagship_image: "",
    images: [],
    specs: { widthMm: 1600 },
    metadata: {},
    active: true,
    created_by: null,
    created_at: ISO,
    updated_at: ISO,
    ...overrides,
  };
}

function chain(result: { data: unknown; error: { message: string } | null }) {
  const thenable = {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue(result),
    upsert: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(result),
    maybeSingle: vi.fn().mockResolvedValue(result),
  };
  return thenable;
}

describe("plannerManagedProducts (catalog-api)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty list when supabase client is unavailable", async () => {
    createClient.mockRejectedValue(new Error("no env"));
    await expect(listPlannerManagedProductsForPlannerCatalog()).resolves.toEqual([]);
  });

  it("lists only active managed products", async () => {
    const from = vi.fn().mockReturnValue(
      chain({
        data: [managedRow(), managedRow({ id: "b2c3d4e5-f6a7-4890-b123-456789abcdef", active: false })],
        error: null,
      }),
    );
    // Fix: active false second row needs valid uuid - already has one
    createClient.mockResolvedValue({ from });
    // Rebuild with both active true and false using valid UUIDs
    const activeId = UUID;
    const inactiveId = "b2c3d4e5-f6a7-4890-b123-456789abcdef";
    from.mockReturnValue(
      chain({
        data: [
          managedRow({ id: activeId, active: true }),
          managedRow({ id: inactiveId, active: false, slug: "hidden" }),
        ],
        error: null,
      }),
    );

    const products = await listPlannerManagedProductsForPlannerCatalog();
    expect(from).toHaveBeenCalledWith("planner_managed_products");
    expect(products).toHaveLength(1);
    expect(products[0]?.id).toBe(activeId);
    expect(products[0]?.name).toBe("Alpha Desk");
  });

  it("returns empty list when managed products table is missing", async () => {
    createClient.mockResolvedValue({
      from: vi.fn().mockReturnValue(
        chain({
          data: null,
          error: {
            message: 'Could not find the table "public.planner_managed_products" in the schema cache',
          },
        }),
      ),
    });
    await expect(listPlannerManagedProductsForPlannerCatalog()).resolves.toEqual([]);
  });

  it("upserts managed product through supabase client", async () => {
    const clientChain = chain({ data: managedRow(), error: null });
    const client = { from: vi.fn().mockReturnValue(clientChain) };
    const saved = await upsertPlannerManagedProduct(client as never, {
      slug: "managed-desk",
      planner_source_slug: "alpha-desk",
      name: "Alpha Desk",
      description: "Exec",
      category: "desk",
      category_id: "workstations",
      category_name: "Workstations",
      series_id: "executive",
      series_name: "Executive",
      price: 85000,
      flagship_image: "",
      images: [],
      specs: {},
      metadata: {},
      active: true,
      created_by: null,
    });
    expect(client.from).toHaveBeenCalledWith("planner_managed_products");
    expect(saved.slug).toBe("managed-desk");
    expect(saved.name).toBe("Alpha Desk");
  });

  it("delete returns true when a row was removed", async () => {
    const clientChain = chain({ data: { id: UUID }, error: null });
    const client = { from: vi.fn().mockReturnValue(clientChain) };
    await expect(deletePlannerManagedProduct(client as never, UUID)).resolves.toBe(true);
  });

  it("delete returns false when no row matched", async () => {
    const clientChain = chain({ data: null, error: null });
    const client = { from: vi.fn().mockReturnValue(clientChain) };
    await expect(deletePlannerManagedProduct(client as never, UUID)).resolves.toBe(false);
  });
});
