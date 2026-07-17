import { describe, it, expect, vi } from "vitest";
import type { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReviewQuotePanel } from "@/features/planner/editor/ReviewQuotePanel";
import type { ValidationResult } from "@/features/planner/lib/validation/runValidation";

const clearValidation: ValidationResult = {
  issues: [],
  errors: 0,
  warnings: 0,
  advisories: 0,
};

const blockedValidation: ValidationResult = {
  issues: [
    {
      id: "furniture-overlap:a:b",
      ruleId: "furniture-overlap",
      severity: "error",
      objectIds: ["a", "b"],
      message: 'Furniture items "a" and "b" overlap.',
      remedy: "Move them apart.",
    },
  ],
  errors: 1,
  warnings: 0,
  advisories: 0,
};

const warningOnlyValidation: ValidationResult = {
  issues: [
    {
      id: "aisle-clearance:a:b",
      ruleId: "aisle-clearance",
      severity: "warning",
      objectIds: ["a", "b"],
      message: "Clearance is tight.",
      remedy: "Increase spacing.",
    },
  ],
  errors: 0,
  warnings: 1,
  advisories: 0,
};

function renderPanel(
  overrides: Partial<ComponentProps<typeof ReviewQuotePanel>> = {},
) {
  const props = {
    validation: clearValidation,
    furnitureCount: 4,
    workstationSeats: 2,
    pricingNote: "Demo list prices only — not approved commercial quotes.",
    guestMode: false,
    handoffBusy: false,
    onDownloadBoqCsv: vi.fn(),
    onDownloadBoqPdf: vi.fn(),
    onAddAllToQuote: vi.fn(),
    onSendToOando: vi.fn(),
    ...overrides,
  };
  return { ...render(<ReviewQuotePanel {...props} />), props };
}

describe("ReviewQuotePanel", () => {
  it("blocks send until contact + demo pricing confirm", async () => {
    const user = userEvent.setup();
    const { props } = renderPanel();

    const send = screen.getByRole("button", { name: /send to oando/i });
    expect(send).toBeDisabled();

    await user.type(screen.getByLabelText(/contact name/i), "Ada");
    await user.type(screen.getByLabelText(/^email$/i), "ada@example.com");
    await user.click(
      screen.getByLabelText(/demo list figures, not approved commercial/i),
    );

    expect(send).toBeEnabled();
    await user.click(send);
    expect(props.onSendToOando).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Ada",
        email: "ada@example.com",
      }),
    );
  });

  it("allows send with phone-only contact after demo confirm", async () => {
    const user = userEvent.setup();
    const { props } = renderPanel();

    await user.type(screen.getByLabelText(/contact name/i), "Ada");
    await user.type(screen.getByLabelText(/^phone$/i), "+91 90000 00000");
    await user.click(
      screen.getByLabelText(/demo list figures, not approved commercial/i),
    );

    const send = screen.getByRole("button", { name: /send to oando/i });
    expect(send).toBeEnabled();
    await user.click(send);
    expect(props.onSendToOando).toHaveBeenCalledWith(
      expect.objectContaining({ phone: "+91 90000 00000" }),
    );
  });

  it("hides send form for guests and still allows BOQ download when ready", () => {
    const { props } = renderPanel({ guestMode: true });
    expect(screen.queryByRole("button", { name: /send to oando/i })).toBeNull();
    expect(screen.getByText(/sign in as a member/i)).toBeInTheDocument();

    const pdf = screen.getByRole("button", {
      name: /download branded boq pdf/i,
    });
    expect(pdf).toBeEnabled();
    pdf.click();
    expect(props.onDownloadBoqPdf).toHaveBeenCalled();
  });

  it("disables BOQ export and send when validation has errors", () => {
    renderPanel({ validation: blockedValidation, furnitureCount: 2 });
    expect(screen.getByText(/1 error/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /download boq csv/i }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /download branded boq pdf/i }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /add all furniture to quote cart/i }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /send to oando/i }),
    ).toBeDisabled();
    expect(
      screen.getByText(/resolve validation errors before downloading/i),
    ).toBeInTheDocument();
  });

  it("disables BOQ export when no furniture is placed", () => {
    renderPanel({ furnitureCount: 0 });
    expect(screen.getByText("Add furniture")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /download boq csv/i }),
    ).toBeDisabled();
    expect(
      screen.getByText(/place furniture to build a boq/i),
    ).toBeInTheDocument();
  });

  it("shows Ready to quote and keeps export enabled with warnings only", () => {
    renderPanel({
      validation: warningOnlyValidation,
      furnitureCount: 3,
    });
    expect(screen.getByText(/ready to quote/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /download branded boq pdf/i }),
    ).toBeEnabled();
    expect(
      screen.getByRole("button", { name: /add all furniture to quote cart/i }),
    ).toBeEnabled();
  });

  it("surfaces demo pricing note as commercial honesty copy", () => {
    renderPanel();
    expect(
      screen.getByRole("note"),
    ).toHaveTextContent(/demo list prices only/i);
  });

  it("disables send while handoff is busy", async () => {
    const user = userEvent.setup();
    renderPanel({ handoffBusy: true });
    await user.type(screen.getByLabelText(/contact name/i), "Ada");
    await user.type(screen.getByLabelText(/^email$/i), "ada@example.com");
    // Checkbox is inside disabled fieldset while busy
    expect(screen.getByRole("button", { name: /sending/i })).toBeDisabled();
  });

  it("wires quote-cart and BOQ actions when ready", async () => {
    const user = userEvent.setup();
    const { props } = renderPanel();
    await user.click(
      screen.getByRole("button", { name: /download boq csv/i }),
    );
    await user.click(
      screen.getByRole("button", { name: /download branded boq pdf/i }),
    );
    await user.click(
      screen.getByRole("button", { name: /add all furniture to quote cart/i }),
    );
    expect(props.onDownloadBoqCsv).toHaveBeenCalledTimes(1);
    expect(props.onDownloadBoqPdf).toHaveBeenCalledTimes(1);
    expect(props.onAddAllToQuote).toHaveBeenCalledTimes(1);
  });
});
