import React, { useEffect, useState, useMemo } from 'react';
import ProductCard from '../common/ProductCard';
import EditProductModal from '../component/EditProductModal';
import { FiSearch, FiFilter } from "react-icons/fi";
import { getProduct, deleteProduct } from '../slice';
import { useDispatch, useSelector } from 'react-redux';
import PageLoader from '@/components/common/PageLoader';

const ManageProduct = () => {
  const { productList, productListLoading } = useSelector(state => state.admin);
  const dispatch = useDispatch();
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [categoryQuery, setCategoryQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Fetch products on component mount
  useEffect(() => {
    dispatch(getProduct());
  }, [dispatch]);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (productId) => {
    try {
      // Update Redux state immediately for better UX
      // dispatch(deleteProduct(productId));
      
      
      // Optionally, you can refresh the product list
      // dispatch(getProduct());
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleSave = (updatedProduct) => {
    // Update logic here
    setIsModalOpen(false);
    setSelectedProduct(null);
    
    // Refresh product list
    dispatch(getProduct());
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Get unique categories from product list
  const categories = useMemo(() => {
    if (!productList || productList.length === 0) return [];
    
    const uniqueCategories = [...new Set(productList
      .map(product => product.category)
      .filter(category => category)
    )];
    
    return uniqueCategories.sort();
  }, [productList]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!productList || productList.length === 0) return [];
    
    let filtered = [...productList];
    
    // Apply search filter
    if (query.trim()) {
      const searchTerm = query.toLowerCase().trim();
      filtered = filtered.filter(product => 
        (product.name && product.name.toLowerCase().includes(searchTerm)) ||
        (product.description && product.description.toLowerCase().includes(searchTerm)) ||
        (product.category && product.category.toLowerCase().includes(searchTerm)) ||
        (product.price && String(product.price).includes(searchTerm))
      );
    }
    
    // Apply category filter
    if (categoryQuery) {
      filtered = filtered.filter(product => 
        product.category && product.category.toLowerCase() === categoryQuery.toLowerCase()
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [productList, query, categoryQuery, sortBy]);

  // Reset all filters
  const handleResetFilters = () => {
    setQuery("");
    setCategoryQuery("");
    setSortBy("name");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {productListLoading && <PageLoader show/>}
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Manage Products</h1>
              <p className="text-gray-600 mt-2">
                Manage your product inventory, edit details, and remove products
              </p>
            </div>
            <button
              onClick={() => dispatch(getProduct())}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Refresh Products
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Products
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, description, category, or price..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0289de] focus:border-transparent"
                />
                <FiSearch className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0289de] focus:border-transparent"
                value={categoryQuery}
                onChange={(e) => setCategoryQuery(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0289de] focus:border-transparent"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
                <option value="newest">Newest First</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Reset Button */}
          {(query || categoryQuery || sortBy !== 'name') && (
            <div className="mt-4">
              <button
                onClick={handleResetFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600">Total Products</p>
            <p className="text-2xl font-bold">{productList.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600">Filtered Products</p>
            <p className="text-2xl font-bold">{filteredProducts.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600">Categories</p>
            <p className="text-2xl font-bold">{categories.length}</p>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <>
            <div className="mb-4 text-gray-600">
              Showing {filteredProducts.length} of {productList.length} products
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {productList.length === 0 ? "No products found" : "No matching products"}
            </h3>
            <p className="text-gray-600 mb-6">
              {productList.length === 0 
                ? "Add some products to get started" 
                : "Try changing your search or filter criteria"}
            </p>
            {productList.length === 0 ? (
              <button
                onClick={() => window.location.href = '/admin/addproduct'}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add Your First Product
              </button>
            ) : (
              <button
                onClick={handleResetFilters}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* Edit Product Modal */}
        {selectedProduct && (
          <EditProductModal
            product={selectedProduct}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
};

export default ManageProduct;