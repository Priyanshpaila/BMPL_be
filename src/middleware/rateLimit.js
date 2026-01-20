const rateLimit = require("express-rate-limit");

// Basic anti-spam limiter for quote creation.
const rateLimitQuotes = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  limit: 60, // 60 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { rateLimitQuotes };
