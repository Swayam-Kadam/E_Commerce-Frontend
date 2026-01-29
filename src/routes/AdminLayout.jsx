// components/AdminLayout.jsx
import { useState } from "react";
import AdminSidebar from "../components/Admin/Layout/AdminSidebar";
import AdminNavbar from "../components/Admin/Layout/AdminNavbar";
import AdminFooter from "../components/Admin/Layout/AdminFooter";


const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <AdminNavbar 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {children}
        </main>
        
        {/* Footer */}
        <AdminFooter />
      </div>
    </div>
  );
};

export default AdminLayout;