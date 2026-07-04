import type { Open3dBackgroundImage, Open3dPoint } from "../model/types";

/**
 * Supported image types for background/reference images.
 */
export const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/**
 * Import limits for images.
 */
export interface ImageImportLimits {
  /** Maximum file size in bytes (default 10MB) */
  maxFileSizeBytes: number;
  /** Maximum image width in pixels */
  maxWidthPx: number;
  /** Maximum image height in pixels */
  maxHeightPx: number;
}

/**
 * Default import limits.
 */
export const DEFAULT_IMAGE_LIMITS: ImageImportLimits = {
  maxFileSizeBytes: 10 * 1024 * 1024, // 10MB
  maxWidthPx: 8000,
  maxHeightPx: 8000,
};

/**
 * Validation result for image import.
 */
export interface ImageValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Parsed image data ready for import.
 */
export interface ParsedImage {
  dataUrl: string;
  width: number;
  height: number;
  mimeType: string;
  fileName: string;
  fileSize: number;
}

/**
 * Validates a File object for import.
 * @param file - The file to validate
 * @param limits - Optional custom limits
 * @returns Validation result
 */
export function validateImageFile(
  file: File,
  limits: ImageImportLimits = DEFAULT_IMAGE_LIMITS,
): ImageValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check file type
  if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
    errors.push(
      `Unsupported file type: ${file.type}. Supported types: ${SUPPORTED_IMAGE_TYPES.join(", ")}`,
    );
  }

  // Check file size
  if (file.size > limits.maxFileSizeBytes) {
    errors.push(
      `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB (max ${limits.maxFileSizeBytes / 1024 / 1024}MB)`,
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Loads an image file and returns its data URL and dimensions.
 * @param file - The file to load
 * @param limits - Optional custom limits
 * @returns Parsed image or error
 */
export async function loadImageFile(
  file: File,
  limits: ImageImportLimits = DEFAULT_IMAGE_LIMITS,
): Promise<{ image: ParsedImage | null; error: string | null }> {
  // Validate first
  const validation = validateImageFile(file, limits);
  if (!validation.valid) {
    return { image: null, error: validation.errors.join("; ") };
  }

  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) {
        resolve({ image: null, error: "Failed to read file" });
        return;
      }

      // Get dimensions
      const img = new Image();
      img.onload = () => {
        // Check dimensions
        if (img.width > limits.maxWidthPx || img.height > limits.maxHeightPx) {
          resolve({
            image: null,
            error: `Image too large: ${img.width}x${img.height}px (max ${limits.maxWidthPx}x${limits.maxHeightPx}px)`,
          });
          return;
        }

        resolve({
          image: {
            dataUrl,
            width: img.width,
            height: img.height,
            mimeType: file.type,
            fileName: file.name,
            fileSize: file.size,
          },
          error: null,
        });
      };

      img.onerror = () => {
        resolve({ image: null, error: "Failed to load image" });
      };

      img.src = dataUrl;
    };

    reader.onerror = () => {
      resolve({ image: null, error: "Failed to read file" });
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Options for creating a background image from imported data.
 */
export interface CreateBackgroundImageOptions {
  /** The parsed image data */
  image: ParsedImage;
  /** Position on the canvas (default: center) */
  position?: Open3dPoint;
  /** Scale factor (default: 1) */
  scale?: number;
  /** Opacity (default: 1) */
  opacity?: number;
  /** Rotation in degrees (default: 0) */
  rotation?: number;
  /** Whether the image is locked (default: false) */
  locked?: boolean;
}

/**
 * Creates a background image from parsed image data.
 * @param options - Options for creating the background image
 * @returns The background image object
 */
export function createBackgroundImage(options: CreateBackgroundImageOptions): Open3dBackgroundImage {
  const { image, position = { x: 0, y: 0 }, scale = 1, opacity = 1, rotation = 0, locked = false } = options;

  return {
    dataUrl: image.dataUrl,
    position,
    scale,
    opacity,
    rotation,
    locked,
  };
}

/**
 * Imports an image file as a background image.
 * @param file - The file to import
 * @param options - Optional import options
 * @returns Result with background image or error
 */
export async function importImageAsBackground(
  file: File,
  options: {
    position?: Open3dPoint;
    scale?: number;
    opacity?: number;
    rotation?: number;
    locked?: boolean;
    limits?: ImageImportLimits;
  } = {},
): Promise<{ backgroundImage: Open3dBackgroundImage | null; error: string | null }> {
  const { image, error } = await loadImageFile(file, options.limits);

  if (!image) {
    return { backgroundImage: null, error };
  }

  const backgroundImage = createBackgroundImage({
    image,
    position: options.position,
    scale: options.scale,
    opacity: options.opacity,
    rotation: options.rotation,
    locked: options.locked,
  });

  return { backgroundImage, error: null };
}