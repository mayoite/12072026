import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  executeCommand,
  type FeasibilityCommandContext,
} from "@/features/planner/open3d/lib/commands/registry";
import { createOpen3dProject } from "@/features/planner/open3d/model/project";
import { createOpen3dGuestProjectRepository } from "@/features/planner/open3d/persistence/guestProjectRepository";
import { exportOpen3dProjectJson, importOpen3dProjectJson } from "@/features/planner/open3d/persistence/projectJson";
import { exportAsJSON } from "@/features/planner/open3d/shared/export/exportUtils";
import { importOpen3dPlannerText } from "@/features/planner/open3d/shared/export/importUtils";

const mockCommandContext: FeasibilityCommandContext = {
  activateDrawWall: () => undefined,
  cancel: () => undefined,
  undo: () => false,
  zoomBy: () => undefined,
  resetZoom: () => undefined,
};

describe("project persistence", () => {
  it("imports exported JSON envelopes from the workspace export menu", () => {
    const project = createOpen3dProject({ idFactory: (() => { let id = 0; return () => `${++id}`; })() });
    const exported = exportAsJSON(project, true);
    const result = importOpen3dPlannerText(exported);
    expect(result.success).toBe(true);
    expect(result.project).toEqual(project);
  });

  it("exports, imports, saves, backs up, restores, and removes in memory only", () => {
    const project = createOpen3dProject({ idFactory: (() => { let id = 0; return () => `${++id}`; })() });
    expect(importOpen3dProjectJson(exportOpen3dProjectJson(project))).toEqual(project);
    const repository = createOpen3dGuestProjectRepository();
    expect(repository.load(project.id)).toBeNull();
    repository.save(project);
    expect(repository.load(project.id)).toEqual(project);
    repository.save({ ...project, name: "Changed" });
    expect(repository.restoreBackup(project.id)).toEqual(project);
    repository.remove(project.id);
    expect(repository.restoreBackup(project.id)).toBeNull();
  });

  it("does not persist guest work across repository instances", () => {
    const project = createOpen3dProject({ idFactory: (() => { let id = 0; return () => `${++id}`; })() });
    const first = createOpen3dGuestProjectRepository();
    first.save(project);

    const second = createOpen3dGuestProjectRepository();

    expect(second.load(project.id)).toBeNull();
    expect(second.loadSafely(project.id)).toEqual({ project: null, recoveredFromBackup: false });
  });

  it("does not call browser Storage APIs", () => {
    const project = createOpen3dProject({ idFactory: (() => { let id = 0; return () => `${++id}`; })() });
    const storage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };
    const repository = createOpen3dGuestProjectRepository();

    repository.save(project);
    repository.load(project.id);
    repository.restoreBackup(project.id);
    repository.remove(project.id);

    expect(storage.getItem).not.toHaveBeenCalled();
    expect(storage.setItem).not.toHaveBeenCalled();
    expect(storage.removeItem).not.toHaveBeenCalled();
  });

  it("recovers safely from in-memory corruption and reports both corruption paths", () => {
    const project = createOpen3dProject({ idFactory: (() => { let id = 0; return () => `${++id}`; })() });
    const repository = createOpen3dGuestProjectRepository();
    expect(repository.loadSafely(project.id)).toEqual({ project: null, recoveredFromBackup: false });
    repository.save(project);
    repository.save({ ...project, name: "Changed" });
    const originalParse = JSON.parse;
    const parse = vi.spyOn(JSON, "parse")
      .mockImplementationOnce(() => { throw new Error("primary corrupt"); })
      .mockImplementationOnce((value: string) => originalParse(value));
    expect(repository.loadSafely(project.id)).toMatchObject({
      project,
      recoveredFromBackup: true,
      error: "primary corrupt",
    });

    parse.mockRestore();
  });

  it("reports a generic error when corruption is not an Error instance and no backup exists", () => {
    const project = createOpen3dProject({ idFactory: (() => { let id = 0; return () => `${++id}`; })() });
    const repository = createOpen3dGuestProjectRepository();
    repository.save(project);

    const parse = vi.spyOn(JSON, "parse").mockImplementation(() => {
      throw "not-an-error";
    });
    expect(repository.loadSafely(project.id)).toEqual({
      project: null,
      recoveredFromBackup: false,
      error: "Project data is invalid.",
    });
    parse.mockRestore();
  });

  it("reports Error.message when corruption has no backup", () => {
    const project = createOpen3dProject({ idFactory: (() => { let id = 0; return () => `${++id}`; })() });
    const repository = createOpen3dGuestProjectRepository();
    repository.save(project);

    const parse = vi.spyOn(JSON, "parse").mockImplementation(() => {
      throw new Error("primary-only corrupt");
    });
    expect(repository.loadSafely(project.id)).toEqual({
      project: null,
      recoveredFromBackup: false,
      error: "primary-only corrupt",
    });
    parse.mockRestore();
  });

  it("reports when both primary and backup payloads are invalid", () => {
    const project = createOpen3dProject({ idFactory: (() => { let id = 0; return () => `${++id}`; })() });
    const repository = createOpen3dGuestProjectRepository();
    repository.save(project);
    repository.save({ ...project, name: "Changed" });

    const parse = vi.spyOn(JSON, "parse").mockImplementation(() => {
      throw new Error("corrupt");
    });
    expect(repository.loadSafely(project.id)).toEqual({
      project: null,
      recoveredFromBackup: false,
      error: "Project and backup data are invalid.",
    });
    parse.mockRestore();
  });

  it("recovers from backup when primary corruption is not an Error instance", () => {
    const project = createOpen3dProject({ idFactory: (() => { let id = 0; return () => `${++id}`; })() });
    const repository = createOpen3dGuestProjectRepository();
    repository.save(project);
    repository.save({ ...project, name: "Changed" });

    const originalParse = JSON.parse;
    const parse = vi.spyOn(JSON, "parse")
      .mockImplementationOnce(() => {
        throw "not-an-error";
      })
      .mockImplementationOnce((value: string) => originalParse(value));

    expect(repository.loadSafely(project.id)).toMatchObject({
      project,
      recoveredFromBackup: true,
      error: "Project data is invalid.",
    });
    parse.mockRestore();
  });
});

describe("guest session API isolation", () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, "fetch");
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it("never issues fetch to /api/plans during guest repository and blocked-command flow", () => {
    const project = createOpen3dProject({ idFactory: (() => { let id = 0; return () => `${++id}`; })() });
    const repository = createOpen3dGuestProjectRepository();

    repository.save(project);
    repository.load(project.id);
    repository.loadSafely(project.id);
    repository.restoreBackup(project.id);
    repository.remove(project.id);

    const blockedCommands = [
      "save",
      "export-plan",
      "import-plan",
      "open-file",
      "print",
    ] as const;

    for (const commandId of blockedCommands) {
      const outcome = executeCommand("guest", commandId, mockCommandContext);
      expect(outcome).toMatchObject({
        status: "unavailable",
        reason: "blocked-for-guest",
      });
    }

    expect(fetchSpy).not.toHaveBeenCalled();
    const apiPlanCalls = fetchSpy.mock.calls.filter(([input]: [RequestInfo | URL]) => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.href : String(input);
      return url.includes("/api/plans");
    });
    expect(apiPlanCalls).toHaveLength(0);
  });
});
