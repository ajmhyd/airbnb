require('dotenv').config();

module.exports = {
  env: {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  },
};
