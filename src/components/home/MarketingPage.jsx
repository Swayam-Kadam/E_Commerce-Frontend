import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const marketingItems = [
  {
    id: 1,
    image: '/images/png/home1.jpg',
    title: 'Summer Edit',
    description: 'Light layers & fresh colorways',
    cta: 'Shop the edit',
  },
  {
    id: 2,
    image: '/images/png/home2.jpg',
    title: 'Everyday Essentials',
    description: 'Home & lifestyle staples',
    cta: 'Explore now',
  },
  {
    id: 3,
    image: '/images/png/home3.jpg',
    title: 'Member Deals',
    description: 'Exclusive prices this week',
    cta: 'See offers',
  },
];

const MarketingPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsCompact(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === marketingItems.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? marketingItems.length - 1 : prev - 1
    );
  };

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#eef5fb_100%)] py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-xl md:mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0289de]">
            This season
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Looks & offers worth opening
          </h2>
          <p className="mt-2 text-base text-slate-500">
            Seasonal campaigns curated for SwiftCart shoppers.
          </p>
        </div>

        {isCompact ? (
          <div className="relative mx-auto max-w-2xl overflow-hidden">
            <div className="relative h-80">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 80 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -80 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0 overflow-hidden"
                >
                  <img
                    src={marketingItems[currentIndex].image}
                    alt={marketingItems[currentIndex].title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <h3 className="font-display text-2xl font-bold">
                      {marketingItems[currentIndex].title}
                    </h3>
                    <p className="mt-1 text-sm text-white/75">
                      {marketingItems[currentIndex].description}
                    </p>
                    <Link
                      to="/#featured-products"
                      className="mt-4 inline-flex text-sm font-semibold text-sky-200 underline-offset-4 hover:underline"
                    >
                      {marketingItems[currentIndex].cta}
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={prevSlide}
              className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-white/90 text-slate-800 shadow-md"
              aria-label="Previous slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>

            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-white/90 text-slate-800 shadow-md"
              aria-label="Next slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>

            <div className="mt-4 flex justify-center gap-2">
              {marketingItems.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    currentIndex === index ? 'w-6 bg-[#0289de]' : 'w-2 bg-slate-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-5">
            {marketingItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="group relative h-64 overflow-hidden"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <h3 className="font-display text-xl font-bold">{item.title}</h3>
                  <p className="mt-1 text-sm text-white/70">{item.description}</p>
                  <Link
                    to="/#featured-products"
                    className="mt-3 inline-flex text-sm font-semibold text-sky-200 underline-offset-4 transition group-hover:underline"
                  >
                    {item.cta}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MarketingPage;
