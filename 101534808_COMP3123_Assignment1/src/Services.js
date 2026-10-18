const jwt = require('jsonwebtoken');
function signToken(user)
{
  const payload = { id: user._id.toString() };
  const secret = process.env.JWT_SECRET;
  const options = { expiresIn: process.env.JWT_EXPIRES_IN || '1h' };
  return jwt.sign(payload, secret, options);
}
function verifyToken(token)
{
  return jwt.verify(token, process.env.JWT_SECRET);
}
module.exports = { signToken, verifyToken };