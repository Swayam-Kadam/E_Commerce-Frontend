import React from 'react';
import { motion } from 'framer-motion';

const RunningOffer = () => {
  const offerText = "🔥 Limited Time Offer! Get 50% OFF on all products. Use code: SAVE50 🔥";
  
  return (
    <div className=" top-0 left-0 right-0 bg-gradient-to-r from-[#0289de] to-red-600 text-white py-3 overflow-hidden z-50 shadow-lg">
      <motion.div
        className="whitespace-nowrap"
        animate={{
          x: ["100%", "-100%"]
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 15,
            ease: "linear"
          }
        }}
      >
        <span className="text-sm md:text-base font-semibold tracking-wide mx-4">
          {offerText}
        </span>
        {/* Duplicate for seamless looping */}
        <span className="text-sm md:text-base font-semibold tracking-wide mx-4">
          {offerText}
        </span>
        {/* Duplicate for seamless looping */}
        <span className="text-sm md:text-base font-semibold tracking-wide mx-4">
          {offerText}
        </span>


      </motion.div>
      

    </div>
  );
};

export default RunningOffer;