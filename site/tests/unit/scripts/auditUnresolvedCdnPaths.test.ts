// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const repoRoot = path.resolve(siteRoot, "..");
const failuresPath = path.join(repoRoot, "results/cdn-asset-failures.json");
const reportJson = path.join(repoRoot, "results/cdn-unresolved-replacements.json");
const reportMd = path.join(repoRoot, "results/cdn-unresolved-replacements.md");

const fixtureBody = JSON.stringify({
  unresolved: [{ path: "/images/chairs/task-chair/image-01.jpg" }],
  failures: [
    {
      path: "/images/chairs/task-chair/image-01.jpg",
      resolution: "unresolved",
    },
  ],
});

function makeQuery(result: { data?: unknown; error?: null }) {
  const resolved = { data: result.data ?? [], error: result.error ?? null };
  const builder: Record<string, unknown> = {};
  const self = new Proxy(builder, {
    get(_t, prop: string | symbol) {
      if (prop === "then") {
        return (resolve: (v: unknown) => unknown) => Promise.resolve(resolved).then(resolve);
      }
      return vi.fn(() => self);
    },
  });
  return self;
}

const createClient = vi.fn(() => ({
  from: vi.fn((table: string) => {
    if (table === "products") {
      return makeQuery({
        data: [
          {
            id: "p1",
            slug: "task-chair",
            name: "Task Chair",
            images: ["/images/chairs/task-chair/image-01.jpg"],
            flagship_image: null,
            scene_images: [],
            metadata: {},
          },
        ],
      });
    }
    return makeQuery({ data: [] });
  }),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient,
}));

vi.mock("dotenv", () => ({
  default: { config: vi.fn() },
  config: vi.fn(),
}));

// Hoisted mock so the script never depends on a shared on-disk fixture race.
vi.mock("fs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("fs")>();
  const fixture = JSON.stringify({
    unresolved: [{ path: "/images/chairs/task-chair/image-01.jpg" }],
    failures: [
      {
        path: "/images/chairs/task-chair/image-01.jpg",
        resolution: "unresolved",
      },
    ],
  });
  const readFileSync = ((p: fs.PathOrFileDescriptor, encoding?: unknown) => {
    if (String(p).replace(/\\/g, "/").endsWith("cdn-asset-failures.json")) {
      return fixture;
    }
    return actual.readFileSync(p, encoding as BufferEncoding);
  }) as typeof actual.readFileSync;

  return {
    ...actual,
    readFileSync,
    default: {
      ...actual,
      readFileSync,
    },
  };
});

const exitSpy = vi.spyOn(process, "exit").mockImplementation((() => undefined) as never);

describe("auditUnresolvedCdnPaths (name-mirror)", () => {
  afterEach(() => {
    if (fs.existsSync(reportMd)) fs.rmSync(reportMd, { force: true });
  });

  beforeEach(() => {
    vi.clearAllMocks();
    exitSpy.mockClear();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://cdn.example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-test";
    // Disk fixture as backup if mock is bypassed
    fs.mkdirSync(path.dirname(failuresPath), { recursive: true });
    fs.writeFileSync(failuresPath, fixtureBody, "utf8");
    if (fs.existsSync(reportJson)) fs.rmSync(reportJson, { force: true });
    if (fs.existsSync(reportMd)) fs.rmSync(reportMd, { force: true });
  });

  it("suggests replacements for unresolved CDN paths and writes reports", async () => {
    vi.resetModules();
    // Keep disk fixture present across resetModules
    fs.writeFileSync(failuresPath, fixtureBody, "utf8");

    const prev = process.cwd();
    process.chdir(siteRoot);
    try {
      await import("@/scripts/auditUnresolvedCdnPaths");
      await vi.waitFor(() => {
        expect(fs.existsSync(reportJson)).toBe(true);
        const parsed = JSON.parse(fs.readFileSync(reportJson, "utf8")) as {
          total?: number;
          suggestions?: Array<{ path: string }>;
          supabaseConnected?: boolean;
        };
        expect(typeof parsed.total).toBe("number");
        expect((parsed.suggestions?.length ?? 0)).toBeGreaterThan(0);
        expect(typeof parsed.supabaseConnected).toBe("boolean");
      });
    } finally {
      process.chdir(prev);
    }

    expect(createClient).toHaveBeenCalled();
    expect(exitSpy).not.toHaveBeenCalledWith(1);

    const summary = JSON.parse(fs.readFileSync(reportJson, "utf8")) as {
      total: number;
      withSuggestion: number;
      withoutSuggestion: number;
      supabaseConnected: boolean;
      byConfidence: Record<string, number>;
      suggestions: Array<{
        path: string;
        suggestedPath: string | null;
        confidence: string;
        reason: string;
        referencedBy: unknown[];
      }>;
    };

    expect(summary.total).toBeGreaterThan(0);
    expect(summary.suggestions.length).toBe(summary.total);
    expect(summary.withSuggestion + summary.withoutSuggestion).toBe(summary.total);
    expect(summary.supabaseConnected).toBe(true);
    expect(summary.suggestions.some((s) => s.path.startsWith("/images/"))).toBe(true);
    for (const row of summary.suggestions.slice(0, 25)) {
      expect(["high", "medium", "low", "none"]).toContain(row.confidence);
      expect(row.reason.length).toBeGreaterThan(0);
      expect(Array.isArray(row.referencedBy)).toBe(true);
    }
    expect(
      summary.byConfidence.high +
        summary.byConfidence.medium +
        summary.byConfidence.low +
        summary.byConfidence.none,
    ).toBe(summary.total);

    const md = fs.readFileSync(reportMd, "utf8");
    expect(md).toContain("# Unresolved CDN path replacement suggestions");
    expect(md).toContain("Total unresolved:");
    expect(md).toMatch(/\/images\//);
  });
});
