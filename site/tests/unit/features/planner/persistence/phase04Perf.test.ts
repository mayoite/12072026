/**
 * Phase 04 — persistence performance budgets.
 *
 * Budgets (plannnerplan/phases/04/04-guest-member-admin-auth-and-persistence.md):
 * - Member cloud save: p95 ≤2s
 * - Member document load: p95 ≤500ms
 * - Guest-to-member promotion save: p95 ≤2s
 * - Permission gate check: <1ms synchronous
 */

import { describe, expect, it, vi } from "vitest";

import {
  GUEST_BLOCKED_COMMAND_KEYS,
  isCommandBlockedForContext,
  type PlannerAccessContext,
  type PlannerCommandKey,
} from "@/features/planner/project/lib/commands/plannerAccessContext";
import { createOpen3dProject } from "@/features/planner/project/model/project";
import { promoteGuestSession } from "@/features/planner/project/persistence/guestPromotion";
import {
  createMemberPlanRepository,
  type FetchFn,
  type MemberPlanRepository,
} from "@/features/planner/project/persistence/memberPlanRepository";
import type { StagingPlannerDocument } from "@/features/planner/project/persistence/plannerDocumentTypes";

/** Perf budgets belong in dedicated benchmark gates; coverage instrumentation skews timings. */
const describePhase04Benchmarks =
  process.env.VITEST_COVERAGE_RUN === "1" ? describe.skip : describe;

function percentile95(durations: number[]): number {
  const sorted = [...durations].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length * 0.95)] ?? 0;
}

function makeDoc(overrides: Partial<StagingPlannerDocument> = {}): StagingPlannerDocument {
  const project = createOpen3dProject({
    idFactory: (() => {
      let n = 0;
      return () => `bench-${++n}`;
    })(),
  });
  return {
    id: project.id,
    name: project.name,
    unit_system: "metric",
    sceneJson: JSON.stringify(project),
    ...overrides,
  };
}

function mockResponse(status: number, body: unknown = {}): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as Response;
}

function fastFetch(response: Response): FetchFn {
  return vi.fn().mockResolvedValue(response) as unknown as FetchFn;
}

const withToken = () => Promise.resolve<string | null>("bench-token");

describePhase04Benchmarks("Phase 04 persistence performance budgets", () => {
  it("permission gate check p95 under 1ms", () => {
    const blocked = [...GUEST_BLOCKED_COMMAND_KEYS];
    const allowed: PlannerCommandKey[] = ["draw-wall", "undo", "zoom-in"];
    const contexts: PlannerAccessContext[] = ["guest", "authenticated", "admin"];
    const durations: number[] = [];

    for (let w = 0; w < 50; w += 1) {
      for (const context of contexts) {
        for (const command of [...blocked, ...allowed]) {
          isCommandBlockedForContext(context, command);
        }
      }
    }

    for (let i = 0; i < 1000; i += 1) {
      const context = contexts[i % contexts.length]!;
      const command = (i % 2 === 0 ? blocked : allowed)[i % (i % 2 === 0 ? blocked.length : allowed.length)]!;
      const startedAt = performance.now();
      isCommandBlockedForContext(context, command);
      durations.push(performance.now() - startedAt);
    }

    const p95 = percentile95(durations);
    console.info(`[phase-04-benchmark] permission gate p95=${p95.toFixed(3)}ms budget=1ms`);
    expect(p95).toBeLessThan(1);
  });

  it("member document load p95 under 500ms with mocked API", async () => {
    const doc = makeDoc();
    const fetch = fastFetch(mockResponse(200, { document: doc }));
    const repo = createMemberPlanRepository(withToken, fetch);
    const durations: number[] = [];

    for (let w = 0; w < 10; w += 1) {
      await repo.load(doc.id);
    }

    for (let i = 0; i < 100; i += 1) {
      const startedAt = performance.now();
      await repo.load(doc.id);
      durations.push(performance.now() - startedAt);
    }

    const p95 = percentile95(durations);
    console.info(`[phase-04-benchmark] member load p95=${p95.toFixed(3)}ms budget=500ms`);
    expect(p95).toBeLessThan(500);
  });

  it("member cloud save p95 under 2s with mocked API", async () => {
    const doc = makeDoc();
    const savedDoc = { ...doc, updated_at: "2026-07-03T00:00:00Z" };
    const fetch = fastFetch(mockResponse(200, { document: savedDoc }));
    const repo = createMemberPlanRepository(withToken, fetch);
    const durations: number[] = [];

    for (let w = 0; w < 10; w += 1) {
      await repo.save(doc);
    }

    for (let i = 0; i < 100; i += 1) {
      const startedAt = performance.now();
      await repo.save(doc);
      durations.push(performance.now() - startedAt);
    }

    const p95 = percentile95(durations);
    console.info(`[phase-04-benchmark] member save p95=${p95.toFixed(3)}ms budget=2000ms`);
    expect(p95).toBeLessThan(2000);
  });

  it("guest-to-member promotion save p95 under 2s with mocked repository", async () => {
    const project = createOpen3dProject({
      idFactory: (() => {
        let n = 0;
        return () => `promo-${++n}`;
      })(),
    });
    const savedDoc = makeDoc({ id: project.id, name: project.name, sceneJson: JSON.stringify(project) });

    const repo: MemberPlanRepository = {
      save: vi.fn().mockResolvedValue({ status: "ok", document: savedDoc }),
      load: vi.fn(),
      list: vi.fn(),
      delete: vi.fn(),
    };

    const durations: number[] = [];

    for (let w = 0; w < 10; w += 1) {
      await promoteGuestSession(project, repo);
    }

    for (let i = 0; i < 100; i += 1) {
      const startedAt = performance.now();
      await promoteGuestSession(project, repo);
      durations.push(performance.now() - startedAt);
    }

    const p95 = percentile95(durations);
    console.info(`[phase-04-benchmark] promotion save p95=${p95.toFixed(3)}ms budget=2000ms`);
    expect(p95).toBeLessThan(2000);
  });
});
