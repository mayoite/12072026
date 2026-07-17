import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  deletePlannerManagedProduct,
  listPlannerManagedProductsFromSupabase,
  upsertPlannerManagedProduct,
} from "@/features/planner/cloud-store/plannerManagedProducts.client";

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
    specs: {},
    metadata: {},
    active: true,
    created_by: null,
    created_at: ISO,
    updated_at: ISO,
    ...overrides,
  };
}

function listChain(result: { data: unknown; error: { message: string } | null }) {
  return {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue(result),
  };
}

function writeChain(result: { data: unknown; error: { message: string } | null }) {
  return {
    upsert: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(result),
    maybeSingle: vi.fn().mockResolvedValue(result),
  };
}

const writeInput = {
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
  images: [] as string[],
  specs: {},
  metadata: {},
  active: true,
  created_by: null,
};

describe("plannerManagedProducts.client (cloud-store)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists planner managed products successfully", async () => {
    const client = {
      from: vi.fn().mockReturnValue(listChain({ data: [managedRow()], error: null })),
    };
    const products = await listPlannerManagedProductsFromSupabase(client as never);
    expect(client.from).toHaveBeenCalledWith("planner_managed_products");
    expect(products).toHaveLength(1);
    expect(products[0]?.slug).toBe("managed-desk");
    expect(products[0]?.name).toBe("Alpha Desk");
  });

  it("throws when list fails", async () => {
    const client = {
      from: vi.fn().mockReturnValue(listChain({ data: null, error: { message: "DB Error" } })),
    };
    await expect(listPlannerManagedProductsFromSupabase(client as never)).rejects.toThrow(
      /Unable to load planner-managed products: DB Error/,
    );
  });

  it("upserts product successfully", async () => {
    const chain = writeChain({ data: managedRow(), error: null });
    const client = { from: vi.fn().mockReturnValue(chain) };
    const result = await upsertPlannerManagedProduct(client as never, writeInput);
    expect(result.id).toBe(UUID);
    expect(result.slug).toBe("managed-desk");
  });

  it("throws when upsert fails", async () => {
    const chain = writeChain({ data: null, error: { message: "constraint" } });
    const client = { from: vi.fn().mockReturnValue(chain) };
    await expect(upsertPlannerManagedProduct(client as never, writeInput)).rejects.toThrow(
      /Unable to save planner-managed product/,
    );
  });

  it("deletes and reports match status", async () => {
    const hit = writeChain({ data: { id: UUID }, error: null });
    const miss = writeChain({ data: null, error: null });
    await expect(
      deletePlannerManagedProduct({ from: vi.fn().mockReturnValue(hit) } as never, UUID),
    ).resolves.toBe(true);
    await expect(
      deletePlannerManagedProduct({ from: vi.fn().mockReturnValue(miss) } as never, UUID),
    ).resolves.toBe(false);
  });
});
