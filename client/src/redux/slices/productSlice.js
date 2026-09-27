import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await API.get('/products', { params });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to load products'
      );
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/products', { params: { featured: 'true', limit: 8 } });
      return response.data.products;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to load featured products'
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`/products/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Product not found'
      );
    }
  }
);

export const addProductReview = createAsyncThunk(
  'products/addReview',
  async ({ productId, rating, comment }, { rejectWithValue }) => {
    try {
      const response = await API.post(`/products/${productId}/reviews`, { rating, comment });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to submit review'
      );
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    featuredProducts: [],
    currentProduct: null,
    reviews: [],
    totalProducts: 0,
    totalPages: 1,
    currentPage: 1,
    loading: false,
    detailLoading: false,
    error: null,
    reviewError: null,
    reviewSuccess: false,
  },
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
      state.reviews = [];
    },
    resetReviewState: (state) => {
      state.reviewError = null;
      state.reviewSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalProducts = action.payload.totalProducts;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Featured
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredProducts = action.payload;
      })
      // Product Detail
      .addCase(fetchProductById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentProduct = action.payload.product;
        state.reviews = action.payload.reviews || [];
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      })
      // Review
      .addCase(addProductReview.pending, (state) => {
        state.reviewError = null;
        state.reviewSuccess = false;
      })
      .addCase(addProductReview.fulfilled, (state, action) => {
        state.reviewSuccess = true;
        state.reviews.unshift(action.payload.review);
        if (state.currentProduct) {
          state.currentProduct.rating = action.payload.productRating;
          state.currentProduct.numberOfReviews = action.payload.numberOfReviews;
        }
      })
      .addCase(addProductReview.rejected, (state, action) => {
        state.reviewError = action.payload;
      });
  },
});

export const { clearCurrentProduct, resetReviewState } = productSlice.actions;
export default productSlice.reducer;
