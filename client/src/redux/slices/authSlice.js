import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

// Retrieve initial user from localStorage
const storedUser = localStorage.getItem('artisan_user');
let initialUserData = null;
if (storedUser) {
  try {
    initialUserData = JSON.parse(storedUser);
  } catch (e) {
    initialUserData = null;
  }
}

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      const { token, user } = response.data;
      const sessionData = { token, ...user };
      localStorage.setItem('artisan_user', JSON.stringify(sessionData));
      return sessionData;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Login failed. Please check credentials.'
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password, role }, { rejectWithValue }) => {
    try {
      const response = await API.post('/auth/register', { name, email, password, role });
      const { token, user } = response.data;
      const sessionData = { token, ...user };
      localStorage.setItem('artisan_user', JSON.stringify(sessionData));
      return sessionData;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
    }
  }
);

export const loadCurrentUser = createAsyncThunk(
  'auth/loadCurrent',
  async (_, { rejectWithValue, getState }) => {
    try {
      const response = await API.get('/auth/me');
      const currentUserState = getState().auth.user;
      const updatedUser = {
        ...currentUserState,
        ...response.data.user,
      };
      localStorage.setItem('artisan_user', JSON.stringify(updatedUser));
      return response.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Session expired');
    }
  }
);

export const becomeSeller = createAsyncThunk(
  'auth/becomeSeller',
  async (sellerData, { rejectWithValue, getState }) => {
    try {
      const response = await API.post('/vendors/become-seller', sellerData);
      const currentUserState = getState().auth.user;
      const updatedUser = {
        ...currentUserState,
        role: 'vendor',
        vendor: response.data.vendor,
      };
      localStorage.setItem('artisan_user', JSON.stringify(updatedUser));
      return response.data.vendor;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to create artisan store'
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue, getState }) => {
    try {
      const response = await API.put('/auth/profile', profileData);
      const currentUserState = getState().auth.user;
      const updatedUser = {
        ...currentUserState,
        ...response.data.user,
      };
      localStorage.setItem('artisan_user', JSON.stringify(updatedUser));
      return response.data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to update profile'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: initialUserData,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      state.successMessage = null;
      localStorage.removeItem('artisan_user');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Load Current
      .addCase(loadCurrentUser.fulfilled, (state, action) => {
        if (state.user) {
          state.user = { ...state.user, ...action.payload };
        }
      })
      .addCase(loadCurrentUser.rejected, (state) => {
        state.user = null;
        localStorage.removeItem('artisan_user');
      })
      // Become Seller
      .addCase(becomeSeller.fulfilled, (state, action) => {
        if (state.user) {
          state.user.role = 'vendor';
          state.user.vendor = action.payload;
        }
      })
      // Update Profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        if (state.user) {
          state.user = { ...state.user, ...action.payload };
        }
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
