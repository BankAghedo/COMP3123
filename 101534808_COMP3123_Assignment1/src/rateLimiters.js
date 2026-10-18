const rateLimit = require('express-rate-limit');
const logger = require('./logger');

const handler = (req, res) =>
{
  logger.warn('Rate limit exceeded', { path: req.originalUrl, ip: req.ip });
  res.status(429).json({ status: false, message: 'Too many requests, please try again later' });
};

exports.authLimiter = rateLimit(
    {
        windowMs: Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
        max: Number(process.env.AUTH_RATE_LIMIT_MAX) || 5,
        standardHeaders: true,
        legacyHeaders: false,
        handler,
    }
);

exports.apiLimiter = rateLimit(
    {
        windowMs: Number(process.env.API_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
        max: Number(process.env.API_RATE_LIMIT_MAX) || 100,
        standardHeaders: true,
        legacyHeaders: false,
        handler,
    }
);
