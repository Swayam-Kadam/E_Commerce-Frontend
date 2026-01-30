import { toast } from "react-toastify";
import Cookies, { cookieKeys } from "@/services/cookies";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { somethingWentWrong } from "@/constants/SchemaValidation";
import { axiosReact } from "@/services/api";
import {
  GET_USER_PROFILE,
  LOGIN,
  SIGNUP,
  REFRESH_TOKEN, // Add this import
  VALIDATE_TOKEN, // Add this import
  LOGOUT // Add this import
} from "@/services/url";

// Get tokens from cookies
const token = Cookies.get(cookieKeys?.TOKEN);
const refreshToken = Cookies.get(cookieKeys?.REFRESH_TOKEN); // Add refresh token
const user = Cookies.get(cookieKeys?.USER);

// Check if authenticated based on access token
const isAuthenticated = !!token;

// Async thunk for refreshing token
export const refreshAccessToken = createAsyncThunk(
  `authentication/refreshAccessToken`,
  async (_, thunkAPI) => {
    try {
      const currentRefreshToken = Cookies.get(cookieKeys?.REFRESH_TOKEN);
      
      if (!currentRefreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await axiosReact.post(REFRESH_TOKEN, {
        refreshToken: currentRefreshToken
      });
      
      if (response?.data?.success) {
        // Save new tokens to cookies
        Cookies.set(cookieKeys?.TOKEN, response.data.tokens.accessToken);
        Cookies.set(cookieKeys?.REFRESH_TOKEN, response.data.tokens.refreshToken);
        
        return response.data;
      }
      
      throw new Error(response?.data?.message || 'Failed to refresh token');
    } catch (err) {
      // If refresh fails, clear all tokens
      Cookies.remove(cookieKeys?.TOKEN);
      Cookies.remove(cookieKeys?.REFRESH_TOKEN);
      Cookies.remove(cookieKeys?.USER);
      
      toast.error('Session expired. Please login again.');
      return thunkAPI.rejectWithValue(err?.response?.data?.message || 'Refresh failed');
    }
  }
);

// Login thunk - Updated for new API response
export const getLogin = createAsyncThunk(
  `authentication/LoginThunk`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.post(LOGIN, payload);
      
      if (response?.data?.success) {
        // Save both tokens and user to cookies
        Cookies.set(cookieKeys?.TOKEN, response.data.tokens.accessToken);
        Cookies.set(cookieKeys?.REFRESH_TOKEN, response.data.tokens.refreshToken);
        Cookies.set(cookieKeys?.USER, response.data.user);
        
        return response.data;
      }
      
      // Handle non-success responses
      toast.error(response?.data?.message || 'Login failed');
      return thunkAPI.rejectWithValue(response?.data?.message);
      
    } catch (err) {
      toast.error(err?.response?.data?.message || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.message);
    }
  }
);

// Signup thunk - Updated for new API response
export const postSignup = createAsyncThunk(
  `authentication/postSignup`,
  async (payload, thunkAPI) => {
    try {
      const response = await axiosReact.post(SIGNUP, payload);
      
      if (response?.data?.success) {
        // Save tokens and user from signup response
        Cookies.set(cookieKeys?.TOKEN, response.data.tokens.accessToken);
        Cookies.set(cookieKeys?.REFRESH_TOKEN, response.data.tokens.refreshToken);
        Cookies.set(cookieKeys?.USER, response.data.user);
        
        toast.success(response.data.message);
        return response.data;
      }
      
      toast.error(response?.data?.message || 'Signup failed');
      return thunkAPI.rejectWithValue(response?.data?.message);
      
    } catch (err) {
      toast.error(err?.response?.data?.message || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.message);
    }
  }
);

// Get user profile
export const getUserProfile = createAsyncThunk(
  `authentication/getUserProfile`,
  async (_, thunkAPI) => {
    try {
      const response = await axiosReact.get(GET_USER_PROFILE);
      
      if (response?.data?.success) {
        return response.data;
      }
      
      throw new Error(response?.data?.message || 'Failed to get profile');
      
    } catch (err) {
      // If unauthorized, try to refresh token
      if (err.response?.status === 401) {
        const refreshResult = await thunkAPI.dispatch(refreshAccessToken());
        
        if (refreshAccessToken.fulfilled.match(refreshResult)) {
          // Retry profile request after refresh
          const retryResponse = await axiosReact.get(GET_USER_PROFILE);
          if (retryResponse?.data?.success) {
            return retryResponse.data;
          }
        }
      }
      
      toast.error(err?.response?.data?.message || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.message);
    }
  }
);

// Update User Profile
export const updateUserProfile = createAsyncThunk(
  `home/updateUserProfile`,
  async (payload, thunkAPI) => { 
    try {
      const response = await axiosReact.put(GET_USER_PROFILE , payload); 
      return response; // Return data only, not full response
    } catch (err) {
      toast.error(err?.response?.data?.error || somethingWentWrong);
      return thunkAPI.rejectWithValue(err?.response?.data?.statusCode);
    }
  }
);


// Logout thunk
export const postLogout = createAsyncThunk(
  `authentication/postLogout`,
  async (_, thunkAPI) => {
    try {
      const refreshToken = Cookies.get(cookieKeys?.REFRESH_TOKEN);
      
      if (refreshToken) {
        await axiosReact.post(LOGOUT, { refreshToken });
      }
      
      // Clear all cookies regardless of API call success
      Cookies.remove(cookieKeys?.TOKEN);
      Cookies.remove(cookieKeys?.REFRESH_TOKEN);
      Cookies.remove(cookieKeys?.USER);
      
      return { success: true };
      
    } catch (err) {
      // Even if API call fails, clear local tokens
      Cookies.remove(cookieKeys?.TOKEN);
      Cookies.remove(cookieKeys?.REFRESH_TOKEN);
      Cookies.remove(cookieKeys?.USER);
      
      return { success: true }; // Still consider logout successful locally
    }
  }
);

// Validate token thunk
export const validateToken = createAsyncThunk(
  `authentication/validateToken`,
  async (_, thunkAPI) => {
    try {
      const token = Cookies.get(cookieKeys?.TOKEN);
      
      if (!token) {
        return { valid: false };
      }
      
      const response = await axiosReact.post(VALIDATE_TOKEN, {
        accessToken: token
      });
      
      return {
        valid: response.data.success,
        user: response.data.user
      };
      
    } catch (err) {
      return { valid: false };
    }
  }
);



// In loginState initialization
const loginState = {
  token: token || "",
  refreshToken: refreshToken || "",
  pageLoader: false,
  // Properly parse the user from cookies if it's a JSON string
  userDetail: user ? (typeof user === 'string' ? JSON.parse(user) : user) : null,
  userProfile: null,
  userProfileLoading: false,
  userProfileFetched: false,
  isAuth: isAuthenticated,
  loading: false,
  refreshingToken: false,
  lastTokenRefresh: null,
};

const loginSlice = createSlice({
  name: "login",
  initialState: loginState,
  reducers: {
    setPageLoader: (state, action) => {
      state.pageLoader = action.payload;
    },
    logout: (state) => {
      state.isAuth = false;
      state.token = "";
      state.refreshToken = "";
      state.pageLoader = false;
      state.userDetail = null;
      state.userProfile = null;
      state.lastTokenRefresh = null;

      // Clear all auth cookies
      Cookies.remove(cookieKeys?.TOKEN);
      Cookies.remove(cookieKeys?.REFRESH_TOKEN);
      Cookies.remove(cookieKeys?.USER);
    },
    // Add action to update tokens (e.g., after successful refresh)
    updateTokens: (state, action) => {
      const { accessToken, refreshToken } = action.payload;
      if (accessToken) {
        state.token = accessToken;
        Cookies.set(cookieKeys?.TOKEN, accessToken);
      }
      if (refreshToken) {
        state.refreshToken = refreshToken;
        Cookies.set(cookieKeys?.REFRESH_TOKEN, refreshToken);
      }
      state.lastTokenRefresh = Date.now();
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(getLogin.pending, (state) => {
      state.loading = true;
      state.isAuth = false;
    });
    builder.addCase(getLogin.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuth = true;
      state.userDetail = action.payload.user;
      state.token = action.payload.tokens.accessToken;
      state.refreshToken = action.payload.tokens.refreshToken;
      state.lastTokenRefresh = Date.now();
    });
    builder.addCase(getLogin.rejected, (state) => {
      state.loading = false;
      state.isAuth = false;
      state.token = "";
      state.refreshToken = "";
    });

    // Signup
    builder.addCase(postSignup.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(postSignup.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuth = true;
      state.userDetail = action.payload.user;
      state.token = action.payload.tokens.accessToken;
      state.refreshToken = action.payload.tokens.refreshToken;
      state.lastTokenRefresh = Date.now();
    });
    builder.addCase(postSignup.rejected, (state) => {
      state.loading = false;
    });

    // Refresh token
    builder.addCase(refreshAccessToken.pending, (state) => {
      state.refreshingToken = true;
    });
    builder.addCase(refreshAccessToken.fulfilled, (state, action) => {
      state.refreshingToken = false;
      state.token = action.payload.tokens.accessToken;
      state.refreshToken = action.payload.tokens.refreshToken;
      state.lastTokenRefresh = Date.now();
      state.isAuth = true;
    });
    builder.addCase(refreshAccessToken.rejected, (state) => {
      state.refreshingToken = false;
      state.isAuth = false;
      state.token = "";
      state.refreshToken = "";
      state.userDetail = null;
    });

    // Get user profile
    builder.addCase(getUserProfile.pending, (state) => {
      state.userProfile = null;
      state.userProfileLoading = true;
      
    });
    builder.addCase(getUserProfile.fulfilled, (state, action) => {
      state.userProfile = action.payload.user;
      state.userProfileLoading = false;
      state.userProfileFetched = true;
    });
    builder.addCase(getUserProfile.rejected, (state) => {
      state.userProfile = null;
      state.userProfileLoading = false;
       state.userProfileFetched = true;
    });

    // Logout
    builder.addCase(postLogout.fulfilled, (state) => {
      state.isAuth = false;
      state.token = "";
      state.refreshToken = "";
      state.userDetail = null;
      state.userProfile = null;
      state.lastTokenRefresh = null;
    });

    // Validate token
    builder.addCase(validateToken.fulfilled, (state, action) => {
      if (!action.payload.valid) {
        state.isAuth = false;
        state.token = "";
        state.refreshToken = "";
      } else if (action.payload.user) {
        state.userDetail = action.payload.user;
      }
    });
  },
});

export const { setPageLoader, logout, updateTokens } = loginSlice.actions;
export default loginSlice.reducer;