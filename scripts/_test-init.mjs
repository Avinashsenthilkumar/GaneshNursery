// pgwire.mjs
import net from "node:net";
var int32 = (n) => {
  const b = Buffer.alloc(4);
  b.writeInt32BE(n);
  return b;
};
var int16 = (n) => {
  const b = Buffer.alloc(2);
  b.writeInt16BE(n);
  return b;
};
var cstr = (s) => Buffer.concat([Buffer.from(String(s), "utf8"), Buffer.from([0])]);
function msg(type, ...parts) {
  const body = Buffer.concat(parts);
  const head = Buffer.concat([Buffer.from(type, "ascii"), int32(body.length + 4)]);
  return Buffer.concat([head, body]);
}
var NUMERIC = /* @__PURE__ */ new Set([20, 21, 23, 26, 700, 701, 1700]);
var JSONISH = /* @__PURE__ */ new Set([114, 3802]);
function decode(value, oid) {
  if (value === null) return null;
  if (oid === 16) return value === "t";
  if (NUMERIC.has(oid)) {
    const n = Number(value);
    return Number.isNaN(n) ? value : n;
  }
  if (JSONISH.has(oid)) {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
}
function connect({ host = "127.0.0.1", port = 5433, user = "postgres", database = "postgres" } = {}) {
  return new Promise((resolveConn, rejectConn) => {
    const sock = net.connect({ host, port });
    let buf = Buffer.alloc(0);
    let queue = [];
    let ready = null;
    sock.on("error", rejectConn);
    sock.on("data", (chunk) => {
      buf = Buffer.concat([buf, chunk]);
      for (; ; ) {
        if (buf.length < 5) return;
        const type = String.fromCharCode(buf[0]);
        const len = buf.readInt32BE(1);
        if (buf.length < len + 1) return;
        const body = buf.subarray(5, len + 1);
        buf = buf.subarray(len + 1);
        handle(type, body);
      }
    });
    function handle(type, body) {
      const cur = queue[0];
      switch (type) {
        case "R": {
          if (body.readInt32BE(0) !== 0) rejectConn(new Error("Only trust auth is supported by this harness."));
          break;
        }
        case "T": {
          const n = body.readInt16BE(0);
          let o = 2;
          const fields = [];
          for (let i = 0; i < n; i++) {
            const end = body.indexOf(0, o);
            const name = body.subarray(o, end).toString("utf8");
            o = end + 1;
            const oid = body.readInt32BE(o + 6);
            o += 18;
            fields.push({ name, oid });
          }
          if (cur) cur.fields = fields;
          break;
        }
        case "D": {
          const n = body.readInt16BE(0);
          let o = 2;
          const row = {};
          for (let i = 0; i < n; i++) {
            const len = body.readInt32BE(o);
            o += 4;
            let v = null;
            if (len !== -1) {
              v = body.subarray(o, o + len).toString("utf8");
              o += len;
            }
            const f = cur?.fields?.[i];
            row[f ? f.name : i] = decode(v, f ? f.oid : 25);
          }
          if (cur) cur.rows.push(row);
          break;
        }
        case "E": {
          const parts = {};
          let o = 0;
          while (o < body.length && body[o] !== 0) {
            const code = String.fromCharCode(body[o]);
            const end = body.indexOf(0, o + 1);
            parts[code] = body.subarray(o + 1, end).toString("utf8");
            o = end + 1;
          }
          if (cur) cur.error = new Error(parts.M || "postgres error");
          break;
        }
        case "Z": {
          if (ready) {
            const r = ready;
            ready = null;
            r();
            break;
          }
          const done = queue.shift();
          if (done) done.error ? done.reject(done.error) : done.resolve(done.rows);
          break;
        }
        default:
          break;
      }
    }
    sock.write(Buffer.concat([
      int32(0),
      int32(196608),
      cstr("user"),
      cstr(user),
      cstr("database"),
      cstr(database),
      Buffer.from([0])
    ].map((b, i) => i === 0 ? Buffer.alloc(0) : b)).length ? (() => {
      const body = Buffer.concat([int32(196608), cstr("user"), cstr(user), cstr("database"), cstr(database), Buffer.from([0])]);
      return Buffer.concat([int32(body.length + 4), body]);
    })() : Buffer.alloc(0));
    ready = () => resolveConn({ query, end: () => sock.end() });
    function query(text, params = []) {
      return new Promise((resolve2, reject) => {
        queue.push({ resolve: resolve2, reject, rows: [], fields: null, error: null });
        const encoded = params.map((p) => {
          if (p === null || p === void 0) return null;
          if (typeof p === "boolean") return Buffer.from(p ? "true" : "false");
          return Buffer.from(String(p), "utf8");
        });
        const bindParams = Buffer.concat([
          int16(0),
          int16(encoded.length),
          ...encoded.map((b) => b === null ? int32(-1) : Buffer.concat([int32(b.length), b])),
          int16(0)
        ]);
        sock.write(Buffer.concat([
          msg("P", cstr(""), cstr(text), int16(0)),
          msg("B", cstr(""), cstr(""), bindParams),
          msg("D", Buffer.from("P"), cstr("")),
          msg("E", cstr(""), int32(0)),
          msg("S")
        ]));
      });
    }
  });
}
function makeNeon(conn2) {
  return (strings, ...values) => {
    const text = strings.reduce((acc, s, i) => acc + s + (i < values.length ? `$${i + 1}` : ""), "");
    return conn2.query(text, values);
  };
}

// stub-neon.mjs
var conn = await connect({ port: 5433 });
var neon = () => makeNeon(conn);

// ../../../home/claude/work/ganesh final/scripts/init-neon.mjs
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
var here = dirname(fileURLToPath(import.meta.url));
var root = resolve(here, "..");
function loadEnvFile() {
  const path = resolve(root, ".env");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const value = m[2].replace(/^["']|["']$/g, "");
    if (!process.env[m[1]]) process.env[m[1]] = value;
  }
}
loadEnvFile();
var URL = process.env.DATABASE_URL;
if (!URL) {
  console.error(`
Missing DATABASE_URL.

  Create a file called  .env  in the project root containing:

    DATABASE_URL=postgresql://user:password@ep-xxxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require

  Neon shows this on your project dashboard under "Connection string"
  (pick the "Pooled connection" one). Then run  npm run db:init  again.
`);
  process.exit(1);
}
var sql = neon(URL);
console.log("Creating tables\u2026");
await sql`
  create table if not exists plants (
    id           bigint generated always as identity primary key,
    slug         text not null unique,
    name         text not null,
    tamil        text,
    botanical    text,
    category     text not null default 'Timber',

    seed_source  text,
    mother_tree  text,
    light        text,
    water        text,
    soil         text,

    popular      boolean not null default false,
    description  text,
    highlights   jsonb   not null default '[]'::jsonb,
    planting     text,
    care         text,
    uses         text,
    notice       text,

    -- Up to 5 image URLs, and one object per height in variants. JSON rather
    -- than join tables because they are always read and written together with
    -- the parent row, and their order matters.
    images       jsonb   not null default '[]'::jsonb,
    variants     jsonb   not null default '[]'::jsonb,

    sort_order   integer not null default 0,
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now()
  )
`;
await sql`create index if not exists plants_sort_order_idx on plants (sort_order, id)`;
await sql`create index if not exists plants_category_idx   on plants (category)`;
await sql`
  create table if not exists site_settings (
    id         integer primary key default 1,
    data       jsonb not null default '{}'::jsonb,
    updated_at timestamptz not null default now(),
    constraint site_settings_single_row check (id = 1)
  )
`;
console.log("  \u2713 plants, site_settings");
async function loadModule(relPath, replacements = []) {
  let src = readFileSync(resolve(root, relPath), "utf8");
  for (const [from, to] of replacements) src = src.split(from).join(to);
  return import("data:text/javascript," + encodeURIComponent(src));
}
var siteMod = await loadModule("src/data/site.js", [
  ["import.meta.env?.VITE_CONTACT_ENDPOINT || ''", "''"]
]);
var plantsMod = await loadModule("src/data/plants.js", [
  ["import { site } from './site.js';", `const site = ${JSON.stringify({ whatsapp: siteMod.site.whatsapp })};`]
]);
var plants = plantsMod.plants;
console.log(`
Loading ${plants.length} plants\u2026`);
var written = 0;
for (const [i, p] of plants.entries()) {
  const variants = (p.variants ?? []).map((v) => ({
    size: v.size ?? "",
    age: v.age ?? null,
    bag: v.bag ?? null,
    cost: v.cost ?? null,
    offer: v.offer ?? null,
    note: v.note ?? null,
    images: v.images ?? []
  }));
  await sql`
    insert into plants (
      slug, name, tamil, botanical, category, seed_source, mother_tree,
      light, water, soil, popular, description, highlights, planting,
      care, uses, notice, images, variants, sort_order
    ) values (
      ${p.slug}, ${p.name}, ${p.tamil ?? null}, ${p.botanical ?? null}, ${p.category},
      ${p.seedSource ?? null}, ${p.motherTree ?? null}, ${p.light ?? null},
      ${p.water ?? null}, ${p.soil ?? null}, ${!!p.popular}, ${p.description ?? null},
      ${JSON.stringify(p.highlights ?? [])}, ${p.planting ?? null}, ${p.care ?? null},
      ${p.uses ?? null}, ${p.notice ?? null}, ${JSON.stringify(p.images ?? [])},
      ${JSON.stringify(variants)}, ${i}
    )
    on conflict (slug) do update set
      name = excluded.name, tamil = excluded.tamil, botanical = excluded.botanical,
      category = excluded.category, seed_source = excluded.seed_source,
      mother_tree = excluded.mother_tree, light = excluded.light,
      water = excluded.water, soil = excluded.soil, popular = excluded.popular,
      description = excluded.description, highlights = excluded.highlights,
      planting = excluded.planting, care = excluded.care, uses = excluded.uses,
      notice = excluded.notice, images = excluded.images,
      variants = excluded.variants, sort_order = excluded.sort_order,
      updated_at = now()
  `;
  written += 1;
}
console.log(`  \u2713 ${written} plants, ${plants.reduce((n, p) => n + (p.variants?.length || 0), 0)} sizes`);
var { contactEndpoint, ...siteData } = siteMod.site;
await sql`
  insert into site_settings (id, data) values (1, ${JSON.stringify(siteData)})
  on conflict (id) do update set data = excluded.data, updated_at = now()
`;
console.log("  \u2713 business details");
var localPhotos = plants.flatMap((p) => [
  ...p.images ?? [],
  ...(p.variants ?? []).flatMap((v) => v.images ?? [])
]).filter((src) => String(src).startsWith("/"));
console.log(`
Done.

  ${localPhotos.length} photo paths point at files in /public. Those keep working
  exactly as they do now and cost nothing. Only photos uploaded through the
  admin panel go to Cloudinary.

Next: run  npm run dev  , open /admin , sign in with your ADMIN_PASSWORD and
change a price. It should be live straight away \u2014 that is the whole point.
`);
