// Cyber Risk Command Center — SQLite database layer
// Uses Node.js built-in `node:sqlite` (available since v22.5.0).
// Fully synchronous API — safe to call at module load time.

const path   = require('path');
const fs     = require('fs');
const bcrypt = require('bcryptjs');

const { DatabaseSync } = require('node:sqlite');

const DB_DIR  = process.env.DB_DIR  || path.join(__dirname, 'db');
const DB_PATH = process.env.DB_PATH || path.join(DB_DIR, 'crcc.sqlite');

// Ensure db directory exists
fs.mkdirSync(DB_DIR, { recursive: true });

// Open / create database
const db = new DatabaseSync(DB_PATH);

// WAL mode + foreign keys
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

// ── Schema ─────────────────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT    NOT NULL,
    email         TEXT    UNIQUE NOT NULL COLLATE NOCASE,
    password_hash TEXT    NOT NULL,
    role          TEXT    NOT NULL DEFAULT 'user',
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS indicators_override (
    id               INTEGER PRIMARY KEY CHECK (id = 1),
    data             TEXT    NOT NULL,
    updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_by_email TEXT
  );
`);

// ── Seed default admin ─────────────────────────────────────────────────────────
const adminExists = db.prepare("SELECT 1 FROM users WHERE email = 'admin@crcc.io'").get();
if (!adminExists) {
  const hash = bcrypt.hashSync('Admin@1234', 12);
  db.prepare(
    "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)"
  ).run('Admin', 'admin@crcc.io', hash, 'admin');
  console.log('[db] Default admin seeded: admin@crcc.io / Admin@1234');
}

module.exports = db;
