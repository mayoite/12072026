import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export function resolveR2UploadConfig(env: NodeJS.ProcessEnv = process.env) {
  const accountId = env.CLOULDFLARE_ACCOUNT_ID;
  const apiToken = env.CLOULDFLARE_SECRET_API_TOKEN;
  const bucket = env.CLOUDFLARE_R2_CATALOG_BUCKET || "oando-asset-cdn";
  return {
    accountId,
    apiToken,
    bucket,
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: accountId || "dummy-access-key",
      secretAccessKey: apiToken || "dummy-secret-key",
    },
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

  logger.log("Attempting to connect to Cloudflare R2 using the provided API Token...");
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
    logger.log("SUCCESS! The key worked!");
    return { ok: true as const };
  } catch (error: unknown) {
    const e = error as { name?: string; message?: string };
    const name = error instanceof Error ? error.name : String(e.name ?? "Error");
    const message = error instanceof Error ? error.message : String(e.message ?? error);
    logger.error("\nFAILED. Cloudflare rejected the token:");
    logger.error(`Error Name: ${name}`);
    logger.error(`Message: ${message}`);
    return { ok: false as const, name, message };
  }
}

if (process.env.NODE_ENV !== "test" && process.argv[1]?.includes("test-r2-upload")) {
  void testUpload();
}
