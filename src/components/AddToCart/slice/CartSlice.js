import { somethingWentWrong } from '@/constants/SchemaValidation';
import { axiosReact } from '@/services/api';
import {
  CART_ADD,
  CART_COUNT,
  CLEAR_CART,
  CREATE_ORDER,
  FETCH_ALL_CART,
  REMOVE_CART,
  UPDATE_CART_QUANTITY,
  VERIFY_PAYMENT,
} from '@/services/url';
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

export const removeCart = createAsyncThunk(
  `cart/removeCart`,
  async (payload, thunkAPI) => { 
    try {
      const response = await axiosReact.delete(REMOVE_CART + `${payload}`); 
      return response; 
    } catch (err) {
      toast.error(err?.response?.data?.error || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const cleaAllCart = createAsyncThunk(
  `cart/clearCart`,
  async (payload, thunkAPI) => { 
    try {
      const response = await axiosReact.delete(CLEAR_CART); 
      return response; 
    } catch (err) {
      toast.error(err?.response?.data?.error || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const getCartCount = createAsyncThunk(
  `cart/getCartCount`,
  async (payload, thunkAPI) => { 
    try {
      const response = await axiosReact.get(CART_COUNT); 
      return response; 
    } catch (err) {
      toast.error(err?.response?.data?.error || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const addCart = createAsyncThunk(
  `cart/addCart`,
  async (payload, thunkAPI) => { 
    try {
      const response = await axiosReact.post(CART_ADD,payload); 
      return response; 
    } catch (err) {
      toast.error(err?.response?.data?.error || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const updateItemQuantity = createAsyncThunk(
  `cart/updateItemQuantity`,
  async ({ id, quantity }, thunkAPI) => {
    try {
      const response = await axiosReact.put(`${UPDATE_CART_QUANTITY}${id}`, {
        quantity,
      });
      return response;
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          somethingWentWrong
      );
      return thunkAPI.rejectWithValue(err?.response?.data);
    }
  }
);

// Create Order
export const createOrder = createAsyncThunk(
  `cart/createOrder`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.post(CREATE_ORDER, payload);
      return response;
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          somethingWentWrong
      );
      return thunkAPI.rejectWithValue(err?.response?.data);
    }
  }
);

// Verify Payment
export const verifyPayment = createAsyncThunk(
  `cart/verifyPayment`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.post(VERIFY_PAYMENT, payload);
      return response;
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          somethingWentWrong
      );
      return thunkAPI.rejectWithValue(err?.response?.data);
    }
  }
);

const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
  cartItems:[],
  cartItemLoading:false,
  cartCount:0,
  cartCountLoading:false,
  orderData: null,
  paymentLoading: false,
  verificationLoading: false,
  paymentSuccess: false,
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
    
    setLocalItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

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
    resetPaymentState: (state) => {
      state.orderData = null;
      state.paymentSuccess = false;
    },
  },
  extraReducers: (builder) => {
        // Get all products
        builder.addCase(getCart.pending, (state) => {
          const hasData =
            state.cartItems &&
            !Array.isArray(state.cartItems) &&
            state.cartItems.items !== undefined;
          if (!hasData) {
            state.cartItemLoading = true;
          }
        });
        
        builder.addCase(getCart.fulfilled, (state, action) => {
          const cart = action.payload?.data?.data;
          state.cartItems = cart;
          state.totalQuantity = Array.isArray(cart?.items)
            ? cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
            : 0;
          state.cartItemLoading = false;
        });

        builder.addCase(getCart.rejected, (state) => {
          state.cartItemLoading = false;
        });

        builder.addCase(removeCart.fulfilled, (state, action) => {
          const cart = action.payload?.data?.data;
          if (cart) {
            state.cartItems = cart;
            state.totalQuantity = Array.isArray(cart?.items)
              ? cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
              : 0;
          }
        });

        builder.addCase(cleaAllCart.fulfilled, (state, action) => {
          const cart = action.payload?.data?.data;
          state.cartItems = cart || { items: [], total: 0, discount: 0 };
          state.totalQuantity = 0;
        });

        builder.addCase(updateItemQuantity.pending, (state) => {
          // Keep cart visible; page disables +/- while request is in flight
        });

        builder.addCase(updateItemQuantity.fulfilled, (state, action) => {
          const cart = action.payload?.data?.data;
          if (cart) {
            state.cartItems = cart;
            state.totalQuantity = Array.isArray(cart?.items)
              ? cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
              : 0;
          }
        });

        builder.addCase(updateItemQuantity.rejected, () => {});

        //cart count
              builder.addCase(getCartCount.pending, (state) => {
                state.cartCount = 0
                state.cartCountLoading = true;
              });
              
              builder.addCase(getCartCount.fulfilled, (state, action) => {
                state.cartCount = action.payload
                state.cartCountLoading = false;
              });
              
              builder.addCase(getCartCount.rejected, (state) => {
                state.cartCount = 0
                state.cartCountLoading = false;
              });

              // Create Order
              builder.addCase(createOrder.pending, (state) => {
                state.paymentLoading = true;
                state.orderData = null;
              });
              
              builder.addCase(createOrder.fulfilled, (state, action) => {
                state.orderData = action.payload?.data;
                state.paymentLoading = false;
              });
              
              builder.addCase(createOrder.rejected, (state) => {
                state.paymentLoading = false;
                state.orderData = null;
              });

              // Verify Payment
              builder.addCase(verifyPayment.pending, (state) => {
                state.verificationLoading = true;
                state.paymentSuccess = false;
              });
              
              builder.addCase(verifyPayment.fulfilled, (state, action) => {
                state.verificationLoading = false;
                state.paymentSuccess = action.payload?.data?.success || false;
              });
              
              builder.addCase(verifyPayment.rejected, (state) => {
                state.verificationLoading = false;
                state.paymentSuccess = false;
              });
      },
});

export const {
  addToCart,
  removeFromCart,
  removeItemCompletely,
  setLocalItemQuantity,
  clearCart,
  resetPaymentState,
} = cartSlice.actions;

export default cartSlice.reducer;