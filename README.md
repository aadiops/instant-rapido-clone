# Instant Rapido — Clone

This repository contains a lightweight clone / starter scaffold for an Instant Rapido-style booking app.

Structure
- backend/ — Express API with SQLite database
- frontend/ — Next.js frontend that calls the backend

Quick start (local)

1. Clone

   git clone https://github.com/aadiops/instant-rapido-clone.git
   cd instant-rapido-clone

2. Start backend

   cd backend
   npm install
   node ../scripts/seed-backend.js   # creates data/dev.db and seeds listings
   npm run dev

   The backend will run on http://localhost:4000

3. Start frontend (new terminal)

   cd frontend
   npm install
   NEXT_PUBLIC_API_URL=http://localhost:4000 npm run dev

   Open http://localhost:3000

Notes
- This is a demo scaffold. For production, add auth, validation, payment, and secure storage.
- Database file is at backend/data/dev.db — it is gitignored.
