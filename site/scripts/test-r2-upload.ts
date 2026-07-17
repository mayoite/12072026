/**
 * Probe R2 with an intact S3 credential pair (not Account API tokens).
 */
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: path.join(root, ".env.local") });
dotenv.config({ path: path.join(root, "..", ".env.local") });

function resolveIntactCredentials(env: NodeJS.ProcessEnv) {
  const pairs: Array<[string | undefined, string | undefined, string]> = [
    [env.CLOUDFLARE_R2_ACCESS_KEY_ID, env.CLOUDFLARE_R2_SECRET_ACCESS_KEY, "cloudflare-r2"],
    [env.CLOUDFLARE_ACCESS_KEY_ID, env.CLOUDFLARE_SECRET_ACCESS_KEY, "cloudflare-access"],
    [env.CLOULD_ACCESS_KEY_ID, env.CLOULDFLARE_S3_SECRET_ACCESS_KEY, "legacy-typo"],
  ];
  for (const [access, secret, source] of pairs) {
    const accessKeyId = access?.trim() ?? "";
    const secretAccessKey = secret?.trim() ?? "";
    if (accessKeyId && secretAccessKey) {
      return { accessKeyId, secretAccessKey, source };
    }
  }
  return null;
}

export function resolveR2UploadConfig(env: NodeJS.ProcessEnv = process.env) {
  const accountId =
    env.CLOUDFLARE_ACCOUNT_ID?.trim() || env.CLOULDFLARE_ACCOUNT_ID?.trim() || "";
  const endpoint =
    env.CLOUDFLARE_S3_URL?.trim() ||
    env.CLOULDFLARE_S3_URL?.trim() ||
    (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : "");
  const credentials = resolveIntactCredentials(env);
  const bucket =
    env.CLOUDFLARE_R2_CATALOG_BUCKET?.trim() ||
    env.CLOUDFLARE_R2_BUCKET?.trim() ||
    "oando-asset-cdn";
  return {
    accountId,
    endpoint,
    bucket,
    credentialSource: credentials?.source ?? null,
    credentials: credentials
      ? {
          accessKeyId: credentials.accessKeyId,
          secretAccessKey: credentials.secretAccessKey,
        }
      : null,
  };
}

export function buildTestUploadParams(env: NodeJS.ProcessEnv = process.env) {
  const { bucket } = resolveR2UploadConfig(env);
  return {
    Bucket: bucket,
    Key: "test-auth.json",
    Body: JSON.stringify({ test: "auth" }),
    ContentType: "application/json",
  };
}

export async function testUpload(options: {
  env?: NodeJS.ProcessEnv;
  client?: S3Client;
  logger?: Pick<typeof console, "log" | "error">;
} = {}) {
  const env = options.env || process.env;
  const logger = options.logger || console;
  const cfg = resolveR2UploadConfig(env);

  if (!cfg.endpoint || !cfg.credentials) {
    logger.error(
      "Missing intact R2 S3 pair. Set CLOUDFLARE_R2_ACCESS_KEY_ID + CLOUDFLARE_R2_SECRET_ACCESS_KEY.",
    );
    return {
      ok: false as const,
      name: "ConfigError",
      message: "missing_r2_config",
    };
  }

  logger.log(`Attempting R2 put via intact pair (${cfg.credentialSource})...`);
  logger.log(`Endpoint: ${cfg.endpoint}`);

  const s3 =
    options.client ||
    new S3Client({
      region: "auto",
      endpoint: cfg.endpoint,
      credentials: cfg.credentials,
    });

  try {
    const params = buildTestUploadParams(env);
    await s3.send(new PutObjectCommand(params));
    logger.log("SUCCESS! The S3 pair worked.");
    return { ok: true as const };
  } catch (error: unknown) {
    const e = error as { name?: string; message?: string };
    const name = error instanceof Error ? error.name : String(e.name ?? "Error");
    const message =
      error instanceof Error ? error.message : String(e.message ?? error);
    logger.error("\nFAILED. Cloudflare rejected the S3 pair:");
    logger.error(`Error Name: ${name}`);
    logger.error(`Message: ${message}`);
    return { ok: false as const, name, message };
  }
}

if (process.env.NODE_ENV !== "test" && process.argv[1]?.includes("test-r2-upload")) {
  void testUpload();
}
