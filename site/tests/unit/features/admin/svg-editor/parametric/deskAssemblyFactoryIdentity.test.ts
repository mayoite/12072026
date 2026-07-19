import { describe, expect, it } from "vitest";

import {
  ADMIN_PRODUCT_STUDIO_NEW_HREF,
  adminSvgEditorEditHref,
  adminSvgEditorNewDeskAssemblyHref,
  isDeskAssemblyFactorySlug,
} from "@/features/admin/svg-editor/parametric/deskAssemblyFactoryIdentity";
import { parseAdminProductStudioMode } from "@/features/admin/svg-editor/views/AdminProductStudioView";

describe("deskAssemblyFactoryIdentity", () => {
  it("recognizes factory desk-assembly slugs", () => {
    expect(isDeskAssemblyFactorySlug("oando-desk-assembly-12")).toBe(true);
    expect(isDeskAssemblyFactorySlug("OANDO-DESK-ASSEMBLY-3")).toBe(true);
    expect(isDeskAssemblyFactorySlug("oando-mellow-sofa-2200")).toBe(false);
    expect(isDeskAssemblyFactorySlug("side-table-001")).toBe(false);
  });

  it("routes factory Edit to same-page Product Studio", () => {
    expect(adminSvgEditorEditHref("oando-desk-assembly-12")).toBe(
      "/admin/svg-editor?edit=oando-desk-assembly-12",
    );
    expect(adminSvgEditorEditHref("side-table-001")).toBe(
      "/admin/svg-editor/side-table-001",
    );
    expect(adminSvgEditorNewDeskAssemblyHref()).toBe(ADMIN_PRODUCT_STUDIO_NEW_HREF);
  });
});

describe("parseAdminProductStudioMode", () => {
  it("opens factory for new and edit query params", () => {
    expect(parseAdminProductStudioMode({ new: "desk-assembly" })).toEqual({
      kind: "factory",
    });
    expect(parseAdminProductStudioMode({ edit: "oando-desk-assembly-12" })).toEqual({
      kind: "factory",
      editSlug: "oando-desk-assembly-12",
    });
    expect(parseAdminProductStudioMode({})).toEqual({ kind: "inventory" });
  });
});
