import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  books: [],
};

export const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    addBooksReducer: (state, { payload }) => {
      state.books = payload;
    },
  },
});

export const { addBooksReducer } = bookSlice.actions;

export default bookSlice.reducer;
