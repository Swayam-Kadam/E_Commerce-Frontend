
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../../home/ProductCard';
import FilterComponent from '../components/FilterComponent';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct } from '@/components/home/slice';

const MainCategory = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    rating: 0,
    inStock: false,
    isBestSeller: false
  });

  useEffect(()=>{
    dispatch(getProduct());
  },[])

  const { productList = [], productListLoading = false } = useSelector(state => state.home || {});

  // Extract all unique categories - SIMPLIFIED like ProductPage.jsx
  const categories = React.useMemo(() => {
    const uniqueCategories = [...new Set(productList.map(product => product.category))];
    return ['All', ...uniqueCategories.filter(cat => cat && cat.trim() !== '')];
  }, [productList]);

  // Apply filters whenever categoryName, filters, or productList changes
  useEffect(() => {
    let result = [...productList];
    console.log("result1:-",result)
    
    // Filter by category from URL - SIMPLE COMPARISON like ProductPage.jsx
    if (categoryName && categoryName !== 'All') {
      // Use exact match like ProductPage.jsx
      result = result.filter(product => product.category === categoryName);
    }
    console.log("result2:-",result)
    
    // Apply additional filters
    result = result.filter(product => {
      const hasStock = product.stock > 0;
      const price = product.price || 0;
      const rating = product.averageRating || 0;
      
      const priceMatch = price >= filters.priceRange[0] && price <= filters.priceRange[1];
      const ratingMatch = rating >= filters.rating;
      const stockMatch = !filters.inStock || hasStock;
      const bestSellerMatch = !filters.isBestSeller || product.isBestSeller;
      
      return priceMatch && ratingMatch && stockMatch && bestSellerMatch;
    });
    
    console.log("result3:-",result)
    setFilteredProducts(result);
  }, [categoryName, filters, productList]);

  const handleCategoryChange = (category) => {
    // Navigate with exact category name from data
    navigate(`/category/${category}`);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Add this useEffect to debug


  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Category Navigation */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-10'>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          {categoryName === 'All' ? 'All Products' : categoryName}
        </h2>
        
        <div className='flex flex-wrap gap-3 md:gap-5'>
          {categories.map(category => {
            const isActive = categoryName === category || 
              (categoryName === 'All' && category === 'All');
            
            return (
              <div 
                key={category} 
                className="relative cursor-pointer"
                onClick={() => handleCategoryChange(category)}
              >
                <span 
                  className={`text-sm font-medium transition-colors duration-300 ${
                    isActive ? 'text-[#0289de]' : 'text-gray-600 hover:text-[#0289de]'
                  }`}
                >
                  {category.toUpperCase()}
                </span>
                
                {/* Animated underline */}
                {isActive && (
                  <motion.div 
                    className="absolute left-0 right-0 -bottom-1 h-0.5 bg-[#0289de]"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filter Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <FilterComponent 
            filters={filters} 
            onFilterChange={handleFilterChange} 
          />
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Showing {filteredProducts.length} products
            </p>
            
            {/* Reset filters button if any filter is active */}
            {(filters.priceRange[0] > 0 || filters.priceRange[1] < 10000 || 
              filters.rating > 0 || filters.inStock || filters.isBestSeller) && (
              <button
                className="text-sm text-blue-600 hover:text-blue-800"
                onClick={() => setFilters({
                  priceRange: [0, 10000],
                  rating: 0,
                  inStock: false,
                  isBestSeller: false
                })}
              >
                Reset Filters
              </button>
            )}
          </div>

          {filteredProducts.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {filteredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your filters.</p>
              <button 
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                onClick={() => setFilters({
                  priceRange: [0, 10000],
                  rating: 0,
                  inStock: false,
                  isBestSeller: false
                })}
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainCategory;