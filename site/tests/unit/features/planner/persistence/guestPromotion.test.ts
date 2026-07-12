import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { MemberPlanRepository, MemberSaveResult } from "@/features/planner/project/persistence/memberPlanRepository";
import type { StagingPlannerDocument } from "@/features/planner/project/persistence/plannerDocumentTypes";
import { promoteGuestSession } from "@/features/planner/project/persistence/guestPromotion";
import { importOpen3dProjectJson } from "@/features/planner/project/persistence/projectJson";
import { createOpen3dProject } from "@/features/planner/project/model/project";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeProject(overrides: Partial<Parameters<typeof createOpen3dProject>[0]> = {}) {
  return createOpen3dProject({ idFactory: (() => { let n = 0; return () => `id-${++n}`; })(), ...overrides });
}

function makeSavedDoc(project: ReturnType<typeof makeProject>): StagingPlannerDocument {
  return {
    id: project.id,
    name: project.name,
    unit_system: "metric",
    sceneJson: JSON.stringify(project),
  };
}

function repoReturning(result: MemberSaveResult): MemberPlanRepository {
  return {
    save: vi.fn().mockResolvedValue(result),
    load: vi.fn(),
    list: vi.fn(),
    delete: vi.fn(),
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("promoteGuestSession", () => {
  // (a) Happy path
  it("calls repository.save once and returns ok with saveId", async () => {
    const project = makeProject({ name: "My Floor Plan" });
    const savedDoc = makeSavedDoc(project);
    const repo = repoReturning({ status: "ok", document: savedDoc });

    const result = await promoteGuestSession(project, repo);

    expect(repo.save).toHaveBeenCalledOnce();
    expect(result.status).toBe("ok");
    if (result.status === "ok") {
      expect(result.saveId).toBe(project.id);
      expect(result.document).toEqual(savedDoc);
    }
  });

  // (b) null project â€” returns empty without touching repo
  it("returns empty immediately when project is null", async () => {
    const repo = repoReturning({ status: "ok", document: makeSavedDoc(makeProject()) });

    const result = await promoteGuestSession(null, repo);

    expect(result.status).toBe("empty");
    expect(repo.save).not.toHaveBeenCalled();
  });

  // (c) Unauthenticated
  it("returns unauthenticated when repository returns unauthenticated", async () => {
    const repo = repoReturning({ status: "unauthenticated" });
    const result = await promoteGuestSession(makeProject(), repo);
    expect(result.status).toBe("unauthenticated");
  });

  // (d) Network failure â€” message is forwarded
  it("returns network with message when repository returns network failure", async () => {
    const repo = repoReturning({ status: "network", message: "timeout" });
    const result = await promoteGuestSession(makeProject(), repo);
    expect(result.status).toBe("network");
    if (result.status === "network") {
      expect(result.message).toBe("timeout");
    }
  });

  // (e) Conflict
  it("returns conflict when repository returns conflict", async () => {
    const repo = repoReturning({ status: "conflict" });
    const result = await promoteGuestSession(makeProject(), repo);
    expect(result.status).toBe("conflict");
  });

  it("returns forbidden when repository returns forbidden", async () => {
    const repo = repoReturning({ status: "forbidden" });
    const result = await promoteGuestSession(makeProject(), repo);
    expect(result.status).toBe("forbidden");
  });

  it('returns network with "Unknown error" when repository omits a message', async () => {
    const repo: MemberPlanRepository = {
      save: vi.fn().mockResolvedValue({ status: "network" } as MemberSaveResult),
      load: vi.fn(),
      list: vi.fn(),
      delete: vi.fn(),
    };
    const result = await promoteGuestSession(makeProject(), repo);
    expect(result).toEqual({ status: "network", message: "Unknown error" });
  });

  // (f) No-guest-API-call fixture
  describe("no-guest-API-call fixture", () => {
    let fetchSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      fetchSpy = vi.spyOn(globalThis, "fetch");
    });

    afterEach(() => {
      fetchSpy.mockRestore();
    });

    it("never calls fetch when project is null (early-return path)", async () => {
      const repo = repoReturning({ status: "ok", document: makeSavedDoc(makeProject()) });
      await promoteGuestSession(null, repo);
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("never calls fetch directly even when saving â€” only the repository abstraction is invoked", async () => {
      const project = makeProject();
      const savedDoc = makeSavedDoc(project);
      const mockSave = vi.fn().mockResolvedValue({ status: "ok", document: savedDoc } as MemberSaveResult);
      const repo: MemberPlanRepository = {
        save: mockSave,
        load: vi.fn(),
        list: vi.fn(),
        delete: vi.fn(),
      };

      await promoteGuestSession(project, repo);

      // The repository is the abstraction boundary: save is called once
      expect(mockSave).toHaveBeenCalledOnce();
      // fetch itself is never called from within promoteGuestSession
      expect(fetchSpy).not.toHaveBeenCalled();
    });
  });

  // (g) ID generation
  describe("ID generation", () => {
    it("uses idFactory when project.id is empty", async () => {
      const project = { ...makeProject(), id: "" };
      const generatedId = "generated-uuid";
      const idFactory = vi.fn().mockReturnValue(generatedId);

      const savedDoc: StagingPlannerDocument = {
        id: generatedId,
        name: project.name,
        unit_system: "metric",
        sceneJson: JSON.stringify({ ...project, id: generatedId }),
      };
      const repo = repoReturning({ status: "ok", document: savedDoc });

      const result = await promoteGuestSession(project, repo, idFactory);

      expect(idFactory).toHaveBeenCalledOnce();
      expect(result.status).toBe("ok");
      if (result.status === "ok") {
        expect(result.saveId).toBe(generatedId);
      }
    });

    it("uses idFactory when project.id is whitespace-only", async () => {
      const project = { ...makeProject(), id: "   " };
      const generatedId = "ws-uuid";
      const idFactory = vi.fn().mockReturnValue(generatedId);

      const savedDoc: StagingPlannerDocument = {
        id: generatedId,
        name: project.name,
        unit_system: "metric",
        sceneJson: JSON.stringify(project),
      };
      const repo = repoReturning({ status: "ok", document: savedDoc });

      await promoteGuestSession(project, repo, idFactory);

      expect(idFactory).toHaveBeenCalledOnce();
    });

    it("preserves existing project id and does not call idFactory", async () => {
      const project = makeProject();
      expect(project.id).toBeTruthy();

      const idFactory = vi.fn().mockReturnValue("should-not-be-used");
      const savedDoc = makeSavedDoc(project);
      const repo = repoReturning({ status: "ok", document: savedDoc });

      const result = await promoteGuestSession(project, repo, idFactory);

      expect(idFactory).not.toHaveBeenCalled();
      expect(result.status).toBe("ok");
      if (result.status === "ok") {
        expect(result.saveId).toBe(project.id);
      }
    });
  });

  // (h) sceneJson round-trip
  describe("sceneJson", () => {
    it("saved document.sceneJson is valid JSON that round-trips back to the project", async () => {
      const project = makeProject({ name: "Round-trip Test" });
      let capturedDoc: StagingPlannerDocument | undefined;

      const repo: MemberPlanRepository = {
        save: vi.fn().mockImplementation(async (doc: StagingPlannerDocument) => {
          capturedDoc = doc;
          return { status: "ok", document: doc } satisfies MemberSaveResult;
        }),
        load: vi.fn(),
        list: vi.fn(),
        delete: vi.fn(),
      };

      await promoteGuestSession(project, repo);

      expect(capturedDoc).toBeDefined();
      const roundTripped = importOpen3dProjectJson(capturedDoc!.sceneJson);
      expect(roundTripped).toEqual(project);
    });
  });
});

// â”€â”€ Default idFactory coverage â€” exercises the built-in () => crypto.randomUUID() â”€â”€

describe("promoteGuestSession â€” default idFactory branch", () => {
  it("uses default idFactory (crypto.randomUUID) when project.id is empty and no idFactory provided", async () => {
    const project = { ...makeProject(), id: "" };

    const repo: MemberPlanRepository = {
      save: vi.fn().mockImplementation(async (doc: StagingPlannerDocument) => {
        // Accept whatever id was generated by the default factory
        const savedDoc: StagingPlannerDocument = { ...doc };
        return { status: "ok", document: savedDoc } satisfies MemberSaveResult;
      }),
      load: vi.fn(),
      list: vi.fn(),
      delete: vi.fn(),
    };

    // Call WITHOUT passing an idFactory â€” exercises the default arrow function
    const result = await promoteGuestSession(project, repo);

    expect(result.status).toBe("ok");
    if (result.status === "ok") {
      // The id should be a non-empty UUID generated by crypto.randomUUID
      expect(typeof result.saveId).toBe("string");
      expect(result.saveId.length).toBeGreaterThan(0);
      expect(result.saveId).not.toBe("");
    }
  });
});

// â”€â”€ name ?? "My plan" fallback branch coverage â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

describe("promoteGuestSession â€” name fallback branch", () => {
  it('uses "My plan" when project name is null or undefined', async () => {
    const project = { ...makeProject(), name: null as unknown as string };
    let capturedDoc: StagingPlannerDocument | undefined;

    const repo: MemberPlanRepository = {
      save: vi.fn().mockImplementation(async (doc: StagingPlannerDocument) => {
        capturedDoc = doc;
        return { status: "ok", document: doc } satisfies MemberSaveResult;
      }),
      load: vi.fn(),
      list: vi.fn(),
      delete: vi.fn(),
    };

    await promoteGuestSession(project, repo);

    expect(capturedDoc?.name).toBe("My plan");
  });
});
