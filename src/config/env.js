const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath, override: true });

const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  APP_NAME: process.env.APP_NAME || 'GymRestBack',
  JWT_SECRET: process.env.JWT_SECRET || 'change-me',
  TOKEN_EXPIRES_IN: process.env.TOKEN_EXPIRES_IN || '1d',
  DB_DRIVER: process.env.DB_DRIVER || 'sqlite',
  SQLITE_FILE: process.env.SQLITE_FILE || 'dev.db',
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || 'http://localhost:5173'
};

module.exports = { ENV };

