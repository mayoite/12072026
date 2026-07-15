/**
 * Unit tests for uploadAssetToSupabase.
 * Mocks @supabase/supabase-js; no network.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { uploadMock, getPublicUrlMock, createClientMock } = vi.hoisted(() => {
  const uploadMock = vi.fn();
  const getPublicUrlMock = vi.fn();
  const createClientMock = vi.fn(() => ({
    storage: {
      from: () => ({
        upload: uploadMock,
        getPublicUrl: getPublicUrlMock,
      }),
    },
  }));
  return { uploadMock, getPublicUrlMock, createClientMock };
});

vi.mock("@supabase/supabase-js", () => ({
  createClient: createClientMock,
}));

describe("uploadAssetToSupabase", () => {
  const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const originalKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  beforeEach(() => {
    vi.resetModules();
    uploadMock.mockReset();
    getPublicUrlMock.mockReset();
    createClientMock.mockClear();
  });

  afterEach(() => {
    if (originalUrl === undefined) {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    } else {
      process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
    }
    if (originalKey === undefined) {
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    } else {
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalKey;
    }
  });

  it("returns null when Supabase credentials are missing", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    const { uploadAssetToSupabase } = await import(
      "@/features/admin/svg-editor/publish/uploadAsset"
    );
    const result = await uploadAssetToSupabase(new Blob(["x"]), "file.glb");
    expect(result).toBeNull();
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it("uploads to catalog-assets and returns the public URL", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";

    uploadMock.mockResolvedValue({
      data: { path: "generated/123-file.glb" },
      error: null,
    });
    getPublicUrlMock.mockReturnValue({
      data: { publicUrl: "https://example.supabase.co/storage/v1/object/public/catalog-assets/generated/123-file.glb" },
    });

    const { uploadAssetToSupabase } = await import(
      "@/features/admin/svg-editor/publish/uploadAsset"
    );
    const blob = new Blob(["glb-bytes"], { type: "model/gltf-binary" });
    const result = await uploadAssetToSupabase(blob, "chair.glb");

    expect(result).toBe(
      "https://example.supabase.co/storage/v1/object/public/catalog-assets/generated/123-file.glb",
    );
    expect(uploadMock).toHaveBeenCalledTimes(1);
    const [path, file, options] = uploadMock.mock.calls[0] as [
      string,
      Blob,
      { cacheControl: string; upsert: boolean },
    ];
    expect(path).toMatch(/^generated\/\d+-chair\.glb$/);
    expect(file).toBe(blob);
    expect(options).toEqual({ cacheControl: "3600", upsert: false });
    expect(getPublicUrlMock).toHaveBeenCalledWith("generated/123-file.glb");
  });

  it("returns null when storage upload errors", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";

    uploadMock.mockResolvedValue({
      data: null,
      error: { message: "bucket missing" },
    });
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    const { uploadAssetToSupabase } = await import(
      "@/features/admin/svg-editor/publish/uploadAsset"
    );
    const result = await uploadAssetToSupabase(new Blob(["x"]), "a.svg");
    expect(result).toBeNull();
    expect(getPublicUrlMock).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
