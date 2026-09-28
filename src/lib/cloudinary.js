// ============================================================================
// CLOUDINARY — image hosting and delivery
//
// WHY A SEPARATE SERVICE FOR PHOTOS
//
// The database holds the words and the numbers. Photos are a different problem
// with a different answer: they are large, they are requested by every visitor,
// and they need to arrive at the right size for whatever screen asked for them.
// Cloudinary does three things a database cannot:
//
//   1. It serves from a CDN close to the visitor. A customer in Trichy gets the
//      photo from an Indian edge, not from a server in Singapore.
//   2. It resizes on the fly. One upload answers a 320px phone card and a
//      1400px desktop gallery from the same URL, by changing a few characters
//      in the path. Nothing has to be re-uploaded or pre-generated.
//   3. It converts format automatically. A modern phone gets AVIF, an older
//      one WebP, an ancient one JPEG — decided per request by `f_auto`. That
//      is typically 30–50% fewer bytes with no visible difference.
//
// WHAT A CLOUDINARY URL LOOKS LIKE
//
//   https://res.cloudinary.com/<cloud>/image/upload/<transforms>/<public_id>.jpg
//                                                   ^^^^^^^^^^^
//                              everything this file does happens in that slot
//
// SECURITY, HONESTLY
//
// Uploads from the browser use an *unsigned upload preset*. That preset name
// is in the bundle and is therefore public — someone who finds it could upload
// images to the nursery's Cloudinary account. It cannot delete anything, read
// anything, or touch the database, and SETUP.md explains how to lock the preset
// to one folder and cap the file size. For a nursery catalogue that trade-off
// is the right one: the alternative is a signing server, which is a great deal
// more to run and pay for. If it ever becomes a problem, swap the preset for
// the signed flow described at the bottom of SETUP.md — only this file changes.
// ============================================================================

const cloudName = import.meta.env?.VITE_CLOUDINARY_CLOUD_NAME || '';
const uploadPreset = import.meta.env?.VITE_CLOUDINARY_UPLOAD_PRESET || '';

/** The folder every upload lands in, so the media library stays navigable and
 *  the upload preset can be restricted to exactly this path. */
export const CLOUDINARY_FOLDER = import.meta.env?.VITE_CLOUDINARY_FOLDER || 'ganesh-nursery';

export const isCloudinaryConfigured = Boolean(cloudName && uploadPreset);
export const cloudinaryCloudName = cloudName;

const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

export const isCloudinaryUrl = s =>
  typeof s === 'string' && /res\.cloudinary\.com\/[^/]+\/image\/upload\//.test(s);

/* ─────────────────────────── delivery ─────────────────────────── */

/** Default transforms applied to every delivered image.
 *
 *  f_auto  — best format the requesting browser supports
 *  q_auto  — quality chosen per image by Cloudinary's own analysis; a flat
 *            photo of leaves needs far less data than a detailed bark shot,
 *            and a fixed number would over-compress one and waste bytes on
 *            the other
 *  c_limit — never upscale. Asking for 1400px of a 900px upload returns 900px
 *            rather than a blurry stretch. */
const BASE = 'f_auto,q_auto,c_limit';

/** Rewrites a Cloudinary URL to be delivered at a given width. Anything that
 *  is not a Cloudinary URL — a file in /public, a data URL — comes back
 *  untouched, so callers never have to check first. */
export function cdn(src, width) {
  if (!isCloudinaryUrl(src)) return src;
  const [head, tail] = String(src).split('/image/upload/');
  if (!tail) return src;

  // Drop transforms already in the path, so calling this twice cannot stack
  // `w_1400/w_320` and quietly serve the wrong size. Everything after them —
  // the version and the folder path — is kept exactly as Cloudinary gave it.
  const rest = tail.split('/').filter(seg => !isTransformSegment(seg)).join('/');

  const transform = width ? `${BASE},w_${Math.round(width)}` : BASE;
  return `${head}/image/upload/${transform}/${rest}`;
}

// A transform segment is the `w_600,f_auto` kind: a one-to-three letter key,
// an underscore, a value. A public id can contain slashes (it carries the
// folder), so segments are told apart by shape rather than by position.
const isTransformSegment = seg => /^[a-z]{1,3}_[^/]+$/.test(seg.split(',')[0]);

/** The widths worth generating. Spaced roughly 1.5x apart: closer together
 *  wastes cache entries, further apart and a phone downloads noticeably more
 *  than it needs. */
const WIDTHS = [320, 480, 720, 1000, 1400];

/** A full srcset so the browser picks the size it actually needs. Returns
 *  undefined for non-Cloudinary sources, which is exactly what an <img> wants
 *  when there is nothing to offer. */
export function cdnSrcSet(src) {
  if (!isCloudinaryUrl(src)) return undefined;
  return WIDTHS.map(w => `${cdn(src, w)} ${w}w`).join(', ');
}

/** A small, heavily compressed version for thumbnails and admin strips, where
 *  a full-size download would be pure waste. */
export const cdnThumb = src => cdn(src, 320);

/* ─────────────────────────── upload ─────────────────────────── */

/**
 * Sends an already-compressed Blob to Cloudinary.
 *
 * The browser compresses first (see photos.js) even though Cloudinary could do
 * it server-side, because the nursery uploads over mobile data. Sending a
 * 5 MB original to save a 400 KB one costs them the difference every time.
 *
 * @returns {Promise<{ url: string, publicId: string, width: number, height: number, bytes: number }>}
 */
export async function uploadToCloudinary(blob, { folder = '', filename = 'photo' } = {}) {
  if (!isCloudinaryConfigured) {
    throw new Error('Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.');
  }

  const form = new FormData();
  form.append('file', blob, `${filename}.jpg`);
  form.append('upload_preset', uploadPreset);
  // Subfolders per plant, so the media library mirrors the catalogue rather
  // than being one bucket of four hundred files named IMG_2831.
  form.append('folder', folder ? `${CLOUDINARY_FOLDER}/${folder}` : CLOUDINARY_FOLDER);

  const res = await fetch(UPLOAD_URL, { method: 'POST', body: form });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const raw = data?.error?.message || `Upload failed (${res.status}).`;
    throw new Error(translate(raw));
  }

  return {
    url: data.secure_url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
    bytes: data.bytes
  };
}

/** Cloudinary's messages are written for developers. These three are the ones
 *  that actually happen, so they get an answer rather than a diagnosis. */
function translate(message) {
  if (/upload preset not found/i.test(message)) {
    return 'The upload preset was not found. Check VITE_CLOUDINARY_UPLOAD_PRESET matches the preset name in Cloudinary, and that it is set to Unsigned.';
  }
  if (/whitelist|not allowed|unsigned/i.test(message)) {
    return 'Cloudinary refused the upload. In Settings → Upload, open the preset and make sure its signing mode is Unsigned.';
  }
  if (/file size|too large|maximum/i.test(message)) {
    return 'That photo is too large for the upload preset. Raise its size limit in Cloudinary, or use a smaller image.';
  }
  return message;
}

/** The identifier Cloudinary needs to delete an image, recovered from its URL.
 *  Kept for the admin panel's records; deleting actually requires a signature,
 *  so removing a photo here only unlinks it — see removePhoto in photos.js. */
export function publicIdFromUrl(src) {
  if (!isCloudinaryUrl(src)) return null;
  const tail = String(src).split('/image/upload/')[1];
  if (!tail) return null;
  return tail
    .split('/')
    .filter(seg => !isTransformSegment(seg))
    .join('/')
    .replace(/^v\d+\//, '')      // the version is not part of the public id
    .replace(/\.[a-z0-9]+$/i, '');
}
