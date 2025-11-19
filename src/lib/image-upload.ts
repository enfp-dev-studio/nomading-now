/**
 * Image upload utilities for S3-compatible storage with thumbnail generation
 * Supports AWS S3 and Cloudflare R2
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';

// S3 Configuration from environment variables
const S3_CONFIG = {
  endpoint: import.meta.env.VITE_S3_ENDPOINT, // For Cloudflare R2 or custom S3
  region: import.meta.env.VITE_S3_REGION || 'auto',
  credentials: {
    accessKeyId: import.meta.env.VITE_S3_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_S3_SECRET_ACCESS_KEY || '',
  },
};

const S3_BUCKET = import.meta.env.VITE_S3_BUCKET || '';
const S3_PUBLIC_URL = import.meta.env.VITE_S3_PUBLIC_URL || '';

// Initialize S3 client
const s3Client = new S3Client({
  endpoint: S3_CONFIG.endpoint,
  region: S3_CONFIG.region,
  credentials: S3_CONFIG.credentials,
});

export interface ImageUploadResult {
  originalUrl: string;
  thumbnailUrl: string;
  originalSize: number;
  thumbnailSize: number;
}

export interface UploadProgress {
  phase: 'processing' | 'uploading' | 'complete';
  percent: number;
}

/**
 * Generate a unique filename with timestamp
 */
function generateFilename(originalName: string, suffix: string = ''): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const ext = originalName.split('.').pop() || 'jpg';
  const parts = originalName.split('.');
  const baseName = (parts[0] || 'image').replace(/[^a-zA-Z0-9]/g, '-');
  return `${baseName}-${timestamp}-${randomStr}${suffix}.${ext}`;
}

/**
 * Process image: resize and optimize
 * @param file Original image file
 * @param maxWidth Maximum width in pixels
 * @param quality JPEG quality (1-100)
 * @returns Processed image buffer and size
 */
async function processImage(
  file: File,
  maxWidth: number,
  quality: number
): Promise<{ buffer: Buffer; size: number }> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const processed = await sharp(buffer)
    .resize(maxWidth, null, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality, mozjpeg: true })
    .toBuffer();

  return {
    buffer: processed,
    size: processed.length,
  };
}

/**
 * Upload buffer to S3
 */
async function uploadToS3(
  buffer: Buffer,
  filename: string,
  contentType: string = 'image/jpeg'
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: filename,
    Body: buffer,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000', // 1 year cache
  });

  await s3Client.send(command);

  // Return public URL
  return `${S3_PUBLIC_URL}/${filename}`;
}

/**
 * Upload image with thumbnail generation
 * @param file Image file from input
 * @param onProgress Progress callback
 * @returns URLs and sizes for original and thumbnail
 */
export async function uploadImageWithThumbnail(
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<ImageUploadResult> {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  // Validate file size (max 10MB)
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Image size must be less than 10MB');
  }

  try {
    // Step 1: Process thumbnail (640px, 80% quality)
    onProgress?.({ phase: 'processing', percent: 10 });
    const thumbnail = await processImage(file, 640, 80);

    // Step 2: Process original (1920px, 85% quality)
    onProgress?.({ phase: 'processing', percent: 30 });
    const original = await processImage(file, 1920, 85);

    // Step 3: Upload thumbnail
    onProgress?.({ phase: 'uploading', percent: 50 });
    const thumbnailFilename = generateFilename(file.name, '-thumb');
    const thumbnailUrl = await uploadToS3(thumbnail.buffer, thumbnailFilename);

    // Step 4: Upload original
    onProgress?.({ phase: 'uploading', percent: 75 });
    const originalFilename = generateFilename(file.name);
    const originalUrl = await uploadToS3(original.buffer, originalFilename);

    // Complete
    onProgress?.({ phase: 'complete', percent: 100 });

    return {
      originalUrl,
      thumbnailUrl,
      originalSize: original.size,
      thumbnailSize: thumbnail.size,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image. Please try again.');
  }
}

/**
 * Upload multiple images with progress tracking
 * @param files Array of image files
 * @param onProgress Progress callback for each file
 * @returns Array of upload results
 */
export async function uploadMultipleImages(
  files: File[],
  onProgress?: (fileIndex: number, progress: UploadProgress) => void
): Promise<ImageUploadResult[]> {
  const results: ImageUploadResult[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file) continue;

    const result = await uploadImageWithThumbnail(file, (progress) => {
      onProgress?.(i, progress);
    });
    results.push(result);
  }

  return results;
}

/**
 * Validate S3 configuration
 * @returns true if S3 is configured
 */
export function isS3Configured(): boolean {
  return !!(
    S3_CONFIG.endpoint &&
    S3_CONFIG.credentials.accessKeyId &&
    S3_CONFIG.credentials.secretAccessKey &&
    S3_BUCKET &&
    S3_PUBLIC_URL
  );
}
