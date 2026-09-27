const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Add a review for a product (Verified Buyers Only)
// @route   POST /api/products/:id/reviews
// @access  Private (Verified Buyer)
const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both a star rating (1-5) and a written review comment',
      });
    }

    const numRating = Number(rating);
    if (numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if buyer has already reviewed this product
    const alreadyReviewed = await Review.findOne({
      buyer: req.user._id,
      product: productId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this handcrafted item',
      });
    }

    // Verify buyer has purchased the product in a completed/paid order
    const hasPurchased = await Order.findOne({
      buyer: req.user._id,
      'orderItems.product': productId,
      paymentStatus: 'completed',
    });

    if (!hasPurchased && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Verified purchase required: Only customers who bought this item can leave a review.',
      });
    }

    const review = await Review.create({
      buyer: req.user._id,
      product: productId,
      rating: numRating,
      comment: comment.trim(),
    });

    const populatedReview = await Review.findById(review._id).populate('buyer', 'name profileImage');

    // Retrieve updated product rating
    const updatedProduct = await Product.findById(productId).select('rating numberOfReviews');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully. Thank you for supporting this artisan!',
      review: populatedReview,
      productRating: updatedProduct.rating,
      numberOfReviews: updatedProduct.numberOfReviews,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all reviews for a product
// @route   GET /api/products/:id/reviews
// @access  Public
const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.id })
      .populate('buyer', 'name profileImage')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addReview,
  getProductReviews,
};
