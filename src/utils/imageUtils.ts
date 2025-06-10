// This file contains image processing utilities
import { imageCapabilities, calculateOptimalDimensions } from './imageCapabilities';

/**
 * Configuration options for image optimization
 */
export interface ImageOptimizationOptions {
  maxSize?: number;           // Maximum dimension in pixels
  quality?: number;           // JPEG quality (0-1)
  outputFormat?: 'jpeg' | 'png' | 'webp' | 'avif' | 'auto';  // Output format
  maxFileSizeKB?: number;     // Target file size in KB
  preserveTransparency?: boolean;  // Whether to preserve transparency (uses PNG if true)
  keepExif?: boolean;         // Whether to keep EXIF metadata
  sharpen?: boolean;          // Apply minimal sharpening
  grayscale?: boolean;        // Convert to grayscale
  progressive?: boolean;      // Create progressive JPEG
  targetFileSizeKB?: number;  // Target file size in KB (will adjust dimensions and quality)
}

/**
 * Compresses and resizes an image before uploading
 * 
 * @param file - The image file to process
 * @param options - Configuration options for the optimization
 * @returns A Promise that resolves to a File object
 */
export const optimizeImage = async (
  file: File, 
  maxSize: number | ImageOptimizationOptions = 800, 
  qualityOrOptions: number | ImageOptimizationOptions = 0.85
): Promise<File> => {
  // Handle different parameter formats
  let options: ImageOptimizationOptions = {};
  
  if (typeof maxSize === 'number' && typeof qualityOrOptions === 'number') {
    // Legacy parameter format
    options = {
      maxSize,
      quality: qualityOrOptions
    };
  } else if (typeof maxSize === 'object') {
    // New object parameter format
    options = maxSize;
  }
  
  // Set defaults
  const {
    maxSize: size = 800,
    quality = 0.85,
    outputFormat = 'jpeg',
    preserveTransparency = false,
    sharpen = false,
    grayscale = false,
    maxFileSizeKB
  } = options;

  // Helper to get the output format (sync or async)
  const getFormat = async () => {
    if (preserveTransparency) return 'png';
    if (outputFormat === 'auto') {
      return await imageCapabilities.getOptimalFormat();
    }
    return outputFormat as 'webp' | 'avif' | 'jpeg' | 'png';
  };

  // Create image object for dimensions
  const img = new Image();
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = async function(e) {
      img.src = e.target?.result as string;
      img.onload = async function() {
        // Use the calculateOptimalDimensions helper
        const format = await getFormat();
        const { width, height } = calculateOptimalDimensions(
          img.width,
          img.height,
          {
            maxSize: size,
            targetFileSizeKB: maxFileSizeKB,
            format,
            quality
          }
        );
        // Create canvas and resize image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { 
          alpha: preserveTransparency 
        });
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        // Apply grayscale filter if requested
        if (grayscale) {
          ctx.filter = 'grayscale(100%)';
        }
        // Apply sharpening if requested
        if (sharpen) {
          ctx.filter = ctx.filter ? `${ctx.filter} contrast(1.1)` : 'contrast(1.1)';
        }
        // Fill white background if not preserving transparency
        if (!preserveTransparency) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
        }
        // Draw image on canvas with new dimensions
        ctx.drawImage(img, 0, 0, width, height);
        // Determine the output format
        let outputMimeType = 'image/jpeg';
        let actualFormat: 'jpeg' | 'png' | 'webp' | 'avif' = 'jpeg';
        if (preserveTransparency) {
          outputMimeType = 'image/png';
          actualFormat = 'png';
        } else if (outputFormat === 'auto') {
          const optimal = await imageCapabilities.getOptimalFormat();
          switch (optimal) {
            case 'webp':
              outputMimeType = 'image/webp';
              actualFormat = 'webp';
              break;
            case 'avif':
              outputMimeType = 'image/avif';
              actualFormat = 'avif';
              break;
            default:
              outputMimeType = 'image/jpeg';
              actualFormat = 'jpeg';
          }
        } else if (outputFormat === 'webp' && await imageCapabilities.supportsWebP()) {
          outputMimeType = 'image/webp';
          actualFormat = 'webp';
        } else if (outputFormat === 'avif' && await imageCapabilities.supportsAVIF()) {
          outputMimeType = 'image/avif';
          actualFormat = 'avif';
        } else if (outputFormat === 'png') {
          outputMimeType = 'image/png';
          actualFormat = 'png';
        }
        // Adjust quality based on format if not explicitly specified
        const finalQuality = quality || imageCapabilities.getRecommendedQuality(actualFormat);
        // Convert to blob with specified quality
        canvas.toBlob(
          async blob => {
            if (!blob) {
              reject(new Error('Canvas to Blob conversion failed'));
              return;
            }
            // If maxFileSizeKB is specified and the blob is too large,
            // try again with a reduced quality
            if (maxFileSizeKB && blob.size > maxFileSizeKB * 1024 && quality > 0.4) {
              // Reduce quality proportionally to the size difference
              const newQuality = Math.max(0.4, quality * 0.8 * (maxFileSizeKB * 1024 / blob.size));
              console.log(`Retrying with lower quality: ${newQuality.toFixed(2)}`);
              // Try again with lower quality
              resolve(await optimizeImage(file, { ...options, quality: newQuality }));
              return;
            }
            // Create new file from blob
            const fileExtension = getFileExtension(outputMimeType);
            const fileName = file.name.replace(/\.[^/.]+$/, '') + fileExtension;
            const optimizedFile = new File(
              [blob], 
              fileName, 
              { 
                type: outputMimeType, 
                lastModified: Date.now() 
              }
            );
            resolve(optimizedFile);
          },
          outputMimeType, 
          outputMimeType === 'image/jpeg' || outputMimeType === 'image/webp' || outputMimeType === 'image/avif' ? finalQuality : undefined
        );
      };
      img.onerror = () => {
        reject(new Error('Error loading image'));
      };
    };
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    reader.readAsDataURL(file);
  });
};

// Use imageCapabilities directly for format support

/**
 * Get file extension from MIME type
 */
const getFileExtension = (mimeType: string): string => {
  switch (mimeType) {
    case 'image/jpeg':
      return '.jpg';
    case 'image/png':
      return '.png';
    case 'image/webp':
      return '.webp';
    default:
      return '.jpg';
  }
};
