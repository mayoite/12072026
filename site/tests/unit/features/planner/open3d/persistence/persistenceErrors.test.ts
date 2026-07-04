import { describe, expect, it } from "vitest";

import {
  isConflict,
  isCorrupt,
  isForbidden,
  isNetworkError,
  isNotFound,
  isUnauthenticated,
  isUnsupportedSchema,
  mapToPersistenceError,
  Open3dPersistenceError,
} from "@/features/planner/open3d/persistence/persistenceErrors";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function apiError(code: string, status: number, message = "api error") {
  return { code, status, message };
}

function apiErrorNoStatus(code: string, message = "api error") {
  return { code, message };
}

function apiErrorNoCode(status: number, message = "api error") {
  return { status, message };
}

// ---------------------------------------------------------------------------
// Open3dPersistenceError â€” class properties
// ---------------------------------------------------------------------------

describe("Open3dPersistenceError", () => {
  it("sets name to 'Open3dPersistenceError'", () => {
    const err = new Open3dPersistenceError("network", "oops");
    expect(err.name).toBe("Open3dPersistenceError");
  });

  it("preserves message", () => {
    const err = new Open3dPersistenceError("corrupt", "data is broken");
    expect(err.message).toBe("data is broken");
  });

  it("sets kind correctly", () => {
    const err = new Open3dPersistenceError("forbidden", "no access");
    expect(err.kind).toBe("forbidden");
  });

  it("preserves cause when provided", () => {
    const cause = new Error("root cause");
    const err = new Open3dPersistenceError("network", "wrap", cause);
    expect(err.cause).toBe(cause);
  });

  it("cause is undefined when not provided", () => {
    const err = new Open3dPersistenceError("not-found", "missing");
    expect(err.cause).toBeUndefined();
  });

  it("is an instance of Error", () => {
    const err = new Open3dPersistenceError("conflict", "conflict");
    expect(err).toBeInstanceOf(Error);
  });
});

// ---------------------------------------------------------------------------
// mapToPersistenceError â€” pass-through
// ---------------------------------------------------------------------------

describe("mapToPersistenceError â€” pass-through", () => {
  it("returns existing Open3dPersistenceError unchanged", () => {
    const original = new Open3dPersistenceError("not-found", "already mapped");
    const result = mapToPersistenceError(original);
    expect(result).toBe(original);
  });
});

// ---------------------------------------------------------------------------
// mapToPersistenceError â€” unauthenticated
// ---------------------------------------------------------------------------

describe("mapToPersistenceError â€” unauthenticated", () => {
  it("maps code 'planner:no-auth' + status 401 â†’ unauthenticated", () => {
    const result = mapToPersistenceError(apiError("planner:no-auth", 401, "Authentication required."));
    expect(result.kind).toBe("unauthenticated");
    expect(result.message).toBe("Authentication required.");
  });

  it("maps code 'planner:no-auth' with no status â†’ unauthenticated", () => {
    const result = mapToPersistenceError(apiErrorNoStatus("planner:no-auth", "Auth required."));
    expect(result.kind).toBe("unauthenticated");
  });

  it("maps status 401 with no code â†’ unauthenticated", () => {
    const result = mapToPersistenceError(apiErrorNoCode(401, "Unauthorized."));
    expect(result.kind).toBe("unauthenticated");
  });

  it("preserves cause on unauthenticated", () => {
    const raw = apiError("planner:no-auth", 401);
    const result = mapToPersistenceError(raw);
    expect(result.cause).toBe(raw);
  });
});

// ---------------------------------------------------------------------------
// mapToPersistenceError â€” forbidden
// ---------------------------------------------------------------------------

describe("mapToPersistenceError â€” forbidden", () => {
  it("maps code 'planner:no-auth' + status 403 â†’ forbidden", () => {
    const result = mapToPersistenceError(apiError("planner:no-auth", 403, "Admin access required."));
    expect(result.kind).toBe("forbidden");
    expect(result.message).toBe("Admin access required.");
  });

  it("preserves cause on forbidden", () => {
    const raw = apiError("planner:no-auth", 403);
    const result = mapToPersistenceError(raw);
    expect(result.cause).toBe(raw);
  });

  it("forbidden takes priority over unauthenticated for no-auth + 403", () => {
    const result = mapToPersistenceError(apiError("planner:no-auth", 403));
    expect(result.kind).toBe("forbidden");
    expect(result.kind).not.toBe("unauthenticated");
  });
});

// ---------------------------------------------------------------------------
// mapToPersistenceError â€” not-found
// ---------------------------------------------------------------------------

describe("mapToPersistenceError â€” not-found", () => {
  it("maps status 404 â†’ not-found", () => {
    const result = mapToPersistenceError(apiErrorNoCode(404, "Not found."));
    expect(result.kind).toBe("not-found");
  });

  it("maps status 404 with unrelated code â†’ not-found", () => {
    const result = mapToPersistenceError(apiError("planner:load-failed", 404, "Document missing."));
    expect(result.kind).toBe("not-found");
  });

  it("preserves cause on not-found", () => {
    const raw = apiErrorNoCode(404);
    const result = mapToPersistenceError(raw);
    expect(result.cause).toBe(raw);
  });
});

// ---------------------------------------------------------------------------
// mapToPersistenceError â€” conflict
// ---------------------------------------------------------------------------

describe("mapToPersistenceError â€” conflict", () => {
  it("maps status 409 â†’ conflict", () => {
    const result = mapToPersistenceError(apiErrorNoCode(409, "Conflict."));
    expect(result.kind).toBe("conflict");
  });

  it("maps status 409 with unrelated code â†’ conflict", () => {
    const result = mapToPersistenceError(apiError("planner:save-failed", 409, "Version conflict."));
    expect(result.kind).toBe("conflict");
  });

  it("preserves cause on conflict", () => {
    const raw = apiErrorNoCode(409);
    const result = mapToPersistenceError(raw);
    expect(result.cause).toBe(raw);
  });
});

// ---------------------------------------------------------------------------
// mapToPersistenceError â€” corrupt
// ---------------------------------------------------------------------------

describe("mapToPersistenceError â€” corrupt", () => {
  it("maps code 'planner:load-failed' + message contains 'corrupt' â†’ corrupt", () => {
    const result = mapToPersistenceError(
      apiErrorNoStatus("planner:load-failed", "The stored document is corrupt."),
    );
    expect(result.kind).toBe("corrupt");
  });

  it("is case-insensitive on 'corrupt'", () => {
    const result = mapToPersistenceError(
      apiErrorNoStatus("planner:load-failed", "CORRUPT data detected."),
    );
    expect(result.kind).toBe("corrupt");
  });

  it("preserves cause on corrupt", () => {
    const raw = apiErrorNoStatus("planner:load-failed", "corrupt payload");
    const result = mapToPersistenceError(raw);
    expect(result.cause).toBe(raw);
  });
});

// ---------------------------------------------------------------------------
// mapToPersistenceError â€” unsupported-schema
// ---------------------------------------------------------------------------

describe("mapToPersistenceError â€” unsupported-schema", () => {
  it("maps code 'planner:load-failed' + message contains 'schema' â†’ unsupported-schema", () => {
    const result = mapToPersistenceError(
      apiErrorNoStatus("planner:load-failed", "Unsupported schema version."),
    );
    expect(result.kind).toBe("unsupported-schema");
  });

  it("is case-insensitive on 'schema'", () => {
    const result = mapToPersistenceError(
      apiErrorNoStatus("planner:load-failed", "Unknown SCHEMA version detected."),
    );
    expect(result.kind).toBe("unsupported-schema");
  });

  it("preserves cause on unsupported-schema", () => {
    const raw = apiErrorNoStatus("planner:load-failed", "schema mismatch");
    const result = mapToPersistenceError(raw);
    expect(result.cause).toBe(raw);
  });

  it("corrupt takes priority over unsupported-schema when message contains both", () => {
    // 'corrupt' is matched first in mapToPersistenceError's branching
    const result = mapToPersistenceError(
      apiErrorNoStatus("planner:load-failed", "corrupt schema found"),
    );
    expect(result.kind).toBe("corrupt");
  });
});

// ---------------------------------------------------------------------------
// mapToPersistenceError â€” network
// ---------------------------------------------------------------------------

describe("mapToPersistenceError â€” network", () => {
  it("maps TypeError â†’ network", () => {
    const result = mapToPersistenceError(new TypeError("Failed to construct URL"));
    expect(result.kind).toBe("network");
  });

  it("maps Error with 'fetch' in message â†’ network", () => {
    const result = mapToPersistenceError(new Error("fetch error occurred"));
    expect(result.kind).toBe("network");
  });

  it("maps Error with 'Failed to fetch' â†’ network", () => {
    const result = mapToPersistenceError(new Error("Failed to fetch"));
    expect(result.kind).toBe("network");
  });

  it("maps Error with 'network' in message â†’ network", () => {
    const result = mapToPersistenceError(new Error("network timeout"));
    expect(result.kind).toBe("network");
  });

  it("maps unknown plain object to network (default fallback)", () => {
    const result = mapToPersistenceError({ message: "something unknown" });
    expect(result.kind).toBe("network");
  });

  it("maps null to network (default fallback)", () => {
    const result = mapToPersistenceError(null);
    expect(result.kind).toBe("network");
  });

  it("maps undefined to network (default fallback)", () => {
    const result = mapToPersistenceError(undefined);
    expect(result.kind).toBe("network");
  });

  it("preserves cause on network (TypeError)", () => {
    const raw = new TypeError("fetch blew up");
    const result = mapToPersistenceError(raw);
    expect(result.cause).toBe(raw);
  });

  it("uses 'Unknown persistence error' message when cause has no message", () => {
    const result = mapToPersistenceError(null);
    expect(result.message).toBe("Unknown persistence error");
  });
});

// ---------------------------------------------------------------------------
// Type guards â€” each guard is true for its own kind, false for others
// ---------------------------------------------------------------------------

const allKinds = [
  "unauthenticated",
  "forbidden",
  "not-found",
  "corrupt",
  "unsupported-schema",
  "network",
  "conflict",
] as const;

type KindGuardEntry = {
  kind: (typeof allKinds)[number];
  guard: (err: Open3dPersistenceError) => boolean;
  name: string;
};

const guardTable: KindGuardEntry[] = [
  { kind: "unauthenticated", guard: isUnauthenticated, name: "isUnauthenticated" },
  { kind: "forbidden", guard: isForbidden, name: "isForbidden" },
  { kind: "not-found", guard: isNotFound, name: "isNotFound" },
  { kind: "corrupt", guard: isCorrupt, name: "isCorrupt" },
  { kind: "unsupported-schema", guard: isUnsupportedSchema, name: "isUnsupportedSchema" },
  { kind: "network", guard: isNetworkError, name: "isNetworkError" },
  { kind: "conflict", guard: isConflict, name: "isConflict" },
];

describe("type guards", () => {
  for (const { kind, guard, name } of guardTable) {
    it(`${name} returns true for kind '${kind}'`, () => {
      const err = new Open3dPersistenceError(kind, "test");
      expect(guard(err)).toBe(true);
    });

    for (const other of allKinds) {
      if (other === kind) continue;
      it(`${name} returns false for kind '${other}'`, () => {
        const err = new Open3dPersistenceError(other, "test");
        expect(guard(err)).toBe(false);
      });
    }
  }
});
