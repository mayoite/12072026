// Dead member repo removed (unused in prod). Stub for PLAN-FAIL-0408.
import type { StagingPlannerDocument } from "./plannerDocumentTypes";
export type FetchFn = any; export type TokenFn = any;
export type LoadResult = any; export type SaveResult = any; export type MemberSaveResult = SaveResult;
export interface ListSummary { id: string; name: string; updated_at?: string; }
export type ListResult = any; export type DeleteResult = any;
export interface MemberPlanRepository { load(id: string): Promise<LoadResult>; save(d: any, s?: string): Promise<SaveResult>; list(): Promise<ListResult>; delete(id: string): Promise<DeleteResult>; }
export function createMemberPlanRepository(_t: TokenFn, _f?: FetchFn): MemberPlanRepository { return { load: async ()=>({status:"network"}), save: async()=>({status:"network"}), list: async()=>({status:"network"}), delete: async()=>({status:"network"}) }; }