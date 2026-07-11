import { motion } from 'framer-motion';
import WishlistPage from '../../Wishlist/page/WishlistPage';

const Wishlist = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8"
    >
      <WishlistPage />
    </motion.div>
  );
};

export default Wishlist;
