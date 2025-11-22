/**
 * Image Generation Service - Handles AI image generation using OpenAI DALL-E 2
 * Provides two specialized endpoints:
 * - Background images: 1024x1024 (DALL-E 2 max resolution)
 * - Profile images: 256x256 (perfect for user profiles)
 */

export interface GeneratedImage {
  url?: string;
  b64_json?: string;
  size?: string;
  type?: string;
}

/**
 * Converts base64 image data to a File object
 * @param base64Data - Base64 encoded image string
 * @param filename - Desired filename for the image
 * @returns File object ready for upload
 */
export const base64ToFile = (base64Data: string, filename: string = 'generated-image.png'): File => {
  // Remove data URL prefix if present
  const base64String = base64Data.replace(/^data:image\/\w+;base64,/, '');

  // Convert base64 to bytes
  const byteCharacters = atob(base64String);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'image/png' });

  return new File([blob], filename, { type: 'image/png' });
};

/**
 * Generates a gradient color based on a seed string
 * @param seed - String to generate consistent colors from
 * @returns Object with two hex colors for gradient
 */
const generateGradientColors = (seed: string): { color1: string; color2: string } => {
  // Create a simple hash from the seed string
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Generate vibrant colors
  const hue1 = Math.abs(hash % 360);
  const hue2 = (hue1 + 60 + Math.abs(hash % 120)) % 360; // Complementary hue

  const saturation = 70 + (Math.abs(hash % 30)); // 70-100%
  const lightness = 50 + (Math.abs(hash % 20)); // 50-70%

  // Convert HSL to hex
  const hslToHex = (h: number, s: number, l: number): string => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  return {
    color1: hslToHex(hue1, saturation, lightness),
    color2: hslToHex(hue2, saturation, lightness),
  };
};

/**
 * Generates a 1200x400 gradient background image from a description
 * Creates cool gradient patterns based on the description text
 * Optimized size for faster generation and upload
 * @param description - Text description to seed the gradient
 * @returns Generated background image data (1200x400) as base64
 * @throws Error if generation fails
 */
export const generateBackgroundImage = async (description: string): Promise<GeneratedImage> => {
  if (!description || description.trim().length === 0) {
    throw new Error('Description is required for background image generation');
  }

  try {
    const { color1, color2 } = generateGradientColors(description);

    // Create canvas with optimized size
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    // Determine gradient type based on description hash
    const hash = description.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const gradientType = hash % 4;

    let gradient;

    switch (gradientType) {
      case 0: // Linear diagonal
        gradient = ctx.createLinearGradient(0, 0, 1200, 400);
        break;
      case 1: // Linear horizontal
        gradient = ctx.createLinearGradient(0, 0, 1200, 0);
        break;
      case 2: // Radial from center
        gradient = ctx.createRadialGradient(600, 200, 0, 600, 200, 480);
        break;
      case 3: // Radial from corner
        gradient = ctx.createRadialGradient(0, 0, 0, 600, 200, 720);
        break;
      default:
        gradient = ctx.createLinearGradient(0, 0, 1200, 400);
    }

    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 400);

    // Add some visual interest with shapes (optimized)
    const shapeCount = 2 + (hash % 3); // Reduced from 3-8 to 2-5 shapes
    for (let i = 0; i < shapeCount; i++) {
      const shapeHash = hash + i * 1000;
      const x = (shapeHash * 13) % 1200;
      const y = (shapeHash * 17) % 400;
      const size = 60 + ((shapeHash * 7) % 150); // Smaller shapes
      const opacity = 0.1 + ((shapeHash % 20) / 100);

      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.beginPath();

      if (i % 2 === 0) {
        // Circle
        ctx.arc(x, y, size, 0, Math.PI * 2);
      } else {
        // Square
        ctx.rect(x - size / 2, y - size / 2, size, size);
      }

      ctx.fill();
    }

    // Convert to base64
    const base64 = canvas.toDataURL('image/png').split(',')[1];

    return {
      b64_json: base64,
      size: '1200x400',
      type: 'gradient',
    };
  } catch (error) {
    console.error('Background image generation error:', error);
    throw error instanceof Error ? error : new Error('Unknown error during background generation');
  }
};

/**
 * Generates a 256x256 profile image from a description (DALL-E 2 small size)
 * Perfect size for user profile pictures
 * @param description - Text description of the profile picture
 * @returns Generated profile image data (256x256)
 * @throws Error if generation fails
 */
export const generateProfileImage = async (description: string): Promise<GeneratedImage> => {
  if (!description || description.trim().length === 0) {
    throw new Error('Description is required for profile image generation');
  }

  try {
    const response = await fetch('/api/generate-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description: description.trim() }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate profile image');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Profile image generation error:', error);
    throw error instanceof Error ? error : new Error('Unknown error during profile generation');
  }
};

/**
 * Generates a background image and uploads it to S3
 * @param description - Text description of the background scene
 * @returns S3 key of the uploaded background image
 * @throws Error if generation or upload fails
 */
export const generateAndUploadBackground = async (description: string): Promise<string> => {
  const { uploadPictureToS3 } = await import('./s3');

  const imageData = await generateBackgroundImage(description);

  if (!imageData.b64_json) {
    throw new Error('No image data received');
  }

  const imageFile = base64ToFile(imageData.b64_json, `background_${Date.now()}.png`);
  const s3Key = await uploadPictureToS3(imageFile);

  return s3Key;
};

/**
 * Generates a profile image and uploads it to S3
 * @param description - Text description of the profile picture
 * @returns S3 key of the uploaded profile image
 * @throws Error if generation or upload fails
 */
export const generateAndUploadProfile = async (description: string): Promise<string> => {
  const { uploadPictureToS3 } = await import('./s3');

  const imageData = await generateProfileImage(description);

  if (!imageData.b64_json) {
    throw new Error('No image data received');
  }

  const imageFile = base64ToFile(imageData.b64_json, `profile_${Date.now()}.png`);
  const s3Key = await uploadPictureToS3(imageFile);

  return s3Key;
};
