// ============================================================================
// API CLIENT
//
// The browser's entire view of the backend: four functions over `fetch`.
//
// There is no database credential here, and there is nothing to configure.
// The site calls its own /api routes on the same domain, and those routes hold
// the connection string on the server. That is the difference from the
// previous version, where a key had to be published in the bundle and then
// defended with database-side rules.
//
// `credentials: 'same-origin'` sends the session cookie, which is httpOnly —
// so this file cannot read it either. It only ever finds out whether it worked.
// ============================================================================

async function call(path, { method = 'GET', body, signal } = {}) {
  let res;
  try {
    res = await fetch(path, {
      method,
      signal,
      credentials: 'same-origin',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    // fetch only rejects when the request never completed: offline, DNS,
    // blocked. An HTTP error is a resolved promise, handled below.
    throw new Error('No connection. Check the network and try again.');
  }

  // An HTML response means the request was swallowed by the SPA catch-all
  // rewrite rather than reaching a function — the classic symptom of a static
  // deploy with no serverless functions behind it. Worth naming, because the
  // JSON parse error it otherwise produces explains nothing.
  const type = res.headers.get('content-type') || '';
  if (!type.includes('application/json')) {
    throw new Error(
      res.status === 404
        ? 'The API is not running. On Vercel this means the project built as a static site — check that the api/ folder was deployed.'
        : `The server returned an unexpected response (${res.status}).`
    );
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status}).`);
    err.status = res.status;
    throw err;
  }
  return data;
}

/* ─── content ─────────────────────────────────────────────────────────── */

export const fetchPlants = signal => call('/api/plants', { signal });
export const fetchSite = signal => call('/api/site', { signal });

export const savePlant = plant => call('/api/plants', { method: 'POST', body: { plant } });
export const removePlant = id => call(`/api/plants?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
export const saveSiteSettings = site => call('/api/site', { method: 'PUT', body: { site } });

/* ─── session ─────────────────────────────────────────────────────────── */

export const fetchSession = signal => call('/api/auth', { signal });
export const signInRequest = password => call('/api/auth', { method: 'POST', body: { password } });
export const signOutRequest = () => call('/api/auth', { method: 'DELETE' });
