import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Profile from './component/Profile';
import Order from './component/Order';
import Setting from './component/Setting';
import Wishlist from './component/Wishlist';
import { getUserProfile } from '../auth/slice/loginSlice';
import { useDispatch } from 'react-redux';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('profile');

  // useEffect(()=>{
  //      dispatch(getUserProfile())
  //   },[dispatch])

  // const fetchedRef = useRef(false);

// useEffect(() => {
//   if (!fetchedRef.current) {
//     dispatch(getUserProfile());
//     fetchedRef.current = true;
//   }
// }, [dispatch]);


  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.h1 
        className="text-3xl font-bold text-gray-800 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        My Account
      </motion.h1>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-5">
          {['profile', 'orders', 'settings', 'wishlist'].map((tab) => (
            <button
              key={tab}
              className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <Profile/>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <Order/>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <Setting/>
      )}

      {/* Wishlist Tab */}
      {activeTab === 'wishlist' && (
        <Wishlist/>
      )}
    </div>
  );
};

export default ProfilePage;