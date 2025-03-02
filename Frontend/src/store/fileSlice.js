import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    files: [],
};

const fileSlice = createSlice({
    name: "file",
    initialState,
    reducers: {
        setFiles: (state, action) => {
            console.log("Setting files in Redux:", action.payload); // ✅ Debug Redux update
            state.files = Array.isArray(action.payload) ? action.payload : []; // ✅ Ensure Redux always stores an array
        },
        addFile: (state, action) => {
            state.files.push(action.payload);
        },
        removeFile: (state, action) => {
            state.files = state.files.filter(file => file._id !== action.payload);
        },
    }
});

export const { setFiles, addFile, removeFile } = fileSlice.actions;
export default fileSlice.reducer;
