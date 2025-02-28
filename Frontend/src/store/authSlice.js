import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    status: false,
    userData:null,
    storage:null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload; 
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
            state.storage = null; 
        },
        setStorage: (state, action) => {
            state.storage = action.payload; 
        },
    }
})

export const { login, logout, setStorage } = authSlice.actions;

export default authSlice.reducer;