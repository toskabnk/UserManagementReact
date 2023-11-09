import React from 'react';
import { Routes as ReactRoutes, Route } from 'react-router-dom';
import Home from '../pages/Home'
import Users from '../pages/Users'
import Register from '../pages/Register'
import LoginPage from '../pages/Login'
import Logout from '../pages/Logout'
import User from '../pages/User'
import Roles from '../pages/Roles'
import Organizations from '../pages/Organizations'
import CreateUser from '../pages/CreateUser';
import EditUser from '../pages/EditUser';

const Routes = () => {
    return (
        <ReactRoutes>
            <Route path="/user" element={<User/> } />
            <Route path="/users" element={<Users/> } />
            <Route path="/roles" element={<Roles/> } />
            <Route path="/organizations" element={<Organizations/> } /> 
            <Route path="/register" element={<Register/> } />
            <Route path="/login" element={<LoginPage/> } />
            <Route path="/logout" element={<Logout/> } />
            <Route path="/createUser" element={<CreateUser/> }/>
            <Route path="/editUser" element={<EditUser/> }/>
            <Route path="*" element={<Home/> } /> 
        </ReactRoutes>
    )
};

export default Routes;