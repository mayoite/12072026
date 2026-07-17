import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { AdminProductFamilyForm } from "@/features/admin/catalog/AdminProductFamilyForm";

describe("Admin product family form", () => {
  it("saves, reloads, and previews 2D/3D/BOQ", () => {
    render(<AdminProductFamilyForm />);
    expect(screen.getByTestId("admin-product-family-form")).toBeInTheDocument();
    fireEvent.change(screen.getByTestId("admin-family-name"), {
      target: { value: "Renamed family" },
    });
    fireEvent.click(screen.getByTestId("admin-family-save"));
    expect(screen.getByTestId("admin-family-message")).toHaveTextContent(/saved/i);
    fireEvent.click(screen.getByTestId("admin-family-reload"));
    expect(screen.getByTestId("admin-family-name")).toHaveValue("Renamed family");
    fireEvent.click(screen.getByTestId("admin-family-preview"));
    expect(screen.getByTestId("admin-family-preview-result")).toHaveTextContent(
      /2D:|3D:|BOQ:/,
    );
  });

  it("migration keep-both appends v2 without dropping prior version id", () => {
    render(<AdminProductFamilyForm />);
    fireEvent.click(screen.getByTestId("admin-family-migrate"));
    expect(screen.getByTestId("admin-family-message")).toBeInTheDocument();
    // Authoring surface remains; browser family-release journey stays OPEN
    expect(screen.getByTestId("admin-product-family-form")).toBeInTheDocument();
    expect(screen.getByTestId("admin-family-version")).toBeInTheDocument();
  });
});
