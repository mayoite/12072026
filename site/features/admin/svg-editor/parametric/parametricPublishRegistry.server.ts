import { deskAssemblyDrawer } from "@/features/planner/asset-engine/svg/parametric/deskAssemblyDrawer";
import { eraseParametricProductDrawer, type ParametricPreview, type ParametricProductDrawerRuntime } from "@/features/planner/asset-engine/svg/parametric/productDrawer";
import type { BlockDescriptor } from "@/features/planner/catalog/svg/svgTypes";
import { PARAMETRIC_PRODUCT_TYPE_IDS } from "@/features/planner/asset-engine/svg/parametric/parametricProductManifest";
import { buildDeskAssemblyPublishDescriptor, type ExistingParametricIdentity } from "./deskAssemblyPublishDescriptor";

export type ParametricPublishAdapter = { readonly type: string; readonly drawer: ParametricProductDrawerRuntime; readonly buildDescriptor: (fields: unknown, preview: ParametricPreview, existing?: ExistingParametricIdentity | null) => BlockDescriptor; readonly lifecycle: "live" };

const adapters: readonly ParametricPublishAdapter[] = [{ type: "desk-assembly", drawer: eraseParametricProductDrawer(deskAssemblyDrawer), buildDescriptor: (fields, preview, existing) => buildDeskAssemblyPublishDescriptor(deskAssemblyDrawer.schema.parse(fields), preview, existing), lifecycle: "live" }];
const byType = new Map(adapters.map((adapter) => [adapter.type, adapter]));
const runtimeIds = [...byType.keys()];
if (runtimeIds.length !== PARAMETRIC_PRODUCT_TYPE_IDS.length || PARAMETRIC_PRODUCT_TYPE_IDS.some((type) => !byType.has(type))) throw new Error("Parametric publish registry does not match manifest");

export const PARAMETRIC_PUBLISH_REGISTRY = { get: (type: string) => byType.get(type), require: (type: string) => { const adapter = byType.get(type); if (!adapter) throw new Error("Unknown parametric product type"); return adapter; }, list: () => adapters };
