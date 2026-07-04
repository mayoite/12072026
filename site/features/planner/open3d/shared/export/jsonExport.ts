// Dead code removed (jsonExport / envelope utils never called from prod; only tests). Clean for PLAN-FAIL-0408 coverage. Retained module to satisfy any barrel.
export interface ExportResult { success: boolean; envelope: any; error?: string; }
export interface JsonExportOptions { pretty?: boolean; floorId?: string; }
export function exportToJson(_p?: any, _o?: any): ExportResult { return { success: false, envelope: null, error: "dead" }; }
export function envelopeToJsonString(_e?: any, _p = false): string { return "{}"; }