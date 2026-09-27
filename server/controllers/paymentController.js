const Order = require('../models/Order');
const { stripe, isConfigured } = require('../config/stripe');
const { createPaymentIntent, calculateCommission } = require('../services/stripeService');

// @desc    Create Stripe Payment Intent
// @route   POST /api/payments/create-intent
// @access  Private
const createIntent = async (req, res, next) => {
  try {
    const { amount, metadata = {} } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Please provide a valid payment amount' });
    }

    const { platformFee, vendorPayout, commissionRate } = calculateCommission(amount);

    const intentData = await createPaymentIntent(amount, {
      ...metadata,
      userId: req.user._id.toString(),
      userEmail: req.user.email,
    });

    res.json({
      success: true,
      clientSecret: intentData.clientSecret,
      paymentIntentId: intentData.paymentIntentId,
      isSimulated: intentData.isSimulated,
      commissionBreakdown: {
        totalAmount: amount,
        platformFee,
        vendorPayout,
        commissionPercentage: commissionRate * 100,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Handle Stripe Webhook Events
// @route   POST /api/payments/webhook
// @access  Public (Stripe signature protected)
const handleWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  if (isConfigured && stripe && webhookSecret && !webhookSecret.includes('placeholder')) {
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error(`[Stripe Webhook] Verification error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  } else {
    // Graceful fallback for development / test with mock webhook payloads
    try {
      event = typeof req.body === 'string' || Buffer.isBuffer(req.body)
        ? JSON.parse(req.body.toString())
        : req.body;
    } catch (err) {
      return res.status(400).send(`Invalid webhook payload: ${err.message}`);
    }
  }

  try {
    if (event && event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data?.object;
      if (paymentIntent?.id) {
        const order = await Order.findOne({ stripePaymentIntentId: paymentIntent.id });
        if (order) {
          order.paymentStatus = 'completed';
          await order.save();
          console.log(`[Stripe Webhook] Order ${order._id} marked completed via webhook`);
        }
      }
    } else if (event && event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data?.object;
      if (paymentIntent?.id) {
        const order = await Order.findOne({ stripePaymentIntentId: paymentIntent.id });
        if (order) {
          order.paymentStatus = 'failed';
          await order.save();
          console.log(`[Stripe Webhook] Order ${order._id} marked failed via webhook`);
        }
      }
    }

    res.status(200).json({ received: true });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createIntent,
  handleWebhook,
};
