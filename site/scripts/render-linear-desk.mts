/**
 * Plan+A C2 CLI: JSON fields → linear-desk SVG (dev isolation).
 *
 * Default: writes under repo `results/admin/parametric/` (gitignored tool output).
 * Never mutates canonical catalog unless `--catalog` is passed explicitly.
 *
 * Usage (from repo root):
 *   pnpm --filter oando-site exec tsx scripts/render-linear-desk.mts path/to/fields.json
 *   pnpm --filter oando-site exec tsx scripts/render-linear-desk.mts --inline '{"type":"linear-desk","widthMm":1600,"depthMm":800}'
 *
 * Options:
 *   --out <path>     Explicit output .svg path
 *   --catalog        Write to site/public/svg-catalog/<slug>.svg (owner/dev only)
 *   --stdout         Print SVG to stdout (no file write)
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  parseLinearDeskFields,
  renderLinearDeskSvg,
} from "../features/planner/asset-engine/svg/parametric/index.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(siteRoot, "..");

function printUsage(): void {
  process.stderr.write(
    [
      "Usage:",
      "  tsx scripts/render-linear-desk.mts <fields.json>",
      "  tsx scripts/render-linear-desk.mts --inline '<json>'",
      "Options: --out <path> | --catalog | --stdout",
      "",
    ].join("\n"),
  );
}

function parseArgs(argv: string[]): {
  jsonPath?: string;
  inline?: string;
  out?: string;
  catalog: boolean;
  stdout: boolean;
} {
  let jsonPath: string | undefined;
  let inline: string | undefined;
  let out: string | undefined;
  let catalog = false;
  let stdout = false;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--inline") {
      inline = argv[++i];
      continue;
    }
    if (arg === "--out") {
      out = argv[++i];
      continue;
    }
    if (arg === "--catalog") {
      catalog = true;
      continue;
    }
    if (arg === "--stdout") {
      stdout = true;
      continue;
    }
    if (arg === "-h" || arg === "--help") {
      printUsage();
      process.exit(0);
    }
    if (arg.startsWith("-")) {
      throw new Error(`Unknown option: ${arg}`);
    }
    if (!jsonPath) {
      jsonPath = arg;
      continue;
    }
    throw new Error(`Unexpected argument: ${arg}`);
  }

  return { jsonPath, inline, out, catalog, stdout };
}

function loadRaw(args: ReturnType<typeof parseArgs>): unknown {
  if (args.inline) {
    return JSON.parse(args.inline) as unknown;
  }
  if (args.jsonPath) {
    const resolved = path.isAbsolute(args.jsonPath)
      ? args.jsonPath
      : path.resolve(process.cwd(), args.jsonPath);
    return JSON.parse(readFileSync(resolved, "utf8")) as unknown;
  }
  throw new Error("Provide <fields.json> or --inline '<json>'");
}

function defaultOutPath(slug: string): string {
  return path.join(repoRoot, "results", "admin", "parametric", `${slug}.svg`);
}

function catalogOutPath(slug: string): string {
  return path.join(siteRoot, "public", "svg-catalog", `${slug}.svg`);
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));
  const raw = loadRaw(args);
  const fields = parseLinearDeskFields(raw);
  const svg = renderLinearDeskSvg(fields);
  const slug = fields.slug ?? "linear-desk";

  if (args.stdout) {
    process.stdout.write(svg);
    if (!svg.endsWith("\n")) process.stdout.write("\n");
    return;
  }

  let outPath: string;
  if (args.out) {
    outPath = path.isAbsolute(args.out)
      ? args.out
      : path.resolve(process.cwd(), args.out);
  } else if (args.catalog) {
    outPath = catalogOutPath(slug);
  } else {
    outPath = defaultOutPath(slug);
  }

  mkdirSync(path.dirname(outPath), { recursive: true });
  writeFileSync(outPath, `${svg}\n`, "utf8");
  process.stdout.write(`${outPath}\n`);
}

try {
  main();
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  process.stderr.write(`render-linear-desk failed: ${message}\n`);
  process.exit(1);
}
