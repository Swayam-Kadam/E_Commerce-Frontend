import { toast } from "react-toastify";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import { ADDPRODUCT, FETCH_CATEGORIES } from "@/services/url";
import { getCategoryName } from "@/utils/category";
import { PRODUCT_PAGE_SIZE } from "@/constants/pagination";

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

const buildProductQueryParams = (params = {}) => {
  const {
    page = 1,
    limit = PRODUCT_PAGE_SIZE,
    category,
    search,
    minPrice,
    maxPrice,
    rating,
    inStock,
    isBestSeller,
    sort,
  } = params;

  const query = new URLSearchParams();
  query.set("page", String(page));
  query.set("limit", String(limit));

  if (category && category !== "All") {
    query.set("category", category);
  }
  if (search) {
    query.set("search", search);
  }
  if (minPrice != null && Number(minPrice) > 0) {
    query.set("minPrice", String(minPrice));
  }
  if (maxPrice != null && Number(maxPrice) < 10000) {
    query.set("maxPrice", String(maxPrice));
  }
  if (rating != null && Number(rating) > 0) {
    query.set("rating", String(rating));
  }
  if (inStock === true || inStock === "true") {
    query.set("inStock", "true");
  }
  if (isBestSeller === true || isBestSeller === "true") {
    query.set("isBestSeller", "true");
  }
  if (sort) {
    query.set("sort", sort);
  }

  return query.toString();
};

export const buildProductQueryKey = (params = {}) =>
  JSON.stringify({
    category: params.category && params.category !== "All" ? params.category : "",
    search: params.search || "",
    minPrice: params.minPrice ?? 0,
    maxPrice: params.maxPrice ?? 10000,
    rating: params.rating ?? 0,
    inStock: Boolean(params.inStock),
    isBestSeller: Boolean(params.isBestSeller),
    sort: params.sort || "",
  });

/** Paginated storefront catalog — use instead of getProduct on home/category pages */
export const fetchProductsPage = createAsyncThunk(
  "home/fetchProductsPage",
  async (params, thunkAPI) => {
    try {
      const qs = buildProductQueryParams(params);
      const response = await axiosReact.get(`${ADDPRODUCT}?${qs}`);
      return {
        ...response.data,
        append: Boolean(params.append),
        queryKey: params.queryKey,
        requestedPage: params.page || 1,
      };
    } catch (err) {
      toast.error(err?.response?.data?.error || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "home/fetchCategories",
  async (_, thunkAPI) => {
    try {
      const response = await axiosReact.get(FETCH_CATEGORIES);
      return response.data;
    } catch (err) {
      toast.error(err?.response?.data?.error || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);

/** Full catalog — admin only; storefront should use fetchProductsPage */
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
  productListLoadingMore: false,
  pagination: { page: 0, pages: 0, total: 0, limit: PRODUCT_PAGE_SIZE },
  hasMoreProducts: false,
  productQueryKey: "",
  categories: [],
  categoriesLoading: false,
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
    resetProductList: (state) => {
      state.productList = [];
      state.pagination = { page: 0, pages: 0, total: 0, limit: PRODUCT_PAGE_SIZE };
      state.hasMoreProducts = false;
      state.productQueryKey = "";
    },
    updateProductInteraction: (state, action) => {
      const { productId, isWishlist, cartInfo } = action.payload;
      const index = state.productList.findIndex(
        (p) => p._id === productId || p.id === productId
      );
      if (index === -1) return;

      if (typeof isWishlist === "boolean") {
        state.productList[index].isWishlist = isWishlist;
      }
      if (cartInfo !== undefined) {
        state.productList[index].cartInfo = cartInfo;
      }
    },
    updateSpecificProductInteraction: (state, action) => {
      if (!state.specificProduct) return;
      const { isWishlist, cartInfo } = action.payload;
      if (typeof isWishlist === "boolean") {
        state.specificProduct.isWishlist = isWishlist;
      }
      if (cartInfo !== undefined) {
        state.specificProduct.cartInfo = cartInfo;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProductsPage.pending, (state, action) => {
      const append = action.meta.arg?.append;
      if (append) {
        state.productListLoadingMore = true;
      } else if (state.productList.length === 0) {
        state.productListLoading = true;
      }
    });

    builder.addCase(fetchProductsPage.fulfilled, (state, action) => {
      const { append, queryKey, requestedPage } = action.meta.arg || {};
      const apiData = action.payload;
      const products = Array.isArray(apiData?.data) ? apiData.data : [];
      const normalized = products.map((item) => normalizeProduct(item));
      const pagination = apiData?.pagination || {};

      if (append && queryKey === state.productQueryKey) {
        const existingIds = new Set(
          state.productList.map((p) => String(p._id || p.id))
        );
        normalized.forEach((item) => {
          const id = String(item._id || item.id);
          if (!existingIds.has(id)) {
            state.productList.push(item);
            existingIds.add(id);
          }
        });
      } else {
        state.productList = normalized;
        state.productQueryKey = queryKey || "";
      }

      state.pagination = {
        page: pagination.page ?? requestedPage ?? 1,
        pages: pagination.pages ?? 1,
        total: pagination.total ?? normalized.length,
        limit: pagination.limit ?? PRODUCT_PAGE_SIZE,
      };
      state.hasMoreProducts =
        state.pagination.page < state.pagination.pages;
      state.productListLoading = false;
      state.productListLoadingMore = false;
    });

    builder.addCase(fetchProductsPage.rejected, (state) => {
      state.productListLoading = false;
      state.productListLoadingMore = false;
    });

    builder.addCase(fetchCategories.pending, (state) => {
      if (!state.categories.length) {
        state.categoriesLoading = true;
      }
    });

    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.categories = action.payload?.data || [];
      state.categoriesLoading = false;
    });

    builder.addCase(fetchCategories.rejected, (state) => {
      state.categoriesLoading = false;
    });

    builder.addCase(getProduct.pending, (state) => {
      if (state.productList.length === 0) {
        state.productListLoading = true;
      }
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

export const {
  clearSpecificProduct,
  resetProductList,
  updateProductInteraction,
  updateSpecificProductInteraction,
} = homeSlice.actions;
export default homeSlice.reducer;
