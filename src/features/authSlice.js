import { createSlice } from "@reduxjs/toolkit";

const auth =
  localStorage.getItem("auth") !== null
    ? JSON.parse(localStorage.getItem("auth"))
    : {};
const initialState = {
  auth: auth || {},
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authReducer: (state, { payload }) => {
      delete payload.message;
      state.auth = payload;
      localStorage.setItem("auth", JSON.stringify(payload));
    },
    logoutReducer: (state, action) => {
      localStorage.clear();
      state.auth = {};
    },
  },
});

export const { authReducer, logoutReducer } = authSlice.actions;

export default authSlice.reducer;
