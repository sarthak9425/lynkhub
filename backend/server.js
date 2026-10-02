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

// ==================================================
// CORS CONFIGURATION
// ==================================================

const allowedOrigins = [
  'http://localhost:5173',
  'https://lynkhub.vercel.app',
  'https://lynkhub-git-main-lynk-hub.vercel.app'
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an Origin header
      // (Postman, server-to-server requests, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked for origin: ${origin}`)
      );
    },
    credentials: true
  })
);

// ==================================================
// BODY PARSERS
// ==================================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================================================
// COOKIE PARSER
// ==================================================

app.use(cookieParser());

// ==================================================
// HEALTH CHECK
// ==================================================

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'LynkHub API is running',
    environment: process.env.NODE_ENV || 'development'
  });
});

// ==================================================
// API ROUTES
// ==================================================

app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/profile', profileRoutes);
app.use('/r', redirectRoutes);

// ==================================================
// 404 HANDLER
// ==================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// ==================================================
// GLOBAL ERROR HANDLER
// ==================================================

app.use((err, req, res, next) => {
  console.error('Global Error:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// ==================================================
// SERVER
// ==================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `[Server] Running on port ${PORT} in ${
      process.env.NODE_ENV || 'development'
    } mode`
  );
});