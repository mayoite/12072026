// Dead guestPromotion removed (unused). Stub. PLAN-FAIL-0408.
import type { Open3dProject } from "../model/types";
import type { StagingPlannerDocument } from "./plannerDocumentTypes";
import type { MemberPlanRepository } from "./memberPlanRepository";

export type PromoteGuestResult = { status: "ok"; document: StagingPlannerDocument; saveId: string } | { status: "unauthenticated" } | { status: "forbidden" } | { status: "conflict" } | { status: "network"; message: string } | { status: "empty" };
export async function promoteGuestSession(_p: any, _r: any, _f?: any): Promise<PromoteGuestResult> { return { status: "empty" }; }
