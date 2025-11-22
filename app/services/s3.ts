/**
 * S3 Service - Handles image uploads to AWS S3
 */

/**
 * Constructs the full S3 URL for a given S3 key
 * Uses the Next.js API route to serve S3 images
 * @param s3Key - S3 key like "pins/image/pin_123.png"
 * @returns Full URL to access the image, or undefined if no key
 */
export const getS3Url = (s3Key?: string): string | undefined => {
  if (!s3Key) return undefined;
  // If it's already a full URL, return it
  if (s3Key.startsWith('http')) return s3Key;
  // Use the Next.js API route to serve the image
  return `/api/s3?key=${encodeURIComponent(s3Key)}`;
};

/**
 * Compresses an image file and converts it to base64
 * @param file - The image file to compress
 * @param maxWidth - Maximum width (default: 800px)
 * @param maxHeight - Maximum height (default: 800px)
 * @param quality - JPEG quality 0-1 (default: 0.8)
 * @returns Compressed image as base64 string
 */
export const compressAndConvertImage = (
  file: File,
  maxWidth: number = 800,
  maxHeight: number = 800,
  quality: number = 0.8
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;

          if (width > height) {
            width = maxWidth;
            height = width / aspectRatio;
          } else {
            height = maxHeight;
            width = height * aspectRatio;
          }
        }

        // Create canvas and draw compressed image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Use better image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64 (use JPEG for better compression, PNG for transparency)
        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const base64 = canvas.toDataURL(mimeType, quality);

        resolve(base64);
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Converts a File object to a base64 string (without compression)
 * @deprecated Use compressAndConvertImage for better performance
 */
export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Uploads an image file to S3 and returns the S3 key
 * @param file - The image file to upload
 * @returns The S3 key (location/filename.ext)
 * @throws Error if upload fails
 */
export const uploadPictureToS3 = async (file: File): Promise<string> => {
  const base64 = await convertFileToBase64(file);
  const filename = `pin_${Date.now()}_${file.name}`;

  const response = await fetch('/api/s3', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filename,
      imageBase64: base64,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload image');
  }

  const result = await response.json();
  return result.s3Key; // Returns "location/filename.ext"
};
