import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from './slice/index';
import PageLoader from '../common/PageLoader';
import InfiniteProductGrid from '../common/InfiniteProductGrid';
import useInfiniteProducts from '@/hooks/useInfiniteProducts';

const ProductPage = () => {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { categories = [], categoriesLoading = false } = useSelector(
    (state) => state.home || {}
  );

  const filterParams = useMemo(
    () => ({
      category: selectedCategory !== 'All' ? selectedCategory : undefined,
    }),
    [selectedCategory]
  );

  const {
    products,
    loading,
    loadingMore,
    hasMore,
    sentinelRef,
  } = useInfiniteProducts(filterParams);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const categoryTabs = useMemo(() => {
    const names = categories.map((c) => c.name).filter(Boolean);
    return ['All', ...names];
  }, [categories]);

  if ((loading || categoriesLoading) && products.length === 0) {
    return <PageLoader loadingState />;
  }

  return (
    <section
      id="featured-products"
      className="relative bg-white py-14 md:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0289de]">
              Handpicked for you
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Featured Products
            </h2>
            <p className="mt-2 text-base text-slate-500">
              Explore trending picks across every aisle.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 md:gap-3">
            {categoryTabs.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`relative px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-[#0289de]'
                      : 'text-slate-500 hover:text-[#0289de]'
                  }`}
                >
                  {String(category).toUpperCase()}
                  {isActive && (
                    <motion.span
                      layoutId="product-category-underline"
                      className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-[#0289de]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <InfiniteProductGrid
          products={products}
          loading={loading}
          loadingMore={loadingMore}
          hasMore={hasMore}
          sentinelRef={sentinelRef}
          emptyMessage="Nothing here yet"
          emptyDescription="No products found in this category."
        />
      </div>
    </section>
  );
};

export default ProductPage;
