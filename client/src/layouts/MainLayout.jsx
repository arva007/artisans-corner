import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { Sparkles } from 'lucide-react';

const MainLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top artisanal banner */}
      <div
        style={{
          backgroundColor: 'var(--secondary)',
          color: '#ffffff',
          fontSize: '0.8rem',
          fontWeight: 500,
          textAlign: 'center',
          padding: '0.45rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          letterSpacing: '0.02em',
        }}
      >
        <Sparkles size={14} style={{ color: 'var(--accent)' }} />
        <span>Free standard shipping on handcrafted orders over $75 • Direct maker support</span>
      </div>

      <Navbar />

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
