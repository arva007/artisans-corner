const { stripe, isConfigured } = require('../config/stripe');

/**
 * Platform commission is 5%
 * e.g., $100 order:
 * platformFee = $5.00
 * vendorPayout = $95.00
 */
const calculateCommission = (totalAmount) => {
  const commissionRate = (Number(process.env.PLATFORM_COMMISSION_PERCENT) || 5) / 100;
  const platformFee = Math.round(totalAmount * commissionRate * 100) / 100;
  const vendorPayout = Math.round((totalAmount - platformFee) * 100) / 100;
  return {
    platformFee,
    vendorPayout,
    commissionRate,
  };
};

const createPaymentIntent = async (amountInDollars, metadata = {}) => {
  const amountInCents = Math.round(amountInDollars * 100);
  const { platformFee, vendorPayout } = calculateCommission(amountInDollars);

  if (isConfigured && stripe) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'usd',
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          ...metadata,
          platformFee: platformFee.toString(),
          vendorPayout: vendorPayout.toString(),
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        isSimulated: false,
        platformFee,
        vendorPayout,
      };
    } catch (err) {
      console.warn('[Stripe] PaymentIntent creation failed, falling back to simulated mode:', err.message);
    }
  }

  // Graceful simulation mode for development/demo when Stripe credentials are not provided
  const mockIntentId = `pi_sim_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  return {
    clientSecret: `${mockIntentId}_secret_test`,
    paymentIntentId: mockIntentId,
    isSimulated: true,
    platformFee,
    vendorPayout,
  };
};

module.exports = {
  calculateCommission,
  createPaymentIntent,
};
