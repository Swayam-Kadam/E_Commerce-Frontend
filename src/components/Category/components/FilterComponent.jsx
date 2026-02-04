
import React from 'react';
import { motion } from 'framer-motion';

const FilterComponent = ({ filters, onFilterChange }) => {
  const handlePriceRangeChange = (index, value) => {
    const newRange = [...filters.priceRange];
    newRange[index] = parseInt(value);
    onFilterChange({ ...filters, priceRange: newRange });
  };

  const handleRatingChange = (rating) => {
    onFilterChange({ ...filters, rating: filters.rating === rating ? 0 : rating });
  };

  const handleCheckboxChange = (filterType) => {
    onFilterChange({ ...filters, [filterType]: !filters[filterType] });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Filters</h3>
      
      {/* Price Range Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Price Range</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">${filters.priceRange[0]}</span>
            <span className="text-sm text-gray-600">${filters.priceRange[1]}</span>
          </div>
          <input
            type="range"
            min="0"
            max="10000"
            value={filters.priceRange[0]}
            onChange={(e) => handlePriceRangeChange(0, e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <input
            type="range"
            min="0"
            max="10000"
            value={filters.priceRange[1]}
            onChange={(e) => handlePriceRangeChange(1, e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Minimum Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map(rating => (
            <button
              key={rating}
              className={`flex items-center w-full p-2 rounded-md text-sm ${
                filters.rating === rating 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => handleRatingChange(rating)}
            >
              <div className="flex mr-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg
                    key={star}
                    className={`h-4 w-4 ${star <= rating ? 'text-amber-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span>& up</span>
            </button>
          ))}
        </div>
      </div>

      {/* Checkbox Filters - UPDATED to match your data */}
      <div className="space-y-3">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={() => handleCheckboxChange('inStock')}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.isBestSeller}
            onChange={() => handleCheckboxChange('isBestSeller')}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Bestsellers</span>
        </label>
        
        {/* You can add isNew back when you have that property in your data */}
      </div>

      {/* Reset Filters Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-6 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
        onClick={() => onFilterChange({
          priceRange: [0, 10000],
          rating: 0,
          inStock: false,
          isBestSeller: false
        })}
      >
        Reset Filters
      </motion.button>
    </div>
  );
};

export default FilterComponent;