import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import { Search, Filter, RotateCcw, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Ceramics & Pottery',
  'Woodwork & Furniture',
  'Textiles & Leather',
  'Jewelry & Accessories',
  'Candles & Apothecary',
  'Art & Prints',
  'Glassware & Metalwork',
];

const SORT_OPTIONS = [
  { label: 'Newest Arrivals', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Highest Rated', value: 'rating' },
];

const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products, totalProducts, totalPages, currentPage: reduxPage, loading } = useSelector((state) => state.products);

  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sort') || 'newest';
  const initialMinPrice = searchParams.get('minPrice') || '';
  const initialMaxPrice = searchParams.get('maxPrice') || '';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState(initialSort);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    // Sync state with URL params
    const cat = searchParams.get('category') || 'All';
    const s = searchParams.get('search') || '';
    const srt = searchParams.get('sort') || 'newest';
    const minP = searchParams.get('minPrice') || '';
    const maxP = searchParams.get('maxPrice') || '';
    const pg = parseInt(searchParams.get('page') || '1', 10);

    setCategory(cat);
    setSearch(s);
    setSort(srt);
    setMinPrice(minP);
    setMaxPrice(maxP);

    dispatch(
      fetchProducts({
        category: cat === 'All' ? undefined : cat,
        search: s || undefined,
        sort: srt,
        minPrice: minP || undefined,
        maxPrice: maxP || undefined,
        page: pg,
      })
    );
  }, [searchParams, dispatch]);

  const applyFilters = (newParams) => {
    const updated = {
      category: category === 'All' ? undefined : category,
      search: search || undefined,
      sort,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      ...newParams,
    };

    const cleanParams = {};
    Object.keys(updated).forEach((key) => {
      if (updated[key] && updated[key] !== 'All') {
        cleanParams[key] = updated[key];
      }
    });

    setSearchParams(cleanParams);
  };

  const handlePageChange = (newPage) => {
    applyFilters({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (selectedCat) => {
    setCategory(selectedCat);
    applyFilters({ category: selectedCat === 'All' ? undefined : selectedCat, page: 1 });
  };

  const handleSortChange = (e) => {
    const selectedSort = e.target.value;
    setSort(selectedSort);
    applyFilters({ sort: selectedSort, page: 1 });
  };

  const handlePriceApply = (e) => {
    e.preventDefault();
    applyFilters({ minPrice, maxPrice, page: 1 });
  };

  const handleResetFilters = () => {
    setCategory('All');
    setSearch('');
    setSort('newest');
    setMinPrice('');
    setMaxPrice('');
    setSearchParams({});
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem' }} id="products-page">
      <div className="container">
        {/* Header bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>
              {category === 'All' ? 'All Handcrafted Goods' : category}
            </h1>
            <p style={{ fontSize: '0.9rem' }}>
              Showing {products.length} {products.length === 1 ? 'unique piece' : 'unique pieces'} from independent studios
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Sort Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label htmlFor="sort-select" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Sort By:
              </label>
              <select
                id="sort-select"
                className="form-control"
                value={sort}
                onChange={handleSortChange}
                style={{ padding: '0.5rem 1rem', width: 'auto', fontSize: '0.875rem' }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2.5rem', alignItems: 'start' }}>
          {/* Filter Sidebar */}
          <aside
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
            }}
            id="product-filter-sidebar"
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <SlidersHorizontal size={18} color="var(--primary)" />
                Filters
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                title="Reset all filters"
              >
                <RotateCcw size={12} />
                Reset
              </button>
            </div>

            {/* Keyword Search */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div className="form-label" style={{ marginBottom: '0.5rem' }}>
                Search Keywords
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  applyFilters({ search });
                }}
                style={{ position: 'relative' }}
              >
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. walnut, mug, linen"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ paddingRight: '2rem', fontSize: '0.875rem' }}
                />
                <button
                  type="submit"
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--primary)',
                  }}
                >
                  <Search size={16} />
                </button>
              </form>
            </div>

            {/* Categories list */}
            <div style={{ marginBottom: '1.75rem' }}>
              <div className="form-label" style={{ marginBottom: '0.75rem' }}>
                Categories
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategorySelect(cat)}
                    style={{
                      textAlign: 'left',
                      padding: '0.45rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      backgroundColor: category === cat ? 'var(--primary-light)' : 'transparent',
                      color: category === cat ? 'var(--primary)' : 'var(--text-main)',
                      fontWeight: category === cat ? 700 : 500,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <div className="form-label" style={{ marginBottom: '0.75rem' }}>
                Price Range ($)
              </div>
              <form onSubmit={handlePriceApply}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <input
                    type="number"
                    min="0"
                    placeholder="Min"
                    className="form-control"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    style={{ fontSize: '0.85rem', padding: '0.5rem 0.65rem' }}
                  />
                  <span style={{ color: 'var(--text-light)' }}>–</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Max"
                    className="form-control"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    style={{ fontSize: '0.85rem', padding: '0.5rem 0.65rem' }}
                  />
                </div>
                <button type="submit" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                  Apply Price
                </button>
              </form>
            </div>
          </aside>

          {/* Products Grid */}
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
                Loading handcrafted items...
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="product-grid" id="catalog-products-grid">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      marginTop: '2.5rem',
                      flexWrap: 'wrap',
                    }}
                    id="pagination-controls"
                  >
                    {/* Previous */}
                    <button
                      type="button"
                      onClick={() => handlePageChange(reduxPage - 1)}
                      disabled={reduxPage <= 1}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '0.45rem 0.65rem' }}
                      id="pagination-prev"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {/* Page numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => {
                        // Show first, last, current, and 1 around current
                        return p === 1 || p === totalPages || Math.abs(p - reduxPage) <= 1;
                      })
                      .reduce((acc, p, i, arr) => {
                        if (i > 0 && p - arr[i - 1] > 1) {
                          acc.push('...');
                        }
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((item, idx) =>
                        item === '...' ? (
                          <span
                            key={`ellipsis-${idx}`}
                            style={{ color: 'var(--text-light)', padding: '0 0.25rem' }}
                          >
                            …
                          </span>
                        ) : (
                          <button
                            key={item}
                            type="button"
                            onClick={() => handlePageChange(item)}
                            className={`btn btn-sm ${item === reduxPage ? 'btn-primary' : 'btn-outline'}`}
                            style={{ minWidth: '36px', padding: '0.45rem 0.65rem' }}
                            id={`pagination-page-${item}`}
                          >
                            {item}
                          </button>
                        )
                      )}

                    {/* Next */}
                    <button
                      type="button"
                      onClick={() => handlePageChange(reduxPage + 1)}
                      disabled={reduxPage >= totalPages}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '0.45rem 0.65rem' }}
                      id="pagination-next"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}

                {/* Results count */}
                <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-light)' }}>
                  Page {reduxPage} of {totalPages} · {totalProducts} total pieces
                </div>
              </>
            ) : (
              <div
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '4rem 2rem',
                  textAlign: 'center',
                }}
                id="no-products-found"
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                  }}
                >
                  <Search size={28} />
                </div>
                <h3>No Matching Handcrafted Goods Found</h3>
                <p style={{ maxWidth: '420px', margin: '0.5rem auto 1.5rem' }}>
                  We couldn't find any creations matching your search or filter criteria. Try adjusting your keywords or clearing filters.
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleResetFilters}
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListing;
