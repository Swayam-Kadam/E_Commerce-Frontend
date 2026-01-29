// components/AdminFooter.jsx
const AdminFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white  py-4 px-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm text-gray-600 mb-2 md:mb-0">
          © {currentYear} Admin Panel. All rights reserved.
        </div>
        
        <div className="flex items-center space-x-6">
          <a href="/admin/privacy" className="text-sm text-gray-500 hover:text-gray-700">
            Privacy Policy
          </a>
          <a href="/admin/terms" className="text-sm text-gray-500 hover:text-gray-700">
            Terms of Service
          </a>
          <a href="/admin/help" className="text-sm text-gray-500 hover:text-gray-700">
            Help Center
          </a>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;