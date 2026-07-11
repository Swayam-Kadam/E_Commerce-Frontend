import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiPackage } from 'react-icons/fi';
import PageLoader from '@/components/common/PageLoader';
import { getOrders } from '../slice/orderSlice';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80';

const statusStyles = {
  pending: 'bg-slate-100 text-slate-700',
  processing: 'bg-amber-50 text-amber-700',
  shipped: 'bg-sky-50 text-sky-700',
  delivered: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-rose-50 text-rose-700',
};

const formatDate = (dateValue) => {
  if (!dateValue) return '—';
  return new Date(dateValue).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatStatus = (status) => {
  if (!status) return 'Pending';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const Order = () => {
  const dispatch = useDispatch();
  const { orders, ordersLoading } = useSelector((state) => state.order);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  if (ordersLoading) {
    return <PageLoader loadingState />;
  }

  return (
    <div>
      <div className="mb-6 max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0289de]">
          Purchase history
        </p>
        <h2 className="mt-2 font-display text-2xl font-bold text-slate-900">
          Your Orders
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Track recent purchases from your SwiftCart account.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center bg-[#0289de]/10 text-[#0289de]">
            <FiPackage className="h-6 w-6" />
          </div>
          <h3 className="font-display text-xl font-bold text-slate-900">
            No orders yet
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            When you complete a checkout, your orders will show up here.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex bg-[#0289de] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0169ab]"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          {orders.map((order, index) => {
            const orderItems = order.items || [];
            const previewItems = orderItems.slice(0, 3);
            const remainingCount = Math.max(orderItems.length - previewItems.length, 0);
            const isExpanded = expandedOrderId === order._id;
            const statusKey = (order.orderStatus || 'pending').toLowerCase();

            return (
              <motion.article
                key={order._id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="border border-slate-100 bg-white p-5 shadow-[0_16px_40px_-28px_rgba(2,137,222,0.4)] sm:p-6"
              >
                <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="font-display text-lg font-bold text-slate-900">
                      Order #{order.orderNumber || order._id?.slice(-8)}
                    </h3>
                    <p className="mt-0.5 text-sm text-slate-500">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold capitalize ${
                        statusStyles[statusKey] || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {formatStatus(order.orderStatus)}
                    </span>
                    <span className="font-display text-xl font-bold text-slate-900">
                      ${Number(order.totalAmount || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-4">
                    {previewItems.map((item, idx) => {
                      const product = item.product || {};
                      const image =
                        product?.images?.[0]?.url || FALLBACK_IMAGE;
                      return (
                        <div key={item._id || idx} className="flex items-center gap-3">
                          <img
                            src={image}
                            alt={product?.name || 'Product'}
                            className="h-14 w-14 object-cover"
                            onError={(e) => {
                              e.target.src = FALLBACK_IMAGE;
                            }}
                          />
                          <div className="min-w-0">
                            <p className="max-w-[10rem] truncate text-sm text-slate-700">
                              {product?.name || 'Product unavailable'}
                            </p>
                            <p className="text-xs text-slate-400">
                              Qty {item.quantity}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    {remainingCount > 0 && (
                      <span className="text-sm text-slate-400">
                        +{remainingCount} more
                      </span>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      className="text-sm font-semibold text-[#0289de] transition hover:text-[#0169ab]"
                      onClick={() =>
                        setExpandedOrderId(isExpanded ? null : order._id)
                      }
                    >
                      {isExpanded ? 'Hide Details' : 'View Details'}
                    </button>
                    {orderItems[0]?.product?._id && (
                      <Link
                        to={`/product/${orderItems[0].product._id}`}
                        className="text-sm font-semibold text-slate-600 transition hover:text-slate-900"
                      >
                        Buy Again
                      </Link>
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-5 border-t border-slate-100 pt-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                              Payment
                            </p>
                            <p className="mt-1 text-sm capitalize text-slate-700">
                              {order.paymentMethod || '—'} ·{' '}
                              {order.paymentStatus || '—'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                              Shipping
                            </p>
                            <p className="mt-1 text-sm text-slate-700">
                              {[
                                order.shippingAddress?.street,
                                order.shippingAddress?.city,
                                order.shippingAddress?.state,
                                order.shippingAddress?.zipCode,
                                order.shippingAddress?.country,
                              ]
                                .filter(Boolean)
                                .join(', ') || '—'}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 space-y-3">
                          {orderItems.map((item, idx) => {
                            const product = item.product || {};
                            return (
                              <div
                                key={item._id || idx}
                                className="flex items-center justify-between gap-3 border border-slate-100 px-3 py-2.5"
                              >
                                <div className="flex min-w-0 items-center gap-3">
                                  <img
                                    src={
                                      product?.images?.[0]?.url || FALLBACK_IMAGE
                                    }
                                    alt={product?.name || 'Product'}
                                    className="h-12 w-12 object-cover"
                                    onError={(e) => {
                                      e.target.src = FALLBACK_IMAGE;
                                    }}
                                  />
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-slate-800">
                                      {product?.name || 'Product unavailable'}
                                    </p>
                                    <p className="text-xs capitalize text-slate-400">
                                      {[item?.variant?.color, item?.variant?.size]
                                        .filter(Boolean)
                                        .join(' · ') || 'Standard'}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right text-sm">
                                  <p className="font-semibold text-slate-900">
                                    ${Number(item.price || 0).toFixed(2)}
                                  </p>
                                  <p className="text-xs text-slate-400">
                                    x{item.quantity}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default Order;
