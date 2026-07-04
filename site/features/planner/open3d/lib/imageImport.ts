export const SUPPORTED_IMAGE_TYPES: string[] = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export interface ImageImportLimits {
  maxFileSizeBytes: number;
  maxWidthPx: number;
  maxHeightPx: number;
}

export const DEFAULT_IMAGE_LIMITS: ImageImportLimits = {
  maxFileSizeBytes: 10 * 1024 * 1024, // 10MB default
  maxWidthPx: 4096,
  maxHeightPx: 4096,
};

export interface ImageValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ParsedImage {
  dataUrl: string;
  width: number;
  height: number;
  mimeType: string;
  fileName: string;
  fileSize: number;
}

export interface BackgroundImage {
  dataUrl: string;
  width: number;
  height: number;
  position: { x: number; y: number };
  scale: number;
  opacity: number;
  rotation: number;
  locked: boolean;
}

export function validateImageFile(
  file: File,
  limits: ImageImportLimits = DEFAULT_IMAGE_LIMITS,
): ImageValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
    errors.push(`Unsupported file type: ${file.type}`);
  }

  if (file.size > limits.maxFileSizeBytes) {
    errors.push(`File too large: ${file.size} bytes (max ${limits.maxFileSizeBytes})`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export async function loadImageFile(
  file: File,
  limits: ImageImportLimits = DEFAULT_IMAGE_LIMITS,
): Promise<{ image: ParsedImage | null; error: string | null }> {
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

      const img = new Image();
      img.onload = () => {
        if (img.width > limits.maxWidthPx || img.height > limits.maxHeightPx) {
          resolve({
            image: null,
            error: `Image dimensions too large: ${img.width}x${img.height}`,
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

export function createBackgroundImage(options: {
  image: ParsedImage;
  position?: { x: number; y: number };
  scale?: number;
  opacity?: number;
  rotation?: number;
  locked?: boolean;
}): BackgroundImage {
  return {
    dataUrl: options.image.dataUrl,
    width: options.image.width,
    height: options.image.height,
    position: options.position || { x: 0, y: 0 },
    scale: options.scale ?? 1,
    opacity: options.opacity ?? 1,
    rotation: options.rotation ?? 0,
    locked: options.locked ?? false,
  };
}

export async function importImageAsBackground(
  file: File,
  limits?: ImageImportLimits,
): Promise<{ backgroundImage: BackgroundImage | null; error: string | null }> {
  const loadResult = await loadImageFile(file, limits);
  if (loadResult.error || !loadResult.image) {
    return { backgroundImage: null, error: loadResult.error || "Failed to load image" };
  }

  const bg = createBackgroundImage({ image: loadResult.image });
  return { backgroundImage: bg, error: null };
}
