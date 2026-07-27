import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addCart, getCartCount } from '../AddToCart/slice/CartSlice';
import { toggleWhishlist } from '../Wishlist/slice/WishlistSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { toast } from 'react-toastify';
import { getSpecificProduct, getProduct } from '../home/slice/index';
import { addSpecificProductReview, getSpecificProductReview } from './slice';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { FiTruck, FiShield, FiRefreshCw, FiChevronRight } from 'react-icons/fi';
import PageLoader from '../common/PageLoader';
import { getCategoryName, matchesCategory } from '@/utils/category';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

const colorMap = {
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#10b981',
  yellow: '#fbbf24',
  purple: '#8b5cf6',
  pink: '#ec4899',
  gray: '#6b7280',
  grey: '#6b7280',
  black: '#000000',
  white: '#ffffff',
  brown: '#92400e',
  orange: '#f97316',
};

const SelectedProductPage = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const { specificProduct, specificProductLoading, specificProductReview } = useSelector(
    (state) => ({
      specificProduct: state.home.specificProduct,
      specificProductLoading: state.home.specificProductLoading,
      specificProductReview: state.specificProduct.specificProductReview,
    })
  );
  const { productList: allProducts = [] } = useSelector(
    (state) => state.home || { productList: [] }
  );

  // Slice stores the product object directly (normalized); support legacy `{ data }` shape too
  const productData =
    specificProduct?._id || specificProduct?.name
      ? specificProduct
      : specificProduct?.data || null;
  const productReviews = productData?.reviews || [];
  const product = productData;

  const reviewCount = productReviews.length || 0;
  const ratingSum =
    productReviews.reduce((acc, review) => acc + (review.rating || 0), 0) || 0;
  const averageRating = reviewCount > 0 ? ratingSum / reviewCount : 0;

  const isInWishlist = Boolean(product?.isWishlist);

  const validationSchema = Yup.object({
    review: Yup.string()
      .min(5, 'Review must be at least 5 characters')
      .required('Product Review is Required'),
    rating: Yup.number()
      .min(1, 'Please select a rating')
      .max(5, 'Maximum rating is 5')
      .required('Product Rating is Required'),
    userName: Yup.string().required('Name is required'),
    userEmail: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
  });

  const formik = useFormik({
    initialValues: {
      review: '',
      rating: 0,
      userName: '',
      userEmail: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = {
          id,
          rating: values.rating,
          comment: values.review,
          isVerified: 'true',
        };

        dispatch(addSpecificProductReview(payload)).then((res) => {
          setLoading(true);
          if (res?.payload?.status === 201) {
            toast.success('Review submitted successfully!');
            dispatch(getSpecificProductReview(id));
            resetForm();
            setLoading(false);
          }
          setLoading(false);
        });
      } catch (error) {
        console.error('Error submitting review:', error);
        toast.error('Failed to submit review. Please try again.');
      }
    },
  });

  useEffect(() => {
    if (id) {
      dispatch(getSpecificProduct(id))
        .then(() => {
          dispatch(getSpecificProductReview(id));
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
    if (!allProducts.length) {
      dispatch(getProduct());
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (productData) {
      if (productData.variants?.[0]?.color?.[0]) {
        setSelectedColor(productData.variants[0].color[0]);
      }
      if (productData.variants?.[0]?.size?.[0]) {
        setSelectedSize(productData.variants[0].size[0]);
      }
      setSelectedImage(0);
      setQuantity(1);
    }
  }, [productData]);

  const handleAddToCart = () => {
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
        color: selectedColor || null,
        size: selectedSize || null,
      },
      quantity,
    };

    dispatch(addCart(payload))
      .then((res) => {
        if (res?.payload?.status === 200 || res?.payload?.status === 201) {
          dispatch(getCartCount());
          toast.success('Product added to cart successfully!');
          dispatch(getSpecificProduct(id));
        } else {
          toast.error('Failed to add to cart');
        }
      })
      .catch(() => {
        toast.error('Failed to add to cart. Please try again.');
      });
  };

  const handleWishlist = (ids) => {
    const payload = { productId: ids };
    dispatch(toggleWhishlist(payload)).then((res) => {
      if (res?.payload?.status === 200 || res?.payload?.status === 201) {
        if (res?.payload?.data?.action === 'added') {
          toast.success('Wishlist Added Successfully');
          dispatch(getSpecificProduct(id));
        } else if (res?.payload?.data?.action === 'removed') {
          toast.warning('Wishlist Removed Successfully');
          dispatch(getSpecificProduct(id));
        }
      }
    });
  };

  const relatedProducts = allProducts
    .filter((p) => {
      if (p._id === id) return false;
      return matchesCategory(p.category, getCategoryName(product?.category));
    })
    .slice(0, 3);

  const incrementQuantity = () => {
    if (product?.stock && quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    } else {
      toast.warning('Maximum available quantity reached');
    }
  };

  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  if (loading || specificProductLoading) {
    return <PageLoader />;
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0289de]">
          SwiftCart
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold text-slate-900">
          Product not found
        </h2>
        <p className="mt-2 text-slate-500">
          The product you are looking for does not exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex bg-[#0289de] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0169ab]"
        >
          Back to shop
        </Link>
      </div>
    );
  }

  const productImages =
    product.images?.map((img) => img.url) || [product.image].filter(Boolean);
  const mainImage = productImages[selectedImage] || FALLBACK_IMAGE;
  const outOfStock = product.stock < 1;
  const inCart = product?.cartInfo?.inCart;
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;

  const resolveColor = (color) => {
    if (!color) return '#cbd5e1';
    const key = String(color).toLowerCase();
    return colorMap[key] || color;
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eef5fb_0%,#ffffff_28%,#ffffff_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
          <Link to="/" className="transition hover:text-[#0289de]">
            Home
          </Link>
          <FiChevronRight className="h-3.5 w-3.5 opacity-50" />
          <span className="capitalize">{getCategoryName(product.category) || 'Shop'}</span>
          <FiChevronRight className="h-3.5 w-3.5 opacity-50" />
          <span className="truncate text-slate-800">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="mb-16 grid grid-cols-1 gap-10 lg:mb-20 lg:grid-cols-2 lg:gap-14">
          {/* Gallery */}
          <div className="space-y-4">
            <motion.div
              className="relative aspect-[4/5] overflow-hidden bg-slate-100 sm:aspect-square lg:aspect-[4/5]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={mainImage}
                  src={mainImage}
                  alt={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={(e) => {
                    e.target.src = FALLBACK_IMAGE;
                  }}
                />
              </AnimatePresence>

              {discountPercent > 0 && (
                <span className="absolute left-4 top-4 bg-[#0289de] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                  {discountPercent}% off
                </span>
              )}
            </motion.div>

            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square overflow-hidden border-2 transition ${
                      selectedImage === index
                        ? 'border-[#0289de]'
                        : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`View ${index + 1}`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.src = FALLBACK_IMAGE;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0289de]">
              {getCategoryName(product.category) || 'SwiftCart'}
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 ${
                      star <= Math.floor(averageRating)
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
              <span className="text-sm text-slate-500">
                {averageRating.toFixed(1)} · {reviewCount}{' '}
                {reviewCount === 1 ? 'review' : 'reviews'}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-baseline gap-3">
              <span className="font-display text-4xl font-bold text-slate-900">
                ${product.price}
              </span>
              {discountPercent > 0 && (
                <>
                  <span className="text-lg text-slate-400 line-through">
                    ${product.originalPrice}
                  </span>
                  <span className="bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-600">
                    Save {discountPercent}%
                  </span>
                </>
              )}
            </div>

            <p className="mt-5 text-base leading-relaxed text-slate-600">
              {product.description}
            </p>

            <div
              className={`mt-5 inline-flex w-fit items-center gap-2 px-3 py-1.5 text-xs font-semibold ${
                outOfStock
                  ? 'bg-rose-50 text-rose-700'
                  : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  outOfStock ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
              />
              {outOfStock
                ? 'Out of stock'
                : `${product.stock} in stock · ready to ship`}
            </div>

            {/* Color */}
            {product.variants?.[0]?.color?.length > 0 && (
              <div className="mt-8">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">Color</h3>
                  <span className="text-sm capitalize text-slate-500">
                    {selectedColor}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants[0].color.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`h-9 w-9 rounded-full border-2 transition ${
                        selectedColor === color
                          ? 'border-[#0289de] ring-2 ring-[#0289de]/25'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      style={{ backgroundColor: resolveColor(color) }}
                      onClick={() => setSelectedColor(color)}
                      aria-label={`Color: ${color}`}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size */}
            {product.variants?.[0]?.size?.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-3 text-sm font-semibold text-slate-900">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants[0].size.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`min-w-[3rem] px-4 py-2.5 text-sm font-medium transition ${
                        selectedSize === size
                          ? 'bg-[#0289de] text-white'
                          : 'border border-slate-200 text-slate-700 hover:border-[#0289de]/50'
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center border border-slate-200">
                <button
                  type="button"
                  className="flex h-12 w-12 items-center justify-center text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <FaMinus className="h-3 w-3" />
                </button>
                <span className="min-w-[3rem] text-center font-display text-lg font-semibold text-slate-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  className="flex h-12 w-12 items-center justify-center text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  onClick={incrementQuantity}
                  disabled={product.stock && quantity >= product.stock}
                  aria-label="Increase quantity"
                >
                  <FaPlus className="h-3 w-3" />
                </button>
              </div>

              <button
                type="button"
                className="h-12 flex-1 px-6 text-sm font-semibold text-white transition disabled:cursor-not-allowed"
                onClick={handleAddToCart}
                disabled={outOfStock || inCart}
                style={{
                  backgroundColor: outOfStock || inCart ? '#94a3b8' : '#0289de',
                }}
              >
                {outOfStock
                  ? 'Out of Stock'
                  : inCart
                    ? 'Added To Cart'
                    : 'Add To Cart'}
              </button>

              <button
                type="button"
                className="flex h-12 w-12 shrink-0 items-center justify-center border border-slate-200 transition hover:border-rose-200 hover:bg-rose-50"
                onClick={() => handleWishlist(product._id)}
                aria-label={
                  isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${
                    isInWishlist
                      ? 'fill-rose-500 text-rose-500'
                      : 'fill-none text-slate-500'
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

            {/* Perks */}
            <div className="mt-8 grid grid-cols-1 gap-3 border-t border-slate-100 pt-6 sm:grid-cols-3">
              {[
                { icon: FiTruck, label: 'Fast delivery' },
                { icon: FiShield, label: 'Secure pay' },
                { icon: FiRefreshCw, label: 'Easy returns' },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 text-sm text-slate-600"
                >
                  <span className="flex h-9 w-9 items-center justify-center bg-[#0289de]/10 text-[#0289de]">
                    <Icon className="h-4 w-4" />
                  </span>
                  {label}
                </div>
              ))}
            </div>

            {/* Specs */}
            {product.specifications &&
              Object.keys(product.specifications).length > 0 && (
                <div className="mt-8 border-t border-slate-100 pt-6">
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    Specifications
                  </h3>
                  <dl className="mt-4 divide-y divide-slate-100">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between gap-4 py-2.5 text-sm"
                      >
                        <dt className="text-slate-500">{key}</dt>
                        <dd className="font-medium text-slate-900">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
          </motion.div>
        </div>

        {/* Reviews */}
        <section className="mb-16 lg:mb-20">
          <div className="mb-8 max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0289de]">
              Ratings
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900">
              Customer Reviews
            </h2>
            <p className="mt-2 text-slate-500">
              {reviewCount > 0
                ? `${reviewCount} shoppers shared their experience.`
                : 'Be the first to leave a review.'}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
            {/* Form */}
            <div className="border border-slate-100 bg-white p-6 shadow-[0_20px_50px_-30px_rgba(2,137,222,0.35)] lg:col-span-2">
              <h3 className="font-display text-xl font-bold text-slate-900">
                Write a review
              </h3>
              <form onSubmit={formik.handleSubmit} className="mt-5 space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Your name"
                    name="userName"
                    value={formik.values.userName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full border bg-slate-50/50 px-3 py-2.5 text-sm outline-none transition focus:border-[#0289de] focus:bg-white ${
                      formik.touched.userName && formik.errors.userName
                        ? 'border-rose-400'
                        : 'border-slate-200'
                    }`}
                  />
                  {formik.touched.userName && formik.errors.userName && (
                    <p className="mt-1 text-xs text-rose-500">
                      {formik.errors.userName}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Your email"
                    name="userEmail"
                    value={formik.values.userEmail}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full border bg-slate-50/50 px-3 py-2.5 text-sm outline-none transition focus:border-[#0289de] focus:bg-white ${
                      formik.touched.userEmail && formik.errors.userEmail
                        ? 'border-rose-400'
                        : 'border-slate-200'
                    }`}
                  />
                  {formik.touched.userEmail && formik.errors.userEmail && (
                    <p className="mt-1 text-xs text-rose-500">
                      {formik.errors.userEmail}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <Rating
                      style={{ maxWidth: 140 }}
                      value={formik.values.rating}
                      onChange={(value) => formik.setFieldValue('rating', value)}
                      onBlur={() => formik.setFieldTouched('rating', true)}
                      halfFillMode="svg"
                    />
                    <span className="bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
                      {formik.values.rating.toFixed(1)} / 5
                    </span>
                  </div>
                  {formik.touched.rating && formik.errors.rating && (
                    <p className="mt-1 text-xs text-rose-500">
                      {formik.errors.rating}
                    </p>
                  )}
                </div>

                <div>
                  <textarea
                    placeholder="Share your thoughts (min. 5 characters)..."
                    name="review"
                    value={formik.values.review}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    rows="4"
                    className={`w-full resize-none border bg-slate-50/50 px-3 py-2.5 text-sm outline-none transition focus:border-[#0289de] focus:bg-white ${
                      formik.touched.review && formik.errors.review
                        ? 'border-rose-400'
                        : 'border-slate-200'
                    }`}
                  />
                  {formik.touched.review && formik.errors.review && (
                    <p className="mt-1 text-xs text-rose-500">
                      {formik.errors.review}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0289de] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0169ab]"
                >
                  Submit Review
                </button>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-3">
              {specificProductReview?.data?.data?.length > 0 ? (
                <div className="space-y-4">
                  {specificProductReview.data.data.map((review) => (
                    <article
                      key={review._id}
                      className="border border-slate-100 bg-white p-5 transition hover:border-sky-100"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center bg-[#0289de] text-sm font-semibold text-white">
                            {review?.user?.username?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900">
                              {review?.user?.username || 'Anonymous'}
                            </h4>
                            <p className="text-xs text-slate-400">
                              {new Date(
                                review.createdAt || review.created_at
                              ).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`h-4 w-4 ${
                                star <= (review.rating || 0)
                                  ? 'text-amber-400'
                                  : 'text-slate-200'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>

                      <p className="mt-3 text-sm leading-relaxed text-slate-600">
                        {review.comment || review.review_text}
                      </p>

                      {review.isVerified && (
                        <span className="mt-3 inline-flex items-center gap-1 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                          <svg
                            className="h-3.5 w-3.5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Verified purchase
                        </span>
                      )}
                    </article>
                  ))}
                </div>
              ) : (
                <div className="flex h-full min-h-[220px] items-center justify-center border border-dashed border-slate-200 bg-slate-50/60 px-6 text-center">
                  <p className="text-slate-500">
                    No reviews yet. Share the first impression.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Related */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-slate-100 pt-12 pb-4">
            <div className="mb-8 max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0289de]">
                More to explore
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900">
                Related Products
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct._id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                >
                  <Link
                    to={`/product/${relatedProduct._id}`}
                    className="group block overflow-hidden border border-slate-100 bg-white transition hover:-translate-y-1 hover:border-sky-100 hover:shadow-[0_20px_40px_-24px_rgba(2,137,222,0.45)]"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-slate-50">
                      <img
                        src={
                          relatedProduct.images?.[0]?.url || relatedProduct.image
                        }
                        alt={relatedProduct.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src = FALLBACK_IMAGE;
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                        {getCategoryName(relatedProduct.category)}
                      </span>
                      <h3 className="mt-1 truncate font-display text-lg font-semibold text-slate-900">
                        {relatedProduct.name}
                      </h3>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-display text-lg font-bold text-slate-900">
                          ${relatedProduct.price}
                        </span>
                        <span className="text-sm font-medium text-[#0289de]">
                          View details
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default SelectedProductPage;
