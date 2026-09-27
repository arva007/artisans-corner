const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const Review = require('../models/Review');
const { uploadImageBuffer } = require('../services/cloudinaryService');

// @desc    Get all products with filtering, search, sorting & pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sort,
      vendor,
      page = 1,
      limit = 12,
      featured,
    } = req.query;

    const query = {};

    // Search by text or keyword
    if (search && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { tags: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Vendor filter
    if (vendor) {
      query.vendor = vendor;
    }

    // Featured filter
    if (featured === 'true') {
      query.featured = true;
    }

    // Price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && minPrice !== '') {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined && maxPrice !== '') {
        query.price.$lte = Number(maxPrice);
      }
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'price_asc') {
      sortOptions = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOptions = { price: -1 };
    } else if (sort === 'rating') {
      sortOptions = { rating: -1, numberOfReviews: -1 };
    } else if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('vendor', 'storeName logo rating')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: products.length,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limitNum),
      currentPage: pageNum,
      products,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'vendor',
      'storeName logo description rating numberOfReviews'
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Fetch product reviews
    const reviews = await Review.find({ product: product._id })
      .populate('buyer', 'name profileImage')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      product,
      reviews,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Vendor only)
const createProduct = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ owner: req.user._id });
    if (!vendor) {
      return res.status(403).json({
        success: false,
        message: 'You must have an active artisan store to list products',
      });
    }

    const { name, description, price, category, stock, featured, tags, image: imageUrl } = req.body;

    if (!name || !description || price === undefined || !category || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, description, price, category, stock',
      });
    }

    let finalImageUrl = imageUrl;

    // Handle file upload if provided
    if (req.file) {
      finalImageUrl = await uploadImageBuffer(req.file.buffer, 'artisan_products');
    }

    if (!finalImageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a product image or upload an image file',
      });
    }

    const parsedTags = typeof tags === 'string'
      ? tags.split(',').map((t) => t.trim()).filter(Boolean)
      : Array.isArray(tags) ? tags.filter(Boolean) : [];

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      category,
      stock: Number(stock),
      image: finalImageUrl,
      vendor: vendor._id,
      featured: featured === 'true' || featured === true,
      tags: parsedTags,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Vendor owner or Admin)
const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Verify ownership
    const vendor = await Vendor.findOne({ owner: req.user._id });
    const isOwner = vendor && product.vendor.toString() === vendor._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this product',
      });
    }

    const { name, description, price, category, stock, featured, tags, image: imageUrl } = req.body;

    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (category) product.category = category;
    if (stock !== undefined) product.stock = Number(stock);
    if (featured !== undefined) product.featured = featured === 'true' || featured === true;
    if (tags !== undefined) {
      product.tags = typeof tags === 'string'
        ? tags.split(',').map((t) => t.trim()).filter(Boolean)
        : Array.isArray(tags) ? tags.filter(Boolean) : [];
    }

    // If new file uploaded
    if (req.file) {
      product.image = await uploadImageBuffer(req.file.buffer, 'artisan_products');
    } else if (imageUrl) {
      product.image = imageUrl;
    }

    await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Vendor owner or Admin)
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const vendor = await Vendor.findOne({ owner: req.user._id });
    const isOwner = vendor && product.vendor.toString() === vendor._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product',
      });
    }

    // Delete associated reviews
    await Review.deleteMany({ product: product._id });
    await Product.findByIdAndDelete(product._id);

    res.json({
      success: true,
      message: 'Product removed successfully',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
