const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const requestLogger = require('./requestLogger');
const { apiLimiter } = require('./rateLimiters');
const { notFound, errorHandler } = require('./errorHandler');
const app = express();
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(requestLogger);
app.get('/health', (req, res) =>
{
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.status(200).json(
        {
        status: 'ok',
        uptime_seconds: Math.round(process.uptime()),
        timestamp: new Date().toISOString(),
        database: states[mongoose.connection.readyState],
        }
    );
});
app.use('/api', apiLimiter);
app.use('/api/v1/user', require('./userRoutes'));
app.use('/api/v1/emp', require('./employeeRoutes'));
app.use(notFound);
app.use(errorHandler);
module.exports = app;
