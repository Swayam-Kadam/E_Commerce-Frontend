import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiPackage, FiSettings, FiHeart } from 'react-icons/fi';
import Profile from './component/Profile';
import Order from './component/Order';
import Setting from './component/Setting';
import Wishlist from './component/Wishlist';

const tabs = [
  { id: 'profile', label: 'Profile', icon: FiUser },
  { id: 'orders', label: 'Orders', icon: FiPackage },
  { id: 'wishlist', label: 'Wishlist', icon: FiHeart },
  { id: 'settings', label: 'Settings', icon: FiSettings },
];

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // smooth scrolling to top
    });
  }, []);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eef5fb_0%,#ffffff_32%,#ffffff_100%)]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8 md:mb-10"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0289de]">
            SwiftCart
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            My Account
          </h1>
          <p className="mt-2 max-w-xl text-slate-500">
            Manage your profile, track orders, and keep shopping preferences in one place.
          </p>
        </motion.header>

        <div className="mb-8 overflow-x-auto border-b border-slate-200">
          <nav className="flex min-w-max gap-1 sm:gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-3.5 text-sm font-medium transition ${
                    isActive
                      ? 'text-[#0289de]'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {isActive && (
                    <motion.span
                      layoutId="account-tab-underline"
                      className="absolute inset-x-0 bottom-0 h-0.5 bg-[#0289de]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
          >
            {activeTab === 'profile' && <Profile />}
            {activeTab === 'orders' && <Order />}
            {activeTab === 'settings' && <Setting />}
            {activeTab === 'wishlist' && <Wishlist />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfilePage;
