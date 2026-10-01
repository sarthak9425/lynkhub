const mongoose = require('mongoose');

const SocialLinkSchema = new mongoose.Schema({
  platform: {
    type: String,
    enum: ['github', 'linkedin', 'twitter', 'portfolio', 'resume', 'youtube', 'instagram', 'facebook', 'website', 'other'],
    default: 'website'
  },
  label: { type: String, trim: true },
  url: { type: String, required: true, trim: true }
}, { _id: true });

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required']
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  otpCode: {
    type: String
  },
  otpExpires: {
    type: Date
  },
  otpPurpose: {
    type: String,
    enum: ['registration', 'login', 'password-reset']
  },
  isOtpVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores and hyphens']
  },
  avatarUrl: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: '',
    maxlength: [300, 'Bio cannot exceed 300 characters']
  },
  socialLinks: [SocialLinkSchema],
  theme: {
    type: String,
    enum: ['corporate-trust', 'bitcoin-gold', 'dark-slate', 'minimal-light', 'gradient'],
    default: 'corporate-trust'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
