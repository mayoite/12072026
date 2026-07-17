import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: path.join(root, ".env.local") });
dotenv.config({ path: path.join(root, "..", ".env.local") });

function resolveIntactCredentials() {
  const pairs = [
    [
      process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
      process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      "cloudflare-r2",
    ],
    [
      process.env.CLOUDFLARE_ACCESS_KEY_ID,
      process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
      "cloudflare-access",
    ],
    [
      process.env.CLOULD_ACCESS_KEY_ID,
      process.env.CLOULDFLARE_S3_SECRET_ACCESS_KEY,
      "legacy-typo",
    ],
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

const ep =
  process.env.CLOUDFLARE_S3_URL?.trim() ||
  process.env.CLOULDFLARE_S3_URL?.trim() ||
  (process.env.CLOUDFLARE_ACCOUNT_ID
    ? `https://${process.env.CLOUDFLARE_ACCOUNT_ID.trim()}.r2.cloudflarestorage.com`
    : null);

const creds = resolveIntactCredentials();
if (!ep || !creds) {
  console.error(
    "Missing intact R2 S3 pair. Set CLOUDFLARE_R2_ACCESS_KEY_ID + CLOUDFLARE_R2_SECRET_ACCESS_KEY.",
  );
  process.exit(1);
}

const client = new S3Client({
  region: "auto",
  endpoint: ep,
  credentials: {
    accessKeyId: creds.accessKeyId,
    secretAccessKey: creds.secretAccessKey,
  },
});
const out = await client.send(new ListBucketsCommand({}));
const names = (out.Buckets ?? []).map((b) => b.Name).filter(Boolean).sort();
console.log(`Account endpoint: ${ep}`);
console.log(`Credential source: ${creds.source}`);
console.log(`Buckets (${names.length}):`);
for (const name of names) {
  console.log(`  - ${name}`);
}
