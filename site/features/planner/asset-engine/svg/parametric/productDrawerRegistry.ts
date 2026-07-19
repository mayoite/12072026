import type { ParametricProductDrawerRuntime } from "./productDrawer";

export type ParametricProductRegistry = {
  get(type: string): ParametricProductDrawerRuntime | undefined;
  require(type: string): ParametricProductDrawerRuntime;
  list(): readonly ParametricProductDrawerRuntime[];
};

export function createParametricProductRegistry(
  drawers: readonly ParametricProductDrawerRuntime[],
): ParametricProductRegistry {
  const byType = new Map<string, ParametricProductDrawerRuntime>();
  for (const drawer of drawers) {
    if (byType.has(drawer.type)) {
      throw new Error(`Duplicate parametric product type: ${drawer.type}`);
    }
    byType.set(drawer.type, drawer);
  }
  const snapshot = Object.freeze([...byType.values()]);

  return {
    get: (type) => byType.get(type),
    require: (type) => {
      const drawer = byType.get(type);
      if (!drawer) {
        throw new Error(`Unknown parametric product type: ${type}`);
      }
      return drawer;
    },
    list: () => snapshot,
  };
}
