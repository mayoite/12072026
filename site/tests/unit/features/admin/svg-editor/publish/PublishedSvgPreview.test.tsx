import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PublishedSvgPreview } from "@/features/admin/svg-editor/publish/PublishedSvgPreview";

describe("PublishedSvgPreview", () => {
  it("shows missing state copy", () => {
    render(
      <PublishedSvgPreview
        slug="desk"
        status={{ state: "missing" } as never}
      />,
    );
    expect(screen.getByText(/No SVG on disk/i)).toBeInTheDocument();
  });

  it("inlines trusted published svg markup", () => {
    render(
      <PublishedSvgPreview
        slug="desk"
        status={{
          state: "published",
          publicUrl: "/svg-catalog/desk.svg",
          markup: '<svg xmlns="http://www.w3.org/2000/svg" data-testid="inline-svg"></svg>',
          hash: "abc123",
        } as never}
      />,
    );
    expect(screen.getByTestId("admin-svg-preview")).toHaveAttribute(
      "data-artifact-state",
      "published",
    );
    expect(screen.getByTestId("admin-svg-preview-stage")).toHaveAttribute(
      "data-public-url",
      "/svg-catalog/desk.svg",
    );
    expect(document.querySelector("svg")).toBeDefined();
  });
});
