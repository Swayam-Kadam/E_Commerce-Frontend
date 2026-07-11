import { toast } from 'react-toastify';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { somethingWentWrong } from '@/constants/SchemaValidation';
import { axiosReact } from '@/services/api';
import { FETCH_ORDER_BY_ID, FETCH_ORDERS } from '@/services/url';

export const getOrders = createAsyncThunk(
  `order/getOrders`,
  async (_, thunkAPI) => {
    try {
      const response = await axiosReact.get(FETCH_ORDERS);
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

export const getOrderById = createAsyncThunk(
  `order/getOrderById`,
  async (orderId, thunkAPI) => {
    try {
      const response = await axiosReact.get(FETCH_ORDER_BY_ID + `${orderId}`);
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
  orders: [],
  ordersLoading: false,
  ordersCount: 0,
  selectedOrder: null,
  selectedOrderLoading: false,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getOrders.pending, (state) => {
      state.ordersLoading = true;
    });
    builder.addCase(getOrders.fulfilled, (state, action) => {
      const apiData = action.payload?.data;
      state.orders = Array.isArray(apiData?.data) ? apiData.data : [];
      state.ordersCount = apiData?.count || state.orders.length;
      state.ordersLoading = false;
    });
    builder.addCase(getOrders.rejected, (state) => {
      state.ordersLoading = false;
      state.orders = [];
      state.ordersCount = 0;
    });

    builder.addCase(getOrderById.pending, (state) => {
      state.selectedOrderLoading = true;
      state.selectedOrder = null;
    });
    builder.addCase(getOrderById.fulfilled, (state, action) => {
      state.selectedOrder = action.payload?.data?.data || null;
      state.selectedOrderLoading = false;
    });
    builder.addCase(getOrderById.rejected, (state) => {
      state.selectedOrderLoading = false;
      state.selectedOrder = null;
    });
  },
});

export const { clearSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
