const rateLimitStore = new Map();

const isRateLimited = (ip) => {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 90;

  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, { count: 1, startTime: now });
    return false;
  }

  const data = rateLimitStore.get(ip);

  if (now - data.startTime > windowMs) {
    rateLimitStore.set(ip, { count: 1, startTime: now });
    return false;
  }

  if (data.count >= maxRequests) {
    return true;
  }

  data.count += 1;
  return false;
};

const rateLimiter = (req, res, next) => {
  if (req.path.startsWith('/threads')) {
    const ip = req.ip;
    if (isRateLimited(ip)) {
      return res.status(429).json({ status: 'fail', message: 'Too Many Requests' });
    }
  }
  return next();
};

rateLimiter.rateLimitStore = rateLimitStore;
rateLimiter.isRateLimited = isRateLimited;

module.exports = rateLimiter;
