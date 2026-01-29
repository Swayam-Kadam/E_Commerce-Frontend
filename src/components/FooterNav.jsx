import { Link, useLocation } from 'react-router-dom';
import { 
  HiHome, 
  HiShoppingBag, 
  HiHeart, 
  HiUser, 
  HiSearch 
} from 'react-icons/hi';
import { useSelector } from 'react-redux'; // Import useSelector

const FooterNav = () => {
  const location = useLocation();
  const {  totalWishlistQuantity } = useSelector(state => state.wishlist); // Get the count from Redux state

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      icon: HiHome,
      label: 'Home',
      path: '/',
      active: isActive('/')
    },
    {
      icon: HiSearch,
      label: 'Search',
      path: '/search',
      active: isActive('/search')
    },
    {
      icon: HiShoppingBag,
      label: 'Order',
      path: '/order',
      active: isActive('/cart')
    },
    {
      icon: HiHeart,
      label: 'Wishlist',
      path: '/wishlist',
      active: isActive('/wishlist')
    },
    {
      icon: HiUser,
      label: 'Profile',
      path: '/account',
      active: isActive('/account')
    }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center py-3">
        {navItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex flex-col items-center justify-center w-16 relative ${ // Add 'relative' class here
                item.active ? 'text-[#0289de]' : 'text-gray-600'
              }`}
            >
              <IconComponent className="h-6 w-6" />
              <span className="text-xs mt-1">{item.label}</span>

              {/* Conditionally render the count span for Wishlist */}
                {item.icon === HiHeart &&
                <span className="absolute -top-[-5px] -right-[-20px] bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
                  {totalWishlistQuantity}
                </span>
                }
             

            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default FooterNav;