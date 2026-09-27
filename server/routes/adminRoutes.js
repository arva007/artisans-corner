const express = require('express');
const router = express.Router();
const {
  getPlatformAnalytics,
  getAllUsers,
  updateUserRole,
  getAllVendors,
  deleteProductByAdmin,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/analytics', getPlatformAnalytics);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.get('/vendors', getAllVendors);
router.delete('/products/:id', deleteProductByAdmin);

module.exports = router;
