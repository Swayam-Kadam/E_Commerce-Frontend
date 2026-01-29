// components/common/Unauthorized.jsx
import { Link } from 'react-router-dom';
import { FaLock, FaHome, FaArrowLeft } from 'react-icons/fa';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <FaLock className="w-10 h-10 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
          Access Denied
        </h1>
        
        <p className="text-gray-600 mb-2">
          You don't have permission to access this page.
        </p>
        
        <p className="text-sm text-gray-500 mb-6">
          This area requires administrator privileges.
        </p>
        
        <div className="space-y-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaHome className="mr-2" />
            Go to Homepage
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Go Back
          </button>
          
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              If you believe this is an error, please contact support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;