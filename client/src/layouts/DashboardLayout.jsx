import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  DollarSign,
  Store,
  ArrowLeft,
} from 'lucide-react';

const DashboardLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className="dashboard-sidebar" id="seller-sidebar">
          <div style={{ marginBottom: '1.5rem', padding: '0 0.5rem' }}>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.825rem',
                color: 'var(--text-muted)',
              }}
            >
              <ArrowLeft size={14} /> Back to Storefront
            </Link>
            <h3 style={{ marginTop: '0.75rem', fontSize: '1.25rem' }}>Artisan Studio</h3>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Vendor Management
            </div>
          </div>

          <div className="sidebar-heading">Studio Overview</div>
          <NavLink
            to="/dashboard/seller"
            end
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
            id="seller-nav-overview"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <div className="sidebar-heading" style={{ marginTop: '1rem' }}>Catalog</div>
          <NavLink
            to="/dashboard/seller/products"
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
            id="seller-nav-products"
          >
            <Package size={18} />
            My Products
          </NavLink>

          <NavLink
            to="/dashboard/seller/products/new"
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
            id="seller-nav-add-product"
          >
            <PlusCircle size={18} />
            Add New Craft
          </NavLink>

          <div className="sidebar-heading" style={{ marginTop: '1rem' }}>Sales & Growth</div>
          <NavLink
            to="/dashboard/seller/orders"
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
            id="seller-nav-orders"
          >
            <ShoppingBag size={18} />
            Customer Orders
          </NavLink>

          <NavLink
            to="/dashboard/seller/earnings"
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
            id="seller-nav-earnings"
          >
            <DollarSign size={18} />
            Earnings & Fees
          </NavLink>

          <div className="sidebar-heading" style={{ marginTop: '1rem' }}>Settings</div>
          <NavLink
            to="/dashboard/seller/profile"
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
            id="seller-nav-profile"
          >
            <Store size={18} />
            Store Profile
          </NavLink>
        </aside>

        {/* Main Content */}
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
