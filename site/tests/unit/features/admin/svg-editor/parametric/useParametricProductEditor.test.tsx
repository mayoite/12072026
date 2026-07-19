import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { eraseParametricProductDrawer } from "@/features/planner/asset-engine/svg/parametric/productDrawer";
import { deskAssemblyAuthoringDefinition } from "@/features/admin/svg-editor/parametric/deskAssemblyAuthoringDefinition";
import {
  eraseParametricAuthoringDefinition,
  type ParametricAuthoringDefinitionRuntime,
} from "@/features/admin/svg-editor/parametric/authoringTypes";
import { createParametricAuthoringRegistry } from "@/features/admin/svg-editor/parametric/parametricAuthoringRegistry";
import { useParametricProductEditor } from "@/features/admin/svg-editor/parametric/useParametricProductEditor";

const testBedDefinition: ParametricAuthoringDefinitionRuntime = {
  type: "test-bed",
  drawer: {
    ...eraseParametricProductDrawer(deskAssemblyAuthoringDefinition.drawer),
    type: "test-bed",
    label: "Test bed",
  },
  defaultDisplay: () => ({
    displayUnit: "cm",
    width: 160,
    name: "Test bed",
    sku: "TEST-BED-01",
    slug: "test-bed-01",
  }),
  parseDisplay: () => ({
    ok: true,
    fields: deskAssemblyAuthoringDefinition.drawer.defaults(),
  }),
  convertUnit: (display) => display,
  updateDisplay: (display, key, value) => ({
    ...(display as Record<string, unknown>),
    [key]: value,
  }),
  sections: [
    {
      id: "mattress",
      label: "Mattress",
      fields: [{ key: "width", label: "Width", kind: "number", unit: "length" }],
    },
  ],
  tools: [
    { kind: "command", id: "headboard", label: "Headboard", command: "headboard" },
  ],
  identity: {
    read: () => ({ name: "Test bed", sku: "TEST-BED-01", slug: "test-bed-01" }),
    write: (display, identity) => ({
      ...(display as Record<string, unknown>),
      ...identity,
    }),
  },
};

const registry = createParametricAuthoringRegistry([
  eraseParametricAuthoringDefinition(deskAssemblyAuthoringDefinition),
  testBedDefinition,
]);

describe("useParametricProductEditor", () => {
  it("derives valid assembly preview from the active definition", () => {
    const { result } = renderHook(() =>
      useParametricProductEditor({ initialType: "desk-assembly", registry }),
    );

    expect(result.current.type).toBe("desk-assembly");
    expect(result.current.parse.ok).toBe(true);
    expect(result.current.preview?.parts.map((part) => part.id)).toContain(
      "workstation-01",
    );
    expect(result.current.sections.map((section) => section.id)).toContain("layout");
  });

  it("updates through definition adapters and preserves mm geometry on unit change", () => {
    const { result } = renderHook(() =>
      useParametricProductEditor({ initialType: "desk-assembly", registry }),
    );
    const beforeWidth = result.current.preview?.widthMm;

    act(() => result.current.updateField("layout", "u"));
    expect(result.current.parse.ok).toBe(true);
    expect(result.current.preview?.parts.map((part) => part.id)).toContain(
      "return-left",
    );

    act(() => result.current.convertUnit("mm"));
    expect(result.current.unit).toBe("mm");
    expect(result.current.preview?.widthMm).toBe(beforeWidth);
  });

  it("switches product definitions and clears selected part state", () => {
    const { result } = renderHook(() =>
      useParametricProductEditor({ initialType: "desk-assembly", registry }),
    );
    act(() => result.current.focusPart("workstation-01"));
    expect(result.current.selectedPartId).toBe("workstation-01");

    act(() => result.current.selectType("test-bed"));
    expect(result.current.type).toBe("test-bed");
    expect(result.current.sections.map((section) => section.id)).toContain(
      "mattress",
    );
    expect(result.current.selectedPartId).toBeNull();
  });

  it("applies repeatable viewport commands and shared canvas toggles", () => {
    const { result } = renderHook(() =>
      useParametricProductEditor({ initialType: "desk-assembly", registry }),
    );

    act(() => result.current.requestViewportCommand("fit"));
    expect(result.current.viewportCommand).toEqual({ name: "fit", sequence: 1 });
    act(() => result.current.requestViewportCommand("fit"));
    expect(result.current.viewportCommand).toEqual({ name: "fit", sequence: 2 });

    act(() => result.current.toggleCanvasField("grid"));
    expect(result.current.gridEnabled).toBe(true);
  });
});
