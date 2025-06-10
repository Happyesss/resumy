/**
 * Utility for detecting supported image formats and browser capabilities
 */
export const imageCapabilities = {
  /**
   * Checks if the browser supports WebP format
   * @returns boolean indicating WebP support
   */
  supportsWebP: (): boolean => {
    try {
      const canvas = document.createElement('canvas');
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    } catch (e) {
      return false;
    }
  },

  /**
   * Checks if the browser supports AVIF format
   * @returns Promise resolving to boolean indicating AVIF support
   */
  supportsAVIF: async (): Promise<boolean> => {
    return new Promise((resolve) => {
      const avifImage = new Image();
      avifImage.src =
        "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAG1pZjFhdmlmAAACAGF2MDEAAAAAAABDbWV0YQAAACBtZGF0EgAKB/gABQAAAPo=";

      avifImage.onload = () => resolve(true);
      avifImage.onerror = () => resolve(false);
    });
  },

  /**
   * Get optimal image format based on browser support
   * @returns Promise resolving to string representing the optimal image format
   */
  getOptimalFormat: async (): Promise<'webp' | 'avif' | 'jpeg'> => {
    if (await imageCapabilities.supportsAVIF()) {
      return 'avif';
    } else if (imageCapabilities.supportsWebP()) {
      return 'webp';
    } else {
      return 'jpeg';
    }
  },

  /**
   * Get recommended image quality for different formats
   * @param format - The image format
   * @returns number representing the recommended quality (0-1)
   */
  getRecommendedQuality: (format: 'webp' | 'avif' | 'jpeg' | 'png'): number => {
    switch (format) {
      case 'webp':
        return 0.8;
      case 'avif':
        return 0.7;
      case 'jpeg':
        return 0.85;
      case 'png':
        return 1;
      default:
        return 0.85;
    }
  }
};

/**
 * Helper function to estimate file size after compression
 * @param width - Image width in pixels
 * @param height - Image height in pixels
 * @param format - Image format
 * @param quality - Compression quality
 * @returns Estimated file size in KB
 */
export const estimateImageSize = (
  width: number,
  height: number,
  format: 'webp' | 'avif' | 'jpeg' | 'png',
  quality: number
): number => {
  const pixels = width * height;
  let bpp: number;

  switch (format) {
    case 'webp':
      bpp = 0.5 + (quality * 1.5);
      break;
    case 'avif':
      bpp = 0.3 + (quality * 1.2);
      break;
    case 'jpeg':
      bpp = 1 + (quality * 7);
      break;
    case 'png':
      bpp = 8;
      break;
    default:
      bpp = 2;
  }

  const bytes = (pixels * bpp) / 8;
  return bytes / 1024;
};

/**
 * Calculate optimal dimensions for an image based on max size or target file size
 */
export const calculateOptimalDimensions = (
  originalWidth: number,
  originalHeight: number,
  options: {
    maxSize?: number;
    targetFileSizeKB?: number;
    format?: 'webp' | 'avif' | 'jpeg' | 'png';
    quality?: number;
  }
): { width: number; height: number } => {
  const {
    maxSize = 1200,
    targetFileSizeKB,
    format = 'jpeg',
    quality = 0.85
  } = options;

  let width = originalWidth;
  let height = originalHeight;

  if (maxSize && (width > maxSize || height > maxSize)) {
    if (width > height) {
      height = Math.round((height * maxSize) / width);
      width = maxSize;
    } else {
      width = Math.round((width * maxSize) / height);
      height = maxSize;
    }
  }

  if (targetFileSizeKB) {
    let estimatedSize = estimateImageSize(width, height, format, quality);

    if (estimatedSize > targetFileSizeKB) {
      const scaleFactor = Math.sqrt(targetFileSizeKB / estimatedSize);
      width = Math.floor(width * scaleFactor);
      height = Math.floor(height * scaleFactor);

      width = Math.max(width, 100);
      height = Math.max(height, 100);
    }
  }

  return { width, height };
};
