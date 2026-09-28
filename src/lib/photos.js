import {
  uploadToCloudinary, isCloudinaryConfigured, isCloudinaryUrl, publicIdFromUrl
} from './cloudinary.js';

// ============================================================================
// PHOTOS — from the phone's camera roll to the customer's screen
//
// This is the file that fixes the original complaint: a photo added on the
// phone did not show up on the laptop.
//
//   Before  the picked file became a base64 data URL kept in that browser's
//           own storage. It existed on one device, and it had to be pasted
//           into a JSON file and redeployed before anyone else could see it.
//
//   Now     the file is resized in the browser, uploaded to Cloudinary, and
//           what gets saved on the plant is a short URL. Every device, every
//           visitor, immediately. The database row stays a few hundred bytes.
//
// WHY COMPRESS BEFORE UPLOADING, WHEN CLOUDINARY RESIZES ANYWAY
//
// Because the upload happens over the nursery's mobile data. A phone photo is
// 3–6 MB; this sends about 300 KB. Cloudinary would have produced the same
// delivered image either way — the saving is entirely on their side of the
// wire, which is the side that costs them money and patience.
// ============================================================================

const MAX_DIM = 1600;
const JPEG_QUALITY = 0.82;

/** The largest file we will even try to read. Guards against someone picking a
 *  60 MB RAW file and freezing an older phone mid-decode. */
const MAX_INPUT_BYTES = 30 * 1024 * 1024;

export const isDataUrl = s => typeof s === 'string' && s.startsWith('data:');
export const isRemotePhoto = isCloudinaryUrl;

/** Reads, resizes and re-encodes a picked file, resolving to a JPEG Blob.
 *  Entirely on the device — nothing has been sent anywhere yet. */
export function compressToBlob(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type?.startsWith('image/')) {
      reject(new Error('That file is not an image.'));
      return;
    }
    if (file.size > MAX_INPUT_BYTES) {
      reject(new Error('That image is very large. Please pick one under 30 MB.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read that file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('That image could not be opened.'));
      img.onload = () => {
        const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        // Product shots sit on white. Flattening onto white first stops a PNG
        // with a transparent background from turning black once it is a JPEG.
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);

        // toBlob is the memory-cheap path; toDataURL builds the entire base64
        // string in memory, which older phones dislike at this size.
        if (canvas.toBlob) {
          canvas.toBlob(
            blob => (blob ? resolve(blob) : reject(new Error('That image could not be processed.'))),
            'image/jpeg',
            JPEG_QUALITY
          );
        } else {
          try {
            resolve(dataUrlToBlob(canvas.toDataURL('image/jpeg', JPEG_QUALITY)));
          } catch {
            reject(new Error('That image could not be processed.'));
          }
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function dataUrlToBlob(dataUrl) {
  const [head, body] = dataUrl.split(',');
  const mime = head.match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bin = atob(body);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not encode that image.'));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(blob);
  });
}

const slug = s => String(s || '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 48);

/**
 * Compresses a picked file and stores it, returning the string to save on the
 * plant.
 *
 * With Cloudinary configured that string is a CDN URL and the photo is visible
 * everywhere at once.
 *
 * Without it — local development with no credentials — it falls back to a data
 * URL so the panel still works offline. That photo lives only in the browser
 * that added it, which is why the caller is told which of the two it got and
 * the admin panel marks it with a warning.
 *
 * @returns {Promise<{ src: string, remote: boolean, bytes: number }>}
 */
export async function uploadPhoto(file, { folder = '' } = {}) {
  const blob = await compressToBlob(file);

  if (!isCloudinaryConfigured) {
    return { src: await blobToDataUrl(blob), remote: false, bytes: blob.size };
  }

  try {
    const { url, bytes } = await uploadToCloudinary(blob, {
      folder: slug(folder),
      filename: slug(folder) || 'photo'
    });
    return { src: url, remote: true, bytes: bytes ?? blob.size };
  } catch (err) {
    // Do not lose the photo over a failed upload. The compressed image comes
    // back attached to the error, so the editor can keep it in the browser and
    // the nursery can retry rather than going and finding the file again.
    err.fallback = await blobToDataUrl(blob);
    throw err;
  }
}

/**
 * Called when a photo is removed in the admin panel.
 *
 * Deleting from Cloudinary requires an API secret, which cannot live in a
 * browser bundle — so this unlinks the photo from the plant and leaves the
 * file in the media library. That is the right trade-off: an unused image
 * costs a few kilobytes of a free-tier quota, whereas shipping a secret that
 * lets anyone delete the entire catalogue's photography costs rather more.
 *
 * Housekeeping, when it is wanted, is a minute in the Cloudinary media library
 * — the folder view makes orphans obvious. SETUP.md explains it.
 */
export function orphanedPhotoId(src) {
  return publicIdFromUrl(src);
}
