const Stripe = require('stripe');

const secretKey = process.env.STRIPE_SECRET_KEY || '';
const isConfigured = secretKey.startsWith('sk_live_') || secretKey.startsWith('sk_test_');

let stripe = null;
if (isConfigured && !secretKey.includes('placeholder')) {
  try {
    stripe = Stripe(secretKey);
  } catch (err) {
    console.warn('[Stripe] Failed to initialize Stripe client:', err.message);
  }
}

module.exports = {
  stripe,
  isConfigured: !!stripe,
};
