const logger = require('./logger');

module.exports = (req, res, next) =>
{
  const start = Date.now();
  res.on('finish', () =>
    {
    logger.info('request',
            {
            method: req.method,
            path: req.originalUrl,
            status: res.statusCode,
            ms: Date.now() - start,
            }
        );
    }
  );
  next();
};
