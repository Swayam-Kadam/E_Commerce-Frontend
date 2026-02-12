import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { removeFromWishlist, getAllWhishlist, toggleWhishlist, getWhishlistCount, clearWhishlist } from '../slice/WishlistSlice';
import { addToCart } from '../../AddToCart/slice/CartSlice';
import { useDispatch,useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import PageLoader from '@/components/common/PageLoader';

const WishlistPage = () => {
  const dispatch = useDispatch();
  // const wishlistItems = useSelector(state => state.wishlist?.items) || [];
   const { 
  items: wishlistItems, 
  totalWishlistQuantity,
  allWhishlistData,
  allWhishlistLoading 
} = useSelector((state) => ({
  items: state?.wishlist?.items,  // Changed from whishlist to wishlist
  totalWishlistQuantity: state?.wishlist?.totalWishlistQuantity,
  allWhishlistData: state?.wishlist?.allWhishlistData?.data?.data?.products,
  allWhishlistLoading: state?.wishlist?.allWhishlistLoading,
}));

   useEffect(()=>{
    dispatch(getAllWhishlist())
   },[])

  const removeFromWishlistHandler = (id) => {
    dispatch(removeFromWishlist(id));
    let payload={
                  productId:id
                }
    dispatch(toggleWhishlist(payload?.productId)).then((res)=>{
      if(res?.payload?.status === 200 || res?.payload?.status === 201){
        toast.success("Whishlist Removed Successfully")
        dispatch(getWhishlistCount());
        dispatch(getAllWhishlist());
      }
    })
  };

  const moveToCart = (item) => {
    dispatch(addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    }));
    dispatch(removeFromWishlist(item.id));
  };

  const clearWishlistHandler = () => {
    dispatch(clearWhishlist()).then((res)=>{
      if(res?.payload?.status === 200 || res?.payload?.status === 201){
        toast.warning("Wishlist Clear Successfully")
        dispatch(getAllWhishlist());
        dispatch(getWhishlistCount());
      }
    });
  };

  console.log(allWhishlistData);

  if(allWhishlistLoading){
    return <PageLoader loadingState/>
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.h1 
        className="text-3xl font-bold text-gray-800 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Your Wishlist ({allWhishlistData?.length} {allWhishlistData?.length === 1 ? 'item' : 'items'})
      </motion.h1>

      {allWhishlistData?.length === 0 ? (
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-6xl mb-4">❤️</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-8">Save your favorite items here for later.</p>
          <Link 
            to="/category/All"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Shopping
          </Link>
        </motion.div>
      ) : (
        <>
          {/* Clear Wishlist Button */}
          <motion.div 
            className="flex justify-end mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors cursor-pointer"
              onClick={clearWishlistHandler}
            >
              Clear Wishlist
            </button>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence>
              {allWhishlistData?.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <img 
                      src={item?.images[0]?.url} 
                      alt={item?.images[0]?.filename}
                      className="w-full h-48 object-cover"
                    />
                    
                    <button 
                      className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-red-50"
                      onClick={() =>{ 
                        let payload={
                          productId:item._id
                        }
                        removeFromWishlistHandler(payload);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {item.stock === 0 && (
                      <div className="absolute top-2 left-2 bg-gray-500 text-white text-xs font-semibold px-2 py-1 rounded">
                        Out of Stock
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.name}</h3>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">${item.price.toFixed(2)}</span>
                        {item.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">${item.originalPrice.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                          item.stock > 0 
                            ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        onClick={() => item.inStock && moveToCart(item)}
                        // disabled={!item.inStock}
                        disabled={item.stock < 1 || item?.cartInfo?.inCart}
                        style={{backgroundColor:item.stock < 1 || item?.cartInfo?.inCart?'#3FA0DE':'#0289DE'}}
                      >
                        {item.stock < 1 ? 'Out of Stock' : item?.cartInfo?.inCart ?'Added To Cart':'Add To Cart'}
                      </motion.button>
                      
                      <Link 
                        to={`/product/${item._id}`}
                        className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default WishlistPage;