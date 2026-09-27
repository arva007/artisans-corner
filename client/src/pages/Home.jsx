import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeaturedProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import {
  Sparkles,
  ArrowRight,
  Store,
  ShieldCheck,
  Compass,
  Hammer,
  Feather,
  Flame,
  Award,
} from 'lucide-react';

const CATEGORIES = [
  { name: 'All', icon: Compass },
  { name: 'Ceramics & Pottery', icon: Flame },
  { name: 'Woodwork & Furniture', icon: Hammer },
  { name: 'Textiles & Leather', icon: Feather },
  { name: 'Jewelry & Accessories', icon: Sparkles },
  { name: 'Candles & Apothecary', icon: Award },
];

const Home = () => {
  const dispatch = useDispatch();
  const { featuredProducts, loading } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);

  return (
    <div id="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="hero-tag">
                <Sparkles size={16} />
                Curated Multi-Vendor Marketplace
              </div>
              <h1 className="hero-title">
                Handcrafted with <span style={{ color: 'var(--primary)', fontStyle: 'italic' }}>Heart</span>,<br />
                Traded with <span style={{ color: 'var(--secondary)' }}>Trust</span>.
              </h1>
              <p className="hero-subtitle">
                Connect directly with master potters, woodworkers, weavers, and jewelry artisans.
                Every piece is slow-made, authentic, and built to tell a story in your home.
              </p>
              <div className="hero-cta-group">
                <Link to="/products" className="btn btn-primary btn-lg" id="hero-explore-btn">
                  Explore Handcrafted Goods
                  <ArrowRight size={18} />
                </Link>
                {(!user || user.role === 'buyer') && (
                  <Link to="/become-seller" className="btn btn-outline btn-lg" id="hero-sell-btn">
                    <Store size={18} />
                    Become a Seller
                  </Link>
                )}
              </div>
            </div>

            <div className="hero-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=900&q=80"
                alt="Artisan ceramicist shaping pottery on a wheel"
                className="hero-main-img"
              />
              <div className="hero-badge-card">
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)',
                  }}
                >
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                    Verified Authenticity
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    100% human hands, zero factory mass-production
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills Bar */}
      <section style={{ backgroundColor: '#fff', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="category-bar">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  to={cat.name === 'All' ? '/products' : `/products?category=${encodeURIComponent(cat.name)}`}
                  className="category-pill"
                >
                  <Icon size={15} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                  {cat.name}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '2.5rem',
            }}
          >
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
                Studio Highlights
              </span>
              <h2>Featured Handcrafted Pieces</h2>
              <p>Hand-selected items from independent makers that embody mindful design.</p>
            </div>
            <Link
              to="/products"
              className="btn btn-outline btn-sm"
            >
              View Full Collection
              <ArrowRight size={15} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              Loading curated pieces...
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="product-grid" id="featured-products-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No featured products listed yet. Check back soon!
            </div>
          )}
        </div>
      </section>

      {/* Meet Featured Artisans / Vendors */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--bg-card-subtle)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
            <span className="badge badge-secondary" style={{ marginBottom: '0.5rem' }}>
              The Makers
            </span>
            <h2>Meet Our Featured Artisans</h2>
            <p>
              Get to know the individuals turning clay, timber, and fiber into enduring daily rituals.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
            }}
          >
            {/* Artisan 1 */}
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                  alt="Marcus Thorne"
                  style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ marginBottom: '0.2rem' }}>Marcus Thorne</h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                    Terra & Timber Studio
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Hood River, OR</div>
                </div>
              </div>
              <p style={{ fontSize: '0.925rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                "We hand-throw stoneware mugs and lathe-turn fallen hardwoods. Each tree and clay batch has its own spirit."
              </p>
              <Link to="/products?category=Ceramics%20%26%20Pottery" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                View Studio Catalog
              </Link>
            </div>

            {/* Artisan 2 */}
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80"
                  alt="Elena Rostova"
                  style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ marginBottom: '0.2rem' }}>Elena Rostova</h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--secondary)', fontWeight: 600 }}>
                    Luna Loom & Leather
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Asheville, NC</div>
                </div>
              </div>
              <p style={{ fontSize: '0.925rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                "Naturally dyed French flax linen and vegetable-tanned leather goods hand-stitched to endure generations."
              </p>
              <Link to="/products?category=Textiles%20%26%20Leather" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                View Studio Catalog
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Become a Seller CTA banner */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div
            style={{
              background: 'linear-gradient(135deg, #3d5a45 0%, #25392b 100%)',
              color: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              padding: '3.5rem 2.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-30px',
                right: '-30px',
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.04)',
                pointerEvents: 'none',
              }}
            />
            <span
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: 600,
                padding: '0.35rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '1rem',
              }}
            >
              Artisan Community
            </span>
            <h2 style={{ color: '#ffffff', marginBottom: '1rem', maxWidth: '620px' }}>
              Are you an independent maker with handcrafted goods to share?
            </h2>
            <p style={{ color: '#d5e2d8', maxWidth: '580px', marginBottom: '2rem', fontSize: '1.05rem' }}>
              Open your storefront on Artisan's Corner in minutes. Keep 95% of your earnings with our transparent 5% platform fee and reach conscious buyers worldwide.
            </p>
            <Link
              to="/become-seller"
              className="btn btn-primary btn-lg"
              id="cta-become-seller"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              Open Your Artisan Shop Today
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
