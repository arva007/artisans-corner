import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        {/* Value props bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
            paddingBottom: '3rem',
            borderBottom: '1px solid #332f2c',
            marginBottom: '3rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'rgba(192, 108, 78, 0.15)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Heart size={20} />
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>100% Handcrafted</div>
              <div style={{ fontSize: '0.8rem', color: '#9c9590' }}>Directly from independent maker studios</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'rgba(61, 90, 69, 0.2)',
                color: 'var(--secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={20} />
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>Fair Artisan Payouts</div>
              <div style={{ fontSize: '0.8rem', color: '#9c9590' }}>Artisans keep 95% of every transaction</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'rgba(217, 154, 56, 0.2)',
                color: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Truck size={20} />
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>Mindful Shipping</div>
              <div style={{ fontSize: '0.8rem', color: '#9c9590' }}>Carefully packed with eco-conscious materials</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <RotateCcw size={20} />
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>Buyer Protection</div>
              <div style={{ fontSize: '0.8rem', color: '#9c9590' }}>Verified purchases and secure checkout</div>
            </div>
          </div>
        </div>

        {/* Footer links */}
        <div className="footer-grid">
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                fontFamily: 'var(--font-serif)',
                fontSize: '1.4rem',
                color: '#fff',
                marginBottom: '1rem',
              }}
            >
              <Sparkles size={20} color="var(--primary)" />
              Artisan's Corner
            </div>
            <p style={{ fontSize: '0.9rem', color: '#9c9590', marginBottom: '1.5rem', maxWidth: '320px' }}>
              Celebrating traditional craftsmanship, natural materials, and the human hands behind slow-made treasures.
            </p>
          </div>

          <div>
            <div className="footer-heading">Marketplace</div>
            <ul className="footer-links">
              <li><Link to="/products?category=Ceramics%20%26%20Pottery">Ceramics & Pottery</Link></li>
              <li><Link to="/products?category=Woodwork%20%26%20Furniture">Woodwork & Furniture</Link></li>
              <li><Link to="/products?category=Textiles%20%26%20Leather">Textiles & Leather</Link></li>
              <li><Link to="/products?category=Jewelry%20%26%20Accessories">Jewelry & Accessories</Link></li>
              <li><Link to="/products?category=Candles%20%26%20Apothecary">Candles & Botanicals</Link></li>
            </ul>
          </div>

          <div>
            <div className="footer-heading">For Artisans</div>
            <ul className="footer-links">
              <li><Link to="/become-seller">Open a Maker Studio</Link></li>
              <li><Link to="/dashboard/seller">Seller Dashboard</Link></li>
              <li><span style={{ color: '#9c9590' }}>5% Transparent Platform Fee</span></li>
              <li><span style={{ color: '#9c9590' }}>Direct Stripe Payouts</span></li>
            </ul>
          </div>

          <div>
            <div className="footer-heading">Platform</div>
            <ul className="footer-links">
              <li><Link to="/orders">Order Tracking</Link></li>
              <li><Link to="/profile">Account Settings</Link></li>
              <li><span style={{ color: '#9c9590' }}>Demo Credentials in README</span></li>
              <li><span style={{ color: '#9c9590' }}>MERN Multi-Vendor Architecture</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>© {new Date().getFullYear()} Artisan's Corner Inc. All rights reserved. Handcrafted with heart.</div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>Fair Trade Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
