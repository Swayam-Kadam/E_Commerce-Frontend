import { toast } from "react-toastify";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import { ADD_REVIEW } from "@/services/url";

export const getSpecificProductReview = createAsyncThunk(
  `home/getSpecificProductReview`,
  async (productId, thunkAPI) => { // Rename payload to productId for clarity
    try {
      const response = await axiosReact.get(ADD_REVIEW + `${productId}`); // Add slash if needed
      return response; // Return data only, not full response
    } catch (err) {
      toast.error(err?.response?.data?.error || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const addSpecificProductReview = createAsyncThunk(
  `home/addSpecificProductReview`,
  async (payload, thunkAPI) => { // Rename payload to productId for clarity
    try {
      const response = await axiosReact.post(ADD_REVIEW + `${payload.id}`,payload); // Add slash if needed
      return response; // Return data only, not full response
    } catch (err) {
      toast.error(err?.response?.data?.error || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

const SpecificProductState = {
  specificProductReview: [], // Changed from array to null and fixed typo
  specificProductReviewLoading: false,
};

const SpecificProductSlice = createSlice({
  name: "specificProduct",
  initialState: SpecificProductState,
  reducers: {
  },
  extraReducers: (builder) => {
    // Get all products
    builder.addCase(getSpecificProductReview.pending, (state) => {
      state.specificProductReview = []
      state.productListLoading = true;
    });
    
    builder.addCase(getSpecificProductReview.fulfilled, (state, action) => {
      state.specificProductReview = action.payload
      state.productListLoading = false;
    });
    
    builder.addCase(getSpecificProductReview.rejected, (state) => {
      state.specificProductReview = []
      state.productListLoading = false;
    });

  },
});

export const {  } = SpecificProductSlice.actions;
export default SpecificProductSlice.reducer;