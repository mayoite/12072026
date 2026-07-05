import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import {
  INVENTORY_CATEGORIES,
  INVENTORY_ROOM_GROUPS,
  type InventoryIconName,
} from "@/features/planner/open3d/catalog/inventory/inventoryTaxonomy";
import { InventoryIcon } from "@/features/planner/open3d/editor/inventoryIcons";

/**
 * 1A P1 icon policy: planner chrome is Phosphor-only — no emoji or unicode
 * pictograph controls. `00-REVISION.md` Decision 3, `01-START.md` §5,
 * `02-PHASE-1.md` §3.
 */

const ALLOWED_ICON_NAMES: readonly InventoryIconName[] = [
  "armchair",
  "lightbulb",
  "image",
  "plant",
  "fork-knife",
  "ruler",
  "house",
  "couch",
  "bed",
  "cooking-pot",
  "shower",
  "briefcase",
  "tree",
  "car",
];

// Emoji / pictograph ranges. Deliberately excludes typographic punctuation
// (en dash, ampersand) that legitimately appears in labels.
const EMOJI_PATTERN =
  /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}\u{1F1E6}-\u{1F1FF}]/u;

afterEach(() => {
  cleanup();
});

describe("inventory taxonomy icon policy", () => {
  it("uses only allowed Phosphor icon keys for categories", () => {
    for (const category of INVENTORY_CATEGORIES) {
      expect(ALLOWED_ICON_NAMES).toContain(category.icon);
    }
  });

  it("uses only allowed Phosphor icon keys for room groups", () => {
    for (const room of INVENTORY_ROOM_GROUPS) {
      expect(ALLOWED_ICON_NAMES).toContain(room.icon);
    }
  });

  it("carries no emoji in taxonomy icon fields or labels", () => {
    const serialized = JSON.stringify([INVENTORY_CATEGORIES, INVENTORY_ROOM_GROUPS]);
    expect(EMOJI_PATTERN.test(serialized)).toBe(false);
  });
});

describe("InventoryIcon renders Phosphor glyphs", () => {
  it("renders an accessible-hidden svg for every allowed icon key", () => {
    for (const name of ALLOWED_ICON_NAMES) {
      const { container, unmount } = render(<InventoryIcon name={name} />);
      const svg = container.querySelector("svg");
      expect(svg, `expected an svg for icon "${name}"`).not.toBeNull();
      expect(svg?.getAttribute("aria-hidden")).toBe("true");
      unmount();
    }
  });

  it("forwards presentation props to the glyph", () => {
    const { container } = render(<InventoryIcon name="armchair" size={20} weight="bold" />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute("width")).toBe("20");
  });
});
