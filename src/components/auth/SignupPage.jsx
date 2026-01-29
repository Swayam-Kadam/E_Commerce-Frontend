import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const SignupPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const navigate = useNavigate();

  // Formik configuration with Yup validation
  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      cpassword: '',
      agreeTerms: false,
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .required('Full name is required')
        .min(2, 'Full name must be at least 2 characters'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
      cpassword: Yup.string()
        .required('Confirm Password is required')
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
      agreeTerms: Yup.boolean()
        .oneOf([true], 'You must accept the terms and conditions')
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setAuthError('');
      setAuthSuccess('');
      
      try {
        // First, create the user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              full_name: values.fullName,
            }
          }
        });

        if (authError) {
          setAuthError(authError.message);
          return;
        }

        // Then, store user data in a separate table
        if (authData.user) {
          const { error: dbError } = await supabase
            .from('users')
            .insert([
              {
                id: authData.user.id,
                full_name: values.fullName,
                email: values.email,
                created_at: new Date().toISOString(),
              }
            ]);

          if (dbError) {
            console.error('Error storing user data:', dbError);
            setAuthError('Account created but there was an error saving your profile. Please contact support.');
          } else {
            setAuthSuccess('Account created successfully! Please check your email for verification.');
            
            // Redirect to login after a delay
            setTimeout(() => {
              navigate('/login');
            }, 3000);
          }
        }
      } catch (error) {
        setAuthError('An unexpected error occurred');
        console.error('Signup error:', error);
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
      <div className="hidden md:flex w-1/2 items-center justify-center p-8" style={{backgroundColor:'#42b0f5'}}>
        <div className="max-w-md text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-6">Join Our Platform</h1>
            <p className="text-xl opacity-90">
              Create your account and discover a world of possibilities. Manage your profile, connect with others, and explore exclusive features.
            </p>
            <div className="mt-10">
              <div className="flex justify-center">
                <div className="bg-white/20 p-6 rounded-2xl shadow-lg">
                  <img 
                    src="/images/jpg/login.jpg" 
                    alt="Sign Up" 
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
                Create Account
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-gray-600"
              >
                Sign up for a new account
              </motion.p>
            </div>

            {/* Auth Messages */}
            {authError && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm"
              >
                {authError}
              </motion.div>
            )}
            
            {authSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm"
              >
                {authSuccess}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* Full Name Field */}
              <motion.div variants={itemVariants}>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.fullName}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-colors ${
                    formik.touched.fullName && formik.errors.fullName
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                  }`}
                  placeholder="Enter your full name"
                />
                {formik.touched.fullName && formik.errors.fullName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {formik.errors.fullName}
                  </motion.p>
                )}
              </motion.div>

              {/* Email Field */}
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
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
                  autoComplete="new-password"
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

              {/* Confirm Password Field */}
              <motion.div variants={itemVariants}>
                <label htmlFor="cpassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  id="cpassword"
                  name="cpassword"
                  type="password"
                  autoComplete="new-password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.cpassword}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-colors ${
                    formik.touched.cpassword && formik.errors.cpassword
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                  }`}
                  placeholder="Confirm your password"
                />
                {formik.touched.cpassword && formik.errors.cpassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {formik.errors.cpassword}
                  </motion.p>
                )}
              </motion.div>

              {/* Terms Agreement */}
              <motion.div variants={itemVariants} className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    onChange={formik.handleChange}
                    checked={formik.values.agreeTerms}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeTerms" className="text-gray-600">
                    I agree to the <a href="#" className="text-blue-600 hover:text-blue-800">Terms and Conditions</a>
                  </label>
                  {formik.touched.agreeTerms && formik.errors.agreeTerms && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {formik.errors.agreeTerms}
                    </motion.p>
                  )}
                </div>
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
                      Signing up...
                    </div>
                  ) : (
                    'Sign Up'
                  )}
                </button>
              </motion.div>
            </form>

            {/* Sign In Link */}
            <motion.div variants={itemVariants} className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to='/login' className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                  Sign In
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;