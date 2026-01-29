import { toast } from "react-toastify";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import { ADDPRODUCT } from "@/services/url";

export const getProduct = createAsyncThunk(
  `home/getProduct`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(ADDPRODUCT);
      return response.data; // Return data only
    } catch (err) {
      toast.error(err?.response?.data?.error || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const getSpecificProduct = createAsyncThunk(
  `home/getSpecificProduct`,
  async (productId, thunkAPI) => { // Rename payload to productId for clarity
    try {
      const response = await axiosReact.get(ADDPRODUCT + `${productId}`); // Add slash if needed
      return response; // Return data only, not full response
    } catch (err) {
      toast.error(err?.response?.data?.error || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

const HomeState = {
  productList: [],
  productListLoading: false,
  specificProduct: null, // Changed from array to null and fixed typo
  specificProductLoading: false,
};

const homeSlice = createSlice({
  name: "home",
  initialState: HomeState,
  reducers: {
    clearSpecificProduct: (state) => {
      state.specificProduct = null;
    }
  },
  extraReducers: (builder) => {
    // Get all products
    builder.addCase(getProduct.pending, (state) => {
      state.productListLoading = true;
    });
    
    builder.addCase(getProduct.fulfilled, (state, action) => {
      // Assuming your API returns { data: [...] } structure
      const apiData = action.payload;
      
      let products = [];
      
      if (apiData?.data && Array.isArray(apiData.data)) {
        products = apiData.data;
      } else if (apiData?.data?.data && Array.isArray(apiData.data.data)) {
        products = apiData.data.data;
      } else if (Array.isArray(apiData)) {
        products = apiData;
      }
      
      state.productList = products.map((item) => ({
        ...item,
        id: item._id || null,
      }));
      
      state.productListLoading = false;
    });
    
    builder.addCase(getProduct.rejected, (state) => {
      state.productListLoading = false;
    });

    // Get specific product
    builder.addCase(getSpecificProduct.pending, (state) => {
      state.specificProduct = null; // Reset to null
      state.specificProductLoading = true;
    });
    
    builder.addCase(getSpecificProduct.fulfilled, (state, action) => {
      // The API should return a single product object
      const apiData = action.payload;
      
      let product = null;
      
      // Handle different response structures
      if (apiData?.data) {
        // Structure: { data: { ...product } }
        product = apiData.data;
      } else if (apiData?.data?.data) {
        // Structure: { data: { data: { ...product } } }
        product = apiData.data.data;
      } else {
        // Structure: directly the product object
        product = apiData;
      }
      
      // If product exists, add id field for compatibility
      if (product) {
        state.specificProduct = {
          ...product,
          id: product._id || null,
        };
      } else {
        state.specificProduct = null;
      }
      
      state.specificProductLoading = false;
    });
    
    builder.addCase(getSpecificProduct.rejected, (state) => {
      state.specificProduct = null;
      state.specificProductLoading = false;
    });
  },
});

export const { clearSpecificProduct } = homeSlice.actions;
export default homeSlice.reducer;