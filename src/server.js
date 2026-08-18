// require('dotenv').config();
const express = require('express');
const path = require('path');
const { initializeDbSchema } = require('./db');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Database Schema and Dummy Data
initializeDbSchema();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from public folder
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api', routes);

// Fallback to index.html for frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
