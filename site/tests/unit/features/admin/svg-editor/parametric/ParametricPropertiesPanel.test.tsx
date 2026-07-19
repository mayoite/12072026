import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { eraseParametricAuthoringDefinition } from "@/features/admin/svg-editor/parametric/authoringTypes";
import { deskAssemblyAuthoringDefinition } from "@/features/admin/svg-editor/parametric/deskAssemblyAuthoringDefinition";
import { ParametricPropertiesPanel } from "@/features/admin/svg-editor/parametric/ParametricPropertiesPanel";

const definition = eraseParametricAuthoringDefinition(
  deskAssemblyAuthoringDefinition,
);

describe("ParametricPropertiesPanel", () => {
  it("renders definition-owned sections and React Aria field labels", () => {
    render(
      <ParametricPropertiesPanel
        definition={definition}
        display={definition.defaultDisplay("cm")}
        unit="cm"
        errors={[]}
        onFieldChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Desk assembly properties" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Run length (cm)")).toBeInTheDocument();
    expect(screen.getByLabelText("Assembly layout")).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "Power rail" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Aisle" })).toBeInTheDocument();
  });
});
