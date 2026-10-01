const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sendTokenCookies, clearTokenCookies, verifyRefreshToken } = require('../utils/jwt');
const sendOtpCode = require('../utils/sendOtpHelper');

// Helper to generate a random 6-digit numeric OTP code
const generate6DigitOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Register new user & generate 6-digit OTP verification code
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    const { name, email, phone, password, username } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    // Auto-generate username from email if not provided
    let finalUsername = username ? username.toLowerCase().trim() : email.split('@')[0].toLowerCase().replace(/[^a-z0-9_-]/g, '');
    let existingUsername = await User.findOne({ username: finalUsername });
    if (existingUsername && (!existingUser || existingUser.username !== finalUsername)) {
      finalUsername = `${finalUsername}_${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Generate 6-digit OTP code & 10-minute expiry with registration purpose
    const otpCode = generate6DigitOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    let user = existingUser;

    if (user) {
      if (user.isOtpVerified) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists. Please login.' });
      }
      // Re-use pending unverified account and update credentials & new OTP
      user.name = name;
      user.passwordHash = passwordHash;
      user.username = finalUsername;
      user.otpCode = otpCode;
      user.otpExpires = otpExpires;
      user.otpPurpose = 'registration';
      await user.save();
    } else {
      user = await User.create({
        name,
        email: email.toLowerCase(),
        username: finalUsername,
        passwordHash,
        isEmailVerified: false,
        isOtpVerified: false,
        otpCode,
        otpExpires,
        otpPurpose: 'registration',
        avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${finalUsername}`
      });
    }

    // Dispatch Email / SMS OTP
    await sendOtpCode({
      email: user.email,
      phone: phone || null,
      otpCode,
      recipientName: user.name,
      purpose: 'registration'
    });

    res.status(201).json({
      success: true,
      message: 'Account registered! A 6-digit registration OTP code has been sent to your email.',
      email: user.email,
      expiresInSeconds: 600
    });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during signup' });
  }
};

// @desc    Verify 6-digit Registration OTP code & issue authentication cookies
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and 6-digit OTP code are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found' });
    }

    if (user.isOtpVerified && !user.otpCode) {
      sendTokenCookies(res, user._id);
      return res.json({
        success: true,
        message: 'Account already verified.',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          isEmailVerified: true,
          avatarUrl: user.avatarUrl,
          theme: user.theme
        }
      });
    }

    if (!user.otpCode || user.otpCode !== otp.toString().trim() || user.otpPurpose !== 'registration') {
      return res.status(400).json({ success: false, message: 'Invalid registration OTP code. Please check and try again.' });
    }

    if (new Date() > new Date(user.otpExpires)) {
      return res.status(400).json({ success: false, message: 'Registration OTP code has expired. Please request a new OTP.' });
    }

    // Mark user as verified and invalidate OTP
    user.isOtpVerified = true;
    user.isEmailVerified = true;
    user.otpCode = undefined;
    user.otpExpires = undefined;
    user.otpPurpose = undefined;
    await user.save();

    // Issue JWT cookies
    sendTokenCookies(res, user._id);

    res.json({
      success: true,
      message: 'OTP verified successfully! Registration complete.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        isEmailVerified: user.isEmailVerified,
        avatarUrl: user.avatarUrl,
        theme: user.theme
      }
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ success: false, message: 'Server error during OTP verification' });
  }
};

// @desc    Resend 6-digit OTP code (Registration / Login / Password-Reset)
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOtp = async (req, res) => {
  try {
    const { email, phone, purpose = 'registration' } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found' });
    }

    // Generate new OTP & 10 min expiration
    const otpCode = generate6DigitOTP();
    user.otpCode = otpCode;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.otpPurpose = purpose;
    await user.save();

    // Dispatch OTP
    await sendOtpCode({
      email: user.email,
      phone: phone || null,
      otpCode,
      recipientName: user.name,
      purpose
    });

    res.json({
      success: true,
      message: 'A new 6-digit OTP code has been sent!',
      expiresInSeconds: 600
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error resending OTP' });
  }
};

// @desc    Verify credentials & dispatch 2-Step Login OTP
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Credentials valid: Generate 6-digit Login OTP & 10 min expiry
    const otpCode = generate6DigitOTP();
    user.otpCode = otpCode;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.otpPurpose = 'login';
    await user.save();

    // Send Login OTP to registered email
    await sendOtpCode({
      email: user.email,
      otpCode,
      recipientName: user.name,
      purpose: 'login'
    });

    res.json({
      success: true,
      requireOtp: true,
      message: 'Login credentials verified! A 6-digit login OTP code has been sent to your email.',
      email: user.email,
      expiresInSeconds: 600
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// @desc    Verify Login OTP & issue authentication cookies
// @route   POST /api/auth/verify-login-otp
// @access  Public
const verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and 6-digit login OTP code are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found' });
    }

    if (!user.otpCode || user.otpCode !== otp.toString().trim() || user.otpPurpose !== 'login') {
      return res.status(400).json({ success: false, message: 'Invalid login OTP code. Please check and try again.' });
    }

    if (new Date() > new Date(user.otpExpires)) {
      return res.status(400).json({ success: false, message: 'Login OTP code has expired. Please log in again.' });
    }

    // Invalidate Login OTP
    user.otpCode = undefined;
    user.otpExpires = undefined;
    user.otpPurpose = undefined;
    await user.save();

    // Issue JWT cookies
    sendTokenCookies(res, user._id);

    res.json({
      success: true,
      message: 'Logged in successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        isEmailVerified: user.isEmailVerified,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        theme: user.theme
      }
    });
  } catch (error) {
    console.error('Verify Login OTP Error:', error);
    res.status(500).json({ success: false, message: 'Server error during login OTP verification' });
  }
};

// @desc    Logout user & clear cookies
// @route   POST /api/auth/logout
// @access  Public
const logout = async (req, res) => {
  clearTokenCookies(res);
  res.json({ success: true, message: 'Logged out successfully' });
};

// @desc    Refresh access token using httpOnly refreshToken cookie
// @route   POST /api/auth/refresh
// @access  Public
const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ success: false, message: 'No refresh token provided' });
    }

    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    sendTokenCookies(res, user._id);

    res.json({ success: true, message: 'Tokens refreshed' });
  } catch (error) {
    clearTokenCookies(res);
    res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }
};

// @desc    Forgot Password - generate 6-digit reset OTP and email user
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      const otpCode = generate6DigitOTP();
      user.otpCode = otpCode;
      user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      user.otpPurpose = 'password-reset';
      await user.save();

      await sendOtpCode({
        email: user.email,
        otpCode,
        recipientName: user.name,
        purpose: 'password-reset'
      });
    }

    // Generic response to prevent email enumeration
    res.json({
      success: true,
      message: 'If an account exists with this email address, a 6-digit password reset OTP code has been sent.'
    });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ success: false, message: 'Server error processing forgot password request' });
  }
};

// @desc    Reset Password using 6-digit reset OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, 6-digit OTP code, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !user.otpCode || user.otpCode !== otp.toString().trim() || user.otpPurpose !== 'password-reset') {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset OTP code' });
    }

    if (new Date() > new Date(user.otpExpires)) {
      return res.status(400).json({ success: false, message: 'Password reset OTP code has expired' });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    user.otpCode = undefined;
    user.otpExpires = undefined;
    user.otpPurpose = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successfully. You can now log in.' });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ success: false, message: 'Server error during password reset' });
  }
};

// @desc    Simulate email verification token match
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = async (req, res) => {
  try {
    const { token, email } = req.body;

    if (!token || !email) {
      return res.status(400).json({ success: false, message: 'Token and email are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase(), emailVerificationToken: token });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification token' });
    }

    user.isEmailVerified = true;
    user.isOtpVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Email successfully verified!'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during email verification' });
  }
};

// @desc    Get current authenticated user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      username: req.user.username,
      isEmailVerified: req.user.isEmailVerified,
      avatarUrl: req.user.avatarUrl,
      bio: req.user.bio,
      socialLinks: req.user.socialLinks,
      theme: req.user.theme
    }
  });
};

module.exports = {
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
};
