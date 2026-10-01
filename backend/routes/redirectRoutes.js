const express = require('express');
const router = express.Router();
const { handleRedirect } = require('../controllers/redirectController');
const { redirectLimiter } = require('../middleware/rateLimiter');

router.get('/:slug', redirectLimiter, handleRedirect);

module.exports = router;
