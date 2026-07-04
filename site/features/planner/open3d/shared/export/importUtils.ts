// Dead importUtils (roomplan, autoImport, detect etc) removed (unused in prod; tests only). Stub for PLAN-FAIL-0408.
import type { ImportLimits, ImportResult } from "./jsonImport";
export interface RoomPlanImportOptions { straighten?: boolean; orthogonal?: boolean; angleTolerance?: number; mergeDistance?: number; }
export interface FormatDetectionResult { format: "json" | "roomplan" | "unknown"; confidence: number; }
export function importFromJSON(_s: string, _l?: ImportLimits): ImportResult { return { success: false, project: null, errors: [] }; }
export function importFromJSONWithRecovery(_s: string, _l?: ImportLimits): any { return { success: false, project: null, errors: [], recovered: [] }; }
export function importRoomPlan(_d: any, _o: any = {}): any { return { id: "dead" }; }
export function importRoomPlanFromJson(_s: string, _o: any = {}): any { return { floor: null, error: "dead" }; }
export function detectFormat(_s: string): FormatDetectionResult { return { format: "unknown", confidence: 0 }; }
export function autoImport(_s: string, _o?: any): any { return { success: false, project: null, errors: [{path:"format", message:"dead", severity:"error"}] }; }
export { } // reexports removed with dead
