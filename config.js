const path = require('path');

// import .env variables
require('dotenv-safe').config();

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 3000,
  influx: {
    host: process.env.INFLUX_HOST || 'localhost',
    database: process.env.INFLUX_DB || 'modusbox',
  },
  redis: process.env.REDIS_URL || 'redis://localhost',
  expressLogs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  logLevel: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
};