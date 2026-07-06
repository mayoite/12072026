/**
 * Phase 06 Upload Utilities
 *
 * Upload utilities for:
 * - Background/reference images for floor plans
 * - Sketches for AI conversion
 *
 * Handles file validation, preview generation, and storage.
 */

import type { Open3dBackgroundImage, Open3dPoint } from "../../model/types";
import { validateImageFile, DEFAULT_IMAGE_LIMITS, type ImageImportLimits, type ParsedImage, loadImageFile } from "../../lib/imageImport";

// ── Types ──

/** Upload result with URL and metadata */
export interface UploadResult {
  success: boolean;
  url?: string;
  dataUrl?: string;
  dimensions?: { width: number; height: number };
  preview?: string;
  error?: string;
}

/** Background image upload options */
export interface UploadBackgroundOptions {
  position?: Open3dPoint;
  scale?: number;
  opacity?: number;
  rotation?: number;
  locked?: boolean;
  limits?: ImageImportLimits;
  // For server-side uploads (if configured)
  uploadEndpoint?: string;
}

/** Sketch image upload options */
export interface UploadSketchOptions {
  // Optional AI processing endpoint
  processEndpoint?: string;
  // Preview size
  previewMaxWidth?: number;
  previewMaxHeight?: number;
  limits?: ImageImportLimits;
}

// ── Background Image Upload ──

/**
 * Upload a background/reference image.
 * Can use either client-side data URL or server-side upload.
 */
export async function uploadBackgroundImage(
  file: File,
  options: UploadBackgroundOptions = {},
): Promise<UploadResult> {
  // Validate file first
  const validation = validateImageFile(file, options.limits);
  if (!validation.valid) {
    return { success: false, error: validation.errors.join("; ") };
  }

  // Check if we have an upload endpoint
  if (options.uploadEndpoint) {
    return uploadToServer(file, options.uploadEndpoint);
  }

  // Client-side processing (data URL)
  const { image, error } = await loadImageFile(file, options.limits);
  if (!image) {
    return { success: false, error: error ?? "Failed to load image" };
  }

  // Generate preview
  const preview = await generatePreview(image.dataUrl, 400, 300);

  return {
    success: true,
    dataUrl: image.dataUrl,
    dimensions: { width: image.width, height: image.height },
    preview,
  };
}

/**
 * Upload to server endpoint.
 */
async function uploadToServer(file: File, endpoint: string): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Upload failed: ${response.status} ${response.statusText}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      url: data.url,
      dimensions: data.dimensions,
      preview: data.preview,
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Upload failed",
    };
  }
}

/**
 * Create a background image object from upload result.
 */
export function createBackgroundImageFromUpload(
  uploadResult: UploadResult,
  options: UploadBackgroundOptions = {},
): Open3dBackgroundImage | null {
  if (!uploadResult.success || !uploadResult.dataUrl) {
    return null;
  }

  return {
    dataUrl: uploadResult.dataUrl,
    position: options.position ?? { x: 0, y: 0 },
    scale: options.scale ?? 1,
    opacity: options.opacity ?? 1,
    rotation: options.rotation ?? 0,
    locked: options.locked ?? false,
  };
}

/**
 * Full workflow: upload and create background image.
 */
export async function uploadAndCreateBackground(
  file: File,
  options: UploadBackgroundOptions = {},
): Promise<{ backgroundImage: Open3dBackgroundImage | null; error: string | null }> {
  const result = await uploadBackgroundImage(file, options);

  if (!result.success) {
    return { backgroundImage: null, error: result.error ?? "Upload failed" };
  }

  const backgroundImage = createBackgroundImageFromUpload(result, options);
  return { backgroundImage, error: null };
}

// ── Sketch Image Upload ──

/**
 * Upload a sketch image for AI conversion.
 * Generates preview and optionally sends to AI processing endpoint.
 */
export async function uploadSketchImage(
  file: File,
  options: UploadSketchOptions = {},
): Promise<UploadResult> {
  // Validate file - sketches can be larger
  const limits = options.limits ?? {
    ...DEFAULT_IMAGE_LIMITS,
    maxFileSizeBytes: 20 * 1024 * 1024, // 20MB for sketches
  };

  const validation = validateImageFile(file, limits);
  if (!validation.valid) {
    return { success: false, error: validation.errors.join("; ") };
  }

  // Load image
  const { image, error } = await loadImageFile(file, limits);
  if (!image) {
    return { success: false, error: error ?? "Failed to load image" };
  }

  // Generate preview
  const previewMaxW = options.previewMaxWidth ?? 600;
  const previewMaxH = options.previewMaxHeight ?? 600;
  const preview = await generatePreview(image.dataUrl, previewMaxW, previewMaxH);

  // Check for AI processing endpoint
  if (options.processEndpoint) {
    return processSketchWithAI(file, options.processEndpoint, preview);
  }

  return {
    success: true,
    dataUrl: image.dataUrl,
    dimensions: { width: image.width, height: image.height },
    preview,
  };
}

/**
 * Process sketch with AI endpoint.
 */
async function processSketchWithAI(
  file: File,
  endpoint: string,
  preview: string,
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("sketch", file);
  formData.append("type", "floorplan-sketch");

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      // Still return success with preview if AI processing fails
      return {
        success: true,
        dataUrl: preview,
        preview,
        error: `AI processing failed: ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      url: data.resultUrl ?? data.floorplanUrl,
      dataUrl: preview,
      dimensions: data.dimensions,
      preview,
    };
  } catch (e) {
    // Return success with local preview if processing fails
    return {
      success: true,
      dataUrl: preview,
      preview,
      error: e instanceof Error ? e.message : "AI processing failed",
    };
  }
}

// ── Preview Generation ──

/**
 * Generate a preview thumbnail from an image data URL.
 */
export async function generatePreview(
  dataUrl: string,
  maxWidth: number,
  maxHeight: number,
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      // Calculate aspect-preserving dimensions
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      // Create canvas for resizing
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      // Enable image smoothing for quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };

    img.onerror = () => {
      resolve(dataUrl);
    };

    img.src = dataUrl;
  });
}

// ── Upload Progress ─-

/** Upload progress callback type */
export type UploadProgressCallback = (progress: number) => void;

/**
 * Upload with progress tracking.
 * For use with server-side uploads that support progress.
 */
export async function uploadWithProgress(
  file: File,
  endpoint: string,
  onProgress?: UploadProgressCallback,
): Promise<UploadResult> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        const progress = (e.loaded / e.total) * 100;
        onProgress(progress);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve({
            success: true,
            url: data.url,
            dimensions: data.dimensions,
          });
        } catch {
          resolve({ success: false, error: "Invalid response" });
        }
      } else {
        resolve({
          success: false,
          error: `Upload failed: ${xhr.status}`,
        });
      }
    };

    xhr.onerror = () => {
      resolve({ success: false, error: "Network error" });
    };

    const formData = new FormData();
    formData.append("file", file);

    xhr.open("POST", endpoint);
    xhr.send(formData);
  });
}

// ── Utility Functions ─-

/**
 * Validate that an uploaded image meets requirements.
 */
export function validateUpload(
  file: File,
  options: {
    maxFileSizeBytes?: number;
    allowedTypes?: string[];
    maxWidthPx?: number;
    maxHeightPx?: number;
  } = {},
): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check file type
  const allowedTypes = options.allowedTypes ?? ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} not allowed`);
  }

  // Check file size
  if (options.maxFileSizeBytes && file.size > options.maxFileSizeBytes) {
    errors.push(
      `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB (max ${options.maxFileSizeBytes / 1024 / 1024}MB)`,
    );
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Get human-readable file size.
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

/**
 * Clean up object URLs to prevent memory leaks.
 */
export function revokeObjectUrl(url: string): void {
  if (url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}