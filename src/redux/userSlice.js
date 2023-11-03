import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem('state')) || {
    name: null,
    access_token: null,
    id: null,
    roles: null
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
            localStorage.setItem('state', JSON.stringify(state));
        },

        deleteUser: (state, action) => {
            state.name = null;
            state.access_token = null;
            state.id = null;
            state.roles = null;
            localStorage.removeItem('state');
        }

    }
})

export const {addUser, deleteUser} = userSlice.actions;
export default userSlice.reducer;