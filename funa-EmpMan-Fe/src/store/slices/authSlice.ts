import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  admin: {
    id: string;
    username: string;
    email: string;
    fullName: string;
    role: string;
  } | null;
  loading: boolean;
  error: string | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  admin: null,
  loading: false,
  error: null,
  accessToken: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{admin: any, accessToken: string}>) => {
      state.isAuthenticated = true;
      state.admin = action.payload.admin;
      state.accessToken = action.payload.accessToken;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.admin = null;
      state.accessToken = null;
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.admin = null;
      state.accessToken = null;
      state.loading = false;
      state.error = null;
    },
    updateAdmin: (state, action: PayloadAction<any>) => {
      if (state.admin) {
        state.admin = { ...state.admin, ...action.payload };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    }
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateAdmin, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
