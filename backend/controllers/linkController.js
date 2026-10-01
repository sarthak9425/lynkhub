const crypto = require('crypto');
const ShortLink = require('../models/ShortLink');
const Click = require('../models/Click');

// URL syntax validator helper
const isValidUrl = (string) => {
  try {
    const parsed = new URL(string);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (err) {
    return false;
  }
};

// Generate random 6-character alphanumeric slug
const generateRandomSlug = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let slug = '';
  for (let i = 0; i < 6; i++) {
    slug += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return slug;
};

// @desc    Create short URL
// @route   POST /api/links
// @access  Private
const createShortLink = async (req, res) => {
  try {
    let { longUrl, customSlug } = req.body;

    if (!longUrl) {
      return res.status(400).json({ success: false, message: 'Long URL is required' });
    }

    // Prepend https:// if no protocol provided
    if (!/^https?:\/\//i.test(longUrl)) {
      longUrl = 'https://' + longUrl;
    }

    if (!isValidUrl(longUrl)) {
      return res.status(400).json({ success: false, message: 'Invalid URL syntax or protocol. Must start with http:// or https://' });
    }

    let slug = '';
    if (customSlug && customSlug.trim() !== '') {
      slug = customSlug.trim().toLowerCase();
      // Sanitize custom slug (alphanumeric, hyphens, underscores only)
      if (!/^[a-zA-Z0-9_-]+$/.test(slug)) {
        return res.status(400).json({ success: false, message: 'Custom slug can only contain letters, numbers, hyphens, and underscores' });
      }

      // Check if custom slug is reserved
      const reservedSlugs = ['api', 'bio', 'r', 'login', 'signup', 'dashboard', 'profile', 'admin'];
      if (reservedSlugs.includes(slug)) {
        return res.status(400).json({ success: false, message: `The slug '${slug}' is reserved` });
      }

      const existingSlug = await ShortLink.findOne({ slug });
      if (existingSlug) {
        return res.status(400).json({ success: false, message: 'This custom slug is already taken. Please choose another.' });
      }
    } else {
      // Auto-generate unique 6-character random slug
      let isUnique = false;
      let attempts = 0;
      while (!isUnique && attempts < 10) {
        slug = generateRandomSlug();
        const existing = await ShortLink.findOne({ slug });
        if (!existing) isUnique = true;
        attempts++;
      }
      if (!isUnique) {
        return res.status(500).json({ success: false, message: 'Failed to generate unique slug. Please try again.' });
      }
    }

    const newLink = await ShortLink.create({
      userId: req.user._id,
      longUrl,
      slug
    });

    res.status(201).json({
      success: true,
      message: 'Short link created successfully',
      link: newLink
    });
  } catch (error) {
    console.error('Create Link Error:', error);
    res.status(500).json({ success: false, message: 'Server error while creating short link' });
  }
};

// @desc    Get user's short links with search & pagination
// @route   GET /api/links
// @access  Private
const getUserLinks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search ? req.query.search.trim() : '';

    const skip = (page - 1) * limit;

    const query = { userId: req.user._id };
    if (search) {
      query.$or = [
        { slug: { $regex: search, $options: 'i' } },
        { longUrl: { $regex: search, $options: 'i' } }
      ];
    }

    const totalLinks = await ShortLink.countDocuments(query);
    const links = await ShortLink.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      links,
      pagination: {
        totalLinks,
        currentPage: page,
        totalPages: Math.ceil(totalLinks / limit),
        limit
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching user links' });
  }
};

// @desc    Delete short link
// @route   DELETE /api/links/:id
// @access  Private
const deleteShortLink = async (req, res) => {
  try {
    const link = await ShortLink.findOne({ _id: req.params.id, userId: req.user._id });
    if (!link) {
      return res.status(404).json({ success: false, message: 'Short link not found' });
    }

    // Delete link and all click analytics associated with it
    await ShortLink.deleteOne({ _id: link._id });
    await Click.deleteMany({ shortLinkId: link._id });

    res.json({ success: true, message: 'Short link and analytics deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting short link' });
  }
};

// @desc    Get user analytics for dashboard charts
// @route   GET /api/links/analytics
// @access  Private
const getUserAnalytics = async (req, res) => {
  try {
    // Get all user links
    const userLinks = await ShortLink.find({ userId: req.user._id }).select('_id slug');
    const linkIds = userLinks.map(l => l._id);

    if (linkIds.length === 0) {
      return res.json({
        success: true,
        analytics: {
          totalClicks: 0,
          clicksOverTime: [],
          topReferrers: [],
          deviceDistribution: []
        }
      });
    }

    // Total aggregate clicks
    const totalClicks = await Click.countDocuments({ shortLinkId: { $in: linkIds } });

    // 1. Clicks over time (grouped by date formatted YYYY-MM-DD for last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const clicksOverTimeRaw = await Click.aggregate([
      {
        $match: {
          shortLinkId: { $in: linkIds },
          clickedAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$clickedAt" } },
          clicks: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const clicksOverTime = clicksOverTimeRaw.map(item => ({
      date: item._id,
      clicks: item.clicks
    }));

    // 2. Top referrers
    const topReferrersRaw = await Click.aggregate([
      { $match: { shortLinkId: { $in: linkIds } } },
      { $group: { _id: "$referrer", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const topReferrers = topReferrersRaw.map(item => ({
      name: item._id || 'Direct / None',
      count: item.count
    }));

    // 3. Device distribution (desktop vs mobile vs tablet)
    const deviceDistRaw = await Click.aggregate([
      { $match: { shortLinkId: { $in: linkIds } } },
      { $group: { _id: "$deviceType", count: { $sum: 1 } } }
    ]);

    const deviceMap = { desktop: 0, mobile: 0, tablet: 0 };
    deviceDistRaw.forEach(item => {
      if (item._id) deviceMap[item._id] = item.count;
    });

    const deviceDistribution = [
      { name: 'Desktop', value: deviceMap.desktop },
      { name: 'Mobile', value: deviceMap.mobile },
      { name: 'Tablet', value: deviceMap.tablet }
    ];

    res.json({
      success: true,
      analytics: {
        totalClicks,
        clicksOverTime,
        topReferrers,
        deviceDistribution
      }
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching analytics' });
  }
};

module.exports = {
  createShortLink,
  getUserLinks,
  deleteShortLink,
  getUserAnalytics
};
