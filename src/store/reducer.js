import { combineReducers } from "@reduxjs/toolkit";
import cartReducer from '../components/AddToCart/slice/CartSlice'
import wishlistReducer from '../components/Wishlist/slice/WishlistSlice'
import loginReducer from '../components/auth/slice/loginSlice'
import adminReducer from '../components/Admin/slice/index'
import homeReducer from '../components/home/slice/index'
import SpecificProductReducer from '../components/SelectProduct/slice/index'
import orderReducer from '../components/profile/slice/orderSlice'
import settingsReducer from '../components/profile/slice/settingsSlice'


const reducer = combineReducers({
    cart:cartReducer,
    wishlist:wishlistReducer,
    login:loginReducer,
    admin:adminReducer,
    home:homeReducer,
    specificProduct:SpecificProductReducer,
    order:orderReducer,
    settings:settingsReducer,
})

export default reducer;
