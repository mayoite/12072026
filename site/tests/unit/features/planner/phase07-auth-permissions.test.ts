/**
 * Phase 07 — auth and permissions gate tests
 *
 * Check IDs: 07-AUTH-01, 07-AUTH-04, 07-AUTH-09
 */

import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

import routeContract from "@/config/route-contract.json";
import {
  API_ERROR_CODES,
  DEFAULT_STATUS_FOR_CODE,
} from "@/features/shared/api/ApiError";
import {
  PLANNER_ACTION_PERMISSION_MATRIX,
  PLANNER_GUEST_BLOCKED_ACTIONS,
  getPlannerActionPermissions,
  plannerActionIsBlocked,
  type PlannerActionKey,
} from "@/features/planner/model/plannerPermissions";
import { PLANNER_IDENTITY_CONFIGS } from "@/features/planner/model/plannerIdentity";
import {
  GUEST_BLOCKED_COMMAND_KEYS,
  isCommandBlockedForContext,
} from "@/features/planner/project/lib/commands/plannerAccessContext";
import { toPlannerDescriptorErrorHttp } from "@/features/planner/project/catalog/svg/svgTypes";

const PLANNER_IDS = Object.keys(PLANNER_IDENTITY_CONFIGS) as Array<
  keyof typeof PLANNER_IDENTITY_CONFIGS
>;

const ALL_ACTIONS: PlannerActionKey[] = [
  "view",
  "select",
  "mutate",
  "persist",
  "import",
  "export",
  "publish",
  "share",
];

describe("Phase 07 — 07-AUTH-01 permission matrix table", () => {
  it("defines guest, authenticated, and admin rows for every planner identity", () => {
    for (const plannerId of PLANNER_IDS) {
      const matrix = PLANNER_ACTION_PERMISSION_MATRIX[plannerId];
      expect(matrix.guest.allowedActions.length).toBeGreaterThan(0);
      expect(matrix.authenticated.allowedActions).toEqual(ALL_ACTIONS);
      expect(matrix.admin.allowedActions).toEqual(ALL_ACTIONS);
    }
  });

  it("matches route-contract guest blocked actions for every planner identity", () => {
    const contractBlocked = routeContract.plannerGuestCookie.blockedActions;
    expect([...PLANNER_GUEST_BLOCKED_ACTIONS]).toEqual(contractBlocked);

    for (const plannerId of PLANNER_IDS) {
      const guest = getPlannerActionPermissions(plannerId, "guest");
      expect([...guest.blockedActions]).toEqual(contractBlocked);
      expect(guest.allowedActions).toEqual(["view", "select"]);
    }
  });
});

describe("Phase 07 — 07-AUTH-04 guest blocked actions", () => {
  it("blocks persist, import, export, publish, and share for guests in the model", () => {
    for (const action of PLANNER_GUEST_BLOCKED_ACTIONS) {
      expect(plannerActionIsBlocked("oando", "guest", action)).toBe(true);
      expect(plannerActionIsBlocked("buddy", "guest", action)).toBe(true);
    }
    expect(plannerActionIsBlocked("oando", "guest", "view")).toBe(false);
    expect(plannerActionIsBlocked("oando", "guest", "mutate")).toBe(false);
  });

  it("maps guest-blocked toolbar commands through the typed command registry", () => {
    expect([...GUEST_BLOCKED_COMMAND_KEYS].sort()).toEqual(
      ["export-plan", "import-plan", "open-file", "print", "save"].sort(),
    );
    for (const commandId of GUEST_BLOCKED_COMMAND_KEYS) {
      expect(isCommandBlockedForContext("guest", commandId)).toBe(true);
      expect(isCommandBlockedForContext("authenticated", commandId)).toBe(false);
      expect(isCommandBlockedForContext("admin", commandId)).toBe(false);
    }
  });
});

describe("Phase 07 — 07-AUTH-09 additive 422 / auth error taxonomy", () => {
  it("keeps Phase 02/04 descriptor 422 codes unchanged", () => {
    const invalid = toPlannerDescriptorErrorHttp({
      kind: "invalid",
      code: "422.invalid",
      fieldPath: "slug",
      message: "bad",
      issues: [{ path: "slug", message: "bad" }],
    });
    expect(invalid.status).toBe(422);
    expect(invalid.body.code).toBe("422.invalid");

    const versionMismatch = toPlannerDescriptorErrorHttp({
      kind: "versionMismatch",
      code: "422.version_mismatch",
      fieldPath: "schemaVersion",
      message: "mismatch",
      expected: "2026-07-04.v2",
      actual: "bad",
    });
    expect(versionMismatch.status).toBe(422);
    expect(versionMismatch.body.code).toBe("422.version_mismatch");
  });

  it("adds auth error codes without reusing descriptor 422.invalid namespace", () => {
    expect(DEFAULT_STATUS_FOR_CODE[API_ERROR_CODES.AUTH_REQUIRED]).toBe(401);
    expect(DEFAULT_STATUS_FOR_CODE[API_ERROR_CODES.INSUFFICIENT_PERMISSIONS]).toBe(403);
    expect(API_ERROR_CODES.AUTH_REQUIRED).not.toBe("422.invalid");
    expect(API_ERROR_CODES.INSUFFICIENT_PERMISSIONS).not.toBe("422.version_mismatch");
  });
});

describe("Phase 07 — admin API auth guard", () => {
  function listAdminRouteFiles(dir: string): string[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files: string[] = [];
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) files.push(...listAdminRouteFiles(full));
      else if (entry.name === "route.ts") files.push(full);
    }
    return files;
  }

  it("requires withAuth or requireAdminSession on every /api/admin route module", () => {
    const adminRoot = path.resolve(process.cwd(), "app/api/admin");
    const routes = listAdminRouteFiles(adminRoot);
    expect(routes.length).toBeGreaterThan(0);

    const violations: string[] = [];
    for (const file of routes) {
      const source = fs.readFileSync(file, "utf8");
      const hasWithAuth = source.includes("withAuth");
      const hasRequireAdmin = source.includes("requireAdminSession");
      if (!hasWithAuth && !hasRequireAdmin) {
        violations.push(path.relative(adminRoot, file));
      }
    }
    expect(violations).toEqual([]);
  });
});
