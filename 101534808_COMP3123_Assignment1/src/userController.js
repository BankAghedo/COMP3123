const User = require('./User');
const { signToken } = require('./Services');
const logger = require('./logger');

exports.signup = async (req, res, next) =>
{
  try
  {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    logger.info('User registered', { userId: user._id.toString() });
    res.status(201).json({ status: true, message: 'User created successfully', user });
  }
  catch (errors)
  {
    next(errors);
  }
};

exports.login = async (req, res, next) =>
{
  try
  {
    const { username, email, password } = req.body;
    let user;
    if (email)
    {
      user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    }
    else
    {
      user = await User.findOne({ username: username }).select('+password');
    }
    if (!user)
    {
      logger.warn('Login failed: invalid credentials');
      return res.status(401).json({ status: false, message: 'Invalid username/email or password' });
    }
    const flag = await user.comparePassword(password);
    if (!flag)
    {
      logger.warn('Login failed: invalid credentials');
      return res.status(401).json({ status: false, message: 'Invalid username/email or password' });
    }
    logger.info('Login success', { userId: user._id.toString() });
    const token = signToken(user);
    res.status(200).json({ status: true, message: 'Login successful', token: token });
  }
  catch (errors)
  {
    next(errors);
  }
};