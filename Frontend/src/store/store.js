import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import fileReducer from "./fileSlice"
import folderReducer from "./folderSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    file:fileReducer,
    folder: folderReducer,
  },
});

export default store;