const crypto = require('crypto');

const hashIp = (ip) => {
  if (!ip) return 'unknown';
  return crypto.createHash('sha256').update(ip.toString()).digest('hex');
};

module.exports = hashIp;
