import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import SvgCatalogLayout, {
  metadata,
} from "@/app/(site)/portal/svg-catalog/layout";

describe("app/(site)/portal/svg-catalog/layout.tsx", () => {
  it("exports noindex SVG catalog metadata (protected portal subtree)", () => {
    expect(metadata.title).toBe("SVG catalog | One&Only");
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it("renders children directly", () => {
    render(
      <SvgCatalogLayout>
        <div data-testid="svg-catalog-child">Catalog child</div>
      </SvgCatalogLayout>,
    );
    expect(screen.getByTestId("svg-catalog-child")).toBeInTheDocument();
  });
});
