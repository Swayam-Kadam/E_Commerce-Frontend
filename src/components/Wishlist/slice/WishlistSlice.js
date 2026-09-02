import { toast } from "react-toastify";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import { FETCH_ALL_WHISHLIST, TOGGLE_WHISHLIST, WHISHLIST_CLEAR, WHISHLIST_COUNT } from "@/services/url";

export const getAllWhishlist = createAsyncThunk(
  `whishlist/getAllWhishlist`,
  async (payload, thunkAPI) => { 
    try {
      const response = await axiosReact.get(FETCH_ALL_WHISHLIST); 
      return response; 
    } catch (err) {
      toast.error(err?.response?.data?.error || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const toggleWhishlist = createAsyncThunk(
  `whishlist/toggleWhishlist`,
  async (payload, thunkAPI) => { 
    try {
      const response = await axiosReact.post(TOGGLE_WHISHLIST,payload); 
      return response; 
    } catch (err) {
      toast.error(err?.response?.data?.error || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const getWhishlistCount = createAsyncThunk(
  `whishlist/getWhishlistCount`,
  async (payload, thunkAPI) => { 
    try {
      const response = await axiosReact.get(WHISHLIST_COUNT); 
      return response; 
    } catch (err) {
      toast.error(err?.response?.data?.error || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const clearWhishlist = createAsyncThunk(
  `whishlist/clearWhishlist`,
  async (payload, thunkAPI) => { 
    try {
      const response = await axiosReact.delete(WHISHLIST_CLEAR); 
      return response; 
    } catch (err) {
      toast.error(err?.response?.data?.error || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

const initialState = {
  items: [],
  totalWishlistQuantity: 0,
  allWhishlistData:[],
  allWhishlistLoading: false,
  whishlistCount:0,
  whishlistCountLoading:false,
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
      state.totalWishlistQuantity = 0;
    },
    removeWishlistProductFromList: (state, action) => {
      const productId = action.payload;
      const products = state.allWhishlistData?.data?.data?.products;
      if (!Array.isArray(products)) return;
      state.allWhishlistData.data.data.products = products.filter(
        (p) => p._id !== productId && p.id !== productId
      );
    },
    clearWishlistProductsList: (state) => {
      if (state.allWhishlistData?.data?.data) {
        state.allWhishlistData.data.data.products = [];
      }
    },
  },
  extraReducers: (builder) => {
      // Get all products
      builder.addCase(getAllWhishlist.pending, (state) => {
        const hasData = state.allWhishlistData?.data?.data !== undefined;
        if (!hasData) {
          state.allWhishlistLoading = true;
        }
      });
      
      builder.addCase(getAllWhishlist.fulfilled, (state, action) => {
        state.allWhishlistData = action.payload
        state.allWhishlistLoading = false;
      });
      
      builder.addCase(getAllWhishlist.rejected, (state) => {
        state.allWhishlistLoading = false;
      });

      builder.addCase(clearWhishlist.fulfilled, (state) => {
        if (state.allWhishlistData?.data?.data) {
          state.allWhishlistData.data.data.products = [];
        }
      });

      //whishlist count
      builder.addCase(getWhishlistCount.pending, (state) => {
        state.whishlistCount = 0
        state.whishlistCountLoading = true;
      });
      
      builder.addCase(getWhishlistCount.fulfilled, (state, action) => {
        state.whishlistCount = action.payload
        state.whishlistCountLoading = false;
      });
      
      builder.addCase(getWhishlistCount.rejected, (state) => {
        state.whishlistCount = 0
        state.whishlistCountLoading = false;
      });
  
    },
});

export const {
  addToWishlist,
  removeFromWishlist,
  moveToCart,
  clearWishlist,
  removeWishlistProductFromList,
  clearWishlistProductsList,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;