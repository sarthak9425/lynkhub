const express = require('express');
const router = express.Router();
const {
  createShortLink,
  getUserLinks,
  deleteShortLink,
  getUserAnalytics
} = require('../controllers/linkController');
const { protect } = require('../middleware/auth');
const { linkCreateLimiter } = require('../middleware/rateLimiter');

router.use(protect);

router.post('/', linkCreateLimiter, createShortLink);
router.get('/', getUserLinks);
router.get('/analytics', getUserAnalytics);
router.delete('/:id', deleteShortLink);

module.exports = router;
