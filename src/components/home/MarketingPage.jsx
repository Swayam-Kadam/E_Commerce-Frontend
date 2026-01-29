import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';

const MarketingPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  const marketingItems = [
    {
      id: 1,
      image: "/images/png/home1.jpg",

      bgColor: "bg-yellow-400"
    },
    {
      id: 2,
      image: "/images/png/home2.jpg",

      bgColor: "bg-blue-100"
    },
    {
      id: 3,
      image: "/images/png/home3.jpg",

      bgColor: "bg-pink-100"
    }
  ];

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === marketingItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? marketingItems.length - 1 : prevIndex - 1
    );
  };

  // For mobile/tablet, show only one card at a time
  if (isMobile || isTablet) {
    return (
      <div className="relative max-w-2xl mx-auto overflow-hidden">
        <div className="relative h-80">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className={`h-80 rounded-xl overflow-hidden cursor-pointer ${marketingItems[currentIndex].bgColor} absolute inset-0`}
            >
              <motion.img 
                src={marketingItems[currentIndex].image} 
                alt={marketingItems[currentIndex].title}
                className="h-full w-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
              {/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                <h3 className="text-xl font-bold">{marketingItems[currentIndex].title}</h3>
                <p>{marketingItems[currentIndex].description}</p>
              </div> */}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation buttons */}
        <button 
          onClick={prevSlide}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        
        <button 
          onClick={nextSlide}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Indicator dots */}
        <div className="flex justify-center mt-4 space-x-2">
          {marketingItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 w-2 rounded-full ${currentIndex === index ? 'bg-blue-500' : 'bg-gray-300'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    );
  }

  // For desktop, show all cards
  return (
    <div className='flex m-auto gap-5 max-w-7xl justify-between mb-5'>
      {marketingItems.map((item) => (
        <motion.div 
          key={item.id}
          className={`h-60 w-full rounded-xl overflow-hidden cursor-pointer ${item.bgColor} relative`}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <motion.img 
            src={item.image} 
            alt={item.title}
            className="h-full w-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
          {/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
            <h3 className="text-lg font-bold">{item.title}</h3>
            <p className="text-sm">{item.description}</p>
          </div> */}
        </motion.div>
      ))}
    </div>
  );
};

export default MarketingPage;