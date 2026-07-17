import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

export const DEFAULT_CATALOG_BUCKET = "oando-asset-cdn";

export function resolveCatalogBucketName(): string {
  const cliArg = process.argv.find((arg) => arg.startsWith("--bucket="));
  if (cliArg) {
    return cliArg.slice("--bucket=".length).trim();
  }

  return (
    process.env.CLOUDFLARE_R2_CATALOG_BUCKET?.trim() ||
    process.env.CLOUDFLARE_R2_BUCKET?.trim() ||
    process.env.R2_CATALOG_BUCKET?.trim() ||
    DEFAULT_CATALOG_BUCKET
  );
}

export function resolveR2Endpoint(): string | null {
  // Prefer canonical S3 endpoint; accept legacy typo S3 URL only.
  // Do not use CLOULDFLARE_URL (often a dashboard URL, not S3).
  const explicit =
    process.env.CLOUDFLARE_S3_URL?.trim() ||
    process.env.CLOULDFLARE_S3_URL?.trim();

  if (explicit) {
    return explicit;
  }

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
  if (accountId) {
    return `https://${accountId}.r2.cloudflarestorage.com`;
  }

  return null;
}

/** Intact S3 credential pair sources (never mix access/secret across pairs). */
export type R2CredentialSource =
  | "cloudflare-r2"
  | "cloudflare-access"
  | "legacy-typo"
  | null;

type R2CredentialPair = {
  accessKeyId: string;
  secretAccessKey: string;
  source: Exclude<R2CredentialSource, null>;
};

function readIntactPair(
  accessKey: string | undefined,
  secretKey: string | undefined,
  source: Exclude<R2CredentialSource, null>,
): R2CredentialPair | null {
  const accessKeyId = accessKey?.trim() ?? "";
  const secretAccessKey = secretKey?.trim() ?? "";
  if (!accessKeyId || !secretAccessKey) {
    return null;
  }
  return { accessKeyId, secretAccessKey, source };
}

/**
 * Resolve R2 S3 API credentials as an **intact pair**.
 *
 * Two env *names* exist for the same role (R2-prefixed and generic ACCESS_*).
 * They are aliases of one logical credential, not two independent systems.
 * Precedence (first complete pair wins):
 * 1. `CLOUDFLARE_R2_ACCESS_KEY_ID` + `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
 * 2. `CLOUDFLARE_ACCESS_KEY_ID` + `CLOUDFLARE_SECRET_ACCESS_KEY`
 * 3. Legacy typo aliases `CLOULD_ACCESS_KEY_ID` + `CLOULDFLARE_S3_SECRET_ACCESS_KEY`
 *
 * Never mix access from one pair with secret from another.
 * Never use Cloudflare API tokens / Authorization headers as S3 secrets.
 */
export function resolveR2CredentialPair(): R2CredentialPair | null {
  return (
    readIntactPair(
      process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
      process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      "cloudflare-r2",
    ) ||
    readIntactPair(
      process.env.CLOUDFLARE_ACCESS_KEY_ID,
      process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
      "cloudflare-access",
    ) ||
    readIntactPair(
      process.env.CLOULD_ACCESS_KEY_ID,
      process.env.CLOULDFLARE_S3_SECRET_ACCESS_KEY,
      "legacy-typo",
    )
  );
}

export function resolveR2CredentialSource(): R2CredentialSource {
  return resolveR2CredentialPair()?.source ?? null;
}

export function resolveR2Credentials(): { accessKeyId: string; secretAccessKey: string } | null {
  const pair = resolveR2CredentialPair();
  if (!pair) {
    return null;
  }
  return { accessKeyId: pair.accessKeyId, secretAccessKey: pair.secretAccessKey };
}

export function createR2CatalogClient(): S3Client {
  const endpoint = resolveR2Endpoint();
  const credentials = resolveR2Credentials();

  if (!endpoint || !credentials) {
    throw new Error(
      "Missing R2 config (S3 URL or account id, access key, secret key).",
    );
  }

  return new S3Client({
    region: "auto",
    endpoint,
    credentials,
  });
}

export function contentTypeForKey(key: string): string {
  const lower = key.toLowerCase();
  if (lower.endsWith(".json")) return "application/json";
  if (lower.endsWith(".svg")) return "image/svg+xml";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".pdf")) return "application/pdf";
  return "application/octet-stream";
}

export async function readR2ObjectText(key: string, bucket = resolveCatalogBucketName()): Promise<string | null> {
  if (!resolveR2Credentials()) return null;

  try {
    const client = createR2CatalogClient();
    const response = await client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );
    return (await response.Body?.transformToString("utf-8")) ?? null;
  } catch {
    return null;
  }
}

export async function writeR2ObjectText(
  key: string,
  body: string,
  contentType = contentTypeForKey(key),
  bucket = resolveCatalogBucketName(),
): Promise<void> {
  const client = createR2CatalogClient();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
}

/** Cached probe so publish paths do not hit R2 on every request. */
const R2_PROBE_TTL_MS = 60_000;
let r2ProbeCache: { at: number; ok: boolean; reason?: string } | null = null;

export function resetR2CatalogProbeCache(): void {
  r2ProbeCache = null;
}

export type R2CatalogProbeResult = {
  ok: boolean;
  reason?: string;
  source: R2CredentialSource;
};

/**
 * Live check: can we list the catalog bucket with the configured intact S3 pair?
 * Used to gate DB/R2 dual-write so disk authority still publishes when R2 is misconfigured.
 */
export async function probeR2CatalogAccess(options?: {
  force?: boolean;
}): Promise<R2CatalogProbeResult> {
  const source = resolveR2CredentialSource();
  const force = options?.force === true;
  if (!force && r2ProbeCache && Date.now() - r2ProbeCache.at < R2_PROBE_TTL_MS) {
    return {
      ok: r2ProbeCache.ok,
      reason: r2ProbeCache.reason,
      source,
    };
  }

  if (!resolveR2Endpoint() || !resolveR2Credentials()) {
    r2ProbeCache = {
      at: Date.now(),
      ok: false,
      reason: "missing_r2_config",
    };
    return { ok: false, reason: "missing_r2_config", source };
  }

  try {
    const client = createR2CatalogClient();
    await client.send(
      new ListObjectsV2Command({
        Bucket: resolveCatalogBucketName(),
        MaxKeys: 1,
      }),
    );
    r2ProbeCache = { at: Date.now(), ok: true };
    return { ok: true, source };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const status =
      error &&
      typeof error === "object" &&
      "$metadata" in error &&
      error.$metadata &&
      typeof error.$metadata === "object" &&
      "httpStatusCode" in error.$metadata
        ? Number((error.$metadata as { httpStatusCode?: number }).httpStatusCode)
        : undefined;
    const reason =
      status !== undefined && Number.isFinite(status)
        ? `${message} (${status})`
        : message;
    r2ProbeCache = { at: Date.now(), ok: false, reason };
    return { ok: false, reason, source };
  }
}

export async function isR2CatalogReady(options?: {
  force?: boolean;
}): Promise<boolean> {
  return (await probeR2CatalogAccess(options)).ok;
}
