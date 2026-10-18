require('dotenv').config();
const app = require('./app');
const connectDB = require('./db');
const logger = require('./logger');

const PORT = process.env.PORT || 3000;
if (!process.env.JWT_SECRET || !process.env.MONGODB_URI)
{
  console.error('Missing JWT_SECRET or MONGODB_URI in .env file');
  process.exit(1);
}
async function startServer()
{
  try
  {
    await connectDB();
    app.listen(PORT, () =>
    {
      logger.info('Server started', { port: PORT });
    });
  }
  catch (errors)
  {
    logger.error('Startup failed: ' + errors.message);
    process.exit(1);
  }
}
startServer();