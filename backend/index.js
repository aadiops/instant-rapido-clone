const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.join(__dirname, 'data', 'dev.db');
const db = new sqlite3.Database(DB_PATH);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 4000;

app.get('/health', (req, res) => res.json({ ok: true }));

app.get('/listings', (req, res) => {
  db.all('SELECT * FROM listings', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/listings/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM listings WHERE id = ?', id, (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  });
});

app.post('/bookings', (req, res) => {
  const { listing_id, name, email, date, seats } = req.body;
  if (!listing_id || !name || !email || !date) {
    return res.status(400).json({ error: 'listing_id, name, email and date are required' });
  }
  const stmt = db.prepare('INSERT INTO bookings (listing_id, name, email, date, seats, created_at) VALUES (?, ?, ?, ?, ?, datetime("now"))');
  stmt.run(listing_id, name, email, date, seats || 1, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    const bookingId = this.lastID;
    db.get('SELECT * FROM bookings WHERE id = ?', bookingId, (err2, row) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.status(201).json(row);
    });
  });
});

app.get('/bookings', (req, res) => {
  db.all('SELECT b.*, l.title as listing_title FROM bookings b LEFT JOIN listings l ON l.id = b.listing_id ORDER BY b.created_at DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Instant Rapido backend running on http://localhost:${PORT}`);
});
