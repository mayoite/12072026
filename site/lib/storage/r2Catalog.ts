import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

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
  const explicit =
    process.env.CLOULDFLARE_S3_URL?.trim() ||
    process.env.CLOUDFLARE_S3_URL?.trim();

  if (explicit) {
    return explicit;
  }

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
  if (accountId) {
    return `https://${accountId}.r2.cloudflarestorage.com`;
  }

  return null;
}

export function resolveR2Credentials(): { accessKeyId: string; secretAccessKey: string } | null {
  const accessKeyId =
    process.env.CLOUDFLARE_R2_ACCESS_KEY_ID?.trim() ||
    process.env.CLOULD_ACCESS_KEY_ID?.trim() ||
    process.env.CLOUDFLARE_ACCESS_KEY_ID?.trim();

  const secretAccessKey =
    process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY?.trim() ||
    process.env.CLOULDFLARE_S3_SECRET_ACCESS_KEY?.trim() ||
    process.env.CLOULDFLARE_S3_SECRET_ACCESS_KEY?.trim();

  if (!accessKeyId || !secretAccessKey) {
    return null;
  }

  return { accessKeyId, secretAccessKey };
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
