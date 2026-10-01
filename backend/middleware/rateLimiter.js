const rateLimit = require('express-rate-limit');

// Rate limit for short URL creation: max 30 creations per 15 minutes per IP
const linkCreateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many link creation requests from this IP, please try again after 15 minutes.'
  }
});

// Rate limit for link redirection: max 200 redirects per minute per IP
const redirectLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Redirect rate limit exceeded, please slow down.'
  }
});

// Rate limit for auth endpoints: max 15 requests per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  }
});

module.exports = {
  linkCreateLimiter,
  redirectLimiter,
  authLimiter
};
