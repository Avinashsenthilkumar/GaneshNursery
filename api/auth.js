import {
  passwordMatches, sessionCookie, clearCookie, isSignedIn, isAuthConfigured
} from './_lib/auth.js';

// ============================================================================
// /api/auth
//
//   GET     is this browser signed in?
//   POST    { password } -> sets the session cookie
//   DELETE  signs out
//
// The browser never receives the password or the signing key — only a cookie
// it cannot read and cannot forge.
// ============================================================================

// A failed attempt costs the caller a second. Harmless when you know the
// password; ruinous for anyone working through a list, because a serverless
// function that sleeps also occupies the attacker's connection. Not a
// substitute for a long password, but it turns thousands of guesses per
// minute into sixty.
const sleep = ms => new Promise(r => setTimeout(r, ms));

export default async function handler(req, res) {
  if (!isAuthConfigured) {
    res.status(503).json({
      error: 'ADMIN_PASSWORD is not set on the server, so signing in is not possible yet. See NEON-SETUP.md.'
    });
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json({ signedIn: isSignedIn(req) });
    return;
  }

  if (req.method === 'POST') {
    const password = req.body?.password;
    if (!passwordMatches(password)) {
      await sleep(1000);
      res.status(401).json({ error: 'That password is not right.' });
      return;
    }
    res.setHeader('Set-Cookie', sessionCookie());
    res.status(200).json({ signedIn: true });
    return;
  }

  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', clearCookie());
    res.status(200).json({ signedIn: false });
    return;
  }

  res.setHeader('Allow', 'GET, POST, DELETE');
  res.status(405).json({ error: 'Method not allowed.' });
}
