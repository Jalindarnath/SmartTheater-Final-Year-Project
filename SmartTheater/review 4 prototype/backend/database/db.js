const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const dbDir = __dirname;
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'smarttheater_review4.db');
const db = new DatabaseSync(dbPath);

// Enable WAL mode & foreign keys for SQLite performance & consistency
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

// Initialize database schema
function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS movies (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      genre TEXT NOT NULL,
      language TEXT NOT NULL,
      certification TEXT NOT NULL,
      duration_minutes INTEGER NOT NULL,
      rating REAL NOT NULL,
      tag TEXT NOT NULL,
      poster_url TEXT NOT NULL,
      description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS shows (
      id TEXT PRIMARY KEY,
      movie_id TEXT NOT NULL,
      theater_name TEXT NOT NULL,
      location TEXT NOT NULL,
      screen_name TEXT NOT NULL,
      show_datetime TEXT NOT NULL,
      format TEXT NOT NULL,
      standard_price REAL NOT NULL,
      premium_price REAL NOT NULL,
      FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS seats (
      id TEXT PRIMARY KEY,
      show_id TEXT NOT NULL,
      row_label TEXT NOT NULL,
      seat_number INTEGER NOT NULL,
      seat_label TEXT NOT NULL,
      seat_type TEXT NOT NULL,
      price REAL NOT NULL,
      is_booked INTEGER DEFAULT 0,
      FOREIGN KEY (show_id) REFERENCES shows(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      booking_ref TEXT UNIQUE NOT NULL,
      show_id TEXT NOT NULL,
      movie_title TEXT NOT NULL,
      theater_name TEXT NOT NULL,
      screen_name TEXT NOT NULL,
      show_datetime TEXT NOT NULL,
      seats_summary TEXT NOT NULL,
      seats_json TEXT NOT NULL,
      total_amount REAL NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_mobile TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Confirmed',
      created_at TEXT NOT NULL,
      FOREIGN KEY (show_id) REFERENCES shows(id)
    );

    CREATE TABLE IF NOT EXISTS tickets (
      id TEXT PRIMARY KEY,
      reference TEXT UNIQUE NOT NULL,
      booking_ref TEXT,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      subject TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      priority TEXT NOT NULL,
      assigned_team TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Open',
      confidence REAL NOT NULL,
      explanation TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
}

initSchema();

module.exports = db;
