import { motion } from 'framer-motion';
import WishlistPage from '../../Wishlist/page/WishlistPage';


const Wishlist = () => {

  return (
    <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
            <WishlistPage/>
            </motion.div>
  )
}

export default Wishlist