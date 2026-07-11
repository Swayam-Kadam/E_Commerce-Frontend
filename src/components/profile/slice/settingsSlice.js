import { toast } from 'react-toastify';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { somethingWentWrong } from '@/constants/SchemaValidation';
import { axiosReact } from '@/services/api';
import {
  CHANGE_PASSWORD,
  DELETE_ACCOUNT,
  FETCH_SETTINGS,
  UPDATE_NOTIFICATIONS,
} from '@/services/url';

const defaultNotifications = {
  email: true,
  sms: true,
  promotional: true,
  orderUpdates: true,
};

export const getSettings = createAsyncThunk(
  `settings/getSettings`,
  async (_, thunkAPI) => {
    try {
      const response = await axiosReact.get(FETCH_SETTINGS);
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

export const updateNotifications = createAsyncThunk(
  `settings/updateNotifications`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.put(UPDATE_NOTIFICATIONS, payload);
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

export const changePassword = createAsyncThunk(
  `settings/changePassword`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.put(CHANGE_PASSWORD, payload);
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

export const deleteAccount = createAsyncThunk(
  `settings/deleteAccount`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.delete(DELETE_ACCOUNT, { data: payload });
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
  notifications: defaultNotifications,
  settingsLoading: false,
  notificationsUpdating: false,
  passwordUpdating: false,
  accountDeleting: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    resetSettingsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getSettings.pending, (state) => {
      state.settingsLoading = true;
    });
    builder.addCase(getSettings.fulfilled, (state, action) => {
      state.settingsLoading = false;
      state.notifications = {
        ...defaultNotifications,
        ...(action.payload?.data?.data?.notifications || {}),
      };
    });
    builder.addCase(getSettings.rejected, (state) => {
      state.settingsLoading = false;
    });

    builder.addCase(updateNotifications.pending, (state) => {
      state.notificationsUpdating = true;
    });
    builder.addCase(updateNotifications.fulfilled, (state, action) => {
      state.notificationsUpdating = false;
      state.notifications = {
        ...defaultNotifications,
        ...(action.payload?.data?.data?.notifications || {}),
      };
    });
    builder.addCase(updateNotifications.rejected, (state) => {
      state.notificationsUpdating = false;
    });

    builder.addCase(changePassword.pending, (state) => {
      state.passwordUpdating = true;
    });
    builder.addCase(changePassword.fulfilled, (state) => {
      state.passwordUpdating = false;
    });
    builder.addCase(changePassword.rejected, (state) => {
      state.passwordUpdating = false;
    });

    builder.addCase(deleteAccount.pending, (state) => {
      state.accountDeleting = true;
    });
    builder.addCase(deleteAccount.fulfilled, (state) => {
      state.accountDeleting = false;
    });
    builder.addCase(deleteAccount.rejected, (state) => {
      state.accountDeleting = false;
    });
  },
});

export const { resetSettingsState } = settingsSlice.actions;
export default settingsSlice.reducer;
