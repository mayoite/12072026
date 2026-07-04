import { describe, expect, it, vi } from "vitest";
import { resolveGridMmPerUnit, projectSetupStorageKey, isProjectSetupCompleteInStorage, markProjectSetupCompleteInStorage, filterCatalogItemsByPurpose, applyProjectSetup, createDefaultProjectSetupDraft, metadataToDocumentFields, metadataToSpaceSuggestInput } from "@/features/planner/onboarding/projectSetup";

vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: any) => React.createElement("div", { "data-testid": "mock-canvas" }, children),
  useFrame: vi.fn(),
  useThree: () => ({ camera: {}, scene: {}, gl: {} }),
}));
vi.mock("@react-three/drei", () => ({
  OrbitControls: () => React.createElement("div", { "data-testid": "orbit-controls" }),
  useGLTF: () => ({ scene: {} }),
}));

describe("projectSetup", () => {
  it("should have function resolveGridMmPerUnit defined", () => {
    expect(resolveGridMmPerUnit).toBeTypeOf("function");
  });
  it("should have function projectSetupStorageKey defined", () => {
    expect(projectSetupStorageKey).toBeTypeOf("function");
  });
  it("should have function isProjectSetupCompleteInStorage defined", () => {
    expect(isProjectSetupCompleteInStorage).toBeTypeOf("function");
  });
  it("should have function markProjectSetupCompleteInStorage defined", () => {
    expect(markProjectSetupCompleteInStorage).toBeTypeOf("function");
  });
  it("should have function filterCatalogItemsByPurpose defined", () => {
    expect(filterCatalogItemsByPurpose).toBeTypeOf("function");
  });
  it("should have function applyProjectSetup defined", () => {
    expect(applyProjectSetup).toBeTypeOf("function");
  });
  it("should have function createDefaultProjectSetupDraft defined", () => {
    expect(createDefaultProjectSetupDraft).toBeTypeOf("function");
  });
  it("should have function metadataToDocumentFields defined", () => {
    expect(metadataToDocumentFields).toBeTypeOf("function");
  });
  it("should have function metadataToSpaceSuggestInput defined", () => {
    expect(metadataToSpaceSuggestInput).toBeTypeOf("function");
  });
});