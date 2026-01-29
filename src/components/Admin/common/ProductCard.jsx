// // components/common/ProductCard.jsx
// import React, { useState } from 'react';
// import { FiEdit, FiTrash2, FiStar, FiShoppingBag } from 'react-icons/fi';
// import ConfirmModal from './ConfirmModal';

// const ProductCard = ({ 
//   product, 
//   onEdit, 
//   onDelete, 
//   className = '' 
// }) => {
//   const {
//     id,
//     name,
//     category,
//     price,
//     originalPrice,
//     rating,
//     reviewCount,
//     image,
//     isNew,
//     isBestSeller,
//     colors,
//     inStock
//   } = product;

//    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);

//   const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

//   const handleEdit = () => {
//     onEdit(product);
//   };

//   const handleDeleteClick = () => {
//     setIsDeleteModalOpen(true);
//   };

//   const handleConfirmDelete = async () => {
//     setIsDeleting(true);
//     try {
//       await onDelete(id);
//       setIsDeleteModalOpen(false);
//     } catch (error) {
//       console.error('Error deleting product:', error);
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   const handleCloseModal = () => {
//     if (!isDeleting) {
//       setIsDeleteModalOpen(false);
//     }
//   };


//   return (
//     <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}>
//       {/* Product Image */}
//       <div className="relative">
//         <img 
//           src={image} 
//           alt={name}
//           className="w-full h-48 object-cover"
//         />
        
//         {/* Badges */}
//         <div className="absolute top-2 left-2 flex gap-2">
//           {isNew && (
//             <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
//               New
//             </span>
//           )}
//           {isBestSeller && (
//             <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
//               Bestseller
//             </span>
//           )}
//           {discount > 0 && (
//             <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
//               -{discount}%
//             </span>
//           )}
//         </div>

//         {/* Stock Status */}
//         <div className="absolute top-2 right-2">
//           {inStock ? (
//             <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
//               In Stock
//             </span>
//           ) : (
//             <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold">
//               Out of Stock
//             </span>
//           )}
//         </div>
//       </div>

//       {/* Product Info */}
//       <div className="p-4">
//         {/* Category */}
//         <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
//           <FiShoppingBag className="text-xs" />
//           <span>{category}</span>
//         </div>

//         {/* Product Name */}
//         <h3 className="font-semibold text-lg mb-2 line-clamp-1">{name}</h3>

//         {/* Rating */}
//         <div className="flex items-center gap-2 mb-3">
//           <div className="flex items-center gap-1">
//             <FiStar className="text-yellow-400 fill-current" />
//             <span className="font-semibold">{rating}</span>
//           </div>
//           <span className="text-gray-500 text-sm">({reviewCount} reviews)</span>
//         </div>

//         {/* Colors */}
//         <div className="flex items-center gap-2 mb-3">
//           <span className="text-sm text-gray-600">Colors:</span>
//           <div className="flex gap-1">
//             {colors.map((color, index) => (
//               <div
//                 key={index}
//                 className="w-4 h-4 rounded-full border border-gray-300"
//                 style={{ backgroundColor: color }}
//                 title={color}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Price */}
//         <div className="flex items-center gap-2 mb-4">
//           <span className="text-2xl font-bold text-gray-900">${price}</span>
//           {originalPrice > price && (
//             <span className="text-lg text-gray-500 line-through">${originalPrice}</span>
//           )}
//         </div>

//         {/* Action Buttons */}
//         <div className="flex gap-2">
//           <button
//             onClick={handleEdit}
//             className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
//           >
//             <FiEdit className="text-sm" />
//             Edit
//           </button>
//           <button
//              onClick={handleDeleteClick}
//             className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
//           >
//             <FiTrash2 className="text-sm" />
//             Delete
//           </button>
//         </div>
//       </div>
//       {/* Confirm Delete Modal */}
//       <ConfirmModal
//         isOpen={isDeleteModalOpen}
//         onClose={handleCloseModal}
//         onConfirm={handleConfirmDelete}
//         title="Delete Product"
//         message={`Are you sure you want to delete "${name}"? This action cannot be undone.`}
//         confirmText="Delete"
//         cancelText="Cancel"
//         type="delete"
//         isLoading={isDeleting}
//       />
//     </div>
//   );
// };

// export default ProductCard;


import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiStar, FiShoppingBag } from 'react-icons/fi';
import ConfirmModal from './ConfirmModal';

const ProductCard = ({ 
  product, 
  onEdit, 
  onDelete, 
  className = '' 
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Destructure with fallbacks for API data structure
  const {
    _id, // Use _id from API
    id, // Fallback to id
    name = 'Unnamed Product',
    category = 'Uncategorized',
    price = 0,
    originalPrice,
    averageRating: rating = 0,
    reviews = [],
    images = [],
    isBestSeller = false,
    variants = [],
    stock = 0,
    createdAt
  } = product;

  // Use _id if available, otherwise id
  const productId = _id || id;
  
  // Handle image - use first image from API or fallback
  const image = images && images.length > 0 
    ? images[0]?.url 
    : '/images/default-product.jpg';
  
  // Handle colors from variants
  const colors = variants && variants.length > 0 
    ? variants[0]?.color || [] 
    : [];
  
  // Check if product is new (less than 7 days old)
  const isNew = createdAt ? 
    (Date.now() - new Date(createdAt).getTime()) < (7 * 24 * 60 * 60 * 1000) 
    : false;
  
  // Calculate discount if originalPrice exists
  const discount = originalPrice && price && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;
  
  // Review count
  const reviewCount = reviews ? reviews.length : 0;

  const handleEdit = () => {
    onEdit(product);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(productId);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseModal = () => {
    if (!isDeleting) {
      setIsDeleteModalOpen(false);
    }
  };

  // Render color dots
  const renderColorDots = () => {
    if (!colors || colors.length === 0) return null;
    
    // Define color mappings for common color names
    const colorMap = {
      'red': '#ef4444',
      'blue': '#3b82f6',
      'green': '#10b981',
      'yellow': '#fbbf24',
      'purple': '#8b5cf6',
      'pink': '#ec4899',
      'gray': '#6b7280',
      'black': '#000000',
      'white': '#ffffff',
      'brown': '#92400e',
      'orange': '#f97316'
    };
    
    // Take only first 3 colors to avoid clutter
    const displayColors = colors.slice(0, 3);
    
    return (
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm text-gray-600">Colors:</span>
        <div className="flex gap-1">
          {displayColors.map((color, index) => {
            // Convert color name to hex code or use as-is
            const colorValue = colorMap[color.toLowerCase()] || color;
            
            return (
              <div
                key={index}
                className="w-5 h-5 rounded-full border border-gray-300"
                style={{ backgroundColor: colorValue }}
                title={color}
              />
            );
          })}
          {colors.length > 3 && (
            <span className="text-xs text-gray-500 ml-1">
              +{colors.length - 3} more
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}>
      {/* Product Image */}
      <div className="relative">
        <img 
          src={image} 
          alt={name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/default-product.jpg';
          }}
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-2">
          {isNew && (
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              New
            </span>
          )}
          {isBestSeller && (
            <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Bestseller
            </span>
          )}
          {discount > 0 && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              -{discount}%
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="absolute top-2 right-2">
          {stock > 0 ? (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
              {stock} in stock
            </span>
          ) : (
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
          <FiShoppingBag className="text-xs" />
          <span className="capitalize">{category}</span>
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{name}</h3>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <FiStar className="text-yellow-400 fill-current" />
              <span className="font-semibold">{rating.toFixed(1)}</span>
            </div>
            <span className="text-gray-500 text-sm">({reviewCount} reviews)</span>
          </div>
        )}

        {/* Colors */}
        {renderColorDots()}

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold text-gray-900">${price.toFixed(2)}</span>
          {originalPrice && originalPrice > price && (
            <>
              <span className="text-lg text-gray-500 line-through">${originalPrice.toFixed(2)}</span>
              <span className="text-sm font-semibold text-green-600">
                Save ${(originalPrice - price).toFixed(2)}
              </span>
            </>
          )}
        </div>

        {/* Product ID (for debugging) */}
        <div className="text-xs text-gray-400 mb-3 truncate">
          ID: {productId?.substring(0, 8)}...
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <FiEdit className="text-sm" />
            Edit
          </button>
          <button
            onClick={handleDeleteClick}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <FiTrash2 className="text-sm" />
            Delete
          </button>
        </div>
      </div>
      
      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${name}"? This action cannot be undone.`}
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        type="delete"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ProductCard;