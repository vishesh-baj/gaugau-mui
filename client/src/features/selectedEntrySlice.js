import { createSlice } from "@reduxjs/toolkit";

let initialState = {};

const selectedEntrySlice = createSlice({
  name: "selected-entry",
  initialState,
  reducers: {
    selectedEntry: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

export const { selectedEntry } = selectedEntrySlice.actions;

export default selectedEntrySlice.reducer;
