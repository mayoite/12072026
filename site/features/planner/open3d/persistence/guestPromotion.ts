import type { Open3dProject } from "../model/types";
import type { StagingPlannerDocument } from "./plannerDocumentTypes";
import type { MemberPlanRepository, SaveResult } from "./memberPlanRepository";
import { exportOpen3dProjectJson } from "./projectJson";

export type PromoteGuestResult =
  | { status: "ok"; document: StagingPlannerDocument; saveId: string }
  | { status: "unauthenticated" }
  | { status: "forbidden" }
  | { status: "conflict" }
  | { status: "network"; message: string }
  | { status: "empty" };

/**
 * Promotes the current in-memory guest project to a member cloud save.
 * The guest never directly calls /api/plans — this function is called only
 * after auth is confirmed by the host (Phase 05 triggers this on sign-in).
 *
 * No local storage is read. The source is always the live in-memory project.
 */
export async function promoteGuestSession(
  inMemoryProject: Open3dProject | null,
  repository: MemberPlanRepository,
  idFactory: () => string = () => crypto.randomUUID(),
): Promise<PromoteGuestResult> {
  if (!inMemoryProject) return { status: "empty" };

  const saveId =
    inMemoryProject.id && inMemoryProject.id.trim()
      ? inMemoryProject.id
      : idFactory();

  const document: StagingPlannerDocument = {
    id: saveId,
    name: inMemoryProject.name ?? "My plan",
    unit_system: "metric",
    sceneJson: exportOpen3dProjectJson(inMemoryProject),
  };

  const result: SaveResult = await repository.save(document);

  if (result.status === "ok") {
    return { status: "ok", document: result.document, saveId: result.document.id };
  }
  if (result.status === "unauthenticated") return { status: "unauthenticated" };
  if (result.status === "forbidden") return { status: "forbidden" };
  if (result.status === "conflict") return { status: "conflict" };
  return { status: "network", message: result.message ?? "Unknown error" };
}
