import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import booksReducer from "../features/bookSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    books: booksReducer,
  },
});
