import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeNewBlockDescriptorStub } from "@/features/admin/svg-editor/publish/newBlockDescriptorStub";

const insertMock = vi.fn();
const selectMock = vi.fn();
const transactionMock = vi.fn();

vi.mock("server-only", () => ({}));

vi.mock("@/platform/drizzle/productsDb", () => ({
  productsDb: {
    insert: (...args: unknown[]) => insertMock(...args),
    select: (...args: unknown[]) => selectMock(...args),
    transaction: (...args: unknown[]) => transactionMock(...args),
  },
}));

vi.mock("@/platform/drizzle/schema/catalog", () => ({
  svgRevisions: {
    revisionId: "revisionId",
  },
  svgRevisionArtifacts: {
    revisionId: "revisionId",
  },
  blockDescriptors: {
    slug: "slug",
    currentVersion: "currentVersion",
  },
  plannerManagedProducts: {
    id: "id",
    plannerSourceSlug: "plannerSourceSlug",
  },
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn((a: unknown, b: unknown) => ({ a, b })),
  sql: vi.fn((strings: TemplateStringsArray, ...values: unknown[]) => ({
    strings,
    values,
  })),
}));

describe("DrizzleSvgRevisionPersistence", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports a class implementing repository methods", async () => {
    const mod = await import(
      "@/features/admin/svg-editor/storage/drizzleSvgPersistence.server"
    );
    expect(typeof mod.DrizzleSvgRevisionPersistence).toBe("function");
    const instance = new mod.DrizzleSvgRevisionPersistence();
    expect(typeof instance.insertRevision).toBe("function");
    expect(typeof instance.insertArtifacts).toBe("function");
    expect(typeof instance.loadRevision).toBe("function");
    expect(typeof instance.publishRelease).toBe("function");
  });

  it("publishRelease commits revision, descriptor, artifacts, and pointer in one transaction", async () => {
    const insertedValues: unknown[] = [];
    const updatedValues: unknown[] = [];
    const transactionInsert = vi.fn(() => ({
      values: vi.fn((payload: unknown) => {
        insertedValues.push(payload);
        return {
          onConflictDoUpdate: vi.fn(async () => undefined),
        };
      }),
    }));
    const transactionUpdate = vi.fn(() => ({
      set: vi.fn((payload: unknown) => {
        updatedValues.push(payload);
        return {
          where: vi.fn(() => ({
            returning: vi.fn(async () => [{ id: "product-1" }]),
          })),
        };
      }),
    }));
    transactionMock.mockImplementation(async (operation: (transaction: unknown) => Promise<void>) =>
      operation({ insert: transactionInsert, update: transactionUpdate }),
    );

    const { DrizzleSvgRevisionPersistence } = await import(
      "@/features/admin/svg-editor/storage/drizzleSvgPersistence.server"
    );
    const store = new DrizzleSvgRevisionPersistence();
    const liveDescriptor = {
      ...makeNewBlockDescriptorStub(),
      slug: "desk",
    };

    await store.publishRelease(
      {
        schemaVersion: 1,
        revisionId: "desk-r-1234567890abcdef1234",
        definitionTypeId: "desk",
        definitionVersion: 3,
        compilerVersion: "v1",
        sourceRevision: 2,
        artifactChecksums: {
          descriptor: "a".repeat(64),
          svg: "b".repeat(64),
          png: "b".repeat(64),
          thumbnails: {},
        },
        validation: { valid: true, diagnostics: [] },
        actorId: "admin-1",
        publishedAt: "2026-07-16T00:00:00.000Z",
        reason: "publish",
      },
      {
        typeId: "desk",
        lifecycle: { status: "published" },
      } as never,
      [
        {
          revisionId: "desk-r-1234567890abcdef1234",
          kind: "svg",
          checksum: "b".repeat(64),
          storageKey: "svg-catalog/desk.svg",
        },
      ],
      liveDescriptor,
      {} as never,
      "desk",
    );

    expect(transactionMock).toHaveBeenCalledTimes(1);
    expect(transactionInsert).toHaveBeenCalledTimes(3);
    expect(transactionUpdate).toHaveBeenCalledTimes(1);
    expect(insertedValues).toHaveLength(3);
    expect(updatedValues[0]).toMatchObject({
      publishedSvgRevisionId: "desk-r-1234567890abcdef1234",
    });
  });

  it("insertRevision writes revision + upserts block_descriptors with checksum", async () => {
    const valuesCalls: unknown[] = [];
    insertMock.mockImplementation(() => ({
      values: vi.fn((payload: unknown) => {
        valuesCalls.push(payload);
        return {
          onConflictDoUpdate: vi.fn(async () => undefined),
        };
      }),
    }));

    const { DrizzleSvgRevisionPersistence } = await import(
      "@/features/admin/svg-editor/storage/drizzleSvgPersistence.server"
    );
    const store = new DrizzleSvgRevisionPersistence();
    const liveDescriptor = {
      ...makeNewBlockDescriptorStub(),
      slug: "desk",
    };

    await store.insertRevision(
      {
        schemaVersion: 1,
        revisionId: "desk-r1",
        definitionTypeId: "desk",
        definitionVersion: 1,
        compilerVersion: "v1",
        sourceRevision: 0,
        artifactChecksums: { descriptor: "abc123", svg: "svg1" },
        validation: { ok: true },
        actorId: "admin-1",
        publishedAt: "2026-07-16T00:00:00.000Z",
        reason: "publish",
      },
      {
        typeId: "desk",
        lifecycle: { status: "published" },
      } as never,
      liveDescriptor,
      {} as never,
    );

    expect(insertMock).toHaveBeenCalledTimes(2);
    expect(valuesCalls.length).toBe(2);
    expect(valuesCalls[1]).toMatchObject({ descriptor: liveDescriptor });
  });

  it("insertRevision handles non-object checksums and non-published version", async () => {
    insertMock.mockImplementation(() => ({
      values: vi.fn(() => ({
        onConflictDoUpdate: vi.fn(async () => undefined),
      })),
    }));

    const { DrizzleSvgRevisionPersistence } = await import(
      "@/features/admin/svg-editor/storage/drizzleSvgPersistence.server"
    );
    const store = new DrizzleSvgRevisionPersistence();
    const liveDescriptor = {
      ...makeNewBlockDescriptorStub(),
      slug: "desk",
    };

    await store.insertRevision(
      {
        schemaVersion: 1,
        revisionId: "desk-r2",
        definitionTypeId: "desk",
        definitionVersion: 1,
        compilerVersion: "v1",
        sourceRevision: 0,
        artifactChecksums: null as never,
        validation: { ok: true },
        actorId: "admin-1",
        publishedAt: "2026-07-16T00:00:00.000Z",
        reason: "draft",
      },
      {
        typeId: "desk",
        lifecycle: { status: "draft" },
      } as never,
      liveDescriptor,
      {} as never,
    );

    expect(insertMock).toHaveBeenCalled();
  });

  it("insertArtifacts no-ops on empty and inserts when present", async () => {
    insertMock.mockImplementation(() => ({
      values: vi.fn(async () => undefined),
    }));

    const { DrizzleSvgRevisionPersistence } = await import(
      "@/features/admin/svg-editor/storage/drizzleSvgPersistence.server"
    );
    const store = new DrizzleSvgRevisionPersistence();

    await store.insertArtifacts([]);
    expect(insertMock).not.toHaveBeenCalled();

    await store.insertArtifacts([
      {
        revisionId: "desk-r1",
        kind: "svg",
        checksum: "c1",
        storageKey: "k1",
        width: 100,
      },
      {
        revisionId: "desk-r1",
        kind: "thumbnail",
        checksum: "c2",
        storageKey: "k2",
      },
    ]);
    expect(insertMock).toHaveBeenCalledTimes(1);
  });

  it("loadRevision returns null when missing", async () => {
    selectMock.mockReturnValue({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(async () => []),
        })),
      })),
    });

    const { DrizzleSvgRevisionPersistence } = await import(
      "@/features/admin/svg-editor/storage/drizzleSvgPersistence.server"
    );
    const store = new DrizzleSvgRevisionPersistence();
    await expect(store.loadRevision("missing")).resolves.toBeNull();
  });

  it("loadRevision maps revision + artifacts (Date and string publishedAt)", async () => {
    let selectCall = 0;
    selectMock.mockImplementation(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => {
          selectCall += 1;
          if (selectCall === 1) {
            return {
              limit: vi.fn(async () => [
                {
                  schemaVersion: 1,
                  revisionId: "desk-r1",
                  definitionTypeId: "desk",
                  definitionVersion: 2,
                  compilerVersion: "c1",
                  sourceRevision: 1,
                  artifactChecksums: { svg: "x" },
                  validation: { ok: true },
                  actorId: "a1",
                  publishedAt: new Date("2026-07-16T12:00:00.000Z"),
                  reason: "ok",
                  definition: { typeId: "desk" },
                },
              ]),
            };
          }
          return Promise.resolve([
            {
              revisionId: "desk-r1",
              kind: "svg",
              checksum: "c1",
              storageKey: "s1",
              width: 10,
            },
            {
              revisionId: "desk-r1",
              kind: "thumbnail",
              checksum: "c2",
              storageKey: "s2",
              width: null,
            },
          ]);
        }),
      })),
    }));

    const { DrizzleSvgRevisionPersistence } = await import(
      "@/features/admin/svg-editor/storage/drizzleSvgPersistence.server"
    );
    const store = new DrizzleSvgRevisionPersistence();
    const loaded = await store.loadRevision("desk-r1");
    expect(loaded).not.toBeNull();
    expect(loaded?.revision.revisionId).toBe("desk-r1");
    expect(loaded?.revision.publishedAt).toBe("2026-07-16T12:00:00.000Z");
    expect(loaded?.artifacts).toHaveLength(2);
    expect(loaded?.artifacts[1]?.width).toBeUndefined();
  });

  it("loadRevision stringifies non-Date publishedAt", async () => {
    selectMock.mockReturnValue({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(async () => [
            {
              schemaVersion: 1,
              revisionId: "r2",
              definitionTypeId: "desk",
              definitionVersion: 1,
              compilerVersion: null,
              sourceRevision: null,
              artifactChecksums: {},
              validation: {},
              actorId: "a",
              publishedAt: "2026-01-01T00:00:00.000Z",
              reason: null,
              definition: { typeId: "desk" },
            },
          ]),
        })),
      })),
    });
    // second select for artifacts — same mock returns limit only on first shape;
    // re-wire for second call via sequential implementation
    let n = 0;
    selectMock.mockImplementation(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => {
          n += 1;
          if (n === 1) {
            return {
              limit: vi.fn(async () => [
                {
                  schemaVersion: 1,
                  revisionId: "r2",
                  definitionTypeId: "desk",
                  definitionVersion: 1,
                  compilerVersion: null,
                  sourceRevision: null,
                  artifactChecksums: {},
                  validation: {},
                  actorId: "a",
                  publishedAt: "2026-01-01T00:00:00.000Z",
                  reason: null,
                  definition: { typeId: "desk" },
                },
              ]),
            };
          }
          return Promise.resolve([]);
        }),
      })),
    }));

    const { DrizzleSvgRevisionPersistence } = await import(
      "@/features/admin/svg-editor/storage/drizzleSvgPersistence.server"
    );
    const store = new DrizzleSvgRevisionPersistence();
    const loaded = await store.loadRevision("r2");
    expect(loaded?.revision.publishedAt).toBe("2026-01-01T00:00:00.000Z");
    expect(loaded?.revision.compilerVersion).toBe("");
    expect(loaded?.revision.sourceRevision).toBe(0);
    expect(loaded?.revision.reason).toBe("");
    expect(loaded?.artifacts).toEqual([]);
  });
});
