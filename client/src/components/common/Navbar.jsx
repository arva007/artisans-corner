import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import {
  ShoppingBag,
  Search,
  User as UserIcon,
  Store,
  ShieldAlert,
  Package,
  LogOut,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { itemsCount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar" id="main-navbar">
      <div className="container navbar-inner">
        {/* Brand */}
        <Link to="/" className="navbar-brand" id="navbar-brand-link">
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
            }}
          >
            <Sparkles size={22} />
          </div>
          <span>Artisan's</span> Corner
        </Link>

        {/* Global Search */}
        <form onSubmit={handleSearchSubmit} className="search-bar" id="navbar-search-form">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            id="navbar-search-input"
            placeholder="Search pottery, woodwork, handwoven textiles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        {/* Nav actions */}
        <div className="nav-links">
          <Link to="/products" className="nav-link" id="nav-explore-link">
            Explore All
          </Link>

          {/* Become Seller CTA for Buyers */}
          {(!user || user.role === 'buyer') && (
            <Link
              to={user ? '/become-seller' : '/login?redirect=/become-seller'}
              className="btn btn-outline btn-sm nav-become-seller-link"
              id="nav-become-seller-btn"
            >
              <Store size={15} />
              Become a Seller
            </Link>
          )}

          {/* Seller Dashboard quick link */}
          {user && (user.role === 'vendor' || user.role === 'admin') && (
            <Link
              to="/dashboard/seller"
              className="nav-link"
              id="nav-seller-dashboard-link"
              style={{ color: 'var(--primary)', fontWeight: 600 }}
            >
              <Store size={18} />
              Seller Studio
            </Link>
          )}

          {/* Admin Dashboard quick link */}
          {user && user.role === 'admin' && (
            <Link
              to="/dashboard/admin"
              className="nav-link"
              id="nav-admin-link"
              style={{ color: 'var(--secondary)', fontWeight: 600 }}
            >
              <ShieldAlert size={18} />
              Admin
            </Link>
          )}

          {/* Cart Icon */}
          <Link to="/cart" className="cart-btn" id="navbar-cart-btn" title="View Cart">
            <ShoppingBag size={20} />
            {itemsCount > 0 && (
              <span className="cart-count" id="navbar-cart-badge">
                {itemsCount}
              </span>
            )}
          </Link>

          {/* User Account Menu */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                id="navbar-user-dropdown-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{ borderRadius: 'var(--radius-full)', padding: '0.4rem 0.85rem' }}
              >
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <UserIcon size={16} />
                )}
                <span>{user.name.split(' ')[0]}</span>
                <ChevronDown size={14} />
              </button>

              {userDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    width: '230px',
                    backgroundColor: '#fff',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--border)',
                    padding: '0.65rem',
                    zIndex: 1000,
                  }}
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderBottom: '1px solid var(--border)',
                      marginBottom: '0.4rem',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                      {user.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {user.email}
                    </div>
                    <span
                      className={`badge ${
                        user.role === 'admin'
                          ? 'badge-secondary'
                          : user.role === 'vendor'
                          ? 'badge-primary'
                          : 'badge-amber'
                      }`}
                      style={{ marginTop: '0.4rem' }}
                    >
                      {user.role}
                    </span>
                  </div>

                  <Link
                    to="/profile"
                    className="sidebar-nav-item"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                  >
                    <UserIcon size={16} />
                    My Profile
                  </Link>

                  <Link
                    to="/orders"
                    className="sidebar-nav-item"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                  >
                    <Package size={16} />
                    My Purchases
                  </Link>

                  {user.role === 'vendor' && (
                    <Link
                      to="/dashboard/seller"
                      className="sidebar-nav-item"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                    >
                      <Store size={16} />
                      Artisan Studio
                    </Link>
                  )}

                  {user.role === 'admin' && (
                    <Link
                      to="/dashboard/admin"
                      className="sidebar-nav-item"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                    >
                      <ShieldAlert size={16} />
                      Platform Admin
                    </Link>
                  )}

                  {user.role === 'buyer' && (
                    <Link
                      to="/become-seller"
                      className="sidebar-nav-item"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', color: 'var(--primary)' }}
                    >
                      <Store size={16} />
                      Open an Artisan Shop
                    </Link>
                  )}

                  <div
                    style={{
                      borderTop: '1px solid var(--border)',
                      marginTop: '0.4rem',
                      paddingTop: '0.4rem',
                    }}
                  >
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="sidebar-nav-item"
                      id="navbar-logout-btn"
                      style={{
                        width: '100%',
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--danger)',
                        cursor: 'pointer',
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.85rem',
                      }}
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm" id="nav-login-btn">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" id="nav-register-btn">
                Join Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
