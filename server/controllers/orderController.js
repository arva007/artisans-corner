const Order = require('../models/Order');
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const { calculateCommission } = require('../services/stripeService');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Buyer)
const createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod = 'Stripe',
      paymentStatus = 'completed',
      stripePaymentIntentId,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items provided' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city) {
      return res.status(400).json({ success: false, message: 'Please provide full shipping address details' });
    }

    // Verify each product in database, check stock, and compile validated items
    const validatedItems = [];
    let subtotal = 0;

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.name || item.product}`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${item.quantity}`,
        });
      }

      // Deduct stock
      product.stock -= item.quantity;
      await product.save();

      validatedItems.push({
        product: product._id,
        vendor: product.vendor,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: item.quantity,
      });

      subtotal += product.price * item.quantity;
    }

    const totalAmount = Math.round(subtotal * 100) / 100;
    const { platformFee, vendorPayout } = calculateCommission(totalAmount);

    const order = await Order.create({
      buyer: req.user._id,
      orderItems: validatedItems,
      shippingAddress,
      totalAmount,
      platformFee,
      vendorPayout,
      paymentMethod,
      paymentStatus,
      stripePaymentIntentId: stripePaymentIntentId || '',
      orderStatus: 'Processing',
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('buyer', 'name email')
      .populate('orderItems.product', 'name category image')
      .populate('orderItems.vendor', 'storeName logo');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: populatedOrder,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get logged in buyer's orders
// @route   GET /api/orders/my-orders
// @access  Private (Buyer)
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate('orderItems.vendor', 'storeName logo')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private (Buyer owner, Vendor with items, or Admin)
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name email')
      .populate('orderItems.product', 'name category image price')
      .populate('orderItems.vendor', 'storeName logo phone');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Authorization check
    const isBuyer = order.buyer._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    let isVendor = false;
    if (req.user.role === 'vendor') {
      const vendor = await Vendor.findOne({ owner: req.user._id });
      if (vendor) {
        isVendor = order.orderItems.some(
          (item) => item.vendor && item.vendor._id.toString() === vendor._id.toString()
        );
      }
    }

    if (!isBuyer && !isAdmin && !isVendor) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Vendor or Admin)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    const allowedStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status. Allowed: ${allowedStatuses.join(', ')}`,
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check permissions
    const isAdmin = req.user.role === 'admin';
    let isVendor = false;
    if (req.user.role === 'vendor') {
      const vendor = await Vendor.findOne({ owner: req.user._id });
      if (vendor) {
        isVendor = order.orderItems.some(
          (item) => item.vendor.toString() === vendor._id.toString()
        );
      }
    }

    if (!isAdmin && !isVendor) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order',
      });
    }

    order.orderStatus = orderStatus;
    if (orderStatus === 'Delivered') {
      order.deliveredAt = Date.now();
    }

    await order.save();

    res.json({
      success: true,
      message: `Order status updated to ${orderStatus}`,
      order,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get orders relevant to logged in vendor
// @route   GET /api/orders/vendor/my-orders
// @access  Private (Vendor)
const getVendorOrders = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ owner: req.user._id });
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor store not found' });
    }

    const orders = await Order.find({
      'orderItems.vendor': vendor._id,
    })
      .populate('buyer', 'name email')
      .populate('orderItems.product', 'name image price')
      .sort({ createdAt: -1 });

    // Filter orderItems to highlight vendor's own items
    const filteredOrders = orders.map((order) => {
      const vendorItems = order.orderItems.filter(
        (it) => it.vendor.toString() === vendor._id.toString()
      );
      return {
        _id: order._id,
        createdAt: order.createdAt,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        shippingAddress: order.shippingAddress,
        buyer: order.buyer,
        orderItems: vendorItems,
        vendorSubtotal: vendorItems.reduce((acc, it) => acc + it.price * it.quantity, 0),
        totalAmount: order.totalAmount,
      };
    });

    res.json({
      success: true,
      count: filteredOrders.length,
      orders: filteredOrders,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/admin/all
// @access  Private (Admin)
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('buyer', 'name email')
      .populate('orderItems.vendor', 'storeName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getVendorOrders,
  getAllOrders,
};
