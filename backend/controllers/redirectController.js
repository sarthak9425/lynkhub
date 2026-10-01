const ShortLink = require('../models/ShortLink');
const Click = require('../models/Click');
const hashIp = require('../utils/hashIp');
const detectDevice = require('../utils/deviceDetector');

// @desc    Handle short link redirection & record analytics
// @route   GET /r/:slug
// @access  Public
const handleRedirect = async (req, res) => {
  try {
    const { slug } = req.params;

    const link = await ShortLink.findOne({ slug: slug.toLowerCase() });
    if (!link) {
      return res.status(404).send(`
        <!Timeline html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Link Not Found</title>
          <style>
            body { font-family: system-ui, sans-serif; background: #050506; color: #EDEDEF; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
            h1 { font-size: 3rem; margin-bottom: 0.5rem; color: #5E6AD2; }
            p { color: #8A8F98; font-size: 1.25rem; }
            a { color: #5E6AD2; text-decoration: none; border-bottom: 1px dashed #5E6AD2; }
          </style>
        </head>
        <body>
          <h1>404 - Short Link Not Found</h1>
          <p>The link <code>/r/${slug}</code> does not exist or has been removed.</p>
          <p><a href="/">Return to Home</a></p>
        </body>
        </html>
      `);
    }

    // Extract visitor details
    const deviceType = detectDevice(req);
    const rawReferrer = req.headers['referer'] || req.headers['referrer'] || 'Direct';
    
    // Clean referrer URL
    let referrer = 'Direct';
    if (rawReferrer && rawReferrer !== 'Direct') {
      try {
        const refUrl = new URL(rawReferrer);
        referrer = refUrl.hostname.replace(/^www\./, '');
      } catch (err) {
        referrer = 'Direct';
      }
    }

    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const hashedIp = hashIp(clientIp);

    // Asynchronously log click data
    Click.create({
      shortLinkId: link._id,
      clickedAt: new Date(),
      referrer,
      deviceType,
      hashedIp
    }).catch(err => console.error('Error logging click analytics:', err));

    // Increment click counter
    ShortLink.updateOne({ _id: link._id }, { $inc: { clicksCount: 1 } })
      .catch(err => console.error('Error updating click count:', err));

    // 302 Redirect to destination URL
    return res.redirect(302, link.longUrl);
  } catch (error) {
    console.error('Redirect Error:', error);
    res.status(500).send('Server Error during redirect');
  }
};

module.exports = { handleRedirect };
