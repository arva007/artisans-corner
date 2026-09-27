const express = require('express');
const router = express.Router();
const {
  becomeSeller,
  getMyVendorProfile,
  updateVendorProfile,
  getVendorProducts,
  getVendorAnalytics,
  getVendorPublicProfile,
} = require('../controllers/vendorController');
const { protect, requireVendor } = require('../middleware/auth');

router.post('/become-seller', protect, becomeSeller);
router.get('/me', protect, requireVendor, getMyVendorProfile);
router.put('/me', protect, requireVendor, updateVendorProfile);
router.get('/products', protect, requireVendor, getVendorProducts);
router.get('/analytics', protect, requireVendor, getVendorAnalytics);
router.get('/:id', getVendorPublicProfile);

module.exports = router;
