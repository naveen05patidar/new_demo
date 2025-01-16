import { configureStore } from "@reduxjs/toolkit";
import dataSlice from "./dataSlice";


const store = configureStore({
    reducer: {
      dataSlice: dataSlice,
    },
  });

export default store;
