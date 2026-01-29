// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { addToCart } from '../AddToCart/slice/CartSlice';
// import { addToWishlist, removeFromWishlist } from '../Wishlist/slice/WishlistSlice';
// import { useDispatch,useSelector } from 'react-redux';

// const ProductCard = ({ product }) => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
  
//   // Use optional chaining with default value
//   const wishlistItems = useSelector(state => state.wishlist?.items) || [];

//   const isInWishlist = wishlistItems.some(item => item.id === product.id);

//   const handleViewClick = () => {
//     navigate(`/product/${product.id}`);
//   };

//   const handleAddToCart = (e) => {
//     e.stopPropagation();
//     dispatch(addToCart({
//       id: product.id,
//       name: product.name,
//       price: product.price,
//       image: product.image,
//     }));
//   };

//   const handleWishlist = (e) => {
    
//     e.stopPropagation();
//     if (isInWishlist) {
//       dispatch(removeFromWishlist(product.id));
//     } else {
//       dispatch(addToWishlist({
//         id: product.id,
//         name: product.name,
//         price: product.price,
//         originalPrice: product.originalPrice,
//         image: product.image,
//         inStock: product.inStock,
//       }));
//     }
//   };

//   return (
//     <div 
//       className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col cursor-pointer"
//       onClick={handleViewClick}
//     >
//       <div className="relative">
//         <img 
//           src={product.image} 
//           alt={product.name}
//           className="w-full h-48 object-cover"
//         />
        
//         {/* Badges */}
//         <div className="absolute top-2 left-2 flex flex-col space-y-2">
//           {product.isNew && (
//             <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
//               New
//             </span>
//           )}
//           {product.isBestSeller && (
//             <span className="bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded">
//               Bestseller
//             </span>
//           )}
//         </div>
        
//         {/* Favorite button */}
//         <button 
//           className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md hover:bg-red-50"
//           onClick={handleWishlist}
//         >
//           <svg 
//             xmlns="http://www.w3.org/2000/svg" 
//             className={`h-5 w-5 ${isInWishlist ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-500'}`}
//             viewBox="0 0 23 23" 
//             stroke="currentColor"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//           </svg>
//         </button>
//       </div>
      
//       <div className="p-4 flex-grow flex flex-col">
//         <span className="text-xs text-gray-500 uppercase">{product.category}</span>
//         <h3 className="text-lg font-semibold text-gray-800 mt-1 mb-2">{product.name}</h3>
        
//         {/* Rating */}
//         <div className="flex items-center mb-3">
//           <div className="flex">
//             {[1, 2, 3, 4, 5].map((star) => (
//               <svg 
//                 key={star} 
//                 xmlns="http://www.w3.org/2000/svg" 
//                 className={`h-4 w-4 ${star <= Math.floor(product.rating) ? 'text-amber-400' : 'text-gray-300'}`} 
//                 viewBox="0 0 20 20" 
//                 fill="currentColor"
//               >
//                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//               </svg>
//             ))}
//           </div>
//           <span className="text-xs text-gray-500 ml-1">
//             ({product.reviewCount})
//           </span>
//         </div>
        
//         {/* Color options */}
//         <div className="mt-auto mb-3">
//           <div className="flex space-x-2">
//             {product.colors.map((color, index) => (
//               <div 
//                 key={index}
//                 className="w-4 h-4 rounded-full border border-gray-200"
//                 style={{ backgroundColor: color === 'white' ? '#fff' : color }}
//                 title={color}
//               ></div>
//             ))}
//           </div>
//         </div>
        
//         {/* Price and action buttons */}
//         <div className="flex items-center justify-between mt-auto">
//           <div className="flex flex-col">
//             <span className="text-lg font-bold text-gray-900">${product.price}</span>
//             {product.originalPrice && (
//               <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
//             )}
//           </div>
//           <div className="flex space-x-2">
//             <button 
//               className="bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors cursor-pointer"
//               onClick={handleViewClick}
//             >
//               View
//             </button>
//             <button 
//               className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
//               onClick={handleAddToCart}
//             >
//               Add to Cart
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../AddToCart/slice/CartSlice';
import { addToWishlist, removeFromWishlist } from '../Wishlist/slice/WishlistSlice';
import { useDispatch, useSelector } from 'react-redux';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Use optional chaining with default value
  const wishlistItems = useSelector(state => state.wishlist?.items) || [];

  const isInWishlist = wishlistItems.some(item => item.id === product._id || item.id === product.id);

  const handleViewClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
    }));
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist({
        id: product._id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        inStock: product.inStock,
      }));
    }
  };

  // Handle colors from variants
  const colors = product.variants && product.variants.length > 0 
    ? product.variants[0]?.color || [] 
    : [];

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

  // Ensure product has required properties with fallbacks
  const productName = product.name || 'Unnamed Product';
  const productImage = product?.images[0]?.url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80';
  const productCategory = product.category || 'Uncategorized';
  const productPrice = product.price || 0;
  const productRating = product.rating || product.averageRating || 0;
  const reviewCount =  product.reviews?.length || 0;
  // const colors =  product.variants?.map(v => v.color) || ['default'];

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col cursor-pointer"
      onClick={handleViewClick}
    >
      <div className="relative">
        <img 
          src={productImage} 
          alt={productName}
          className="w-full h-48 object-cover"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col space-y-2">
          {product.isNew && (
            <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
              New
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded">
              Bestseller
            </span>
          )}
          {product.stock < 1 && (
            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
              Out of Stock
            </span>
          )}
        </div>
        
        {/* Favorite button */}
        <button 
          className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md hover:bg-red-50"
          onClick={handleWishlist}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 ${isInWishlist ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-500'}`}
            viewBox="0 0 23 23" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <span className="text-xs text-gray-500 uppercase">{productCategory}</span>
        <h3 className="text-lg font-semibold text-gray-800 mt-1 mb-2">{productName}</h3>
        
        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg 
                key={star} 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 ${star <= Math.floor(productRating) ? 'text-amber-400' : 'text-gray-300'}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">
            ({reviewCount})
          </span>
        </div>
        
        {/* Color options */}
        {/* {colors.length > 0 && (
          <div className="mt-auto mb-3">
            <div className="flex space-x-2">
              {colors.slice(0, 5).map((color, index) => (
                <div 
                  key={index}
                  className="w-4 h-4 rounded-full border border-gray-200"
                  style={{ backgroundColor: color === 'white' ? '#fff' : color }}
                  title={color}
                ></div>
              ))}
              {colors.length > 5 && (
                <div className="w-4 h-4 rounded-full border border-gray-200 flex items-center justify-center">
                  <span className="text-xs">+{colors.length - 5}</span>
                </div>
              )}
            </div>
          </div>
        )} */}
        {renderColorDots()}
        
        {/* Price and action buttons */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">${productPrice}</span>
            {product.originalPrice && product.originalPrice > productPrice && (
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>
          <div className="flex space-x-2">
            <button 
              className="bg-gray-200 text-gray-800 px-3 py-1.5 rounded-sm text-sm font-medium hover:bg-gray-300 transition-colors cursor-pointer"
              onClick={handleViewClick}
            >
              View
            </button>
            <button 
              className=" text-white px-3 py-1.5 rounded-sm text-sm font-medium  transition-colors cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={handleAddToCart}
              disabled={product.stock < 1}
              style={{backgroundColor:'#0289DE'}}
            >
              {product.stock > 1 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;