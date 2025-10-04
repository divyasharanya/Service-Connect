import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // { id, name, role: 'customer' | 'technician' | 'admin' }
  token: null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    logout(state) {
      state.user = null;
      state.token = null;
    },
    setAuthStatus(state, action) {
      state.status = action.payload;
    },
    setAuthError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { loginSuccess, logout, setAuthStatus, setAuthError } = authSlice.actions;
export default authSlice.reducer;