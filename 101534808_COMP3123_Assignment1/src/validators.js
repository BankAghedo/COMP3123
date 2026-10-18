const { body, param, query, validationResult } = require('express-validator');
const logger = require('./logger');

function validate(req, res, next)
{
  const errors = validationResult(req);
  if (!errors.isEmpty())
  {
    const list = errors.array().map((e) =>
    {
      return { field: e.path, message: e.msg };
    });
    logger.warn('Validation failed', { path: req.originalUrl });
    return res.status(400).json({ status: false, message: 'Validation failed', errors: list });
  }
  next();
}

function checkLoginFields(req, res, next)
{
  if (!req.body.username && !req.body.email)
  {
    logger.warn('Validation failed', { path: req.originalUrl });
    return res.status(400).json({
      status: false,
      message: 'Validation failed',
      errors: [{ field: 'username', message: 'username or email is required' }],
    });
  }
  next();
}

const signupRules = [
  body('username').isString().isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters'),
  body('email').isEmail().withMessage('A valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('password').matches(/[A-Z]/).withMessage('Password needs an uppercase letter'),
  body('password').matches(/[0-9]/).withMessage('Password needs a number'),
];

const loginRules = [
  body('password').notEmpty().withMessage('Password is required'),
  body('username').optional().isString().withMessage('Invalid username'),
  body('email').optional().isEmail().withMessage('A valid email is required'),
];

const createEmployeeRules = [
  body('first_name').notEmpty().isLength({ max: 50 }).withMessage('first name is required (max 50)'),
  body('last_name').notEmpty().isLength({ max: 50 }).withMessage('last name is required (max 50)'),
  body('email').isEmail().withMessage('A valid email is required'),
  body('position').notEmpty().isLength({ max: 100 }).withMessage('position is required (max 100)'),
  body('salary').isFloat({ gt: 0 }).withMessage('salary must be a positive number'),
  body('date_of_joining').isISO8601().withMessage('date of joining must be a valid date'),
  body('department').notEmpty().isLength({ max: 100 }).withMessage('department is required (max 100)'),
];

const updateEmployeeRules = [
  body('first_name').optional().isLength({ min: 1, max: 50 }).withMessage('first name must be 1-50 characters'),
  body('last_name').optional().isLength({ min: 1, max: 50 }).withMessage('last name must be 1-50 characters'),
  body('email').optional().isEmail().withMessage('A valid email is required'),
  body('position').optional().isLength({ min: 1, max: 100 }).withMessage('position must be 1-100 characters'),
  body('salary').optional().isFloat({ gt: 0 }).withMessage('salary must be a positive number'),
  body('date_of_joining').optional().isISO8601().withMessage('date of joining must be a valid date'),
  body('department').optional().isLength({ min: 1, max: 100 }).withMessage('department must be 1-100 characters'),
];

const idInUrl = param('eid').isMongoId().withMessage('Invalid employee id');
const idInQuery = query('eid').isMongoId().withMessage('A valid eid query parameter is required');

module.exports = {
  signup: [signupRules, validate],
  login: [checkLoginFields, loginRules, validate],
  createEmployee: [createEmployeeRules, validate],
  updateEmployee: [idInUrl, updateEmployeeRules, validate],
  getEmployee: [idInUrl, validate],
  deleteEmployee: [idInQuery, validate],
};