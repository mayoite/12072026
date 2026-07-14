import { describe, expect, it } from "vitest";
import {
  CatalogSidebar,
  type CatalogSidebarProps,
} from "@/features/planner/catalog-api/CatalogSidebar";
import { CatalogPanel } from "@/features/planner/catalog-api/CatalogPanel";

describe("CatalogSidebar", () => {
  it("is an alias of CatalogPanel", () => {
    expect(CatalogSidebar).toBe(CatalogPanel);
    expect(CatalogSidebar).toBeTypeOf("function");
  });

  it("accepts CatalogSidebarProps compatible with onItemClick", () => {
    const props: CatalogSidebarProps = {
      onItemClick: () => undefined,
    };
    expect(props.onItemClick).toBeTypeOf("function");
  });
});
