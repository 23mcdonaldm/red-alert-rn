import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.userData = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userData = null;
    },
    setRole: (state, action) => {
      state.userData.role = action.payload;
    },
  },
});

export const { login, logout, setRole } = authSlice.actions;
export default authSlice.reducer;
