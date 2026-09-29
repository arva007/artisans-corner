const User = require('../models/User');
const Vendor = require('../models/Vendor');
const generateToken = require('../utils/generateToken');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const normalizedEmail = (email || '').toLowerCase().trim();
    const normalizedName = (name || '').trim();

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // Default role is buyer; prevent non-admins from self-registering as admin
    const assignedRole = role === 'vendor' ? 'vendor' : 'buyer';

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password,
      role: assignedRole,
    });

    let vendor = null;
    if (assignedRole === 'vendor') {
      try {
        vendor = await Vendor.create({
          owner: user._id,
          storeName: `${normalizedName}'s Studio`,
          description: `Handcrafted artisanal goods and creations by ${normalizedName}.`,
          logo: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=300&q=80',
          banner: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1200&q=80',
        });
      } catch (vErr) {
        console.warn('[Register] Vendor studio init notice:', vErr.message);
      }
    }

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        bio: user.bio,
        vendor: vendor
          ? {
              _id: vendor._id,
              storeName: vendor.storeName,
              logo: vendor.logo,
              description: vendor.description,
            }
          : null,
      },
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map((e) => e.message).join(', ');
      return res.status(400).json({ success: false, message });
    }
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const normalizedEmail = (email || '').toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    // Reject unregistered email
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Secure password verification
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if user is a vendor and fetch store details
    let vendor = null;
    if (user.role === 'vendor') {
      vendor = await Vendor.findOne({ owner: user._id });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        bio: user.bio,
        vendor: vendor
          ? {
              _id: vendor._id,
              storeName: vendor.storeName,
              logo: vendor.logo,
              description: vendor.description,
            }
          : null,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let vendor = null;

    if (user.role === 'vendor') {
      vendor = await Vendor.findOne({ owner: user._id });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        bio: user.bio,
        createdAt: user.createdAt,
        vendor: vendor
          ? {
              _id: vendor._id,
              storeName: vendor.storeName,
              logo: vendor.logo,
              description: vendor.description,
            }
          : null,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, bio, profileImage, currentPassword, newPassword } = req.body;

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (profileImage !== undefined) user.profileImage = profileImage;

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: 'Please provide current password' });
      }
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      }
      user.password = newPassword;
    }

    await user.save();

    let vendor = null;
    if (user.role === 'vendor') {
      vendor = await Vendor.findOne({ owner: user._id });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        bio: user.bio,
        vendor,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
};
