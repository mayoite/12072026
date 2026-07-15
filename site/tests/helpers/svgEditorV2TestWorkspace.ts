import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  persistBlockDescriptor,
  type PersistResult,
} from "@/features/admin/svg-editor/persistBlockDescriptor";
import type {
  PublishedRevisionV1,
  SvgBlockDefinitionV1,
} from "@/features/admin/svg-editor/svgBlockSchemas";
import {
  ImmutableSvgRevisionRepository,
  type SvgArtifactRecord,
  type SupabaseSvgRevisionPersistence,
} from "@/features/admin/svg-editor/svgRevisionRepository.server";

const SITE_ROOT = path.resolve(__dirname, "../..");

export const CANONICAL_DESCRIPTOR_DIR = path.join(
  SITE_ROOT,
  "inventory",
  "descriptors",
);
export const CANONICAL_SVG_CATALOG_DIR = path.join(
  SITE_ROOT,
  "public",
  "svg-catalog",
);

export type InMemorySvgRevisionRecord = {
  readonly revision: PublishedRevisionV1;
  readonly definition: SvgBlockDefinitionV1;
};

export type SvgEditorV2TestRepositories = {
  readonly revisions: Map<string, InMemorySvgRevisionRecord>;
  readonly artifacts: Map<string, readonly SvgArtifactRecord[]>;
};

export type SvgEditorV2TestWorkspace = {
  readonly root: string;
  readonly descriptorDir: string;
  readonly svgCatalogDir: string;
  readonly revisionRepository: ImmutableSvgRevisionRepository;
  persistDescriptor(input: unknown): PersistResult;
  resolvePath(candidate: string): string;
  writeFile(candidate: string, body: string): string;
  writeSvg(fileName: string, body: string): string;
  cleanup(): void;
};

function isWithin(parent: string, candidate: string): boolean {
  const relative = path.relative(parent, candidate);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

export function createSvgEditorV2TestWorkspace(
  repositories: SvgEditorV2TestRepositories,
): SvgEditorV2TestWorkspace {
  const root = mkdtempSync(path.join(os.tmpdir(), "oando-svg-editor-v2-"));
  const descriptorDir = path.join(root, "site", "inventory", "descriptors");
  const svgCatalogDir = path.join(root, "site", "public", "svg-catalog");
  mkdirSync(descriptorDir, { recursive: true });
  mkdirSync(svgCatalogDir, { recursive: true });

  const persistence: SupabaseSvgRevisionPersistence = {
    async insertRevision(revision, definition) {
      repositories.revisions.set(revision.revisionId, { revision, definition });
    },
    async insertArtifacts(records) {
      for (const revisionId of new Set(records.map(({ revisionId }) => revisionId))) {
        repositories.artifacts.set(
          revisionId,
          records.filter((record) => record.revisionId === revisionId),
        );
      }
    },
    async loadRevision(revisionId) {
      const record = repositories.revisions.get(revisionId);
      if (!record) return null;
      return {
        ...record,
        artifacts: repositories.artifacts.get(revisionId) ?? [],
      };
    },
  };

  const resolvePath = (candidate: string): string => {
    const resolved = path.resolve(root, candidate);
    if (!isWithin(root, resolved)) {
      throw new Error(`Path is outside isolated SVG editor V2 workspace: ${resolved}`);
    }
    return resolved;
  };
  const writeFile = (candidate: string, body: string): string => {
    const resolved = resolvePath(candidate);
    mkdirSync(path.dirname(resolved), { recursive: true });
    writeFileSync(resolved, body, "utf8");
    return resolved;
  };

  return {
    root,
    descriptorDir,
    svgCatalogDir,
    revisionRepository: new ImmutableSvgRevisionRepository(persistence),
    persistDescriptor: (input) =>
      persistBlockDescriptor(input, {
        dir: descriptorDir,
        writeArchive: false,
      }),
    resolvePath,
    writeFile,
    writeSvg: (fileName, body) =>
      writeFile(path.join("site", "public", "svg-catalog", fileName), body),
    cleanup: () => rmSync(root, { recursive: true, force: true }),
  };
}

export async function withSvgEditorV2TestWorkspace<Result>(
  repositories: SvgEditorV2TestRepositories,
  callback: (workspace: SvgEditorV2TestWorkspace) => Promise<Result> | Result,
): Promise<Result> {
  const workspace = createSvgEditorV2TestWorkspace(repositories);
  try {
    return await callback(workspace);
  } finally {
    workspace.cleanup();
  }
}
