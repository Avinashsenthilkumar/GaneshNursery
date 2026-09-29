import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchSession, signInRequest, signOutRequest } from '../lib/api.js';

// ============================================================================
// AUTHENTICATION
//
// This replaces the passphrase check that used to live in the JavaScript
// bundle. The difference is not cosmetic:
//
//   Before — the site compared what you typed against a string sitting in the
//            downloaded bundle. Anyone could read it in developer tools. It
//            was safe only because the admin panel could not change anything
//            the public saw.
//
//   Now    — the password is checked by the server and never reaches the
//            browser at all. What comes back is a signed, httpOnly cookie that
//            page JavaScript cannot read and cannot forge. Every write is then
//            re-checked server-side, so getting past this screen is not enough
//            on its own.
//
// There is no session state kept here beyond "yes or no", because the cookie
// is the session and the browser handles it.
// ============================================================================

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isSignedIn, setSignedIn] = useState(false);
  const [checking, setChecking] = useState(true);
  // Set when the API itself cannot be reached, which is a different problem
  // from a wrong password and needs a different message.
  const [unavailable, setUnavailable] = useState('');

  useEffect(() => {
    const ac = new AbortController();
    fetchSession(ac.signal)
      .then(d => { setSignedIn(!!d.signedIn); setUnavailable(''); })
      .catch(err => { if (err.name !== 'AbortError') setUnavailable(err.message); })
      .finally(() => setChecking(false));
    return () => ac.abort();
  }, []);

  const signIn = useCallback(async password => {
    const d = await signInRequest(password);   // throws with a usable message
    setSignedIn(!!d.signedIn);
    setUnavailable('');
    return d.signedIn;
  }, []);

  const signOut = useCallback(async () => {
    // Cleared locally whatever the server says. If the request failed the
    // cookie may survive, but the panel is shut either way — and leaving
    // someone staring at an editor they thought they had closed is worse.
    try { await signOutRequest(); } finally { setSignedIn(false); }
  }, []);

  const value = useMemo(() => ({
    isSignedIn,
    checking,
    unavailable,
    signIn,
    signOut
  }), [isSignedIn, checking, unavailable, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
