import { createSlice } from '@reduxjs/toolkit';

// Retrieve stored cart from localStorage
const storedCart = localStorage.getItem('artisan_cart');
let initialCartItems = [];
if (storedCart) {
  try {
    initialCartItems = JSON.parse(storedCart);
  } catch (e) {
    initialCartItems = [];
  }
}

const calculateTotals = (items) => {
  const itemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  // Free standard shipping over $75, otherwise $8 flat
  const shipping = subtotal > 75 || subtotal === 0 ? 0 : 8.0;
  // Estimated sales tax (approx 6%)
  const estimatedTax = Math.round(subtotal * 0.06 * 100) / 100;
  const total = Math.round((subtotal + shipping + estimatedTax) * 100) / 100;

  return {
    itemsCount,
    subtotal: Math.round(subtotal * 100) / 100,
    shipping,
    estimatedTax,
    total,
  };
};

const initialCalculations = calculateTotals(initialCartItems);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: initialCartItems,
    ...initialCalculations,
    shippingAddress: localStorage.getItem('artisan_shipping')
      ? JSON.parse(localStorage.getItem('artisan_shipping'))
      : {
          fullName: '',
          address: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'United States',
          phone: '',
        },
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.product === item.product);

      if (existItem) {
        // Prevent exceeding available stock
        const newQty = existItem.quantity + (item.quantity || 1);
        if (newQty <= item.stock) {
          existItem.quantity = newQty;
        } else {
          existItem.quantity = item.stock; // Cap at max available stock
        }
      } else {
        const initialQty = Math.min(item.quantity || 1, item.stock);
        state.cartItems.push({
          ...item,
          quantity: initialQty,
        });
      }

      // Recalculate & Persist
      const totals = calculateTotals(state.cartItems);
      Object.assign(state, totals);
      localStorage.setItem('artisan_cart', JSON.stringify(state.cartItems));
    },

    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cartItems = state.cartItems.filter((x) => x.product !== productId);

      const totals = calculateTotals(state.cartItems);
      Object.assign(state, totals);
      localStorage.setItem('artisan_cart', JSON.stringify(state.cartItems));
    },

    increaseQuantity: (state, action) => {
      const productId = action.payload;
      const item = state.cartItems.find((x) => x.product === productId);

      if (item && item.quantity < item.stock) {
        item.quantity += 1;
        const totals = calculateTotals(state.cartItems);
        Object.assign(state, totals);
        localStorage.setItem('artisan_cart', JSON.stringify(state.cartItems));
      }
    },

    decreaseQuantity: (state, action) => {
      const productId = action.payload;
      const item = state.cartItems.find((x) => x.product === productId);

      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.cartItems = state.cartItems.filter((x) => x.product !== productId);
        }
        const totals = calculateTotals(state.cartItems);
        Object.assign(state, totals);
        localStorage.setItem('artisan_cart', JSON.stringify(state.cartItems));
      }
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('artisan_shipping', JSON.stringify(action.payload));
    },

    clearCart: (state) => {
      state.cartItems = [];
      const totals = calculateTotals([]);
      Object.assign(state, totals);
      localStorage.removeItem('artisan_cart');
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  saveShippingAddress,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
