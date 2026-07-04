import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const accountId = process.env.CLOULDFLARE_ACCOUNT_ID;
const apiToken = process.env.CLOULDFLARE_SECRET_API_TOKEN;

async function testUpload() {
  console.log("Attempting to connect to Cloudflare R2 using the provided API Token...");
  console.log(`Endpoint: https://${accountId}.r2.cloudflarestorage.com`);
  
  const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: accountId || "dummy-access-key", 
      secretAccessKey: apiToken || "dummy-secret-key", 
    }
  });

  try {
    const params = {
      Bucket: process.env.CLOUDFLARE_R2_CATALOG_BUCKET || "oando-asset-cdn",
      Key: "test-auth.json",
      Body: JSON.stringify({ test: "auth" }),
      ContentType: "application/json"
    };

    await s3.send(new PutObjectCommand(params));
    console.log("SUCCESS! The key worked!");
  } catch (error: unknown) {
    // narrow unknown for aws-sdk error shape; reason: catch boundary from s3.send unknown; owner: Resolve Failures Agent (PLAN-FAIL-0411); removal: when error typing from @aws-sdk added to this test script or shared util
    const e = error as { name?: string; message?: string };
    const name = error instanceof Error ? error.name : String(e.name ?? "Error");
    const message = error instanceof Error ? error.message : String(e.message ?? error);
    console.error("\nFAILED. Cloudflare rejected the token:");
    console.error(`Error Name: ${name}`);
    console.error(`Message: ${message}`);
  }
}

testUpload();
