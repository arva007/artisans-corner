const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Vendor = require('../models/Vendor');

// Protect routes - require valid JWT
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'artisan_corner_default_jwt_secret'
      );

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found with this token' });
      }

      return next();
    } catch (err) {
      console.error('Auth verification error:', err.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

// Authorize roles (e.g. 'vendor', 'admin')
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'unauthenticated'}' is not authorized to access this route`,
      });
    }
    next();
  };
};

// Require vendor profile and attach req.vendor
const requireVendor = async (req, res, next) => {
  if (!req.user || (req.user.role !== 'vendor' && req.user.role !== 'admin')) {
    return res.status(403).json({
      success: false,
      message: 'Access restricted to approved vendors',
    });
  }

  try {
    const vendor = await Vendor.findOne({ owner: req.user._id });
    if (!vendor && req.user.role !== 'admin') {
      return res.status(404).json({
        success: false,
        message: 'Vendor store profile not found. Please complete the seller onboarding first.',
      });
    }

    req.vendor = vendor;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  protect,
  authorize,
  requireVendor,
};
