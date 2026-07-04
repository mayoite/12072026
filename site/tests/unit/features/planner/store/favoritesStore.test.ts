import { describe, expect, it } from "vitest";
import { useFavoritesStore } from "@/features/planner/store/favoritesStore";

describe("favoritesStore", () => {
  it("should have hook useFavoritesStore defined", () => {
    expect(useFavoritesStore).toBeTypeOf("function");
    expect(useFavoritesStore.getState().favorites).toEqual([]);
  });
});
