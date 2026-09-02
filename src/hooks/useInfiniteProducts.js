import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  buildProductQueryKey,
  fetchProductsPage,
} from '@/components/home/slice';
import { PRODUCT_PAGE_SIZE } from '@/constants/pagination';

/**
 * Infinite scroll for paginated product catalog.
 * @param {Object} filterParams - category, search, minPrice, maxPrice, rating, inStock, isBestSeller, sort
 */
export function useInfiniteProducts(filterParams = {}) {
  const dispatch = useDispatch();
  const loadingMoreRef = useRef(false);

  const {
    productList,
    productListLoading,
    productListLoadingMore,
    hasMoreProducts,
    pagination,
    productQueryKey,
  } = useSelector((state) => ({
    productList: state.home?.productList || [],
    productListLoading: state.home?.productListLoading || false,
    productListLoadingMore: state.home?.productListLoadingMore || false,
    hasMoreProducts: state.home?.hasMoreProducts || false,
    pagination: state.home?.pagination || {},
    productQueryKey: state.home?.productQueryKey || '',
  }));

  const queryKey = useMemo(
    () => buildProductQueryKey(filterParams),
    [filterParams]
  );

  const sentinelRef = useRef(null);

  // Initial load + reset when filters change
  useEffect(() => {
    dispatch(
      fetchProductsPage({
        page: 1,
        limit: PRODUCT_PAGE_SIZE,
        ...filterParams,
        append: false,
        queryKey,
      })
    );
  }, [dispatch, queryKey]);

  const loadMore = useCallback(() => {
    if (
      loadingMoreRef.current ||
      productListLoading ||
      productListLoadingMore ||
      !hasMoreProducts
    ) {
      return;
    }

    const nextPage = (pagination?.page || 1) + 1;
    loadingMoreRef.current = true;

    dispatch(
      fetchProductsPage({
        page: nextPage,
        limit: PRODUCT_PAGE_SIZE,
        ...filterParams,
        append: true,
        queryKey: productQueryKey || queryKey,
      })
    ).finally(() => {
      loadingMoreRef.current = false;
    });
  }, [
    dispatch,
    filterParams,
    hasMoreProducts,
    pagination?.page,
    productListLoading,
    productListLoadingMore,
    productQueryKey,
    queryKey,
  ]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '240px', threshold: 0.01 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore, productList.length]);

  return {
    products: productList,
    loading: productListLoading,
    loadingMore: productListLoadingMore,
    hasMore: hasMoreProducts,
    total: pagination?.total ?? productList.length,
    sentinelRef,
    loadMore,
  };
}

export default useInfiniteProducts;
