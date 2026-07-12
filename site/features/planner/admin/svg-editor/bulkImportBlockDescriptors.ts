/**
 * Admin P02 — atomic CSV bulk import for new block descriptors.
 * Validates the full batch before any persist; rolls back partial writes on failure.
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
};

export type BulkImportRowError = {
  readonly row: number;
  readonly message: string;
};

export type BulkImportSuccess = {
  readonly ok: true;
  readonly imported: readonly string[];
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

function positiveNumber(raw: string, field: string): number | null {
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) return null;
  return value;
}

export function parseBulkImportCsv(csv: string): BulkImportParseSuccess | BulkImportFailure {
  const lines = csv.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) {
    return { ok: false, errors: [{ row: 0, message: "CSV must include a header row and at least one data row" }] };
  }

  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
  const index = (name: string) => headers.indexOf(name);
  for (const required of REQUIRED_HEADERS) {
    if (index(required) < 0) {
      return { ok: false, errors: [{ row: 0, message: `Missing required column: ${required}` }] };
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
    const widthMm = positiveNumber(cols[index("width_mm")] ?? "", "width_mm");
    const depthMm = positiveNumber(cols[index("depth_mm")] ?? "", "depth_mm");
    const heightMm = positiveNumber(cols[index("height_mm")] ?? "", "height_mm");
    const lifecycle = parseLifecycle(lifecycleIdx >= 0 ? cols[lifecycleIdx] : undefined);

    if (!BLOCK_DESCRIPTOR_SLUG_REGEX.test(slug)) {
      errors.push({ row: rowNumber, message: `Invalid slug "${slug}"` });
      continue;
    }
    if (seenSlugs.has(slug)) {
      errors.push({ row: rowNumber, message: `Duplicate slug "${slug}" in batch` });
      continue;
    }
    seenSlugs.add(slug);
    const variant = parseVariant(variantRaw);
    if (!variant) {
      errors.push({ row: rowNumber, message: `Invalid variant "${variantRaw}"` });
      continue;
    }
    if (widthMm === null || depthMm === null || heightMm === null) {
      errors.push({ row: rowNumber, message: "width_mm, depth_mm, and height_mm must be positive numbers" });
      continue;
    }
    if (sku.trim() === "") {
      errors.push({ row: rowNumber, message: "sku is required" });
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
    });
  }

  if (errors.length > 0) return { ok: false, errors };
  if (rows.length === 0) {
    return { ok: false, errors: [{ row: 0, message: "No import rows found" }] };
  }
  return { ok: true, rows };
}

function descriptorInputFromRow(row: BulkImportRow): Record<string, unknown> {
  const viewWidth = Math.max(1, Math.round(row.widthMm));
  const viewHeight = Math.max(1, Math.round(row.depthMm));
  const base: Record<string, unknown> = {
    schemaVersion: BLOCK_DESCRIPTOR_SCHEMA_VERSION,
    id: "00000000-0000-4000-8000-000000000001",
    slug: row.slug,
    sku: row.sku,
    sourceProvenance: "native",
    createdBy: "bulk-import",
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

export function bulkImportBlockDescriptors(
  csv: string,
  dir: string = BLOCK_DESCRIPTORS_DIR_DEFAULT,
): BulkImportResult {
  const parsed = parseBulkImportCsv(csv);
  if (!parsed.ok) return parsed;
  const rows = parsed.rows;

  const preflightErrors: BulkImportRowError[] = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const legacyPath = path.join(dir, `${row.slug}.json`);
    const pointerPath = path.join(dir, `${row.slug}.latest.json`);
    if (existsSync(legacyPath) || existsSync(pointerPath) || tryLoad(row.slug, { dir }).ok) {
      preflightErrors.push({
        row: i + 2,
        message: `Slug "${row.slug}" already exists — bulk import only creates new descriptors`,
      });
    }
  }
  if (preflightErrors.length > 0) return { ok: false, errors: preflightErrors };

  const imported: string[] = [];
  try {
    for (const row of rows) {
      const persisted = persistBlockDescriptor(descriptorInputFromRow(row), { dir });
      if (!persisted.ok) {
        throw new Error(`row ${row.slug}: ${persisted.error.message}`);
      }
      setCatalogLifecycle(row.slug, row.lifecycle, dir);
      imported.push(row.slug);
    }
    return { ok: true, imported };
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
      errors: [{ row: 0, message: `Import rolled back: ${message}` }],
    };
  }
}