// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { supabase } from '../../lib/supabaseClient';
// import productsData from '../../Products.json'; // Import your products JSON file
// import { useDispatch, useSelector } from 'react-redux';
// import { getAllReview } from '../slice';

// const ShowReview = () => {
//   const dispatch = useDispatch();
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filterRating, setFilterRating] = useState('all');
//   const [sortBy, setSortBy] = useState('newest');

//     const { reviewList, reviewLoadingList } = useSelector(state => state.admin);

//   useEffect(()=>{
//     dispatch(getAllReview())
//   },[])

//   console.log(reviewList)

//   // Function to get product details from JSON file by product_id
//   const getProductDetails = (productId) => {
//     const product = productsData.products.find(p => p.id === productId);
//     if (product) {
//       return {
//         name: product.name,
//         image: product.image,
//         category: product.category,
//         price: product.price,
//         originalPrice: product.originalPrice
//       };
//     }
//     // Return default values if product not found
//     return {
//       name: `Product #${productId}`,
//       image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
//       category: 'Unknown Category',
//       price: 0,
//       originalPrice: null
//     };
//   };

//   // Fetch all reviews from Supabase and match with products from JSON
//   const fetchAllReviews = async () => {
//     try {
//       setLoading(true);
      
//       // Fetch reviews from Supabase
//       const { data, error } = await supabase
//         .from('product_reviews')
//         .select('*')
//         .order('created_at', { ascending: false });

//       if (error) {
//         throw error;
//       }

//       // Format the data and match with products from JSON
//       const formattedReviews = data.map(review => {
//         const productDetails = getProductDetails(review.product_id);
        
//         return {
//           id: review.id,
//           productId: review.product_id,
//           userName: review.user_name,
//           userEmail: review.user_email,
//           rating: review.rating,
//           review: review.review_text,
//           date: review.created_at,
//           verified: review.verified_purchase,
//           productName: productDetails.name,
//           productImage: productDetails.image,
//           productCategory: productDetails.category,
//           productPrice: productDetails.price,
//           productOriginalPrice: productDetails.originalPrice
//         };
//       });

//       setReviews(formattedReviews);
//     } catch (error) {
//       console.error('Error fetching reviews from Supabase:', error);
//       setReviews([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllReviews();
//   }, []);

//   // Filter reviews by rating
//   const filteredReviews = reviews.filter(review => {
//     if (filterRating === 'all') return true;
//     return review.rating === parseInt(filterRating);
//   });

//   // Sort reviews
//   const sortedReviews = [...filteredReviews].sort((a, b) => {
//     switch (sortBy) {
//       case 'newest':
//         return new Date(b.date) - new Date(a.date);
//       case 'oldest':
//         return new Date(a.date) - new Date(b.date);
//       case 'highest':
//         return b.rating - a.rating;
//       case 'lowest':
//         return a.rating - b.rating;
//       default:
//         return 0;
//     }
//   });

//   // Calculate statistics
//   const totalReviews = reviews.length;
//   const averageRating = reviews.length > 0 
//     ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
//     : 0;

//   const ratingDistribution = {
//     5: reviews.filter(r => r.rating === 5).length,
//     4: reviews.filter(r => r.rating === 4).length,
//     3: reviews.filter(r => r.rating === 3).length,
//     2: reviews.filter(r => r.rating === 2).length,
//     1: reviews.filter(r => r.rating === 1).length
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }


//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header Section */}
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-8"
//         >
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">Customer Reviews</h1>
//           <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
//             <div className="flex items-center bg-white rounded-lg shadow-sm p-4">
//               <div className="text-5xl font-bold text-amber-500 mr-4">{averageRating}</div>
//               <div>
//                 <div className="flex mb-1">
//                   {[1, 2, 3, 4, 5].map(star => (
//                     <svg
//                       key={star}
//                       className={`w-5 h-5 ${star <= Math.floor(averageRating) ? 'text-amber-400' : 'text-gray-300'}`}
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                     </svg>
//                   ))}
//                 </div>
//                 <p className="text-gray-600">Based on {totalReviews} reviews</p>
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* Filters and Sorting */}
//         <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
//           <div className="flex flex-wrap gap-4">
//             <select 
//               value={filterRating}
//               onChange={(e) => setFilterRating(e.target.value)}
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="all">All Ratings</option>
//               <option value="5">5 Stars</option>
//               <option value="4">4 Stars</option>
//               <option value="3">3 Stars</option>
//               <option value="2">2 Stars</option>
//               <option value="1">1 Star</option>
//             </select>

//             <select 
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="newest">Newest First</option>
//               <option value="oldest">Oldest First</option>
//               <option value="highest">Highest Rated</option>
//               <option value="lowest">Lowest Rated</option>
//             </select>
//           </div>

//           <div className="text-sm text-gray-600">
//             Showing {sortedReviews.length} of {totalReviews} reviews
//           </div>
//         </div>

//         {/* Rating Distribution */}
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
//           <h3 className="text-lg font-semibold mb-4">Rating Distribution</h3>
//           <div className="space-y-2">
//             {[5, 4, 3, 2, 1].map(rating => (
//               <div key={rating} className="flex items-center">
//                 <span className="w-16 text-sm text-gray-600">{rating} stars</span>
//                 <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
//                   <div 
//                     className="bg-amber-400 h-2 rounded-full" 
//                     style={{ 
//                       width: `${totalReviews > 0 ? (ratingDistribution[rating] / totalReviews) * 100 : 0}%` 
//                     }}
//                   ></div>
//                 </div>
//                 <span className="w-12 text-sm text-gray-600">
//                   ({ratingDistribution[rating]})
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Reviews List */}
//         {sortedReviews.length > 0 ? (
//           <motion.div 
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="grid gap-6"
//           >
//             {sortedReviews.map((review, index) => (
//               <motion.div
//                 key={review.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1 }}
//                 className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
//               >
//                 <div className="flex flex-col lg:flex-row gap-6">
//                   {/* Product Info */}
//                   <div className="lg:w-1/4">
//                     <div className="flex items-center space-x-3 mb-3">
//                       <img 
//                         src={review.productImage} 
//                         alt={review.productName}
//                         className="w-16 h-16 object-cover rounded-lg"
//                         onError={(e) => {
//                           e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80';
//                         }}
//                       />
//                       <div>
//                         <h4 className="font-semibold text-gray-900 text-sm">
//                           {review.productName}
//                         </h4>
//                         <p className="text-sm text-gray-600">{review.productCategory}</p>
//                         <div className="flex items-center space-x-2">
//                           <span className="text-sm font-bold text-blue-600">${review.productPrice}</span>
//                           {review.productOriginalPrice && review.productOriginalPrice > review.productPrice && (
//                             <span className="text-xs text-gray-500 line-through">${review.productOriginalPrice}</span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Review Content */}
//                   <div className="lg:w-3/4">
//                     <div className="flex items-center justify-between mb-3">
//                       <div className="flex items-center space-x-3">
//                         <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
//                           <span className="text-white font-semibold text-sm">
//                             {review.userName?.charAt(0).toUpperCase() || 'U'}
//                           </span>
//                         </div>
//                         <div>
//                           <h4 className="font-semibold text-gray-900">
//                             {review.userName || 'Anonymous User'}
//                           </h4>
//                           <p className="text-sm text-gray-500">
//                             {new Date(review.date).toLocaleDateString('en-US', {
//                               year: 'numeric',
//                               month: 'long',
//                               day: 'numeric'
//                             })}
//                           </p>
//                         </div>
//                       </div>
                      
//                       <div className="flex items-center space-x-2">
//                         <div className="flex">
//                           {[1, 2, 3, 4, 5].map((star) => (
//                             <svg 
//                               key={star} 
//                               className={`h-5 w-5 ${star <= review.rating ? 'text-amber-400' : 'text-gray-300'}`} 
//                               fill="currentColor"
//                               viewBox="0 0 20 20"
//                             >
//                               <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                             </svg>
//                           ))}
//                         </div>
//                         <span className="text-sm font-medium text-gray-700 bg-amber-50 px-2 py-1 rounded">
//                           {review.rating}.0
//                         </span>
//                       </div>
//                     </div>

//                     <div className="mb-4">
//                       <p className="text-gray-700 leading-relaxed">{review.review}</p>
//                     </div>

//                     {review.verified && (
//                       <span className="inline-flex items-center space-x-1 text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
//                         <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
//                           <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                         </svg>
//                         <span>Verified Purchase</span>
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </motion.div>
//         ) : (
//           <div className="text-center py-12 bg-white rounded-lg shadow-sm">
//             <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//             </svg>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">
//               {reviews.length === 0 ? 'No Reviews Yet' : 'No Reviews Match Your Filters'}
//             </h3>
//             <p className="text-gray-600">
//               {reviews.length === 0 
//                 ? 'Be the first to share your thoughts about our products!' 
//                 : 'Try changing your filter settings to see more reviews.'
//               }
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ShowReview;




import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { getAllReview } from '../slice';
import PageLoader from '@/components/common/PageLoader';

const ShowReview = () => {
  const dispatch = useDispatch();
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const { reviewList, reviewLoadingList } = useSelector(state => state.admin);

  useEffect(() => {
    dispatch(getAllReview());
  }, [dispatch]);

  // Format reviews from Redux state
  const formatReviews = () => {
    // Check if reviewList exists and has the nested data structure
    if (!reviewList || !reviewList.data || !reviewList.data.success) {
      return [];
    }

    // Extract reviews array from the nested structure
    const reviewsData = reviewList.data.data || [];
    
    if (!Array.isArray(reviewsData)) {
      console.error('reviewsData is not an array:', reviewsData);
      return [];
    }

    // Map the reviews to the format expected by the component
    return reviewsData.map((review, index) => {

      // Extract user details - your data shows user is a string ID
      let userName = 'Anonymous User';
      let userEmail = '';
      
      if (review.user) {
        if (typeof review.user === 'object') {
          userName = review.user.name || `User ${review.user._id?.substring(0, 6)}...` || 'Anonymous User';
          userEmail = review.user.email || '';
        } else if (typeof review.user === 'string') {
          // User is just an ID string, need to fetch user details separately
          // For now, show generic user
          userName = `User ${review.user.substring(0, 6)}...`;
        }
      }

      // Extract product details - your data shows product is a string ID
      let productName = 'Unknown Product';
      let productImage = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80';
      let productCategory = 'Unknown Category';
      let productPrice = 0;
      let productOriginalPrice = null;
      
      if (review.product) {
        if (typeof review.product === 'object') {
          productName = review.product.name || `Product ${review.product._id?.substring(0, 6)}...` || 'Unknown Product';
          productImage = review.product.image || productImage;
          productCategory = review.product.category || productCategory;
          productPrice = review.product.price || 0;
          productOriginalPrice = review.product.originalPrice || null;
        } else if (typeof review.product === 'string') {
          // Product is just an ID string, need to fetch product details separately
          // For now, show generic product
          productName = `Product ${review.product.substring(0, 6)}...`;
        }
      }

      // Use product ID from review data
      const productId = review.product?._id || review.product || '';

      return {
        id: review._id || `review-${index}`,
        productId: productId,
        userName: userName,
        userEmail: userEmail,
        rating: review.rating || 0,
        review: review.comment || '',
        date: review.createdAt || new Date().toISOString(),
        verified: review.isVerified || false,
        productName: productName,
        productImage: productImage,
        productCategory: productCategory,
        productPrice: productPrice,
        productOriginalPrice: productOriginalPrice
      };
    });
  };

  // Get formatted reviews
  const reviews = formatReviews();

  // Filter reviews by rating
  const filteredReviews = reviews.filter(review => {
    if (filterRating === 'all') return true;
    return review.rating === parseInt(filterRating);
  });

  // Sort reviews
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date) - new Date(a.date);
      case 'oldest':
        return new Date(a.date) - new Date(b.date);
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  // Calculate statistics
  const totalReviews = reviews.length;
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length
  };



  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {reviewLoadingList && <PageLoader show/>}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Customer Reviews</h1>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
            <div className="flex items-center bg-white rounded-lg shadow-sm p-4">
              <div className="text-5xl font-bold text-amber-500 mr-4">{averageRating}</div>
              <div>
                <div className="flex mb-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${star <= Math.floor(averageRating) ? 'text-amber-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600">Based on {totalReviews} reviews</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters and Sorting */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex flex-wrap gap-4">
            <select 
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>

            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            Showing {sortedReviews.length} of {totalReviews} reviews
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Rating Distribution</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center">
                <span className="w-16 text-sm text-gray-600">{rating} stars</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                  <div 
                    className="bg-amber-400 h-2 rounded-full" 
                    style={{ 
                      width: `${totalReviews > 0 ? (ratingDistribution[rating] / totalReviews) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
                <span className="w-12 text-sm text-gray-600">
                  ({ratingDistribution[rating]})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        {sortedReviews.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-6"
          >
            {sortedReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Product Info */}
                  <div className="lg:w-1/4">
                    <div className="flex items-center space-x-3 mb-3">
                      <img 
                        src={review.productImage} 
                        alt={review.productName}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80';
                        }}
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {review.productName}
                        </h4>
                        <p className="text-sm text-gray-600">{review.productCategory}</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-blue-600">${review.productPrice}</span>
                          {review.productOriginalPrice && review.productOriginalPrice > review.productPrice && (
                            <span className="text-xs text-gray-500 line-through">${review.productOriginalPrice}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="lg:w-3/4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {review.userName?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {review.userName}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {new Date(review.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg 
                              key={star} 
                              className={`h-5 w-5 ${star <= review.rating ? 'text-amber-400' : 'text-gray-300'}`} 
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-700 bg-amber-50 px-2 py-1 rounded">
                          {review.rating}.0
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-700 leading-relaxed">{review.review}</p>
                    </div>

                    {review.verified && (
                      <span className="inline-flex items-center space-x-1 text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Verified Purchase</span>
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {reviews.length === 0 ? 'No Reviews Yet' : 'No Reviews Match Your Filters'}
            </h3>
            <p className="text-gray-600">
              {reviews.length === 0 
                ? 'Be the first to share your thoughts about our products!' 
                : 'Try changing your filter settings to see more reviews.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowReview;