// components/AdminSidebar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdOutlineDashboardCustomize,MdOutlineRateReview,MdOutlineFileUpload,MdManageHistory   } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { cookieKeys } from "@/services/cookies";
import Cookies from "js-cookie";
import routesConstants from "@/routes/routesConstants";
import { useDispatch } from "react-redux";
import { logout, postLogout } from '../../auth/slice/loginSlice';
import { toast } from "react-toastify";

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon:<MdOutlineDashboardCustomize size={22}/> },
    { path: "/admin/review", label: "Review", icon: <MdOutlineRateReview size={22}/> },
    { path: "/admin/addproduct", label: "Products", icon: <MdOutlineFileUpload size={22}/> },
    { path: "/admin/manage", label: "Manage", icon: <MdManageHistory size={22}/> },
  ];



    const handleLogout = async () => {
    try {
      // Dispatch logout action FIRST to update Redux state immediately
      dispatch(logout());
      
      // Clear cookies
      Cookies.remove(cookieKeys?.TOKEN);
      Cookies.remove(cookieKeys?.REFRESH_TOKEN);
      Cookies.remove(cookieKeys?.USER);
      
      // Then call API logout
      await dispatch(postLogout());
      
      // Navigate to login
      navigate(routesConstants.LOGIN);
      toast.success("Logout Successfully");
      
    } catch (error) {
      console.error('Error signing out:', error);
      // Even if API fails, ensure local logout
      dispatch(logout());
      Cookies.remove(cookieKeys?.TOKEN);
      Cookies.remove(cookieKeys?.REFRESH_TOKEN);
      Cookies.remove(cookieKeys?.USER);
      navigate(routesConstants.LOGIN);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:flex lg:flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="p-4 ">
          <div className="flex justify-between items-center">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-2">
                <img 
                  src="/images/png/logo.png" 
                  alt="Logo" 
                  className="rounded-xl shadow-md"
                />
        </div>

          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                    onClick={onClose}
                  >
                    <span className={`${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* User Info */}
        <div className="p-4">
          <div className="flex items-center space-x-3 cursor-pointer border-transparent border-l-4 hover hover:border-blue-600 rounded-lg p-1 hover:bg-blue-50 " onClick={()=>handleLogout()}>
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
              <IoIosLogOut color="white"/>
            </div>
            <div>
              <p className="font-medium text-gray-800 ">LogOut</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;