import { PARAMETRIC_PRODUCT_TYPE_IDS } from "@/features/planner/asset-engine/svg/parametric/parametricProductManifest";
import {
  eraseParametricAuthoringDefinition,
  type ParametricAuthoringDefinitionRuntime,
} from "./authoringTypes";
import { deskAssemblyAuthoringDefinition } from "./deskAssemblyAuthoringDefinition";

export type ParametricAuthoringRegistry = {
  get(type: string): ParametricAuthoringDefinitionRuntime | undefined;
  require(type: string): ParametricAuthoringDefinitionRuntime;
  list(): readonly ParametricAuthoringDefinitionRuntime[];
};

export function createParametricAuthoringRegistry(
  definitions: readonly ParametricAuthoringDefinitionRuntime[],
): ParametricAuthoringRegistry {
  const byType = new Map<string, ParametricAuthoringDefinitionRuntime>();
  for (const definition of definitions) {
    if (byType.has(definition.type)) {
      throw new Error(`Duplicate parametric authoring type: ${definition.type}`);
    }
    byType.set(definition.type, definition);
  }
  const snapshot = Object.freeze([...byType.values()]);
  return {
    get: (type) => byType.get(type),
    require: (type) => {
      const definition = byType.get(type);
      if (!definition) {
        throw new Error(`Unknown parametric authoring type: ${type}`);
      }
      return definition;
    },
    list: () => snapshot,
  };
}

export function assertParametricAuthoringManifestParity(
  registry: ParametricAuthoringRegistry,
): void {
  const manifest = new Set<string>(PARAMETRIC_PRODUCT_TYPE_IDS);
  const runtimeIds = registry.list().map((definition) => definition.type);
  const missing = PARAMETRIC_PRODUCT_TYPE_IDS.filter(
    (type) => !runtimeIds.includes(type),
  );
  const extra = runtimeIds.filter((type) => !manifest.has(type));
  if (missing.length > 0) {
    throw new Error(`Missing parametric authoring types: ${missing.join(", ")}`);
  }
  if (extra.length > 0) {
    throw new Error(`Extra parametric authoring types: ${extra.join(", ")}`);
  }
}

export const parametricAuthoringRegistry = createParametricAuthoringRegistry([
  eraseParametricAuthoringDefinition(deskAssemblyAuthoringDefinition),
]);

assertParametricAuthoringManifestParity(parametricAuthoringRegistry);
