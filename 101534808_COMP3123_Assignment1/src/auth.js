const User = require('./User');
const { verifyToken } = require('./Services');
const logger = require('./logger');

async function auth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header)
    {
      logger.warn('Auth failed: missing token', { path: req.originalUrl });
      return res.status(401).json({ status: false, message: 'Authentication token missing' });
    }
    if (!header.startsWith('Bearer '))
    {
      logger.warn('Auth failed: missing token', { path: req.originalUrl });
      return res.status(401).json({ status: false, message: 'Authentication token missing' });
    }
    const token = header.split(' ')[1];
    let payload;
    try
    {
      payload = verifyToken(token);
    }
    catch (errors)
    {
      if (errors.name === 'TokenExpiredError')
      {
        logger.warn('Auth failed: token expired', { path: req.originalUrl });
        return res.status(401).json({ status: false, message: 'Token expired' });
      }
      logger.warn('Auth failed: invalid token', { path: req.originalUrl });
      return res.status(401).json({ status: false, message: 'Invalid token' });
    }
    const user = await User.findById(payload.id);
    if (!user)
    {
      logger.warn('Auth failed: user from token does not exist');
      return res.status(401).json({ status: false, message: 'Invalid token' });
    }
    req.user = { id: user._id.toString() };
    next();
  }
  catch (errors)
  {
    next(errors);
  }
}
module.exports = auth;
