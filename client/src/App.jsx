import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadCurrentUser } from './redux/slices/authSlice';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';

// Route Guards
import ProtectedRoute from './components/routing/ProtectedRoute';
import VendorRoute from './components/routing/VendorRoute';
import AdminRoute from './components/routing/AdminRoute';

// Public & Buyer Pages
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetails from './pages/ProductDetails';
import VendorStorePage from './pages/VendorStorePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmation from './pages/OrderConfirmation';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import BecomeSellerPage from './pages/BecomeSellerPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Vendor Studio Pages
import SellerDashboard from './pages/vendor/SellerDashboard';
import SellerProducts from './pages/vendor/SellerProducts';
import AddEditProduct from './pages/vendor/AddEditProduct';
import SellerOrders from './pages/vendor/SellerOrders';
import SellerEarnings from './pages/vendor/SellerEarnings';
import SellerProfile from './pages/vendor/SellerProfile';

// Admin Control Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminVendors from './pages/admin/AdminVendors';
import AdminOrders from './pages/admin/AdminOrders';

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // If user token exists in storage, refresh current user session from API
    if (user?.token) {
      dispatch(loadCurrentUser());
    }
  }, [dispatch]);

  return (
    <Routes>
      {/* Public & Customer Storefront Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/vendor/:id" element={<VendorStorePage />} />
        <Route path="/cart" element={<CartPage />} />

        {/* Protected Buyer Routes */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-confirmation/:id"
          element={
            <ProtectedRoute>
              <OrderConfirmation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/become-seller"
          element={
            <ProtectedRoute>
              <BecomeSellerPage />
            </ProtectedRoute>
          }
        />

        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected Vendor Studio Layout */}
      <Route
        path="/dashboard/seller"
        element={
          <VendorRoute>
            <DashboardLayout />
          </VendorRoute>
        }
      >
        <Route index element={<SellerDashboard />} />
        <Route path="products" element={<SellerProducts />} />
        <Route path="products/new" element={<AddEditProduct />} />
        <Route path="products/edit/:id" element={<AddEditProduct />} />
        <Route path="orders" element={<SellerOrders />} />
        <Route path="earnings" element={<SellerEarnings />} />
        <Route path="profile" element={<SellerProfile />} />
      </Route>

      {/* Protected Admin Control Layout */}
      <Route
        path="/dashboard/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="vendors" element={<AdminVendors />} />
        <Route path="orders" element={<AdminOrders />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
