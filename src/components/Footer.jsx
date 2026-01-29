import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaFacebookF,FaTwitter } from "react-icons/fa6";
import { FaInstagram, FaYoutube } from 'react-icons/fa';



const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-800 py-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                <img 
                  src="/images/png/logo.png" 
                  alt="Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">SwiftCart</h2>
                <p className="text-sm text-gray-600 mt-1">Awesome grocery store website template</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              We provide fresh and quality groceries delivered right to your doorstep. Satisfaction guaranteed!
            </p>
            <div className="flex space-x-4">
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
              >
                <FaFacebookF />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-400 hover:bg-blue-400 hover:text-white transition-colors"
              >
                <FaTwitter />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 hover:bg-pink-600 hover:text-white transition-colors"
              >
                <FaInstagram />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-colors"
              >
                <FaYoutube/>
              </motion.a>
            </div>
          </div>

          {/* Account Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Account</h3>
            <ul className="space-y-3">
              <motion.li whileHover={{ x: 5 }}>
                <Link to="/account" className="text-gray-600 hover:text-blue-600 transition-colors text-sm flex items-center">
                  <span className="w-1 h-1 bg-blue-600 rounded-full mr-2 opacity-0 transition-opacity group-hover:opacity-100"></span>
                  My Account
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <Link to="/orders" className="text-gray-600 hover:text-blue-600 transition-colors text-sm flex items-center">
                  <span className="w-1 h-1 bg-blue-600 rounded-full mr-2 opacity-0 transition-opacity group-hover:opacity-100"></span>
                  Order History
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <Link to="/wishlist" className="text-gray-600 hover:text-blue-600 transition-colors text-sm flex items-center">
                  <span className="w-1 h-1 bg-blue-600 rounded-full mr-2 opacity-0 transition-opacity group-hover:opacity-100"></span>
                  Wishlist
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <Link to="/newsletter" className="text-gray-600 hover:text-blue-600 transition-colors text-sm flex items-center">
                  <span className="w-1 h-1 bg-blue-600 rounded-full mr-2 opacity-0 transition-opacity group-hover:opacity-100"></span>
                  Newsletter
                </Link>
              </motion.li>
            </ul>
          </div>
          
          {/* Company Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Company</h3>
            <ul className="space-y-3">
              <motion.li whileHover={{ x: 5 }}>
                <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors text-sm flex items-center">
                  <span className="w-1 h-1 bg-blue-600 rounded-full mr-2 opacity-0 transition-opacity group-hover:opacity-100"></span>
                  About Us
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <Link to="/delivery" className="text-gray-600 hover:text-blue-600 transition-colors text-sm flex items-center">
                  <span className="w-1 h-1 bg-blue-600 rounded-full mr-2 opacity-0 transition-opacity group-hover:opacity-100"></span>
                  Delivery Information
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <Link to="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors text-sm flex items-center">
                  <span className="w-1 h-1 bg-blue-600 rounded-full mr-2 opacity-0 transition-opacity group-hover:opacity-100"></span>
                  Privacy Policy
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <Link to="/terms" className="text-gray-600 hover:text-blue-600 transition-colors text-sm flex items-center">
                  <span className="w-1 h-1 bg-blue-600 rounded-full mr-2 opacity-0 transition-opacity group-hover:opacity-100"></span>
                  Terms & Conditions
                </Link>
              </motion.li>
            </ul>
          </div>
          
          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Contact</h3>
            <ul className="space-y-3">
              <motion.li whileHover={{ x: 5 }} className="flex items-start">
                <i className="fas fa-map-marker-alt text-blue-600 mt-1 mr-3 text-sm"></i>
                <span className="text-gray-600 text-sm">123 Grocery St, City, Country</span>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} className="flex items-start">
                <i className="fas fa-phone text-blue-600 mt-1 mr-3 text-sm"></i>
                <span className="text-gray-600 text-sm">+1 234 567 8900</span>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} className="flex items-start">
                <i className="fas fa-envelope text-blue-600 mt-1 mr-3 text-sm"></i>
                <span className="text-gray-600 text-sm">support@freshgrocer.com</span>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} className="flex items-start">
                <i className="fas fa-clock text-blue-600 mt-1 mr-3 text-sm"></i>
                <span className="text-gray-600 text-sm">Mon-Sat: 8AM - 10PM</span>
              </motion.li>
            </ul>
          </div>
        </div>
        
        {/* Newsletter Subscription */}
        <div className="mt-10 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h4 className="text-lg font-semibold text-gray-900">Subscribe to our Newsletter</h4>
              <p className="text-gray-600 text-sm">Get the latest updates on offers, products and more</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
              />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-5 py-3 rounded-r-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Copyright Section */}
        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} SwiftCart. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <img src="/images/png/visa.png" alt="Visa" className="h-6" />
            <img src="/images/png/mastercard.png" alt="Mastercard" className="h-6" />
            <img src="/images/png/paypal.png" alt="PayPal" className="h-6" />
            <img src="/images/png/american-express.png" alt="American Express" className="h-6" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;