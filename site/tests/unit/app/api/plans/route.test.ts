import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/plans/route";
import { createServerClient } from "@/platform/supabase/server";
import { listPlannerDocumentsFromStore, savePlannerDocumentToStore } from "@/features/planner/cloud-store/plannerSaves";
import { rateLimit } from "@/lib/rateLimit";
import { validateCsrfRequest } from "@/lib/security/csrf";

vi.mock("@/platform/supabase/server", () => ({
  createServerClient: vi.fn(),
}));

vi.mock("@/features/planner/cloud-store/plannerSaves", () => ({
  listPlannerDocumentsFromStore: vi.fn(),
  savePlannerDocumentToStore: vi.fn(),
}));

vi.mock("@/lib/rateLimit", () => ({
  rateLimit: vi.fn(),
}));

vi.mock("@/lib/security/csrf", () => ({
  validateCsrfRequest: vi.fn(),
}));

vi.mock("@/features/planner/cloud-store/plannerPublish", () => ({
  buildPlannerDocumentFromPortalPublishData: vi.fn((data, opts) => ({ ...data, ...opts, mockDoc: true })),
}));

// Provide a stable mocked performance.now
vi.stubGlobal('performance', { now: vi.fn(() => 1000) });

vi.mock("@/features/shared/api/routeObservability", () => ({
  applyPlannerRouteTelemetry: vi.fn((res, telemetry) => {
    res.headers.set("x-mock-telemetry", JSON.stringify(telemetry));
    return res;
  }),
}));

describe("Plans API Route", () => {
  let mockSupabase: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user123" } } }),
      },
    };
    (createServerClient as any).mockResolvedValue(mockSupabase);
    (rateLimit as any).mockResolvedValue({ success: true, reset: 12345 });
    (validateCsrfRequest as any).mockResolvedValue(true);
  });

  const createReq = (method: string, url: string = "http://localhost/api/plans", options: RequestInit = {}) => {
    return new NextRequest(url, { method, ...options });
  };

  describe("GET", () => {
    it("should return 429 if rate limit exceeded, using cf-connecting-ip", async () => {
      (rateLimit as any).mockResolvedValue({ success: false, reset: 999 });
      const req = createReq("GET", "http://localhost/api/plans", {
        headers: { "cf-connecting-ip": "10.0.0.1" },
      });

      const res = await GET(req);
      expect(res.status).toBe(429);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error.code).toBe("RATE_LIMIT_EXCEEDED");
      expect(data.error.message).toBe("Too many requests");
      expect(res.headers.get("X-RateLimit-Reset")).toBe("999");
      expect(rateLimit).toHaveBeenCalledWith("plans:get:10.0.0.1", 20, 60000);
    });

    it("should parse x-forwarded-for for IP if cf-connecting-ip is absent", async () => {
      (rateLimit as any).mockResolvedValue({ success: false, reset: 999 });
      const req = createReq("GET", "http://localhost/api/plans", {
        headers: { "x-forwarded-for": "10.0.0.2, 192.168.1.1" },
      });

      await GET(req);
      expect(rateLimit).toHaveBeenCalledWith("plans:get:10.0.0.2", 20, 60000);
    });

    it("should fallback to 127.0.0.1 if no IP headers are present", async () => {
      (rateLimit as any).mockResolvedValue({ success: false, reset: 999 });
      const req = createReq("GET");
      await GET(req);
      expect(rateLimit).toHaveBeenCalledWith("plans:get:127.0.0.1", 20, 60000);
    });

    it("should return 401 if authentication fails", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });
      const req = createReq("GET");
      const res = await GET(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error.code).toBe("AUTH_REQUIRED");
      expect(data.error.message).toBe("Authentication required");
    });

    it("should return 500 if listPlannerDocumentsFromStore throws an Error", async () => {
      (listPlannerDocumentsFromStore as any).mockRejectedValue(new Error("DB failure"));
      const req = createReq("GET");
      const res = await GET(req);
      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error.code).toBe("INTERNAL_ERROR");
      expect(data.error.message).toBe("Failed to list plans: DB failure");
    });

    it("should return 500 if listPlannerDocumentsFromStore throws a string", async () => {
      (listPlannerDocumentsFromStore as any).mockRejectedValue("String error");
      const req = createReq("GET");
      const res = await GET(req);
      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error.code).toBe("INTERNAL_ERROR");
      expect(data.error.message).toBe("Failed to list plans: String error");
    });

    it("should return 200 with documents on success", async () => {
      (listPlannerDocumentsFromStore as any).mockResolvedValue([{ id: "doc1" }, { id: "doc2" }]);
      const req = createReq("GET");
      const res = await GET(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.documents).toEqual([{ id: "doc1" }, { id: "doc2" }]);
      const telemetry = JSON.parse(res.headers.get("x-mock-telemetry")!);
      expect(telemetry.rowCount).toBe(2);
      expect(telemetry.source).toBe("drizzle_plans");
    });
  });

  describe("POST", () => {
    it("should return 429 if rate limit exceeded", async () => {
      (rateLimit as any).mockResolvedValue({ success: false, reset: 111 });
      const req = createReq("POST");
      const res = await POST(req);
      expect(res.status).toBe(429);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error.code).toBe("RATE_LIMIT_EXCEEDED");
      expect(data.error.message).toBe("Too many requests");
    });

    it("should return 403 if CSRF validation fails", async () => {
      (validateCsrfRequest as any).mockResolvedValue(false);
      const req = createReq("POST");
      const res = await POST(req);
      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error.code).toBe("CSRF_FAILED");
      expect(data.error.message).toBe("Invalid or missing CSRF token");
      expect(res.headers.get("x-csrf-rejected")).toBe("1");
    });

    it("should handle empty/invalid JSON body gracefully", async () => {
      const req = createReq("POST", "http://localhost", { body: "not json", headers: { "content-type": "application/json" } });
      // NextRequest .json() throws if invalid, our code catches it
      const res = await POST(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error.code).toBe("INVALID_INPUT");
      expect(data.error.message).toBe("Invalid JSON body");
    });

    it("should return 400 if id is missing", async () => {
      const req = createReq("POST", "http://localhost", { body: JSON.stringify({ projectName: "P" }) });
      const res = await POST(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error.code).toBe("MISSING_REQUIRED_FIELD");
      expect(data.error.message).toBe("Plan id is required");
    });

    it("should return 400 if projectName is missing", async () => {
      const req = createReq("POST", "http://localhost", { body: JSON.stringify({ id: "123" }) });
      const res = await POST(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error.code).toBe("MISSING_REQUIRED_FIELD");
      expect(data.error.message).toBe("Project name is required");
    });

    it("should return 400 if data is missing", async () => {
      const req = createReq("POST", "http://localhost", { body: JSON.stringify({ id: "123", projectName: "P" }) });
      const res = await POST(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error.code).toBe("MISSING_REQUIRED_FIELD");
      expect(data.error.message).toBe("Plan data is required");
    });

    it("should return 400 if data is not an object", async () => {
      const req = createReq("POST", "http://localhost", { body: JSON.stringify({ id: "123", projectName: "P", data: "string" }) });
      const res = await POST(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error.code).toBe("MISSING_REQUIRED_FIELD");
      expect(data.error.message).toBe("Plan data is required");
    });

    it("should return 401 if authentication fails", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });
      const req = createReq("POST", "http://localhost", { body: JSON.stringify({ id: "123", projectName: "P", data: {} }) });
      const res = await POST(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error.code).toBe("AUTH_REQUIRED");
      expect(data.error.message).toBe("Authentication required");
    });

    it("should populate publishData with arrays if properties are missing, and save draft status", async () => {
      const req = createReq("POST", "http://localhost", { body: JSON.stringify({ id: "123", projectName: "P", data: {}, status: "draft" }) });
      const res = await POST(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      
      // Check that savePlannerDocumentToStore was called with default arrays
      expect(savePlannerDocumentToStore).toHaveBeenCalledWith(
        expect.objectContaining({
          projectName: "P",
          walls: [],
          rooms: [],
          furniture: [],
          doors: [],
          windows: [],
          measurements: [],
          zones: [],
          textLabels: [],
          structuralElements: [],
          backgroundImage: null,
          status: "draft",
          mockDoc: true
        }),
        { userId: "user123", saveId: "123" }
      );
    });

    it("should populate publishData with provided arrays and active status", async () => {
      const planData = {
        walls: [1],
        rooms: [2],
        furniture: [3],
        doors: [4],
        windows: [5],
        measurements: [6],
        zones: [7],
        textLabels: [8],
        structuralElements: [9],
        backgroundImage: "bg.png"
      };
      const req = createReq("POST", "http://localhost", { 
        body: JSON.stringify({ id: "123", projectName: "P", data: planData, status: "other" }) 
      });
      const res = await POST(req);
      expect(res.status).toBe(200);
      
      // Check that savePlannerDocumentToStore was called with provided arrays
      expect(savePlannerDocumentToStore).toHaveBeenCalledWith(
        expect.objectContaining({
          ...planData,
          status: "active", // fallback for non-draft
          mockDoc: true
        }),
        { userId: "user123", saveId: "123" }
      );
    });

    it("should return 500 if savePlannerDocumentToStore throws an Error", async () => {
      (savePlannerDocumentToStore as any).mockRejectedValue(new Error("Save failed"));
      const req = createReq("POST", "http://localhost", { body: JSON.stringify({ id: "123", projectName: "P", data: {} }) });
      const res = await POST(req);
      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error.code).toBe("INTERNAL_ERROR");
      expect(data.error.message).toBe("Failed to publish plan: Save failed");
    });

    it("should return 500 if savePlannerDocumentToStore throws a non-Error string", async () => {
      (savePlannerDocumentToStore as any).mockRejectedValue("Save error string");
      const req = createReq("POST", "http://localhost", { body: JSON.stringify({ id: "123", projectName: "P", data: {} }) });
      const res = await POST(req);
      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error.code).toBe("INTERNAL_ERROR");
      expect(data.error.message).toBe("Failed to publish plan: Save error string");
    });
  });
});
