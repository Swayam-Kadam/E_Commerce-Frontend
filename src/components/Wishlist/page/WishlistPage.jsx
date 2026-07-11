import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  removeFromWishlist,
  getAllWhishlist,
  toggleWhishlist,
  getWhishlistCount,
  clearWhishlist,
} from '../slice/WishlistSlice';
import { addToCart } from '../../AddToCart/slice/CartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import PageLoader from '@/components/common/PageLoader';
import { FiHeart } from 'react-icons/fi';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { allWhishlistData, allWhishlistLoading } = useSelector((state) => ({
    allWhishlistData: state?.wishlist?.allWhishlistData?.data?.data?.products,
    allWhishlistLoading: state?.wishlist?.allWhishlistLoading,
  }));

  useEffect(() => {
    dispatch(getAllWhishlist());
  }, [dispatch]);

  const removeFromWishlistHandler = (id) => {
    dispatch(removeFromWishlist(id));
    dispatch(toggleWhishlist({ productId: id })).then((res) => {
      if (res?.payload?.status === 200 || res?.payload?.status === 201) {
        toast.success('Wishlist removed successfully');
        dispatch(getWhishlistCount());
        dispatch(getAllWhishlist());
      }
    });
  };

  const moveToCart = (item) => {
    dispatch(
      addToCart({
        id: item.id || item._id,
        name: item.name,
        price: item.price,
        image: item.image || item?.images?.[0]?.url,
      })
    );
    dispatch(removeFromWishlist(item.id || item._id));
  };

  const clearWishlistHandler = () => {
    dispatch(clearWhishlist()).then((res) => {
      if (res?.payload?.status === 200 || res?.payload?.status === 201) {
        toast.warning('Wishlist cleared successfully');
        dispatch(getAllWhishlist());
        dispatch(getWhishlistCount());
      }
    });
  };

  const itemCount = allWhishlistData?.length || 0;

  if (allWhishlistLoading) {
    return <PageLoader loadingState />;
  }

  return (
    <div className="min-h-[50vh] bg-[linear-gradient(180deg,#eef5fb_0%,#ffffff_40%,#ffffff_100%)]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <motion.header
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0289de]">
              Saved for later
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Your Wishlist
            </h1>
            <p className="mt-2 text-slate-500">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} waiting for you
            </p>
          </div>

          {itemCount > 0 && (
            <button
              type="button"
              className="self-start border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 sm:self-auto"
              onClick={clearWishlistHandler}
            >
              Clear Wishlist
            </button>
          )}
        </motion.header>

        {itemCount === 0 ? (
          <motion.div
            className="border border-dashed border-slate-200 bg-white px-6 py-20 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center bg-[#0289de]/10 text-[#0289de]">
              <FiHeart className="h-7 w-7" />
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-900">
              Your wishlist is empty
            </h2>
            <p className="mx-auto mt-2 max-w-md text-slate-500">
              Save your favorite finds here and come back when you are ready to buy.
            </p>
            <Link
              to="/"
              className="mt-8 inline-flex bg-[#0289de] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0169ab]"
            >
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <AnimatePresence>
              {allWhishlistData?.map((item, index) => {
                const outOfStock = item.stock < 1;
                const inCart = item?.cartInfo?.inCart;

                return (
                  <motion.article
                    key={item._id || item.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group flex flex-col overflow-hidden border border-slate-100 bg-white transition hover:-translate-y-1 hover:border-sky-100 hover:shadow-[0_20px_40px_-24px_rgba(2,137,222,0.45)]"
                  >
                    <div className="relative overflow-hidden bg-slate-50">
                      <img
                        src={item?.images?.[0]?.url || FALLBACK_IMAGE}
                        alt={item?.name || 'Wishlist item'}
                        className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src = FALLBACK_IMAGE;
                        }}
                      />

                      <button
                        type="button"
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-white/95 text-rose-500 shadow-sm transition hover:bg-rose-50"
                        onClick={() => removeFromWishlistHandler(item._id)}
                        aria-label="Remove from wishlist"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      {outOfStock && (
                        <span className="absolute left-3 top-3 bg-slate-700 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="line-clamp-2 font-display text-lg font-semibold text-slate-900">
                        {item.name}
                      </h3>

                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="font-display text-xl font-bold text-slate-900">
                          ${Number(item.price || 0).toFixed(2)}
                        </span>
                        {item.originalPrice && (
                          <span className="text-sm text-slate-400 line-through">
                            ${Number(item.originalPrice).toFixed(2)}
                          </span>
                        )}
                      </div>

                      <div className="mt-auto flex gap-2 pt-4">
                        <button
                          type="button"
                          className="flex-1 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed"
                          onClick={() => !outOfStock && moveToCart(item)}
                          disabled={outOfStock || inCart}
                          style={{
                            backgroundColor:
                              outOfStock || inCart ? '#94a3b8' : '#0289de',
                          }}
                        >
                          {outOfStock
                            ? 'Out of Stock'
                            : inCart
                              ? 'In Cart'
                              : 'Add To Cart'}
                        </button>

                        <Link
                          to={`/product/${item._id}`}
                          className="border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
