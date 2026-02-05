import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/authContext';
import { motion, AnimatePresence } from 'framer-motion';
import { TiShoppingCart } from "react-icons/ti";
import { FiSearch, FiUser, FiHeart, FiMenu } from "react-icons/fi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { HiMiniSquares2X2 } from "react-icons/hi2";
import { FaHeadset } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { cookieKeys } from '@/services/cookies';
import routesConfig from '@/routes/routes.config';
import routesConstants from '@/routes/routesConstants';
import { getUserProfile, logout, postLogout } from './auth/slice/loginSlice';
import { toast } from 'react-toastify';
import { getWhishlistCount } from './Wishlist/slice/WishlistSlice';
useDispatch

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredItem, setHoveredItem] = useState(null);

  const {  totalQuantity } = useSelector(state => state.cart);
  const {  totalWishlistQuantity } = useSelector(state => state.wishlist);
  const {userDetail} = useSelector(state => state.login);

  const { userProfile, userProfileLoading, userProfileFetched, whishlistCount  } = useSelector(state => ({
    userProfile: state.login.userProfile,
    userProfileLoading: state.login.userProfileLoading,
    userProfileFetched : state.login.userProfileFetched,
    whishlistCount: state?.wishlist?.whishlistCount?.data?.count,
    }));

 useEffect(() => {
  if (!userProfileFetched) {
    dispatch(getUserProfile());
    dispatch(getWhishlistCount());
  }
}, [dispatch, userProfileFetched]);

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


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search functionality
  };

  // Dropdown data
  const dropdownData = {
    fashion: {
      title: "Fashion",
      items: [
        { name: "Men's Fashion", link: "/mens-fashion" },
        { name: "Women's Fashion", link: "/womens-fashion" },
        { name: "Kids' Fashion", link: "/kids-fashion" },
        { name: "Accessories", link: "/fashion-accessories" },
        { name: "Jewelry", link: "/jewelry" },
      ]
    },
    electronics: {
      title: "Electronics",
      items: [
        { name: "Smartphones", link: "/smartphones" },
        { name: "Laptops & Computers", link: "/laptops-computers" },
        { name: "TV & Audio", link: "/tv-audio" },
        { name: "Cameras & Photography", link: "/cameras" },
        { name: "Gaming Consoles", link: "/gaming" },
        { name: "Wearables", link: "/wearables" },
      ]
    },
    bags: {
      title: "Bags",
      items: [
        { name: "Handbags", link: "/handbags" },
        { name: "Backpacks", link: "/backpacks" },
        { name: "Travel Bags", link: "/travel-bags" },
        { name: "Wallets", link: "/wallets" },
        { name: "Luggage", link: "/luggage" },
      ]
    },
    footwear: {
      title: "Footwear",
      items: [
        { name: "Men's Shoes", link: "/mens-shoes" },
        { name: "Women's Shoes", link: "/womens-shoes" },
        { name: "Sports Shoes", link: "/sports-shoes" },
        { name: "Sandals & Flip Flops", link: "/sandals" },
        { name: "Boots", link: "/boots" },
      ]
    },
    category: {
      title: "category",
      items: [
        { images:'/images/png/fashion.png',name: "Fashion", link: "/category/fashion" },
        { images:'/images/png/electronics.png',name: "Electronics", link: "/category/electronics" },
        { images:'/images/png/bags.png',name: "Bags", link: "/category/bags" },
        { images:'/images/png/footwear.png',name: "Footwear", link: "/category/footwear" },
        { images:'/images/png/groceries.png',name: "Groceries", link: "/category/groceries" },
        { images:'/images/png/beauty.png',name: "Beauty", link: "/category/beauty" }
      ]
    },
    profile: {
      title: "profile",
      items: [
        { images:'/images/png/favourite.png',name: "Wishlist", link: "/wishlist" },
        { images:'/images/png/profile.png',name: "Profile", link: "/account" },
        { images:'/images/png/check-out.png',name: "Logout", link: "/" },
      ]
    }
  };

  const DropdownMenu = ({ category }) => {
    const data = dropdownData[category];
    
    if (!data) return null;


  
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-md py-2 z-50 border border-gray-200"
      >
        {data.items.map((item, index) => (
          

          <Link
            key={index}
            to={item.link}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#0289de] transition-colors"
            onClick={closeMenu}
          >
            
            {item.name}
          </Link>
        ))}
      </motion.div>
    );
  };


  const DropdownCategory = ({ category,style }) => {
    const data = dropdownData[category];
    
    if (!data) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className={style}
      >
        {data.items.map((item, index) => (
          

          <Link
            key={index}
            to={item.link}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#0289de] transition-colors flex justify-between"
            onClick={item.link=== "/"?handleLogout:closeMenu}
          >
            <img src={item.images} alt="images"  className='w-7'/>
            {item.name}
          </Link>
        ))}
      </motion.div>
    );
  };



  return (
    <>
      {/* Top Navigation Bar - Desktop Only */}
      {userDetail.role === 'user' &&
        <div className="hidden md:block bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10">
            {/* Left side - Contact info */}
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>📞 +1 (234) 567-8900</span>
              <span>✉️ info@yourstore.com</span>
            </div>

            {/* Right side - Account links */}
            <div className="flex items-center space-x-4">
              {userDetail ? (
                <>
                  <Link to="/wishlist" className="text-sm text-gray-600 hover:text-[#0289de] flex items-center">
                    <FiHeart className="mr-1" /> Wishlist
                  </Link>
                  <Link to="/account" className="text-sm text-gray-600 hover:text-[#0289de] flex items-center">
                    <FiUser className="mr-1" /> My Account
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-600 hover:text-[#0289de] cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm text-gray-600 hover:text-[#0289de] ">
                    Login
                  </Link>
                  <Link to="/signup" className="text-sm text-gray-600 hover:text-[#0289de] ">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      }


      {/* Main Navigation Bar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo - Mobile & Desktop */}
            <Link to={userDetail.role === 'user' ? '/' : '/admin'} className="hidden md:flex items-center">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-2">
                <img 
                  src="/images/png/logo.png" 
                  alt="Logo" 
                  className="rounded-xl shadow-md"
                />
              </div>
            </Link>

            {userDetail.role === 'admin' &&
              <div className="hidden md:flex flex-1 max-w-2xl mx-8 gap-2 justify-center">
                <Link to={routesConstants.ADMIN} className="hidden md:flex items-center bg-[#0289de] p-1 rounded-[5px] hover:bg-[#429ed8] text-white hover:text-black">
                Dashboard
                </Link>
                <Link to={routesConstants.ADMIN_ADD_PRODUCT} className="hidden md:flex items-center bg-[#0289de] p-1 rounded-[5px] hover:bg-[#429ed8] text-white hover:text-black">
                Add Product
                </Link>
                <Link to={routesConstants.ADMIN_MANAGE} className="hidden md:flex items-center bg-[#0289de] p-1 rounded-[5px] hover:bg-[#429ed8] text-white hover:text-black">
                Manage Product
                </Link>
                <Link to={routesConstants.ADMIN_REVIEW} className="hidden md:flex items-center bg-[#0289de] p-1 rounded-[5px] hover:bg-[#429ed8] text-white hover:text-black">
                Manage Review
                </Link>
              </div>
            }

            {userDetail.role === 'admin' &&
             
                <div className="hidden md:flex items-center ml-4 relative group cursor-pointer "
                onClick={()=>hoveredItem==='profile'?setHoveredItem(null) : setHoveredItem('profile')}>
                  <div className="w-8 h-8 bg-[#0289de] rounded-full flex items-center justify-center border border-[#0289de] hover:border-blue-900">
                    <span className="text-white text-sm font-medium">
                      {userDetail.email ? userDetail.email.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                  <AnimatePresence >
                    {hoveredItem === 'profile' && (
                      <DropdownCategory category="profile"  style="absolute top-full ml-[-10rem] mt-1 w-48 bg-white shadow-lg  py-2 z-50 border border-gray-200"/>
                    )}
                </AnimatePresence>
                </div>
            
            }

            {/* Search Bar - Desktop Only */}
            {userDetail.role === "user" &&
              <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="flex w-full">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#0289de] focus:border-transparent"
                />
                <button
                  type="submit"
                  className="bg-[#0289de] hover:bg-[#007ac7] text-white px-4 py-2 rounded-r-lg transition-colors"
                >
                  <FiSearch className="h-5 w-5" />
                </button>
              </form>
            </div>
            }

            {/* Cart & Actions - Desktop */}
            {userDetail.role === "user" &&
              <div className="hidden md:flex items-center space-x-6">
              <Link to="/wishlist" className="text-gray-700 hover:text-[#0289de] relative">
                <FiHeart className="h-6 w-6" />
                <span className="absolute -top-2 -right-2 bg-[#0289de] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {whishlistCount}
                </span>
              </Link>
              
              <Link to="/cart" className="text-gray-700 hover:text-[#0289de] relative flex items-center">
                <TiShoppingCart className="h-6 w-6" />
                <span className="absolute -top-2 -right-2 bg-[#0289de] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalQuantity}
                </span>
                <span className="ml-1 hidden lg:block">Cart</span>
              </Link>

              {userDetail && (
                <div className="flex items-center ml-4 relative group cursor-pointer "
                onClick={()=>hoveredItem==='profile'?setHoveredItem(null) : setHoveredItem('profile')}>
                  <div className="w-8 h-8 bg-[#0289de] rounded-full flex items-center justify-center border border-[#0289de] hover:border-blue-900">
                    <span className="text-white text-sm font-medium">
                      {userDetail.email ? userDetail.email.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                  <AnimatePresence >
                    {hoveredItem === 'profile' && (
                      <DropdownCategory category="profile"  style="absolute top-full ml-[-10rem] mt-1 w-48 bg-white shadow-lg  py-2 z-50 border border-gray-200"/>
                    )}
                </AnimatePresence>
                </div>
              )}
            </div>}

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center justify-between w-full space-x-4">

              <button
                onClick={toggleMenu}
                className="p-2 rounded-md text-gray-700 hover:text-[#0289de] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#0289de]"
              >
                <FiMenu className="h-6 w-6" />
              </button>

              <Link to="/" className="flex items-center">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-2">
                <img 
                  src="/images/png/logo.png" 
                  alt="Logo" 
                  className="rounded-xl shadow-md"
                />
              </div>
              </Link>
              
             {userDetail.role === "user"&&
              <Link to="/cart" className="text-gray-700 relative">
                <TiShoppingCart className="h-6 w-6" />
                <span className="absolute -top-2 -right-2 bg-[#0289de] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalQuantity}
                </span>
              </Link>
              }

             {userDetail.role === "admin"&&
               <div className="flex items-center ml-4 relative group cursor-pointer "
                onClick={()=>hoveredItem==='profile'?setHoveredItem(null) : setHoveredItem('profile')}>
                  <div className="w-8 h-8 bg-[#0289de] rounded-full flex items-center justify-center border border-[#0289de] hover:border-blue-900">
                    <span className="text-white text-sm font-medium">
                      {userDetail.email ? userDetail.email.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                  <AnimatePresence >
                    {hoveredItem === 'profile' && (
                      <DropdownCategory category="profile"  style="absolute top-full ml-[-10rem] mt-1 w-48 bg-white shadow-lg  py-2 z-50 border border-gray-200"/>
                    )}
                </AnimatePresence>
                </div>
              }
              
            </div>
          </div>

          {/* Secondary Navigation - Desktop Only */}
         {userDetail.role === "user" &&
          <div className="hidden md:flex justify-center items-center h-12 border-t border-gray-200">
            <div className="flex items-center justify-evenly space-x-8">
              <div 
              className="relative group"
                  onClick={()=>hoveredItem==='category'?setHoveredItem(null) : setHoveredItem('category')}
                  >
                <button className='bg-[#0289de] hover:bg-[#007ac7] text-white rounded p-2 cursor-pointer flex items-center mx-3 text-[12px] lg:text-md'>
                  <HiMiniSquares2X2 />Browse All Categories<MdKeyboardArrowDown />
                </button>
                <AnimatePresence>
                    {hoveredItem === 'category' && (
                      <DropdownCategory category="category" style="absolute top-full ml-[-0.2rem] mt-1 w-48 bg-white shadow-lg  py-2 z-50 border border-gray-200"  />
                    )}
                </AnimatePresence>
              </div>

              <div className='text-sm flex'>
                {/* Fashion Dropdown */}
                <div 
                  className="relative group"
                  onMouseEnter={() => setHoveredItem('fashion')}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Link
                    to="/category/fashion"
                    className="text-gray-700 hover:text-[#0289de] px-3 py-2 font-medium transition-colors flex items-center"
                  >
                    Fashion<MdKeyboardArrowDown />
                  </Link>
                  <AnimatePresence>
                    {hoveredItem === 'fashion' && (
                      <DropdownMenu category="fashion"  />
                    )}
                  </AnimatePresence>
                </div>

                {/* Electronics Dropdown */}
                <div 
                  className="relative group"
                  onMouseEnter={() => setHoveredItem('electronics')}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Link
                    to="/category/electronics"
                    className="text-gray-700 hover:text-[#0289de] px-3 py-2 font-medium transition-colors flex items-center"
                  >
                    Electronics<MdKeyboardArrowDown />
                  </Link>
                  <AnimatePresence>
                    {hoveredItem === 'electronics' && (
                      <DropdownMenu category="electronics" />
                    )}
                  </AnimatePresence>
                </div>

                {/* Bags Dropdown */}
                <div 
                  className="relative group"
                  onMouseEnter={() => setHoveredItem('bags')}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Link
                    to="/category/bags"
                    className="text-gray-700 hover:text-[#0289de] px-3 py-2 font-medium transition-colors flex items-center"
                  >
                    Bags<MdKeyboardArrowDown />
                  </Link>
                  <AnimatePresence>
                    {hoveredItem === 'bags' && (
                      <DropdownMenu category="bags" />
                    )}
                  </AnimatePresence>
                </div>

                {/* Footwear Dropdown */}
                <div 
                  className="relative group"
                  onMouseEnter={() => setHoveredItem('footwear')}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Link
                    to="/category/footwear"
                    className="text-gray-700 hover:text-[#0289de] px-3 py-2 font-medium transition-colors flex items-center"
                  >
                    Footwear<MdKeyboardArrowDown />
                  </Link>
                  <AnimatePresence>
                    {hoveredItem === 'footwear' && (
                      <DropdownMenu category="footwear" />
                    )}
                  </AnimatePresence>
                </div>

                <Link
                  to="/category/groceries"
                  className="text-gray-700 hover:text-[#0289de] px-3 py-2 font-medium transition-colors"
                >
                  Groceries
                </Link>
              </div>

              {/* <div className='flex'>
                <FaHeadset className='w-7 h-7 items-center'/> 
                <div className='flex-row ml-2'>
                  <p style={{fontSize:'12px'}}>+1 (234) 567-8900</p>
                  <p className='mt-[-5px]' style={{fontSize:'12px'}}>info@yourstore.com</p>
                </div>
              </div> */}
            </div>
          </div>
          }
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-white border-t border-gray-200"
            >
              {/* Mobile Search */}
              <div className="px-4 py-3 border-b border-gray-200">
                <form onSubmit={handleSearch} className={userDetail.role==='user'?"flex":"hidden md:flex"}>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="min-w-[2rem] flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-[#0289de] text-white px-3 py-2 rounded-r-lg"
                  >
                    <FiSearch className="h-5 w-5" />
                  </button>
                </form>
              </div>

              <div className="px-2 pt-2 pb-3 space-y-1">
                {userDetail.role === 'user' &&
                <>
                <Link
                  to="/category/fashion"
                  className="text-gray-700 hover:text-[#0289de] block px-3 py-2 rounded-md text-base font-medium"
                  onClick={closeMenu}
                >
                  Fashion
                </Link>
                
                <Link
                  to="/category/electronics"
                  className="text-gray-700 hover:text-[#0289de] block px-3 py-2 rounded-md text-base font-medium"
                  onClick={closeMenu}
                >
                  Electronics
                </Link>

                <Link
                  to="/category/footwear"
                  className="text-gray-700 hover:text-[#0289de] block px-3 py-2 rounded-md text-base font-medium"
                  onClick={closeMenu}
                >
                  Footwear
                </Link>

                <Link
                  to="/category/bags"
                  className="text-gray-700 hover:text-[#0289de] block px-3 py-2 rounded-md text-base font-medium"
                  onClick={closeMenu}
                >
                  Bags
                </Link>

                <Link
                  to="/category/groceries"
                  className="text-gray-700 hover:text-[#0289de] block px-3 py-2 rounded-md text-base font-medium"
                  onClick={closeMenu}
                >
                  Groceries
                </Link>
                </>
                }

                {userDetail.role === 'admin' &&
                <>
                <Link
                  to="/admin"
                  className="text-gray-700 hover:text-[#0289de] block px-3 py-2 rounded-md text-base font-medium"
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
                
                <Link
                  to="/admin/addproduct"
                  className="text-gray-700 hover:text-[#0289de] block px-3 py-2 rounded-md text-base font-medium"
                  onClick={closeMenu}
                >
                  Add Product
                </Link>

                <Link
                  to="/admin/manage"
                  className="text-gray-700 hover:text-[#0289de] block px-3 py-2 rounded-md text-base font-medium"
                  onClick={closeMenu}
                >
                  Manage Product
                </Link>

                <Link
                  to="/admin/review"
                  className="text-gray-700 hover:text-[#0289de] block px-3 py-2 rounded-md text-base font-medium"
                  onClick={closeMenu}
                >
                  Manage Review
                </Link>
                </>
                }

                {userDetail ? (
                  <div className="pt-4 pb-3 border-t border-gray-200 text-center">
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        closeMenu();
                      }}
                      className="   hover:text-[#0289de] px-3 py-2 rounded-md text-base font-medium text-center bg-red-500 text-white" 
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 pb-3 border-t border-gray-200 space-y-2">
                    <Link
                      to="/login"
                      className="block text-[#0289de] hover:text-[#007ac7] px-3 py-2 rounded-md text-base font-medium bg-blue-700"
                      onClick={closeMenu}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="block bg-[#0289de] hover:bg-[#007ac7] text-white px-3 py-2 rounded-md text-base font-medium text-center"
                      onClick={closeMenu}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;