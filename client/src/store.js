import { configureStore } from "@reduxjs/toolkit";
import selectedEntrySlice from "./features/selectedEntrySlice";
const store = configureStore({
  reducer: {
    selectedEntry: selectedEntrySlice,
  },
});

export default store;
