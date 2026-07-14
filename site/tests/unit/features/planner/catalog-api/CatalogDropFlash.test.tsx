import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { CatalogDropFlash } from "@/features/planner/catalog-api/CatalogDropFlash";

describe("CatalogDropFlash", () => {
  it("renders aria-hidden flash at page coordinates", () => {
    const { container } = render(<CatalogDropFlash x={120} y={40} />);
    const el = container.querySelector(".pw-drop-flash");
    expect(el).not.toBeNull();
    expect(el?.getAttribute("aria-hidden")).toBe("true");
    expect((el as HTMLElement).style.left).toBe("120px");
    expect((el as HTMLElement).style.top).toBe("40px");
  });
});
