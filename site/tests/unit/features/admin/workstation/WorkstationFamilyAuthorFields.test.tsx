import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WorkstationFamilyAuthorFields } from "@/features/admin/workstation/WorkstationFamilyAuthorFields";
import {
  defaultWorkstationAuthorDraft,
  workstationJsonFromAuthor,
} from "@/features/admin/workstation/workstationFamilyAuthor";
import type { WorkstationFamilyContract } from "@/features/admin/workstation/workstationFamilyContract";

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

  it("commits text and size option changes back into workstation json", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const json = workstationJsonFromAuthor(defaultWorkstationAuthorDraft());

    render(
      <WorkstationFamilyAuthorFields
        workstationJson={json}
        onWorkstationJsonChange={onChange}
      />,
    );

    await user.clear(screen.getByDisplayValue("premium-linear"));
    await user.type(screen.getByLabelText("Family slug"), "focus-series");
    await user.click(screen.getByLabelText("900 mm"));

    expect(onChange).toHaveBeenCalled();
    const latestJson = onChange.mock.calls.at(-1)?.[0];
    expect(typeof latestJson).toBe("string");

    const parsed = JSON.parse(latestJson as string) as {
      lengthOptions: number[];
      oandoWorkstationFamily: WorkstationFamilyContract;
    };
    expect(parsed.oandoWorkstationFamily.familySlug).toBe("focus-series");
    expect(parsed.lengthOptions).not.toContain(900);
  });

  it("shows migration choices and releases the selected version", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const base = JSON.parse(
      workstationJsonFromAuthor(defaultWorkstationAuthorDraft()),
    ) as {
      oandoWorkstationFamily: WorkstationFamilyContract;
    };

    base.oandoWorkstationFamily = {
      ...base.oandoWorkstationFamily,
      activeVersionId: "v1",
      versions: [
        {
          ...base.oandoWorkstationFamily.versions[0],
          versionId: "v2",
          status: "draft",
        },
        {
          ...base.oandoWorkstationFamily.versions[0],
          versionId: "v1",
          status: "released",
        },
      ],
    };

    render(
      <WorkstationFamilyAuthorFields
        workstationJson={JSON.stringify(base, null, 2)}
        onWorkstationJsonChange={onChange}
      />,
    );

    expect(screen.getByText("Version migration")).toBeInTheDocument();

    await user.click(screen.getByLabelText("Replace active version (explicit migration)"));
    await user.click(screen.getByRole("button", { name: "Release version" }));

    const latestJson = onChange.mock.calls.at(-1)?.[0];
    const parsed = JSON.parse(latestJson as string) as {
      oandoWorkstationFamily: WorkstationFamilyContract;
    };

    expect(parsed.oandoWorkstationFamily.activeVersionId).toBe("v2");
    expect(
      parsed.oandoWorkstationFamily.versions.some(
        (version) => version.versionId === "v2" && version.status === "released",
      ),
    ).toBe(true);
  });
});
