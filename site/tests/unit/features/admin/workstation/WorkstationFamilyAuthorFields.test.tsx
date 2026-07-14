import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { WorkstationFamilyAuthorFields } from "@/features/admin/workstation/WorkstationFamilyAuthorFields";
import {
  defaultWorkstationAuthorDraft,
  workstationJsonFromAuthor,
} from "@/features/admin/workstation/workstationFamilyAuthor";

describe("WorkstationFamilyAuthorFields", () => {
  it("renders author fields from default draft json", () => {
    const onChange = vi.fn();
    const json = workstationJsonFromAuthor(defaultWorkstationAuthorDraft());
    render(
      <WorkstationFamilyAuthorFields
        workstationJson={json}
        onWorkstationJsonChange={onChange}
      />,
    );
    expect(screen.getByText("Workstation family (structured)")).toBeInTheDocument();
    expect(screen.getByText("Family slug")).toBeInTheDocument();
    expect(screen.getByDisplayValue("premium-linear")).toBeInTheDocument();
  });
});
