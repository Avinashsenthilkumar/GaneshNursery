import { sql, requireDb, rowToPlant, plantToRow } from './_lib/db.js';
import { requireAuth } from './_lib/auth.js';

// ============================================================================
// /api/plants
//
//   GET                       the whole catalogue          public
//   POST    { plant }         create or update one plant   signed in
//   DELETE  ?id=123           remove one plant             signed in
//
// Reads are public because the catalogue is public — that is the site. Writes
// are checked here, on the server, where the check cannot be edited by the
// person making the request.
// ============================================================================

export default async function handler(req, res) {
  try {
    requireDb();

    if (req.method === 'GET') {
      const rows = await sql`
        select * from plants
        order by sort_order asc, id asc
      `;
      // Cached at the edge for a minute, and allowed to serve the previous
      // copy for an hour while it refetches. A price change is visible within
      // about a minute; in exchange most visitors never wait on the database
      // at all, and a database outage does not become a site outage.
      res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=3600');
      res.status(200).json({ plants: rows.map(rowToPlant) });
      return;
    }

    if (req.method === 'POST') {
      if (!requireAuth(req, res)) return;

      const p = plantToRow(req.body?.plant || {});
      if (!p.name) { res.status(400).json({ error: 'A plant needs a name.' }); return; }
      if (!p.slug) { res.status(400).json({ error: 'A plant needs a URL slug.' }); return; }

      // Matched on slug, which is what the public URL uses and therefore the
      // thing that must stay unique. Postgres decides insert-or-update in one
      // statement, so two people saving at once cannot create a duplicate.
      const [row] = await sql`
        insert into plants (
          slug, name, tamil, botanical, category, seed_source, mother_tree,
          light, water, soil, popular, description, highlights, planting,
          care, uses, notice, images, variants, sort_order
        ) values (
          ${p.slug}, ${p.name}, ${p.tamil}, ${p.botanical}, ${p.category},
          ${p.seed_source}, ${p.mother_tree}, ${p.light}, ${p.water}, ${p.soil},
          ${p.popular}, ${p.description}, ${JSON.stringify(p.highlights)},
          ${p.planting}, ${p.care}, ${p.uses}, ${p.notice},
          ${JSON.stringify(p.images)}, ${JSON.stringify(p.variants)}, ${p.sort_order}
        )
        on conflict (slug) do update set
          name = excluded.name,
          tamil = excluded.tamil,
          botanical = excluded.botanical,
          category = excluded.category,
          seed_source = excluded.seed_source,
          mother_tree = excluded.mother_tree,
          light = excluded.light,
          water = excluded.water,
          soil = excluded.soil,
          popular = excluded.popular,
          description = excluded.description,
          highlights = excluded.highlights,
          planting = excluded.planting,
          care = excluded.care,
          uses = excluded.uses,
          notice = excluded.notice,
          images = excluded.images,
          variants = excluded.variants,
          sort_order = excluded.sort_order,
          updated_at = now()
        returning *
      `;
      res.status(200).json({ plant: rowToPlant(row) });
      return;
    }

    if (req.method === 'DELETE') {
      if (!requireAuth(req, res)) return;

      const id = Number(req.query?.id);
      if (!Number.isFinite(id)) { res.status(400).json({ error: 'Which plant? No id given.' }); return; }

      const rows = await sql`delete from plants where id = ${id} returning id`;
      if (!rows.length) { res.status(404).json({ error: 'That plant no longer exists.' }); return; }

      res.status(200).json({ deleted: id });
      return;
    }

    res.setHeader('Allow', 'GET, POST, DELETE');
    res.status(405).json({ error: 'Method not allowed.' });
  } catch (err) {
    res.status(err.status || 500).json({ error: friendly(err) });
  }
}

/** Postgres errors are written for whoever wrote the query. These are the ones
 *  that can actually reach a nursery owner, so they get an answer rather than
 *  a diagnosis. */
function friendly(err) {
  const m = err?.message || 'Something went wrong saving that.';
  if (/relation .*plants.* does not exist/i.test(m)) {
    return 'The plants table has not been created yet. Run: npm run db:init';
  }
  if (/duplicate key|unique constraint/i.test(m)) {
    return 'Another plant already uses that URL slug. Change the slug and save again.';
  }
  if (/password authentication|no pg_hba|SASL/i.test(m)) {
    return 'The database refused the connection. Check DATABASE_URL in your environment variables.';
  }
  if (/ENOTFOUND|ETIMEDOUT|fetch failed/i.test(m)) {
    return 'Could not reach the database. It may be waking up — try again in a few seconds.';
  }
  return m;
}
