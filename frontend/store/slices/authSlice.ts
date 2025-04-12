import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserDataType, InitialStateType } from "@/types/auth";
import { Role } from "@/types/navigation";

const initialState: InitialStateType = {
  userData: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserDataType>) => {
      state.isAuthenticated = true;
      state.userData = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userData = null;
    },
    setRole: (state, action: PayloadAction<Role>) => {
      if (!state.userData) {
        throw new Error("User data is not available");
      }
      state.userData.role = action.payload;
    },
  },
});

export const { login, logout, setRole } = authSlice.actions;
export default authSlice.reducer;
