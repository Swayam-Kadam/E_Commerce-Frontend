// components/common/EditProductModal.jsx
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSave, FiUpload, FiPlus, FiTrash2, FiImage } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { EditProduct, getProduct, getSpecificProduct } from '../slice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';

// Color options for selection
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

const EditProductModal = ({ 
  product, 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const dispatch = useDispatch();
  const [imagePreview, setImagePreview] = useState('');
  const [existingImages, setExistingImages] = useState([]);

  // Validation schema using Yup (similar to AddProduct)
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
    isBestSeller: Yup.boolean(),
    inStock: Yup.boolean(),
    colors: Yup.array()
      .of(Yup.string())
      .min(1, 'At least one color is required'),
    description: Yup.string()
      .min(10, 'Description must be at least 10 characters')
      .required('Product description is required'),
    stock: Yup.number()
      .min(0, 'Stock cannot be negative')
      .required('Stock is required'),
    image: Yup.mixed()
      .nullable(), // Make image optional for edit
    sizes: Yup.array()
  .of(Yup.string())
  .min(1, 'At least one size is required'), // Add this line if sizes should be required
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
      isBestSeller: false,
      colors: [],
      description: "",
      inStock: true,
      stock: 0,
      specifications: {},
      sizes: []
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
  setSubmitting(true);
  try {
    
    // Create FormData for the update
    const formData = new FormData();
    
    // Append all form fields
    const fieldsToAppend = {
      name: values.name,
      category: values.category,
      price: values.price,
      originalPrice: values.originalPrice,
      averageRating: values.rating,
      description: values.description,
      stock: values.stock,
      isBestSeller: values.isBestSeller,
      inStock: values.inStock,
      id: product?._id // Make sure product is defined
    };
    
    // Debug: Check each value
    
    // Append each field
    Object.entries(fieldsToAppend).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
    
    // Handle colors and sizes in variants
    const variants = {
      color: values.colors,
      size: values.sizes
    };
    formData.append('variants', JSON.stringify(variants));
    
    // Handle specifications
    if (Object.keys(values.specifications).length > 0) {
      formData.append('specifications', JSON.stringify(values.specifications));
    }
    
    // Handle new image upload
    if (values.image instanceof File) {
      formData.append('images', values.image);
    }
    
    // Handle existing images (send their IDs)
    existingImages.forEach((img, index) => {
      if (img._id) {
        formData.append(`existingImages[${index}]`, img._id);
      }
    });
    
    
    // Check if product ID exists
    if (!product?._id) {
      toast.error("Product ID is missing");
      setSubmitting(false);
      return;
    }
    
    // Add the ID to FormData (required for your EditProduct thunk)
    formData.append('id', product._id);
    
    // Call the dispatch
    dispatch(EditProduct(formData)).then((res) => {
      if (res.payload?.success === true) {
        toast.success("Product updated successfully!");
        dispatch(getProduct())
        onClose(); // Close modal after successful update
      } else {
        toast.error("Failed to update product");
      }
    }).catch((error) => {
      console.error("Dispatch error:", error);
      toast.error("Error updating product");
    });
    
  } catch (error) {
    console.error('Error in onSubmit:', error);
    toast.error('Failed to update product. Please try again.');
  } finally {
    setSubmitting(false);
  }
},
  });

  useEffect(() => {
    if (product && isOpen) {
      dispatch(getSpecificProduct(product?._id)).then((res) => {
        if (res.payload?.status === 200 || res.payload?.status === 201) {
          const specificPro = res?.payload?.data?.data;
          
          // Extract colors from variants
          const colors = specificPro.variants?.[0]?.colors || [];
          
          // Set initial values for Formik
          formik.setValues({
            name: specificPro.name || '',
            category: specificPro.category || '',
            price: specificPro.price || 0,
            originalPrice: specificPro.originalPrice || 0,
            rating: specificPro.averageRating || 0,
            image: null, // Keep null for new image upload
            isBestSeller: specificPro.isBestSeller || false,
            colors: specificPro.variants[0]?.color || '',
            description: specificPro.description || '',
            inStock: (specificPro.stock || 0) > 0,
            stock: specificPro.stock || 0,
            specifications: specificPro.specifications || {},
            sizes: specificPro.variants?.[0]?.size || []
          });
          
          // Set existing images and preview
          if (specificPro.images?.length > 0) {
            setExistingImages(specificPro.images);
            setImagePreview(specificPro.images[0]?.url || '');
          }
        }
      });
    }
  }, [product, isOpen, dispatch]);

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

  // Handle size addition/removal
  const handleAddSize = () => {
    const sizeInput = document.getElementById('newSize');
    const newSize = sizeInput?.value?.trim();
    
    if (newSize && !formik.values.sizes.includes(newSize)) {
      formik.setFieldValue('sizes', [...formik.values.sizes, newSize]);
      sizeInput.value = '';
    }
  };

  const handleRemoveSize = (sizeToRemove) => {
    formik.setFieldValue('sizes', 
      formik.values.sizes.filter(size => size !== sizeToRemove)
    );
  };

  // Handle specification addition/removal
  const handleAddSpecification = () => {
    const specKey = document.getElementById('newSpecKey')?.value?.trim();
    const specValue = document.getElementById('newSpecValue')?.value?.trim();
    
    if (specKey && specValue) {
      const newSpecs = { ...formik.values.specifications, [specKey]: specValue };
      formik.setFieldValue('specifications', newSpecs);
      document.getElementById('newSpecKey').value = '';
      document.getElementById('newSpecValue').value = '';
    }
  };

  const handleRemoveSpecification = (keyToRemove) => {
    const newSpecs = { ...formik.values.specifications };
    delete newSpecs[keyToRemove];
    formik.setFieldValue('specifications', newSpecs);
  };

  // Handle existing image removal
  const handleRemoveExistingImage = (index) => {
    const newImages = [...existingImages];
    newImages.splice(index, 1);
    setExistingImages(newImages);
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      y: -50
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div 
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FiImage className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
                    <p className="text-gray-600">Update product information</p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 transition-colors rounded-full p-2 hover:bg-white"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiX size={24} />
                </motion.button>
              </div>

              {/* Form */}
              <div className="max-h-[calc(95vh-140px)] overflow-y-auto">
                <form onSubmit={formik.handleSubmit} className="p-6 space-y-6">
                  {/* Basic Information */}
                  <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={itemVariants}>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                          formik.touched.name && formik.errors.name 
                            ? "border-red-500 focus:ring-red-500" 
                            : "border-gray-300 focus:ring-blue-500"
                        }`}
                        required
                      />
                      {formik.touched.name && formik.errors.name && (
                        <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formik.values.category}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                          formik.touched.category && formik.errors.category 
                            ? "border-red-500 focus:ring-red-500" 
                            : "border-gray-300 focus:ring-blue-500"
                        }`}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="electronics">Electronics</option>
                        <option value="fashion">Fashion</option>
                        <option value="footwear">Footwear</option>
                        <option value="groceries">Groceries</option>
                        <option value="bags">Bags</option>
                        <option value="beauty">Beauty</option>
                      </select>
                      {formik.touched.category && formik.errors.category && (
                        <div className="text-red-500 text-sm mt-1">{formik.errors.category}</div>
                      )}
                    </div>
                  </motion.div>

                  {/* Description */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      rows="3"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        formik.touched.description && formik.errors.description 
                          ? "border-red-500 focus:ring-red-500" 
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                      required
                    />
                    {formik.touched.description && formik.errors.description && (
                      <div className="text-red-500 text-sm mt-1">{formik.errors.description}</div>
                    )}
                  </motion.div>

                  {/* Pricing */}
                  <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={itemVariants}>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Current Price ($) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        name="price"
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                          formik.touched.price && formik.errors.price 
                            ? "border-red-500 focus:ring-red-500" 
                            : "border-gray-300 focus:ring-blue-500"
                        }`}
                        required
                      />
                      {formik.touched.price && formik.errors.price && (
                        <div className="text-red-500 text-sm mt-1">{formik.errors.price}</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Original Price ($) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        name="originalPrice"
                        value={formik.values.originalPrice}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                          formik.touched.originalPrice && formik.errors.originalPrice 
                            ? "border-red-500 focus:ring-red-500" 
                            : "border-gray-300 focus:ring-blue-500"
                        }`}
                        required
                      />
                      {formik.touched.originalPrice && formik.errors.originalPrice && (
                        <div className="text-red-500 text-sm mt-1">{formik.errors.originalPrice}</div>
                      )}
                    </div>
                  </motion.div>

                  {/* Stock */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formik.values.stock}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        formik.touched.stock && formik.errors.stock 
                          ? "border-red-500 focus:ring-red-500" 
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                      required
                      min="0"
                    />
                    {formik.touched.stock && formik.errors.stock && (
                      <div className="text-red-500 text-sm mt-1">{formik.errors.stock}</div>
                    )}
                  </motion.div>

                  {/* Rating */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                  </motion.div>

                  {/* Image Upload */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Product Image
                    </label>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <label className={`flex items-center justify-center px-4 py-3 border-2 border-dashed rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 cursor-pointer ${
                            formik.touched.image && formik.errors.image 
                              ? "border-red-500" 
                              : "border-gray-300"
                          }`}>
                            <FiUpload className="text-gray-500 mr-2" />
                            <span className="text-gray-700">Upload New Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </label>
                          {imagePreview && (
                            <div className="w-20 h-20 rounded-lg border overflow-hidden relative">
                              <img 
                                src={imagePreview} 
                                alt="Preview" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                        {formik.touched.image && formik.errors.image && (
                          <div className="text-red-500 text-sm mt-1">{formik.errors.image}</div>
                        )}
                        <p className="text-sm text-gray-500 mt-2">
                          Upload a new image or keep existing ones
                        </p>
                      </div>
                    </div>
                    
                    {/* Existing Images */}
                    {existingImages.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Existing Images:</p>
                        <div className="flex flex-wrap gap-2">
                          {existingImages.map((img, index) => (
                            <div key={index} className="relative">
                              <div className="w-16 h-16 rounded-lg border overflow-hidden">
                                <img 
                                  src={img.url} 
                                  alt={`Product ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveExistingImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                <FiTrash2 size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>

                  {/* Colors */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Available Colors *
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {colorOptions.map((color) => (
                        <div
                          key={color.value}
                          onClick={() => handleColorSelect(color.value)}
                          className={`cursor-pointer rounded-full p-1 border-2 ${
                            formik.values.colors.includes(color.value) 
                              ? 'border-blue-500' 
                              : 'border-gray-300'
                          } ${
                            formik.touched.colors && formik.errors.colors 
                              ? "border-red-700" 
                              : ""
                          }`}
                        >
                          <div 
                            className={`w-8 h-8 rounded-full ${color.bgColor}`} 
                            title={color.name}
                          />
                        </div>
                      ))}
                    </div>
                    {formik.touched.colors && formik.errors.colors && (
                      <div className="text-red-500 text-sm mt-1">{formik.errors.colors}</div>
                    )}
                  </motion.div>

                  {/* Sizes */}
                  {/* <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Sizes
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        id="newSize"
                        placeholder="Enter size (e.g., S, M, L, XL)"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <motion.button
                        type="button"
                        onClick={handleAddSize}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2 shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiPlus size={18} />
                        Add Size
                      </motion.button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {formik.values.sizes.map((size, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          layout
                        >
                          <span className="text-sm font-medium">{size}</span>
                          <motion.button
                            type="button"
                            onClick={() => handleRemoveSize(size)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.8 }}
                          >
                            <FiTrash2 size={14} />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div> */}

                  {/* Sizes */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Sizes *
                    </label>
                    <select
                      multiple
                      name="sizes"
                      value={formik.values.sizes}
                      onChange={(e) => {
                        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                        formik.setFieldValue('sizes', selectedOptions);
                      }}
                      onBlur={formik.handleBlur}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all h-32 ${
                        formik.touched.sizes && formik.errors.sizes 
                          ? "border-red-500 focus:ring-red-500" 
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                      required
                    >
                      <option value="">Select Sizes (Hold Ctrl/Cmd to select multiple)</option>
                      <option value="XS">XS (Extra Small)</option>
                      <option value="S">S (Small)</option>
                      <option value="M">M (Medium)</option>
                      <option value="L">L (Large)</option>
                      <option value="XL">XL (Extra Large)</option>
                      <option value="XXL">XXL (Double Extra Large)</option>
                      <option value="XXXL">XXXL (Triple Extra Large)</option>
                      <option value="28">28</option>
                      <option value="30">30</option>
                      <option value="32">32</option>
                      <option value="34">34</option>
                      <option value="36">36</option>
                      <option value="38">38</option>
                      <option value="40">40</option>
                      <option value="42">42</option>
                      <option value="44">44</option>
                      <option value="One Size">One Size</option>
                    </select>
                    {formik.touched.sizes && formik.errors.sizes && (
                      <div className="text-red-500 text-sm mt-1">{formik.errors.sizes}</div>
                    )}
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Selected Sizes:</p>
                      <div className="flex flex-wrap gap-2">
                        {formik.values.sizes.map((size, index) => (
                          <motion.div
                            key={index}
                            className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            layout
                          >
                            <span className="text-sm font-medium text-blue-700">{size}</span>
                            <motion.button
                              type="button"
                              onClick={() => handleRemoveSize(size)}
                              className="text-blue-500 hover:text-blue-700 transition-colors"
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.8 }}
                            >
                              <FiTrash2 size={12} />
                            </motion.button>
                          </motion.div>
                        ))}
                        {formik.values.sizes.length === 0 && (
                          <p className="text-sm text-gray-500 italic">No sizes selected yet</p>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Specifications */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Specifications
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <input
                        type="text"
                        id="newSpecKey"
                        placeholder="Specification key (e.g., Material)"
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          id="newSpecValue"
                          placeholder="Specification value"
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        <motion.button
                          type="button"
                          onClick={handleAddSpecification}
                          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2 shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FiPlus size={18} />
                          Add
                        </motion.button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {Object.entries(formik.values.specifications).map(([key, value]) => (
                        <motion.div
                          key={key}
                          className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-xl border"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          layout
                        >
                          <div>
                            <span className="text-sm font-medium text-gray-700">{key}:</span>
                            <span className="text-sm text-gray-600 ml-2">{value}</span>
                          </div>
                          <motion.button
                            type="button"
                            onClick={() => handleRemoveSpecification(key)}
                            className="text-red-500 hover:text-red-700 transition-colors p-1"
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.8 }}
                          >
                            <FiTrash2 size={16} />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Checkboxes */}
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-xl"
                    variants={itemVariants}
                  >
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          name="isBestSeller"
                          checked={formik.values.isBestSeller}
                          onChange={formik.handleChange}
                          className="sr-only"
                        />
                        <div className={`w-12 h-6 rounded-full transition-all duration-200 ${
                          formik.values.isBestSeller ? 'bg-orange-500' : 'bg-gray-300'
                        }`} />
                        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                          formik.values.isBestSeller ? 'transform translate-x-6' : ''
                        }`} />
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        Best Seller
                      </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          name="inStock"
                          checked={formik.values.inStock}
                          onChange={formik.handleChange}
                          className="sr-only"
                        />
                        <div className={`w-12 h-6 rounded-full transition-all duration-200 ${
                          formik.values.inStock ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                          formik.values.inStock ? 'transform translate-x-6' : ''
                        }`} />
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        In Stock
                      </span>
                    </label>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div 
                    className="flex gap-4 pt-6 border-t border-gray-200"
                    variants={itemVariants}
                  >
                    <motion.button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold cursor-pointer"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={formik.isSubmitting}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FiSave size={20} />
                      {formik.isSubmitting ? 'Saving...' : 'Save Changes'}
                    </motion.button>
                  </motion.div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EditProductModal;