import { describe, expect, it } from "vitest";

import type {
  ConfiguratorCatalogItem,
  StandardCatalogItem,
} from "@/features/admin/adminCatalogClient";
import {
  CONFIGURATOR_CATEGORIES,
  MESH_TYPES,
  STANDARD_CATEGORIES,
  configuratorDraftToPayload,
  configuratorFromItem,
  emptyConfiguratorDraft,
  emptyStandardDraft,
  getConfiguratorJsonErrors,
  standardDraftToPayload,
  standardFromItem,
  validateConfiguratorDraft,
  validateStandardDraft,
  type ConfiguratorDraft,
  type StandardDraft,
} from "@/features/admin/adminCatalogManagerUtils";

function baseStandardItem(
  overrides: Partial<StandardCatalogItem> = {},
): StandardCatalogItem {
  return {
    id: "std-1",
    name: "Bench desk",
    category: "workstation",
    subcategory: "bench",
    width_mm: 1400,
    depth_mm: 700,
    height_mm: 750,
    price: 1200,
    mesh_type: "box",
    image_url: "https://cdn.example/img.png",
    visible: true,
    active: true,
    description: "A desk",
    ...overrides,
  };
}

function baseConfiguratorItem(
  overrides: Partial<ConfiguratorCatalogItem> = {},
): ConfiguratorCatalogItem {
  return {
    id: "cfg-1",
    slug: "bench-desk",
    name: "Bench desk",
    category: "desks",
    family: "bench",
    brand_name: "Oando",
    sizing_type: "fixed",
    description: "Parametric desk family",
    materials: ["laminate", "steel"],
    thumbnail_url: "https://cdn.example/thumb.png",
    model_3d_url: "",
    active: true,
    default_footprint: { L: 1200, D: 600, H: 750 },
    ...overrides,
  };
}

describe("adminCatalogManagerUtils constants", () => {
  it("exports procedural mesh kinds only", () => {
    expect(MESH_TYPES).toEqual(["box", "cylinder", "sphere", "custom"]);
  });

  it("exports standard and configurator category lists", () => {
    expect(STANDARD_CATEGORIES).toContain("workstation");
    expect(STANDARD_CATEGORIES).toContain("misc");
    expect(CONFIGURATOR_CATEGORIES).toContain("desks");
    expect(CONFIGURATOR_CATEGORIES).toContain("accessories");
  });
});

describe("emptyStandardDraft / standardFromItem", () => {
  it("returns create defaults", () => {
    const draft = emptyStandardDraft();
    expect(draft.name).toBe("");
    expect(draft.category).toBe("workstation");
    expect(draft.width_mm).toBe("1200");
    expect(draft.depth_mm).toBe("600");
    expect(draft.height_mm).toBe("750");
    expect(draft.mesh_type).toBe("box");
    expect(draft.visible).toBe(true);
    expect(draft.id).toBeUndefined();
  });

  it("maps a full catalog item into draft strings", () => {
    const draft = standardFromItem(baseStandardItem());
    expect(draft).toEqual({
      id: "std-1",
      name: "Bench desk",
      category: "workstation",
      subcategory: "bench",
      description: "A desk",
      width_mm: "1400",
      depth_mm: "700",
      height_mm: "750",
      price: "1200",
      mesh_type: "box",
      image_url: "https://cdn.example/img.png",
      visible: true,
    });
  });

  it("coalesces nullish fields and treats visible/active false as hidden", () => {
    const draft = standardFromItem(
      baseStandardItem({
        subcategory: null,
        description: null,
        width_mm: undefined,
        depth_mm: undefined,
        height_mm: undefined,
        price: null,
        mesh_type: undefined,
        image_url: null,
        visible: false,
        active: true,
      }),
    );
    expect(draft.subcategory).toBe("");
    expect(draft.description).toBe("");
    expect(draft.width_mm).toBe("");
    expect(draft.depth_mm).toBe("");
    expect(draft.height_mm).toBe("");
    expect(draft.price).toBe("");
    expect(draft.mesh_type).toBe("box");
    expect(draft.image_url).toBe("");
    expect(draft.visible).toBe(false);
  });

  it("hides items when active is false even if visible is unset", () => {
    const draft = standardFromItem(
      baseStandardItem({ visible: undefined, active: false }),
    );
    expect(draft.visible).toBe(false);
  });
});

describe("emptyConfiguratorDraft / configuratorFromItem", () => {
  it("returns create defaults with valid JSON templates", () => {
    const draft = emptyConfiguratorDraft();
    expect(draft.category).toBe("desks");
    expect(draft.sizing_type).toBe("fixed");
    expect(draft.active).toBe(true);
    expect(JSON.parse(draft.workstationJson)).toMatchObject({
      shape: "straight",
      heightMm: 750,
    });
    expect(JSON.parse(draft.sizeOptionsJson)).toEqual([
      { sku: "SKU-1200", label: "1200mm", dim: { L: 1200, D: 600, H: 750 } },
    ]);
    expect(JSON.parse(draft.defaultFootprintJson)).toEqual({
      L: 1200,
      D: 600,
      H: 750,
    });
    expect(draft.derivedRulesJson).toBe("");
  });

  it("maps item fields and joins materials", () => {
    const draft = configuratorFromItem(
      baseConfiguratorItem({
        workstation: { shape: "L" },
        size_options: [{ sku: "A" }],
        derived_rules: { rule: 1 },
        sizing_type: "parametric",
      }),
    );
    expect(draft.id).toBe("cfg-1");
    expect(draft.slug).toBe("bench-desk");
    expect(draft.materials).toBe("laminate, steel");
    expect(draft.sizing_type).toBe("parametric");
    expect(JSON.parse(draft.workstationJson)).toEqual({ shape: "L" });
    expect(JSON.parse(draft.sizeOptionsJson)).toEqual([{ sku: "A" }]);
    expect(JSON.parse(draft.derivedRulesJson)).toEqual({ rule: 1 });
  });

  it("falls back to empty-draft JSON when nested payloads are missing", () => {
    const defaults = emptyConfiguratorDraft();
    const draft = configuratorFromItem(
      baseConfiguratorItem({
        family: null,
        brand_name: null,
        description: null,
        materials: undefined,
        thumbnail_url: null,
        model_3d_url: null,
        active: false,
        workstation: undefined,
        size_options: undefined,
        default_footprint: undefined,
        derived_rules: undefined,
      }),
    );
    expect(draft.family).toBe("");
    expect(draft.brand_name).toBe("");
    expect(draft.description).toBe("");
    expect(draft.materials).toBe("");
    expect(draft.thumbnail_url).toBe("");
    expect(draft.model_3d_url).toBe("");
    expect(draft.active).toBe(false);
    expect(draft.workstationJson).toBe(defaults.workstationJson);
    expect(draft.sizeOptionsJson).toBe(defaults.sizeOptionsJson);
    expect(draft.defaultFootprintJson).toBe(defaults.defaultFootprintJson);
    expect(draft.derivedRulesJson).toBe("");
  });
});

describe("getConfiguratorJsonErrors", () => {
  it("returns no errors for empty optional derived rules and valid sizing JSON", () => {
    const draft = emptyConfiguratorDraft();
    expect(getConfiguratorJsonErrors(draft)).toEqual({});
  });

  it("validates only the JSON field for the active sizing type", () => {
    const draft: ConfiguratorDraft = {
      ...emptyConfiguratorDraft(),
      sizing_type: "parametric",
      workstationJson: "{not-json",
      sizeOptionsJson: "{also-bad",
      defaultFootprintJson: "{bad",
    };
    const errors = getConfiguratorJsonErrors(draft);
    expect(errors.workstationJson).toMatch(/Invalid JSON in workstation/);
    expect(errors.sizeOptionsJson).toBeUndefined();
    expect(errors.defaultFootprintJson).toBeUndefined();
  });

  it("flags discrete size_options JSON errors", () => {
    const draft: ConfiguratorDraft = {
      ...emptyConfiguratorDraft(),
      sizing_type: "discrete",
      sizeOptionsJson: "not-json",
    };
    expect(getConfiguratorJsonErrors(draft).sizeOptionsJson).toMatch(
      /Invalid JSON in size_options/,
    );
  });

  it("flags fixed default_footprint JSON errors", () => {
    const draft: ConfiguratorDraft = {
      ...emptyConfiguratorDraft(),
      sizing_type: "fixed",
      defaultFootprintJson: "[",
    };
    expect(getConfiguratorJsonErrors(draft).defaultFootprintJson).toMatch(
      /Invalid JSON in default_footprint/,
    );
  });

  it("flags derived_rules only when non-empty and invalid", () => {
    const emptyRules = getConfiguratorJsonErrors({
      ...emptyConfiguratorDraft(),
      derivedRulesJson: "   ",
    });
    expect(emptyRules.derivedRulesJson).toBeUndefined();

    const badRules = getConfiguratorJsonErrors({
      ...emptyConfiguratorDraft(),
      derivedRulesJson: "{broken",
    });
    expect(badRules.derivedRulesJson).toMatch(/Invalid JSON in derived_rules/);
  });

  it("accepts whitespace-trimmed valid JSON for derived rules", () => {
    const errors = getConfiguratorJsonErrors({
      ...emptyConfiguratorDraft(),
      derivedRulesJson: '  {"ok":true}  ',
    });
    expect(errors).toEqual({});
  });
});

describe("validateStandardDraft", () => {
  it("requires a name", () => {
    const draft: StandardDraft = { ...emptyStandardDraft(), name: "  " };
    expect(validateStandardDraft(draft)).toBe("Name is required");
  });

  it("requires positive dimensions", () => {
    expect(
      validateStandardDraft({ ...emptyStandardDraft(), name: "Desk", width_mm: "0" }),
    ).toBe("Width must be a positive number");
    expect(
      validateStandardDraft({
        ...emptyStandardDraft(),
        name: "Desk",
        depth_mm: "-1",
      }),
    ).toBe("Depth must be a positive number");
    expect(
      validateStandardDraft({
        ...emptyStandardDraft(),
        name: "Desk",
        height_mm: "nope",
      }),
    ).toBe("Height must be a positive number");
  });

  it("allows empty price and rejects negative or non-numeric price", () => {
    const ok = validateStandardDraft({
      ...emptyStandardDraft(),
      name: "Desk",
      price: "",
    });
    expect(ok).toBeNull();

    expect(
      validateStandardDraft({
        ...emptyStandardDraft(),
        name: "Desk",
        price: "-5",
      }),
    ).toBe("Price must be a non-negative number");

    expect(
      validateStandardDraft({
        ...emptyStandardDraft(),
        name: "Desk",
        price: "abc",
      }),
    ).toBe("Price must be a non-negative number");
  });

  it("accepts zero price and valid drafts", () => {
    expect(
      validateStandardDraft({
        ...emptyStandardDraft(),
        name: "Desk",
        price: "0",
      }),
    ).toBeNull();
  });
});

describe("validateConfiguratorDraft", () => {
  it("requires name and category", () => {
    const draft = emptyConfiguratorDraft();
    expect(validateConfiguratorDraft({ ...draft, name: "" }, {})).toBe(
      "Name is required",
    );
    expect(
      validateConfiguratorDraft({ ...draft, name: "Desk", category: "  " }, {}),
    ).toBe("Category is required");
  });

  it("blocks save when JSON field errors exist", () => {
    const draft = { ...emptyConfiguratorDraft(), name: "Desk" };
    expect(
      validateConfiguratorDraft(draft, {
        workstationJson: "Invalid JSON in workstation",
      }),
    ).toBe("Resolve the JSON validation errors before saving.");
  });

  it("accepts a clean draft", () => {
    expect(
      validateConfiguratorDraft(
        { ...emptyConfiguratorDraft(), name: "Desk", category: "desks" },
        {},
      ),
    ).toBeNull();
  });
});

describe("standardDraftToPayload", () => {
  it("builds create payload without id and omits empty optionals", () => {
    const payload = standardDraftToPayload({
      ...emptyStandardDraft(),
      name: "  Desk  ",
      category: "  table  ",
      subcategory: "  ",
      description: "  ",
      price: "",
      image_url: "  ",
      mesh_type: "",
      visible: false,
    });
    expect(payload).toEqual({
      name: "Desk",
      category: "table",
      subcategory: undefined,
      description: undefined,
      width_mm: 1200,
      depth_mm: 600,
      height_mm: 750,
      price: undefined,
      mesh_type: "box",
      image_url: undefined,
      visible: false,
    });
    expect(payload).not.toHaveProperty("id");
  });

  it("includes id and numeric price on edit", () => {
    const payload = standardDraftToPayload({
      ...emptyStandardDraft(),
      id: "std-9",
      name: "Desk",
      price: "99.5",
      subcategory: "bench",
      description: "Nice",
      image_url: "/img.png",
      mesh_type: "cylinder",
    });
    expect(payload.id).toBe("std-9");
    expect(payload.price).toBe(99.5);
    expect(payload.subcategory).toBe("bench");
    expect(payload.description).toBe("Nice");
    expect(payload.image_url).toBe("/img.png");
    expect(payload.mesh_type).toBe("cylinder");
  });

  it("throws when dimensions are not positive", () => {
    expect(() =>
      standardDraftToPayload({
        ...emptyStandardDraft(),
        name: "Desk",
        width_mm: "0",
      }),
    ).toThrow("Width must be a positive number");
  });
});

describe("configuratorDraftToPayload", () => {
  it("builds parametric payload with workstation and materials list", () => {
    const draft: ConfiguratorDraft = {
      ...emptyConfiguratorDraft(),
      name: "  Desk  ",
      category: "  desks  ",
      slug: "  bench  ",
      family: "  fam  ",
      brand_name: "  Brand  ",
      sizing_type: "parametric",
      description: "  d  ",
      materials: " oak , , steel ",
      thumbnail_url: "  /t.png  ",
      model_3d_url: "  ",
      active: false,
      workstationJson: JSON.stringify({ shape: "straight" }),
      derivedRulesJson: "",
    };
    const payload = configuratorDraftToPayload(draft);
    expect(payload).toMatchObject({
      name: "Desk",
      category: "desks",
      slug: "bench",
      family: "fam",
      brand_name: "Brand",
      sizing_type: "parametric",
      description: "d",
      materials: ["oak", "steel"],
      thumbnail_url: "/t.png",
      model_3d_url: undefined,
      active: false,
      workstation: { shape: "straight" },
    });
    expect(payload).not.toHaveProperty("size_options");
    expect(payload).not.toHaveProperty("default_footprint");
    expect(payload).not.toHaveProperty("derived_rules");
  });

  it("builds discrete payload with size_options", () => {
    const options = [{ sku: "S1", label: "1200", dim: { L: 1200, D: 600, H: 750 } }];
    const payload = configuratorDraftToPayload({
      ...emptyConfiguratorDraft(),
      name: "Desk",
      sizing_type: "discrete",
      sizeOptionsJson: JSON.stringify(options),
    });
    expect(payload.size_options).toEqual(options);
    expect(payload).not.toHaveProperty("workstation");
  });

  it("builds fixed payload with default_footprint and derived_rules", () => {
    const payload = configuratorDraftToPayload({
      ...emptyConfiguratorDraft(),
      name: "Desk",
      sizing_type: "fixed",
      defaultFootprintJson: JSON.stringify({ L: 1, D: 2, H: 3 }),
      derivedRulesJson: JSON.stringify({ max: 4 }),
    });
    expect(payload.default_footprint).toEqual({ L: 1, D: 2, H: 3 });
    expect(payload.derived_rules).toEqual({ max: 4 });
  });

  it("allows system-generated GLB URLs and rejects designer static GLB", () => {
    const allowed = configuratorDraftToPayload({
      ...emptyConfiguratorDraft(),
      name: "Desk",
      model_3d_url: "/catalog-assets/generated/desk.glb",
    });
    expect(allowed.model_3d_url).toBe("/catalog-assets/generated/desk.glb");

    expect(() =>
      configuratorDraftToPayload({
        ...emptyConfiguratorDraft(),
        name: "Desk",
        model_3d_url: "https://cdn.example/hand-authored.glb",
      }),
    ).toThrow(/model_3d_url/);
  });

  it("throws on invalid JSON for the active sizing field", () => {
    expect(() =>
      configuratorDraftToPayload({
        ...emptyConfiguratorDraft(),
        name: "Desk",
        sizing_type: "parametric",
        workstationJson: "{bad",
      }),
    ).toThrow("Invalid JSON in workstation");
  });

  it("omits empty slug/family/brand as undefined", () => {
    const payload = configuratorDraftToPayload({
      ...emptyConfiguratorDraft(),
      name: "Desk",
      slug: "  ",
      family: "",
      brand_name: "   ",
    });
    expect(payload.slug).toBeUndefined();
    expect(payload.family).toBeUndefined();
    expect(payload.brand_name).toBeUndefined();
  });
});
