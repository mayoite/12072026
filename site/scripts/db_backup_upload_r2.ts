/**
 * Nightly-style Supabase backup: pg_dump both projects → Cloudflare R2.
 *
 * Usage:
 *   pnpm --filter oando-site run backup:supabase:r2
 *   pnpm --filter oando-site run backup:supabase:r2 -- --keep-local
 *
 * R2 layout:
 *   backups/products/pgdump-products-<timestamp>.dump
 *   backups/admin/pgdump-admin-<timestamp>.dump
 *
 * Schedule: GitHub Actions workflow `.github/workflows/supabase-backup-r2.yml` (daily + manual).
 * Local one-off: same command if `pg_dump` is installed.
 */
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { createReadStream, existsSync, mkdirSync, readdirSync, statSync, unlinkSync } from "node:fs";
import { resolve } from "node:path";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { createR2CatalogClient, resolveCatalogBucketName } from "./lib/r2Catalog";
import { resolvePgDumpExecutable } from "./lib/resolvePgDump";
import { REPO_ROOT } from "./lib/repoRoot";

const require = createRequire(import.meta.url);
require("./loadEnvLocal.cjs").loadEnvLocal();

const TARGETS = {
  products: "PRODUCTS_DATABASE_URL",
  admin: "SUPABASE_AUTH_DATABASE_URL",
} as const;

type Target = keyof typeof TARGETS;

function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

function pickTargets(): Target[] {
  const fromCli: Target[] = [];
  for (let i = 0; i < process.argv.length; i += 1) {
    if (process.argv[i] === "--target" && process.argv[i + 1]) {
      const value = process.argv[i + 1] as Target;
      if (value in TARGETS) fromCli.push(value);
    }
  }
  return fromCli.length > 0 ? [...new Set(fromCli)] : ["products", "admin"];
}

function timestamp(): string {
  return new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
}

async function uploadFile(localPath: string, key: string): Promise<void> {
  const client = createR2CatalogClient();
  const bucket = resolveCatalogBucketName();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: createReadStream(localPath),
      ContentType: "application/octet-stream",
    }),
  );
  console.log(`Uploaded s3://${bucket}/${key}`);
}

async function backupTarget(target: Target, keepLocal: boolean, pgDump: string): Promise<void> {
  const envKey = TARGETS[target];
  const url = process.env[envKey]?.trim();
  if (!url) {
    console.warn(`Skip ${target}: missing ${envKey}`);
    return;
  }

  const outDir = resolve(process.cwd(), "backups");
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  const fileName = `pgdump-${target}-${timestamp()}.dump`;
  const localPath = resolve(outDir, fileName);

  console.log(`Dumping ${target} (${envKey}) → ${localPath}`);
  const dump = spawnSync(pgDump, ["-Fc", "-f", localPath, url], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (dump.error) {
    throw dump.error;
  }
  if (dump.status !== 0) {
    throw new Error(`pg_dump failed for ${target} (exit ${dump.status ?? "unknown"})`);
  }

  const r2Key = `backups/${target}/${fileName}`;
  await uploadFile(localPath, r2Key);

  if (!keepLocal) {
    unlinkSync(localPath);
    console.log(`Removed local copy ${localPath}`);
  }
}

/** Optional JSON table export fallback → R2 (products Supabase REST snapshot). */
async function uploadLatestJsonBackup(): Promise<void> {
  const backupRoot = resolve(REPO_ROOT, "results", "backups", "supabase");
  if (!existsSync(backupRoot)) {
    console.log("Skip JSON backup upload: no results/backups/supabase (run supabase:backup first).");
    return;
  }

  const folders = readdirSync(backupRoot)
    .map((name) => {
      const full = resolve(backupRoot, name);
      return { name, full, mtime: statSync(full).mtimeMs };
    })
    .filter((entry) => statSync(entry.full).isDirectory())
    .sort((a, b) => b.mtime - a.mtime);

  const latest = folders[0];
  if (!latest) return;

  console.log(`Uploading JSON backup folder ${latest.name} → R2...`);
  const client = createR2CatalogClient();
  const bucket = resolveCatalogBucketName();
  const prefix = `backups/supabase-json/${latest.name}`;

  for (const file of readdirSync(latest.full)) {
    const localPath = resolve(latest.full, file);
    if (!statSync(localPath).isFile()) continue;
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: `${prefix}/${file}`,
        Body: createReadStream(localPath),
        ContentType: file.endsWith(".json") ? "application/json" : "application/octet-stream",
      }),
    );
  }
  console.log(`Uploaded JSON snapshot to s3://${bucket}/${prefix}/`);
}

async function main() {
  const keepLocal = hasFlag("--keep-local");
  const includeJson = hasFlag("--with-json");
  const pgDump = resolvePgDumpExecutable();
  console.log(`Using pg_dump: ${pgDump}`);

  for (const target of pickTargets()) {
    await backupTarget(target, keepLocal, pgDump);
  }

  if (includeJson) {
    await uploadLatestJsonBackup();
  }

  console.log("OK: Supabase backup → R2 finished.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
