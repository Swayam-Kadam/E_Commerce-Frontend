import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { ToastContainer, toast } from 'react-toastify';

const AddProduct = () => {
  // Validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be less than 100 characters')
      .required('Product name is required'),
    category: Yup.string()
      .required('Category is required'),
    price: Yup.number()
      .min(0, 'Price cannot be negative')
      .required('Price is required'),
    originalPrice: Yup.number()
      .min(0, 'Original price cannot be negative')
      .test('is-greater', 'Original price must be greater than or equal to price', function(value) {
        const { price } = this.parent;
        return value >= price;
      }),
    rating: Yup.number()
      .min(0, 'Rating cannot be negative')
      .max(5, 'Rating cannot exceed 5')
      .required('Rating is required'),
    image: Yup.mixed()
      .required('Product image is required'),
    isNew: Yup.boolean(),
    isBestSeller: Yup.boolean(),
    inStock: Yup.boolean(),
    colors: Yup.array()
      .of(Yup.string())
      .min(1, 'At least one color is required'),
    details: Yup.string()
      .min(10, 'Details must be at least 10 characters')
      .required('Product details are required')
  });

  // Formik hook
  const formik = useFormik({
    initialValues: {
      name: "",
      category: "",
      price: 0,
      originalPrice: 0,
      rating: 0,
      image: null,
      isNew: true,
      isBestSeller: false,
      colors: [],
      details: "",
      inStock: true
    },
    validationSchema,
    onSubmit: (values) => {
      // Handle form submission here (API call, etc.)
      toast.success('Product added successfully!');
    },
  });

  // State for image preview
  const [imagePreview, setImagePreview] = useState(null);

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      formik.setFieldValue('image', file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };


  // Color options
  const colorOptions = [
    { name: 'Blue', value: 'blue', bgColor: 'bg-blue-600' },
    { name: 'Black', value: 'black', bgColor: 'bg-black' },
    { name: 'Gray', value: 'gray', bgColor: 'bg-gray-500' },
    { name: 'Red', value: 'red', bgColor: 'bg-red-600' },
    { name: 'Green', value: 'green', bgColor: 'bg-green-600' },
    { name: 'White', value: 'white', bgColor: 'bg-white border border-gray-300' },
    { name: 'Purple', value: 'purple', bgColor: 'bg-purple-600' },
    { name: 'Yellow', value: 'yellow', bgColor: 'bg-yellow-400' },
  ];

  // Handle color selection
  const handleColorSelect = (colorValue) => {
    const currentColors = [...formik.values.colors];
    const colorIndex = currentColors.indexOf(colorValue);
    
    if (colorIndex === -1) {
      // Add color
      currentColors.push(colorValue);
    } else {
      // Remove color
      currentColors.splice(colorIndex, 1);
    }
    
    formik.setFieldValue('colors', currentColors);
  };



  return (
    <div className="min-h-screen bg-gradient-to-br  py-8 px-4 sm:px-6 lg:px-8">
        <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover />
      <div className="max-w-8xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-[#0289de] py-4 px-6">
          <h1 className="text-2xl font-bold text-white">Add New Product</h1>
          <p className="text-amber-100">Fill in the details below to add a new product</p>
        </div>
        
        <form onSubmit={formik.handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Product Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2  focus:border-blue-500 transition ${formik.touched.name && formik.errors.name ? "border-red-700 focus:ring-red-500":"border-black focus:ring-blue-500"}`}
                  placeholder="Enter Product Name"
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
                )}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.category}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2  focus:border-blue-500 transition ${formik.touched.category && formik.errors.category ? "border-red-700 focus:ring-red-500":"border-black focus:ring-blue-500"}`}
                >
                  <option value="">Select a category</option>
                  <option value="clothing">Clothing</option>
                  <option value="electronics">Electronics</option>
                  <option value="home">Home & Garden</option>
                  <option value="sports">Sports</option>
                  <option value="books">Books</option>
                </select>
                {formik.touched.category && formik.errors.category && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.category}</div>
                )}
              </div>

              {/* Price and Original Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.price}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-blue-500 transition ${formik.touched.price && formik.errors.price ? "border-red-700 focus:ring-red-500":"border-black focus:ring-blue-500"}`}
                    placeholder="0.00"
                    step="0.01"
                  />
                  {formik.touched.price && formik.errors.price && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.price}</div>
                  )}
                </div>

                <div>
                  <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-1">
                    Original Price ($)
                  </label>
                  <input
                    type="number"
                    id="originalPrice"
                    name="originalPrice"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.originalPrice}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2  focus:border-blue-500 transition ${formik.touched.originalPrice && formik.errors.originalPrice ? "border-red-700 focus:ring-red-500":"border-black focus:ring-blue-500"}`}
                    placeholder="0.00"
                    step="0.01"
                    
                  />
                  {formik.touched.originalPrice && formik.errors.originalPrice && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.originalPrice}</div>
                  )}
                </div>
              </div>


            {/* Rating */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating *
            </label>
            <div className="flex items-center">
                <Rating
                style={{ maxWidth: 150 }}
                value={formik.values.rating}
                onChange={(value) => formik.setFieldValue('rating', value)}
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
                

              {/* Colors Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Colors *
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <div
                      key={color.value}
                      onClick={() => handleColorSelect(color.value)}
                      className={`cursor-pointer rounded-full p-1 border-2 ${formik.values.colors.includes(color.value) ? 'border-blue-500' : 'border-gray-300'}   ${formik.touched.colors && formik.errors.colors ? "border-red-700 focus:ring-red-500":" focus:ring-blue-500"}`}
                    >
                      <div className={`w-8 h-8 rounded-full ${color.bgColor}`} title={color.name}></div>
                    </div>
                  ))}
                </div>
                {formik.touched.colors && formik.errors.colors && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.colors}</div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image *
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 5MB)</p>
                      </div>
                    )}
                    <input 
                      id="image" 
                      name="image" 
                      type="file" 
                      className="hidden" 
                      onChange={handleImageUpload} 
                      accept="image/*" 
                      
                    />
                  </label>
                </div>
                {formik.touched.image && formik.errors.image && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.image}</div>
                )}
              </div>

              {/* Product Details */}
              <div>
                <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Details *
                </label>
                <textarea
                  id="details"
                  name="details"
                  rows="4"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.details}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${formik.touched.details && formik.errors.details ? "border-red-700 focus:ring-red-500":"border-black focus:ring-blue-500"}`}
                  placeholder="Enter product details (features, description, etc.)"
                ></textarea>
                {formik.touched.details && formik.errors.details && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.details}</div>
                )}
              </div>

              {/* Checkboxes */}
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isNew"
                    name="isNew"
                    onChange={formik.handleChange}
                    checked={formik.values.isNew}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isNew" className="ml-3 block text-sm text-gray-900 font-medium">
                    Mark as New Product
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isBestSeller"
                    name="isBestSeller"
                    onChange={formik.handleChange}
                    checked={formik.values.isBestSeller}
                    className="h-5 w-5 text-amber-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isBestSeller" className="ml-3 block text-sm text-gray-900 font-medium">
                    Mark as Best Seller
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="inStock"
                    name="inStock"
                    onChange={formik.handleChange}
                    checked={formik.values.inStock}
                    className="h-5 w-5 text-amber-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="inStock" className="ml-3 block text-sm text-gray-900 font-medium">
                    Product is in Stock
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="w-full bg-[#0289de] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#007ac7] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition cursor-pointer"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;