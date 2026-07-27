import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct } from './slice/index';
import PageLoader from '../common/PageLoader';
import { categoriesFromProducts, matchesCategory } from '@/utils/category';

const ProductPage = () => {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { productList, productListLoading } = useSelector(
    (state) => state.home || { productList: [], productListLoading: false }
  );

  useEffect(() => {
    dispatch(getProduct());
  }, [dispatch]);

  const categories = useMemo(
    () => ['All', ...categoriesFromProducts(productList)],
    [productList]
  );

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') return productList;
    return productList.filter((product) =>
      matchesCategory(product.category, selectedCategory)
    );
  }, [productList, selectedCategory]);

  if (productListLoading) {
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
            {categories.map((category) => {
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

        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          key={selectedCategory}
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="py-16 text-center">
            <p className="font-display text-xl font-semibold text-slate-800">
              Nothing here yet
            </p>
            <p className="mt-2 text-slate-500">
              No products found in this category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductPage;
