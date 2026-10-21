require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./database/db');
const seedDatabase = require('./database/seed');

const movieRoutes = require('./routes/movieRoutes');
const showRoutes = require('./routes/showRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend development
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Auto-seed database if empty
try {
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM movies');
  const row = countStmt.get();
  if (!row || row.count === 0) {
    console.log('Database empty, running initial seed...');
    seedDatabase();
  }
} catch (err) {
  console.warn('Seeding check warning:', err.message);
  seedDatabase();
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SmartTheater Review 4 Prototype API',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/movies', movieRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/tickets', ticketRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.url} not found.` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🎬 SmartTheater Review 4 Prototype Backend Running`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🩺 Health: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});
