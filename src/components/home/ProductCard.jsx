import React from 'react';
import { useNavigate } from 'react-router-dom';
import { addCart, getCartCount } from '../AddToCart/slice/CartSlice';
import { getWhishlistCount, toggleWhishlist } from '../Wishlist/slice/WishlistSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { getProduct } from './slice';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isInWishlist = Boolean(product?.isWishlist);

  const handleViewClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleAddToCart = (product) => {
    if (!product || !product._id) {
      toast.error('Invalid product');
      return;
    }

    if (!product.stock || product.stock === 0) {
      toast.error('Product is out of stock');
      return;
    }

    const payload = {
      productId: product._id,
      variant: {
        color: product?.variants?.color || null,
        size: product?.variants?.size || null,
      },
      quantity: 1,
    };

    dispatch(addCart(payload))
      .then((res) => {
        if (res?.payload?.status === 200 || res?.payload?.status === 201) {
          dispatch(getCartCount());
          toast.success('Product added to cart successfully!');
          dispatch(getProduct());
        } else {
          toast.error('Failed to add to cart');
        }
      })
      .catch(() => {
        toast.error('Failed to add to cart. Please try again.');
      });
  };

  const handleWishlist = (id) => {
    const payload = { productId: id };
    dispatch(toggleWhishlist(payload)).then((res) => {
      if (res?.payload?.status === 200 || res?.payload?.status === 201) {
        dispatch(getWhishlistCount());
        if (res?.payload?.data?.action === 'added') {
          toast.success('Wishlist Added Successfully');
          dispatch(getProduct());
        } else if (res?.payload?.data?.action === 'removed') {
          toast.warning('Wishlist Removed Successfully');
          dispatch(getProduct());
        }
      }
    });
  };

  const colors =
    product.variants && product.variants.length > 0
      ? product.variants[0]?.color || []
      : [];

  const colorMap = {
    red: '#ef4444',
    blue: '#3b82f6',
    green: '#10b981',
    yellow: '#fbbf24',
    purple: '#8b5cf6',
    pink: '#ec4899',
    gray: '#6b7280',
    black: '#000000',
    white: '#ffffff',
    brown: '#92400e',
    orange: '#f97316',
  };

  const renderColorDots = () => {
    if (!colors || colors.length === 0) return null;
    const displayColors = colors.slice(0, 3);

    return (
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xs text-slate-500">Colors</span>
        <div className="flex gap-1.5">
          {displayColors.map((color, index) => {
            const colorValue = colorMap[color.toLowerCase()] || color;
            return (
              <div
                key={index}
                className="h-4 w-4 rounded-full border border-slate-200"
                style={{ backgroundColor: colorValue }}
                title={color}
              />
            );
          })}
          {colors.length > 3 && (
            <span className="text-xs text-slate-400">+{colors.length - 3}</span>
          )}
        </div>
      </div>
    );
  };

  const productName = product.name || 'Unnamed Product';
  const productImage =
    product?.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80';
  const productCategory =
    typeof product.category === 'object' && product.category !== null
      ? product.category.name || 'Uncategorized'
      : product.category || 'Uncategorized';
  const productPrice = product.price || 0;
  const productRating = product.rating || product.averageRating || 0;
  const reviewCount = product.reviews?.length || 0;
  const outOfStock = product.stock < 1;
  const inCart = product?.cartInfo?.inCart;

  return (
    <article className="group flex flex-col overflow-hidden border border-slate-100 bg-white transition duration-300 hover:-translate-y-1 hover:border-sky-100 hover:shadow-[0_20px_40px_-24px_rgba(2,137,222,0.45)]">
      <div className="relative overflow-hidden bg-slate-50">
        <img
          src={productImage}
          alt={productName}
          className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              New
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-amber-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              Bestseller
            </span>
          )}
          {outOfStock && (
            <span className="bg-rose-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              Out of Stock
            </span>
          )}
        </div>

        <button
          type="button"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-400 shadow-sm transition hover:text-rose-500"
          onClick={() => handleWishlist(product._id)}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${
              isInWishlist ? 'fill-rose-500 text-rose-500' : 'fill-none'
            }`}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          {productCategory}
        </span>
        <h3 className="mt-1 line-clamp-2 font-display text-lg font-semibold text-slate-900">
          {productName}
        </h3>

        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                xmlns="http://www.w3.org/2000/svg"
                className={`h-3.5 w-3.5 ${
                  star <= Math.floor(productRating)
                    ? 'text-amber-400'
                    : 'text-slate-200'
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-slate-400">({reviewCount})</span>
        </div>

        {renderColorDots()}

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div>
            <span className="font-display text-xl font-bold text-slate-900">
              ${productPrice}
            </span>
            {product.originalPrice && product.originalPrice > productPrice && (
              <span className="ml-2 text-sm text-slate-400 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              onClick={handleViewClick}
            >
              View
            </button>
            <button
              type="button"
              className="px-3 py-2 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => handleAddToCart(product)}
              disabled={outOfStock || inCart}
              style={{
                backgroundColor: outOfStock || inCart ? '#94a3b8' : '#0289de',
              }}
            >
              {outOfStock ? 'Sold Out' : inCart ? 'In Cart' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
