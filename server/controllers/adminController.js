const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');

// @desc    Get platform-wide analytics & revenue summary
// @route   GET /api/admin/analytics
// @access  Private (Admin only)
const getPlatformAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const buyersCount = await User.countDocuments({ role: 'buyer' });
    const vendorsCount = await User.countDocuments({ role: 'vendor' });
    const adminsCount = await User.countDocuments({ role: 'admin' });

    const totalStores = await Vendor.countDocuments();
    const totalProducts = await Product.countDocuments();

    // Order metrics
    const orders = await Order.find({ paymentStatus: 'completed' });
    const totalOrders = orders.length;

    let grossMerchandiseValue = 0;
    let totalPlatformCommission = 0;
    let totalVendorPayouts = 0;

    orders.forEach((order) => {
      grossMerchandiseValue += order.totalAmount;
      totalPlatformCommission += order.platformFee || 0;
      totalVendorPayouts += order.vendorPayout || 0;
    });

    grossMerchandiseValue = Math.round(grossMerchandiseValue * 100) / 100;
    totalPlatformCommission = Math.round(totalPlatformCommission * 100) / 100;
    totalVendorPayouts = Math.round(totalVendorPayouts * 100) / 100;

    // Recent activity
    const recentOrders = await Order.find()
      .populate('buyer', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      metrics: {
        totalUsers,
        breakdown: {
          buyers: buyersCount,
          vendors: vendorsCount,
          admins: adminsCount,
        },
        totalStores,
        totalProducts,
        totalOrders,
        grossMerchandiseValue,
        totalPlatformCommission,
        totalVendorPayouts,
        commissionRate: 5,
        recentOrders,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all registered users
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin only)
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['buyer', 'vendor', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role specified' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: `User role successfully updated to ${role}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all registered vendors
// @route   GET /api/admin/vendors
// @access  Private (Admin only)
const getAllVendors = async (req, res, next) => {
  try {
    const vendors = await Vendor.find()
      .populate('owner', 'name email createdAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: vendors.length,
      vendors,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin delete inappropriate product
// @route   DELETE /api/admin/products/:id
// @access  Private (Admin only)
const deleteProductByAdmin = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Review.deleteMany({ product: req.params.id });
    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Inappropriate product listing removed successfully by admin',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPlatformAnalytics,
  getAllUsers,
  updateUserRole,
  getAllVendors,
  deleteProductByAdmin,
};
