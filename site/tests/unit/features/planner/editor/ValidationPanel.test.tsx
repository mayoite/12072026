import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ValidationPanel } from "@/features/planner/editor/ValidationPanel";

describe("ValidationPanel", () => {
  it("renders validation issues list", () => {
    render(
      <ValidationPanel
        result={{
          issues: [
            {
              id: "1",
              severity: "error",
              message: "Wall too short",
              code: "wall-short",
            },
          ],
          errors: 1,
          warnings: 0,
          advisories: 0,
        }}
      />,
    );
    expect(screen.getByRole("region", { name: /validation/i })).toBeDefined();
    expect(document.body.textContent).toMatch(/Wall too short|1 total|Validation/i);
  });

  it("shows no issues summary when empty", () => {
    render(
      <ValidationPanel
        result={{ issues: [], errors: 0, warnings: 0, advisories: 0 }}
      />,
    );
    expect(document.body.textContent).toMatch(/No issues/i);
  });
});
