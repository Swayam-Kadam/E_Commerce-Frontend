import { toast } from "react-toastify";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import {
  ADDPRODUCT,
  FETCH_ALL_REVIEW,
} from "@/services/url";

export const addProduct = createAsyncThunk(
  `admin/addProduct`,
  async (payload, thunkAPI) => {
    try {
      const formData = new FormData();

      Object.keys(payload).forEach((key) => {
        if (payload[key] !== null && payload[key] !== undefined) {
          formData.append(key, payload[key]);
        }
      });

      const response = await axiosReact.post(ADDPRODUCT, formData);
      return response.data; // Return data instead of full response
    } catch (err) {
      toast.error(err?.response?.data?.error || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const getProduct = createAsyncThunk(
  `admin/getProduct`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(ADDPRODUCT);
      return response.data; // Return data instead of full response
    } catch (err) {
      toast.error(err?.response?.data?.error || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const getSpecificProduct = createAsyncThunk(
  `admin/getSpecificProduct`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(ADDPRODUCT + `${payload}`);
      return response; // Return data instead of full response
    } catch (err) {
      toast.error(err?.response?.data?.error || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const EditProduct = createAsyncThunk(
  `admin/EditProduct`,
  async (payload, thunkAPI) => {
    try {
      
      // Check if payload is FormData
      if (payload instanceof FormData) {
        const id = payload.get('id');
        if (!id) {
          throw new Error('Product ID is missing in FormData');
        }
        
        const response = await axiosReact.put(ADDPRODUCT + id, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } else {
        // Handle plain object payload (backward compatibility)
        const response = await axiosReact.put(ADDPRODUCT + payload.id, payload);
        return response.data;
      }
    } catch (err) {
      toast.error(err?.response?.data?.error || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const getAllReview = createAsyncThunk(
  `admin/getAllReview`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(FETCH_ALL_REVIEW);
      return response; // Return data instead of full response
    } catch (err) {
      toast.error(err?.response?.data?.error || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

const AdminState = {
  productList: [],
  productListLoading: false,
  specifcProduct:[],
  specificProductLoading:false,
  reviewList: [],
  reviewLoadingList:false,
};

const adminSlice = createSlice({
  name: "admin",
  initialState: AdminState,
  reducers: {
    // Add a reducer to clear product list
    clearProductList: (state) => {
      state.productList = [];
    },
    // Add a reducer to update a specific product
    updateProduct: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.productList.findIndex(product => product._id === id);
      if (index !== -1) {
        state.productList[index] = { ...state.productList[index], ...updatedData };
      }
    },
    // Add a reducer to delete a product
    deleteProduct: (state, action) => {
      const id = action.payload;
      state.productList = state.productList.filter(product => product._id !== id);
    }
  },
  extraReducers: (builder) => {
    // Get Product Detail
    builder.addCase(getProduct.pending, (state) => {
      state.productList = [];
      state.productListLoading = true;
    });
    
    builder.addCase(getProduct.fulfilled, (state, action) => {
      // Access the data correctly based on your API response
      const apiData = action.payload;
      
      // Check different possible response structures
      let products = [];
      
      if (apiData?.data?.data && Array.isArray(apiData.data.data)) {
        // Structure: { data: { data: [...] } }
        products = apiData.data.data;
      } else if (apiData?.data && Array.isArray(apiData.data)) {
        // Structure: { data: [...] }
        products = apiData.data;
      } else if (Array.isArray(apiData)) {
        // Structure: [...]
        products = apiData;
      }
      
      // Transform products to include id property (using _id)
      state.productList = products.map((item) => ({
        ...item,
        id: item?._id || null, // Use _id as id for consistency
        // If you want colors as a string instead of array
        colors: item?.variants?.[0]?.color ? 
          item.variants[0].color.join(', ') : 
          null
      }));
      
      state.productListLoading = false;
    });
    
    builder.addCase(getProduct.rejected, (state) => {
      state.productList = [];
      state.productListLoading = false;
    });



     // Get Specific Product Detail
    builder.addCase(getSpecificProduct.pending, (state) => {
      state.specifcProduct = [];
      state.specificProductLoading = true;
    });
    
    builder.addCase(getSpecificProduct.fulfilled, (state, action) => {
      // Access the data correctly based on your API response
      const apiData = action.payload;
      
      // Check different possible response structures
      let products = [];
      
      if (apiData?.data?.data && Array.isArray(apiData.data.data)) {
        // Structure: { data: { data: [...] } }
        products = apiData.data.data;
      } else if (apiData?.data && Array.isArray(apiData.data)) {
        // Structure: { data: [...] }
        products = apiData.data;
      } else if (Array.isArray(apiData)) {
        // Structure: [...]
        products = apiData;
      }
      
      // Transform products to include id property (using _id)
      state.specifcProduct = products.map((item) => ({
        ...item,
        id: item?._id || null, // Use _id as id for consistency
        // If you want colors as a string instead of array
        colors: item?.variants?.[0]?.color ? 
          item.variants[0].color.join(', ') : 
          null
      }));
      
      state.specificProductLoading = false;
    });
    
    builder.addCase(getSpecificProduct.rejected, (state) => {
      state.specifcProduct = [];
      state.specificProductLoading = false;
    });

     // Get Review Detail
    builder.addCase(getAllReview.pending, (state) => {
      state.reviewList = [];
      state.reviewLoadingList = true;
    });
    
    builder.addCase(getAllReview.fulfilled, (state, action) => {
      
      state.reviewList = action.payload;
      state.reviewLoadingList = false;
    });
    
    builder.addCase(getAllReview.rejected, (state) => {
      state.reviewList = [];
      state.reviewLoadingList = false;
    });
  },
});

export const { clearProductList, updateProduct, deleteProduct } = adminSlice.actions;
export default adminSlice.reducer;