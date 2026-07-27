import { toast } from "react-toastify";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import { ADDPRODUCT } from "@/services/url";
import { getCategoryName } from "@/utils/category";

const normalizeProduct = (item) => {
  if (!item) return item;
  const categoryValue = item.category;
  return {
    ...item,
    id: item._id || item.id || null,
    category: getCategoryName(categoryValue) || (typeof categoryValue === "string" ? categoryValue : ""),
    categoryId:
      typeof categoryValue === "object" && categoryValue !== null
        ? categoryValue._id || null
        : item.categoryId || null,
  };
};

export const getProduct = createAsyncThunk(
  `home/getProduct`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.get(ADDPRODUCT);
      return response.data;
    } catch (err) {
      toast.error(err?.response?.data?.error || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const getSpecificProduct = createAsyncThunk(
  `home/getSpecificProduct`,
  async (productId, thunkAPI) => {
    try {
      const response = await axiosReact.get(ADDPRODUCT + `${productId}`);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.error || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

const HomeState = {
  productList: [],
  productListLoading: false,
  specificProduct: null,
  specificProductLoading: false,
};

const homeSlice = createSlice({
  name: "home",
  initialState: HomeState,
  reducers: {
    clearSpecificProduct: (state) => {
      state.specificProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProduct.pending, (state) => {
      state.productListLoading = true;
    });

    builder.addCase(getProduct.fulfilled, (state, action) => {
      const apiData = action.payload;
      let products = [];

      if (apiData?.data && Array.isArray(apiData.data)) {
        products = apiData.data;
      } else if (apiData?.data?.data && Array.isArray(apiData.data.data)) {
        products = apiData.data.data;
      } else if (Array.isArray(apiData)) {
        products = apiData;
      }

      state.productList = products.map((item) => normalizeProduct(item));
      state.productListLoading = false;
    });

    builder.addCase(getProduct.rejected, (state) => {
      state.productListLoading = false;
    });

    builder.addCase(getSpecificProduct.pending, (state) => {
      state.specificProduct = null;
      state.specificProductLoading = true;
    });

    builder.addCase(getSpecificProduct.fulfilled, (state, action) => {
      const apiData = action.payload;
      let product = null;

      if (apiData?.data?.data && typeof apiData.data.data === "object" && !Array.isArray(apiData.data.data)) {
        product = apiData.data.data;
      } else if (apiData?.data) {
        product =
          apiData.data?.data && !Array.isArray(apiData.data.data) && !apiData.data._id
            ? apiData.data.data
            : apiData.data;
      } else {
        product = apiData;
      }

      if (product?.success && product?.data && !product?._id) {
        product = product.data;
      }

      if (product) {
        state.specificProduct = normalizeProduct(product);
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
