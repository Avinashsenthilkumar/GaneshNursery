import { createHmac, createHash, timingSafeEqual, randomBytes } from 'node:crypto';

// ============================================================================
// AUTHENTICATION
//
// One password, checked on the server, exchanged for a signed cookie.
//
// WHY THIS IS A REAL LOCK AND THE OLD ONE WAS NOT
//
// The passphrase this replaces was compared inside the JavaScript the visitor
// downloaded, so the correct answer was sitting in the bundle for anyone who
// opened developer tools. Here the password exists only as an environment
// variable on Vercel's servers. The browser sends a guess and is told yes or
// no; it is never told the answer.
//
// The cookie is signed with HMAC-SHA256 and marked httpOnly, so page
// JavaScript cannot read it and a tampered cookie fails its signature check.
//
// WHY ONE PASSWORD RATHER THAN ACCOUNTS
//
// Because one person edits this site. Per-person accounts would mean a users
// table, password hashing, a reset flow and an invite screen — a great deal of
// machinery to record which of the one people made a change. If the nursery
// ever takes on staff who edit prices, that is the point to add it, and this
// file is where it would go.
//
// To change the password: Vercel → Settings → Environment Variables →
// ADMIN_PASSWORD → redeploy. Everyone is signed out automatically, because the
// signing key is derived from the password.
// ============================================================================

const PASSWORD = process.env.ADMIN_PASSWORD || '';
const COOKIE = 'ganesh_session';
const MAX_AGE = 60 * 60 * 24 * 30;   // 30 days

export const isAuthConfigured = Boolean(PASSWORD);

/** The key that signs session cookies.
 *
 *  Derived from the password and the database URL rather than being a third
 *  environment variable to set and lose. A useful side effect: changing either
 *  one invalidates every existing session, which is exactly what should happen
 *  when a password is changed. */
function signingKey() {
  return createHash('sha256')
    .update(`${PASSWORD}::${process.env.DATABASE_URL || ''}::ganesh-nursery`)
    .digest();
}

const b64url = buf => Buffer.from(buf).toString('base64url');

function sign(payload) {
  const body = b64url(JSON.stringify(payload));
  const mac = b64url(createHmac('sha256', signingKey()).update(body).digest());
  return `${body}.${mac}`;
}

function verify(token) {
  if (typeof token !== 'string' || !token.includes('.')) return null;
  const [body, mac] = token.split('.');
  if (!body || !mac) return null;

  const expected = b64url(createHmac('sha256', signingKey()).update(body).digest());
  // Compared byte-by-byte in constant time. A normal === would return faster
  // the sooner it finds a difference, which over enough attempts leaks the
  // signature one character at a time.
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!payload.exp || payload.exp < Date.now() / 1000) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Constant-time password check, for the same reason as above. */
export function passwordMatches(given) {
  if (!PASSWORD || typeof given !== 'string') return false;
  // Hashed first so both sides are always 32 bytes — comparing raw strings of
  // different lengths would leak the password's length through the failure.
  const a = createHash('sha256').update(given).digest();
  const b = createHash('sha256').update(PASSWORD).digest();
  return timingSafeEqual(a, b);
}

export function sessionCookie() {
  const token = sign({ exp: Math.floor(Date.now() / 1000) + MAX_AGE, jti: randomBytes(8).toString('hex') });
  // Secure is omitted on localhost, where there is no HTTPS and the browser
  // would silently drop the cookie — the single most confusing way for a
  // local login to fail.
  const secure = process.env.NODE_ENV === 'production' ? ' Secure;' : '';
  return `${COOKIE}=${token}; Path=/; HttpOnly;${secure} SameSite=Lax; Max-Age=${MAX_AGE}`;
}

export function clearCookie() {
  return `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

function readCookie(req, name) {
  const raw = req.headers?.cookie;
  if (!raw) return null;
  for (const part of raw.split(';')) {
    const i = part.indexOf('=');
    if (i === -1) continue;
    if (part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return null;
}

export const isSignedIn = req => Boolean(verify(readCookie(req, COOKIE)));

/** Guard for every endpoint that writes. Returns true when the request may
 *  proceed; otherwise it has already sent 401 and the caller should return. */
export function requireAuth(req, res) {
  if (isSignedIn(req)) return true;
  res.status(401).json({ error: 'Not signed in. Sign in again and retry.' });
  return false;
}
