const router = require('express').Router();
const { signup, login } = require('./userController');
const v = require('./validators');
const { authLimiter } = require('./rateLimiters');
router.post('/signup', authLimiter, v.signup, signup);
router.post('/login', authLimiter, v.login, login);
module.exports = router;
