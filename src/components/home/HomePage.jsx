import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import FloatOffer from '../common/FloatOffer';
import RunningOffer from '../common/RunningOffer';
import SwipperSlider from './SwiperSlider';
import CategoryPage from './CategoryPage';
import ProductPage from './ProductPage';
import MarketingPage from './MarketingPage';
import { FiTruck, FiShield, FiRefreshCw, FiHeadphones } from 'react-icons/fi';

const perks = [
  {
    icon: FiTruck,
    title: 'Free shipping',
    text: 'On orders over $50',
  },
  {
    icon: FiShield,
    title: 'Secure checkout',
    text: 'Protected payments',
  },
  {
    icon: FiRefreshCw,
    title: 'Easy returns',
    text: '30-day hassle-free',
  },
  {
    icon: FiHeadphones,
    title: '24/7 support',
    text: 'We’re here to help',
  },
];

const HomePage = () => {

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // smooth scrolling to top
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <RunningOffer />
      <SwipperSlider />

      <section className="border-y border-sky-100/80 bg-[linear-gradient(90deg,#f8fbfe_0%,#ffffff_50%,#f0f7fc_100%)]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
          {perks.map((perk, index) => {
            const Icon = perk.icon;
            return (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="flex items-start gap-3"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#0289de]/10 text-[#0289de]">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display text-sm font-bold text-slate-900 md:text-base">
                    {perk.title}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 md:text-sm">{perk.text}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <CategoryPage />
      <ProductPage />
      <MarketingPage />
      <FloatOffer />
    </div>
  );
};

export default HomePage;
