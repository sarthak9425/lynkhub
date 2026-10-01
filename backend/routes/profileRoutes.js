const express = require('express');
const router = express.Router();
const {
  getMyProfile,
  updateMyProfile,
  getPublicBioByUsername
} = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

// Public route for viewing bio profiles
router.get('/public/:username', getPublicBioByUsername);

// Protected routes for editing logged-in user's profile
router.get('/me', protect, getMyProfile);
router.put('/me', protect, updateMyProfile);

module.exports = router;
