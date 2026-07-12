import { describe, it, expect, vi } from "vitest";
import {
  createMemberPlanRepository,
  type FetchFn,
} from "@/features/planner/project/persistence/memberPlanRepository";
import {
  isStagingPlannerDocument,
  type StagingPlannerDocument,
} from "@/features/planner/project/persistence/plannerDocumentTypes";

// â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function makeDoc(overrides: Partial<StagingPlannerDocument> = {}): StagingPlannerDocument {
  return {
    id: "abc-123",
    name: "Test Plan",
    unit_system: "metric",
    sceneJson: "{}",
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

function makeFetch(response: Response): FetchFn {
  return vi.fn().mockResolvedValue(response) as unknown as FetchFn;
}

function throwingFetch(message: string): FetchFn {
  return vi.fn().mockRejectedValue(new Error(message)) as unknown as FetchFn;
}

const noToken = () => Promise.resolve<string | null>(null);
const withToken = () => Promise.resolve<string | null>("tok-xyz");

// â”€â”€â”€ isStagingPlannerDocument â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

describe("isStagingPlannerDocument", () => {
  it("returns true for a valid document", () => {
    expect(isStagingPlannerDocument(makeDoc())).toBe(true);
  });

  it("returns false when id is missing", () => {
    const { id: _id, ...rest } = makeDoc();
    expect(isStagingPlannerDocument(rest)).toBe(false);
  });

  it("returns false when sceneJson is missing", () => {
    const { sceneJson: _s, ...rest } = makeDoc();
    expect(isStagingPlannerDocument(rest)).toBe(false);
  });

  it("returns false when name is missing", () => {
    const { name: _n, ...rest } = makeDoc();
    expect(isStagingPlannerDocument(rest)).toBe(false);
  });

  it("returns false for null", () => {
    expect(isStagingPlannerDocument(null)).toBe(false);
  });

  it("returns false for a non-object primitive", () => {
    expect(isStagingPlannerDocument("string")).toBe(false);
    expect(isStagingPlannerDocument(42)).toBe(false);
  });
});

// â”€â”€â”€ load â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

describe("MemberPlanRepository.load", () => {
  const doc = makeDoc();

  it("returns ok with document on 200", async () => {
    const fetch = makeFetch(mockResponse(200, { document: doc }));
    const repo = createMemberPlanRepository(noToken, fetch);
    const result = await repo.load("abc-123");
    expect(result).toEqual({ status: "ok", document: doc });
    expect(fetch).toHaveBeenCalledWith(
      "/api/plans/abc-123",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("includes Authorization header when token is present", async () => {
    const fetch = makeFetch(mockResponse(200, { document: doc }));
    const repo = createMemberPlanRepository(withToken, fetch);
    await repo.load("abc-123");
    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [string, RequestInit];
    expect((init.headers as Record<string, string>)["Authorization"]).toBe("Bearer tok-xyz");
  });

  it("returns unauthenticated on 401", async () => {
    const repo = createMemberPlanRepository(noToken, makeFetch(mockResponse(401)));
    expect(await repo.load("x")).toEqual({ status: "unauthenticated" });
  });

  it("returns forbidden on 403", async () => {
    const repo = createMemberPlanRepository(noToken, makeFetch(mockResponse(403)));
    expect(await repo.load("x")).toEqual({ status: "forbidden" });
  });

  it("returns not-found on 404", async () => {
    const repo = createMemberPlanRepository(noToken, makeFetch(mockResponse(404)));
    expect(await repo.load("x")).toEqual({ status: "not-found" });
  });

  it("returns network on unexpected non-ok status", async () => {
    const repo = createMemberPlanRepository(noToken, makeFetch(mockResponse(500)));
    expect(await repo.load("x")).toEqual({ status: "network", message: "HTTP 500" });
  });

  it("returns corrupt when body.document fails the type guard", async () => {
    const badDoc = { id: "x" }; // missing name and sceneJson
    const repo = createMemberPlanRepository(noToken, makeFetch(mockResponse(200, { document: badDoc })));
    const result = await repo.load("x");
    expect(result).toEqual({ status: "corrupt", raw: badDoc });
  });

  it("returns network on fetch throw", async () => {
    const repo = createMemberPlanRepository(noToken, throwingFetch("Connection refused"));
    expect(await repo.load("x")).toEqual({ status: "network", message: "Connection refused" });
  });
});

// â”€â”€â”€ save â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

describe("MemberPlanRepository.save", () => {
  const doc = makeDoc();

  it("returns ok with document on 200", async () => {
    const savedDoc = { ...doc, updated_at: "2024-01-01T00:00:00Z" };
    const fetch = makeFetch(mockResponse(200, { document: savedDoc }));
    const repo = createMemberPlanRepository(noToken, fetch);
    const result = await repo.save(doc);
    expect(result).toEqual({ status: "ok", document: savedDoc });
    const [url, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/plans/abc-123");
    expect(init.method).toBe("PUT");
    expect(JSON.parse(init.body as string)).toEqual({ document: doc });
  });

  it("returns unauthenticated on 401", async () => {
    const repo = createMemberPlanRepository(noToken, makeFetch(mockResponse(401)));
    expect(await repo.save(doc)).toEqual({ status: "unauthenticated" });
  });

  it("returns conflict on 409", async () => {
    const repo = createMemberPlanRepository(noToken, makeFetch(mockResponse(409)));
    expect(await repo.save(doc)).toEqual({ status: "conflict" });
  });

  it("returns network when response body has no valid document", async () => {
    const repo = createMemberPlanRepository(noToken, makeFetch(mockResponse(200, { document: null })));
    expect(await repo.save(doc)).toEqual({ status: "network", message: "Missing document in response" });
  });

  it("returns network on fetch throw", async () => {
    const repo = createMemberPlanRepository(noToken, throwingFetch("Timeout"));
    expect(await repo.save(doc)).toEqual({ status: "network", message: "Timeout" });
  });
});

// â”€â”€â”€ list â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

describe("MemberPlanRepository.list", () => {
  it("returns ok with mapped summaries on 200", async () => {
    const docs = [
      { id: "1", name: "Plan A", updated_at: "2024-06-01T00:00:00Z" },
      { id: "2", name: "Plan B" }, // no updated_at
    ];
    const fetch = makeFetch(mockResponse(200, { documents: docs }));
    const repo = createMemberPlanRepository(noToken, fetch);
    const result = await repo.list();
    expect(result).toEqual({
      status: "ok",
      summaries: [
        { id: "1", name: "Plan A", updated_at: "2024-06-01T00:00:00Z" },
        { id: "2", name: "Plan B", updated_at: undefined },
      ],
    });
  });

  it("handles empty documents array", async () => {
    const repo = createMemberPlanRepository(noToken, makeFetch(mockResponse(200, { documents: [] })));
    const result = await repo.list();
    expect(result).toEqual({ status: "ok", summaries: [] });
  });

  it("handles missing documents key gracefully", async () => {
    const repo = createMemberPlanRepository(noToken, makeFetch(mockResponse(200, {})));
    const result = await repo.list();
    expect(result).toEqual({ status: "ok", summaries: [] });
  });

  it("returns unauthenticated on 401", async () => {
    const repo = createMemberPlanRepository(noToken, makeFetch(mockResponse(401)));
    expect(await repo.list()).toEqual({ status: "unauthenticated" });
  });

  it("returns network on non-ok status", async () => {
    const repo = createMemberPlanRepository(noToken, makeFetch(mockResponse(503)));
    expect(await repo.list()).toEqual({ status: "network", message: "HTTP 503" });
  });

  it("returns network on fetch throw", async () => {
    const repo = createMemberPlanRepository(noToken, throwingFetch("DNS failure"));
    expect(await repo.list()).toEqual({ status: "network", message: "DNS failure" });
  });
});

// â”€â”€â”€ delete â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

describe("MemberPlanRepository.delete", () => {
  it("returns ok on 200", async () => {
    const fetch = makeFetch(mockResponse(200));
    const repo = createMemberPlanRepository(noToken, fetch);
    expect(await repo.delete("abc-123")).toEqual({ status: "ok" });
    const [url, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/plans/abc-123");
    expect(init.method).toBe("DELETE");
  });

  it("returns ok on 204", async () => {
    const repo = createMemberPlanRepository(noToken, makeFetch(mockResponse(204)));
    expect(await repo.delete("x")).toEqual({ status: "ok" });
  });

  it("returns unauthenticated on 401", async () => {
    const repo = createMemberPlanRepository(noToken, makeFetch(mockResponse(401)));
    expect(await repo.delete("x")).toEqual({ status: "unauthenticated" });
  });

  it("returns not-found on 404", async () => {
    const repo = createMemberPlanRepository(noToken, makeFetch(mockResponse(404)));
    expect(await repo.delete("x")).toEqual({ status: "not-found" });
  });

  it("returns network on non-ok status", async () => {
    const repo = createMemberPlanRepository(noToken, makeFetch(mockResponse(500)));
    expect(await repo.delete("x")).toEqual({ status: "network", message: "HTTP 500" });
  });

  it("returns network on fetch throw", async () => {
    const repo = createMemberPlanRepository(noToken, throwingFetch("Socket closed"));
    expect(await repo.delete("x")).toEqual({ status: "network", message: "Socket closed" });
  });

  it("URL-encodes saveId with special characters", async () => {
    const fetch = makeFetch(mockResponse(200));
    const repo = createMemberPlanRepository(noToken, fetch);
    await repo.delete("plan/with spaces");
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/plans/plan%2Fwith%20spaces");
  });
});

// â”€â”€ Additional save coverage â€” non-ok (5xx) branch â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

describe("MemberPlanRepository.save â€” additional branch coverage", () => {
  const doc = makeDoc();

  it("returns network on non-ok HTTP status (5xx)", async () => {
    const repo = createMemberPlanRepository(noToken, makeFetch(mockResponse(500)));
    expect(await repo.save(doc)).toEqual({ status: "network", message: "HTTP 500" });
  });

  it("returns network on 503", async () => {
    const repo = createMemberPlanRepository(noToken, makeFetch(mockResponse(503)));
    expect(await repo.save(doc)).toEqual({ status: "network", message: "HTTP 503" });
  });
});

// â”€â”€ Additional list branch coverage â€” ?? fallback paths â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

describe("MemberPlanRepository.list â€” fallback branch coverage", () => {
  it("uses empty string fallback when document id is missing", async () => {
    const docs = [{ name: "Plan A", updated_at: "2024-01-01T00:00:00Z" }]; // no id
    const fetch = makeFetch(mockResponse(200, { documents: docs }));
    const repo = createMemberPlanRepository(noToken, fetch);
    const result = await repo.list();
    if (result.status === "ok") {
      expect(result.summaries[0].id).toBe("");
    }
  });

  it("uses 'Untitled' fallback when document name is missing", async () => {
    const docs = [{ id: "abc-123", updated_at: "2024-01-01T00:00:00Z" }]; // no name
    const fetch = makeFetch(mockResponse(200, { documents: docs }));
    const repo = createMemberPlanRepository(noToken, fetch);
    const result = await repo.list();
    if (result.status === "ok") {
      expect(result.summaries[0].name).toBe("Untitled");
    }
  });
});

// â”€â”€ Non-Error throw coverage â€” "Network error" fallback branch â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

describe("MemberPlanRepository â€” non-Error throw fallback message", () => {
  function nonErrorFetch(): FetchFn {
    return vi.fn().mockRejectedValue("string-rejection") as unknown as FetchFn;
  }

  it("load: uses 'Network error' when thrown value is not an Error instance", async () => {
    const repo = createMemberPlanRepository(noToken, nonErrorFetch());
    expect(await repo.load("x")).toEqual({ status: "network", message: "Network error" });
  });

  it("save: uses 'Network error' when thrown value is not an Error instance", async () => {
    const repo = createMemberPlanRepository(noToken, nonErrorFetch());
    expect(await repo.save(makeDoc())).toEqual({ status: "network", message: "Network error" });
  });

  it("delete: uses 'Network error' when thrown value is not an Error instance", async () => {
    const repo = createMemberPlanRepository(noToken, nonErrorFetch());
    expect(await repo.delete("x")).toEqual({ status: "network", message: "Network error" });
  });
});
// â”€â”€â”€ permission.ts coverage boost â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// permission.ts coverage block removed (getPlannerActionForCommand deleted as dead per permission.ts)