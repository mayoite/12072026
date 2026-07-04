// Dead code removed (jsonImport validation/recover + limits never used from prod; only tests). Cleaned for PLAN-FAIL-0408. Stub to keep module.
export interface ImportValidationError { path: string; message: string; severity: "error" | "warning"; }
export interface ImportResult { success: boolean; project: any; errors: ImportValidationError[]; }
export interface ImportLimits { maxFloors: number; maxWallsPerFloor: number; maxFurniturePerFloor: number; maxJsonSize: number; maxWallLengthMm: number; maxDimensionMm: number; }
export const DEFAULT_IMPORT_LIMITS: ImportLimits = { maxFloors: 20, maxWallsPerFloor: 500, maxFurniturePerFloor: 1000, maxJsonSize: 10485760, maxWallLengthMm: 50000, maxDimensionMm: 100000 };
export function parseJsonToEnvelope(_s: string): any { return { envelope: null, parseError: null }; }
export function validateEnvelopeStructure(_e: any, _l?: any): ImportValidationError[] { return []; }
export function importFromJson(_s: string, _l?: any): ImportResult { return { success: false, project: null, errors: [] }; }
export function recoverFromErrors(_e: any): { recovered: string[] } { return { recovered: [] }; }
// (dangling dead validation excised)
// (all dangling dead code fully excised for PLAN-FAIL-0408)