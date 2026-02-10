import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    files: [],
};

const fileSlice = createSlice({
    name: "file",
    initialState,
    reducers: {
        setFiles: (state, action) => {
            console.log("Setting files in Redux:", action.payload);
            state.files = Array.isArray(action.payload) ? action.payload : [];
        },
        addFile: (state, action) => {
            state.files.push(action.payload);
        },
        updateFile: (state, action) => { 
            const index = state.files.findIndex(f => f._id === action.payload._id);
            if (index !== -1) {
                state.files[index] = action.payload;
            }
        },
        removeFile: (state, action) => {
            state.files = state.files.filter(file => file._id !== action.payload);
        },
    }
});

export const { setFiles, addFile, updateFile, removeFile } = fileSlice.actions;
export default fileSlice.reducer;