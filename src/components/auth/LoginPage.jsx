import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { cookieKeys } from "@/services/cookies";
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { getLogin } from './slice/loginSlice';
import { toast}  from 'react-toastify';
import routesConstants from '@/routes/routesConstants';

const LoginPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
   const [authError, setAuthError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Formik configuration with Yup validation
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    }),
     onSubmit: async (values) => {
      setIsSubmitting(true);
      setAuthError('');
      
      try {

        let payload={
          email:values.email,
          password:values.password
        }
        dispatch(getLogin(payload)).then((res)=>{
          if(res.payload.tokens.accessToken){
          toast.success("Login Successfully");
          Cookies.set(cookieKeys?.USER, JSON.stringify(res?.payload?.user));
          Cookies.set(cookieKeys?.TOKEN, JSON.stringify(res?.payload?.tokens?.accessToken));
          Cookies.set(cookieKeys?.REFRESH_TOKEN, JSON.stringify(res?.payload?.tokens?.refreshToken));
          if(res.payload.user.role === 'admin'){
            navigate(routesConstants?.ADMIN);
          }else{
          navigate(routesConstants?.HOMEPAGE);
          }
          }
        })
      } catch (error) {
        setAuthError('An unexpected error occurred');
        console.error('Login error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Image Section - Hidden on mobile, visible on medium screens and up */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br f items-center justify-center p-8" style={{backgroundColor:'#42b0f5'}}>
        <div className="max-w-md text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-6">Welcome to Our Platform</h1>
            <p className="text-xl opacity-90">
              Access your account and discover a world of possibilities. Manage your profile, connect with others, and explore exclusive features.
            </p>
            <div className="mt-10">
              <div className="flex justify-center">
                <div className="bg-white/20 p-6 rounded-2xl shadow-lg">
                  <img 
                    src="/images/jpg/login.jpg" 
                    alt="Login" 
                    className="rounded-xl shadow-md"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 bg-gray-100">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full max-w-md"
        >
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.h1
                variants={itemVariants}
                className="text-3xl font-bold text-gray-800 mb-2"
              >
                Welcome Back
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-gray-600"
              >
                Sign in to your account
              </motion.p>
            </div>

            {/* Auth Error Message */}
            {authError && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm"
              >
                {authError}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* Email Field */}
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-colors ${
                    formik.touched.email && formik.errors.email
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                  }`}
                  placeholder="Enter your email"
                />
                {formik.touched.email && formik.errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {formik.errors.email}
                  </motion.p>
                )}
              </motion.div>

              {/* Password Field */}
              <motion.div variants={itemVariants}>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-colors ${
                    formik.touched.password && formik.errors.password
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                  }`}
                  placeholder="Enter your password"
                />
                {formik.touched.password && formik.errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {formik.errors.password}
                  </motion.p>
                )}
              </motion.div>

              {/* Remember Me & Forgot Password */}
              <motion.div variants={itemVariants} className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    onChange={formik.handleChange}
                    checked={formik.values.rememberMe}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors hover:cursor-pointer ${
                    isSubmitting
                      ? 'bg-[#71c9ff] cursor-not-allowed'
                      : 'bg-[#0289de] hover:bg-[#007ac7]'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div variants={itemVariants} className="my-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
            </motion.div>

            {/* Social Login Buttons */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
              <button className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Google
              </button>
              <button className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                GitHub
              </button>
            </motion.div>

            {/* Sign Up Link */}
            <motion.div variants={itemVariants} className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to='/signup' className="text-blue-600 hover:text-blue-800 font-medium transition-colors" >
                  Sign up
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;