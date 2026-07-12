export * from "./catalogTypes";
export * from "./catalogQuery";
export * from "./catalogSearch";
export * from "./proofCatalog";
export * from "./catalogBuyerVisibility";
export * from "./placementAction";
export * from "./workstationSystemV0";
export * from "./workstationMeshV0";
export {
  usePlannerWorkspaceCatalog,
  usePlannerSvgCatalog,
} from "./usePlannerWorkspaceCatalog";

// Full wiring for PLAN-FAIL-0405/0419 fixed: loader reexport enables consumers (catalogClient.loadDescriptorsFromLoader + mapping + resolveBlocks using blocks; usePlannerWorkspaceCatalog; inventory/InventoryPanel).
// catalogue-first (descriptors primary), search parity (cursor/facets), resolver blocks wiring. Client [] addressed, inventory now consumes getAll.
// Cites BP-06, design §9/10, GS. GS ENFORCEMENT: see benchmark BP-06 + phase-06 + I-D.
export * as svgBlockDescriptorLoader from "./svg/svgBlockDescriptorLoader";
