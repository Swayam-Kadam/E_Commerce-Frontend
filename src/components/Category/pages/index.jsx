import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../../home/ProductCard';
import FilterComponent from '../components/FilterComponent';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct } from '@/components/home/slice';
import PageLoader from '@/components/common/PageLoader';
import { FiChevronRight, FiSliders } from 'react-icons/fi';
import {
  categoriesFromProducts,
  matchesCategory,
} from '@/utils/category';

const defaultFilters = {
  priceRange: [0, 10000],
  rating: 0,
  inStock: false,
  isBestSeller: false,
};

const MainCategory = () => {
  const { categoryName: rawCategoryName } = useParams();
  const categoryName = rawCategoryName
    ? decodeURIComponent(rawCategoryName)
    : 'All';
  const [searchParams] = useSearchParams();
  const searchQuery = (searchParams.get('search') || '').trim().toLowerCase();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    dispatch(getProduct());
  }, [dispatch]);

  const { productList = [], productListLoading = false } = useSelector(
    (state) => state.home || {}
  );

  const categories = useMemo(() => {
    return ['All', ...categoriesFromProducts(productList)];
  }, [productList]);

  const hasActiveFilters =
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 10000 ||
    filters.rating > 0 ||
    filters.inStock ||
    filters.isBestSeller ||
    Boolean(searchQuery);

  useEffect(() => {
    let result = [...productList];

    if (categoryName && categoryName !== 'All') {
      result = result.filter((product) =>
        matchesCategory(product.category, categoryName)
      );
    }

    if (searchQuery) {
      result = result.filter((product) => {
        const name = String(product.name || '').toLowerCase();
        const description = String(product.description || '').toLowerCase();
        const category = String(product.category || '').toLowerCase();
        return (
          name.includes(searchQuery) ||
          description.includes(searchQuery) ||
          category.includes(searchQuery)
        );
      });
    }

    result = result.filter((product) => {
      const hasStock = product.stock > 0;
      const price = product.price || 0;
      const rating = product.averageRating || 0;

      const priceMatch =
        price >= filters.priceRange[0] && price <= filters.priceRange[1];
      const ratingMatch = rating >= filters.rating;
      const stockMatch = !filters.inStock || hasStock;
      const bestSellerMatch = !filters.isBestSeller || product.isBestSeller;

      return priceMatch && ratingMatch && stockMatch && bestSellerMatch;
    });

    setFilteredProducts(result);
  }, [categoryName, filters, productList, searchQuery]);

  const handleCategoryChange = (category) => {
    const params = searchQuery
      ? `?search=${encodeURIComponent(searchQuery)}`
      : '';
    navigate(`/category/${encodeURIComponent(category)}${params}`);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const resetFilters = () => setFilters({ ...defaultFilters });

  const title =
    !categoryName || categoryName === 'All' ? 'All Products' : categoryName;

  if (productListLoading && productList.length === 0) {
    return <PageLoader loadingState />;
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eef5fb_0%,#ffffff_28%,#ffffff_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
          <Link to="/" className="transition hover:text-[#0289de]">
            Home
          </Link>
          <FiChevronRight className="h-3.5 w-3.5 opacity-50" />
          <span className="text-slate-800">Shop</span>
          {categoryName && categoryName !== 'All' && (
            <>
              <FiChevronRight className="h-3.5 w-3.5 opacity-50" />
              <span className="capitalize text-slate-800">{categoryName}</span>
            </>
          )}
        </nav>

        <motion.header
          className="mb-8 md:mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0289de]">
            Browse catalog
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            {title}
          </h1>
          <p className="mt-2 max-w-xl text-base text-slate-500">
            Filter by price, rating, and availability to find the right pick.
          </p>
        </motion.header>

        <div className="mb-8 overflow-x-auto border-b border-slate-200">
          <div className="flex min-w-max gap-1 sm:gap-2">
            {categories.map((category) => {
              const isActive =
                (category === 'All' &&
                  (!categoryName || categoryName === 'All')) ||
                (category !== 'All' &&
                  matchesCategory(categoryName, category));

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryChange(category)}
                  className={`relative px-4 py-3.5 text-sm font-medium transition ${
                    isActive
                      ? 'text-[#0289de]'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {String(category).toUpperCase()}
                  {isActive && (
                    <motion.span
                      layoutId="category-tab-underline"
                      className="absolute inset-x-0 bottom-0 h-0.5 bg-[#0289de]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between md:hidden">
          <p className="text-sm text-slate-500">
            {filteredProducts.length}{' '}
            {filteredProducts.length === 1 ? 'product' : 'products'}
          </p>
          <button
            type="button"
            onClick={() => setShowMobileFilters((prev) => !prev)}
            className="inline-flex items-center gap-2 border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
          >
            <FiSliders className="h-4 w-4 text-[#0289de]" />
            Filters
          </button>
        </div>

        <div className="flex flex-col gap-8 md:flex-row">
          <aside
            className={`w-full shrink-0 md:w-72 ${
              showMobileFilters ? 'block' : 'hidden md:block'
            }`}
          >
            <FilterComponent filters={filters} onFilterChange={handleFilterChange} />
          </aside>

          <div className="min-w-0 flex-1">
            <div className="mb-6 hidden items-center justify-between md:flex">
              <p className="text-sm text-slate-500">
                Showing{' '}
                <span className="font-semibold text-slate-800">
                  {filteredProducts.length}
                </span>{' '}
                {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>

              {hasActiveFilters && (
                <button
                  type="button"
                  className="text-sm font-semibold text-[#0289de] transition hover:text-[#0169ab]"
                  onClick={resetFilters}
                >
                  Reset Filters
                </button>
              )}
            </div>

            {filteredProducts.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                key={`${categoryName}-${filteredProducts.length}`}
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </motion.div>
            ) : (
              <div className="border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
                <p className="font-display text-xl font-bold text-slate-900">
                  No products found
                </p>
                <p className="mt-2 text-slate-500">
                  Nothing matches your current filters. Try widening the range.
                </p>
                <button
                  type="button"
                  className="mt-6 bg-[#0289de] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0169ab]"
                  onClick={resetFilters}
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainCategory;
