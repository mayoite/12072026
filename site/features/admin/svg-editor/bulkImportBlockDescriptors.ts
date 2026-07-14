/**
 * ADM-SVG-18 + Phase 2 catalog import — CSV bulk import for new block descriptors.
 *
 * - Preview lists additions, conflicts, and rejects before any write.
 * - Apply is atomic: one invalid/conflict row blocks the full batch; partial
 *   writes roll back.
 * - Errors carry exact row (+ field when known).
 * - Provenance: sourceProvenance=migrated, createdBy=bulk-csv-import@iso-time.
 *
 * Tests must pass an isolated `dir` — never mutate the canonical catalog.
 */

import { existsSync } from "node:fs";
import path from "node:path";

import {
  BLOCK_DESCRIPTOR_SCHEMA_VERSION,
  BLOCK_DESCRIPTOR_SLUG_REGEX,
  computeBlockDescriptorChecksum,
  type BlockDescriptorVariant,
} from "@/features/planner/project/catalog/svg/svgTypes";
import {
  BLOCK_DESCRIPTORS_DIR_DEFAULT,
  tryLoad,
} from "@/features/planner/project/catalog/svg/svgBlockDescriptorLoader";
import {
  persistBlockDescriptor,
  unlinkBlockDescriptor,
} from "./persistBlockDescriptor";
import {
  type CatalogLifecycleState,
  setCatalogLifecycle,
} from "./catalogLifecycle";

export type BulkImportRow = {
  readonly slug: string;
  readonly sku: string;
  readonly variant: BlockDescriptorVariant;
  readonly widthMm: number;
  readonly depthMm: number;
  readonly heightMm: number;
  readonly lifecycle: CatalogLifecycleState;
  /** 1-based CSV line number (header is line 1). */
  readonly csvRow: number;
};

export type BulkImportRowError = {
  readonly row: number;
  readonly message: string;
  /** CSV column / field path when known. */
  readonly field?: string;
};

export type BulkImportSuccess = {
  readonly ok: true;
  readonly imported: readonly string[];
  readonly provenance: BulkImportProvenance;
};

export type BulkImportFailure = {
  readonly ok: false;
  readonly errors: readonly BulkImportRowError[];
};

export type BulkImportResult = BulkImportSuccess | BulkImportFailure;

export type BulkImportParseSuccess = {
  readonly ok: true;
  readonly rows: readonly BulkImportRow[];
};

/** Recorded on every imported descriptor. */
export type BulkImportProvenance = {
  readonly source: "bulk-csv-import";
  readonly sourceProvenance: "migrated";
  readonly createdBy: string;
  readonly importedAt: string;
};

/**
 * ADM-SVG-18 preview — all changes without writing.
 * canApply is true only when there are additions and zero rejects/conflicts.
 */
export type BulkImportPreview = {
  readonly additions: readonly BulkImportRow[];
  readonly rejects: readonly BulkImportRowError[];
  readonly conflicts: readonly BulkImportRowError[];
  readonly canApply: boolean;
  readonly summary: string;
};

const REQUIRED_HEADERS = [
  "slug",
  "sku",
  "variant",
  "width_mm",
  "depth_mm",
  "height_mm",
] as const;

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (c === '"') inQ = false;
      else cur += c;
    } else if (c === '"') inQ = true;
    else if (c === ",") {
      out.push(cur.trim());
      cur = "";
    } else cur += c;
  }
  out.push(cur.trim());
  return out;
}

function parseLifecycle(raw: string | undefined): CatalogLifecycleState {
  const value = (raw ?? "draft").trim().toLowerCase();
  if (value === "live" || value === "retired") return value;
  return "draft";
}

function parseVariant(raw: string): BlockDescriptorVariant | null {
  const value = raw.trim().toLowerCase();
  if (value === "fixed" || value === "configurable" || value === "parametric") {
    return value;
  }
  return null;
}

function positiveNumber(raw: string): number | null {
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) return null;
  return value;
}

export function buildBulkImportProvenance(
  clock: () => Date = () => new Date(),
): BulkImportProvenance {
  const importedAt = clock().toISOString();
  return {
    source: "bulk-csv-import",
    sourceProvenance: "migrated",
    createdBy: `bulk-csv-import@${importedAt}`,
    importedAt,
  };
}

export function parseBulkImportCsv(
  csv: string,
): BulkImportParseSuccess | BulkImportFailure {
  const lines = csv
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length < 2) {
    return {
      ok: false,
      errors: [
        {
          row: 0,
          field: "csv",
          message: "CSV must include a header row and at least one data row",
        },
      ],
    };
  }

  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
  const index = (name: string) => headers.indexOf(name);
  for (const required of REQUIRED_HEADERS) {
    if (index(required) < 0) {
      return {
        ok: false,
        errors: [
          {
            row: 0,
            field: required,
            message: `Missing required column: ${required}`,
          },
        ],
      };
    }
  }

  const lifecycleIdx = index("lifecycle");
  const rows: BulkImportRow[] = [];
  const errors: BulkImportRowError[] = [];
  const seenSlugs = new Set<string>();

  for (let i = 1; i < lines.length; i++) {
    const rowNumber = i + 1;
    const cols = parseCsvLine(lines[i]);
    const slug = cols[index("slug")] ?? "";
    const sku = cols[index("sku")] ?? "";
    const variantRaw = cols[index("variant")] ?? "";
    const widthMm = positiveNumber(cols[index("width_mm")] ?? "");
    const depthMm = positiveNumber(cols[index("depth_mm")] ?? "");
    const heightMm = positiveNumber(cols[index("height_mm")] ?? "");
    const lifecycle = parseLifecycle(
      lifecycleIdx >= 0 ? cols[lifecycleIdx] : undefined,
    );

    if (!BLOCK_DESCRIPTOR_SLUG_REGEX.test(slug)) {
      errors.push({
        row: rowNumber,
        field: "slug",
        message: `Invalid slug "${slug}"`,
      });
      continue;
    }
    if (seenSlugs.has(slug)) {
      errors.push({
        row: rowNumber,
        field: "slug",
        message: `Duplicate slug "${slug}" in batch`,
      });
      continue;
    }
    seenSlugs.add(slug);
    const variant = parseVariant(variantRaw);
    if (!variant) {
      errors.push({
        row: rowNumber,
        field: "variant",
        message: `Invalid variant "${variantRaw}"`,
      });
      continue;
    }
    if (widthMm === null) {
      errors.push({
        row: rowNumber,
        field: "width_mm",
        message: "width_mm must be a positive number",
      });
      continue;
    }
    if (depthMm === null) {
      errors.push({
        row: rowNumber,
        field: "depth_mm",
        message: "depth_mm must be a positive number",
      });
      continue;
    }
    if (heightMm === null) {
      errors.push({
        row: rowNumber,
        field: "height_mm",
        message: "height_mm must be a positive number",
      });
      continue;
    }
    if (sku.trim() === "") {
      errors.push({
        row: rowNumber,
        field: "sku",
        message: "sku is required",
      });
      continue;
    }

    rows.push({
      slug,
      sku: sku.trim(),
      variant,
      widthMm,
      depthMm,
      heightMm,
      lifecycle,
      csvRow: rowNumber,
    });
  }

  if (errors.length > 0) return { ok: false, errors };
  if (rows.length === 0) {
    return {
      ok: false,
      errors: [{ row: 0, field: "csv", message: "No import rows found" }],
    };
  }
  return { ok: true, rows };
}

function defaultSlugExists(
  slug: string,
  dir: string,
): boolean {
  const legacyPath = path.join(dir, `${slug}.json`);
  const pointerPath = path.join(dir, `${slug}.latest.json`);
  return (
    existsSync(legacyPath) ||
    existsSync(pointerPath) ||
    tryLoad(slug, { dir }).ok
  );
}

/**
 * Preview every addition, reject, and conflict without writing (ADM-SVG-18).
 * `slugExists` is injectable so tests never touch the canonical catalog.
 */
export function previewBulkImport(
  csv: string,
  slugExists: (slug: string) => boolean = () => false,
): BulkImportPreview {
  const parsed = parseBulkImportCsv(csv);
  if (!parsed.ok) {
    return {
      additions: [],
      rejects: parsed.errors,
      conflicts: [],
      canApply: false,
      summary: `Blocked: ${parsed.errors.length} validation error(s). No rows will be written.`,
    };
  }

  const conflicts: BulkImportRowError[] = [];
  const additions: BulkImportRow[] = [];
  for (const row of parsed.rows) {
    if (slugExists(row.slug)) {
      conflicts.push({
        row: row.csvRow,
        field: "slug",
        message: `Slug "${row.slug}" already exists — bulk import only creates new descriptors`,
      });
    } else {
      additions.push(row);
    }
  }

  const canApply = conflicts.length === 0 && additions.length > 0;
  const summary = canApply
    ? `Preview: will add ${additions.length} descriptor(s). No conflicts.`
    : conflicts.length > 0
      ? `Blocked: ${conflicts.length} conflict(s), ${additions.length} would-be addition(s). Nothing will be written.`
      : "Blocked: nothing to import.";

  return {
    additions,
    rejects: [],
    conflicts,
    canApply,
    summary,
  };
}

function descriptorInputFromRow(
  row: BulkImportRow,
  provenance: BulkImportProvenance,
): Record<string, unknown> {
  const viewWidth = Math.max(1, Math.round(row.widthMm));
  const viewHeight = Math.max(1, Math.round(row.depthMm));
  const base: Record<string, unknown> = {
    schemaVersion: BLOCK_DESCRIPTOR_SCHEMA_VERSION,
    id: "00000000-0000-4000-8000-000000000001",
    slug: row.slug,
    sku: row.sku,
    sourceProvenance: provenance.sourceProvenance,
    createdBy: provenance.createdBy,
    geometry: {
      widthMm: row.widthMm,
      depthMm: row.depthMm,
      heightMm: row.heightMm,
    },
    viewBox: { x: 0, y: 0, width: viewWidth, height: viewHeight },
    mounting: ["floor"],
    themeTokens: { currentColor: "currentColor" },
    rovingFocus: [],
    liveAnnouncementCategories: ["status"],
    variant: row.variant,
    checksum: "0".repeat(64),
  };

  if (row.variant === "fixed") {
    base.fixed = { sizingType: "fixed" };
    base.blocks = [
      {
        id: "footprint",
        x: 0,
        y: 0,
        width: viewWidth,
        depth: viewHeight,
      },
    ];
  } else if (row.variant === "configurable") {
    base.configurable = { sizingType: "discrete", sizeOptions: ["default"] };
    base.blocks = [
      {
        id: "footprint",
        x: 0,
        y: 0,
        width: viewWidth,
        depth: viewHeight,
      },
    ];
  } else {
    base.parametric = {
      sizingType: "parametric",
      parameterSchema: [{ key: "width", label: "Width", kind: "number" }],
    };
    base.mountingPoints = [{ plane: "floor", offset: { x: 0, y: 0 } }];
    base.blocks = [
      {
        id: "footprint",
        x: 0,
        y: 0,
        width: viewWidth,
        depth: viewHeight,
      },
    ];
  }

  base.checksum = computeBlockDescriptorChecksum(base);
  return base;
}

export type BulkImportOptions = {
  readonly dir?: string;
  readonly clock?: () => Date;
  readonly dryRun?: boolean;
};

/**
 * Preview (dryRun) or atomic apply. Full batch blocked on any reject/conflict.
 */
export function bulkImportBlockDescriptors(
  csv: string,
  dirOrOptions: string | BulkImportOptions = BLOCK_DESCRIPTORS_DIR_DEFAULT,
): BulkImportResult | (BulkImportPreview & { readonly ok: true; readonly dryRun: true }) {
  const options: BulkImportOptions =
    typeof dirOrOptions === "string" ? { dir: dirOrOptions } : dirOrOptions;
  const dir = options.dir ?? BLOCK_DESCRIPTORS_DIR_DEFAULT;
  const slugExists = (slug: string) => defaultSlugExists(slug, dir);
  const preview = previewBulkImport(csv, slugExists);

  if (options.dryRun) {
    return { ok: true, dryRun: true, ...preview };
  }

  if (!preview.canApply) {
    return {
      ok: false,
      errors: [...preview.rejects, ...preview.conflicts],
    };
  }

  const provenance = buildBulkImportProvenance(options.clock);
  const imported: string[] = [];
  try {
    for (const row of preview.additions) {
      const persisted = persistBlockDescriptor(
        descriptorInputFromRow(row, provenance),
        { dir },
      );
      if (!persisted.ok) {
        throw new Error(
          `row ${row.csvRow} field slug: ${persisted.error.message}`,
        );
      }
      setCatalogLifecycle(row.slug, row.lifecycle, dir);
      imported.push(row.slug);
    }
    return { ok: true, imported, provenance };
  } catch (cause) {
    for (const slug of imported) {
      try {
        unlinkBlockDescriptor(slug, dir);
      } catch {
        // best-effort rollback
      }
    }
    const message = cause instanceof Error ? cause.message : String(cause);
    return {
      ok: false,
      errors: [
        {
          row: 0,
          field: "batch",
          message: `Import rolled back: ${message}`,
        },
      ],
    };
  }
}
