const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { addReview, getProductReviews } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Reviews sub-routes
router.route('/:id/reviews')
  .get(getProductReviews)
  .post(protect, addReview);

// Products routes
router.route('/')
  .get(getProducts)
  .post(protect, authorize('vendor', 'admin'), upload.single('image'), createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, authorize('vendor', 'admin'), upload.single('image'), updateProduct)
  .delete(protect, authorize('vendor', 'admin'), deleteProduct);

module.exports = router;
