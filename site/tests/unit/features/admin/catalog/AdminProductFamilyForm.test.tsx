import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { AdminProductFamilyForm } from "@/features/admin/catalog/AdminProductFamilyForm";

describe("AdminProductFamilyForm (name-mirror)", () => {
  it("saves and previews family", () => {
    const { container } = render(<AdminProductFamilyForm />);
    expect(screen.getByTestId("admin-product-family-form")).toBeInTheDocument();
    fireEvent.change(screen.getByTestId("admin-family-name"), {
      target: { value: "Renamed family" },
    });
    fireEvent.click(screen.getByTestId("admin-family-save"));
    expect(screen.getByTestId("admin-family-message")).toHaveTextContent(/saved/i);
    expect(container.querySelector("[data-testid='admin-product-family-form'] [style]")).toBeNull();
  });
});
