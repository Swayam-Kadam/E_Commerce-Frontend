import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  getCart,
  removeCart,
  cleaAllCart,
  getCartCount,
  createOrder,
  resetPaymentState,
  verifyPayment,
  updateItemQuantity,
} from '../slice/CartSlice';
import { getUserProfile } from '@/components/auth/slice/loginSlice';
import { useDispatch, useSelector } from 'react-redux';
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';
import { FiShoppingBag, FiTrash2, FiMapPin } from 'react-icons/fi';
import { toast } from 'react-toastify';
import PageLoader from '@/components/common/PageLoader';
import conf from '@/conf/conf';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80';

const isCompleteAddress = (address) =>
  Boolean(
    address?.street &&
      address?.city &&
      address?.state &&
      address?.zipCode &&
      address?.country
  );

const formatAddress = (address) => {
  if (!address) return '';
  return [address.street, address.city, address.state, address.zipCode, address.country]
    .filter(Boolean)
    .join(', ');
};

const AddtocartPage = () => {
  const dispatch = useDispatch();
  const { cartItems, totalQuantity, cartItemLoading, paymentLoading } = useSelector(
    (state) => ({
      cartItems: state?.cart?.cartItems,
      cartItemLoading: state?.cart?.cartItemLoading,
      totalQuantity: state?.cart?.totalQuantity,
      paymentLoading: state?.cart?.paymentLoading,
    })
  );

  const { userProfile, userProfileFetched } = useSelector((state) => ({
    userProfile: state.login.userProfile,
    userProfileFetched: state.login.userProfileFetched,
  }));

  const productItem = cartItems?.items;
  const itemCount = productItem?.length || 0;

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [addressType, setAddressType] = useState('home');
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [, setRazorpayLoaded] = useState(false);

  const profileAddresses = useMemo(() => {
    return userProfile?.address || userProfile?.addresses || [];
  }, [userProfile]);

  const selectedAddress = useMemo(() => {
    if (!profileAddresses.length) return null;
    const byType = profileAddresses.find((addr) => addr?.type === addressType);
    if (byType && isCompleteAddress(byType)) return byType;
    const defaultAddr = profileAddresses.find((addr) => addr?.isDefault);
    if (defaultAddr && isCompleteAddress(defaultAddr)) return defaultAddr;
    return profileAddresses.find((addr) => isCompleteAddress(addr)) || null;
  }, [profileAddresses, addressType]);

  const shippingAddressPayload = useMemo(() => {
    if (!selectedAddress) return null;
    return {
      street: selectedAddress.street,
      city: selectedAddress.city,
      state: selectedAddress.state,
      zipCode: selectedAddress.zipCode,
      country: selectedAddress.country,
    };
  }, [selectedAddress]);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  useEffect(() => {
    if (!userProfileFetched) {
      dispatch(getUserProfile());
    }
  }, [dispatch, userProfileFetched]);

  useEffect(() => {
    if (!profileAddresses.length) return;
    const preferred =
      profileAddresses.find((addr) => addr?.isDefault && isCompleteAddress(addr)) ||
      profileAddresses.find((addr) => isCompleteAddress(addr));
    if (preferred?.type) {
      setAddressType(preferred.type);
    }
  }, [profileAddresses]);

  const loadRazorpayScript = async () => {
    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return true;
    }

    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        setRazorpayLoaded(true);
        resolve(true);
      };
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    if (!cartItems?.items?.length) {
      toast.error('Your cart is empty');
      return;
    }

    if (!shippingAddressPayload) {
      toast.error('Please add a complete shipping address in your profile before checkout.');
      return;
    }

    setCheckoutLoading(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway. Please try again.');
        setCheckoutLoading(false);
        return;
      }

      const res = await dispatch(
        createOrder({
          shippingAddress: shippingAddressPayload,
        })
      );

      const apiBody = res?.payload?.data;
      const orderPayload = apiBody?.data;

      if (!apiBody?.success || !orderPayload?.razorpayOrderId) {
        setCheckoutLoading(false);
        return;
      }

      const options = {
        key: orderPayload.key || conf?.rozerpaykey,
        amount: orderPayload.amount,
        currency: orderPayload.currency || 'INR',
        name: 'SwiftCart',
        description: `Payment for ${cartItems?.items?.length} items`,
        order_id: orderPayload.razorpayOrderId,
        handler: async (response) => {
          try {
            const verifyRes = await dispatch(
              verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                shippingAddress: shippingAddressPayload,
              })
            );

            if (verifyPayment.fulfilled.match(verifyRes) && verifyRes?.payload?.data?.success) {
              toast.success('Payment successful! Thank you for your purchase.');
              dispatch(getCart());
              dispatch(getCartCount());
              dispatch(resetPaymentState());
            } else if (verifyPayment.rejected.match(verifyRes)) {
              const code = verifyRes?.payload?.code;
              if (code === 'OUT_OF_STOCK_AFTER_PAY') {
                // Toast already shown by thunk; refresh cart so user sees remaining stock state
                dispatch(getCart());
                dispatch(getCartCount());
              }
            }
          } catch (error) {
            console.error('Verification error:', error);
            toast.error('Payment verification failed');
          }
          setCheckoutLoading(false);
        },
        prefill: {
          name:
            `${userProfile?.profile?.firstName || ''} ${userProfile?.profile?.lastName || ''}`.trim() ||
            userProfile?.username ||
            'Customer',
          email: userProfile?.email || '',
          contact: userProfile?.profile?.phone || '',
        },
        theme: {
          color: '#0289de',
        },
        modal: {
          ondismiss: () => {
            setCheckoutLoading(false);
            toast.info('Payment cancelled');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

      razorpay.on('payment.failed', (response) => {
        toast.error(`Payment failed: ${response.error.description}`);
        setCheckoutLoading(false);
      });
    } catch (error) {
      console.error('Payment initiation failed:', error);
      toast.error('Failed to initiate payment. Please try again.');
      setCheckoutLoading(false);
    }
  };

  const updateQuantity = (item, newQuantity) => {
    const itemId = item?._id || item?.id;
    if (!itemId || newQuantity < 1 || updatingItemId) return;

    const stock = item?.product?.stock;
    if (typeof stock === 'number' && newQuantity > stock) {
      toast.error(`Only ${stock} items available in stock`);
      return;
    }

    setUpdatingItemId(itemId);
    dispatch(updateItemQuantity({ id: itemId, quantity: newQuantity }))
      .then((res) => {
        if (res?.payload?.status === 200 || res?.payload?.data?.success) {
          dispatch(getCartCount());
        }
      })
      .finally(() => {
        setUpdatingItemId(null);
      });
  };

  const removeItem = (id) => {
    dispatch(removeCart(id)).then((res) => {
      if (res?.payload?.status === 200 || res?.payload?.status === 201) {
        toast.success('Cart item removed successfully');
        dispatch(getCart());
        dispatch(getCartCount());
      }
    });
  };

  const handleClear = () => {
    dispatch(cleaAllCart()).then((res) => {
      if (res?.payload?.status === 200 || res?.payload?.status === 201) {
        toast.success('Cart cleared successfully');
        dispatch(getCart());
        dispatch(getCartCount());
      }
    });
  };

  const subtotal = cartItems?.total || 0;
  const shipping = subtotal > 0 ? 5.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eef5fb_0%,#ffffff_28%,#ffffff_100%)]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {cartItemLoading && <PageLoader />}

        <motion.header
          className="mb-8 md:mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0289de]">
            SwiftCart
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Shopping Cart
          </h1>
          <p className="mt-2 text-slate-500">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} ready for checkout
          </p>
        </motion.header>

        {itemCount === 0 ? (
          <motion.div
            className="border border-dashed border-slate-200 bg-white px-6 py-20 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center bg-[#0289de]/10 text-[#0289de]">
              <FiShoppingBag className="h-7 w-7" />
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-900">
              Your cart is empty
            </h2>
            <p className="mx-auto mt-2 max-w-md text-slate-500">
              Looks like you have not added anything yet. Explore the shop and find
              something you love.
            </p>
            <Link
              to="/"
              className="mt-8 inline-flex bg-[#0289de] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0169ab]"
            >
              Continue Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <AnimatePresence>
                {productItem?.map((item, index) => (
                  <motion.article
                    key={item._id || item.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="mb-4 flex flex-col gap-4 border border-slate-100 bg-white p-4 shadow-[0_16px_40px_-28px_rgba(2,137,222,0.4)] sm:flex-row sm:items-center sm:p-5"
                  >
                    <Link
                      to={`/product/${item?.product?._id}`}
                      className="shrink-0 overflow-hidden bg-slate-50"
                    >
                      <img
                        src={item?.product?.images?.[0]?.url || FALLBACK_IMAGE}
                        alt={item?.product?.name || 'Product'}
                        className="h-24 w-24 object-cover transition hover:scale-105 sm:h-28 sm:w-28"
                        onError={(e) => {
                          e.target.src = FALLBACK_IMAGE;
                        }}
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/product/${item?.product?._id}`}
                        className="font-display text-lg font-semibold text-slate-900 transition hover:text-[#0289de]"
                      >
                        {item?.product?.name}
                      </Link>
                      <p className="mt-1 text-sm capitalize text-slate-500">
                        {[item?.variant?.color, item?.variant?.size]
                          .filter(Boolean)
                          .join(' · ') || 'Standard'}
                      </p>
                      <p className="mt-2 font-display text-xl font-bold text-slate-900">
                        ${Number(item.price || 0).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-3">
                      <div className="flex items-center border border-slate-200">
                        <button
                          type="button"
                          className="flex h-9 w-9 items-center justify-center text-[#0289de] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                          onClick={() => updateQuantity(item, item.quantity - 1)}
                          disabled={
                            updatingItemId === (item._id || item.id) ||
                            item.quantity <= 1
                          }
                          aria-label="Decrease quantity"
                        >
                          <FaMinusCircle />
                        </button>
                        <span className="min-w-[2rem] text-center text-sm font-semibold text-slate-900">
                          {item?.quantity}
                        </span>
                        <button
                          type="button"
                          className="flex h-9 w-9 items-center justify-center text-[#0289de] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                          onClick={() => updateQuantity(item, item.quantity + 1)}
                          disabled={
                            updatingItemId === (item._id || item.id) ||
                            (typeof item?.product?.stock === 'number' &&
                              item.quantity >= item.product.stock)
                          }
                          aria-label="Increase quantity"
                        >
                          <FaPlusCircle />
                        </button>
                      </div>

                      <button
                        type="button"
                        className="flex items-center gap-1.5 text-sm font-medium text-rose-500 transition hover:text-rose-700"
                        onClick={() => removeItem(item?._id)}
                      >
                        <FiTrash2 className="h-4 w-4" />
                        Remove
                      </button>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>

              {itemCount > 0 && (
                <button
                  type="button"
                  className="mt-2 border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                  onClick={handleClear}
                >
                  Clear Cart
                </button>
              )}
            </div>

            <motion.aside
              className="h-fit border border-slate-100 bg-white p-6 shadow-[0_20px_50px_-30px_rgba(2,137,222,0.4)] lg:sticky lg:top-8"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
            >
              <h2 className="font-display text-xl font-bold text-slate-900">
                Order Summary
              </h2>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({totalQuantity || itemCount} items)</span>
                  <span className="font-medium text-slate-900">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-medium text-slate-900">
                    ${shipping.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax</span>
                  <span className="font-medium text-slate-900">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-100 pt-3">
                  <div className="flex justify-between">
                    <span className="font-display text-lg font-bold text-slate-900">
                      Total
                    </span>
                    <span className="font-display text-lg font-bold text-slate-900">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    Payable amount is calculated from your cart on the server.
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <div className="mb-3 flex items-center gap-2">
                  <FiMapPin className="h-4 w-4 text-[#0289de]" />
                  <h3 className="text-sm font-semibold text-slate-900">
                    Shipping Address
                  </h3>
                </div>

                {profileAddresses.length > 0 ? (
                  <>
                    <div className="mb-3 flex flex-wrap gap-2">
                      {['home', 'work', 'other'].map((type) => {
                        const hasType = profileAddresses.some(
                          (addr) => addr?.type === type && isCompleteAddress(addr)
                        );
                        if (!hasType) return null;
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setAddressType(type)}
                            className={`px-3 py-1.5 text-xs font-semibold capitalize transition ${
                              addressType === type
                                ? 'bg-[#0289de] text-white'
                                : 'border border-slate-200 text-slate-600 hover:border-[#0289de]/40'
                            }`}
                          >
                            {type}
                          </button>
                        );
                      })}
                    </div>

                    {shippingAddressPayload ? (
                      <p className="text-sm leading-relaxed text-slate-600">
                        {formatAddress(shippingAddressPayload)}
                      </p>
                    ) : (
                      <p className="text-sm text-rose-600">
                        Selected address is incomplete. Update it in your profile.
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-rose-600">
                    No shipping address found. Add one in your profile to checkout.
                  </p>
                )}

                <Link
                  to="/account"
                  className="mt-3 inline-flex text-xs font-semibold text-[#0289de] hover:text-[#0169ab]"
                >
                  Manage addresses
                </Link>
              </div>

              <button
                type="button"
                className="mt-6 w-full bg-[#0289de] py-3.5 text-sm font-semibold text-white transition hover:bg-[#0169ab] disabled:cursor-not-allowed disabled:bg-slate-400"
                onClick={handleRazorpayPayment}
                disabled={
                  checkoutLoading ||
                  paymentLoading ||
                  cartItemLoading ||
                  !shippingAddressPayload
                }
              >
                {checkoutLoading || paymentLoading
                  ? 'Processing...'
                  : 'Proceed to Checkout'}
              </button>

              <Link
                to="/"
                className="mt-4 block text-center text-sm font-semibold text-[#0289de] transition hover:text-[#0169ab]"
              >
                Continue Shopping
              </Link>

              <div className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-400">
                Secure checkout powered by Razorpay
              </div>
            </motion.aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddtocartPage;
