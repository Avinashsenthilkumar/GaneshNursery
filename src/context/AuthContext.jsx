import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

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
//   Now    — the password is verified by Supabase on their servers and never
//            reaches the browser. Writes are then rejected by Postgres itself
//            unless a valid session is attached. Someone who gets past the
//            login screen still cannot write anything.
//
// The session persists in localStorage and refreshes itself, so signing in on
// your phone keeps you signed in.
// ============================================================================

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) { setChecking(false); return undefined; }

    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session ?? null);
      setChecking(false);
    });

    // Fires on sign-in, sign-out and token refresh — including in another tab,
    // so signing out on one device does not leave a stale panel open here.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      if (active) setSession(next ?? null);
    });

    return () => { active = false; sub?.subscription?.unsubscribe(); };
  }, []);

  const signIn = useCallback(async (email, password) => {
    if (!isSupabaseConfigured) {
      throw new Error('The database is not connected, so there is nothing to sign in to. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });
    if (error) {
      // Supabase returns the same message for a wrong password and an unknown
      // account, which is correct — telling an attacker which emails exist is
      // a gift. Passed through as-is rather than "helpfully" narrowed.
      throw new Error(
        error.message === 'Invalid login credentials'
          ? 'That email and password do not match an account.'
          : error.message
      );
    }
    return data.session;
  }, []);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
    setSession(null);
  }, []);

  const sendReset = useCallback(async email => {
    if (!isSupabaseConfigured) throw new Error('The database is not connected.');
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/admin`
    });
    if (error) throw error;
  }, []);

  const value = useMemo(() => ({
    session,
    user: session?.user ?? null,
    email: session?.user?.email ?? '',
    isSignedIn: Boolean(session),
    checking,
    configured: isSupabaseConfigured,
    signIn,
    signOut,
    sendReset
  }), [session, checking, signIn, signOut, sendReset]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
