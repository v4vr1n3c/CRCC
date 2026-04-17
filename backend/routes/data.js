// Cyber Risk Command Center — Data routes
// GET    /api/indicators            — returns active indicators (override or seed file)
// PUT    /api/indicators            — save override (admin only)
// DELETE /api/indicators/override   — remove override, revert to seed file (admin only)
// GET    /api/history               — returns history.json
// GET    /api/users                 — list all users (admin only)

const express = require('express');
const path    = require('path');
const fs      = require('fs');

const db = require('../db');
const { verifyToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Data directory is mounted from the host at /data (or falls back to app/data)
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', '..', 'app', 'data');

// ── GET /api/indicators ───────────────────────────────────────────────────────
router.get('/indicators', verifyToken, (req, res) => {
  // Check for DB override first
  const row = db.prepare('SELECT data FROM indicators_override WHERE id = 1').get();
  if (row) {
    try {
      const data = JSON.parse(row.data);
      data._hasOverride = true;   // UI flag — tells admin page data has been customised
      return res.json(data);
    } catch (e) {
      // Corrupted override — fall through to file
      console.error('[data] indicators_override JSON parse error, falling back to file');
    }
  }

  // Fall back to seed file
  const filePath = path.join(DATA_DIR, 'indicators.json');
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);
    data._hasOverride = false;
    return res.json(data);
  } catch (err) {
    console.error('[data] indicators.json read error:', err);
    return res.status(500).json({ error: 'Could not load indicators data' });
  }
});

// ── PUT /api/indicators ───────────────────────────────────────────────────────
router.put('/indicators', verifyToken, requireAdmin, (req, res) => {
  const body = req.body;
  if (!body || !body.metadata || !body.categories || !Array.isArray(body.categories)) {
    return res.status(400).json({ error: 'Invalid payload: metadata and categories[] required' });
  }

  try {
    const serialized = JSON.stringify(body);
    db.prepare(`
      INSERT INTO indicators_override (id, data, updated_at, updated_by_email)
      VALUES (1, ?, CURRENT_TIMESTAMP, ?)
      ON CONFLICT(id) DO UPDATE SET
        data = excluded.data,
        updated_at = excluded.updated_at,
        updated_by_email = excluded.updated_by_email
    `).run(serialized, req.user.email);

    return res.json({ message: 'Indicators saved successfully' });
  } catch (err) {
    console.error('[data] PUT indicators error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── DELETE /api/indicators/override ──────────────────────────────────────────
router.delete('/indicators/override', verifyToken, requireAdmin, (req, res) => {
  try {
    db.prepare('DELETE FROM indicators_override WHERE id = 1').run();
    return res.json({ message: 'Override removed; reverted to default data' });
  } catch (err) {
    console.error('[data] DELETE override error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── GET /api/history ─────────────────────────────────────────────────────────
router.get('/history', verifyToken, (req, res) => {
  const filePath = path.join(DATA_DIR, 'history.json');
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return res.json(JSON.parse(raw));
  } catch (err) {
    console.error('[data] history.json read error:', err);
    return res.status(500).json({ error: 'Could not load history data' });
  }
});

// ── GET /api/users ───────────────────────────────────────────────────────────
router.get('/users', verifyToken, requireAdmin, (req, res) => {
  const users = db.prepare(
    'SELECT id, name, email, role, created_at FROM users ORDER BY created_at ASC'
  ).all();
  return res.json(users);
});

module.exports = router;
