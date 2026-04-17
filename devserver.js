// Dev proxy server: serves app/ statically + proxies /api/ to backend on port 3000
const http        = require('http');
const fs          = require('fs');
const path        = require('path');
const { URL }     = require('url');

const PORT        = process.env.PORT || 3333;
const API_TARGET  = 'http://localhost:3000';
const STATIC_ROOT = path.join(__dirname, 'app');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.woff2':'font/woff2'
};

function resolveFile(pathname) {
  // Normalise and resolve candidate paths (prevent path traversal)
  const candidates = [
    pathname === '/' ? '/index.html' : pathname,
    pathname + '.html',          // extension-less → try .html
    '/index.html'                // SPA fallback
  ];
  for (const c of candidates) {
    const full = path.join(STATIC_ROOT, c);
    if (!full.startsWith(STATIC_ROOT)) continue; // path traversal guard
    if (fs.existsSync(full) && fs.statSync(full).isFile()) return full;
  }
  return null;
}

const server = http.createServer((req, res) => {
  const parsed = new URL(req.url, `http://localhost:${PORT}`);

  // ── Proxy /api/* → backend ───────────────────────────────────────────────
  if (parsed.pathname.startsWith('/api/')) {
    const options = {
      hostname: 'localhost', port: 3000,
      path: req.url, method: req.method,
      headers: { ...req.headers, host: 'localhost:3000' }
    };
    const proxy = http.request(options, (backRes) => {
      res.writeHead(backRes.statusCode, backRes.headers);
      backRes.pipe(res);
    });
    proxy.on('error', () => {
      try { res.writeHead(502); } catch(_) {}
      res.end(JSON.stringify({ error: 'Backend unavailable — is the backend running?' }));
    });
    req.pipe(proxy);
    return;
  }

  // ── Serve static files ───────────────────────────────────────────────────
  const filePath = resolveFile(parsed.pathname);
  if (!filePath) { res.writeHead(404); res.end('Not found'); return; }

  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(500); res.end('Read error'); return; }
    const ext = path.extname(filePath);
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'text/plain',
      'Cache-Control': 'no-store'   // always fresh in dev
    });
    res.end(data);
  });
});

server.listen(PORT, () => console.log(`[devserver] http://localhost:${PORT}  (proxying /api/ → ${API_TARGET})`));
