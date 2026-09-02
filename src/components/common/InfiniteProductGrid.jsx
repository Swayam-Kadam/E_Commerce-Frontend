import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/home/ProductCard';

const InfiniteProductGrid = ({
  products = [],
  loading = false,
  loadingMore = false,
  hasMore = false,
  sentinelRef,
  emptyMessage = 'No products found',
  emptyDescription = 'Try adjusting your filters or check back later.',
  emptyAction = null,
  gridClassName = 'grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-6',
  showInitialSkeleton = false,
}) => {
  if (loading && products.length === 0 && showInitialSkeleton) {
    return (
      <div className={gridClassName}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-80 animate-pulse border border-slate-100 bg-slate-50"
          />
        ))}
      </div>
    );
  }

  if (!loading && products.length === 0) {
    return (
      <div className="border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
        <p className="font-display text-xl font-bold text-slate-900">
          {emptyMessage}
        </p>
        <p className="mt-2 text-slate-500">{emptyDescription}</p>
        {emptyAction}
      </div>
    );
  }

  return (
    <>
      <motion.div
        className={gridClassName}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {products.map((product) => (
          <ProductCard key={product._id || product.id} product={product} />
        ))}
      </motion.div>

      <div ref={sentinelRef} className="h-4 w-full" aria-hidden="true" />

      {loadingMore && (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#0289de] border-t-transparent" />
            Loading more products...
          </div>
        </div>
      )}

      {!hasMore && products.length > 0 && !loadingMore && (
        <p className="py-8 text-center text-sm text-slate-400">
          You&apos;ve seen all products
        </p>
      )}
    </>
  );
};

export default InfiniteProductGrid;
