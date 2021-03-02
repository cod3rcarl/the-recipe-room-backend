const dotenv = require("dotenv");
dotenv.config();

const config = {
  SECRET: process.env.SESSION_SECRET,
  CONNECT: process.env.MONGO_DB_CONNECTION,

  PORT: process.env.PORT,

  ACCESS_KEY: process.env.S3_ACCESS_KEY,
  ACCESS_SECRET: process.env.S3_ACCESS_SECRET,

  NODE_ENV: process.env.NODE_ENV,
  CLIENT_URL: process.env.CLIENT_URL,

  FROM_EMAIL: process.env.FROM_EMAIL,
  FROM_NAME: process.env.FROM_NAME,
  MAIL_KEY: process.env.MAIL_KEY,

  JWT_ACCOUNT_ACTIVATION: process.env.JWT_ACCOUNT_ACTIVATION,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE,
  JWT_RESET_PASSWORD: process.env.JWT_RESET_PASSWORD,
  JWT_COOKIE_EXPIRE: process.env.JWT_COOKIE_EXPIRE,

  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_EMAIL: process.env.SMTP_EMAIL,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,

  GOOGLE_CLIENT: process.env.GOOGLE_CLIENT,
  GOOGLE_EMAIL: process.env.GOOGLE_EMAIL,
  GOOGLE_SECRET: process.env.GOOGLE_SECRET,
  GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
  GOOGLE_ACCESS_TOKEN: process.env.GOOGLE_ACCESS_TOKEN,
  GOOGLE_EXPIRES: process.env.GOOGLE_EXPIRES,
  GOOGLE_SCOPE: process.env.GOOGLE_SCOPE,
};

module.exports = config;
