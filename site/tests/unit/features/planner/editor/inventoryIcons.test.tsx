import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { InventoryIcon } from "@/features/planner/editor/inventoryIcons";

describe("InventoryIcon", () => {
  it("renders svg for known taxonomy icon keys", () => {
    const { container: a } = render(<InventoryIcon name="armchair" />);
    expect(a.querySelector("svg")).not.toBeNull();
    const { container: b } = render(<InventoryIcon name="briefcase" />);
    expect(b.querySelector("svg")).not.toBeNull();
  });
});
