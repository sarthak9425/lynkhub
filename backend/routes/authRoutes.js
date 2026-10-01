const express = require('express');
const router = express.Router();
const {
  signup,
  verifyOtp,
  resendOtp,
  verifyEmail,
  login,
  verifyLoginOtp,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  getMe
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/signup', authLimiter, signup);
router.post('/verify-otp', authLimiter, verifyOtp);
router.post('/resend-otp', authLimiter, resendOtp);
router.post('/verify-email', verifyEmail);
router.post('/login', authLimiter, login);
router.post('/verify-login-otp', authLimiter, verifyLoginOtp);
router.post('/logout', logout);
router.post('/refresh', refreshToken);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);
router.get('/me', protect, getMe);

module.exports = router;
