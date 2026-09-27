import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import {
  BarChart3,
  Users,
  Store,
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';

const AdminLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className="dashboard-sidebar" id="admin-sidebar">
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
              <ShieldCheck size={22} style={{ color: 'var(--secondary)' }} />
              <h3 style={{ fontSize: '1.25rem' }}>Admin Control</h3>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Marketplace Operations
            </div>
          </div>

          <div className="sidebar-heading">Analytics</div>
          <NavLink
            to="/dashboard/admin"
            end
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
            id="admin-nav-analytics"
          >
            <BarChart3 size={18} />
            Platform Overview
          </NavLink>

          <div className="sidebar-heading" style={{ marginTop: '1rem' }}>Management</div>
          <NavLink
            to="/dashboard/admin/users"
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
            id="admin-nav-users"
          >
            <Users size={18} />
            Users & Roles
          </NavLink>

          <NavLink
            to="/dashboard/admin/vendors"
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
            id="admin-nav-vendors"
          >
            <Store size={18} />
            Artisan Stores
          </NavLink>

          <NavLink
            to="/dashboard/admin/orders"
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
            id="admin-nav-orders"
          >
            <ShoppingBag size={18} />
            Global Orders
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

export default AdminLayout;
