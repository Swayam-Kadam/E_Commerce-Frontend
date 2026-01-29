import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import productsData from '../Products.json';
import { useDispatch,useSelector } from 'react-redux';
import { addToCart } from '../AddToCart/slice/CartSlice';
import { addToWishlist,removeFromWishlist } from '../Wishlist/slice/WishlistSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { toast,ToastContainer } from 'react-toastify';
import reviews from './review.json'

const SelectedProductPage = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch()

  const wishlistItems = useSelector(state => state.wishlist?.items) || []
  const isInWishlist = product ? wishlistItems.some(item => item.id === product.id) : false

  const validationSchema = Yup.object({
    review:Yup.string()
    .min(5,"review must be atleast 5 character")
    .required("Product Review is Require"),
    rating:Yup.number()
    .required("Product Rating is Required")
  })

  const formik = useFormik({
    initialValues:{
      review:"",
      rating:0
    },
    validationSchema,
    onSubmit:(values)=>{
      toast.success("Form Submited")
    }
  })
    

  // Find product based on ID from URL
  useEffect(() => {
    const foundProduct = productsData.products.find(p => p.id === parseInt(id));
    if (foundProduct) {
      setProduct(foundProduct);
      // Set default color and size if available
      if (foundProduct.colors && foundProduct.colors.length > 0) {
        setSelectedColor(foundProduct.colors[0]);
      }
      if (foundProduct.sizes && foundProduct.sizes.length > 0) {
        setSelectedSize(foundProduct.sizes[0]);
      }
    }
    setLoading(false);
  }, [id]);

   const handleAddToCart = (e) => {
      e.stopPropagation();
      dispatch(addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      }));
    };

      const handleWishlist = (e) => {
        
        e.stopPropagation();
        if (isInWishlist) {
          dispatch(removeFromWishlist(product.id));
        } else {
          dispatch(addToWishlist({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            inStock: product.inStock,
          }));
        }
      };

  const relatedProducts = [
    {
      id: 2,
      name: "Premium Cotton Shirt",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      category: "Fashion"
    },
    {
      id: 3,
      name: "Slim Fit Jeans",
      price: 59.99,
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      category: "Fashion"
    },
    {
      id: 4,
      name: "Casual Jacket",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      category: "Fashion"
    }
  ];

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover />
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
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          <div className="grid grid-cols-4 gap-2">
            {[product.image, ...(product.images || [])].map((image, index) => (
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
                />
              </motion.div>
            ))}
          </div>
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
                    className={`h-5 w-5 ${star <= Math.floor(product.rating) ? 'text-amber-400' : 'text-gray-300'}`} 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">
                ({product.reviewCount} reviews)
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
            )}
            {product.originalPrice && (
              <span className="bg-red-100 text-red-800 text-sm font-semibold px-2 py-1 rounded">
                {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
              </span>
            )}
          </div>
          
          <p className="text-gray-700">{product.description}</p>
          
          {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Color</h3>
              <div className="flex space-x-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === color ? 'border-blue-500' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Color: ${color}`}
                  />
                ))}
              </div>
            </div>
          )}
          
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
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
            <div className="flex items-center border rounded-md">
              <button 
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                onClick={decrementQuantity}
              >
                -
              </button>
              <span className="px-4 py-2 border-l border-r">{quantity}</span>
              <button 
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                onClick={incrementQuantity}
              >
                +
              </button>
            </div>
            
            <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium cursor-pointer"
            onClick={handleAddToCart}>
              Add to Cart
            </button>
            
            <button className="p-3 border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={handleWishlist}>
              <svg xmlns="http://www.w3.org/2000/svg" className={isInWishlist?"h-6 w-6 text-red-500 hover:text-red-700 cursor-pointer":"h-6 w-6 text-gray-500 hover:text-red-700 cursor-pointer"} fill={isInWishlist ? "red" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
          
          {product.details && product.details.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Product Details</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {product.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className='review'>
        <h1 className='text-2xl font-bold mb-3'>Review</h1>
        <form onSubmit={formik.handleSubmit}>
                <div className='flex gap-4 mb-5'>
                    <input type='text' placeholder="Enter Review Here" 
                    name="review" 
                    value={formik.values.review} 
                    onChange={formik.handleChange} 
                    onBlur={formik.handleBlur}
                    className={`w-full border border-rounded rounded border-[#0289de] focus:outline-2 focus:outline-offset-2 ${formik.touched.review && formik.errors.review ? 'focus:outline-red-500':'focus:outline-blue-500'}`}
                    />
          
                    <button  type="submit" className='border rounded cursor-pointer p-2 border-blue-700 bg-green-700 hover:bg-green-800 text-white'>Submit</button>
                </div>
                {formik.touched.review && formik.errors.review && (
                      <div className="text-red-500 text-sm mt-[-1rem] mb-3">{formik.errors.review}</div>
                )}
                {/* rating  */}
                <div className='mb-3'>
                  <div className="flex items-center">
                      <Rating
                      style={{ maxWidth: 150 }}
                      value={formik.values.rating}
                      onBlur={formik.handleBlur}
                      onChange={(value) => {
                        formik.setFieldValue('rating', value)
                      }}
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
      </form>

                  {/* list all reviews  */}
      {
        reviews.review.slice(0,5).map((review, index) => (
          <div key={index} className="border-l-4 border-blue-500 pl-4 py-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-xs">
                    {review.userName ? review.userName.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <span className="font-medium text-gray-900 text-sm">
                  {review.userName || 'Anonymous'}
                </span>
              </div>
              
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg 
                    key={star} 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 ${star <= review.rating ? 'text-amber-400' : 'text-gray-300'}`} 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            
            <p className="text-gray-700 text-sm mb-2">{review.review}</p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
                {review.date ? new Date(review.date).toLocaleDateString() : 'Recently'}
              </span>
              {review.verified && (
                <span className="text-green-600">✓ Verified Purchase</span>
              )}
            </div>
          </div>
        ))
      }

      </div>
      
      {/* Related Products */}
      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">You may also like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {relatedProducts.map(relatedProduct => (
            <motion.div 
              key={relatedProduct.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl"
              whileHover={{ y: -5 }}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={relatedProduct.image} 
                  alt={relatedProduct.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <span className="text-xs text-gray-500 uppercase">{relatedProduct.category}</span>
                <h3 className="text-lg font-semibold text-gray-800 mt-1">{relatedProduct.name}</h3>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-bold text-gray-900">${relatedProduct.price}</span>
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectedProductPage;