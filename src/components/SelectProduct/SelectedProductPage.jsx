import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../AddToCart/slice/CartSlice';
import { addToWishlist, getWhishlistCount, removeFromWishlist, toggleWhishlist } from '../Wishlist/slice/WishlistSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { toast, ToastContainer } from 'react-toastify';
import { getSpecificProduct } from '../home/slice/index'; // Import submitReview if available
import { addSpecificProductReview, getSpecificProductReview } from './slice';
import { FaPlus, FaMinus } from "react-icons/fa";
import PageLoader from '../common/PageLoader';

const SelectedProductPage = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // Get product and reviews from Redux store
  const { specificProduct, specificProductLoading, specificProductReview } = useSelector(state => ({
    specificProduct: state.home.specificProduct,
    specificProductLoading: state.home.specificProductLoading,
    specificProductReview: state.specificProduct.specificProductReview,
}));
  const { products: allProducts } = useSelector(state => state.products || { products: [] });
  
  // Extract product data from API response
  const productData = specificProduct?.data || null;
  const productReviews = productData?.reviews || [];
  const product = productData;

  const averageRating =specificProduct?.data?.reviews.reduce((acc, review) => {
                          return acc + review.rating;
                      }, 0)
  
  const wishlistItems = useSelector(state => state.wishlist?.items) || [];
  const isInWishlist = product ? wishlistItems.some(item => item.id === product._id || item.id === product.id) : false;

  const validationSchema = Yup.object({
    review: Yup.string()
      .min(5, "Review must be at least 5 characters")
      .required("Product Review is Required"),
    rating: Yup.number()
      .min(1, "Please select a rating")
      .max(5, "Maximum rating is 5")
      .required("Product Rating is Required"),
    userName: Yup.string()
      .required("Name is required"),
    userEmail: Yup.string()
      .email("Invalid email address")
      .required("Email is required")
  });

  const formik = useFormik({
    initialValues: {
      review: "",
      rating: 0,
      userName: "",
      userEmail: ""
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        let payload = {
            id:id,
            rating:values.rating,
            comment:values.review,
            isVerified:"true" 
        }
        
        dispatch(addSpecificProductReview(payload)).then((res)=>{
          setLoading(true)
          if(res?.payload?.status === 201 ){
          toast.success("Review submitted successfully!");
          dispatch(getSpecificProductReview(id));
          resetForm();
          setLoading(false)
          };
          setLoading(false)
        })
      } catch (error) {
        console.error('Error submitting review:', error);
        toast.error("Failed to submit review. Please try again.");
      }
    }
  });

  // Fetch product details from API
  useEffect(() => {
    if (id) {
      dispatch(getSpecificProduct(id))
        .then(() => {
          dispatch(getSpecificProductReview(id));
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id, dispatch]);

  // Set default color/size when product loads
  useEffect(() => {
    if (productData) {
      if (productData.variants?.[0]?.color?.[0]) {
        setSelectedColor(productData.variants[0].color[0]);
      }
      if (productData.variants?.[0]?.size?.[0]) {
        setSelectedSize(productData.variants[0].size[0]);
      }
    }
  }, [productData]);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (product) {
      dispatch(addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.url || product.image,
        quantity: quantity,
        color: selectedColor,
        size: selectedSize
      }));
      toast.success("Product added to cart!");
    }
  };

  // const handleWishlist = (e) => {
  //   e.stopPropagation();
  //   if (!product) return;
    
  //   if (isInWishlist) {
  //     dispatch(removeFromWishlist(product._id));
  //     toast.warning("Removed from wishlist");
  //   } else {
  //     dispatch(addToWishlist({
  //       id: product._id,
  //       name: product.name,
  //       price: product.price,
  //       originalPrice: product.originalPrice,
  //       image: product.images?.[0]?.url || product.image,
  //       inStock: product.stock > 0,
  //     }));
  //     toast.success("Added to wishlist");
  //   }
  // };

   const handleWishlist = (ids) => {
        let payload={
                       productId:ids
                     }
                     console.log(payload)
         dispatch(toggleWhishlist(payload)).then((res)=>{
           if(res?.payload?.status === 200 || res?.payload?.status === 201){
            //  dispatch(getWhishlistCount());
             if(res?.payload?.data?.action === 'added'){
               toast.success("Whishlist Added Successfully")
               dispatch(getSpecificProduct(id));
             }else if(res?.payload?.data?.action === 'removed'){
               toast.warning("Whishlist Removed Successfully")
               dispatch(getSpecificProduct(id));
             }
           }
         })
   };
 
  // Get related products (same category, excluding current product)
  const relatedProducts = allProducts
    .filter(p => p._id !== id && p.category === product?.category)
    .slice(0, 3);

  const incrementQuantity = () => {
    if (product?.stock && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    } else {
      toast.warning("Maximum available quantity reached");
    }
  };
  
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  if (loading || specificProductLoading) {
    return (
      <PageLoader/>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
        <p className="text-gray-600 mt-2">The product you're looking for doesn't exist.</p>
      </div>
    );
  }

  // Helper function to get product images
  const productImages = product.images?.map(img => img.url) || [product.image].filter(Boolean);
  const mainImage = productImages[selectedImage] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80';

  return ( 
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Product Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
          <motion.div 
            className="h-96 md:h-[500px] rounded-lg overflow-hidden bg-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img 
              src={mainImage} 
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80';
              }}
            />
          </motion.div>
          
          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <motion.div 
                  key={index}
                  className={`h-24 rounded-md overflow-hidden cursor-pointer border-2 ${
                    selectedImage === index ? 'border-blue-500' : 'border-transparent'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedImage(index)}
                >
                  <img 
                    src={image} 
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80';
                    }}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <span className="text-sm text-gray-500 uppercase">{product.category}</span>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">{product.name}</h1>
            
            <div className="flex items-center mt-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg 
                    key={star} 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 ${star <= Math.floor(averageRating/productReviews.length || 0) ? 'text-amber-400' : 'text-gray-300'}`} 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">
                ({productReviews.length} reviews) • Average: {(averageRating/productReviews.length)?.toFixed(1) || '0.0'}/5
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-gray-900">${product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
                <span className="bg-red-100 text-red-800 text-sm font-semibold px-2 py-1 rounded">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>
          
          <p className="text-gray-700">{product.description}</p>
          
          {/* Stock Status */}
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {product.stock > 0 ? `${product.stock} items in stock` : 'Out of Stock'}
          </div>
          
          {/* Color Variants */}
          {product.variants?.[0]?.color?.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Color</h3>
              <div className="flex space-x-2">
                {product.variants[0].color.map(color => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === color ? 'border-blue-500' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color === 'white' ? '#fff' : color }}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Color: ${color}`}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Size Variants */}
          {product.variants?.[0]?.size?.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants[0].size.map(size => (
                  <button
                    key={size}
                    className={`px-4 py-2 border rounded-md ${
                      selectedSize === size 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <button 
                className="px-4 py-2 text-white disabled:bg-[#6993ad] disabled:cursor-not-allowed cursor-pointer bg-[#0289de] hover:bg-[#007ac7] rounded-md"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                <FaMinus />
              </button>
              <span className="px-4 py-2">{quantity}</span>
              <button 
                className="px-4 py-2 text-white disabled:bg-[#6993ad] disabled:cursor-not-allowed cursor-pointer bg-[#0289de] hover:bg-[#007ac7] rounded-md"
                onClick={incrementQuantity}
                disabled={product.stock && quantity >= product.stock}
              >
                <FaPlus />
              </button>
            </div>
            
            <button 
              className="flex-1  text-white py-3 px-6 rounded-md bg-[#0289de] hover:bg-[#007ac7] transition-colors font-medium cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={handleAddToCart}
              disabled={!product.stock || product.stock === 0}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
            
            <button 
              className="p-3 rounded-md bg-[#0289de] hover:bg-[#007ac7] cursor-pointer"
              onClick={()=>handleWishlist(product._id)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" 
                className={product?.isWishlist ? "h-6 w-6 text-red-500 hover:text-red-700 cursor-pointer" : "h-6 w-6 text-white hover:text-red-700 cursor-pointer"} 
                fill={product?.isWishlist ? "red" : "none"} 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
          
          {/* Product Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Specifications</h3>
              <div className="space-y-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600">{key}:</span>
                    <span className="text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className='review-section mb-16'>
        <h1 className='text-2xl font-bold mb-6'>Customer Reviews ({productReviews.length})</h1>
        
        {/* Review Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Write a Review</h2>
          <form onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  name="userName"
                  value={formik.values.userName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none ${
                    formik.touched.userName && formik.errors.userName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formik.touched.userName && formik.errors.userName && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.userName}</div>
                )}
              </div>
              
              <div>
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  name="userEmail"
                  value={formik.values.userEmail}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none ${
                    formik.touched.userEmail && formik.errors.userEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formik.touched.userEmail && formik.errors.userEmail && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.userEmail}</div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center mb-2">
                <Rating
                  style={{ maxWidth: 150 }}
                  value={formik.values.rating}
                  onChange={(value) => formik.setFieldValue('rating', value)}
                  onBlur={() => formik.setFieldTouched('rating', true)}
                  halfFillMode="svg"
                />
                <span className="ml-3 text-gray-600 bg-amber-100 px-2 py-1 rounded-md">
                  {formik.values.rating.toFixed(1)}/5.0
                </span>
              </div>
              {formik.touched.rating && formik.errors.rating && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.rating}</div>
              )}
            </div>

            <div className="mb-4">
              <textarea 
                placeholder="Write your review here (minimum 5 characters)..." 
                name="review"
                value={formik.values.review}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows="4"
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none ${
                  formik.touched.review && formik.errors.review ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formik.touched.review && formik.errors.review && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.review}</div>
              )}
            </div>

            <button 
              type="submit" 
              className=" text-white px-6 py-2 rounded-lg bg-[#0289de] hover:bg-[#007ac7] transition-colors cursor-pointer"
            >
              Submit Review
            </button>
          </form>
        </div>

        {/* Reviews List */}
        <div>
          {specificProductReview?.data?.data?.length > 0 ? (
            <div className="space-y-4">
              {specificProductReview?.data?.data?.map((review) => (
                <div key={review._id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {review?.user?.username?.charAt(0).toUpperCase() || 
                           'U'}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          { review?.user?.username || 'Anonymous'}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {new Date(review.createdAt || review.created_at).toLocaleDateString('en-US', {
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
                            className={`h-5 w-5 ${star <= (review.rating || 0) ? 'text-amber-400' : 'text-gray-300'}`}
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
                  
                  <p className="text-gray-700 leading-relaxed">{review.comment || review.review_text}</p>
                  
                  {review.isVerified && (
                    <span className="inline-flex items-center space-x-1 text-sm text-green-600 bg-green-50 px-2 py-1 rounded mt-2">
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Verified Purchase</span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedProducts.map(relatedProduct => (
              <motion.div 
                key={relatedProduct._id}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl cursor-pointer"
                whileHover={{ y: -5 }}
                onClick={() => window.location.href = `/product/${relatedProduct._id}`}
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={relatedProduct.images?.[0]?.url || relatedProduct.image} 
                    alt={relatedProduct.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80';
                    }}
                  />
                </div>
                <div className="p-4">
                  <span className="text-xs text-gray-500 uppercase">{relatedProduct.category}</span>
                  <h3 className="text-lg font-semibold text-gray-800 mt-1 truncate">{relatedProduct.name}</h3>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-gray-900">${relatedProduct.price}</span>
                    <span className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      View Details
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectedProductPage;