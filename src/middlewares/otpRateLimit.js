const rateLimit = require('express-rate-limit');

const verifyOtpRateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 10 minutes
  max: 5,
  message: 'Too many Attems !!',
  standardHeaders: true,
  legacyHeaders: false,
});


module.exports = verifyOtpRateLimiter;
