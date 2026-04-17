// Cyber Risk Command Center — Express API server
// Starts on PORT (default 3000); proxied from nginx under /api/

const express = require('express');
const cors    = require('cors');

// Initialise DB (creates schema + seeds admin) synchronously before routes load
require('./db');

const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: false }));

// CORS — in production nginx handles same-origin; allow all in dev
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:8080', 'http://localhost:3333'];

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (same-origin nginx proxy, curl, Postman, etc.)
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    // Reject with null (CORS error in browser) — do NOT throw, which causes 500
    return cb(null, false);
  },
  credentials: true
}));

// Security: remove X-Powered-By header
app.disable('x-powered-by');

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', ts: new Date().toISOString() });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api',      dataRoutes);

// ── 404 catch-all ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[server] unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ── JWT_SECRET safety check ────────────────────────────────────────────────────
const DEFAULT_SECRET = 'crcc-change-me-in-production';
if (!process.env.JWT_SECRET || process.env.JWT_SECRET === DEFAULT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    console.error('[server] FATAL: JWT_SECRET is set to the default value in production! Set a strong secret in .env and restart.');
    process.exit(1);
  } else {
    console.warn('[server] ⚠️  WARNING: JWT_SECRET is using the default value. Change it before deploying to production!');
  }
}

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[server] CRCC backend listening on port ${PORT}`);
});
