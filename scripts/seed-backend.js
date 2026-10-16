const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dataDir = path.join(__dirname, '..', 'backend', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const DB_PATH = path.join(dataDir, 'dev.db');
const db = new sqlite3.Database(DB_PATH);

const run = (sql) => new Promise((res, rej) => db.run(sql, (err) => err ? rej(err) : res()));

(async () => {
  try {
    await run(`CREATE TABLE IF NOT EXISTS listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      location TEXT,
      price_cents INTEGER
    )`);

    await run(`CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      listing_id INTEGER,
      name TEXT,
      email TEXT,
      date TEXT,
      seats INTEGER,
      created_at TEXT
    )`);

    const existing = await new Promise((res, rej) => db.get('SELECT COUNT(*) as c FROM listings', (err, row) => err ? rej(err) : res(row)));
    if (existing && existing.c === 0) {
      const stmt = db.prepare('INSERT INTO listings (title, description, location, price_cents) VALUES (?, ?, ?, ?)');
      stmt.run('Rapid City Downtown Ride', 'Quick city rides across downtown.', 'Rapid City', 499);
      stmt.run('Airport Express', 'Fast transfer to/from the airport.', 'Airport', 1299);
      stmt.run('Suburban Shuttle', 'Shared rides to suburbs.', 'Suburbia', 799);
      stmt.finalize();
      console.log('Seeded listings');
    } else {
      console.log('Listings already exist, skipping seed');
    }
    console.log('Database ready at', DB_PATH);
    db.close();
  } catch (e) {
    console.error('Seed failed:', e);
    process.exit(1);
  }
})();
