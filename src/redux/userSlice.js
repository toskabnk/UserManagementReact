import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem('state')) || {
    name: null,
    access_token: null,
    id: null,
    roles: null,
    isAuthenticated: false
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        addUser: (state, action) => {
            const {name, access_token, id, roles} = action.payload
            state.name = name;
            state.access_token = access_token;
            state.id = id;
            state.roles = roles;
            state.isAuthenticated = true;
            localStorage.setItem('state', JSON.stringify(state));
        },

        deleteUser: (state, action) => {
            state.name = null;
            state.access_token = null;
            state.id = null;
            state.roles = null;
            state.isAuthenticated = false;
            localStorage.setItem('state');
        }

    }
})

export const {addUser, deleteUser} = userSlice.actions;
export default userSlice.reducer;