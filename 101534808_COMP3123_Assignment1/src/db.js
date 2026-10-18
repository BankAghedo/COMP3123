const mongoose = require('mongoose');
const logger = require('./logger');

module.exports = async function connectDB()
{
  await mongoose.connect(process.env.MONGODB_URI);
  logger.info('MongoDB connected', { database: mongoose.connection.name });
};
