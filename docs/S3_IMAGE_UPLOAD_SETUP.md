# S3 Image Upload Setup Guide

## Overview

Nomading Now uses S3-compatible storage for image uploads with automatic thumbnail generation. This supports both **AWS S3** and **Cloudflare R2** (recommended for cost-effectiveness).

## Features

- **Automatic thumbnail generation**: 640px width, JPEG 80% quality (~50-100KB)
- **Original image optimization**: 1920px width, JPEG 85% quality (~200-500KB)
- **Upload progress tracking**: Real-time feedback during upload
- **File validation**: Type checking, size limits (10MB max)
- **Image limits**: Maximum 3 images per tip
- **Memory-efficient**: Uses blob URLs for preview, proper cleanup

## Implementation Details

### Files Added/Modified

1. **src/lib/image-upload.ts** (NEW)
   - S3 client configuration
   - Image processing with Sharp
   - Upload functions with progress tracking
   - Configuration validation

2. **src/components/tips/CreateTipModal.tsx** (MODIFIED)
   - File input instead of URL input
   - Upload progress UI
   - Preview management
   - Memory cleanup (URL.revokeObjectURL)

3. **.env.example** (NEW)
   - Environment variable documentation

### Architecture

```
User selects image
    ↓
File validation (type, size)
    ↓
Create preview (blob URL)
    ↓
Process with Sharp
    ├─ Thumbnail: resize to 640px, JPEG 80%
    └─ Original: resize to 1920px, JPEG 85%
    ↓
Upload to S3
    ├─ Thumbnail: {filename}-thumb.jpg
    └─ Original: {filename}.jpg
    ↓
Store URLs in database (thumbnail for feed)
    ↓
Clean up preview blob URL
```

## Setup Instructions

### Option 1: Cloudflare R2 (Recommended)

**Why R2?** No egress fees, S3-compatible API, generous free tier (10GB storage, 10M reads/month)

#### Step 1: Create R2 Bucket

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → R2
2. Create a new bucket (e.g., `nomading-now-images`)
3. Enable public access (Settings → Public Access → Allow)
4. Copy the bucket's public URL

#### Step 2: Generate API Credentials

1. R2 → Manage R2 API Tokens
2. Create API token with:
   - Permissions: Object Read & Write
   - Bucket: Select your bucket
3. Copy:
   - Access Key ID
   - Secret Access Key
   - Endpoint URL (e.g., `https://abc123.r2.cloudflarestorage.com`)

#### Step 3: Configure Environment

Create `.env` file (based on `.env.example`):

```env
# Cloudflare R2 Configuration
VITE_S3_ENDPOINT=https://abc123.r2.cloudflarestorage.com
VITE_S3_REGION=auto
VITE_S3_ACCESS_KEY_ID=your_access_key_here
VITE_S3_SECRET_ACCESS_KEY=your_secret_key_here
VITE_S3_BUCKET=nomading-now-images
VITE_S3_PUBLIC_URL=https://pub-xyz.r2.dev  # or custom domain
```

#### Step 4: Test Upload

```bash
npm run dev
# Navigate to map, create a tip, upload an image
```

---

### Option 2: AWS S3

#### Step 1: Create S3 Bucket

1. AWS Console → S3 → Create bucket
2. Bucket name: `nomading-now-images`
3. Region: Choose closest to your users (e.g., `us-east-1`)
4. Disable "Block all public access" (we need public reads)
5. Enable versioning (optional, for safety)

#### Step 2: Configure Bucket Policy

Add public read policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::nomading-now-images/*"
    }
  ]
}
```

#### Step 3: Create IAM User

1. IAM → Users → Create user
2. Attach policy:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::nomading-now-images/*"
    }
  ]
}
```
3. Create access key → Copy credentials

#### Step 4: Configure Environment

```env
# AWS S3 Configuration
VITE_S3_ENDPOINT=  # Leave empty for AWS
VITE_S3_REGION=us-east-1
VITE_S3_ACCESS_KEY_ID=AKIA...
VITE_S3_SECRET_ACCESS_KEY=...
VITE_S3_BUCKET=nomading-now-images
VITE_S3_PUBLIC_URL=https://nomading-now-images.s3.us-east-1.amazonaws.com
```

---

## Usage

### In CreateTipModal

```typescript
// User clicks "Upload Image" button
handleAddImageClick()
    ↓
// File input triggered
<input type="file" accept="image/*" multiple />
    ↓
// Process and upload
handleFileSelect()
    ↓
// Upload with progress
uploadImageWithThumbnail(file, onProgress)
    ↓
// Store result
uploadedImages.push({
  originalUrl,
  thumbnailUrl,
  preview
})
```

### Progress Tracking

The upload process reports progress through 3 phases:

1. **Processing** (10-30%): Resizing images with Sharp
2. **Uploading** (50-75%): Uploading to S3
3. **Complete** (100%): Upload finished

### Memory Management

Preview URLs are created using `URL.createObjectURL()` and must be cleaned up:

```typescript
// Create preview
const preview = URL.createObjectURL(file);

// Clean up when done
URL.revokeObjectURL(preview);
```

This is handled automatically in:
- `removeImage()` - When user removes an image
- `handleSubmit()` - After successful tip creation
- `handleClose()` - When modal is closed

---

## Image Processing Specifications

### Thumbnail
- **Width**: 640px (maintains aspect ratio)
- **Format**: JPEG
- **Quality**: 80%
- **Target size**: 50-100KB
- **Use case**: Feed display, previews

### Original
- **Width**: 1920px (maintains aspect ratio)
- **Format**: JPEG
- **Quality**: 85%
- **Target size**: 200-500KB
- **Use case**: Full-size view, downloads

### Processing Features
- **Resize strategy**: `fit: 'inside'` - Scales down only, never upscales
- **Optimization**: MozJPEG encoder for better compression
- **Metadata**: EXIF data removed (privacy, size reduction)

---

## Validation

### File Type
```typescript
if (!file.type.startsWith('image/')) {
  throw new Error('File must be an image');
}
```

### File Size
```typescript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
if (file.size > MAX_FILE_SIZE) {
  throw new Error('Image size must be less than 10MB');
}
```

### Image Count
```typescript
if (uploadedImages.length >= 3) {
  toast.error('Maximum 3 images allowed');
}
```

---

## Error Handling

### S3 Not Configured

If environment variables are missing, users see a warning:

```
⚠️ Image upload requires S3 configuration.
Please set VITE_S3_* environment variables.
```

Check configuration:
```typescript
import { isS3Configured } from '@/lib/image-upload';

if (!isS3Configured()) {
  console.error('S3 not configured');
}
```

### Upload Failures

Handled gracefully with user feedback:

```typescript
try {
  const result = await uploadImageWithThumbnail(file);
  toast.success('Image uploaded successfully');
} catch (error) {
  toast.error(error.message || 'Failed to upload image');
  URL.revokeObjectURL(preview); // Clean up
}
```

---

## Cost Estimation

### Cloudflare R2 (Free Tier)
- **Storage**: 10GB free
- **Operations**: 10M Class A, 10M Class B free/month
- **Egress**: No charges! 🎉
- **Estimated cost for 1000 users**: $0/month (within free tier)

### AWS S3 (us-east-1)
- **Storage**: $0.023/GB/month
- **PUT requests**: $0.005 per 1,000 requests
- **GET requests**: $0.0004 per 1,000 requests
- **Egress**: $0.09/GB (first 10TB)
- **Estimated cost for 1000 users**: ~$5-10/month

**Recommendation**: Use Cloudflare R2 for better economics.

---

## Troubleshooting

### Images not uploading

1. **Check environment variables**
   ```bash
   echo $VITE_S3_ENDPOINT
   echo $VITE_S3_BUCKET
   ```

2. **Verify S3 permissions**
   - Bucket allows PutObject
   - Bucket has public read access

3. **Check browser console**
   - CORS errors? Add CORS policy to bucket
   - Network errors? Check credentials

### CORS Issues

Add CORS policy to S3/R2 bucket:

```json
[
  {
    "AllowedOrigins": ["http://localhost:5173", "https://your-domain.com"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3000
  }
]
```

### Sharp build errors

If Sharp fails to install (native dependency):

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Future Enhancements

### Phase 2 (Not in current implementation)
- [ ] Photo EXIF GPS extraction (excluded from Phase 1)
- [ ] Support for more formats (PNG, WebP)
- [ ] Image cropping/editing UI
- [ ] CDN integration for faster delivery
- [ ] Lazy loading for images
- [ ] Blurhash placeholders

### Monitoring
- [ ] Upload success/failure metrics
- [ ] Storage usage tracking
- [ ] Cost monitoring dashboard

---

## Dependencies

```json
{
  "@aws-sdk/client-s3": "^3.x.x",  // S3 client
  "sharp": "^0.x.x"                 // Image processing
}
```

---

## Security Considerations

1. **Client-side validation**: File type and size checked before upload
2. **Server-side needed**: Add backend validation for production
3. **EXIF removal**: Sharp automatically strips metadata (privacy)
4. **Content moderation**: Consider adding image moderation API
5. **Rate limiting**: Implement upload limits per user/IP
6. **Virus scanning**: Consider ClamAV or similar for production

---

## Related Documentation

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [Sharp Documentation](https://sharp.pixelplumbing.com/)

---

**Last Updated**: 2025-11-19
**Phase**: Phase 1 - MVP Implementation
