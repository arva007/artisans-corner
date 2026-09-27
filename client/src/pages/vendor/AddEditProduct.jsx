import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../../services/api';
import {
  Upload,
  ArrowLeft,
  Check,
  AlertCircle,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';

const CATEGORIES = [
  'Ceramics & Pottery',
  'Woodwork & Furniture',
  'Textiles & Leather',
  'Jewelry & Accessories',
  'Candles & Apothecary',
  'Art & Prints',
  'Glassware & Metalwork',
];

const AddEditProduct = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Ceramics & Pottery',
    price: '',
    stock: 1,
    description: '',
    tags: '',
    featured: false,
    image: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      API.get(`/products/${id}`)
        .then((res) => {
          const p = res.data.product;
          setFormData({
            name: p.name,
            category: p.category,
            price: p.price,
            stock: p.stock,
            description: p.description,
            tags: p.tags ? p.tags.join(', ') : '',
            featured: p.featured || false,
            image: p.image || '',
          });
          setImagePreview(p.image);
        })
        .catch((err) => {
          setError(err.response?.data?.message || 'Failed to fetch product details');
        })
        .finally(() => setFetching(false));
    }
  }, [id, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      setImageFile(file);
      // Generate preview using URL.createObjectURL or FileReader
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.description || formData.price === '' || formData.stock === '') {
      setError('Please complete all required fields');
      return;
    }

    if (!imageFile && !formData.image) {
      setError('Please select a product image for your handcrafted piece');
      return;
    }

    setLoading(true);

    try {
      // Use FormData to support Cloudinary image uploads via Multer
      const data = new FormData();
      data.append('name', formData.name);
      data.append('category', formData.category);
      data.append('price', formData.price);
      data.append('stock', formData.stock);
      data.append('description', formData.description);
      data.append('tags', formData.tags);
      data.append('featured', formData.featured);

      if (imageFile) {
        data.append('image', imageFile);
      } else if (formData.image) {
        data.append('image', formData.image);
      }

      const headers = { 'Content-Type': 'multipart/form-data' };

      if (isEditMode) {
        await API.put(`/products/${id}`, data, { headers });
      } else {
        await API.post('/products', data, { headers });
      }

      navigate('/dashboard/seller/products');
    } catch (err) {
      console.error('Save product error:', err);
      setError(err.response?.data?.message || 'Failed to save handcrafted product');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--text-muted)' }}>
        Loading product details...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '840px' }} id="add-edit-product-page">
      <div style={{ marginBottom: '2rem' }}>
        <Link
          to="/dashboard/seller/products"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            marginBottom: '0.75rem',
          }}
        >
          <ArrowLeft size={14} /> Back to Catalog
        </Link>
        <h2>{isEditMode ? 'Edit Handcrafted Piece' : 'List a New Handcrafted Creation'}</h2>
        <p>Provide mindful details about materials, craft techniques, and high-resolution imagery</p>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: 'var(--danger-bg)',
            color: 'var(--danger)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card" style={{ padding: '2.5rem' }}>
        {/* Title */}
        <div className="form-group">
          <label className="form-label" htmlFor="product-name-input">
            Product Title *
          </label>
          <input
            type="text"
            id="product-name-input"
            name="name"
            className="form-control"
            placeholder="e.g. Hand-Thrown Speckled Ceramic Mug"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Category & Price */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="product-category-select">
              Craft Category *
            </label>
            <select
              id="product-category-select"
              name="category"
              className="form-control"
              value={formData.category}
              onChange={handleInputChange}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="product-price-input">
              Price (USD $) *
            </label>
            <input
              type="number"
              id="product-price-input"
              name="price"
              min="0"
              step="0.01"
              className="form-control"
              placeholder="e.g. 45.00"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* Stock & Tags */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="product-stock-input">
              Available Inventory Stock *
            </label>
            <input
              type="number"
              id="product-stock-input"
              name="stock"
              min="0"
              className="form-control"
              placeholder="e.g. 10"
              value={formData.stock}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="product-tags-input">
              Search Tags (comma-separated)
            </label>
            <input
              type="text"
              id="product-tags-input"
              name="tags"
              className="form-control"
              placeholder="e.g. stoneware, coffee, clay, handmade"
              value={formData.tags}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Image Upload with Live Preview */}
        <div className="form-group" style={{ margin: '1.5rem 0' }}>
          <label className="form-label">Product Image (Cloudinary Integration) *</label>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: imagePreview ? '180px 1fr' : '1fr',
              gap: '1.5rem',
              alignItems: 'center',
            }}
          >
            {imagePreview && (
              <div
                style={{
                  width: '180px',
                  height: '180px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg-card-subtle)',
                }}
              >
                <img
                  src={imagePreview}
                  alt="Product Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  id="image-preview"
                />
              </div>
            )}

            <div
              style={{
                border: '2px dashed var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                textAlign: 'center',
                backgroundColor: 'var(--bg-card-subtle)',
                cursor: 'pointer',
              }}
              onClick={() => document.getElementById('image-file-input').click()}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.75rem',
                }}
              >
                <Upload size={20} />
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                {imagePreview ? 'Click to Change Image' : 'Select Product Image'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                PNG, JPG, WEBP up to 5MB (Uploaded securely via Cloudinary)
              </div>
              <input
                type="file"
                id="image-file-input"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label" htmlFor="product-description-input">
            Artisan Story & Materials *
          </label>
          <textarea
            id="product-description-input"
            name="description"
            className="form-control"
            rows={5}
            placeholder="Describe your process, the woods or clays utilized, food-safety, and dimension specifications..."
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Featured checkbox */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', margin: '1rem 0 2rem' }}>
          <input
            type="checkbox"
            id="featured-checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleInputChange}
            style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
          />
          <label htmlFor="featured-checkbox" style={{ fontSize: '0.9rem', cursor: 'pointer', fontWeight: 500 }}>
            Highlight as Featured piece on marketplace storefront
          </label>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            id="save-product-btn"
            disabled={loading}
            style={{ flex: 1 }}
          >
            {loading ? 'Saving Listing...' : isEditMode ? 'Update Handcrafted Listing' : 'Publish to Marketplace'}
          </button>
          <Link to="/dashboard/seller/products" className="btn btn-outline btn-lg">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AddEditProduct;
