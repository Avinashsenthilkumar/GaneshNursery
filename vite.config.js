import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// ============================================================================
// LOCAL API
//
// In production the files in /api become serverless functions on Vercel. Vite's
// dev server knows nothing about that, so without this plugin `npm run dev`
// would serve the site with a dead admin panel and you would need a second
// tool (`vercel dev`) running alongside it to get anything done.
//
// This runs the same handler files inside the dev server instead. Vite hands
// middleware the raw Node request and response, which is exactly what a Vercel
// handler expects — so all that is missing is the small amount of sugar Vercel
// adds on top: a parsed body, parsed query parameters, and res.status().json().
//
// One command, and the admin panel works locally against the real database.
// ============================================================================
function localApi(env) {
  return {
    name: 'ganesh-local-api',
    configureServer(server) {
      const apiDir = resolve(process.cwd(), 'api');
      if (!existsSync(apiDir)) return;

      // The handlers read DATABASE_URL and ADMIN_PASSWORD from process.env.
      // Vite only exposes VITE_-prefixed values to the browser (correctly —
      // these two must never reach it), so they are copied in here for the
      // server side.
      for (const [k, v] of Object.entries(env)) {
        if (!k.startsWith('VITE_') && process.env[k] === undefined) process.env[k] = v;
      }

      const routes = readdirSync(apiDir)
        .filter(f => f.endsWith('.js') && !f.startsWith('_'))
        .map(f => f.replace(/\.js$/, ''));

      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, 'http://localhost');
        const name = url.pathname.replace(/^\/api\//, '').replace(/\/$/, '');
        if (!url.pathname.startsWith('/api/') || !routes.includes(name)) return next();

        try {
          // Imported fresh each time so editing a handler takes effect without
          // restarting the server, the same as editing a component does.
          const mod = await server.ssrLoadModule(`/api/${name}.js`);

          req.query = Object.fromEntries(url.searchParams);
          req.body = await readJsonBody(req);

          res.status = code => { res.statusCode = code; return res; };
          res.json = data => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return res;
          };

          await mod.default(req, res);
        } catch (err) {
          server.config.logger.error(`[api/${name}] ${err.stack || err.message}`);
          if (!res.writableEnded) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
          }
        }
      });
    }
  };
}

function readJsonBody(req) {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'DELETE') {
    return Promise.resolve(undefined);
  }
  return new Promise((resolveBody, reject) => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      // A photo is uploaded straight to Cloudinary, never through here, so a
      // body this large is a mistake or an attack either way.
      if (raw.length > 2_000_000) reject(new Error('Request body too large.'));
    });
    req.on('end', () => {
      if (!raw) { resolveBody(undefined); return; }
      try { resolveBody(JSON.parse(raw)); } catch { resolveBody(undefined); }
    });
    req.on('error', reject);
  });
}

export default defineConfig(({ mode }) => {
  // '' as the prefix loads every variable, not just VITE_ ones, so the local
  // API can see DATABASE_URL. Nothing here is exposed to the browser bundle;
  // only `import.meta.env.VITE_*` is.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), localApi(env)],
    build: {
      target: 'es2019',
      assetsInlineLimit: 4096,
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            router: ['react-router-dom']
          }
        }
      }
    },
    server: { port: 5173, host: true }
  };
});
