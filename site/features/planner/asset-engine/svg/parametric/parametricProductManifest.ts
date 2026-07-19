import type { ParametricProductRegistry } from "./productDrawerRegistry";

export const PARAMETRIC_PRODUCT_TYPE_IDS = ["desk-assembly"] as const;

export function assertParametricProductManifestParity(
  registry: ParametricProductRegistry,
  manifestIds: readonly string[] = PARAMETRIC_PRODUCT_TYPE_IDS,
): void {
  const manifestSet = new Set(manifestIds);
  if (manifestSet.size !== manifestIds.length) {
    throw new Error("Duplicate parametric product manifest entry");
  }

  const runtimeIds = registry.list().map((drawer) => drawer.type);
  const runtimeSet = new Set(runtimeIds);
  const missingRuntimeEntries = manifestIds.filter((type) => !runtimeSet.has(type));
  if (missingRuntimeEntries.length > 0) {
    throw new Error(
      `Missing parametric product runtime entries: ${missingRuntimeEntries.join(", ")}`,
    );
  }

  const extraRuntimeEntries = runtimeIds.filter((type) => !manifestSet.has(type));
  if (extraRuntimeEntries.length > 0) {
    throw new Error(
      `Extra parametric product runtime entries: ${extraRuntimeEntries.join(", ")}`,
    );
  }
}
