import "server-only";

import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

import { createR2CatalogClient, resolveCatalogBucketName } from "@/lib/storage/r2Catalog";
import {
  VerifiedSvgObjectStorageV2,
  type SvgStorageDriverV2,
} from "./svgDraftStorage";

export type R2SvgStorageDriver = SvgStorageDriverV2;

export class R2SvgReleaseStorage extends VerifiedSvgObjectStorageV2 {
  constructor(driver: R2SvgStorageDriver, bucket: string) {
    super(driver, "r2", bucket);
  }
}

export function createR2SvgReleaseStorage(bucket = resolveCatalogBucketName()): R2SvgReleaseStorage {
  const client = createR2CatalogClient();
  const driver: R2SvgStorageDriver = {
    async put(key, body, mimeType) {
      await client.send(new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentLength: body.byteLength,
        ContentType: mimeType,
      }));
    },
    async get(key) {
      try {
        const response = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
        if (!response.Body) return null;
        const body = await response.Body.transformToByteArray();
        return {
          body,
          mimeType: response.ContentType ?? "application/octet-stream",
          contentLength: response.ContentLength ?? body.byteLength,
        };
      } catch (error) {
        const status = error && typeof error === "object" && "$metadata" in error
          ? (error.$metadata as { httpStatusCode?: number }).httpStatusCode
          : undefined;
        if (status === 404) return null;
        throw error;
      }
    },
    async remove(key) {
      await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
    },
  };
  return new R2SvgReleaseStorage(driver, bucket);
}
