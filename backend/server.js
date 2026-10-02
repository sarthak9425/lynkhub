const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const linkRoutes = require('./routes/linkRoutes');
const profileRoutes = require('./routes/profileRoutes');
const redirectRoutes = require('./routes/redirectRoutes');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Trust Render's reverse proxy
// Required for express-rate-limit to correctly handle
// X-Forwarded-For headers in production.
app.set('trust proxy', 1);

// CORS configuration
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'LynkHub API is running',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/profile', profileRoutes);
app.use('/r', redirectRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `[Server] Running on port ${PORT} in ${
      process.env.NODE_ENV || 'development'
    } mode`
  );
});