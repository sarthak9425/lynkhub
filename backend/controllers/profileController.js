const User = require('../models/User');

// @desc    Get logged in user's profile
// @route   GET /api/profile/me
// @access  Private
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching user profile' });
  }
};

// @desc    Update user bio profile details & theme
// @route   PUT /api/profile/me
// @access  Private
const updateMyProfile = async (req, res) => {
  try {
    const { name, bio, avatarUrl, socialLinks, theme, username } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name.trim();
    if (bio !== undefined) user.bio = bio.trim();
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl.trim();
    if (theme && ['corporate-trust', 'bitcoin-gold', 'dark-slate', 'minimal-light', 'gradient'].includes(theme)) {
      user.theme = theme;
    }

    // Handle username update if requested
    if (username && username.toLowerCase().trim() !== user.username) {
      const cleanUsername = username.toLowerCase().trim();
      if (!/^[a-zA-Z0-9_-]+$/.test(cleanUsername)) {
        return res.status(400).json({ success: false, message: 'Username can only contain letters, numbers, hyphens, and underscores' });
      }

      const existingUser = await User.findOne({ username: cleanUsername });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({ success: false, message: 'Username is already taken' });
      }
      user.username = cleanUsername;
    }

    // Validate and update social links array
    if (Array.isArray(socialLinks)) {
      user.socialLinks = socialLinks.map(link => ({
        platform: link.platform || 'website',
        label: link.label ? link.label.trim() : '',
        url: link.url ? link.url.trim() : ''
      })).filter(l => l.url.length > 0);
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        socialLinks: user.socialLinks,
        theme: user.theme
      }
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ success: false, message: 'Server error updating profile' });
  }
};

// @desc    Get public Bio Profile by username
// @route   GET /api/profile/public/:username
// @access  Public
const getPublicBioByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username: username.toLowerCase() })
      .select('name username avatarUrl bio socialLinks theme createdAt');

    if (!user) {
      return res.status(404).json({ success: false, message: 'Bio profile not found' });
    }

    res.json({
      success: true,
      profile: {
        name: user.name,
        username: user.username,
        avatarUrl: user.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${user.username}`,
        bio: user.bio || '',
        socialLinks: user.socialLinks || [],
        theme: user.theme || 'dark-slate',
        memberSince: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching bio profile' });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  getPublicBioByUsername
};
