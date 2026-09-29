import { sql, requireDb } from './_lib/db.js';
import { requireAuth } from './_lib/auth.js';

// ============================================================================
// /api/site
//
//   GET   the business details          public
//   PUT   { site }  save them           signed in
//
// One row, stored as JSON. The shape changes whenever the site gains a field,
// and a column per field would mean a migration every time someone wants a
// second phone number on the contact page.
// ============================================================================

// Only these keys are ever stored. Anything else in the request body is
// dropped rather than trusted — without this, a crafted request could stuff
// arbitrary data into the row that every page then renders.
const ALLOWED = [
  'name', 'tagline', 'proprietor', 'foundedYear',
  'phoneDisplay', 'phoneE164', 'whatsapp', 'phoneAltDisplay', 'phoneAltE164',
  'email', 'openingHours', 'priceValidityNote', 'mapsQuery',
  'address', 'social'
];

export default async function handler(req, res) {
  try {
    requireDb();

    if (req.method === 'GET') {
      const rows = await sql`select data from site_settings where id = 1`;
      res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=3600');
      res.status(200).json({ site: rows[0]?.data ?? {} });
      return;
    }

    if (req.method === 'PUT') {
      if (!requireAuth(req, res)) return;

      const incoming = req.body?.site;
      if (!incoming || typeof incoming !== 'object') {
        res.status(400).json({ error: 'No settings were sent.' });
        return;
      }

      const clean = {};
      for (const key of ALLOWED) {
        if (incoming[key] !== undefined) clean[key] = incoming[key];
      }
      // contactEndpoint is deliberately not in ALLOWED: it comes from a
      // build-time environment variable, and storing it here would create a
      // second source of truth free to disagree with the first.

      const [row] = await sql`
        insert into site_settings (id, data) values (1, ${JSON.stringify(clean)})
        on conflict (id) do update set data = excluded.data, updated_at = now()
        returning data
      `;
      res.status(200).json({ site: row.data });
      return;
    }

    res.setHeader('Allow', 'GET, PUT');
    res.status(405).json({ error: 'Method not allowed.' });
  } catch (err) {
    const m = err?.message || 'Something went wrong.';
    res.status(err.status || 500).json({
      error: /relation .*site_settings.* does not exist/i.test(m)
        ? 'The settings table has not been created yet. Run: npm run db:init'
        : m
    });
  }
}
