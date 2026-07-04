// Dead upload utils removed (never used in prod open3d; only by dead paths/tests). Stub for PLAN-FAIL-0408 coverage reduction.
export interface UploadResult { success: boolean; url?: string; dataUrl?: string; dimensions?: any; preview?: string; error?: string; }
export interface UploadBackgroundOptions { position?: any; scale?: number; opacity?: number; rotation?: number; locked?: boolean; limits?: any; uploadEndpoint?: string; }
export interface UploadSketchOptions { processEndpoint?: string; previewMaxWidth?: number; previewMaxHeight?: number; limits?: any; }
export async function uploadBackgroundImage(_f?: any, _o: any = {}): Promise<UploadResult> { return { success: false, error: "dead" }; }
export function createBackgroundImageFromUpload(_r: any, _o: any = {}): any { return null; }
export async function uploadAndCreateBackground(_f?: any, _o: any = {}): Promise<any> { return { backgroundImage: null, error: "dead" }; }
export async function uploadSketchImage(_f?: any, _o: any = {}): Promise<UploadResult> { return { success: false, error: "dead" }; }
export async function generatePreview(_d: string, _w: number, _h: number): Promise<string> { return _d; }
export type UploadProgressCallback = (p: number) => void;
export async function uploadWithProgress(_f: any, _e: string, _cb?: any): Promise<UploadResult> { return { success: false, error: "dead" }; }
export function validateUpload(_f: any, _o: any = {}): any { return { valid: false, errors: ["dead"], warnings: [] }; }
export function formatFileSize(_b: number): string { return "0 B"; }
export function revokeObjectUrl(_u: string): void {}