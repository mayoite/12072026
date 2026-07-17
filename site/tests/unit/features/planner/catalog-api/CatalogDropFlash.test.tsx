import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { CatalogDropFlash } from "@/features/planner/catalog-api/CatalogDropFlash";

describe("CatalogDropFlash", () => {
  it("renders aria-hidden flash at page coordinates", () => {
    const { container } = render(<CatalogDropFlash x={120} y={40} />);
    const el = container.querySelector(".pw-drop-flash");
    expect(el).not.toBeNull();
    expect(el?.getAttribute("aria-hidden")).toBe("true");
    const style = (el as HTMLElement).style;
    expect(style.getPropertyValue("--pw-drop-flash-x")).toBe("120px");
    expect(style.getPropertyValue("--pw-drop-flash-y")).toBe("40px");
  });
});
