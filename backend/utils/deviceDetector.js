const useragent = require('useragent');

const detectDevice = (req) => {
  const uaString = req.headers['user-agent'] || '';
  const agent = useragent.parse(uaString);
  const device = agent.device.toString().toLowerCase();

  if (device.includes('ipad') || device.includes('tablet') || device.includes('kindle') || device.includes('playbook')) {
    return 'tablet';
  } else if (device.includes('iphone') || device.includes('android') || device.includes('mobile') || device.includes('phone')) {
    return 'mobile';
  }

  // Fallback check on user-agent header directly
  if (/mobile|android|iphone|ipad|phone/i.test(uaString)) {
    if (/ipad|tablet/i.test(uaString)) {
      return 'tablet';
    }
    return 'mobile';
  }

  return 'desktop';
};

module.exports = detectDevice;
