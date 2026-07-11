import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const FloatOffer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentOffer, setCurrentOffer] = useState(0);

  const offers = [
    { text: '50% OFF — limited time', code: 'SAVE50' },
    { text: 'Free shipping over $50', code: null },
    { text: 'First order perk', code: 'WELCOME25' },
    { text: 'Member weekend deals', code: null },
  ];

  useEffect(() => {
    const showTimer = setTimeout(() => setIsVisible(true), 2200);
    const rotateTimer = setInterval(() => {
      setCurrentOffer((prev) => (prev + 1) % offers.length);
    }, 5000);

    return () => {
      clearTimeout(showTimer);
      clearInterval(rotateTimer);
    };
  }, [offers.length]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 80, scale: 0.96 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 right-4 z-50 sm:right-6"
        >
          <div className="relative w-[min(92vw,300px)] overflow-hidden border border-sky-100 bg-white shadow-[0_24px_50px_-20px_rgba(2,137,222,0.55)]">
            <div className="h-1 w-full bg-[linear-gradient(90deg,#0169ab,#0289de,#38bdf8)]" />

            <button
              type="button"
              onClick={() => setIsVisible(false)}
              className="absolute right-2 top-3 flex h-7 w-7 items-center justify-center text-slate-400 transition hover:text-slate-700"
              aria-label="Close offer"
            >
              ×
            </button>

            <div className="px-4 pb-4 pt-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0289de]">
                SwiftCart deal
              </p>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentOffer}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="mt-2"
                >
                  <p className="font-display text-base font-bold text-slate-900">
                    {offers[currentOffer].text}
                  </p>
                  {offers[currentOffer].code && (
                    <p className="mt-1 text-xs text-slate-500">
                      Code{' '}
                      <span className="font-semibold text-[#0289de]">
                        {offers[currentOffer].code}
                      </span>
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>

              <Link
                to="/#featured-products"
                className="mt-3 inline-flex w-full items-center justify-center bg-[#0289de] px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-[#0169ab]"
              >
                Shop the deal
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatOffer;
