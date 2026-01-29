// components/common/ConfirmModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiX, FiCheck, FiXCircle, FiInfo } from 'react-icons/fi';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "delete", // 'delete', 'warning', 'info', 'success'
  isLoading = false
}) => {
  // Configuration based on modal type
  const modalConfig = {
    delete: {
      icon: <FiXCircle className="text-red-600" size={24} />,
      confirmButtonClass: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
      iconBg: "bg-red-50",
      textColor: "text-red-600"
    },
    warning: {
      icon: <FiAlertTriangle className="text-orange-600" size={24} />,
      confirmButtonClass: "bg-orange-600 hover:bg-orange-700 focus:ring-orange-500",
      iconBg: "bg-orange-50",
      textColor: "text-orange-600"
    },
    info: {
      icon: <FiInfo className="text-blue-600" size={24} />,
      confirmButtonClass: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
      iconBg: "bg-blue-50",
      textColor: "text-blue-600"
    },
    success: {
      icon: <FiCheck className="text-green-600" size={24} />,
      confirmButtonClass: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
      iconBg: "bg-green-50",
      textColor: "text-green-600"
    }
  };

  const config = modalConfig[type];

  const handleConfirm = () => {
    onConfirm();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleBackdropClick}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${config.iconBg} shadow-sm`}>
                  {config.icon}
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${config.textColor}`}>
                    {title}
                  </h2>
                  <p className="text-gray-600 mt-1 leading-relaxed">
                    {message}
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-2 hover:bg-gray-100 flex-shrink-0"
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiX size={20} />
              </motion.button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 p-6 pt-4">
              <motion.button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {cancelText}
              </motion.button>
              <motion.button
                onClick={handleConfirm}
                disabled={isLoading}
                className={`flex-1 px-6 py-3 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-lg ${config.confirmButtonClass}`}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                {isLoading ? (
                  <>
                    <motion.div 
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Processing...
                  </>
                ) : (
                  confirmText
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;