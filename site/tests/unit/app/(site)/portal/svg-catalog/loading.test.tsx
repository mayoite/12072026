import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import SvgCatalogLoading from "@/app/(site)/portal/svg-catalog/loading";

describe("app/(site)/portal/svg-catalog/loading (name-mirror)", () => {
  it("renders accessible busy shell for public inventory load", () => {
    const { container } = render(<SvgCatalogLoading />);
    const root = container.firstElementChild;
    expect(root).toHaveAttribute("aria-busy", "true");
    expect(root).toHaveAttribute("aria-live", "polite");
    expect(
      screen.getByRole("heading", { level: 1, name: /svg catalog/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/public inventory/i)).toBeInTheDocument();
    expect(screen.getByRole("status", { name: /loading catalog/i })).toBeInTheDocument();
  });
});
