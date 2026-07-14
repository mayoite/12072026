import { describe, it, expect } from "vitest";
import {
  toCatalogDim,
  parseCsvFileWithAudit,
  parseCsvFile,
  dedupeCatalogItems,
} from "@/features/planner/catalog-api/ingest/csvCatalogIngest";

describe("csvCatalogIngest", () => {
  it("toCatalogDim scales correctly", () => {
    expect(toCatalogDim(1200)).toBe(120);
    expect(toCatalogDim(400)).toBe(400);
  });

  it("parses linear workstation CSV contents", () => {
    const csv = `PRODUCT: Buddy Workstations
WORKSTATION: NON SHARING
1,1 Seater NS,1200
2,2 Seater NS,1200
`;
    const result = parseCsvFileWithAudit("test.csv", csv);
    expect(result.family).toBe("linear-workstations");
    expect(result.items.length).toBe(2);
    expect(result.items[0].name).toBe("Buddy Workstations — 1 Seater NS (1200mm)");
  });

  it("parses accessories section", () => {
    const csv = `PRODUCT: Accessories
SCREEN
1,Monitor screen
KEYBOARD
2,Standard keyboard
`;
    const items = parseCsvFile("accessories.csv", csv);
    expect(items.length).toBe(2);
    expect(items[0].category).toBe("equipment");
  });

  it("deduplicates catalog items correctly", () => {
    const items = [
      { id: "1", name: "Desk", widthMm: 120, heightMm: 60, seatCount: 1 } as any,
      { id: "2", name: "Desk", widthMm: 120, heightMm: 60, seatCount: 1 } as any,
    ];
    const deduped = dedupeCatalogItems(items);
    expect(deduped.length).toBe(1);
  });
});
