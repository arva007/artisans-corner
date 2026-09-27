const express = require('express');
const router = express.Router();
const { createIntent, handleWebhook } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/create-intent', protect, createIntent);
router.post('/webhook', handleWebhook);

module.exports = router;
