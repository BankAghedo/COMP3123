const logger = require('./logger');
exports.notFound = (req, res) =>
{
  res.status(404).json({ status: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
};

exports.errorHandler = (errors, req, res, next) =>
{
  let status = 500;
  let message = 'Internal server error';
  if (errors.type === 'entity.parse.failed')
  {
    status = 400;
    message = 'Malformed JSON body';
  }
  else if (errors.code === 11000)
  {
    const field = Object.keys(errors.keyPattern || {})[0] || 'field';
    status = 409;
    message = `${field} already exists`;
  }
  else if (errors.name === 'ValidationError')
  {
    status = 400;
    message = Object.values(errors.errors).map((e) => e.message).join(', ');
  }
  else if (errors.name === 'CastError')
  {
    status = 400;
    message = `Invalid ${errors.path}`;
  }
  if (status === 500) 
  {
    logger.error(errors.message, { stack: errors.stack, path: req.originalUrl });
  }
  else
  {
    logger.warn(message, { path: req.originalUrl });
  }
  res.status(status).json({ status: false, message });
};
