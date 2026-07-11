import React from 'react';
import { motion } from 'framer-motion';
import { FiSliders } from 'react-icons/fi';

const FilterComponent = ({ filters, onFilterChange }) => {
  const handlePriceRangeChange = (index, value) => {
    const newRange = [...filters.priceRange];
    newRange[index] = parseInt(value, 10);
    onFilterChange({ ...filters, priceRange: newRange });
  };

  const handleRatingChange = (rating) => {
    onFilterChange({
      ...filters,
      rating: filters.rating === rating ? 0 : rating,
    });
  };

  const handleCheckboxChange = (filterType) => {
    onFilterChange({ ...filters, [filterType]: !filters[filterType] });
  };

  return (
    <div className="border border-slate-100 bg-white p-5 shadow-[0_16px_40px_-28px_rgba(2,137,222,0.4)] sm:p-6 md:sticky md:top-8">
      <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-4">
        <span className="flex h-9 w-9 items-center justify-center bg-[#0289de]/10 text-[#0289de]">
          <FiSliders className="h-4 w-4" />
        </span>
        <div>
          <h3 className="font-display text-lg font-bold text-slate-900">Filters</h3>
          <p className="text-xs text-slate-400">Refine your results</p>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Price Range
        </h4>
        <div className="mb-2 flex justify-between text-sm font-medium text-slate-800">
          <span>${filters.priceRange[0]}</span>
          <span>${filters.priceRange[1]}</span>
        </div>
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="10000"
            value={filters.priceRange[0]}
            onChange={(e) => handlePriceRangeChange(0, e.target.value)}
            className="h-1.5 w-full cursor-pointer appearance-none bg-slate-200 accent-[#0289de]"
            aria-label="Minimum price"
          />
          <input
            type="range"
            min="0"
            max="10000"
            value={filters.priceRange[1]}
            onChange={(e) => handlePriceRangeChange(1, e.target.value)}
            className="h-1.5 w-full cursor-pointer appearance-none bg-slate-200 accent-[#0289de]"
            aria-label="Maximum price"
          />
        </div>
      </div>

      <div className="mb-6">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Minimum Rating
        </h4>
        <div className="space-y-1.5">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              type="button"
              className={`flex w-full items-center gap-2 px-3 py-2.5 text-sm transition ${
                filters.rating === rating
                  ? 'bg-[#0289de]/10 font-semibold text-[#0289de]'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
              onClick={() => handleRatingChange(rating)}
            >
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`h-3.5 w-3.5 ${
                      star <= rating ? 'text-amber-400' : 'text-slate-200'
                    }`}
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

      <div className="space-y-2 border-t border-slate-100 pt-5">
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Availability
        </h4>
        {[
          { key: 'inStock', label: 'In Stock Only' },
          { key: 'isBestSeller', label: 'Bestsellers' },
        ].map(({ key, label }) => (
          <label
            key={key}
            className="flex cursor-pointer items-center justify-between border border-slate-100 px-3 py-2.5 transition hover:border-sky-100"
          >
            <span className="text-sm text-slate-700">{label}</span>
            <input
              type="checkbox"
              checked={filters[key]}
              onChange={() => handleCheckboxChange(key)}
              className="h-4 w-4 accent-[#0289de]"
            />
          </label>
        ))}
      </div>

      <motion.button
        type="button"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="mt-6 w-full border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        onClick={() =>
          onFilterChange({
            priceRange: [0, 10000],
            rating: 0,
            inStock: false,
            isBestSeller: false,
          })
        }
      >
        Reset Filters
      </motion.button>
    </div>
  );
};

export default FilterComponent;
