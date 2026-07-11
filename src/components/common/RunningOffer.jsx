import React from 'react';
import { motion } from 'framer-motion';

const RunningOffer = () => {
  const offerText =
    'Limited time — 50% OFF sitewide · Use code SAVE50 · Free shipping over $50 · New drops every week';

  return (
    <div className="overflow-hidden bg-[linear-gradient(90deg,#0169ab_0%,#0289de_45%,#0ea5e9_100%)] py-2.5 text-white shadow-sm">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 28,
            ease: 'linear',
          },
        }}
      >
        {[0, 1].map((copy) => (
          <span
            key={copy}
            className="mx-8 text-xs font-semibold tracking-[0.08em] sm:text-sm"
          >
            {offerText}
            <span className="mx-8 opacity-50">◆</span>
            {offerText}
            <span className="mx-8 opacity-50">◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default RunningOffer;
