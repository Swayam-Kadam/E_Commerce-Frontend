// components/AdminNavbar.jsx
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
// import { MenuIcon, BellIcon, SearchIcon, UserCircleIcon } from "@/components/Icons";

const AdminNavbar = ({ onMenuClick, sidebarOpen }) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <header className="bg-white shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 lg:hidden"
            >
              <GiHamburgerMenu size={20}/>
            </button>
            
            <div className="hidden lg:flex items-center ml-4">
              <h2 className="text-lg font-semibold text-gray-800">
                SwiftCart
              </h2>
            </div>
          </div>
          
          {/* Right side */}
          <div className="flex items-center space-x-4">

            
            {/* User Profile */}
            <div className="relative">
              <button className="flex items-center space-x-2 focus:outline-none">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  {/* <UserCircleIcon className="w-6 h-6 text-blue-600" /> */}
                </div>
                <span className="hidden md:inline text-sm font-medium text-gray-700">
                  Admin
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;