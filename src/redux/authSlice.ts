"use client";
import { ROLES } from "@/utils/constants";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
export interface AuthState {
  email?: string;
  name?: string;
  authToken?: string;
  role?: string;
  imageUrl?: string;
  refreshToken?: string;
  accessToken?: string;
  isLogged?: boolean;
  isReload?: boolean;
}
const initialState: AuthState = {
  email: "",
  name: "",
  role: "",
  imageUrl: "",
  refreshToken: "",
  accessToken: "",
  isLogged: false,
  isReload: false,
};
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateAuth: (state, action: PayloadAction<AuthState>) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.role = action.payload.role;
      state.imageUrl = action.payload.imageUrl;
      state.refreshToken = action.payload.refreshToken;
      state.accessToken = action.payload.accessToken;
      state.isLogged = action.payload.isLogged;
      state.isReload = action.payload.isReload;
    },
    updateLogin: (state, action: PayloadAction<AuthState>) => {
      state.isLogged = action.payload.isLogged;
      state.isReload = action.payload.isReload;
    },
    updateAuthTokens: (state, action: PayloadAction<AuthState>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    clearAuth: (state) => {
      state.email = "";
      state.name = "";
      state.role = "";
      state.imageUrl = "";
      state.refreshToken = "";
      state.accessToken = "";
      state.isLogged = false;
      state.isReload = false;
    },
    updateReload: (state, action: PayloadAction<AuthState>) => {
      state.email = "";
      state.name = "";
      state.role = "";
      state.imageUrl = "";
      state.refreshToken = "";
      state.accessToken = "";
      state.isLogged = false;
      state.isReload = action.payload.isReload;
    },
  },
});
export const { updateAuth, updateLogin, clearAuth, updateAuthTokens, updateReload } = authSlice.actions;
export default authSlice.reducer;
