import { describe, expect, it } from "vitest";
import {
  derivePlannerWorkspaceCatalogStatus,
  plannerCatalogStatusBarLabel,
} from "@/features/planner/catalog/plannerCatalogStatus";

describe("derivePlannerWorkspaceCatalogStatus", () => {
  it("is loading only on first pending fetch with no data", () => {
    expect(
      derivePlannerWorkspaceCatalogStatus({
        offline: false,
        isError: false,
        isPending: true,
        isFetching: true,
        hasData: false,
      }),
    ).toBe("loading");
  });

  it("is stale during background refetch when data already exists", () => {
    expect(
      derivePlannerWorkspaceCatalogStatus({
        offline: false,
        isError: false,
        isPending: false,
        isFetching: true,
        hasData: true,
        source: "remote",
      }),
    ).toBe("stale");
  });

  it("is ready when remote data settled and not fetching", () => {
    expect(
      derivePlannerWorkspaceCatalogStatus({
        offline: false,
        isError: false,
        isPending: false,
        isFetching: false,
        hasData: true,
        source: "remote",
      }),
    ).toBe("ready");
  });

  it("is fallback for honest empty remote (not loading)", () => {
    expect(
      derivePlannerWorkspaceCatalogStatus({
        offline: false,
        isError: false,
        isPending: false,
        isFetching: false,
        hasData: true,
        source: "fallback",
      }),
    ).toBe("fallback");
  });

  it("is error when failed with no data", () => {
    expect(
      derivePlannerWorkspaceCatalogStatus({
        offline: false,
        isError: true,
        isPending: false,
        isFetching: false,
        hasData: false,
      }),
    ).toBe("error");
  });

  it("prefers offline over other flags", () => {
    expect(
      derivePlannerWorkspaceCatalogStatus({
        offline: true,
        isError: false,
        isPending: true,
        isFetching: true,
        hasData: false,
      }),
    ).toBe("offline");
  });
});

describe("plannerCatalogStatusBarLabel", () => {
  it("shows Loading only for loading — not stale/ready", () => {
    expect(plannerCatalogStatusBarLabel("loading")).toBe("Loading catalog…");
    expect(plannerCatalogStatusBarLabel("stale")).toBeNull();
    expect(plannerCatalogStatusBarLabel("ready")).toBeNull();
  });

  it("maps fallback/error/offline without saying Loading", () => {
    expect(plannerCatalogStatusBarLabel("fallback")).toBe("Offline catalog");
    expect(plannerCatalogStatusBarLabel("error")).toBe("Catalog unavailable");
    expect(plannerCatalogStatusBarLabel("offline")).toBe("Offline");
  });
});
