import { describe, expect, it, beforeEach } from "vitest";
import {
  registerMigration,
  resetMigrations,
  getRegisteredMigrations,
  migrateEnvelope,
  createEnvelopeV1,
  validateEnvelope,
} from "@/features/planner/model/operations/migration";
import { createPlannerProject } from "@/features/planner/model/project";

describe("operations/migration", () => {
  beforeEach(() => {
    resetMigrations();
  });

  it("creates and validates v1 envelopes", () => {
    const project = createPlannerProject({ name: "Mig" });
    const env = createEnvelopeV1(project);
    expect(env.version).toBe(1);
    expect(validateEnvelope(env).valid).toBe(true);
  });

  it("registers and runs migrations", () => {
    registerMigration(1, 2, (project) => ({
      project: { ...project, name: `${project.name}-v2` },
      report: ["bumped"],
    }));
    expect(getRegisteredMigrations().length).toBe(1);
    const project = createPlannerProject({ name: "Base" });
    const env = createEnvelopeV1(project);
    const result = migrateEnvelope(env, 2);
    expect(result.success).toBe(true);
    expect(result.project.name).toBe("Base-v2");
    expect(result.report.some((r) => r.includes("v2") || r.includes("bumped"))).toBe(true);
  });

  it("fails visibly on unsupported future envelope versions", () => {
    const project = createPlannerProject({ name: "Future" });
    const env = createEnvelopeV1(project);
    const future = { ...env, version: 99 as 1 };
    const result = migrateEnvelope(future, 1);
    expect(result.success).toBe(false);
    expect(result.errors?.some((e) => /Unsupported scene envelope version 99/i.test(e))).toBe(true);
  });

  it("rejects validateEnvelope for unsupported versions", () => {
    const project = createPlannerProject({ name: "BadVer" });
    const env = { ...createEnvelopeV1(project), version: 7 };
    const validated = validateEnvelope(env);
    expect(validated.valid).toBe(false);
    expect(validated.errors.some((e) => /Unsupported scene envelope version 7/i.test(e))).toBe(true);
  });
});
