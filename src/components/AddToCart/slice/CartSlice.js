import { somethingWentWrong } from '@/constants/SchemaValidation';
import { axiosReact } from '@/services/api';
import { FETCH_ALL_CART } from '@/services/url';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

export const getCart = createAsyncThunk(
  `cart/getCart`,
  async (payload, thunkAPI) => { 
    try {
      const response = await axiosReact.get(FETCH_ALL_CART); 
      return response; 
    } catch (err) {
      toast.error(err?.response?.data?.error || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
  cartItems:[],
  cartItemLoading:false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);
      
      if (!existingItem) {
        state.items.push({
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          image: newItem.image,
          quantity: 1,
          color: newItem.color || '',
          size: newItem.size || '',
        });
      } else {
        existingItem.quantity++;
      }
      
      state.totalQuantity++;
      state.totalAmount += newItem.price;
    },
    
    removeFromCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem) {
        if (existingItem.quantity === 1) {
          state.items = state.items.filter(item => item.id !== id);
        } else {
          existingItem.quantity--;
        }
        
        state.totalQuantity--;
        state.totalAmount -= existingItem.price;
      }
    },
    
    removeItemCompletely: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalAmount -= existingItem.price * existingItem.quantity;
        state.items = state.items.filter(item => item.id !== id);
      }
    },
    
    updateItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem) {
        const quantityDifference = quantity - existingItem.quantity;
        existingItem.quantity = quantity;
        
        state.totalQuantity += quantityDifference;
        state.totalAmount += quantityDifference * existingItem.price;
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
  },
  extraReducers: (builder) => {
        // Get all products
        builder.addCase(getCart.pending, (state) => {
          state.cartItems = []
          state.cartItemLoading = true;
        });
        
        builder.addCase(getCart.fulfilled, (state, action) => {
          state.cartItems = action.payload?.data?.data
          state.cartItemLoading = false;
        });
        
        builder.addCase(getCart.rejected, (state) => {
          state.cartItems = []
          state.cartItemLoading = false;
        });
      },
});

export const {
  addToCart,
  removeFromCart,
  removeItemCompletely,
  updateItemQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;