const Vendor = require('../models/Vendor');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Become a Seller (vendor onboarding)
// @route   POST /api/vendors/become-seller
// @access  Private
const becomeSeller = async (req, res, next) => {
  try {
    const { storeName, description, logo, banner, phone, address } = req.body;

    if (!storeName || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both store name and craft description',
      });
    }

    // Check if user is already a vendor
    const existingVendor = await Vendor.findOne({ owner: req.user._id });
    if (existingVendor) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active artisan store',
        vendor: existingVendor,
      });
    }

    // Check store name uniqueness
    const nameTaken = await Vendor.findOne({ storeName: { $regex: new RegExp(`^${storeName}$`, 'i') } });
    if (nameTaken) {
      return res.status(400).json({
        success: false,
        message: 'A store with this name already exists. Please choose a unique name.',
      });
    }

    // Create Vendor
    const vendor = await Vendor.create({
      owner: req.user._id,
      storeName,
      description,
      logo: logo || '',
      banner: banner || '',
      phone: phone || '',
      address: address || '',
    });

    // Upgrade user role
    await User.findByIdAndUpdate(req.user._id, { role: 'vendor' });

    res.status(201).json({
      success: true,
      message: 'Congratulations! Your artisan store has been successfully created.',
      vendor,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current vendor's profile
// @route   GET /api/vendors/me
// @access  Private (Vendor only)
const getMyVendorProfile = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ owner: req.user._id });
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor store not found' });
    }

    res.json({
      success: true,
      vendor,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update current vendor's store profile
// @route   PUT /api/vendors/me
// @access  Private (Vendor only)
const updateVendorProfile = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ owner: req.user._id });
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor store not found' });
    }

    const { storeName, description, logo, banner, phone, address } = req.body;

    if (storeName && storeName !== vendor.storeName) {
      const nameTaken = await Vendor.findOne({
        storeName: { $regex: new RegExp(`^${storeName}$`, 'i') },
        _id: { $ne: vendor._id },
      });
      if (nameTaken) {
        return res.status(400).json({
          success: false,
          message: 'A store with this name already exists',
        });
      }
      vendor.storeName = storeName;
    }

    if (description) vendor.description = description;
    if (logo !== undefined) vendor.logo = logo;
    if (banner !== undefined) vendor.banner = banner;
    if (phone !== undefined) vendor.phone = phone;
    if (address !== undefined) vendor.address = address;

    await vendor.save();

    res.json({
      success: true,
      message: 'Store profile updated successfully',
      vendor,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all products belonging to the logged-in vendor
// @route   GET /api/vendors/products
// @access  Private (Vendor only)
const getVendorProducts = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ owner: req.user._id });
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor store not found' });
    }

    const products = await Product.find({ vendor: vendor._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get vendor analytics & earnings
// @route   GET /api/vendors/analytics
// @access  Private (Vendor only)
const getVendorAnalytics = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ owner: req.user._id });
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor store not found' });
    }

    const totalProducts = await Product.countDocuments({ vendor: vendor._id });

    // Find all orders that contain at least one item from this vendor
    const orders = await Order.find({
      'orderItems.vendor': vendor._id,
      paymentStatus: 'completed',
    }).sort({ createdAt: -1 });

    let totalSales = 0;
    let totalItemsSold = 0;

    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        if (item.vendor.toString() === vendor._id.toString()) {
          totalSales += item.price * item.quantity;
          totalItemsSold += item.quantity;
        }
      });
    });

    totalSales = Math.round(totalSales * 100) / 100;
    const platformCommission = Math.round(totalSales * 0.05 * 100) / 100;
    const totalEarnings = Math.round((totalSales - platformCommission) * 100) / 100;

    // Recent orders snippet for vendor dashboard
    const recentOrders = orders.slice(0, 5).map((order) => {
      const vendorItems = order.orderItems.filter(
        (item) => item.vendor.toString() === vendor._id.toString()
      );
      const vendorSubtotal = vendorItems.reduce((acc, it) => acc + it.price * it.quantity, 0);

      return {
        _id: order._id,
        createdAt: order.createdAt,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        buyer: order.shippingAddress.fullName,
        itemsCount: vendorItems.length,
        vendorSubtotal: Math.round(vendorSubtotal * 100) / 100,
      };
    });

    res.json({
      success: true,
      analytics: {
        totalProducts,
        totalOrders: orders.length,
        totalItemsSold,
        totalSales,
        platformCommission,
        totalEarnings,
        commissionRate: 5,
        recentOrders,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get public vendor store by ID
// @route   GET /api/vendors/:id
// @access  Public
const getVendorPublicProfile = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.params.id).populate('owner', 'name email profileImage');
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Artisan store not found' });
    }

    const products = await Product.find({ vendor: vendor._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      vendor,
      products,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  becomeSeller,
  getMyVendorProfile,
  updateVendorProfile,
  getVendorProducts,
  getVendorAnalytics,
  getVendorPublicProfile,
};
