import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalWishlistQuantity: 0,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);
      
      if (!existingItem) {
        state.items.push({
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          originalPrice: newItem.originalPrice,
          image: newItem.image,
          inStock: newItem.inStock !== undefined ? newItem.inStock : true,
        });
      }
      state.totalWishlistQuantity ++
    },
    
    removeFromWishlist: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(item => item.id !== id);
      state.totalWishlistQuantity --
    },
    
    moveToCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(item => item.id !== id);
      // Note: You'll need to dispatch addToCart separately
    },
    
    clearWishlist: (state) => {
      state.items = [];
      state.totalWishlistQuantity = 0
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  moveToCart,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;